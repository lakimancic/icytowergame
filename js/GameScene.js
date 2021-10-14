import Floor from "./Floor.js";
import Player from "./Player.js";
import { Clock, Combo } from "./ComboClock.js";
import Message from "./Message.js";

const floor_sizes = [ 138, 170, 202, 234, 490 ];
const after_menu = ["Play Again", "Save Score", "Main Menu"]

const getRandomFloor = (ctx, sprites, y, num) => {
    let type;
    if(num < 100) type = Math.floor(Math.random() * 4);
    else if(num < 200) type = Math.floor(Math.random() * 3);
    else if(num < 300) type = Math.floor(Math.random() * 2);
    else type = 0;
    //type = 4;
    let w = floor_sizes[type];
    let x = 75 + Math.floor(Math.random() * (490 - w));
    return new Floor(ctx, sprites, x, y, w, type, num);
}

const getRandomParticle = (x,y) => {
    let type = Math.floor(Math.random()*8);
    return {
        x: x,
        y: y,
        w: 12,
        h: 10,
        sx: 12 * type,
        sy: 0
    };
}

export default class GameScene{
    constructor(ctx, sprites, playerSpr){
        this.ctx = ctx;
        this.sprites = sprites;
        this.player = new Player(ctx, sprites, playerSpr);
        this.bg = {
            y1: 0,
            y2: -512,
        }
        this.floors = [
            new Floor(ctx, sprites, 75, 430, floor_sizes[4], 4, 0),
        ];
        for(let i=0;i<6;i++){
            this.floors.push(getRandomFloor(this.ctx, this.sprites, this.floors[this.floors.length - 1].y - 80, this.floors[this.floors.length - 1].num + 1));
        }
        this.moveSpeed = 0;//1/50;

        this.clock = new Clock(ctx,sprites);
        this.clock_timer = 0;
        this.cicles = 0;
        this.is_started = false;

        this.score = 0;
        this.combo_cnt = 0;

        this.prevFloor = 0;
        this.maxFloor = 0;

        this.isGameOver = false;
        this.isPaused = false;
        this.isExit = false;
        this.afterGame = false;

        this.hurryup = -60; // 285, 56

        this.msg = null;
        this.msg_cnt = 0;
        

        this.combo = new Combo(ctx,sprites, this.combo_cnt, this.msg);

        this.particles =  [];
        this.part_cnt = 0;

        this.end_cnt = 0;

        this.ag_arrow = 0;

        let obj = this;

        addEventListener("keyup", function(e) {
            //console.log(e.keyCode)
            if(e.keyCode == 80 && !obj.isGameOver && !obj.isPaused && !obj.isExit){
                obj.isPaused = true;
                return;
            }
            if(e.keyCode == 27 && !obj.isGameOver && !obj.isPaused && !obj.isExit){
                obj.isExit = true;
                return;
            }
            if(obj.isPaused){
                obj.isPaused = false;
            }
            if(obj.end_cnt >= 200){
                obj.afterGame = true;
            }
        });

        window.addEventListener("keydown", function(e){
            //e.preventDefault();
            if(e.keyCode == 38){
                obj.ag_arrow--;
                if(obj.ag_arrow < 0) obj.ag_arrow += after_menu.length;
            }
            else if(e.keyCode == 40){
                obj.ag_arrow++;
                if(obj.ag_arrow >= after_menu.length) obj.ag_arrow -= after_menu.length;
            }
            //console.log(e.keyCode)
        });
    }

