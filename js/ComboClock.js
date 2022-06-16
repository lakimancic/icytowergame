/*************************************/
/*            CLOCK CLASS            */
/*************************************/

class Clock {
    constructor(ctx, textures) {
        this.clock = [0,0,73,84];
        this.arrow = [73,0,17,43];
        this.w = 73;
        this.h = 84;
        this.x = 6;
        this.y = 10;

        this.angle = 0;

        this.arr_x = 42;
        this.arr_y = 57;
        this.arr_w = 17;
        this.arr_h = 43;

        this.ctx = ctx;
        this.textures = textures;
    }

    render() {
        this.ctx.drawImage(this.textures.get("comboclock"), this.clock[0], this.clock[1], this.clock[2], this.clock[3], this.x, this.y, this.w, this.h);

        this.ctx.save();
        this.ctx.translate(this.arr_x, this.arr_y);
        this.ctx.rotate(this.angle * Math.PI / 180);
        this.ctx.translate(-this.arr_x, -this.arr_y);
        this.ctx.drawImage(this.textures.get("comboclock"), this.arrow[0], this.arrow[1], this.arrow[2], this.arrow[3], this.arr_x - this.arr_w / 2, this.arr_y - 30, this.arr_w, this.arr_h);
        this.ctx.restore();
    }
}

/*************************************/
/*            COMBO CLASS            */
/*************************************/

import { Message } from "./Message.js";

class Combo {
    constructor(ctx, textures) {
        this.combo_off = [91,0,39,131];
        this.combo_on = [145,0,94,184];
        this.y = 100;
        this.x = 41;
        this.w_off = 39;
        this.w_on = 94;
        this.h_off = 131;
        this.h_on = 184;
        this.isOn = false;

        this.ctx = ctx;
        this.textures = textures;

        this.combo_time = 0;
        this.floors = 0;
        this.max_combo = 0;
        this.score = 0;
    }

    render() {
        if(this.isOn) 
        {
            this.ctx.drawImage(this.textures.get("comboclock"), this.combo_on[0], this.combo_on[1], this.combo_on[2], this.combo_on[3], this.x - 44, this.y, this.w_on, this.h_on);
            this.ctx.drawImage(this.textures.get("comboclock"), 129, 0, 16, Math.floor(this.combo_time*100 / 3000), 32, 219 - Math.floor(this.combo_time*100 / 3000), 16, Math.floor(this.combo_time*100 / 3000));
            this.ctx.font = "24px ComicFont";
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "bottom";
            this.ctx.fillStyle = "white";
            this.ctx.strokeStyle = "black";
            this.ctx.lineWidth = 2;
            this.ctx.fillText(this.floors.toString(), this.x, 245);
            this.ctx.strokeText(this.floors.toString(), this.x, 245);
            this.ctx.fillText(this.floors.toString(), this.x, 245);
            this.ctx.strokeText(this.floors.toString(), this.x, 245);
        }
        else {
            this.ctx.drawImage(this.textures.get("comboclock"), this.combo_off[0], this.combo_off[1], this.combo_off[2], this.combo_off[3], this.x - this.w_off / 2, this.y, this.w_off, this.h_off);
        }
    }

    update(dt, count, sounds) {
        this.msg = null;
        this.count = count;
        if(this.isOn){
            this.combo_time -= dt*1000;
            if(this.combo_time <= 0){
                this.isOn = false;
                this.combo_time = 0;
                // good, sweet, great, super, wow, amazing, extreme, fantastic, splendid, noway
                if(this.count > 1 && this.floors >= 4){
                    if(this.floors < 7) {
                        this.msg = new Message(this.ctx, this.textures, 0);
                        sounds.map["good"].play();
                    }
                    else if(this.floors < 15) {
                        this.msg = new Message(this.ctx, this.textures, 1);
                        sounds.map["sweet"].play();
                    }
                    else if(this.floors < 25) {
                        this.msg = new Message(this.ctx, this.textures, 2);
                        sounds.map["great"].play();
                    }
                    else if(this.floors < 35) {
                        this.msg = new Message(this.ctx, this.textures, 3);
                        sounds.map["super"].play();
                    }
                    else if(this.floors < 50) {
                        this.msg = new Message(this.ctx, this.textures, 4);
                        sounds.map["wow"].play();
                    }
                    else if(this.floors < 70) {
                        this.msg = new Message(this.ctx, this.textures, 5);
                        sounds.map["amazing"].play();
                    }
                    else if(this.floors < 100) {
                        this.msg = new Message(this.ctx, this.textures, 6);
                        sounds.map["extreme"].play();
                    }
                    else if(this.floors < 140) {
                        this.msg = new Message(this.ctx, this.textures, 7);
                        sounds.map["fantastic"].play();
                    }
                    else if(this.floors < 200) {
                        this.msg = new Message(this.ctx, this.textures, 8);
                        sounds.map["splendid"].play();
                    }
                    else{
                        this.msg = new Message(this.ctx, this.textures, 9);
                        sounds.map["noway"].play();
                    }
                    this.score += this.floors * this.floors;
                    this.max_combo = Math.max(this.max_combo, this.floors);
                }
                this.floors = 0;
                this.count = 0;
            }
        }
    }
}

// Exports
export { Clock, Combo };