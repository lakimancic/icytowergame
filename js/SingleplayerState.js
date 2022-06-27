/**************************************/
/*         SINGLEPLAYER STATE         */
/**************************************/
// Imports
import { State } from './State.js';
import { Player } from './Player.js';
import { Platform } from './Platform.js';
import { Clock, Combo } from './ComboClock.js';
//import { Message } from './Message.js';
import { ParticleEngine } from './ParticleEngine.js';

const after_menu = ["Try Again", "Save Score", "Main Menu"];

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

// SingleplayerState class
class SingleplayerState extends State {
    constructor(states, ctx, canvas, pressedKeys, options, music) {
        super(states, ctx, canvas, pressedKeys, options, music);

        this.background = {
            y1: -512,
            y2: 0
        };

        this.viewY = 0;
        this.moveSpeed = 0;
        this.isStarted = false;
        this.cicles = 0;
        this.clock_timer = 0;

        this.player = new Player(this.canvas, this.ctx, this.pressedKeys, this.options, this.prevPressedKeys, this.options["singleplayer"]["character"], 320, 444);

        this.platform = new Platform(this.ctx, this.canvas);

        this.clock = new Clock(this.ctx, this.textures);
        this.combo = new Combo(this.ctx, this.textures);

        this.score = 0;
        this.combo_cnt = 0;

        this.prevFloor = 0;
        this.maxFloor = 0;

        this.isGameOver = false;
        this.isPaused = false;
        this.isExit = false;
        this.afterGame = false;

        this.ag_arrow = 0;

        this.hurryup = -60; // 285, 56

        this.msg = null;
        this.msg_cnt = 0;

        //this.particles = [];
        this.part_cnt = 0;
        this.particleEngine = new ParticleEngine(this.ctx, this.textures);
    }

    async load() {
        // Load textures
        await this.textures.load('background', '/icytowergame/resources/images/backgrounds/background.png');
        await this.textures.load('comboclock', '/icytowergame/resources/images/others/ComboClock.png');
        await this.textures.load('messages', '/icytowergame/resources/images/others/messages.png');
        await this.textures.load('paper1', '/icytowergame/resources/images/others/paper1.png');
        await this.textures.load('pointer', '/icytowergame/resources/images/others/menu_arrow.png');
        await this.textures.load('particles', '/icytowergame/resources/images/others/particles.png');

        await this.player.load();
        await this.platform.load();

        // Loading sounds
        // good, sweet, great, super, wow, amazing, extreme, fantastic, splendid, noway
        await this.sounds.load('good', '/icytowergame/resources/audio/good.ogg');
        await this.sounds.load('sweet', '/icytowergame/resources/audio/sweet.ogg');
        await this.sounds.load('great', '/icytowergame/resources/audio/great.ogg');
        await this.sounds.load('super', '/icytowergame/resources/audio/super.ogg');
        await this.sounds.load('wow', '/icytowergame/resources/audio/wow.ogg');
        await this.sounds.load('amazing', '/icytowergame/resources/audio/amazing.ogg');
        await this.sounds.load('extreme', '/icytowergame/resources/audio/extreme.ogg');
        await this.sounds.load('fantastic', '/icytowergame/resources/audio/fantastic.ogg');
        await this.sounds.load('splendid', '/icytowergame/resources/audio/splendid.ogg');
        await this.sounds.load('noway', '/icytowergame/resources/audio/noway.ogg');
        // hurryup, ring
        await this.sounds.load('hurryup', '/icytowergame/resources/audio/hurryup.ogg');
        await this.sounds.load('ring', '/icytowergame/resources/audio/ring.ogg');
        // menu_change, menu_choose
        await this.sounds.load('menu_change', '/icytowergame/resources/audio/menu_change.ogg');
        await this.sounds.load('menu_choose', '/icytowergame/resources/audio/menu_choose.ogg');
        // tryagain, gameover
        await this.sounds.load('tryagain', '/icytowergame/resources/audio/tryagain.ogg');
        await this.sounds.load('gameover', '/icytowergame/resources/audio/gameover.ogg');

        await this.music.load('player', "/icytowergame/resources/audio/characters/" + playerNameToSoundName[this.options["singleplayer"]["character"]] +"_background.ogg");
        this.music.map["player"].loop = true;

        this.music.map["background"].pause();
        this.music.map["background"].currentTime = 0;

        this.loading = false;

        this.player.sounds.map["greeting"].play();
        this.music.map["player"].play();
    }