    render() {
        this.ctx.drawImage(this.sprites.bg, 0, this.bg.y1);
        this.ctx.drawImage(this.sprites.bg, 0, this.bg.y2);

        this.ctx.drawImage(this.sprites.msgs, 0, 0, 285, 56, 320 - 285 / 2, this.hurryup, 285, 56);

        this.floors.forEach(i => i.render());

        this.player.render();

        this.clock.render();
        this.combo.render();

        this.ctx.font = "24px ComicFont";
        this.ctx.textAlign = "left";
        this.ctx.fillStyle = "white";
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 2;
        this.ctx.fillText("Score : " + (this.score + this.combo.score).toString(), 8, 470);
        this.ctx.strokeText("Score : " + (this.score + this.combo.score).toString(), 8, 470);

        if(this.msg) this.msg.render();

        this.particles.forEach(i => {
            this.ctx.drawImage(this.sprites.particles, i.sx, i.sy, i.w, i.h, i.x - i.w / 2, i.y - i.h / 2, i.w, i.h);
        });

        if(this.isGameOver){
            //0,918,413,86
            this.ctx.drawImage(this.sprites.msgs, 0, 918, 413, 86, 320 - 207.5, 150 - 43, 413, 86);

            this.ctx.font = "26px ComicFont";
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = "white";
            this.ctx.strokeStyle = "black";
            this.ctx.lineWidth = 2;

            this.ctx.fillText("Score : " + (this.score + this.combo.score).toString(), 320, 240);
            this.ctx.strokeText("Score : " + (this.score + this.combo.score).toString(), 320, 240);
            this.ctx.fillText("Floor : " + (this.maxFloor).toString(), 320, 290);
            this.ctx.strokeText("Floor : " + (this.maxFloor).toString(), 320, 290);
            this.ctx.fillText("Best Combo : " + this.combo.max_combo.toString(), 320, 340);
            this.ctx.strokeText("Best Combo : " + this.combo.max_combo.toString(), 320, 340);

            if(this.afterGame){
                this.ctx.fillStyle = "rgba(0,0,0,0.5)";
                this.ctx.fillRect(0,0,640,480);
    
                this.ctx.drawImage(this.sprites.paper1, 0, 0, this.sprites.paper1.width, this.sprites.paper1.height, 320 - this.sprites.paper1.width / 2, 240 -  this.sprites.paper1.height / 2,  this.sprites.paper1.width,  this.sprites.paper1.height);

                this.ctx.font = "24px ComicFont";
                this.ctx.textAlign = "left";
                this.ctx.fillStyle = "black";

                after_menu.forEach((i, j) => {
                    this.ctx.fillText(i, 230, 205 + j * 40);
                });

                this.ctx.drawImage(this.sprites.pointer, 0, 0, this.sprites.pointer.width, this.sprites.pointer.height, 180, 190 + this.ag_arrow *40, this.sprites.pointer.width, this.sprites.pointer.height);
            }
        }
        else if(this.isPaused){
            this.ctx.fillStyle = "rgba(0,0,0,0.5)";
            this.ctx.fillRect(0,0,640,480);

            this.ctx.font = "32px ComicFont";
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = "white";
            this.ctx.strokeStyle = "black";
            this.ctx.lineWidth = 2;

            this.ctx.fillText("Game is paused !", 320, 220);
            this.ctx.strokeText("Game is paused !", 320, 220);

            this.ctx.font = "28px ComicFont";
            this.ctx.fillText("Press any key to continue !", 320, 260);
            this.ctx.strokeText("Press any key to continue !", 320, 260);
        }
        else if(this.isExit) {
            this.ctx.fillStyle = "rgba(0,0,0,0.5)";
            this.ctx.fillRect(0,0,640,480);

            this.ctx.font = "32px ComicFont";
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = "white";
            this.ctx.strokeStyle = "black";
            this.ctx.lineWidth = 2;

            this.ctx.fillText("Do you really want to exit ?", 320, 200);
            this.ctx.strokeText("Do you really want to exit ?", 320, 200);

            this.ctx.font = "24px ComicFont";
            this.ctx.fillText("Press any key to continue !", 320, 240);
            this.ctx.strokeText("Press any key to continue !", 320, 240);

            this.ctx.font = "24px ComicFont";
            this.ctx.fillText("Press ESC key to exit !", 320, 280);
            this.ctx.strokeText("Press ESC key to exit !", 320, 280);
        }
        
    }

