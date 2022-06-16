/*******************************************/
/*             PLAYER CLASS                */
/*******************************************/
// Imports
import { TextureHolder, AnimationHolder, AudioHolder } from "./ResourceHolder.js";

const playerNameToSoundName = {
    "player01" : "harold",
    "player02" : "dave",
    "player03" : "jane",
    "player04" : "wendy",
    "player05" : "harold",
    "player06" : "demon",
    "player07" : "harold",
    "player08" : "harold",
    "player09" : "harold",
    "player10" : "harold",
}

// Player Class
class Player {
    constructor(canvas, ctx, pressedKeys, options, prevPressedKeys, playername, x, y) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.pressedKeys = pressedKeys;
        this.prevPressedKeys = prevPressedKeys;
        this.options = options;

        this.playername = playername;

        this.x = x;
        this.y = y;
        this.width = 34;
        this.height = 54;

        this.vx = 0;
        this.vy = 0;

        this.isRotate = false;
        this.angle = 0;

        this.isGround = false;
        this.isRight = false;

        this.ACCL = 1200;
        this.MAX_SPEED = 480;
        this.JUMP_SPEED = -600;
        this.GRAVITY = 5000;
        this.TRUST = 1800;

        this.xmeter = 0;

        this.textures = new TextureHolder();
        this.animations = new AnimationHolder();
        this.sounds = new AudioHolder();

        this.state = "stand";
        
