import Message from "./Message.js";

class Clock {
    constructor(ctx, sprites) {
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
        this.sprites = sprites;
    }

    render() {
        this.ctx.drawImage(this.sprites.comboclock, this.clock[0], this.clock[1], this.clock[2], this.clock[3], this.x, this.y, this.w, this.h);

        this.ctx.save();
        this.ctx.translate(this.arr_x, this.arr_y);
        this.ctx.rotate(this.angle * Math.PI / 180);
        this.ctx.translate(-this.arr_x, -this.arr_y);
        this.ctx.drawImage(this.sprites.comboclock, this.arrow[0], this.arrow[1], this.arrow[2], this.arrow[3], this.arr_x - this.arr_w / 2, this.arr_y - 30, this.arr_w, this.arr_h);
        this.ctx.restore();
    }
}

class Combo {
    constructor(ctx, sprites, count, msg) {
        //this.ctx.drawImage(this.sprites.comboclock, 90, 0, 39, 131, 41 - 39/2, 100, 39, 131);
        //this.ctx.drawImage(this.sprites.comboclock, 145, 0, 94, 184, 41 - 42, 100, 94, 184);
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
        this.sprites = sprites;

        this.combo_time = 0;
        this.floors = 0;
        this.max_combo = 0;

        this.score = 0;
        this.count = count;
        this.msg = msg;
    }

    render() {
        if(this.isOn) 
        {
            this.ctx.drawImage(this.sprites.comboclock, this.combo_on[0], this.combo_on[1], this.combo_on[2], this.combo_on[3], this.x - 44, this.y, this.w_on, this.h_on);
            this.ctx.drawImage(this.sprites.comboclock, 129, 0, 16, Math.floor(this.combo_time*100 / 3000), 32, 219 - Math.floor(this.combo_time*100 / 3000), 16, Math.floor(this.combo_time*100 / 3000));
            this.ctx.font = "24px ComicFont";
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = "white";
            this.ctx.strokeStyle = "black";
            this.ctx.lineWidth = 2;
            this.ctx.fillText(this.floors.toString(), this.x, 245);
            this.ctx.strokeText(this.floors.toString(), this.x, 245);
        }
        else {
            this.ctx.drawImage(this.sprites.comboclock, this.combo_off[0], this.combo_off[1], this.combo_off[2], this.combo_off[3], this.x - this.w_off / 2, this.y, this.w_off, this.h_off);
        }
    }

    update(dt, msg, count) {
        this.msg = msg;
        this.count = count;
        if(this.isOn){
            this.combo_time -= dt;
            if(this.combo_time <= 0){
                this.isOn = false;
                this.combo_time = 0;
                this.score += this.floors * this.floors;
                //console.log(this.count + " " + this.floors)
                if(this.count > 1 && this.floors >= 4){
                    if(this.floors < 7) this.msg = new Message(this.ctx, this.sprites, 0);
                    else if(this.floors < 15) this.msg = new Message(this.ctx, this.sprites, 1);
                    else if(this.floors < 25) this.msg = new Message(this.ctx, this.sprites, 2);
                    else if(this.floors < 35) this.msg = new Message(this.ctx, this.sprites, 3);
                    else if(this.floors < 50) this.msg = new Message(this.ctx, this.sprites, 4);
                    else if(this.floors < 70) this.msg = new Message(this.ctx, this.sprites, 5);
                    else if(this.floors < 100) this.msg = new Message(this.ctx, this.sprites, 6);
                    else if(this.floors < 140) this.msg = new Message(this.ctx, this.sprites, 7);
                    else if(this.floors < 200) this.msg = new Message(this.ctx, this.sprites, 8);
                    else this.msg = new Message(this.ctx, this.sprites, 9);
                    //console.log("RADDI")
                    this.max_combo = Math.max(this.max_combo, this.floors);
                }
                this.floors = 0;
                this.count = 0;
            }
        }
    }
}

export { Clock, Combo };