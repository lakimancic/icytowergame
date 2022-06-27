/*************************************/
/*           PLATFORM CLASS          */
/*************************************/
// Imports
import { TextureHolder } from "./ResourceHolder.js";
import { Floor } from "./Floor.js";
import { Message } from "./Message.js";

const floor_sizes = [ 138, 170, 202, 234, 490 ];

// Get random floor
const getRandomFloor = (canvas, ctx, textures, y, num) => {
    let type;
    if(num < 100) type = Math.floor(Math.random() * 4);
    else if(num < 200) type = Math.floor(Math.random() * 3);
    else if(num < 300) type = Math.floor(Math.random() * 2);
    else type = 0;
    //type = 4;
    let w = floor_sizes[type];
    let x = 75 + Math.floor(Math.random() * (490 - w));
    return new Floor(ctx, canvas, textures, x, y, w, type, num);
}

// Platform class
class Platform {
    // Constructor
    constructor(ctx, canvas) {
        this.canvas = canvas;
        this.ctx = ctx;

        this.textures = new TextureHolder();

        this.floors = [
            new Floor(this.ctx, this.canvas, this.textures, 75, 430, floor_sizes[4], 4, 0),
        ];
        for(let i=0;i<6;i++){
            this.floors.push(getRandomFloor(this.canvas, this.ctx, this.textures, this.floors[this.floors.length - 1].y - 80, this.floors[this.floors.length - 1].num + 1));
        }
    }

    async load() {
        for(let i=1; i < 12; i++){
            await this.textures.load('floors' + i, '/icytowergame/resources/images/others/floors' + i + '.png');
            await this.textures.load('sign' + i, '/icytowergame/resources/images/others/sign' + i + '.png');
        }
    }

    render(viewY) {
        this.floors.forEach(floor => {
            floor.render(viewY);
        });
    }

    update(dt, player, prevPlayerSpeed, gameState) {
        while(this.floors[0].y - gameState.viewY > 480 + this.floors[0].HEIGHT) this.floors.shift();
        while(this.floors.length < 7) {
            if((this.floors[this.floors.length - 1].num + 1) % 50 != 0) this.floors.push(getRandomFloor(this.canvas, this.ctx, this.textures, this.floors[this.floors.length - 1].y - 80, this.floors[this.floors.length - 1].num + 1));
            else this.floors.push(new Floor(this.ctx, this.canvas, this.textures, 75, this.floors[this.floors.length - 1].y - 80, floor_sizes[4], 4, this.floors[this.floors.length - 1].num + 1));
        }

        player.isGround = false;
        this.floors.forEach(floor => {
            if(player.y >= floor.y && player.y <= floor.y + floor.HEIGHT && player.vy >= 0 && prevPlayerSpeed <= floor.y + 20){
                if(player.x <= floor.x + floor.width && player.x >= floor.x){
                    if(floor.num >= 5 && !gameState.isStarted) {
                        gameState.isStarted = true;
                        gameState.moveSpeed = 50;
                    }
                    if(gameState.player.vy > 0) {
                        gameState.player.isRotate = false;
                        if(floor.num - gameState.prevFloor > 1){
                            gameState.combo.isOn = true;
                            gameState.combo.combo_time = 3000;
                            gameState.combo.floors += floor.num - gameState.prevFloor;
                            gameState.combo_cnt++;
                        }
                        else if(floor.num - gameState.prevFloor < 0 || floor.num - gameState.prevFloor == 1){
                            gameState.combo.isOn = false;
                            gameState.combo.combo_time = 0;
                            if(gameState.combo_cnt > 1 && gameState.combo.floors >= 4){
                                // good, sweet, great, super, wow, amazing, extreme, fantastic, splendid, noway
                                if(gameState.combo.floors < 7) {
                                    gameState.msg = new Message(gameState.ctx, gameState.textures, 0);
                                    gameState.sounds.map["good"].play();
                                }
                                else if(gameState.combo.floors < 15) {
                                    gameState.msg = new Message(gameState.ctx, gameState.textures, 1);
                                    gameState.sounds.map["sweet"].play();
                                }
                                else if(gameState.combo.floors < 25) {
                                    gameState.msg = new Message(gameState.ctx, gameState.textures, 2);
                                    gameState.sounds.map["great"].play();
                                }
                                else if(gameState.combo.floors < 35) {
                                    gameState.msg = new Message(gameState.ctx, gameState.textures, 3);
                                    gameState.sounds.map["super"].play();
                                }
                                else if(gameState.combo.floors < 50) {
                                    gameState.msg = new Message(gameState.ctx, gameState.textures, 4);
                                    gameState.sounds.map["wow"].play();
                                }
                                else if(gameState.combo.floors < 70) {
                                    gameState.msg = new Message(gameState.ctx, gameState.textures, 5);
                                    gameState.sounds.map["amazing"].play();
                                }
                                else if(gameState.combo.floors < 100) {
                                    gameState.msg = new Message(gameState.ctx, gameState.textures, 6);
                                    gameState.sounds.map["extreme"].play();
                                }
                                else if(gameState.combo.floors < 140) {
                                    gameState.msg = new Message(gameState.ctx, gameState.textures, 7);
                                    gameState.sounds.map["fantastic"].play();
                                }
                                else if(gameState.combo.floors < 200) {
                                    gameState.msg = new Message(gameState.ctx, gameState.textures, 8);
                                    gameState.sounds.map["splendid"].play();
                                }
                                else{
                                    gameState.msg = new Message(gameState.ctx, gameState.textures, 9);
                                    gameState.sounds.map["noway"].play();
                                }
                                gameState.combo.max_combo = Math.max(gameState.combo.max_combo, gameState.combo.floors);
                                gameState.combo.score += gameState.combo.floors * gameState.combo.floors;
                            }
                            gameState.combo.floors = 0;
                            gameState.combo_cnt = 0;
                        }
                        gameState.maxFloor = Math.max(gameState.maxFloor, floor.num);
                    }
                    player.vy = 0;
                    player.y = floor.y + 7;
                    player.isGround = true;
                    gameState.prevFloor = floor.num;
                    gameState.score = Math.max(floor.num * 10, gameState.score);
                    player.isRotate = false;
                    player.minDist = Math.min(player.x - floor.x, floor.x + floor.width - player.x);
                    if(player.minDist == player.x - floor.x) player.isRightEdge = false;
                    else player.isRightEdge = true;
                }
            }
        });
    }
}

// Exports
export { Platform };