        this.animCount = 0;
        this.animTimer = 0;
    }

    async load() {
        await this.textures.load(this.playername, "/resources/images/characters/" + this.playername + ".png");
        await this.animations.load(this.playername, "/resources/animations/" + this.playername + ".json");

        await this.sounds.load("low_jump", "/resources/audio/characters/" + playerNameToSoundName[this.playername] + "_low_jump.ogg");
        await this.sounds.load("medium_jump", "/resources/audio/characters/" + playerNameToSoundName[this.playername] + "_medium_jump.ogg");
        await this.sounds.load("high_jump", "/resources/audio/characters/" + playerNameToSoundName[this.playername] + "_high_jump.ogg");
        await this.sounds.load("fall", "/resources/audio/characters/" + playerNameToSoundName[this.playername] + "_fall.ogg");
        await this.sounds.load("edge", "/resources/audio/characters/" + playerNameToSoundName[this.playername] + "_edge.ogg");
        //this.sounds.map["edge"].loop = true;
        await this.sounds.load("greeting", "/resources/audio/characters/" + playerNameToSoundName[this.playername] + "_greeting.ogg");
    }

    update(dt) {
        //console.log(dt)
        this.handleInput(dt);

        if(this.isRotate) {
            this.angle -= dt * 1000;
            if(this.angle <= -360) this.angle = 0;
        }

        if(Math.abs(this.vx) > this.MAX_SPEED) {
            this.vx = this.MAX_SPEED * Math.sign(this.vx);
        }

        if(!this.isGround) {
            this.vy += this.GRAVITY * dt * 0.3;
            if(Math.abs(this.vx) > 0) {
                if(this.vy < -70) this.state = "jump2";
                else if(this.vy > 70) this.state = "jump4";
                else this.state = "jump3";
            }
            else this.state = "jump1";
            if(this.isRotate) this.state = "star";
        }
        else{
            if(Math.abs(this.vx) > 0) this.state = "walk";
            else {
                this.state = "stand";
                if(this.minDist && this.minDist < 10) {
                    this.state = "edge";
                    this.isRight = this.isRightEdge;
                    this.sounds.map["edge"].play();
                }
            }
        }

        this.x += this.vx * dt;
        if(Math.abs(this.vx) == this.MAX_SPEED) this.xmeter += Math.abs(this.vx) * dt;
        else this.xmeter = 0;
        this.y += this.vy * dt;

        // if(this.y > this.canvas.height - 50) {
        //     this.y = this.canvas.height - 50;
        //     this.isGround = true;
        // }

        if(this.x - this.width / 2 <= 75) {
            this.x = 75 + this.width / 2;
            this.vx *= -1;
        }
        else if(this.x + this.width / 2 >= 565) {
            this.x = 565 - this.width / 2;
            this.vx *= -1;
        }

        this.animTimer += dt;
        if(this.animTimer > this.animations.get(this.playername)[this.state]["framerate"] / 1000){
            this.animTimer = 0;
            this.animCount = (this.animCount + 1) % this.animations.get(this.playername)[this.state]["frames"].length;
        }
        if(this.animCount >= this.animations.get(this.playername)[this.state]["frames"].length) this.animCount %= this.animations.get(this.playername)[this.state]["frames"].length;
    }

    render(viewY) {
        let x = this.animations.get(this.playername)[this.state]["frames"][this.animCount][0];
        let y = this.animations.get(this.playername)[this.state]["frames"][this.animCount][1];
        let w = this.animations.get(this.playername)[this.state]["frames"][this.animCount][2];
        let h = this.animations.get(this.playername)[this.state]["frames"][this.animCount][3];
        this.ctx.save();
        //this.ctx.globalAlpha = 0.5;
        if(this.isRotate > 0){
            //this.ctx.save();
            let cx = this.x, cy = this.y - this.height / 2 - viewY;
            this.ctx.translate(cx, cy);
            this.ctx.rotate(this.angle * Math.PI / 180);
            this.ctx.translate(-cx, -cy);
            this.ctx.drawImage(this.textures.get(this.playername),x,y,w,h,this.x - this.width / 2, this.y - this.height - viewY, w, h);
        }
        else{
            if(this.isRight) {
                this.ctx.drawImage(this.textures.get(this.playername),x,y,w,h,this.x - this.width / 2, this.y - this.height - viewY, w, h);
            }
            else {
                //this.ctx.save();
                this.ctx.translate(640, 0);
                this.ctx.scale(-1, 1);
                this.ctx.drawImage(this.textures.get(this.playername),x,y,w,h, 640 - this.x - this.width / 2, this.y - this.height - viewY, w, h);
                //this.ctx.restore();
            }
        }
        this.ctx.restore();
    }

    handleInput(dt) {
        let pomAccl = 0;
        // Left Arrow
        if(this.isPressed(this.options["controls"]["left"].keycode)) {
            pomAccl -= this.ACCL * dt;
            if(this.vx > 0) pomAccl -= this.TRUST * dt;
            this.isRight = false;
        }
        // Right Arrow
        if(this.isPressed(this.options["controls"]["right"].keycode)) {
            pomAccl += this.ACCL * dt;
            if(this.vx < 0) pomAccl += this.TRUST * dt;
            this.isRight = true;
        }
        // Space
        if((this.isPressed(this.options["controls"]["jump"].keycode) || this.isPressed(this.options["controls"]["up"].keycode)) && this.isGround) {
            if(this.xmeter < 50) {
                this.vy = this.JUMP_SPEED;
                this.sounds.map["low_jump"].play();
            }
            else if(this.xmeter < 150) {
                this.vy = this.JUMP_SPEED * 4 / 3;
                this.sounds.map["medium_jump"].play();
            }
            else {
                this.vy = this.JUMP_SPEED * 1.7;
                this.isRotate = true;
                this.sounds.map["high_jump"].play();
                this.sounds.map["high_jump"].currentTime = 0;
            }
            this.isGround = false;
        }

        this.vx += pomAccl;
        if(pomAccl == 0) {
            if(this.vx > 0) {
                this.vx -= this.TRUST * dt;
                if(this.vx < 0) this.vx = 0;
            }
            else if(this.vx < 0) {
                this.vx += this.TRUST * dt;
                if(this.vx > 0) this.vx = 0;
            }
        }

        this.prevPressedKeys = {...this.pressedKeys};
    }

    isPressed(key) {
        return this.pressedKeys[key];
    }

    onKeyDown(key) {
        return this.pressedKeys[key] && !this.prevPressedKeys[key];
    }

    onKeyUp(key) {
        return !this.pressedKeys[key] && this.prevPressedKeys[key];
    }
}

// Exports
export { Player };