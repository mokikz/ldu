'use strict';
// JS module pattern
// eslint-disable-next-line no-undef, no-var
var LernDieUhr = window.LernDieUhr || {};

LernDieUhr.LevelMap = (function () {
  var canvas, ctx, model;
  var dragonImg, walkImg, bgImg;
  var scrollY = 0;
  var targetScrollY = 0;
  var animFrameId = null;
  var onContinueCallback = null;
  var worldCompleted = false;
  var preGame = false;
  var doorAngle = 0;
  var doorAnimDone = false;
  var canContinue = false;

  var NODE_RADIUS = 22;
  var DRAGON_SIZE = 60;
  var DOOR_W = 64;
  var DOOR_H = 88;

  // Sprite animation state (tutorial algorithm: curFrame = ++curFrame % frameCount)
  var WALK_FRAME_COUNT = 4;    // simulated frames: stride right, rise, stride left, fall
  var WALK_INTERVAL   = 130;   // ms per frame (like setInterval in the tutorial)
  var walkCurFrame    = 0;
  var walkLastTime    = 0;

  // Per-frame walk offsets applied to the single sprite image
  // [bobY, flip] — flip mirrors the image to simulate opposite stride
  var WALK_FRAMES = [
    {bob:  0, flip: false},
    {bob: -5, flip: false},
    {bob:  0, flip: true },
    {bob: -5, flip: true }
  ];

  // Level node positions in original image pixel coordinates (index 0 = first level)
  var NODE_POSITIONS = [
    {x: 1080, y: 1520},
    {x:  716, y: 1438},
    {x:  558, y: 1266},
    {x:  218, y: 1224},
    {x:  152, y: 1026},
    {x:  446, y: 1048},
    {x:  720, y:  990},
    {x: 1022, y:  864},
    {x:  808, y:  696},
    {x:  708, y:  562},
    {x:  138, y:  480},
    {x:  268, y:  318},
    {x:  558, y:  348},
    {x:  828, y:  244},
    {x:  996, y:  115}
  ];

  // --- coordinate helpers ---

  function getScale() {
    if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
      return canvas.width / bgImg.naturalWidth;
    }
    return 1;
  }

  function getVirtualHeight() {
    if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
      return bgImg.naturalHeight * getScale();
    }
    return canvas.height;
  }

  function nodeCanvas(i) {
    var s = getScale();
    return {x: NODE_POSITIONS[i].x * s, y: NODE_POSITIONS[i].y * s};
  }

  // --- drawing ---

  function drawBackground(virtualHeight) {
    if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
      ctx.drawImage(bgImg, 0, 0, canvas.width, virtualHeight);
    } else {
      var grad = ctx.createLinearGradient(0, 0, 0, virtualHeight);
      grad.addColorStop(0, '#0a0520');
      grad.addColorStop(1, '#1a0a3a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, virtualHeight);
    }
  }

  function drawPath(numNodes, completedIndex) {
    if (numNodes < 2) return;

    // Shadow / outline for legibility against the background
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Dark outline
    ctx.beginPath();
    var p0 = nodeCanvas(0);
    ctx.moveTo(p0.x, p0.y);
    for (var i = 1; i < numNodes; i++) {
      var p = nodeCanvas(i);
      ctx.lineTo(p.x, p.y);
    }
    ctx.strokeStyle = 'rgba(80,0,0,0.7)';
    ctx.lineWidth = 10;
    ctx.stroke();

    // Completed segment — bright red
    if (completedIndex >= 1) {
      ctx.beginPath();
      ctx.moveTo(nodeCanvas(0).x, nodeCanvas(0).y);
      for (var j = 1; j <= completedIndex; j++) {
        var pc = nodeCanvas(j);
        ctx.lineTo(pc.x, pc.y);
      }
      ctx.strokeStyle = 'rgba(220,30,30,0.95)';
      ctx.lineWidth = 6;
      ctx.stroke();
    }

    // Upcoming segment — dimmer red
    if (completedIndex < numNodes - 1) {
      ctx.beginPath();
      var start = nodeCanvas(completedIndex);
      ctx.moveTo(start.x, start.y);
      for (var k = completedIndex + 1; k < numNodes; k++) {
        var pn = nodeCanvas(k);
        ctx.lineTo(pn.x, pn.y);
      }
      ctx.strokeStyle = 'rgba(180,60,60,0.5)';
      ctx.lineWidth = 4;
      ctx.setLineDash([8, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  function drawGoldStar(x, y, radius) {
    var spikes = 5;
    var outerRadius = radius;
    var innerRadius = radius * 0.45;
    var rot = (Math.PI / 2) * 3;
    var step = Math.PI / spikes;
    ctx.beginPath();
    ctx.moveTo(x, y - outerRadius);
    for (var i = 0; i < spikes; i++) {
      ctx.lineTo(x + Math.cos(rot) * outerRadius, y + Math.sin(rot) * outerRadius);
      rot += step;
      ctx.lineTo(x + Math.cos(rot) * innerRadius, y + Math.sin(rot) * innerRadius);
      rot += step;
    }
    ctx.lineTo(x, y - outerRadius);
    ctx.closePath();
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  function drawLockedNode(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, NODE_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(30,20,60,0.7)';
    ctx.fill();
    ctx.strokeStyle = '#555577';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y - 5, 7, Math.PI, 0);
    ctx.stroke();
    ctx.fillStyle = '#888';
    ctx.fillRect(x - 7, y - 5, 14, 12);
    ctx.fillStyle = '#555';
    ctx.beginPath();
    ctx.arc(x, y + 1, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  function updateWalkFrame(timestamp) {
    // Tutorial algorithm: advance curFrame when interval has elapsed
    if (timestamp - walkLastTime >= WALK_INTERVAL) {
      walkCurFrame = (walkCurFrame + 1) % WALK_FRAME_COUNT;
      walkLastTime = timestamp;
    }
  }

  function drawDragon(x, y, timestamp) {
    // Glow ring behind dragon
    ctx.beginPath();
    ctx.arc(x, y, NODE_RADIUS + 6, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(100,200,255,0.7)';
    ctx.lineWidth = 3;
    ctx.stroke();

    updateWalkFrame(timestamp || 0);

    var frame = WALK_FRAMES[walkCurFrame];
    var img = (walkImg && walkImg.complete && walkImg.naturalWidth > 0) ? walkImg : dragonImg;

    // Position: sit above the node circle
    var imgX = x - DRAGON_SIZE / 2;
    var imgY = y - DRAGON_SIZE - NODE_RADIUS + 8 + frame.bob;

    ctx.save();
    if (frame.flip) {
      // Mirror horizontally around the dragon's center x (tutorial: srcX selects column; here we flip)
      ctx.translate(x * 2, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(img, imgX, imgY, DRAGON_SIZE, DRAGON_SIZE);
    ctx.restore();
  }

  function drawDoor(x, y, angle) {
    var fw = DOOR_W + 12;
    var fh = DOOR_H + 8;
    if (angle > Math.PI / 5) {
      var alpha = Math.min(1, (angle - Math.PI / 5) / (Math.PI / 4));
      var glow = ctx.createRadialGradient(x, y, 0, x, y, DOOR_W);
      glow.addColorStop(0, 'rgba(255,220,50,' + (alpha * 0.9) + ')');
      glow.addColorStop(1, 'rgba(255,150,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(x - DOOR_W, y - DOOR_H - 10, DOOR_W * 2, DOOR_H + 20);
    }
    ctx.fillStyle = '#5C3317';
    ctx.fillRect(x - fw / 2, y - fh, fw, fh);
    ctx.beginPath();
    ctx.arc(x, y - fh, fw / 2, Math.PI, 0);
    ctx.fillStyle = '#5C3317';
    ctx.fill();
    ctx.save();
    ctx.translate(x - DOOR_W / 2, y - DOOR_H);
    var skew = Math.sin(angle) * 0.6;
    ctx.transform(Math.cos(angle), 0, -skew, 1, 0, 0);
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 0, DOOR_W / 2, DOOR_H);
    ctx.strokeStyle = '#6B3410'; ctx.lineWidth = 1.5;
    ctx.strokeRect(4, 4, DOOR_W / 2 - 8, DOOR_H / 2 - 8);
    ctx.strokeRect(4, DOOR_H / 2 + 4, DOOR_W / 2 - 8, DOOR_H / 2 - 12);
    ctx.restore();
    ctx.save();
    ctx.translate(x + DOOR_W / 2, y - DOOR_H);
    ctx.transform(Math.cos(angle), 0, skew, 1, 0, 0);
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(-DOOR_W / 2, 0, DOOR_W / 2, DOOR_H);
    ctx.strokeStyle = '#6B3410'; ctx.lineWidth = 1.5;
    ctx.strokeRect(-DOOR_W / 2 + 4, 4, DOOR_W / 2 - 8, DOOR_H / 2 - 8);
    ctx.strokeRect(-DOOR_W / 2 + 4, DOOR_H / 2 + 4, DOOR_W / 2 - 8, DOOR_H / 2 - 12);
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(-8, DOOR_H / 2, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawClosedDoor(x, y) {
    var fw = DOOR_W + 12;
    var fh = DOOR_H + 8;
    ctx.fillStyle = '#5C3317';
    ctx.fillRect(x - fw / 2, y - fh, fw, fh);
    ctx.beginPath();
    ctx.arc(x, y - fh, fw / 2, Math.PI, 0);
    ctx.fillStyle = '#5C3317';
    ctx.fill();
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x - DOOR_W / 2, y - DOOR_H, DOOR_W, DOOR_H);
    ctx.strokeStyle = '#6B3410'; ctx.lineWidth = 1.5;
    ctx.strokeRect(x - DOOR_W / 2 + 4, y - DOOR_H + 4, DOOR_W / 2 - 8, DOOR_H / 2 - 8);
    ctx.strokeRect(x + 4, y - DOOR_H + 4, DOOR_W / 2 - 8, DOOR_H / 2 - 8);
    ctx.strokeRect(x - DOOR_W / 2 + 4, y - DOOR_H / 2 + 4, DOOR_W / 2 - 8, DOOR_H / 2 - 12);
    ctx.strokeRect(x + 4, y - DOOR_H / 2 + 4, DOOR_W / 2 - 8, DOOR_H / 2 - 12);
    ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y - DOOR_H / 2 - 5, 6, Math.PI, 0);
    ctx.stroke();
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(x - 6, y - DOOR_H / 2 - 5, 12, 10);
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.arc(x, y - DOOR_H / 2, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawTitle(worldName) {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, canvas.width, 54);
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold ' + Math.min(26, canvas.width / 14) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(worldName, canvas.width / 2, 27);
  }

  function drawContinueHint() {
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    var text = preGame ? 'Tippe um zu spielen' : 'Tippe um weiterzuspielen';
    var x = canvas.width / 2;
    var y = canvas.height - 8;
    ctx.strokeStyle = 'rgba(0,0,0,0.9)';
    ctx.lineWidth = 4;
    ctx.lineJoin = 'round';
    ctx.strokeText(text, x, y);
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.fillText(text, x, y);
  }

  // --- main render ---

  function render(timestamp) {
    // eslint-disable-next-line no-undef
    var worldData = levels[displayWorldIndex];
    var numLevels = worldData.levels.length;
    // Clamp to available node positions
    var numNodes = Math.min(numLevels, NODE_POSITIONS.length);
    var completedIndex = Math.min(displayCompletedLevel, numNodes - 1);

    var virtualHeight = getVirtualHeight();
    var maxScroll = Math.max(0, virtualHeight - canvas.height);

    // Scroll toward dragon node
    var dragonPos = nodeCanvas(completedIndex);
    targetScrollY = virtualHeight - canvas.height / 2 - dragonPos.y;
    if (targetScrollY < 0) targetScrollY = 0;
    if (targetScrollY > maxScroll) targetScrollY = maxScroll;
    scrollY += (targetScrollY - scrollY) * 0.08;

    // --- scrolled content ---
    ctx.save();
    ctx.translate(0, canvas.height - virtualHeight + scrollY);

    drawBackground(virtualHeight);
    drawPath(numNodes, completedIndex);

    // Level nodes (path drawn first so nodes sit on top)
    for (var i = 0; i < numNodes; i++) {
      var p = nodeCanvas(i);
      if (i < completedIndex) {
        drawGoldStar(p.x, p.y, NODE_RADIUS);
      } else if (i === completedIndex) {
        if (!preGame) drawGoldStar(p.x, p.y, NODE_RADIUS); // no star before playing
        drawDragon(p.x, p.y, timestamp);
      } else {
        drawLockedNode(p.x, p.y);
      }
    }

    // Door above the last node
    var lastP = nodeCanvas(numNodes - 1);
    var doorX = lastP.x;
    var doorY = lastP.y - DRAGON_SIZE - NODE_RADIUS - 10;
    if (worldCompleted) {
      drawDoor(doorX, doorY, doorAngle);
    } else {
      drawClosedDoor(doorX, doorY);
    }

    ctx.restore();

    // --- fixed UI ---
    drawTitle(worldData.world);
    if (canContinue) drawContinueHint();

    // Door animation
    if (worldCompleted && !doorAnimDone) {
      var target = Math.PI / 2;
      doorAngle += (target - doorAngle) * 0.04;
      if (doorAngle > target - 0.01) {
        doorAngle = target;
        doorAnimDone = true;
        canContinue = true;
      }
    }

    animFrameId = window.requestAnimationFrame(render);
  }

  // --- public API ---

  var displayWorldIndex = 0;
  var displayCompletedLevel = 0;

  var LevelMap = function () {};

  LevelMap.prototype.init = function (_model) {
    model = _model;
    canvas = document.getElementById('levelMapCanvas');
    ctx = canvas.getContext('2d');
    dragonImg = new Image();
    dragonImg.src = '/images/mokikz_256.png';
    walkImg = new Image();
    walkImg.src = '/images/mokikz_walking_lr.png';
    bgImg = new Image();
    bgImg.src = '/images/background_levelmap.jpg';
  };

  LevelMap.prototype.show = function (config) {
    worldCompleted = config.worldCompleted || false;
    preGame = config.preGame || false;
    onContinueCallback = config.onContinue || null;

    if (preGame) {
      displayWorldIndex = model.getValue('currentWorld');
      displayCompletedLevel = model.getValue('currentLevel'); // level about to be played
    } else if (worldCompleted) {
      displayWorldIndex = config.completedWorldIndex;
      displayCompletedLevel = config.completedLevelIndex;
    } else {
      displayWorldIndex = model.getValue('currentWorld');
      displayCompletedLevel = model.getValue('currentLevel') - 1;
      if (displayCompletedLevel < 0) displayCompletedLevel = 0;
    }

    doorAngle = 0;
    doorAnimDone = false;
    canContinue = preGame || !worldCompleted;

    var overlay = document.getElementById('LevelMap');
    overlay.style.display = 'block';
    canvas.width  = canvas.offsetWidth  || window.innerWidth;
    canvas.height = canvas.offsetHeight || window.innerHeight;

    // Set initial scroll immediately (no easing jump)
    var numLevels = levels[displayWorldIndex].levels.length; // eslint-disable-line no-undef
    var numNodes = Math.min(numLevels, NODE_POSITIONS.length);
    var idx = Math.min(displayCompletedLevel, numNodes - 1);
    var virtualHeight = getVirtualHeight();
    var dragonPos = nodeCanvas(idx);
    var maxScroll = Math.max(0, virtualHeight - canvas.height);
    scrollY = virtualHeight - canvas.height / 2 - dragonPos.y;
    if (scrollY < 0) scrollY = 0;
    if (scrollY > maxScroll) scrollY = maxScroll;
    targetScrollY = scrollY;

    if (animFrameId) window.cancelAnimationFrame(animFrameId);
    animFrameId = window.requestAnimationFrame(render);

    overlay.addEventListener('click', handleContinue, false);
    overlay.addEventListener('touchend', handleContinue, false);
  };

  LevelMap.prototype.hide = function () {
    var overlay = document.getElementById('LevelMap');
    overlay.style.display = 'none';
    overlay.removeEventListener('click', handleContinue, false);
    overlay.removeEventListener('touchend', handleContinue, false);
    if (animFrameId) {
      window.cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
  };

  function handleContinue(e) {
    e.preventDefault();
    if (!canContinue) return;
    if (onContinueCallback) onContinueCallback();
  }

  return LevelMap;
})();
