export default class Player{
    constructor(ctx, sprites, playerSpr){
        this.ctx = ctx;
        this.sprites = sprites;

        this.anims = {
            "stand": [
                [3,11,36,65],
                [41,11,74,65],
                [77,11,110,65],
            ],
            "run": [
                [115,11,148,65],
                [152,11,185,65],
                [189,11,222,65],
                [227,11,260,65],
            ],
            "jump1": [
                [268,8,298,65]
            ],
            "jump2": [
                [305,8,337,65]
            ],
            "jump3": [
                [344,8,376,65]
            ],
            "jump4": [
                [386,8,418,65]
            ],
            "star": [
                [431,7,475,65]
            ]
        };
        this.state = "stand";
        this.isRight = true;
        this.isGround = true;
        this.animRate = 150;
        this.animCnt = 0;
        this.animTimer = 0;
        this.isRotate = false;
        this.angle = 0;
        this.playerSpr = playerSpr;
        console.log(playerSpr)

        this.x = 320;
        this.y = 444;
        this.width = 34;
        this.height = 54;

        this.vx = 0;
        this.vy = 0;

        this.xmeter = 0;

        let pressedKeys = {};

        window.onkeyup = function(e) { pressedKeys[e.keyCode] = false; }
        window.onkeydown = function(e) { pressedKeys[e.keyCode] = true; }

        let jumpObj = this;

        addEventListener("keypress", function(e) {
            if(e.keyCode == 32 && jumpObj.isGround){
                if(Math.abs(jumpObj.xmeter) >= 150) {
                    jumpObj.vy = -3.4;
                    //jumpObj.vy = -10;
                    jumpObj.isRotate = true;
                }
                else if(Math.abs(jumpObj.xmeter) >= 50) jumpObj.vy = -2.4;
                else jumpObj.vy = -1.8;
                //jumpObj.xmeter = 0;
                jumpObj.isGround = false;

                //console.log("PROBA");
            }
        });

        this.pressedKeys = pressedKeys;
    }

    render() {
        let x = this.anims[this.state][this.animCnt][0];
        let y = this.anims[this.state][this.animCnt][1];
        let w = this.anims[this.state][this.animCnt][2] - x;
        let h = this.anims[this.state][this.animCnt][3] - y;
        if(this.isRotate > 0){
            this.ctx.save();
            let cx = this.x, cy = this.y - this.height / 2;
            this.ctx.translate(cx, cy);
            this.ctx.rotate(this.angle * Math.PI / 180);
            this.ctx.translate(-cx, -cy);
            this.ctx.drawImage(this.sprites[this.playerSpr],x,y,w,h,this.x - this.width / 2, this.y - this.height, w, h);
            this.ctx.restore();
        }
        else{
            if(this.isRight) {
                this.ctx.drawImage(this.sprites[this.playerSpr],x,y,w,h,this.x - this.width / 2, this.y - this.height, w, h);
            }
            else {
                this.ctx.save();
                this.ctx.translate(640, 0);
                this.ctx.scale(-1, 1);
                this.ctx.drawImage(this.sprites[this.playerSpr],x,y,w,h, 640 - this.x - this.width / 2, this.y - this.height, w, h);
                this.ctx.restore();
            }
        }
    }

    update(dt) {
        this.animTimer += dt;
        if(this.isRotate) {
            this.angle -= dt;
            if(this.angle <= -360) this.angle = 0;
        }

        if(this.isRotate) this.state = "star";
        else if(this.isGround) this.state = "stand";
        else this.state = "jump1";

        if(this.pressedKeys[37]) {
            //if(this.state != 'run') this.animCnt = 0;
            if(this.isGround) this.state = "run";
            else{
                if(this.isRotate) this.state = "star";
                else if(this.vy < -0.5) this.state = "jump2";
                else if(this.vy > 0.5) this.state = "jump4";
                else this.state = "jump3";
            }
            this.vx = Math.max(this.vx - 0.02, -1.5);
            this.isRight = false;
        }
        else if(this.pressedKeys[39]) {
            //if(this.state != 'run') this.animCnt = 0;
            if(this.isGround) this.state = "run";
            else{
                if(this.isRotate) this.state = "star";
                else if(this.vy < -0.5) this.state = "jump2";
                else if(this.vy > 0.5) this.state = "jump4";
                else this.state = "jump3";
            }
            this.vx = Math.min(this.vx + 0.02, 1.5);
            this.isRight = true;
        }
        else{
            if(this.vx > 0) {
                this.vx -= 0.03;
                this.vx = Math.max(0, this.vx);
            }
            else if(this.vx < 0){
                this.vx += 0.03;
                this.vx = Math.min(0, this.vx);
            }
        }

        if(this.animTimer > this.animRate){
            this.animTimer = 0;
            this.animCnt = (this.animCnt + 1) % this.anims[this.state].length;
        }
        if(this.animCnt >= this.anims[this.state].length) this.animCnt %= this.anims[this.state].length;

        this.y += this.vy * dt * 0.3;
        this.x += this.vx * dt * 0.3;

        if(Math.abs(this.vx) == 1.5) this.xmeter += this.vx * dt * 0.3;
        else this.xmeter = 0;

        if(!this.isGround) this.vy += dt * 0.005;

        if(this.x - this.width / 2 <= 75) {
            this.x = 75 + this.width / 2;
            this.vx *= -1;
        }
        else if(this.x + this.width / 2 >= 565) {
            this.x = 565 - this.width / 2;
            this.vx *= -1;
        }
    }
}