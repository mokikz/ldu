'use strict';
// JS module pattern
// eslint-disable-next-line no-undef, no-var
var LernDieUhr = window.LernDieUhr || {};

LernDieUhr.LevelMap = (function () {
  var canvas, ctx, model;
  var dragonImg;
  var scrollY = 0;
  var targetScrollY = 0;
  var animFrameId = null;
  var onContinueCallback = null;
  var worldCompleted = false;
  var doorAngle = 0;
  var doorAnimDone = false;
  var canContinue = false;
  var stars = [];

  var NODE_SPACING = 110;
  var NODE_RADIUS = 22;
  var DRAGON_SIZE = 56;
  var DOOR_W = 64;
  var DOOR_H = 88;

  // --- drawing helpers ---

  function drawBackground() {
    var grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#0a0520');
    grad.addColorStop(1, '#1a0a3a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function drawStars() {
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    for (var i = 0; i < stars.length; i++) {
      ctx.beginPath();
      ctx.arc(stars[i].x, stars[i].y, stars[i].r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initStars() {
    stars = [];
    for (var i = 0; i < 60; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3
      });
    }
  }

  function getNodeX(i, numLevels, cx) {
    // zigzag: even indices left, odd indices right
    var offset = Math.min(cx * 0.35, 80);
    return i % 2 === 0 ? cx - offset : cx + offset;
  }

  function getNodeY(i, baseY) {
    return baseY - i * NODE_SPACING;
  }

  function drawPath(numLevels, cx, baseY) {
    ctx.strokeStyle = 'rgba(200,170,100,0.5)';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    for (var i = 0; i <= numLevels; i++) {
      var x = getNodeX(i, numLevels, cx);
      var y = getNodeY(i, baseY);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    // extend to door
    var doorX = cx;
    var doorY = getNodeY(numLevels, baseY) - NODE_SPACING;
    ctx.lineTo(doorX, doorY + DOOR_H);
    ctx.stroke();
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
      ctx.lineTo(
        x + Math.cos(rot) * outerRadius,
        y + Math.sin(rot) * outerRadius
      );
      rot += step;
      ctx.lineTo(
        x + Math.cos(rot) * innerRadius,
        y + Math.sin(rot) * innerRadius
      );
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
    ctx.fillStyle = '#333355';
    ctx.fill();
    ctx.strokeStyle = '#555577';
    ctx.lineWidth = 2;
    ctx.stroke();
    // padlock icon
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

  function drawDragon(x, y) {
    // node highlight ring
    ctx.beginPath();
    ctx.arc(x, y, NODE_RADIUS + 6, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(100,200,255,0.7)';
    ctx.lineWidth = 3;
    ctx.stroke();
    // draw dragon centered above the node
    var imgY = y - DRAGON_SIZE - NODE_RADIUS + 8;
    ctx.drawImage(dragonImg, x - DRAGON_SIZE / 2, imgY, DRAGON_SIZE, DRAGON_SIZE);
  }

  function drawDoor(x, y, angle) {
    var fw = DOOR_W + 12;
    var fh = DOOR_H + 8;
    // golden glow behind door when opening
    if (angle > Math.PI / 5) {
      var glow = ctx.createRadialGradient(x, y, 0, x, y, DOOR_W);
      var alpha = Math.min(1, (angle - Math.PI / 5) / (Math.PI / 4));
      glow.addColorStop(0, 'rgba(255,220,50,' + (alpha * 0.9) + ')');
      glow.addColorStop(1, 'rgba(255,150,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(x - DOOR_W, y - DOOR_H - 10, DOOR_W * 2, DOOR_H + 20);
    }

    // door frame
    ctx.fillStyle = '#5C3317';
    ctx.fillRect(x - fw / 2, y - fh, fw, fh);

    // arch top of frame
    ctx.beginPath();
    ctx.arc(x, y - fh, fw / 2, Math.PI, 0);
    ctx.fillStyle = '#5C3317';
    ctx.fill();

    // left door panel (rotates outward around its left edge)
    ctx.save();
    ctx.translate(x - DOOR_W / 2, y - DOOR_H);
    // perspective: skew x as angle increases
    var skew = Math.sin(angle) * 0.6;
    ctx.transform(Math.cos(angle), 0, -skew, 1, 0, 0);
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 0, DOOR_W / 2, DOOR_H);
    // panel lines
    ctx.strokeStyle = '#6B3410';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(4, 4, DOOR_W / 2 - 8, DOOR_H / 2 - 8);
    ctx.strokeRect(4, DOOR_H / 2 + 4, DOOR_W / 2 - 8, DOOR_H / 2 - 12);
    ctx.restore();

    // right door panel (rotates outward around its right edge)
    ctx.save();
    ctx.translate(x + DOOR_W / 2, y - DOOR_H);
    ctx.transform(Math.cos(angle), 0, skew, 1, 0, 0);
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(-DOOR_W / 2, 0, DOOR_W / 2, DOOR_H);
    // panel lines
    ctx.strokeStyle = '#6B3410';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-DOOR_W / 2 + 4, 4, DOOR_W / 2 - 8, DOOR_H / 2 - 8);
    ctx.strokeRect(-DOOR_W / 2 + 4, DOOR_H / 2 + 4, DOOR_W / 2 - 8, DOOR_H / 2 - 12);
    // door handle on right panel
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(-8, DOOR_H / 2, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawClosedDoor(x, y) {
    var fw = DOOR_W + 12;
    var fh = DOOR_H + 8;

    // door frame
    ctx.fillStyle = '#5C3317';
    ctx.fillRect(x - fw / 2, y - fh, fw, fh);
    ctx.beginPath();
    ctx.arc(x, y - fh, fw / 2, Math.PI, 0);
    ctx.fillStyle = '#5C3317';
    ctx.fill();

    // door
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x - DOOR_W / 2, y - DOOR_H, DOOR_W, DOOR_H);
    ctx.strokeStyle = '#6B3410';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x - DOOR_W / 2 + 4, y - DOOR_H + 4, DOOR_W / 2 - 8, DOOR_H / 2 - 8);
    ctx.strokeRect(x + 4, y - DOOR_H + 4, DOOR_W / 2 - 8, DOOR_H / 2 - 8);
    ctx.strokeRect(x - DOOR_W / 2 + 4, y - DOOR_H / 2 + 4, DOOR_W / 2 - 8, DOOR_H / 2 - 12);
    ctx.strokeRect(x + 4, y - DOOR_H / 2 + 4, DOOR_W / 2 - 8, DOOR_H / 2 - 12);

    // lock
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
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
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(0, 0, canvas.width, 54);
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold ' + Math.min(26, canvas.width / 14) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(worldName, canvas.width / 2, 27);
  }

  function drawContinueHint() {
    ctx.font = '18px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillText('Tippe um weiterzuspielen', canvas.width / 2, canvas.height - 8);
  }

  // --- main render ---

  function render(timestamp) {
    var worldIndex = model.getValue('currentWorld');
    // When world just completed, model already advanced to new world.
    // We track the world to display via displayWorldIndex set in show().
    worldIndex = displayWorldIndex;

    var currentLevel = model.getValue('currentLevel');
    // When worldCompleted, the completed level was the last of the old world.
    // displayCompletedLevel holds the index of the just-finished level.
    var completedLevelIndex = displayCompletedLevel;

    // eslint-disable-next-line no-undef
    var worldData = levels[worldIndex];
    var numLevels = worldData.levels.length;
    var cx = canvas.width / 2;

    // virtual map: node 0 at bottom, last node at top; door above last node
    var virtualHeight = (numLevels + 2) * NODE_SPACING + DOOR_H + 20;
    var baseY = virtualHeight - NODE_SPACING; // y of node 0 in virtual space

    // target scroll: keep dragon node vertically centered
    var dragonVirtualY = getNodeY(completedLevelIndex, baseY);
    targetScrollY = virtualHeight - canvas.height / 2 - dragonVirtualY;
    // clamp scroll
    var maxScroll = virtualHeight - canvas.height;
    if (targetScrollY < 0) targetScrollY = 0;
    if (targetScrollY > maxScroll) targetScrollY = maxScroll;

    // ease scroll
    scrollY += (targetScrollY - scrollY) * 0.08;

    // background (fixed)
    drawBackground();
    drawStars();

    // scrolled content
    ctx.save();
    ctx.translate(0, canvas.height - virtualHeight + scrollY);

    drawPath(numLevels, cx, baseY);

    // level nodes
    for (var i = 0; i < numLevels; i++) {
      var nx = getNodeX(i, numLevels, cx);
      var ny = getNodeY(i, baseY);
      if (i < completedLevelIndex) {
        drawGoldStar(nx, ny, NODE_RADIUS);
      } else if (i === completedLevelIndex) {
        drawGoldStar(nx, ny, NODE_RADIUS);
        drawDragon(nx, ny);
      } else {
        drawLockedNode(nx, ny);
      }
    }

    // door at top
    var doorX = cx;
    var doorY = getNodeY(numLevels, baseY) - NODE_SPACING + DOOR_H;

    if (worldCompleted) {
      drawDoor(doorX, doorY, doorAngle);
    } else {
      drawClosedDoor(doorX, doorY);
    }

    ctx.restore();

    // fixed UI on top
    drawTitle(worldData.world);
    if (canContinue) {
      drawContinueHint();
    }

    // door animation
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
  };

  LevelMap.prototype.show = function (config) {
    worldCompleted = config.worldCompleted || false;
    onContinueCallback = config.onContinue || null;

    // If world was completed, model.currentWorld already points to the NEW world,
    // and model.currentLevel is 0 (first level of new world).
    // We display the OLD world's map with the last completed level.
    if (worldCompleted) {
      displayWorldIndex = config.completedWorldIndex;
      displayCompletedLevel = config.completedLevelIndex;
    } else {
      displayWorldIndex = model.getValue('currentWorld');
      // currentLevel was just advanced to next level by loadLevel(),
      // so subtract 1 to get the just-completed level.
      displayCompletedLevel = model.getValue('currentLevel') - 1;
      if (displayCompletedLevel < 0) displayCompletedLevel = 0;
    }

    doorAngle = 0;
    doorAnimDone = false;
    canContinue = !worldCompleted; // immediate tap if no door anim

    // resize canvas to match display
    canvas.width = canvas.offsetWidth || window.innerWidth;
    canvas.height = canvas.offsetHeight || window.innerHeight;
    initStars();

    // reset scroll to bottom so dragon is visible
    var worldData = levels[displayWorldIndex]; // eslint-disable-line no-undef
    var numLevels = worldData.levels.length;
    var virtualHeight = (numLevels + 2) * NODE_SPACING + DOOR_H + 20;
    var baseY = virtualHeight - NODE_SPACING;
    var dragonVirtualY = getNodeY(displayCompletedLevel, baseY);
    scrollY = virtualHeight - canvas.height / 2 - dragonVirtualY;
    if (scrollY < 0) scrollY = 0;

    var overlay = document.getElementById('LevelMap');
    overlay.style.display = 'block';

    if (animFrameId) {
      window.cancelAnimationFrame(animFrameId);
    }
    animFrameId = window.requestAnimationFrame(render);

    // tap / click to continue
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
    if (onContinueCallback) {
      onContinueCallback();
    }
  }

  return LevelMap;
})();