    update(dt) {
        if(this.isGameOver){
            if(this.end_cnt < 200) this.end_cnt += dt;
            return;
        }
        if(this.isPaused || this.isExit) return;

        let prevPlayerSpeed = this.player.y;
        this.player.update(dt);
        this.combo.update(dt, this.msg, this.combo_cnt);
        this.msg = this.combo.msg;
        this.combo_cnt = this.combo.count;

        this.player.isGround = false;
        this.floors.forEach(floor => {
            if(this.player.y >= floor.y && this.player.y <= floor.y + floor.HEIGHT && this.player.vy >= 0 && prevPlayerSpeed <= floor.y + 20){
                if(this.player.x <= floor.x + floor.width && this.player.x >= floor.x){
                    if(floor.num >= 5 && !this.is_started) {
                        this.moveSpeed = 1/50;
                        this.is_started = true;
                    }
                    if(this.player.vy > 0) {
                        this.player.isRotate = false;
                        if(floor.num - this.prevFloor > 1){
                            this.combo.isOn = true;
                            this.combo.combo_time = 3000;
                            this.combo.floors += floor.num - this.prevFloor;
                            this.combo_cnt++;
                        }
                        else if(floor.num - this.prevFloor < 0 || floor.num - this.prevFloor == 1){
                            this.combo.isOn = false;
                            this.combo.combo_time = 0;
                            this.combo.score += this.combo.floors * this.combo.floors;
                            //console.log(this.combo.floors + " " + this.combo_cnt)
                            if(this.combo_cnt > 1 && this.combo.floors >= 4){
                                if(this.combo.floors < 7) this.msg = new Message(this.ctx, this.sprites, 0);
                                else if(this.combo.floors < 15) this.msg = new Message(this.ctx, this.sprites, 1);
                                else if(this.combo.floors < 25) this.msg = new Message(this.ctx, this.sprites, 2);
                                else if(this.combo.floors < 35) this.msg = new Message(this.ctx, this.sprites, 3);
                                else if(this.combo.floors < 50) this.msg = new Message(this.ctx, this.sprites, 4);
                                else if(this.combo.floors < 70) this.msg = new Message(this.ctx, this.sprites, 5);
                                else if(this.combo.floors < 100) this.msg = new Message(this.ctx, this.sprites, 6);
                                else if(this.combo.floors < 140) this.msg = new Message(this.ctx, this.sprites, 7);
                                else if(this.combo.floors < 200) this.msg = new Message(this.ctx, this.sprites, 8);
                                else this.msg = new Message(this.ctx, this.sprites, 9);
                                //console.log("RADDI")
                            }
                            this.combo.max_combo = Math.max(this.combo.max_combo, this.combo.floors);
                            this.combo.floors = 0;
                            this.combo_cnt = 0;
                        }
                        this.maxFloor = Math.max(this.maxFloor, floor.num);
                    }
                    this.player.vy = 0;
                    this.player.y = floor.y + 3;
                    this.player.isGround = true;
                    this.prevFloor = floor.num;
                    this.score = floor.num * 10;
                }
            }
        });

        this.floors.forEach(floor => {
            floor.y += dt * this.moveSpeed;
        });
        this.player.y += dt * this.moveSpeed;
        this.bg.y1 += dt * this.moveSpeed;
        this.bg.y2 += dt * this.moveSpeed;

        if(this.player.y < 240) {
            let dif = (this.player.y - 240);
            if(dif < 0){
                this.floors.forEach(floor => {
                    floor.y -= dif;
                });
            }
            this.player.y -= dif;
            this.bg.y1 -= dif;
            this.bg.y2 -= dif;
            this.particles.forEach(i => i.y -= dif);
        }

        while(this.floors[0].y >= 480){
            this.floors.shift();
            if((this.floors[this.floors.length - 1].num + 1) % 50 != 0) this.floors.push(getRandomFloor(this.ctx, this.sprites, this.floors[this.floors.length - 1].y - 80, this.floors[this.floors.length - 1].num + 1));
            else this.floors.push(new Floor(this.ctx, this.sprites, 75,this.floors[this.floors.length - 1].y - 80, floor_sizes[4], 4, this.floors[this.floors.length - 1].num + 1))
        }

        if(this.bg.y2 >= 512){
            this.bg.y1 = 0;
            this.bg.y2 = -512;
        }
        if(this.bg.y1 >= 512){
            this.bg.y2 = 0;
            this.bg.y1 = -512;
        }

        if(this.is_started){
            if(this.cicles < 5){
                this.clock_timer += dt;
                if(this.clock_timer >= 100) {
                    this.clock.angle += this.clock_timer * 360 / 30000;
                    this.clock_timer = 0;
                }
                if(this.clock.angle >= 360){
                    this.clock.angle = 0;
                    this.clock_timer = 0;
                    this.cicles++;
                    this.moveSpeed *= 1.5;
                    this.hurryup = 480;
                }
            }
            else{
                this.clock.angle -= dt;
            }
        }

        if(this.player.y > 550){
            this.isGameOver = true;
            this.combo.isOn = false;
            this.combo.combo_time = 0;
            this.combo.score += this.combo.floors * this.combo.floors;
            this.combo.floors = 0;
            this.combo_cnt = 0;
            this.msg = null;
            this.particles = [];
            this.hurryup = -60;
        }

        if(this.hurryup > -60) this.hurryup -= dt / 10;

        if(this.msg){
            this.msg_cnt += 1.5*dt;
            if(this.msg_cnt < 1000){
                this.msg.scale = this.msg_cnt / 1000;
                this.msg.angle = this.msg_cnt * 360 / 1000;
            }
            else if(this.msg_cnt < 2000){
                this.msg.scale = 1;
                this.msg.angle = 0;
            }
            else if(this.msg_cnt < 3000){
                this.msg.scale = (3000 - this.msg_cnt) / 1000;
                this.msg.angle = (3000 - this.msg_cnt) * 360 / 1000;
            }
            else{
                this.msg = null;
                this.msg_cnt = 0;
            }
        }

        if(this.player.isRotate && this.combo_cnt > 0){
            if(this.part_cnt > 70) {
                this.particles.push(getRandomParticle(this.player.x, this.player.y));
                this.part_cnt = 0;
            }
            this.part_cnt += dt;
        }

        let forDel = [];
        this.particles.forEach((i, ind) => {
            i.y += dt / 5;
            if(i.y > 500) forDel.push(ind);
        });
        forDel.forEach(i => this.particles.splice(i, 1));
        //console.log(this.particles)
    }
};