    update(deltaTime) {
        if(this.loading){

        }
        else if(this.isGameOver){
            if(this.anyKeyDown() && !this.afterGame){
                this.afterGame = true;
                this.sounds.map["menu_choose"].play();
                this.music.map["player"].src = "";
                this.music.map["player"].load();
            }
            else if(this.afterGame){
                if(this.onKeyDown(40)){
                    this.ag_arrow = (this.ag_arrow + 1) % after_menu.length;
                    this.sounds.map["menu_change"].play();
                }
                else if(this.onKeyDown(38)){
                    this.ag_arrow = (this.ag_arrow + after_menu.length - 1) % after_menu.length;
                    this.sounds.map["menu_change"].play();
                }
                else if(this.onKeyDown(13) || this.onKeyDown(32)){
                    this.sounds.map["menu_choose"].play();
                    switch(this.ag_arrow){
                        case 0:
                            let pomstates = this.states;
                            let newstate = new SingleplayerState(this.states, this.ctx, this.canvas, this.pressedKeys, this.options, this.music);
                            pomstates.pop();
                            pomstates.push(newstate);
                            newstate.load();
                            this.sounds.map["tryagain"].play();
                            //this.music.map["player"].play();
                            break;
                        case 1:
                            let scores = [];
                            if(window.localStorage['scores']){
                                scores = JSON.parse(window.localStorage['scores']);
                            }
                            let d = new Date();
                            scores.push({
                                "score" : this.score + this.combo.score,
                                "floor": this.maxFloor,
                                "combo": this.combo.max_combo,
                                "date": d.toUTCString()
                            });
                            scores = scores.sort((a,b) => {
                                return b["score"] - a["score"]
                            });
                            scores = scores.slice(0, 5);
                            window.localStorage['scores'] = JSON.stringify(scores);
                            this.states.pop();
                            break;
                        case 2:
                            this.states.pop();
                            this.states.pop();
                            this.music.map["background"].play();
                            break;
                    }
                }
            }
        }
        else if(this.isPaused){
            if(this.anyKeyDown()){
                this.isPaused = false;
            }
        }
        else if(this.isExit) {
            if(this.onKeyDown(27)){
                this.states.pop();
                this.music.map["player"].src = "";
                this.music.map["player"].load();
                this.music.map["background"].play();
            }
            else {
                if(this.anyKeyDown()) this.isExit = false;
            }
        }
        else{
            this.viewY -= this.moveSpeed * deltaTime;
            if(this.player.y < 240){
                this.viewY = Math.min(this.viewY, this.player.y - 240);
            }

            let pom = Math.floor(-this.viewY / 512);
            if(pom % 2 == 0){
                this.background.y1 = (-512) * pom - 512;
                this.background.y2 = (-512) * pom;
            }
            else{
                this.background.y2 = (-512) * pom - 512;
                this.background.y1 = (-512) * pom;
            }

            let playerPrevSpeed = this.player.y;
            this.player.update(deltaTime);
            this.platform.update(deltaTime, this.player, playerPrevSpeed, this);

            // Clock update
            if(this.isStarted){
                if(this.cicles < 5){
                    this.clock_timer += deltaTime * 1000;
                    if(this.clock_timer >= 100) {
                        this.clock.angle += this.clock_timer * 360 / 30000;
                        this.clock_timer = 0;
                    }
                    if(this.clock.angle >= 360){
                        this.clock.angle = 0;
                        this.clock_timer = 0;
                        this.cicles++;
                        this.moveSpeed *= 1.4;
                        this.hurryup = 480;
                        this.sounds.map['hurryup'].play();
                        this.sounds.map['ring'].play();
                    }
                }
                else{
                    this.clock.angle -= deltaTime * 1000;
                }
            }

            if(this.hurryup > -60) this.hurryup -= deltaTime * 100;

            this.combo.update(deltaTime, this.combo_cnt, this.sounds);
            if(!this.msg) this.msg = this.combo.msg;
            this.combo_cnt = this.combo.count;

            // Player dies
            if(this.player.y > this.viewY + 550){
                this.isGameOver = true;
                this.combo.isOn = false;
                this.combo.combo_time = 0;
                if(this.combo_cnt > 1 && this.combo.floors >= 4){
                    this.combo.score += this.combo.floors * this.combo.floors;
                }
                this.combo.floors = 0;
                this.combo_cnt = 0;
                //this.msg = null;
                //this.particles = [];
                this.hurryup = -60;
                this.msg = null;
                this.sounds.map['gameover'].play();
                this.player.sounds.map['fall'].play();
            }
            if(this.part_cnt > 10){
                this.part_cnt = 0;
                if(this.player.isRotate && this.combo_cnt > 0){
                    this.particleEngine.add(this.player.x, this.player.y);
                }
            }
            this.part_cnt += deltaTime * 1000;
            this.particleEngine.update(deltaTime, this.viewY);

            // Message
            if(this.msg){
                this.msg_cnt += 1500*deltaTime;
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

            // Event Handler
            if(this.onKeyDown(27)){
                this.isExit = true;
            }
            else if(this.onKeyDown(80)){
                this.isPaused = true;
            }
        }
        for(let i in this.sounds.map){
            this.sounds.map[i].volume = this.options['sound'] / 10;
        }
        for(let i in this.player.sounds.map){
            this.player.sounds.map[i].volume = this.options['sound'] / 10;
        }
        for(let i in this.music.map){
            this.music.map[i].volume = this.options['music'] / 10;
        }
        this.prevPressedKeys = {...this.pressedKeys};
    }

    render() {
        if(this.loading){

        }
        else{
            let bg = this.textures.get('background');
            this.ctx.drawImage(bg, 0, 0, bg.width, bg.height, 0, this.background.y1 - this.viewY, bg.width, bg.height);
            this.ctx.drawImage(bg, 0, 0, bg.width, bg.height, 0, this.background.y2 - this.viewY, bg.width, bg.height);

            this.ctx.drawImage(this.textures.get("messages"), 0, 0, 285, 56, 320 - 285 / 2, this.hurryup, 285, 56);

            this.platform.render(this.viewY);

            this.player.render(this.viewY);

            this.clock.render();
            this.combo.render();

            this.ctx.font = "24px ComicFont";
            this.ctx.textAlign = "left";
            this.ctx.textBaseline = "bottom";
            this.ctx.fillStyle = "white";
            this.ctx.strokeStyle = "black";
            this.ctx.lineWidth = 2;
            this.ctx.fillText("Score : " + (this.score + this.combo.score).toString(), 8, 470);
            this.ctx.strokeText("Score : " + (this.score + this.combo.score).toString(), 8, 470);

            this.particleEngine.render(this.viewY);

            if(this.msg) this.msg.render();

            if(this.isGameOver){
                this.ctx.drawImage(this.textures.get("messages"), 0, 918, 413, 86, 320 - 207.5, 150 - 43, 413, 86);

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
        
                    this.ctx.drawImage(this.textures.get("paper1"), 0, 0, this.textures.get("paper1").width, this.textures.get("paper1").height, 320 - this.textures.get("paper1").width / 2, 240 -  this.textures.get("paper1").height / 2,  this.textures.get("paper1").width,  this.textures.get("paper1").height);

                    this.ctx.font = "24px ComicFont";
                    this.ctx.textAlign = "left";
                    this.ctx.fillStyle = "black";

                    after_menu.forEach((i, j) => {
                        this.ctx.fillText(i, 230, 205 + j * 40);

                    });

                    this.ctx.drawImage(this.textures.get("pointer"), 0, 0, this.textures.get("pointer").width, this.textures.get("pointer").height, 180, 190 + this.ag_arrow *40, this.textures.get("pointer").width, this.textures.get("pointer").height);
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
    }
}

// Exports
export { SingleplayerState };
