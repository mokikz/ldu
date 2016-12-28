(function(g) {
    function e(a, b, c, d, f, e, g, i) {
        this.startX = a;
        this.startY = b;
        this.owner = g;
        this.spritesheet = i;
        this.targetX = c;
        this.targetY = d;
        this.dx = this.startX;
        this.dy = this.startY;
        this.distance = 0;
        this.speed = f;
        this.currentTick = this.ratioY = this.ratioX = 0;
        this.targetCity = e;
        this.emitter;
        this.initialize()
    }
    e.ENEMY_MISSILE = 1;
    e.FRIENDLY_MISSILE = 0;
    e.prototype = {
        sprite: null,
        dx: null,
        dy: null,
        distance: null,
        speed: null,
        currentTick: null,
        friendly: null,
        position: null,
        targetCity: null,
        value: null,
        ssb: null,
        missile: null,
        split: null,
        container: null,
        particleList: null,
        emitter: null,
        tickCount: null,
        explosion: null,
        spritesheet: null,
        nose: null,
        tail: null,
        exposionPosition: null,
        initialize: function() {
            this.value = 5;
            this.sprite = new Shape;
            this.container = new Container;
            this.split = -1;
            this.tickCount = 0;
            this.particleProps = {
                speed: 0.1,
                decay: 0.95,
                life: 1,
                rotation: !0,
                gravity: 0,
                minScale: 0.2,
                maxScale: 2,
                angle: 0,
                spread: 0,
                variation: null,
                stretchFactor: null,
                scaleDecay: 1,
                addOnBottom: !0
            };
            var a = new BitmapAnimation(this.spritesheet);
            a.regX = 30;
            a.regY = 31;
            a.gotoAndStop("smoulderparticle_medium");
            this.particleList = [a];
            this.exposionPosition = new Point;
            this.width = 12;
            this.height = 30;
            this.missile = new BitmapAnimation(this.spritesheet);
            "enemy" == this.owner ? this.missile.gotoAndPlay("incomingbomb") : this.missile.gotoAndStop("missile");
            this.container.addChild(this.sprite);
            this.container.addChild(this.missile);
            this.nose = new Shape;
            a = this.nose.graphics;
            a.setStrokeStyle(1);
            a.beginFill("#FF0099");
            a.drawCircle(0, 0, 5);
            a.endFill();
            this.container.addChild(this.nose);
            this.tail = new Shape;
            a = this.tail.graphics;
            a.setStrokeStyle(1);
            a.beginFill("#3281FF");
            a.drawCircle(0, 0, 5);
            a.endFill();
            this.container.addChild(this.tail);
            this.nose.alpha = 0;
            this.tail.alpha = 0;
            this.friendly = !1;
            this.dx = this.targetX - this.startX;
            this.dy = this.targetY - this.startY;
            this.position = new Point;
            this.distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
            a = Math.atan2(this.dy, this.dx);
            this.ratioX = Math.cos(a);
            this.ratioY = Math.sin(a)
        },
        hit: function(a) {
            !a && null != this.container.getStage() && (this.particleProps.spread = 360, this.particleProps.speed = 0.5, this.particleProps.minScale =
                0.8, this.particleProps.maxScale = 1.25, this.emitter.emitMultiple({
                    x: this.exposionPosition.x,
                    y: this.exposionPosition.y
                }, 3, this.particleProps, this.particleList))
        },
        run: function() {
            null != this.container.getStage() && (!this.emitter && this.container.getStage()) && (this.emitter = new GameLibs.ParticleEmitter(this.container.getStage()))
        }
    };
    g.currentGame.Missile = e
})(window.Atari);
(function(g) {
    function e(a, b, c, d, f, e, g) {
        this.startX = a;
        this.startY = b;
        this.currentTick = 0;
        this.mag = f || 45;
        this.duration = d || 11;
        this.radius = c || 10;
        this.color = e || "#FFFFFF";
        this.depth = g || 0;
        this.initialize()
    }
    e.prototype = {
        sprite: null,
        initialize: function() {
            this.sprite = new Shape;
            this.sprite.alpha = 0.4
        },
        run: function() {}
    };
    g.currentGame.Explosion = e
})(window.Atari);
(function(g) {
    function e(a, b, c, d) {
        this.pt = a;
        this.name = b;
        this.index = d;
        this.spritesheet = c;
        this.initialize()
    }
    e.FIRE = 2;
    e.EMPTY = 1;
    e.READY = 0;
    e.GREEN_LIGHT = 1;
    e.RED_LIGHT = 0;
    e.LIVE = 0;
    e.DEAD = 1;
    e.RED_COLOR = "#C34f4E";
    e.GREEN_COLOR = "#9CC34E";
    e.YELLOW_COLOR = "#BDC34E";
    e.BLUE_COLOR = "#3281FF";
    e.WAIT_TIME = 2500;
    e.WAIT_TIME_SHORT = 2500;
    e.prototype = {
        sprite: null,
        prevTime: null,
        timeStep: null,
        rapidFireT: null,
        rapidFireTMax: null,
        targetTime: null,
        weaponEnergy: null,
        weaponDead: null,
        weaponMaxedEnergy: null,
        rotationOn: null,
        bar: null,
        track: null,
        hitArea: null,
        bg: null,
        barrel: null,
        light: null,
        width: null,
        height: null,
        lightContainer: null,
        lightGreenContainer: null,
        ssb: null,
        pivotssb: null,
        ba: null,
        cover: null,
        extra: null,
        type: null,
        isKilled: null,
        targetArea: null,
        vx: null,
        vy: null,
        turnOn: null,
        stuns: null,
        stun: null,
        stunssb: null,
        numTicks: null,
        timer: null,
        isFirst: null,
        data: null,
        initialize: function() {
            this.timeStep = 0.25;
            this.rapidFireTMax = this.rapidFireT = 0;
            this.targetTime = 42;
            this.weaponEnergy = 0;
            this.weaponDead = !1;
            this.weaponMaxedEnergy = 0;
            this.rotationOn = !1;
            this.sprite = new Container;
            this.isKilled = !1;
            this.type = "Battery";
            this.vx = this.vy = 0;
            this.turnOn = !0;
            this.numTicks = 0;
            this.timer = 2;
            this.isFirst = !0;
            this.index;
            this.draw()
        },
        draw: function() {
            this.barrel = new BitmapAnimation(this.spritesheet);
            this.spritesheet._data.turret_fire.frequency = 2;
            this.barrel.gotoAndStop("turret_idle");
            this.pivot = new BitmapAnimation(this.spritesheet);
            this.pivot.gotoAndStop("turretbase_" + this.index);
            this.stun = new BitmapAnimation(this.spritesheet);
            this.stun.onAnimationEnd = Atari.proxy(this.handleStunComplete,
                this);
            this.stun.gotoAndPlay("TurretZap");
            this.stun.alpha = 0;
            this.width = this.sprite.width = 113;
            this.height = this.sprite.height = 110;
            this.hitArea = new Shape;
            var a = this.hitArea.graphics;
            a.setStrokeStyle(1);
            a.beginFill("#3281ff");
            a.drawCircle(0, 0, 5);
            a.endFill();
            this.pivot.x = 60;
            this.pivot.y = 128;
            this.track = new Shape;
            a = this.track.graphics;
            a.setStrokeStyle(1);
            a.beginFill("#9cc34e");
            a.drawRect(0, 0, 32, 2);
            a.endFill();
            this.track.x = 43;
            this.track.y = 127;
            this.stun.x = 50;
            this.stun.y = 25;
            this.sprite.addChild(this.barrel);
            this.sprite.addChild(this.pivot);
            this.sprite.addChild(this.track);
            this.sprite.addChild(this.stun);
            this.sprite.addChild(this.hitArea);
            this.sprite.x = this.pt.x;
            this.sprite.y = this.pt.y;
            this.hitArea.alpha = 0;
            this.barrel.x = this.width / 2 + 2;
            this.barrel.y = this.height - 5;
            this.hitArea.x = this.barrel.x;
            this.hitArea.y = this.barrel.y - 50;
            this.stun.x = this.barrel.x + 40;
            this.stun.y = this.barrel.y + 10;
            this.stun.rotation = 90
        },
        handleStunComplete: function() {},
        fire: function(a) {
            this.numTicks += 1 * a;
            if (this.numTicks > this.timer || this.isFirst) {
                this.isFirst = !1;
                if (this.isKilled || this.isDead && !this.turnOn) return !1;
                if (this.weaponDead) return Tween.get(this.barrel).wait(e.WAIT_TIME).call(this.emptyComplete, null, this), !1;
                this.barrel.gotoAndPlay("turret_fire");
                this.barrel.onAnimationEnd = Atari.proxy(this.fireComplete, this);
                Tween.get(this.barrel).wait(e.WAIT_TIME).call(this.fireComplete, null, this);
                0 >= this.rapidFireT && (this.weaponEnergy += 15);
                100 <= this.weaponEnergy && (this.weaponMaxedEnergy = this.weaponEnergy, Tween.get(this.barrel).wait(e.WAIT_TIME).call(this.emptyComplete,
                    null, this), this.weaponDead = !0);
                return !0
            }
            return !1
        },
        enableBattery: function(a) {
            this.turnOn = a
        },
        stunBattery: function(a) {
            this.stun.visible = !0;
            this.stunTime = a;
            this.turnOn = !1;
            this.isDead = !0;
            this.track.scaleX = 1;
            this.updateColor(e.BLUE_COLOR);
            this.stun.gotoAndPlay("TurretZap");
            this.stun.alpha = 1
        },
        indirectHit: function() {
            Atari.trace("*** indirect hit ***")
        },
        hit: function() {
            this.barrel.alpha = 0;
            this.track.alpha = 0;
            this.pivot.gotoAndStop("turretbase_4");
            this.isKilled = !0;
            this.stun.alpha = 0
        },
        restore: function() {
            this.barrel.alpha =
                1;
            this.track.alpha = 1;
            this.pivot.gotoAndStop("turretbase_" + this.index);
            this.isKilled = !1
        },
        emptyComplete: function() {},
        fireComplete: function() {
            this.barrel.gotoAndStop("turret_idle")
        },
        updateStatus: function() {
            if (this.turnOn) {
                var a = Math.min(1, 0.01 * this.weaponEnergy);
                this.track.scaleX = a;
                !this.weaponDead && !this.isDead ? 0.8 < a && 1 >= a ? this.updateColor(e.YELLOW_COLOR) : 0.6 < a && 0.8 > a ? this.updateColor(e.YELLOW_COLOR) : 0.4 < a && 0.6 > a ? this.updateColor(e.GREEN_COLOR) : 0.2 < a && 0.4 > a ? this.updateColor(e.GREEN_COLOR) : 0.1 < a && 0.2 >
                    a ? this.updateColor(e.GREEN_COLOR) : 0 == a && this.updateColor(e.GREEN_COLOR) : this.updateColor(e.RED_COLOR);
                0 < this.rapidFireT ? this.weaponEnergy = 0 : (this.weaponEnergy -= 2 * this.timeStep, 0 > this.weaponEnergy && (this.weaponEnergy = 0));
                this.weaponDead && 0 >= this.weaponEnergy && (this.weaponDead = !1)
            } else this.updateColor(e.BLUE_COLOR)
        },
        updateColor: function(a) {
            var b = this.track.graphics;
            b.clear();
            b.setStrokeStyle(1);
            b.beginFill(a);
            b.drawRect(0, 0, 32, 2);
            b.endFill()
        },
        toggleLights: function() {},
        stunComplete: function() {
            this.isDead = !1;
            this.turnOn = !0;
            this.stun.alpha = 0
        },
        tick: function(a, b) {
            0 <= this.stunTime && (this.stunTime--, 0 == this.stunTime && (this.track.scaleX = 1, Tween.get(this.track).to({
                scaleX: 0.5
            }, e.WAIT_TIME_SHORT).call(this.stunComplete, null, this)));
            this.prevTime && (this.timeStep = (Ticker.getTime() - this.prevTime) / this.targetTime);
            prevTime = Ticker.getTime();
            this.rapidFireT -= 1 * this.timeStep;
            0 >= this.rapidFireT && (this.rapidFireTMax = 0);
            var c = this.sprite.globalToLocal(a, b);
            this.vx += 0.01 * (c.x - this.barrel.x);
            this.vy += 0.01 * (c.y - this.barrel.y);
            this.vx *= 0.9;
            this.vy *= 0.9;
            var c = Math.atan2(this.vy, this.vx),
                d = c * (180 / Math.PI) + 90;
            this.turnOn && (this.barrel.rotation = Math.max(-90, Math.min(d, 90)), this.hitArea.x = this.barrel.x + 42 * Math.cos(c), this.hitArea.y = this.barrel.y + 42 * Math.sin(c))
        }
    };
    g.currentGame.Battery = e
})(window.Atari);
(function(g) {
    function e(a, b, c) {
        this.spritesheet = a;
        this.pt = b;
        this.scale = c;
        this.initialize()
    }
    e.prototype = {
        sprite: null,
        running: null,
        width: null,
        height: null,
        isKilled: null,
        spritesheet: null,
        initialize: function() {
            this.isKilled = this.running = !1;
            this.draw()
        },
        draw: function() {
            var a = new BitmapAnimation(this.spritesheet);
            a.gotoAndStop("enemyturret");
            this.sprite = new Container;
            this.width = 22 * this.scale;
            this.height = 31 * this.scale;
            this.sprite.width = this.width * this.scale;
            this.sprite.height = this.height * this.scale;
            this.sprite.addChild(a);
            this.sprite.scaleX = this.sprite.scaleY = this.scale;
            this.sprite.regX = this.width / 2;
            this.sprite.regY = this.height;
            this.sprite.x = this.pt.x * this.scale;
            this.sprite.y = this.pt.y
        },
        update: function() {
            if (!this.running) {
                this.running = !0;
                var a = GameLibs.Math2.getRange(50, -50),
                    b = GameLibs.Math2.getRange(1200, 800);
                Tween.get(this.sprite).to({
                    rotation: a
                }, b).call(this.rotationComplete, null, this)
            }
        },
        hit: function() {
            this.isKilled || (this.sprite.visible = !1, this.isKilled = !0, this.running = !1)
        },
        rotationComplete: function() {
            this.running = !1
        }
    };
    g.currentGame.EnemyBattery = e
})(window.Atari);
(function(g) {
    function e(a, b, c, d) {
        this.name = a;
        this.flip = c;
        this.pt = b;
        this.spritesheet = d;
        this.initialize()
    }
    e.NORMAL = 0;
    e.LIGHT_DAMAGE = 1;
    e.MODERATE_DAMAGE = 2;
    e.MODERATE_DAMAGE2 = 3;
    e.DEAD = 4;
    e.prototype = {
        sprite: null,
        images: null,
        smokeImages: null,
        width: null,
        height: null,
        pt: null,
        flip: null,
        citySprite: null,
        ssb: null,
        type: null,
        hitArea: null,
        bg: null,
        damageLevel: null,
        particleProps: null,
        particleList: null,
        emitter: null,
        frameName: null,
        initialize: function() {
            this.particleProps = {
                speed: 0.1,
                decay: 0.95,
                life: 1,
                rotation: !0,
                gravity: 0,
                minScale: 0.5,
                maxScale: 1.5,
                angle: 0,
                spread: 0,
                variation: null,
                stretchFactor: null,
                scaleDecay: 1,
                addOnBottom: !0
            };
            this.drawLayout()
        },
        drawLayout: function() {
            this.type = "City";
            this.damageLevel = 1;
            this.isDead = !1;
            this.height = this.width = 125;
            this.frameName = "";
            this.frameName = "city4" == this.name ? "city1" : "city5" == this.name ? "city2" : "city6" == this.name ? "city3" : this.name;
            this.hitArea = new Shape;
            this.bg = new Shape;
            var a = this.hitArea.graphics,
                a = this.bg.graphics;
            a.setStrokeStyle(1);
            a.beginFill("#FFFFFF");
            a.drawRect(0, 0, 113, 100);
            a.endFill();
            a = this.hitArea.graphics;
            a.setStrokeStyle(1);
            a.beginFill("#FF0000");
            a.drawRect(0, 0, 66, 108);
            a.endFill();
            this.hitArea.alpha = 0;
            this.bg.alpha = 0;
            this.hitArea.x = this.width - 66 >> 1;
            this.hitArea.y = this.height - 108 >> 1;
            this.citySprite = new BitmapAnimation(this.spritesheet);
            this.citySprite.gotoAndStop(this.frameName + "_1");
            this.citySprite.x = this.hitArea.x;
            this.citySprite.y = 98;
            this.sprite = new Container;
            this.sprite.width = this.width;
            this.sprite.height = this.height;
            this.sprite.addChild(this.citySprite);
            this.sprite.x =
                this.pt.x;
            this.sprite.y = this.pt.y;
            this.flip && (this.citySprite.x = -66, this.citySprite.scaleX *= -1);
            this.sprite.addChild(this.bg);
            this.sprite.addChild(this.hitArea)
        },
        run: function() {
            !this.emitter && this.sprite.getStage()
        },
        hit: function() {
            this.citySprite.gotoAndStop(this.frameName + "_dead");
            this.particleProps.spread = 360;
            this.particleProps.speed = 0.5;
            this.particleProps.minScale = 0.8;
            this.particleProps.maxScale = 1;
            this.sprite.localToGlobal(this.hitArea.x + this.width / 3, this.hitArea.y + this.height / 2);
            this.isDead = !0
        },
        indirectHit: function() {},
        restore: function() {
            this.citySprite.gotoAndStop(this.frameName + "_1");
            this.isDead = !1
        }
    };
    g.currentGame.City = e
})(window.Atari);
(function(g) {
    function e(a, b, c, d) {
        this.spritesheet = a;
        this.name = b;
        this.pt = c;
        this.scale = d;
        this.initialize()
    }
    e.NORMAL = "enemycity";
    e.DEAD = "enemycity_dead";
    e.prototype = {
        sprite: null,
        images: null,
        citySprite: null,
        initialize: function() {
            this.drawLayout()
        },
        drawLayout: function() {
            this.type = "EnemyCity";
            this.isDead = !1;
            this.width = 63 * this.scale;
            this.height = 68 * this.scale;
            this.citySprite = new BitmapAnimation(this.spritesheet);
            this.citySprite.gotoAndStop(e.NORMAL);
            this.sprite = new Container;
            this.sprite.width = this.width *
                this.scale;
            this.sprite.height = this.height * this.scale;
            this.sprite.addChild(this.citySprite);
            this.sprite.scaleX = this.sprite.scaleY = this.scale;
            this.sprite.x = this.pt.x * this.scale;
            this.sprite.y = this.pt.y + (this.height - 7)
        },
        hit: function() {
            this.citySprite.gotoAndStop(e.DEAD);
            this.isDead = !0
        },
        restore: function() {
            this.citySprite.gotoAndStop(e.NORMAL);
            this.isDead = !1
        }
    };
    g.currentGame.EnemyCity = e
})(window.Atari);
(function(g) {
    function e(a) {
        this.spritesheet = a;
        this.emitter;
        this.initialize()
    }
    e.prototype = {
        sprite: null,
        particleList: null,
        emitter: null,
        tickCount: null,
        particleContainer: null,
        particleProps: null,
        particleProps2: null,
        position: null,
        position2: null,
        pts: null,
        nextSmoke: 0,
        spritesheet: null,
        initialize: function() {
            this.value = 5;
            this.sprite = new Container;
            this.tickCount = 0;
            this.pts = [];
            this.position = new Point(252, 352);
            this.particleProps = {
                rotate: !1,
                speed: 0.1,
                gravity: 0,
                angle: -90,
                spread: 1,
                decay: 0.99,
                minScale: 0.3,
                maxScale: 1,
                scaleDecay: 1.008,
                life: 1.2,
                staticSpeed: !0
            };
            this.position2 = new Point(507, 470);
            this.particleProps2 = {
                rotate: !1,
                speed: 0.3,
                gravity: 0,
                angle: -90,
                spread: 1,
                decay: 0.99,
                minScale: 0.2,
                maxScale: 0.4,
                scaleDecay: 1.008,
                life: 1.2
            };
            var a = new BitmapAnimation(this.spritesheet);
            a.gotoAndStop("smoulderparticle_small");
            var b = new BitmapAnimation(this.spritesheet);
            b.gotoAndStop("smoulderparticle_large");
            this.particleList = [a, b];
            this.particleContainer = new Container;
            this.sprite.addChild(this.particleContainer)
        },
        setPoints: function(a) {
            this.pts =
                a
        },
        addPoint: function(a) {
            this.pts.push(a)
        },
        removePoint: function() {
            for (var a = this.pts.length - 1; 0 <= a; a--)
                if ("front" == this.pts[a].label) {
                    this.pts.splice(a, 1);
                    break
                }
        },
        tick: function(a) {
            this.tickCount += a;
            if (null != this.sprite && (!this.emitter && this.sprite && (this.emitter = new GameLibs.ParticleEmitter(this.particleContainer), this.emitter.tickFactor = a), this.tickCount > this.nextSmoke)) {
                for (a = 0; a < this.pts.length; a++) {
                    var b = this.pts[a],
                        c = b.data;
                    null != c && ("back" == b.label ? this.emitter.emit(c, 1, this.particleProps, this.particleList[0]) :
                        this.emitter.emit(c, 1, this.particleProps2, this.particleList[1]))
                }
                this.nextSmoke = this.tickCount + 20
            }
        }
    };
    g.currentGame.Smoke = e
})(window.Atari);
(function(g) {
    function e() {
        this.initialize()
    }
    e.TIMER = 300;
    e.prototype = {
        sprite: null,
        display: null,
        bg: null,
        width: null,
        height: null,
        duration: null,
        showing: null,
        initialize: function() {
            this.sprite = new Container;
            this.duration = 1E3;
            this.bg = new Shape;
            this.showing = !1;
            this.width = this.sprite.width = 300;
            this.height = this.sprite.height = 100;
            var a = this.bg.graphics;
            a.setStrokeStyle(1);
            a.beginFill("#FF0000");
            a.drawRect(0, 0, this.width, this.height);
            a.endFill();
            this.display = new Text("Level 0", "75px " + Atari.Fonts.DEMI, "#FFFFFF");
            this.display.x = 10;
            this.bg.alpha = 0.5;
            this.bg.alpha = 0;
            this.visible = !1;
            this.sprite.addChild(this.bg);
            this.sprite.addChild(this.display);
            this.sprite.alpha = 0
        },
        show: function(a, b) {
            this.showing || (null == b && (b = 0), this.showing = !0, this.duration = a, Tween.get(this.sprite).to({
                alpha: 1
            }, this.duration).wait(b).call(this.handleShowComplete, null, this))
        },
        handleShowComplete: function() {
            this.showing = !1;
            Tween.get(this.sprite).to({
                alpha: 0
            }, this.duration)
        },
        setText: function(a) {
            this.display.text = a
        }
    };
    g.currentGame.Popup = e
})(window.Atari);
(function(g) {
    function e(a) {
        this.spritesheet = a;
        this.initialize()
    }
    e.OPEN = "icbm_door_open";
    e.CLOSE = "icbm_door";
    e.prototype = {
        sprite: null,
        data: null,
        ssb: null,
        door: null,
        initialize: function() {
            this.drawLayout()
        },
        drawLayout: function() {
            this.type = "ICBMDoor";
            this.width = 121;
            this.height = 42;
            this.sprite = new BitmapAnimation(this.spritesheet);
            this.spritesheet._data[e.OPEN].frequency = 2;
            this.sprite.onAnimationEnd = Atari.proxy(this.close, this);
            this.sprite.gotoAndPlay(e.CLOSE)
        },
        close: function() {
            this.sprite.gotoAndStop(e.CLOSE)
        },
        open: function() {
            this.sprite.gotoAndPlay(e.OPEN)
        }
    };
    g.currentGame.ICBMDoor = e
})(window.Atari);
(function(g) {
    function e(a) {
        this.isMultiplayer = a;
        this.initialize()
    }
    e.prototype = {
        currentLevel: null,
        totalMissiles: null,
        incomingMissiles: null,
        missileCreateCount: null,
        missileSpeed: null,
        isLevelComplete: null,
        nextMissile: null,
        actualCount: null,
        incoming: null,
        scoringMultiplier: null,
        totalPlanes: null,
        nextPlane: null,
        isMultiplayer: null,
        initialize: function() {
            this.currentLevel = this.isMultiplayer ? 5 : 0;
            this.startLevel()
        },
        startLevel: function() {
            this.isMultiplayer ? (this.totalMissiles = 15E3, this.totalPlanes = 5, this.nextPlane =
                this.nextMissile = 100, this.incomingMissiles = this.totalMissiles, this.isLevelComplete = !1, this.actualCount = this.incomingMissiles, this.levelTime = this.incoming = 0) : (this.totalMissiles = 30, this.totalPlanes = 5, this.nextPlane = this.nextMissile = 100, this.incomingMissiles = this.totalMissiles / 2 + 2 * this.currentLevel | 0, this.isLevelComplete = !1, this.actualCount = this.incomingMissiles, this.incoming = 0);
            this.calculateMultiplier()
        },
        calculateMultiplier: function() {
            switch (this.currentLevel) {
                case 0:
                case 1:
                    this.scoringMultiplier =
                        1;
                    break;
                case 2:
                case 3:
                    this.scoringMultiplier = 2;
                    break;
                case 4:
                case 5:
                    this.scoringMultiplier = 3;
                    break;
                case 6:
                case 7:
                    this.scoringMultiplier = 4;
                    break;
                case 8:
                case 9:
                    this.scoringMultiplier = 5;
                    break;
                default:
                    this.scoringMultiplier = 6
            }
        },
        continueGame: function() {
            this.startLevel()
        },
        getMissileSpeed: function(a) {
            this.incoming++;
            var b = Math.min(4, 1.5 + this.currentLevel / 6 + Math.random() * this.currentLevel / 3);
            a && !this.isMultiplayer && (b *= 1 + 0.25 * (this.missileCreateCount / this.actualCount));
            return b * (this.isMultiplayer ? 0.65 : 1) |
                0
        },
        nextMissileFire: function() {
            var a;
            a = Math.max(3, 60 - 5 * this.currentLevel);
            this.nextMissile = (1 + Math.max(10, 50 - 2 * this.currentLevel) + Math.random() * a) * (this.isMultiplayer ? 0.65 : 1) | 0
        },
        levelComplete: function() {
            this.currentLevel++;
            this.isLevelComplete = !0
        },
        gameOver: function() {
            this.incomingMissiles = this.currentLevel = 0
        }
    };
    g.currentGame.LevelManager = e
})(window.Atari);
(function(g) {
    function e(a, b, c, d, f) {
        this.score = 0;
        this.scale = f;
        this.width = c;
        this.height = d;
        this.spritesheet = a;
        this.callback = b;
        this.initialize()
    }
    e.MISSILE_RANGE = [0, 34, 67, 100];
    e.TOP_BAR_WIDTH = 484;
    e.TOP_BAR_HEIGHT = 22;
    e.prototype = {
        score: 0,
        lives: 0,
        scoreContainer: null,
        playersDisplay: null,
        count: null,
        sprite: null,
        max: 864,
        currentSection: null,
        scoreTxt: null,
        levelTxt: null,
        healthTxt: null,
        incomingTxt: null,
        percentageInSection: null,
        overallPercentage: null,
        spritesheet: null,
        launchBtn: null,
        launchTxt: null,
        scoreDisplay: null,
        levelDisplay: null,
        incomingDisplay: null,
        healthDisplay: null,
        healthTrack: null,
        healthBar: null,
        bg: null,
        width: null,
        height: null,
        multiplayer: null,
        comboBarMask: null,
        initialize: function() {
            this.sprite = new Container;
            this.healthBar = new Shape;
            this.healthTrack = new Shape;
            this.bg = new Shape;
            this.count = this.currentSection = 0;
            this.multiplayer = !1;
            var a = this.healthBar.graphics;
            a.setStrokeStyle(1);
            a.beginFill("#a8a4a4");
            a.drawRect(0, 0, 400, 25);
            a.endFill();
            a = this.bg.graphics;
            a.setStrokeStyle(1);
            a.beginFill("#FF0000");
            a.drawRect(0,
                0, 1024, 60);
            a.endFill();
            a = this.healthTrack.graphics;
            a.setStrokeStyle(1);
            a.beginFill("#333333");
            a.drawRect(0, 0, 400, 25);
            a.endFill();
            this.launchBtn = new Shape;
            a = this.launchBtn.graphics;
            a.setStrokeStyle(1);
            a.beginFill("#CCCCCC");
            a.drawRect(0, 0, 180, 40);
            a.endFill();
            this.launchBtn.alpha = 0.02;
            this.launchBtn.onPress = Atari.proxy(this.handleFire, this);
            this.launchBtn.x = this.width - 175;
            this.launchBtn.y = this.height - 40;
            this.launchTxt = new Text("Launch", "18px " + Atari.Fonts.DEMI, "#FFFFFF");
            this.launchTxt.x = this.launchBtn.x +
                10;
            this.launchTxt.y = this.launchBtn.y + 25;
            this.bg.alpha = 0.05;
            this.scoreTxt = new Text("Score", "34px " + Atari.Fonts.DEMI, "#FFFFFF");
            this.scoreTxt.x = 16;
            this.levelTxt = new Text("Level", "15px " + Atari.Fonts.DEMI, "#FFFFFF");
            this.levelTxt.x = 189;
            this.healthTxt = new Text("Progress", "6px " + Atari.Fonts.DEMI, "#FFFFFF");
            this.healthTxt.x = 362;
            this.healthTxt.y = 14;
            this.incomingTxt = new Text("Incoming", "6px " + Atari.Fonts.DEMI, "#FFFFFF");
            this.incomingTxt.x = 844;
            this.scoreDisplay = new Text("---", "35px " + Atari.Fonts.DEMI, "#FFFFFF");
            this.scoreDisplay.x = 16;
            this.scoreDisplay.y = this.height - 42;
            this.levelDisplay = new Text("----", "35px " + Atari.Fonts.DEMI, "#FFFFFF");
            this.levelDisplay.x = 230;
            this.levelDisplay.y = this.height - 42;
            this.healthDisplay = new Text("-----", "16px " + Atari.Fonts.DEMI, "#FFFFFF");
            this.healthDisplay.x = 585;
            this.incomingDisplay = new Text("--", "16px " + Atari.Fonts.DEMI, "#FFFFFF");
            this.incomingDisplay.x = 710;
            this.sprite.addChild(this.scoreDisplay, this.levelDisplay, this.healthDisplay, this.incomingDisplay, this.launchBtn);
            this.healthBar.scaleX =
                0;
            this.healthBar.x = 362;
            this.healthTrack.x = 362;
            this.healthBar.y = 25;
            this.healthTrack.y = 25
        },
        showLaunch: function() {
            this.launchBtn.visible = !0;
            this.launchTxt.visible = !0
        },
        hideLaunch: function() {
            this.launchTxt.visible = !1;
            this.launchBtn.visible = !0
        },
        handleFire: function() {
            if (0 != this.currentSection) {
                var a = this.currentSection,
                    b = this.percentageInSection;
                Math.max(this.currentSection, 3);
                this.callback({
                    type: a,
                    level: 0.67 < b && 1 >= b ? 3 : 0.34 < b && 0.66 > b ? 2 : 1
                });
                this.count = this.currentSection = 0;
                this.comboBarMask.scaleX = 0
            }
        },
        setVisible: function(a) {
            this.scoreTxt.visible =
                a;
            this.levelTxt.visible = a;
            this.healthTxt.text = a ? "Progress" : "Level";
            this.incomingTxt.visible = a;
            this.scoreDisplay.visible = a;
            this.levelDisplay.visible = a;
            this.healthDisplay.visible = a;
            this.incomingDisplay.visible = a
        },
        setProgress: function(a) {
            if (0 != a)
                if (100 <= this.count) this.healthBar.scaleX = 1, this.comboBarMask.scaleX = 1, this.count = 100, this.overallPercentage = this.percentageInSection = this.healthBar.scaleX, this.currentSection = e.MISSILE_RANGE.length - 1;
                else {
                    this.count += a;
                    for (a = e.MISSILE_RANGE.length - 1; 0 < a; a--) {
                        var b =
                            e.MISSILE_RANGE[a],
                            c = e.MISSILE_RANGE[a - 1];
                        if (GameLibs.Math2.isBetween(this.count, c, b)) {
                            this.percentageInSection = (this.count - c) / (b - c);
                            this.overallPercentage = this.count;
                            this.currentSection = a;
                            this.comboBarMask.scaleX = Math.min(1, this.overallPercentage / 100);
                            this.healthBar.scaleX = 1;
                            break
                        }
                    }
                }
        },
        setType: function(a) {
            if (a) this.multiplayer = !0, a = new BitmapAnimation(this.spritesheet), a.gotoAndStop("UI_multiplayer"), a.x = 463, a.y = 555, this.comboBarMask = new Shape((new Graphics).f("#f00").dr(0, 0, 210, 10)), this.comboBarMask.scaleX =
                0, this.healthBar = new BitmapAnimation(this.spritesheet), this.healthBar.gotoAndStop("combobar"), this.healthBar.scaleX = 1, this.healthBar.x = a.x + 89, this.healthBar.y = this.height - 10 - 4, this.comboBarMask.x = this.healthBar.x, this.comboBarMask.y = this.healthBar.y, this.sprite.addChild(a), this.sprite.addChild(this.healthBar), this.healthBar.mask = this.comboBarMask, a = this.sprite.children.length - 1, this.sprite.setChildIndex(this.launchBtn, a), this.launchTxt.visible = !1, this.launchBtn.visible = !0, this.levelDisplay.visible = !1, this.scoreDisplay.visible = !1, this.incomingDisplay.visible = !1, this.healthDisplay.visible = !1;
            else {
                this.multiplayer = !1;
                a = new BitmapAnimation(this.spritesheet);
                a.gotoAndStop("UI_single_bottom");
                this.healthBar = new BitmapAnimation(this.spritesheet);
                this.healthBar.gotoAndStop("UI_remainingbar");
                var b = new BitmapAnimation(this.spritesheet);
                b.scaleX = b.scaleY = this.scale;
                b.gotoAndStop("UI_single_top");
                this.sprite.addChild(b);
                this.sprite.addChild(this.healthBar);
                this.sprite.addChild(a);
                b.x = this.width - e.TOP_BAR_WIDTH *
                    this.scale >> 1;
                a.y = this.height - 67;
                this.incomingDisplay.scaleX = this.incomingDisplay.scaleY = this.scale;
                this.healthDisplay.scaleX = this.healthDisplay.scaleY = this.scale;
                this.healthBar.scaleY = this.scale;
                this.healthBar.x = b.x + 99 * this.scale;
                this.healthBar.y = e.TOP_BAR_HEIGHT * this.scale - 10 * this.scale >> 1;
                this.incomingDisplay.x = b.x + e.TOP_BAR_WIDTH * this.scale - 45 * this.scale;
                this.healthDisplay.x = b.x + 310 * this.scale;
                a = this.sprite.children.length - 1;
                this.sprite.setChildIndex(this.levelDisplay, a);
                this.sprite.setChildIndex(this.scoreDisplay,
                    a);
                this.sprite.setChildIndex(this.healthDisplay, a);
                this.sprite.setChildIndex(this.incomingDisplay, a);
                this.launchTxt.visible = !1;
                this.launchBtn.visible = !1
            }
        },
        update: function(a, b, c) {
            this.multiplayer ? (a = Math.max(1, Math.min(100 * a | 0, 100)), this.healthBar.gotoAndStop(a - 1)) : this.healthBar.scaleX = Math.min(a * this.scale, 1 * this.scale);
            null != c && (this.healthDisplay.text = c);
            this.incomingDisplay.text = b
        },
        resetScore: function() {
            this.score = 0
        },
        resetLives: function() {
            this.lives = 5;
            this.playersDisplay.text = this.lives
        },
        updateLives: function(a) {
            this.lives =
                a;
            this.playersDisplay.text = "" + this.lives
        },
        updateLevels: function(a) {
            this.level = a;
            this.levelDisplay.text = this.level
        }
    };
    g.currentGame.ScoreBoard = e
})(window.Atari);
(function(g) {
    function e(a) {
        this.spritesheet = a;
        this.initialize()
    }
    s = e;
    s.ONE = 0;
    s.TWO = 1;
    s.THREE = 2;
    s.FOUR = 3;
    s.FIVE = 4;
    s.SIX = 5;
    e.prototype = {
        sprite: null,
        citiesTxt: null,
        citiesCount: null,
        levelTxt: null,
        images: null,
        bg: null,
        width: null,
        height: null,
        citiesPoints: null,
        cities: null,
        points: null,
        _data: null,
        _source: null,
        cityTicks: null,
        citySSB: null,
        missileSSB: null,
        missileTicks: null,
        spritesheet: null,
        initialize: function() {
            this.drawLayout()
        },
        drawLayout: function() {
            this.sprite = new Container;
            this.width = 602;
            this.height = 419;
            this.cities =
                this.points = 0;
            this.bg = new BitmapAnimation(this.spritesheet);
            this.bg.gotoAndStop("endlevel");
            this.cityTicks = new BitmapAnimation(this.spritesheet);
            this.cityTicks.gotoAndStop("citytally_1");
            this.cityTicks.x = 170;
            this.cityTicks.y = 173;
            this.missileTicks = new BitmapAnimation(this.spritesheet);
            this.missileTicks.gotoAndStop("turrettally_1");
            this.missileTicks.x = 469;
            this.missileTicks.y = 173;
            this.sprite.addChild(this.cityTicks);
            this.sprite.addChild(this.missileTicks);
            this.citiesPoints = new Text("--", "40px " + Atari.Fonts.DEMI,
                "#000000");
            this.citiesPoints.x = 325;
            this.citiesPoints.y = 280;
            this.sprite.addChild(this.bg);
            this.sprite.addChild(this.citiesPoints)
        },
        show: function() {},
        hide: function() {},
        setData: function(a) {
            this._data = a;
            this._score = Math.max(0, a.score);
            if (this.cityTicks) {
                var b = a.cityCount,
                    c = a.missileCount;
                0 != b ? this.cityTicks.gotoAndStop("citytally_" + b) : this.cityTicks.visible = !1;
                0 != c ? this.missileTicks.gotoAndStop("turrettally_" + c) : this.missileTicks.visible = !1;
                this.sprite.setChildIndex(this.missileTicks, this.sprite.children.length -
                    1);
                this.sprite.setChildIndex(this.cityTicks, this.sprite.children.length - 1)
            }
            b = Tween.get(this, {
                override: !0
            });
            b.onChange = Atari.proxy(this.onChange, this);
            b.to({
                points: a.score
            }, 500, Ease.sineInOut)
        },
        getScore: function() {
            return GameLibs.StringUtils.formatScore(this.points | 0)
        },
        onCityChange: function() {
            this.citiesCount.text = "x  " + (this.cities | 0) + " = "
        },
        onChange: function() {
            this.citiesPoints.text = this.getScore() + " pts"
        }
    };
    g.currentGame.ScoreScreen = e
})(window.Atari);
(function(g) {
    function e(a) {
        this.image = a;
        this.initialize()
    }
    e.prototype = {
        sprite: null,
        image: null,
        width: null,
        height: null,
        initialize: function() {
            this.drawLayout()
        },
        drawLayout: function() {
            this.width = 1204;
            this.height = 622;
            this.sprite = new Shape;
            var a = this.sprite.graphics;
            a.beginFill("#FFFFFF");
            a.drawRect(0, 0, this.width, this.height);
            a.endFill()
        },
        show: function() {
            this.sprite.alpha = 1
        },
        hide: function() {
            this.sprite.alpha = 0
        }
    };
    g.currentGame.EndScreen = e
})(window.Atari);
(function(g) {
    function e(a, b, c, d, f, e) {
        this.startX = a;
        this.startY = b;
        this.speed = f;
        this.targetX = c;
        this.targetY = d;
        this.dropTime = this.distance = this.currentTick = this.ratioY = this.ratioX = 0;
        this.spritesheet = e;
        this.initialize()
    }
    e.NORMAL = 0;
    e.prototype = {
        sprite: null,
        width: null,
        height: null,
        satellite: null,
        ssb: null,
        type: null,
        hitArea: null,
        bg: null,
        damageLevel: null,
        particleProps: null,
        particleList: null,
        emitter: null,
        dx: null,
        dy: null,
        ratioX: null,
        ratioY: null,
        distance: null,
        startX: null,
        targetX: null,
        currentTick: null,
        hasFired: null,
        postition: null,
        dropbooms: null,
        direction: null,
        angle: null,
        sound: null,
        spritesheet: null,
        exposionPosition: null,
        tail: null,
        head: null,
        initialize: function() {
            this.particleProps = {
                speed: 0.1,
                decay: 0.95,
                life: 1,
                rotation: !0,
                gravity: 0,
                minScale: 0.5,
                maxScale: 1.5,
                angle: 0,
                spread: 0,
                variation: null,
                stretchFactor: null,
                scaleDecay: 1,
                addOnBottom: !0
            };
            this.drawLayout()
        },
        drawLayout: function() {
            this.type = "Satellite";
            this.damageLevel = 1;
            this.isDead = !1;
            this.currentTick = 0;
            this.hasFired = !1;
            this.angle = 0;
            this.exposionPosition = new Point;
            this.height = this.width = 80;
            this.ssb = new SpriteSheetBuilder;
            this.particleList = [];
            var a = new BitmapAnimation(this.spritesheet);
            a.gotoAndStop("smoulderparticle_medium");
            this.particleList = [a];
            this.sound = SoundJS.play("satelliteSound", null, 0, 0, -1);
            this.hitArea = new Shape;
            this.bg = new Shape;
            a = this.hitArea.graphics;
            a = this.bg.graphics;
            a.setStrokeStyle(1);
            a.beginFill("#FFFFFF");
            a.drawRect(0, 0, this.width, this.height);
            a.endFill();
            a = this.hitArea.graphics;
            a.setStrokeStyle(1);
            a.beginFill("#FF0000");
            a.drawRect(0, 0, 80,
                80);
            a.endFill();
            this.hitArea.alpha = 0;
            this.bg.alpha = 0;
            this.hitArea.x = this.width - 80 >> 1;
            this.hitArea.y = this.height - 80 >> 1;
            this.satellite = new BitmapAnimation(this.spritesheet);
            this.satellite.gotoAndPlay("satellite");
            this.sprite = new Container;
            this.sprite.width = this.width;
            this.sprite.height = this.height;
            this.sprite.addChild(this.satellite);
            this.sprite.addChild(this.bg);
            this.sprite.addChild(this.hitArea);
            this.nose = new Shape;
            a = this.nose.graphics;
            a.setStrokeStyle(1);
            a.beginFill("#FF0099");
            a.drawCircle(0, 0, 5);
            a.endFill();
            this.sprite.addChild(this.nose);
            this.tail = new Shape;
            a = this.tail.graphics;
            a.setStrokeStyle(1);
            a.beginFill("#3281FF");
            a.drawCircle(0, 0, 5);
            a.endFill();
            this.sprite.addChild(this.tail);
            this.nose.x = 0;
            this.nose.y = 25;
            this.tail.x = 62;
            this.tail.y = 25;
            this.tail.alpha = this.nose.alpha = 0.02;
            this.position = new Point;
            this.dx = this.targetX - this.startX;
            this.dy = this.targetY - this.startY;
            this.distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
            a = Math.atan2(this.dy, this.dx);
            this.ratioX = Math.cos(a);
            this.ratioY =
                Math.sin(a)
        },
        kill: function() {
            this.sound.stop()
        },
        pauseSound: function(a) {
            a ? this.sound.pause() : this.sound.resume()
        },
        run: function() {
            null != this.sprite.getStage() && (!this.emitter && this.sprite.getStage()) && (this.emitter = new GameLibs.ParticleEmitter(this.sprite.getStage()))
        },
        hit: function(a) {
            if (!a) {
                if (null == this.sprite.getStage()) return;
                this.particleProps.spread = 360;
                this.particleProps.speed = 0.5;
                this.particleProps.minScale = 0.8;
                this.particleProps.maxScale = 1.25;
                this.emitter.emitMultiple({
                    x: this.exposionPosition.x,
                    y: this.exposionPosition.y
                }, 3, this.particleProps, this.particleList)
            }
            this.kill();
            this.isDead = !0
        },
        setDirection: function(a) {
            this.direction = a
        }
    };
    g.currentGame.Satellite = e
})(window.Atari);
(function(g) {
    function e(a, b, c, d, f, e) {
        this.spritesheet = e;
        this.startX = a;
        this.startY = b;
        this.speed = f;
        this.targetX = c;
        this.targetY = d;
        this.dropTime = this.distance = this.currentTick = this.ratioY = this.ratioX = 0;
        this.initialize()
    }
    e.LEFT = "PlaneLeft";
    e.RIGHT = "PlaneRight";
    e.prototype = {
        sprite: null,
        images: null,
        smokeImages: null,
        width: null,
        height: null,
        cityName: null,
        plane: null,
        ssb: null,
        type: null,
        hitArea: null,
        bg: null,
        damageLevel: null,
        particleProps: null,
        particleList: null,
        emitter: null,
        dx: null,
        dy: null,
        ratioX: null,
        ratioY: null,
        distance: null,
        startX: null,
        targetX: null,
        currentTick: null,
        hasFired: null,
        dropTime: null,
        postition: null,
        dropbooms: null,
        direction: null,
        sound: null,
        exposionPosition: null,
        initialize: function() {
            this.particleProps = {
                speed: 0.1,
                decay: 0.95,
                life: 1,
                rotation: !0,
                gravity: 0,
                minScale: 0.2,
                maxScale: 2,
                angle: 0,
                spread: 0,
                variation: null,
                stretchFactor: null,
                scaleDecay: 1,
                addOnBottom: !0
            };
            this.drawLayout()
        },
        pauseSound: function(a) {
            a ? this.sound.pause() : this.sound.resume()
        },
        kill: function() {
            this.sound.stop()
        },
        drawLayout: function() {
            this.type =
                "Plane";
            this.damageLevel = 1;
            this.isDead = !1;
            this.currentTick = 0;
            this.hasFired = !1;
            this.dropTime = 100 * Math.random() + 50 | 0;
            this.dropbooms = !1;
            this.width = 166;
            this.height = 58;
            this.exposionPosition = new Point;
            this.sound = SoundJS.play("planeSound", null, 0, 0, -1);
            this.particleList = [];
            var a = new BitmapAnimation(this.spritesheet);
            a.gotoAndStop("smoulderparticle_medium");
            this.particleList = [a];
            this.hitArea = new Shape;
            this.bg = new Shape;
            a = this.hitArea.graphics;
            a = this.bg.graphics;
            a.setStrokeStyle(1);
            a.beginFill("#FFFFFF");
            a.drawRect(0,
                0, 166, 58);
            a.endFill();
            a = this.hitArea.graphics;
            a.setStrokeStyle(1);
            a.beginFill("#FF0000");
            a.drawRect(0, 0, 166, 58);
            a.endFill();
            this.hitArea.alpha = 0;
            this.bg.alpha = 0;
            this.hitArea.x = this.width - 166 >> 1;
            this.hitArea.y = this.height - 58 >> 1;
            this.plane = new BitmapAnimation(this.spritesheet);
            this.plane.gotoAndPlay("plane");
            this.sprite = new Container;
            this.sprite.width = this.width;
            this.sprite.height = this.height;
            this.sprite.addChild(this.plane);
            this.sprite.addChild(this.bg);
            this.sprite.addChild(this.hitArea);
            this.nose =
                new Shape;
            a = this.nose.graphics;
            a.setStrokeStyle(1);
            a.beginFill("#FF0099");
            a.drawCircle(0, 0, 5);
            a.endFill();
            this.sprite.addChild(this.nose);
            this.tail = new Shape;
            a = this.tail.graphics;
            a.setStrokeStyle(1);
            a.beginFill("#3281FF");
            a.drawCircle(0, 0, 5);
            a.endFill();
            this.sprite.addChild(this.tail);
            this.nose.x = 0;
            this.nose.y = 31;
            this.tail.x = 197;
            this.tail.y = 31;
            this.tail.alpha = this.nose.alpha = 0.02;
            this.position = new Point;
            this.dx = this.targetX - this.startX;
            this.dy = this.targetY - this.startY;
            this.distance = Math.sqrt(this.dx *
                this.dx + this.dy * this.dy);
            a = Math.atan2(this.dy, this.dx);
            this.ratioX = Math.cos(a);
            this.ratioY = Math.sin(a)
        },
        run: function() {
            null != this.sprite.getStage() && (!this.emitter && this.sprite.getStage()) && (this.emitter = new GameLibs.ParticleEmitter(this.sprite.getStage()))
        },
        hit: function(a) {
            if (!a) {
                if (null == this.sprite.getStage()) return;
                this.particleProps.spread = 360;
                this.particleProps.speed = 0.5;
                this.particleProps.minScale = 0.8;
                this.particleProps.maxScale = 1.25;
                this.emitter.emitMultiple({
                    x: this.position.x,
                    y: this.position.y +
                        58
                }, 3, this.particleProps, this.particleList)
            }
            this.kill();
            this.isDead = !0
        },
        setDirection: function(a) {
            this.direction = a;
            this.spritesheet._data.plane.frequency = 6
        }
    };
    g.currentGame.Plane = e
})(window.Atari);
(function(g) {
    function e(a, b, c, d, f, e, g) {
        this.startX = a;
        this.startY = b;
        this.owner = e;
        this.spritesheet = g;
        this.targetX = c;
        this.targetY = d;
        this.dx = this.startX;
        this.dy = this.startY;
        this.distance = 0;
        this.speed = f;
        this.distance = this.currentTick = this.ratioY = this.ratioX = 0;
        this.lastPosition;
        this.emitter;
        this.hitCount = 0;
        this.initialize()
    }
    e.ENEMY_MISSILE = 1;
    e.FRIENDLY_MISSILE = 0;
    e.ICBM = "icbm1_1";
    e.EMP = "icbm2_1";
    e.NUKE = "icbm3_1";
    e.ZAP = "emp_zap";
    e.prototype = {
        sprite: null,
        dx: null,
        dy: null,
        distance: null,
        speed: null,
        currentTick: null,
        friendly: null,
        position: null,
        value: null,
        ssb: null,
        missile: null,
        split: null,
        container: null,
        particleList: null,
        emitter: null,
        tickCount: null,
        targetCity: null,
        hasHit: null,
        thrustImages: null,
        thrust: null,
        ssb2: null,
        showEMP: null,
        emp: null,
        empssb: null,
        nose: null,
        tail: null,
        exposionPosition: null,
        initialize: function() {
            this.value = 5;
            this.sprite = new Shape;
            this.container = new Container;
            this.split = -1;
            this.tickCount = 0;
            this.showEMP = !1;
            this.particleProps = {
                speed: 0.1,
                decay: 0.95,
                life: 1,
                rotation: !0,
                gravity: 0,
                minScale: 0.2,
                maxScale: 2,
                angle: 0,
                spread: 0,
                variation: null,
                stretchFactor: null,
                scaleDecay: 1,
                addOnBottom: !0
            };
            this.width = 19;
            this.height = 80;
            this.hasHit = !1;
            this.lastPosition = new Point(this.sprite.x, this.sprite.y);
            var a = new BitmapAnimation(this.spritesheet);
            a.regX = 30;
            a.regY = 31;
            a.gotoAndStop("smoulderparticle_medium");
            this.particleList = [a];
            this.exposionPosition = new Point;
            this.missile = new BitmapAnimation(this.spritesheet);
            this.emp = new BitmapAnimation(this.spritesheet);
            this.spritesheet.getAnimation(e.ZAP).next = e.ZAP;
            this.container.addChild(this.sprite);
            this.container.addChild(this.missile);
            this.emp.alpha = 0;
            this.container.addChild(this.emp);
            this.nose = new Shape;
            a = this.nose.graphics;
            a.setStrokeStyle(1);
            a.beginFill("#FF0099");
            a.drawCircle(0, 0, 5);
            a.endFill();
            this.container.addChild(this.nose);
            this.tail = new Shape;
            a = this.tail.graphics;
            a.setStrokeStyle(1);
            a.beginFill("#3281FF");
            a.drawCircle(0, 0, 5);
            a.endFill();
            this.container.addChild(this.tail);
            this.nose.alpha = this.tail.alpha = 0;
            this.friendly = !1;
            this.dx = this.targetX - this.startX;
            this.dy = this.targetY - this.startY;
            this.position = new Point;
            this.distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
            a = Math.atan2(this.dy, this.dx);
            this.ratioX = Math.cos(a);
            this.ratioY = Math.sin(a)
        },
        setType: function(a) {
            var b = 1;
            this.showEMP = !1;
            switch (a) {
                case 1:
                    b = e.ICBM;
                    this.emp.alpha = 0;
                    break;
                case 2:
                    b = e.EMP;
                    this.emp.gotoAndPlay(e.ZAP);
                    this.emp.alpha = 1;
                    this.showEMP = !0;
                    break;
                case 3:
                    b = e.NUKE, this.emp.alpha = 0
            }
            this.missile.gotoAndStop(b)
        },
        hit: function(a) {
            this.hasHit || this.hitCount--;
            0 >= this.hitCount && (!a && null != this.container.getStage()) && (this.particleProps.spread =
                360, this.particleProps.speed = 0.5, this.particleProps.minScale = 0.8, this.particleProps.maxScale = 1.25, this.emitter.emitMultiple({
                    x: this.exposionPosition.x,
                    y: this.exposionPosition.y
                }, 3, this.particleProps, this.particleList))
        },
        run: function() {
            null != this.container.getStage() && (!this.emitter && this.container.getStage()) && (this.emitter = new GameLibs.ParticleEmitter(this.container.getStage()))
        }
    };
    g.currentGame.ICBMMissile = e
})(window.Atari);
(function(g) {
    function e(a) {
        this.canvas = a
    }
    e.ENEMY_SMOKE_COLOR = Graphics.getRGB(255, 255, 255, 1);
    e.ENEMY_SMOKE_COLOR2 = Graphics.getRGB(255, 255, 255, 1);
    e.FRIENDLY_SMOKE_COLOR = Graphics.getRGB(128, 128, 128, 0.95);
    e.RANGE = -10;
    e.MISSILE_RANGE = [0, 30, 60, 100];
    e.PLANE_MISSILE_COUNT = 1200;
    e.SMOKING_POINTS = [];
    e.prototype = {
        assets: null,
        stage: null,
        gameInfo: null,
        targetMs: 1E3 / 60,
        syncPacket: null,
        enemyFired: null,
        currentEnemy: null,
        players: null,
        recordExpolsion: null,
        icbm: null,
        icbm_attack: null,
        icbmFired: null,
        currentExplosion: null,
        friendlyMissiles: null,
        friendlyMissile: null,
        enemyExplosions: null,
        enemyMissiles: null,
        missiles: null,
        planes: null,
        satellites: null,
        explosions: null,
        touchPad: null,
        crossHair: null,
        comboCount: null,
        alphaBattery: null,
        deltaBattery: null,
        omegaBattery: null,
        cities: null,
        incomingMissileType: null,
        incomingMissileLevel: null,
        w: 0,
        h: 0,
        total: 0,
        citiesLeft: null,
        remainingCities: null,
        killedTurrent: null,
        endScreen: null,
        removedCities: null,
        removedTurrents: null,
        enemyTurrets: null,
        damageContainer: null,
        enemyCities: null,
        missilesArr: null,
        citiesArr: null,
        allCitiesArr: null,
        removeCount: null,
        ss: null,
        enemyground: null,
        levelManager: null,
        selectedWeapon: null,
        currentWeapon: null,
        offsetX: null,
        offsetY: null,
        mainTarget: null,
        useTarget: null,
        batteries: null,
        slice: null,
        missileAssets: null,
        smokeAssets: null,
        scoreBoard: null,
        scoreScreen: null,
        gameLogic: null,
        enemyCity1: null,
        enemyCity2: null,
        enemyCity3: null,
        enemyCity4: null,
        enemyCity5: null,
        enemyCity6: null,
        city1: null,
        city2: null,
        city3: null,
        city4: null,
        city5: null,
        city6: null,
        ICBMIncoming: null,
        enemy_turret_alpha: null,
        enemy_turret_delta: null,
        enemy_turret_omega: null,
        killedCities: null,
        currentEnemyCity: null,
        totalMissileKilled: null,
        particleList: null,
        gameHasEnded: null,
        framePacket: null,
        shotFired: null,
        cityHit: null,
        score: null,
        isMultiplayer: null,
        icbmLaunch: null,
        icbmIncoming: null,
        totalTurrets: null,
        totalCities: null,
        ICBMData: null,
        ICBMDoor: null,
        isEnemyTurretHit_alpha: null,
        isEnemyTurretHit_delta: null,
        isEnemyTurretHit_omega: null,
        youlose: null,
        currentStageX: null,
        currentStageY: null,
        missileTrailsContainer: null,
        currentMouseX: null,
        currentMouseY: null,
        hitArea: null,
        popup: null,
        grass: null,
        stunIneffect: null,
        enemiesStun: null,
        gameOverSound: null,
        gameStartSound: null,
        incomingSound: null,
        victorySound: null,
        bgMusic: null,
        tickFactor: null,
        canShoot: null,
        touchList: null,
        perf: null,
        allSounds: null,
        lowQuality: null,
        endGameSound: null,
        volume: null,
        smoke: null,
        clearMyICBMTrail: null,
        gameIsComplete: null,
        frontRow: null,
        backRow: null,
        turrentHit: null,
        spritesheet: null,
        scale: null,
        onLevelComplete: null,
        onGameComplete: null,
        onGameOver: null,
        onGameError: null,
        initialize: function(a,
            b, c) {
            this.stage = b;
            this.assets = a;
            this.gameInfo = c;
            this.w = this.stage.canvas.width;
            this.h = this.stage.canvas.height;
            this.canShoot = this.isLevelComplete = !1;
            this.touchList = [];
            this.volume = 1;
            this.turrentHit = this.lowQuality = !1;
            a = 1;
            b = this.gameInfo.quality;
            this.scale = this.gameInfo.width / 1024;
            switch (b) {
                case GameLibs.GameInfo.QUALITY_HIGH:
                    a = 1.5;
                    break;
                case GameLibs.GameInfo.QUALITY_LOW:
                    a = 1.25
            }
            this.frontRow = [new Point(40 * this.scale, 500 * this.scale), new Point(480 * this.scale, 500 * this.scale), new Point(925 * this.scale,
                500 * this.scale)];
            this.backRow = [];
            this.isMultiplayer = this.gameInfo.mode != GameLibs.GameInfo.SINGLE_PLAYER;
            this.spritesheet = new GameLibs.SpriteSheetWrapper(this.assets.allAssets);
            this.comboCount = 0;
            this.isMultiplayer && (this.gameHasEndedYouLose = this.gameIsComplete = this.gameHasEnded = !1, this.youlose = !0, this.friendlyMissiles = [], this.players = this.gameInfo.players, this.icbmFired = this.recordExpolsion = !1, this.ICBMData = {
                Normal: [0, 1, 5, 10],
                EMP: [0, 1, 5, 10],
                Nuke: [0, 1, 5, 10]
            }, this.ICBMDoor = new g.currentGame.ICBMDoor(this.spritesheet));
            this.framePacket = new GameLibs.FramePacket;
            this.missiles = [];
            this.satellites = [];
            this.planes = [];
            this.explosions = [];
            this.enemyExplosions = [];
            this.enemyMissiles = [];
            this.totalTurrets = 3;
            this.totalCities = 6;
            this.gameLogic = !0;
            this.scoreBoard = new g.currentGame.ScoreBoard(this.spritesheet, Atari.proxy(this.handleFire, this), this.gameInfo.width, this.gameInfo.height, a);
            this.scoreManager = new GameLibs.ScoreManager(this.scoreBoard.scoreDisplay);
            this.levelManager = new g.currentGame.LevelManager(this.isMultiplayer);
            this.levelManager.missileCreateCount =
                0;
            this.setScore(0);
            a = GameLibs.GameUI.changeBackground(this.assets.background, this.gameInfo.width, this.gameInfo.height, GameLibs.GameUI.CROP, GameLibs.GameUI.CENTER);
            this.stage.addChildAt(a, 0);
            this.mainTarget = !0;
            new GameLibs.FPSMeter(this.stage);
            this.perf = new GameLibs.PerformanceMonitor(Atari.proxy(this.enableLowQuality, this), 40);
            this.setupLayout();
            this.isMultiplayer && (this.damageContainer = new Container, this.missileTrailsContainer = new Container, b = new Shape, c = new Shape, a = new Shape, this.missileTrailsContainer.addChild(b),
                this.missileTrailsContainer.addChild(c), this.missileTrailsContainer.addChild(a), b = a.graphics, b.setStrokeStyle(1), b.beginStroke("#000000"), b.drawRect(0, 0, this.w, this.h), a.alpha = 0, this.damageContainer.scaleX = this.damageContainer.scaleY = 0.6, a = this.w * this.damageContainer.scaleX, b = this.h * this.damageContainer.scaleY, this.damageContainer.x = a + (this.w - a >> 1), this.damageContainer.y = (b - b / 2 >> 1) - 30, this.damageContainer.scaleX *= -1, this.missileTrailsContainer.scaleX = this.missileTrailsContainer.scaleY = 0.65, a = this.w *
                this.missileTrailsContainer.scaleX, this.missileTrailsContainer.x = a + (this.w - a >> 1), this.missileTrailsContainer.y = 0, this.missileTrailsContainer.scaleX *= -1, this.stage.addChild(this.missileTrailsContainer), this.stage.setChildIndex(this.missileTrailsContainer, this.stage.getChildIndex(this.enemyground) - 1), this.stage.addChild(this.damageContainer))
        },
        enableLowQuality: function(a) {
            this.lowQuality = a
        },
        setupLayout: function() {
            null != this.endScreen && this.endScreen.hide();
            this.allSounds = [];
            this.killedCities = [];
            this.totalMissileKilled =
                0;
            this.enemyCities = [];
            var a = new BitmapAnimation(this.spritesheet);
            a.gotoAndStop("foregroundhills");
            a.scaleX = a.scaleY = this.scale;
            a.y = this.h - 132 * this.scale;
            this.grass = new BitmapAnimation(this.spritesheet);
            this.grass.gotoAndStop("foregroundgrass");
            this.grass.scaleX = this.grass.scaleY = this.scale;
            this.grass.y = this.h - 124 * this.scale;
            this.enemyground = new BitmapAnimation(this.spritesheet);
            this.enemyground.gotoAndStop("enemy-ground");
            this.enemyground.scaleX = this.enemyground.scaleY = this.scale;
            this.enemyground.x =
                0;
            this.enemyground.y = this.h - 339 * this.scale;
            this.enemyCity1 = new g.currentGame.EnemyCity(this.spritesheet, "enemyCity1", new Point(290, this.enemyground.y), this.scale);
            this.enemyCity2 = new g.currentGame.EnemyCity(this.spritesheet, "enemyCity2", new Point(340, this.enemyground.y), this.scale);
            this.enemyCity3 = new g.currentGame.EnemyCity(this.spritesheet, "enemyCity3", new Point(395, this.enemyground.y), this.scale);
            this.enemyCity4 = new g.currentGame.EnemyCity(this.spritesheet, "enemyCity4", new Point(570, this.enemyground.y),
                this.scale);
            this.enemyCity5 = new g.currentGame.EnemyCity(this.spritesheet, "enemyCity5", new Point(620, this.enemyground.y), this.scale);
            this.enemyCity6 = new g.currentGame.EnemyCity(this.spritesheet, "enemyCity6", new Point(670, this.enemyground.y), this.scale);
            this.enemy_turret_alpha = new g.currentGame.EnemyBattery(this.spritesheet, new Point(253, this.enemyCity1.sprite.y), this.scale);
            this.enemy_turret_delta = new g.currentGame.EnemyBattery(this.spritesheet, new Point(514, this.enemyCity1.sprite.y), this.scale);
            this.enemy_turret_omega =
                new g.currentGame.EnemyBattery(this.spritesheet, new Point(785, this.enemyCity1.sprite.y), this.scale);
            this.smoke = new g.currentGame.Smoke(this.spritesheet);
            this.backRow = [new Point(this.enemy_turret_alpha.sprite.x, this.enemy_turret_alpha.sprite.y), new Point(this.enemy_turret_delta.sprite.x, this.enemy_turret_delta.sprite.y), new Point(this.enemy_turret_omega.sprite.x, this.enemy_turret_omega.sprite.y), new Point(this.enemyCity1.sprite.x + this.enemyCity1.width / 2, 5 + this.enemyCity1.sprite.y + this.enemyCity1.height /
                2), new Point(this.enemyCity2.sprite.x + this.enemyCity2.width / 2, 5 + this.enemyCity2.sprite.y + this.enemyCity2.height / 2), new Point(this.enemyCity3.sprite.x + this.enemyCity3.width / 2, 5 + this.enemyCity3.sprite.y + this.enemyCity3.height / 2), new Point(this.enemyCity4.sprite.x + this.enemyCity4.width / 2, 5 + this.enemyCity4.sprite.y + this.enemyCity4.height / 2), new Point(this.enemyCity5.sprite.x + this.enemyCity5.width / 2, 5 + this.enemyCity5.sprite.y + this.enemyCity5.height / 2), new Point(this.enemyCity6.sprite.x + this.enemyCity6.width /
                2, 5 + this.enemyCity6.sprite.y + this.enemyCity6.height / 2)];
            this.isMultiplayer || this.smoke.setPoints(this.getRandomPts(0, 2 * Math.random() + 1 | 0));
            this.enemyCities = [this.enemyCity1, this.enemyCity2, this.enemyCity3, this.enemyCity4, this.enemyCity5, this.enemyCity6];
            this.enemyTurrets = [this.enemy_turret_alpha, this.enemy_turret_delta, this.enemy_turret_omega];
            if (!this.isMultiplayer) {
                for (var b = this.enemyCities.length, c, d = 0; d < b; d++) c = this.enemyCities[d], c.hit();
                b = this.enemyTurrets.length;
                for (d = 0; d < b; d++) c = this.enemyTurrets[d],
                    c.hit()
            }
            this.city1 = new g.currentGame.City("city1", new Point(123 * this.scale, this.h - 170 * this.scale), !1, this.spritesheet);
            this.city2 = new g.currentGame.City("city2", new Point(216 * this.scale, this.h - 170 * this.scale), !1, this.spritesheet);
            this.city3 = new g.currentGame.City("city3", new Point(305 * this.scale, this.h - 160 * this.scale), !1, this.spritesheet);
            this.city4 = new g.currentGame.City("city4", new Point(590 * this.scale, this.h - 170 * this.scale), !0, this.spritesheet);
            this.city5 = new g.currentGame.City("city5", new Point(678 *
                this.scale, this.h - 160 * this.scale), !0, this.spritesheet);
            this.city6 = new g.currentGame.City("city6", new Point(767 * this.scale, this.h - 170 * this.scale), !0, this.spritesheet);
            this.city1.sprite.scaleX = this.city1.sprite.scaleY = this.scale;
            this.city2.sprite.scaleX = this.city2.sprite.scaleY = this.scale;
            this.city3.sprite.scaleX = this.city3.sprite.scaleY = this.scale;
            this.city4.sprite.scaleX = this.city4.sprite.scaleY = this.scale;
            this.city5.sprite.scaleX = this.city5.sprite.scaleY = this.scale;
            this.city6.sprite.scaleX = this.city6.sprite.scaleY =
                this.scale;
            this.city4.citySprite.x = 100;
            this.city5.citySprite.x = 100;
            this.city6.citySprite.x = 100;
            this.city1.run();
            this.city2.run();
            this.city3.run();
            this.city4.run();
            this.city5.run();
            this.city6.run();
            this.citiesArr = [this.city1, this.city2, this.city3, this.city4, this.city5, this.city6];
            this.allCitiesArr = this.citiesArr.concat();
            this.alphaBattery = new g.currentGame.Battery(new Point(-5 * this.scale, this.h - 252 * this.scale), "alphaBattery", this.spritesheet, 1);
            this.deltaBattery = new g.currentGame.Battery(new Point(448 *
                this.scale, this.h - 250 * this.scale), "deltaBattery", this.spritesheet, 2);
            this.omegaBattery = new g.currentGame.Battery(new Point(887 * this.scale, this.h - 247 * this.scale), "omegaBattery", this.spritesheet, 3);
            this.alphaBattery.sprite.scaleX = this.alphaBattery.sprite.scaleY = this.scale;
            this.deltaBattery.sprite.scaleX = this.deltaBattery.sprite.scaleY = this.scale;
            this.omegaBattery.sprite.scaleX = this.omegaBattery.sprite.scaleY = this.scale;
            this.batteries = [{
                label: "alphaBattery",
                data: this.alphaBattery
            }, {
                label: "deltaBattery",
                data: this.deltaBattery
            }, {
                label: "omegaBattery",
                data: this.omegaBattery
            }];
            this.setupActiveTargets();
            this.stage.addChild(this.enemy_turret_alpha.sprite, this.enemy_turret_delta.sprite, this.enemy_turret_omega.sprite);
            this.stage.addChild(this.enemyground);
            this.stage.addChild(this.smoke.sprite, this.enemyCity1.sprite, this.enemyCity2.sprite, this.enemyCity3.sprite, this.enemyCity4.sprite, this.enemyCity5.sprite, this.enemyCity6.sprite);
            this.stage.addChild(this.city1.sprite, this.city2.sprite, this.city3.sprite, this.city4.sprite,
                this.city5.sprite, this.city6.sprite);
            this.stage.addChild(a, this.grass);
            this.stage.addChild(this.alphaBattery.sprite, this.deltaBattery.sprite, this.omegaBattery.sprite);
            this.stage.addChild(this.scoreBoard.sprite);
            this.isMultiplayer ? (this.scoreBoard.setVisible(!1), this.scoreBoard.showLaunch()) : this.scoreBoard.hideLaunch();
            this.scoreBoard.setType(this.isMultiplayer);
            this.scoreScreen = new g.currentGame.ScoreScreen(this.spritesheet);
            this.scoreScreen.sprite.x = this.w - this.scoreScreen.width >> 1;
            this.scoreScreen.sprite.y =
                this.h - this.scoreScreen.height >> 1;
            this.endScreen = new g.currentGame.EndScreen;
            this.endScreen.sprite.x = this.w - this.endScreen.width >> 1;
            this.endScreen.sprite.y = this.h - this.endScreen.height >> 1;
            this.scoreScreen.sprite.alpha = 0;
            this.endScreen.hide();
            this.stage.addChild(this.endScreen.sprite);
            this.isMultiplayer && (this.stage.addChild(this.ICBMDoor.sprite), this.ICBMDoor.sprite.x = 650, this.ICBMDoor.sprite.y = this.h - this.ICBMDoor.height - 25, a = this.stage.getChildIndex(this.grass), this.stage.setChildIndex(this.ICBMDoor.sprite,
                a + 1));
            this.stage.addChild(this.scoreScreen.sprite);
            a = new Shape;
            b = a.graphics;
            b.beginFill("#FF0099");
            b.drawRect(0, 0, this.w, this.h);
            b.endFill();
            b = new Container;
            this.stage.addChild(b);
            this.hitArea = new Shape;
            this.hitArea.hitArea = a;
            this.hitArea.onPress = Atari.proxy(this.handleMouseDown, this);
            this.stage.addChild(this.hitArea)
        },
        getRandomPts: function(a, b) {
            for (var c = [], d, f = a, e = 0; e < f; e++) d = this.frontRow.splice(Math.random() * this.frontRow.length | 0, 1)[0], c.push({
                label: "front",
                data: d
            });
            f = b;
            for (e = 0; e < f; e++) d = this.backRow.splice(Math.random() *
                this.backRow.length | 0, 1)[0], c.push({
                label: "back",
                data: d
            });
            return c
        },
        setupActiveTargets: function() {
            this.scoreBoard.updateLevels(this.levelManager.currentLevel + 1);
            this.missilesArr = [this.alphaBattery, this.deltaBattery, this.omegaBattery];
            if (this.isMultiplayer) this.cities = [], this.cities = this.cities.concat(this.allCitiesArr, this.missilesArr);
            else {
                for (var a = [], b, c = Math.max(0, 3 - (this.levelManager.currentLevel / 5 | 0)), d = 5; d >= c; d--) b = this.citiesArr.splice(Math.random() * d | 0, 1)[0], a.push(b);
                this.cities = a.concat(this.missilesArr)
            }
        },
        shootMissileAt: function(a, b, c, d) {
            m = new g.currentGame.Missile(a, b, c, d, 25, null, "mine", this.spritesheet);
            this.playSound("fire");
            m.friendly = !0;
            this.stage.addChild(m.container);
            a = this.stage.getChildIndex(this.enemyground) + 2;
            this.stage.setChildIndex(m.container, a);
            this.stage.setChildIndex(m.sprite, a);
            this.isMultiplayer && (this.friendlyMissile = !0, this.friendlyMissiles.push(m));
            this.missiles.push(m)
        },
        gameOver: function() {},
        checkSurroundingCities: function(a, b) {
            for (var c, d = 0; d < this.allCitiesArr.length; d++)
                if (c =
                    this.allCitiesArr[d], !c.isDead) {
                    var f = c.sprite.x + (c.sprite.width - 66 >> 1) + 30 - a,
                        e = c.sprite.y + (c.sprite.height - 108 >> 1) + 108 - b;
                    120 > Math.sqrt(f * f + e * e) && c.indirectHit()
                }
        },
        handleFire: function(a) {
            this.icbm || (this.incomingMissileType = a.type, this.incomingMissileLevel = a.level, this.icbm = new g.currentGame.ICBMMissile(720, 591, 720, 0, 10, "mine", this.spritesheet), this.icbm.setType(this.incomingMissileType), this.playSound("launchICBM"), this.stage.addChild(this.icbm.container), a = this.stage.children.length - 1, this.stage.setChildIndex(this.icbm.container,
                a), this.stage.setChildIndex(this.icbm.sprite, a), this.icbmLaunch = !0, this.ICBMDoor.open())
        },
        fireAttachICBM: function() {
            if (null != this.icbm_attack) {
                var a = this.icbm_attack,
                    b = a.missile,
                    c = this.icbm_attack.sprite.graphics;
                c.clear();
                c.setStrokeStyle(1);
                c.beginStroke(e.FRIENDLY_SMOKE_COLOR);
                var d = a.currentTick * a.speed,
                    f = a.startX + d * a.ratioX,
                    g = a.startY + d * a.ratioY;
                a.lastPosition = new Point(b.x, b.y);
                a.position = new Point(f, g);
                a.run();
                c.moveTo(a.startX, a.startY);
                c.lineTo(f, g);
                b.x = f;
                b.y = g;
                1 == a.emp.alpha && (a.emp.x = f,
                    a.emp.y = g, a.emp.regX = a.width >> 1, a.emp.regY = a.height >> 1);
                b.regX = a.width >> 1;
                b.regY = a.height >> 1;
                c = Math.atan2(b.y - a.startY, b.x - a.startX);
                "enemy" != a.owner && (b.rotation = 180 * c / Math.PI + 90);
                a.tail.x = f - Math.cos(c) + 5;
                a.tail.y = g - Math.cos(c) + 5;
                a.nose.x = f + 35 * Math.cos(c);
                a.nose.y = g + 35 * Math.sin(c);
                a.exposionPosition = new Point(f + 15 * Math.cos(c), g + 15 * Math.sin(c));
                a.currentTick += this.tickFactor;
                if (d > a.distance - 5) {
                    this.stage.removeChild(a.container);
                    this.icbm_attack = null;
                    b = new BitmapAnimation(this.spritesheet);
                    b.onAnimationEnd =
                        Atari.proxy(this.handleICBMComplete, this);
                    b.gotoAndPlay("explosion");
                    b.x = f - 150;
                    b.y = a.targetY;
                    1 == this.incomingMissileType && this.killCity(a.targetCity);
                    if (2 == this.incomingMissileType) {
                        d = this.activeBatteries();
                        a = [];
                        for (f = g = 0; f < this.incomingMissileLevel; f++) g = Math.floor(Math.random() * d.length), a.push(d.splice(g, 1)[0]);
                        this.enemiesStun = [];
                        this.playSound("stun");
                        for (f = 0; f < a.length; f++) d = a[f], null != d && (d.stunBattery(25 * this.levelManager.currentLevel / 2), this.enemiesStun.push(d.name));
                        a.length && (this.stunIneffect = !0)
                    }
                    3 == this.incomingMissileType && this.killEverything();
                    this.missileTrailsContainer.getChildAt(0).graphics.clear();
                    this.missileTrailsContainer.getChildAt(1).graphics.clear();
                    this.icbmIncoming = !1;
                    this.clearOtherICBMTrail = this.clearMyICBMTrail = !0;
                    this.stage.addChild(b);
                    this.incomingMissileType = this.incomingMissileLevel = 0
                }
            }
        },
        killEverything: function() {
            this.alphaBattery.hit();
            this.omegaBattery.hit();
            this.deltaBattery.hit();
            for (var a = this.allCitiesArr.length, b = 0; b < a; b++) {
                var c = this.allCitiesArr[b];
                c.hit();
                this.killCity(c)
            }
            a = this.planes.length;
            for (b = 0; b < a; b++) c = this.planes[b], c = c.ref, c.kill(), this.stage.removeChild(c.sprite);
            a = this.satellites.length;
            for (b = 0; b < a; b++) c = this.satellites[b], c = c.ref, c.kill(), this.stage.removeChild(c.sprite);
            for (b = this.explosions.length - 1; 0 <= b; b--) a = this.explosions.splice(b, 1)[0].ref, this.stage.removeChild(a.sprite);
            for (b = this.missiles.length - 1; 0 <= b; b--) a = this.missiles.splice(b, 1)[0], this.stage.removeChild(a.container);
            this.totalCities = 0
        },
        activeBatteries: function() {
            for (var a = [], b = this.batteries.length, c, d = 0; d < b; d++) c = this.batteries[d].data, c.isKilled || a.push(c);
            return a
        },
        handleICBMComplete: function(a) {
            this.stage.removeChild(a)
        },
        fireICBM: function(a) {
            if (null != this.icbm) {
                var b = this.icbm,
                    c = b.missile,
                    d = this.icbm.sprite.graphics;
                d.clear();
                d.setStrokeStyle(1);
                d.beginStroke(e.FRIENDLY_SMOKE_COLOR);
                var f = b.currentTick * b.speed,
                    g = b.startX + f * b.ratioX,
                    h = b.startY + f * b.ratioY;
                b.lastPosition = new Point(c.x, c.y);
                b.position = new Point(g, h);
                b.run();
                d.moveTo(b.startX, b.startY);
                d.lineTo(g, h);
                c.x = g;
                c.y = h;
                1 == b.emp.alpha && (b.emp.x = g, b.emp.y = h, b.emp.regX = b.width >> 1, b.emp.regY = b.height >> 1);
                c.regX = b.width >> 1;
                c.regY = b.height >> 1;
                b.currentTick += a;
                f > b.distance - 5 && (this.stage.removeChild(b.container), this.ICBMDoor.close(), this.icbm = null, this.icbmFired = !0, this.icbmLaunch = !1)
            }
        },
        drawEnemyICBMTrail: function(a, b, c, d) {
            var f = this.missileTrailsContainer.getChildAt(0).graphics;
            f.clear();
            f.setStrokeStyle(1);
            f.beginStroke("#FFFFFF");
            f.moveTo(a, b);
            f.lineTo(c, d)
        },
        drawMyICBMTrail: function(a, b, c, d) {
            var f = this.missileTrailsContainer.getChildAt(1).graphics;
            f.clear();
            f.setStrokeStyle(1);
            f.beginStroke("#FFFFFF");
            f.moveTo(a, b);
            f.lineTo(c, d)
        },
        movePlanes: function(a) {
            for (var b, c, d, f, e = 0; e < this.planes.length; e++) b = this.planes[e], b = b.ref, c = b.currentTick * b.speed, d = b.startX + c * b.ratioX, f = b.startY + c * b.ratioY, b.run(), this.fireFromPlane(b, d, f), b.position = new Point(d, f), b.currentTick += a, b.sprite.x = d, b.exposionPosition = new Point(d, f), c > b.distance - 5 && (b.kill(), this.stage.removeChild(b.sprite), this.planes.splice(e, 1))
        },
        moveSatellites: function(a) {
            for (var b, c, d, f, e = this.satellites.length -
                    1; 0 <= e; e--) b = this.satellites[e], f = b.ref, b = f.currentTick * f.speed, c = f.startX + b * f.ratioX, d = f.startY + b * f.ratioY, f.position = new Point(c, d), f.currentTick += a, f.sprite.x = c, f.run(), f.exposionPosition = new Point(c, d), b > f.distance - 15 && (f.kill(), this.stage.removeChild(f.sprite), this.satellites.splice(e, 1))
        },
        fireMissile: function() {
            for (var a = this.missiles.length, b, c, d, f, k, h, i, j, l = 0; l < a; l++)
                if (b = this.missiles[l], null != b)
                    if (c = b.missile, d = b.sprite, f = d.graphics, f.clear(), f.setStrokeStyle(1), j = "enemy" == b.owner, d = e.FRIENDLY_SMOKE_COLOR,
                        f.beginStroke(d), k = b.currentTick * b.speed, d = b.startX + k * b.ratioX, h = b.startY + k * b.ratioY, b.lastPosition = new Point(c.x, c.y), b.position = new Point(d, h), b.run(), f.moveTo(b.startX, b.startY), f.lineTo(d, h), c.x = d, c.y = h, j ? (c.regX = 7.5, c.regY = 38) : (c.regX = 5.5, c.regY = 21), f = c.x - b.startX, i = c.y - b.startY, f = Math.atan2(i, f), j = j ? -90 : 90, c.rotation = 180 * f / Math.PI + j, b.tail.x = d - Math.cos(f) + 5, b.tail.y = h - Math.cos(f) + 5, b.nose.x = d + 35 * Math.cos(f), b.nose.y = h + 35 * Math.sin(f), b.exposionPosition = new Point(d + 15 * Math.cos(f), h + 15 * Math.sin(f)),
                        b.currentTick += this.tickFactor, b.targetCity && k > b.distance - 5)
                        if (b.targetCity && this.cityStanding(b.targetCity)) {
                            this.total++;
                            this.killCity(b.targetCity);
                            c = b.targetCity;
                            this.missiles.splice(l, 1);
                            b.hit(this.lowQuality);
                            this.stage.removeChild(b.container);
                            this.checkSurroundingCities(d, h);
                            d = c.sprite.y + c.height / 2 + 5;
                            if ("alphaBattery" == b.targetCity.name || "omegaBattery" == b.targetCity.name || "deltaBattery" == b.targetCity.name) d += 45, this.turrentHit || (this.turrentHit = !0, "alphaBattery" == b.targetCity.name ? this.smoke.addPoint({
                                label: "front",
                                data: this.frontRow[0]
                            }) : "omegaBattery" == b.targetCity.name ? this.smoke.addPoint({
                                label: "front",
                                data: this.frontRow[2]
                            }) : "deltaBattery" == b.targetCity.name && this.smoke.addPoint({
                                label: "front",
                                data: this.frontRow[1]
                            }));
                            c = new g.currentGame.Explosion(b.targetX, d);
                            this.recordExpolsion = !0;
                            this.currentExplosion = new g.currentGame.Explosion(b.targetX, d, 40, 40, "#363737");
                            this.stage.addChild(c.sprite);
                            this.playSound("explosion");
                            this.explosions.push({
                                ref: c
                            })
                        } else if ("alphaBattery" == b.targetCity.name || "omegaBattery" ==
                b.targetCity.name || "deltaBattery" == b.targetCity.name) {
                if (k > b.distance + 15 || 0 > c.x || c.x > this.w - 10) this.total++, this.missiles.splice(l, 1), b.hit(this.lowQuality), this.stage.removeChild(b.container), this.checkSurroundingCities(d, h), c = new g.currentGame.Explosion(d, h), this.recordExpolsion = !0, this.currentExplosion = new g.currentGame.Explosion(d, h), this.stage.addChild(c.sprite), this.playSound("explosion"), this.explosions.push({
                    ref: c
                })
            } else k > b.distance + 50 && (this.total++, this.missiles.splice(l, 1), b.hit(this.lowQuality),
                this.stage.removeChild(b.container), this.checkSurroundingCities(d, h), c = new g.currentGame.Explosion(d, h), this.recordExpolsion = !0, this.currentExplosion = new g.currentGame.Explosion(d, h), this.stage.addChild(c.sprite), this.playSound("explosion"), this.explosions.push({
                    ref: c
                }));
            else k >= b.distance && (this.missiles.splice(l, 1), this.stage.removeChild(b.container), c = new g.currentGame.Explosion(b.targetX, b.targetY, 40, 40), this.stage.addChild(c.sprite), this.playSound("explosion"), this.explosions.push({
                    ref: c
                }), this.isMultiplayer &&
                (this.recordExpolsion = !0, this.currentExplosion = new g.currentGame.Explosion(b.targetX, b.targetY, 40, 40, null, "#363737")))
        },
        killExplosionEffect: function(a) {
            this.stage.removeChild(a)
        },
        cityStanding: function(a) {
            for (var b = !1, c = this.cities.length, d, f = 0; f < c; f++)
                if (d = this.cities[f], d.name == a.name) {
                    b = !0;
                    break
                }
            return b
        },
        killCity: function(a) {
            for (var b = this.cities.length, c = this.killedCities.length, d, f = 0; f < c; f++)
                if (d = this.killedCities[f], d == a.name) return;
            for (d = 0; d < b; d++)
                if (c = this.cities[d], c.name == a.name) {
                    "City" ==
                    a.type ? (this.totalCities--, this.killedCities.push(a.name), this.isMultiplayer && ("city1" == a.name ? (this.currentEnemyCity = this.enemyCity1, this.enemyCityHit = !0) : "city2" == a.name ? (this.currentEnemyCity = this.enemyCity2, this.enemyCityHit = !0) : "city3" == a.name ? (this.currentEnemyCity = this.enemyCity3, this.enemyCityHit = !0) : "city4" == a.name ? (this.currentEnemyCity = this.enemyCity4, this.enemyCityHit = !0) : "city5" == a.name ? (this.currentEnemyCity = this.enemyCity5, this.enemyCityHit = !0) : "city6" == a.name && (this.currentEnemyCity =
                        this.enemyCity6, this.enemyCityHit = !0)), this.removeCount++) : (a.isKilled || this.totalTurrets--, this.isMultiplayer && ("alphaBattery" == c.name ? this.isEnemyTurretHit_alpha = !0 : "deltaBattery" == c.name ? this.isEnemyTurretHit_delta = !0 : "omegaBattery" == c.name && (this.isEnemyTurretHit_omega = !0)));
                    a.hit();
                    this.playSound("cityHit");
                    break
                }
        },
        runExplosion: function() {
            for (var a, b, c, d, f, e = 0; e < this.explosions.length; e++)
                if (a = this.explosions[e], b = a.ref, null != b) {
                    c = b.sprite;
                    a = c.graphics;
                    a.clear();
                    a.beginFill(b.color);
                    b.radius =
                        b.mag * (1 - Math.abs(b.currentTick - b.duration) / b.duration);
                    b.currentTick += this.tickFactor;
                    a.drawCircle(b.startX, b.startY, b.radius);
                    a.endFill();
                    0 > b.radius && (this.explosions.splice(e, 1), null != this.icbm_attack && (this.icbm_attack.hasHit = !1), this.stage.removeChild(c));
                    if (null != this.icbm_attack) {
                        a = this.icbm_attack.missile.x - b.startX;
                        d = this.icbm_attack.missile.y - b.startY;
                        a = Math.sqrt(a * a + d * d);
                        d = this.icbm_attack.tail.x - b.startX;
                        var h = this.icbm_attack.tail.y - b.startY;
                        d = Math.sqrt(d * d + h * h);
                        if (a <= b.radius || d <= b.radius) this.icbm_attack.hasHit ||
                            (this.icbm_attack.hit(this.lowQuality), this.icbm_attack.hasHit = !0), 0 >= this.icbm_attack.hitCount && (this.stage.removeChild(this.icbm_attack.container), this.missileTrailsContainer.getChildAt(0).graphics.clear(), this.missileTrailsContainer.getChildAt(1).graphics.clear(), this.clearMyICBMTrail = !0, this.icbm_attack = null)
                    }
                    c = this.planes.length;
                    for (c = this.planes.length - 1; 0 <= c; c--) {
                        a = this.planes[c];
                        f = a.ref;
                        a = f.sprite.x - b.startX;
                        d = f.sprite.y - b.startY;
                        a = Math.sqrt(a * a + d * d);
                        d = f.sprite.localToGlobal(f.nose.x, f.nose.y);
                        h = d.x - b.startX;
                        d = d.y - b.startY;
                        h = Math.sqrt(h * h + d * d);
                        d = f.sprite.localToGlobal(f.tail.x, f.tail.y);
                        var i = d.x - b.startX,
                            j = d.y - b.startY,
                            i = Math.sqrt(i * i + j * j);
                        if (a <= b.radius || h < b.radius || i < b.radius) f.exposionPosition = new Point(d.x, d.y), f.hit(this.lowQuality), this.planes.splice(c, 1), a = 1, this.setScore(100 * a * this.levelManager.scoringMultiplier), this.comboCount++, b = new g.currentGame.Explosion(f.sprite.x, f.sprite.y), this.explosions.push({
                            ref: b
                        }), this.stage.addChild(b.sprite), this.stage.removeChild(f.sprite)
                    }
                    c =
                        this.satellites.length;
                    for (c -= 1; 0 <= c; c--)
                        if (a = this.satellites[c], f = a.ref, a = f.sprite.x - b.startX, d = f.sprite.y - b.startY, a = Math.sqrt(a * a + d * d), d = f.sprite.localToGlobal(f.nose.x, f.nose.y), h = d.x - b.startX, d = d.y - b.startY, h = Math.sqrt(h * h + d * d), d = f.sprite.localToGlobal(f.tail.x, f.tail.y), i = d.x - b.startX, j = d.y - b.startY, i = Math.sqrt(i * i + j * j), a <= b.radius || h < b.radius || i < b.radius) f.exposionPosition = new Point(d.x, d.y), f.hit(this.lowQuality), this.satellites.splice(c, 1), this.comboCount++, this.setScore(100 * b.depth * this.levelManager.scoringMultiplier),
                            this.stage.removeChild(f.sprite), b = new g.currentGame.Explosion(f.sprite.x, f.sprite.y), this.explosions.push({
                                ref: b
                            }), this.stage.addChild(b.sprite);
                    for (c = this.missiles.length - 1; 0 <= c; c--)
                        if (a = this.missiles[c], !a.friendly && (f = a.nose.x - b.startX, d = a.nose.y - b.startY, f = Math.sqrt(f * f + d * d), d = a.tail.x - b.startX, h = a.tail.y - b.startY, d = Math.sqrt(d * d + h * h), f <= b.radius || d <= b.radius)) this.missiles.splice(c, 1), a.hit(this.lowQuality), this.totalMissileKilled++, this.stage.removeChild(a.container), a = 64 * Math.random() + 191,
                            a = a << 16 | (0.5 * Math.random() + 0.5) * a << 8 | 0.25 * a, a = Graphics.getRGB(a >> 16, a >> 8 & 255, a & 255, 1), d = GameLibs.Math2.getRange(20, -20), b.depth++, f = b.startX + d, d = b.startY + d, h = Math.min(b.radius + 25 * b.depth, 70), i = Math.min(0.85 * h, 75), j = new g.currentGame.Explosion(f, d, h, 35, i, a, b.depth), j.sprite.alpha = 1 - b.depth / 10, this.stage.addChild(j.sprite), a = this.stage.getChildIndex(this.missile) - 1, this.stage.setChildIndex(j.sprite, a), this.playSound("explosion"), this.explosions.push({
                                ref: j
                            }), this.isMultiplayer && (this.recordExpolsion = !0, this.currentExplosion = new g.currentGame.Explosion(f, d, h, 35, i, (0).ENEMY_SMOKE_COLOR2, b.depth)), this.setScore(25 * b.depth * this.levelManager.scoringMultiplier), this.comboCount++, 1 < b.depth && (this.comboCount += b.depth)
                }
        },
        runEnemyExplosion: function(a) {
            for (var b, c, d, f = this.enemyExplosions.length - 1; 0 <= f; f--) b = this.enemyExplosions[f], null != b && (d = b.sprite, c = d.graphics, c.clear(), c.beginFill(b.color), b.radius = b.mag * (1 - Math.abs(b.currentTick - b.duration) / b.duration), b.currentTick += a, c.drawCircle(b.startX, b.startY,
                b.radius), c.endFill(), 0 > b.radius && (this.enemyExplosions.splice(f, 1), this.damageContainer.removeChild(d)))
        },
        getSection: function(a) {
            this.slice = this.w / 3;
            a >= 2 * this.slice ? (this.selectedWeapon = "omegaBattery", this.currentWeapon = this.omegaBattery) : a >= this.slice && a < 2 * this.slice ? (this.selectedWeapon = "deltaBattery", this.currentWeapon = this.deltaBattery) : 0 <= a && a < this.slice && (this.selectedWeapon = "alphaBattery", this.currentWeapon = this.alphaBattery)
        },
        updateStatus: function() {
            this.omegaBattery.updateStatus();
            this.deltaBattery.updateStatus();
            this.alphaBattery.updateStatus()
        },
        checkSection: function(a) {
            var b = 0,
                c = 0,
                d;
            this.slice = this.w / 3;
            this.mainTarget ? a >= 2 * this.slice ? (a = this.omegaBattery.sprite.x, b = this.omegaBattery.sprite.y, d = this.stage.localToGlobal(a, b), d.x += this.omegaBattery.width / 2) : a >= this.slice && a < 2 * this.slice ? (a = this.deltaBattery.sprite.x, b = this.deltaBattery.sprite.y, d = this.stage.localToGlobal(a, b), d.x += this.deltaBattery.width / 2) : 0 <= a && a < this.slice && (a = this.alphaBattery.sprite.x, b = this.alphaBattery.sprite.y, d = this.stage.localToGlobal(a,
                b), d.x += this.alphaBattery.width / 2) : (d = this.stage.localToGlobal(this.useTarget.sprite.x, this.useTarget.sprite.y), d.x += this.useTarget.width / 2);
            b = d.x;
            c = d.y - this.offsetY;
            return new Point(b, c)
        },
        setRotations: function(a) {
            for (var b = this.batteries.length, c, d, f = 0; f < b; f++) c = this.batteries[f], d = c.data, d.rotationOn = c.label == a ? !0 : !1
        },
        playSound: function(a, b) {
            var c = SoundJS.play(a);
            null != b && c.setVolume(b);
            return c
        },
        handleMouseDown: function(a) {
            this.currentStageX = a.rawX;
            this.currentStageY = a.rawY;
            this.currentMouseX =
                a.stageX;
            this.currentMouseY = a.stageY;
            this.touchList.push(a)
        },
        prepareMissile: function() {
            if (!this.levelManager.isLevelComplete && 0 != this.totalTurrets)
                if (this.getSection(this.currentStageX, this.currentStageY), !this.currentWeapon.weaponDead && !this.currentWeapon.isKilled && this.currentWeapon.turnOn) {
                    this.mainTarget = !0;
                    var a = this.currentWeapon.fire(this.tickFactor);
                    this.checkSection(this.currentStageX, this.currentStageY);
                    a && (a = this.currentWeapon.hitArea.localToGlobal(0, 0), this.shootMissileAt(a.x, a.y, this.currentStageX,
                        this.currentStageY))
                } else {
                    this.mainTarget = !1;
                    var b = this.getBackupWeapon();
                    null != b && (this.checkSection(this.stage.mouseX, this.stage.mouseY), a = b.isKilled || b.isDead || b.weaponDead, a || (a = b.hitArea.localToGlobal(0, 0), this.shootMissileAt(a.x, a.y, this.currentStageX, this.currentStageY)))
                }
        },
        fireBackUp: function(a, b) {
            var c = null;
            !a.overHeatted && !a.isKilled ? (this.useTarget = a, a.fire(this.tickFactor), this.setRotations(a.name), c = a) : !b.overHeatted && !b.isKilled && (this.useTarget = b, this.setRotations(b.name), b.fire(this.tickFactor),
                c = b);
            return c
        },
        getBackupWeapon: function() {
            var a = null;
            switch (this.selectedWeapon) {
                case "alphaBattery":
                    a = this.fireBackUp(this.deltaBattery, this.omegaBattery);
                    break;
                case "deltaBattery":
                    a = this.fireBackUp(this.alphaBattery, this.omegaBattery);
                    break;
                case "omegaBattery":
                    a = this.fireBackUp(this.deltaBattery, this.alphaBattery)
            }
            return a
        },
        fireFromPlane: function(a, b) {
            if (a.currentTick >= a.dropTime && !a.hasFired) {
                a.hasFired = !0;
                for (var c, d, f, e, h, i, j = 0; 3 > j; j++) {
                    c = Math.random() * this.cities.length | 0;
                    c = this.cities[c];
                    if (null ==
                        c) break;
                    d = c.sprite;
                    f = !0;
                    if ("alphaBattery" == c.name || "omegaBattery" == c.name || "deltaBattery" == c.name) f = !1;
                    e = d.x + (d.width - 50 >> 1);
                    e = GameLibs.Math2.getRange(e - -10, e + 50 + -10);
                    d = f ? d.y + d.height / 2 : d.y + d.height;
                    f = this.levelManager.getMissileSpeed(!1);
                    h = -1 == a.direction ? b + a.width / 2 : b;
                    i = a.sprite.y + a.height / 2;
                    c = new g.currentGame.Missile(h, i, e, d, f, c, "enemy", this.spritesheet);
                    this.stage.addChild(c.container);
                    this.missiles.push(c)
                }
            }
        },
        createPlane: function() {
            if (!(4 > this.levelManager.currentLevel)) {
                var a = Math.min(2.5,
                        this.levelManager.getMissileSpeed()),
                    b = 0.5 > Math.random() ? 1 : -1,
                    c = 1 == b ? this.w : 0,
                    a = new g.currentGame.Plane(c, 0, 1 == b ? 0 : this.w, 0, a, this.spritesheet);
                a.setDirection(b);
                a.sprite.regX = a.width >> 1;
                a.sprite.regY = a.height >> 1;
                a.sprite.x = c;
                a.sprite.y = GameLibs.Math2.getRange(50, Math.min(50 + 25 * (this.levelManager.currentLevel - 4), 300));
                a.sprite.scaleX = -1 == b ? -1 * a.sprite.scaleX : 1 * a.sprite.scaleX;
                this.stage.addChild(a.sprite);
                this.planes.push({
                    ref: a
                })
            }
        },
        createSatellite: function() {
            if (!(2 > this.levelManager.currentLevel)) {
                var a =
                    Math.min(2.5, this.levelManager.getMissileSpeed()),
                    b = 0.5 > Math.random() ? 1 : -1,
                    c = 1 == b ? this.w : 0,
                    a = new g.currentGame.Satellite(c, 0, 1 == b ? 0 : this.w, 0, a, this.spritesheet);
                a.setDirection(b);
                a.sprite.regX = a.width >> 1;
                a.sprite.regY = a.height >> 1;
                a.sprite.x = c;
                a.sprite.y = 250 * Math.random() + 50;
                this.stage.addChild(a.sprite);
                this.satellites.push({
                    ref: a
                })
            }
        },
        tick: function(a) {
            this.tickFactor = a;
            this.touchList.length && (this.prepareMissile(), this.touchList = []);
            this.lowQuality || this.smoke.tick(a);
            this.gameInfo.touchEnabled ? (this.alphaBattery.tick(this.currentMouseX,
                this.currentMouseY), this.deltaBattery.tick(this.currentMouseX, this.currentMouseY), this.omegaBattery.tick(this.currentMouseX, this.currentMouseY)) : (this.alphaBattery.tick(this.stage.mouseX, this.stage.mouseY), this.deltaBattery.tick(this.stage.mouseX, this.stage.mouseY), this.omegaBattery.tick(this.stage.mouseX, this.stage.mouseY));
            this.updateStatus();
            this.killGame || this.runExplosion(a);
            this.isMultiplayer && (this.runEnemyExplosion(a), this.levelManager.levelTime += a, this.levelManager.currentLevel = 5 + this.levelManager.levelTime /
                1200 | 0);
            0 == --this.levelManager.nextPlane && (a = 0.5, 0 != this.missiles.length && 0 != this.totalCities && (a += 0.1 * (this.levelManager.currentLevel - 4), 0.5 < Math.random() * Math.min(1, a) ? this.createPlane() : this.createSatellite()), this.levelManager.nextPlane = e.PLANE_MISSILE_COUNT / Math.max(1, a));
            if (0 == --this.levelManager.nextMissile && !this.killGame)
                if (0 != this.cities.length) {
                    var a = Math.random() * this.cities.length | 0,
                        a = this.cities[a],
                        b = a.sprite,
                        c = Math.random() * this.w,
                        d = !0;
                    if ("alphaBattery" == a.name || "omegaBattery" == a.name ||
                        "deltaBattery" == a.name) d = !1;
                    this.levelManager.missileCreateCount++;
                    var f = b.x + (b.width - 50 >> 1),
                        f = GameLibs.Math2.getRange(f - -10, f + 50 + -10),
                        b = d ? b.y + b.height / 2 : b.y + b.height,
                        d = this.levelManager.getMissileSpeed(!0),
                        a = new g.currentGame.Missile(c, 0, f, b, d, a, "enemy", this.spritesheet);
                    a.friendly = !1;
                    Math.random() * Math.min(0.6, 0.03 * this.levelManager.currentLevel - 0.1) && (a.speed /= 1.5, a.split = 10 + 0.65 * (Math.random() * a.distance / a.speed) | 0);
                    this.currentEnemy = a;
                    this.enemyFired = !0;
                    this.stage.addChild(a.container);
                    this.stage.setChildIndex(this.scoreBoard.sprite,
                        this.stage.children.length - 1);
                    this.missiles.push(a);
                    0 < --this.levelManager.incomingMissiles && this.levelManager.nextMissileFire()
                } else this.levelManager.incomingMissiles = 0;
            this.killGame || (this.movePlanes(this.tickFactor), this.moveSatellites(this.tickFactor), this.fireMissile(this.tickFactor));
            this.isMultiplayer ? (this.fireICBM(this.tickFactor), this.fireAttachICBM(this.tickFactor), this.moveEnemyTurrets(), this.scoreBoard.setProgress(this.comboCount), this.comboCount = 0) : this.scoreBoard.update(this.totalMissileKilled /
                this.levelManager.actualCount, this.levelManager.actualCount - this.levelManager.missileCreateCount, this.totalMissileKilled);
            this.isMultiplayer && 0 == this.totalCities && !this.killGame ? (this.gameHasEnded = !0, this.gameLogic = !1, this.killGame = !0, this.levelManager.incomingMissiles = -10, this.stage.setChildIndex(this.popup.sprite, this.stage.children.length - 1), this.killEverything(), this.endGame()) : this.gameLogic && (0 == this.totalCities && 0 == this.missiles.length ? this.endGame() : 0 == this.levelManager.incomingMissiles &&
                (0 == this.missiles.length && !this.isMultiplayer) && (this.isMultiplayer || this.tallyScore()))
        },
        moveEnemyTurrets: function() {
            this.enemy_turret_alpha.update();
            this.enemy_turret_delta.update();
            this.enemy_turret_omega.update()
        },
        endLevel: function() {
            this.gameLogic = !1;
            for (var a = [], b, c = 0; c < this.removeCount; c++) b = this.citiesArr.splice(Math.random() * c | 0, 1)[0], null != b && a.push(b);
            for (c = this.cities.length - 1; 0 <= c; c--) b = this.cities[c], "City" != b.type && this.cities.splice(c, 1);
            a = this.cities.concat(a);
            this.cities = a.concat(this.missilesArr);
            a = this.missilesArr.length;
            for (c = 0; c < a; c++) this.missilesArr[c].restore();
            this.totalTurrets = 3;
            Tween.get(this.scoreScreen.sprite).to({
                alpha: 0
            }, 500).wait(5E3).call(this.moveToNextLevel, null, this);
            c = this.levelManager.currentLevel + 1;
            this.isMultiplayer || (this.popup.setText("Level " + c), this.popup.show(1500, 2E3), this.stage.setChildIndex(this.popup.sprite, this.stage.children.length - 1));
            this.hitArea.onPress = null
        },
        moveToNextLevel: function() {
            this.totalMissileKilled = 0;
            this.levelManager.missileCreateCount = 0;
            this.playSound("passLevel");
            this.scoreBoard.updateLevels(this.levelManager.currentLevel + 1);
            this.hitArea.onPress = Atari.proxy(this.handleMouseDown, this);
            this.levelManager.continueGame();
            this.gameLogic = !0
        },
        endGame: function() {
            this.levelManager.missileCreateCount = 0;
            this.gameLogic = !1;
            this.stage.setChildIndex(this.endScreen.sprite, this.stage.getNumChildren() - 1);
            this.totalTurrets = 3;
            this.totalCities = 6;
            this.mainTarget = !0;
            this.hitArea.onPress = null;
            this.levelManager.gameOver();
            this.cleanUp();
            this.gameIsComplete ? Tween.get(this).wait(1500).call(this.delayGameEndComplete,
                null, this) : (this.endGameSound = this.playSound("endGame"), Tween.get(this).wait(1500).call(this.showGameEnd, null, this))
        },
        showGameEnd: function() {
            Tween.get(this).wait(2E3).call(this.delayGameEnd, null, this)
        },
        delayGameEndComplete: function() {
            this.killGame = !1;
            this.onGameComplete()
        },
        delayGameEnd: function() {
            this.killGame = !1;
            this.onGameOver()
        },
        handleRestartGame: function() {
            this.totalMissileKilled = this.levelManager.missileCreateCount = 0;
            this.scoreBoard.updateLevels(this.levelManager.currentLevel + 1);
            this.gameLogic = !0;
            this.levelManager.startLevel();
            this.setupLayout()
        },
        tallyScore: function() {
            for (var a = this.planes.length, b, c = 0; c < a; c++) b = this.planes[c], b = b.ref, null != b && (b.kill(), this.stage.removeChild(b.sprite));
            a = this.satellites.length;
            for (c = 0; c < a; c++) b = this.satellites[c], b = b.ref, null != b && (b.kill(), this.stage.removeChild(b.sprite));
            this.satellites = [];
            this.planes = [];
            this.levelManager.isLevelComplete || (this.onLevelComplete(), this.smoke.removePoint(), this.turrentHit = !1, Tween.get(this.scoreScreen.sprite, {
                override: !0
            }).to({
                    alpha: 1
                },
                500).wait(5E3).call(this.endLevel, null, this), this.levelManager.levelComplete(), a = this.levelManager.currentLevel, a = 1E3 * this.totalTurrets * a + 500 * this.totalCities * a, this.stage.setChildIndex(this.scoreScreen, this.stage.children.length - 1), this.scoreScreen.setData({
                level: this.levelManager.currentLevel,
                cityCount: this.totalCities,
                score: a,
                missileCount: this.totalTurrets
            }), this.scoreManager.addScore(a))
        },
        setScore: function(a) {
            this.score = a;
            this.scoreManager.addScore(this.score)
        },
        cleanUp: function() {
            for (var a = this.missilesArr.length,
                    b, c = 0; c < a; c++) b = this.missilesArr[c], null != b && this.stage.removeChild(b.sprite);
            for (c = this.explosions.length - 1; 0 <= c; c--) a = this.explosions.splice(c, 1)[0].ref, this.stage.removeChild(a.sprite);
            for (c = this.missiles.length - 1; 0 <= c; c--) a = this.missiles.splice(c, 1)[0], this.stage.removeChild(a.container);
            a = this.citiesArr.length;
            for (c = 0; c < a; c++) b = this.citiesArr[c], null != b && this.stage.removeChild(b.sprite);
            a = this.planes.length;
            for (c = 0; c < a; c++) b = this.planes[c], b = b.ref, null != b && (b.kill(), this.stage.removeChild(b.sprite));
            a = this.satellites.length;
            for (c = 0; c < a; c++) b = this.satellites[c], b = b.ref, null != b && (b.kill(), this.stage.removeChild(b.sprite));
            this.stage.removeChild(this.enemy_turret_alpha.sprite);
            this.stage.removeChild(this.enemy_turret_delta.sprite);
            this.stage.removeChild(this.enemy_turret_omega.sprite);
            a = this.enemyCities.length;
            for (c = 0; c < a; c++) b = this.enemyCities[c], null != b && this.stage.removeChild(b.sprite);
            if (null != this.missileTrailsContainer) {
                a = this.missileTrailsContainer.getNumChildren();
                for (c = 0; c < a; c++) this.missileTrailsContainer.getChildAt(c).graphics.clear()
            }
            null !=
                this.icbm_attack && (this.stage.removeChild(this.icbm_attack.container), this.icbmIncoming = !1, this.icbm_attack = null);
            null != this.icbm && (this.stage.removeChild(this.icbm.sprite), this.icbm = null);
            this.missiles = [];
            this.planes = [];
            this.missilesArr = [];
            this.citiesArr = [];
            this.explosions = []
        },
        pause: function(a) {
            if (null != this.bgMusic) {
                a ? this.bgMusic.pause() : this.bgMusic.resume();
                for (var b = 0; b < this.planes.length; b++) this.planes[b].ref.pauseSound(a);
                for (b = 0; b < this.satellites.length; b++) this.satellites[b].ref.pauseSound(a)
            }
        },
        restart: function() {
            this.missiles = [];
            this.satellites = [];
            this.planes = [];
            this.explosions = [];
            this.enemyExplosions = [];
            this.enemyMissiles = [];
            this.totalTurrets = 3;
            this.totalCities = 6;
            this.gameLogic = !0;
            this.scoreManager.setScore(0);
            this.levelManager.gameOver();
            this.levelManager.startLevel();
            this.setupLayout()
        },
        getScore: function() {
            return new GameLibs.GameDetails(this.scoreManager.score, this.levelManager.currentLevel, 0)
        },
        destroy: function() {
            this.stage.removeAllChildren();
            this.tick = function() {};
            SoundJS.stop()
        },
        startGame: function() {
            this.bgMusic = SoundJS.play("bgMusic", null, 0, 0, -1);
            this.popup = new g.currentGame.Popup;
            this.popup.sprite.x = this.w - this.popup.sprite.width >> 1;
            this.popup.sprite.y = this.h - this.popup.sprite.height >> 1;
            this.stage.addChild(this.popup.sprite);
            this.stage.setChildIndex(this.popup.sprite, this.stage.getNumChildren() - 1);
            this.isMultiplayer || (this.popup.setText("Level " + (this.levelManager.currentLevel + 1)), this.popup.show(1500))
        },
        continueGame: function(a) {
            Atari.trace("Continue CALLED");
            1 == this.endScreen.sprite.alpha &&
                Tween.get(this.endScreen.sprite).to({
                    alpha: 0
                }, 250);
            a || this.scoreManager.setScore(0);
            this.handleRestartGame()
        },
        getGamePacket: function() {
            return null
        },
        sync: function() {},
        updatePlayers: function(a) {
            for (var b, c, d, e, g, h = 0, i = a.length; h < i; h++) b = a[h], -1 != b.events.indexOf("explosion") && (c = b.state, d = c.targetX, e = c.targetY, g = c.radius, c = c.duration, this.createEnemyExplosion(d, e, g, c, "#363737")), -1 != b.events.indexOf("ICBM") && (c = b.state, d = c.level, c = c.type, this.createIncomingICBM(c, d)), -1 != b.events.indexOf("omegaHit") &&
                this.enemy_turret_omega.hit(), -1 != b.events.indexOf("alphaHit") && this.enemy_turret_alpha.hit(), -1 != b.events.indexOf("deltaHit") && this.enemy_turret_delta.hit(), -1 != b.events.indexOf("enemyCityHit") && (c = b.state, this[c.enemyCity].hit()), -1 != b.events.indexOf("gameHasEnded") && (this.victorySound = this.playSound("victoryMusic"), this.levelManager.gameOver(), this.gameIsComplete = this.killGame = !0, this.endGame()), -1 != b.events.indexOf("launch") && (c = b.state, this.drawEnemyICBMTrail(c.mtx, c.mty, c.x, c.y)), -1 != b.events.indexOf("incoming") &&
                (c = b.state, this.drawMyICBMTrail(c.mtx, c.mty, c.x, c.y)), -1 != b.events.indexOf("clearTrail") && (c = this.missileTrailsContainer.getChildAt(0), d = this.missileTrailsContainer.getChildAt(1), c.graphics.clear(), d.graphics.clear()), -1 != b.events.indexOf("clearOtherTrail") && (c = this.missileTrailsContainer.getChildAt(0), d = this.missileTrailsContainer.getChildAt(1), c.graphics.clear(), d.graphics.clear()), b.events.indexOf("stunEnemies")
        },
        setLocalPoint: function(a, b) {
            return a.localToGlobal(b.x, b.y)
        },
        getFramePacket: function() {
            var a,
                b, c, d = this.framePacket;
            return this.recordExpolsion || this.icbmFired || this.hitBattery || this.hitCity || this.isEnemyTurretHit_omega || this.isEnemyTurretHit_delta || this.isEnemyTurretHit_alpha || this.gameHasEnded || this.gameHasEndedYouLose || this.icbmLaunch || this.icbmIncoming || this.clearOtherICBMTrail || this.clearMyICBMTrail || this.stunIneffect ? (d.events = "", d.state = {}, this.recordExpolsion && (this.recordExpolsion = !1, a = this.currentExplosion, d.events += "explosion,", d.state.targetX = a.startX, d.state.targetY = a.startY,
                    d.state.radius = a.radius, d.state.duration = a.duration, d.state.mag = a.mag, d.state.depth = a.depth, d.state.color = e.ENEMY_SMOKE_COLOR2), this.icbmLaunch && null != this.icbm && (d.events += "launch,", a = this.icbm.targetX - this.icbm.startX, b = this.icbm.targetY - this.icbm.startY, Math.sqrt(a * a + b * b), b = Math.atan2(b, a), a = Math.cos(b), c = Math.sin(b), b = this.icbm.currentTick * this.icbm.speed, _x = this.icbm.startX + b * a, a = this.icbm.startY + b * c, d.state.mtx = this.icbm.startX, d.state.mty = this.icbm.startY, d.state.x = _x, d.state.y = a), this.clearMyICBMTrail &&
                (this.clearMyICBMTrail = !1, d.events += "clearTrail,"), this.clearOtherICBMTrail && (this.clearOtherICBMTrail = !1, d.events += "clearOtherTrail,"), this.icbmIncoming && null != this.icbm_attack && (d.events += "incoming,", a = this.icbm_attack.targetX - this.icbm_attack.startX, b = this.icbm_attack.targetY - this.icbm_attack.startY, Math.sqrt(a * a + b * b), b = Math.atan2(b, a), a = Math.cos(b), c = Math.sin(b), b = this.icbm_attack.currentTick * this.icbm_attack.speed, _x = this.icbm_attack.startX + b * a, a = this.icbm_attack.startY + b * c, d.state.mtx = this.icbm_attack.startX,
                    d.state.mty = this.icbm_attack.startY, d.state.x = _x, d.state.y = a), this.icbmFired && (this.icbmFired = !1, d.events += "ICBM,", d.state.level = this.incomingMissileLevel, d.state.type = this.incomingMissileType), this.enemyCityHit && (this.enemyCityHit = !1, d.events += "enemyCityHit,", d.state.enemyCity = this.currentEnemyCity.name), this.isEnemyTurretHit_omega && (this.isEnemyTurretHit_omega = !1, d.events += "omegaHit,"), this.isEnemyTurretHit_alpha && (this.isEnemyTurretHit_alpha = !1, d.events += "alphaHit,"), this.isEnemyTurretHit_delta &&
                (this.isEnemyTurretHit_delta = !1, d.events += "deltaHit,"), this.gameHasEnded && (this.gameHasEnded = !1, d.events += "gameHasEnded,"), d) : null
        },
        createEnemyExplosion: function(a, b, c, d, e) {
            a = new g.currentGame.Explosion(a, b, c, d, null, e);
            this.damageContainer.addChild(a.sprite);
            this.enemyExplosions.push(a)
        },
        createIncomingICBM: function(a, b) {
            if (!this.icbm_attack && (this.playSound("ICBM_Incoming"), this.incomingMissileType = a, this.incomingMissileLevel = b, 0 != this.incomingMissileType)) {
                var c = Math.random() * this.w,
                    d = c,
                    f = this.h >>
                    1,
                    k = 1 * this.tickFactor,
                    h, i;
                switch (a) {
                    case 1:
                        h = Math.random() * this.cities.length | 0;
                        h = this.cities[h];
                        null == h ? (h = null, d = Math.random() * this.w, f = 500) : (f = h.sprite, d = f.x + (f.width - 50 >> 1), d = GameLibs.Math2.getRange(d - e.RANGE, d + 50 + e.RANGE), f = f.y + f.height / 2);
                        i = "Normal";
                        break;
                    case 2:
                        i = "EMP";
                        d = c = this.w >> 1;
                        f = this.h - 188;
                        break;
                    case 3:
                        i = "Nuke", d = c = this.w >> 1, f = this.h - 188
                }
                this.icbm_attack = new g.currentGame.ICBMMissile(c, 0, d, f, k, "mine", this.spritesheet);
                this.icbm_attack.hitCount = this.ICBMData[i][this.incomingMissileLevel];
                this.icbm_attack.targetCity = h;
                this.icbm_attack.setType(this.incomingMissileType);
                this.stage.addChild(this.icbm_attack.container);
                this.stage.setChildIndex(this.icbm_attack.container, 1);
                this.stage.setChildIndex(this.icbm_attack.sprite, 1);
                this.stage.setChildIndex(this.icbm_attack.container, this.stage.children.length - 1);
                this.icbmIncoming = !0
            }
        },
        removePlayer: function(a) {
            Atari.trace("[Combat] Player: '" + a + "' has left the building!");
            this.victorySound = this.playSound("victoryMusic");
            this.levelManager.gameOver();
            this.gameIsComplete = this.killGame = !0;
            this.endGame()
        }
    };
    g.currentGame.MissileCommand = e
})(window.Atari);
