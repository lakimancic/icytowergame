import GameScene from "./GameScene.js";
import { MenuScene, InstructScene } from "./OtherScenes.js"

const loadSprite = (url) => new Promise((res,err) => {
    let image = new Image();
    image.src = url;
    image.onload = () => {
        res(image);
    }
});

const playerSkins = [
    {
        name : "Harold the Homeboy",
        url : "player"
    },
    {
        name : "Disco Dave",
        url : "player2"
    },
    {
        name : "Jungle Jane",
        url : "player4"
    },
    {
        name : "Wild Wendy",
        url : "player5"
    }
];

export default class Game{
    constructor(ctx, canvas){
        this.ctx = ctx;
        this.sprites = { };
        this.canvas = canvas;
        this.scene = new MenuScene(this.sprites, ctx);
        this.isHighScores = false;
        this.playerOption = 0;
        if(window.localStorage["icytower_playerSelect"]){
            this.playerOption = window.localStorage["icytower_playerSelect"];
        }
        this.playerSelect = false;
        let obj = this;
        //this.scene = new GameScene(ctx, this.sprites);
        window.addEventListener("keypress", function(e) {
            //console.log(e.keyCode)
            if(obj.playerSelect){
                if(e.keyCode == 13){
                    obj.playerSelect = false;
                    window.localStorage["icytower_playerSelect"] = obj.playerOption;
                }
                return;
            }
            if(obj.isHighScores){
                obj.isHighScores = false;
                return;
            }
            if(obj.scene instanceof MenuScene && (e.keyCode == 13 || e.keyCode == 32)){
                if(obj.scene.option == 0) obj.scene = new GameScene(ctx, obj.sprites, playerSkins[obj.playerOption].url);
                else if(obj.scene.option == 1) obj.scene = new InstructScene(obj.sprites, ctx);
                else if(obj.scene.option == 2) obj.isHighScores = true;
                else if(obj.scene.option == 3) obj.playerSelect = true;
            }
            else if(obj.scene instanceof InstructScene) {
                obj.scene = new MenuScene(obj.sprites, ctx);
            }
            else if(obj.scene instanceof GameScene && (e.keyCode == 13 || e.keyCode == 32)){
                if(obj.scene.afterGame){
                    if(obj.scene.ag_arrow == 0) {
                        obj.scene = new GameScene(obj.ctx, obj.sprites, playerSkins[obj.playerOption].url);
                    }
                    else if(obj.scene.ag_arrow == 1){
                        let scores = [];
                        if(window.localStorage['scores']){
                            scores = JSON.parse(window.localStorage['scores']);
                        }
                        let d = new Date();
                        scores.push({
                            "score" : obj.scene.score + obj.scene.combo.score,
                            "floor": obj.scene.maxFloor,
                            "combo": obj.scene.combo.max_combo,
                            "date": d.toUTCString()
                        });
                        scores = scores.sort((a,b) => {
                            return b["score"] - a["score"]
                        });
                        scores = scores.slice(0, 5);
                        window.localStorage['scores'] = JSON.stringify(scores);
                        obj.scene = new MenuScene(obj.sprites, obj.ctx);
                    }
                    else if(obj.scene.ag_arrow == 2){
                        obj.scene = new MenuScene(obj.sprites, obj.ctx);
                    }
                }
            }
        });
        window.addEventListener("keyup", function(e) {
            if(obj.scene instanceof MenuScene){
                if(obj.playerSelect){
                    if(e.keyCode == 37) {
                        obj.playerOption--;
                        if(obj.playerOption < 0) obj.playerOption += playerSkins.length;
                    }
                    else if(e.keyCode == 39){
                        obj.playerOption++;
                        if(obj.playerOption >= playerSkins.length) obj.playerOption -= playerSkins.length;
                    }
                }
            }
            else if(obj.scene instanceof GameScene){
                if(obj.scene.isExit ){
                    if(e.keyCode == 27) obj.scene = new MenuScene(obj.sprites, obj.ctx);
                    else obj.scene.isExit = false;
                }
            }
        });
    }
    async loadSprites() {
        this.sprites.bg = await loadSprite("/images/background.png");
        this.sprites.player = await loadSprite("/images/player.png");
        this.sprites.player2 = await loadSprite("/images/player2.png");
        this.sprites.player3 = await loadSprite("/images/player3.png");
        this.sprites.player4 = await loadSprite("/images/player4.png");
        this.sprites.player5 = await loadSprite("/images/player5.png");
        this.sprites.floors01 = await loadSprite("/images/floors01.png");
        this.sprites.floors02 = await loadSprite("/images/floors02.png");
        this.sprites.floors03 = await loadSprite("/images/floors03.png");
        this.sprites.floors04 = await loadSprite("/images/floors04.png");
        this.sprites.floors05 = await loadSprite("/images/floors05.png");
        this.sprites.floors06 = await loadSprite("/images/floors06.png");
        this.sprites.floors07 = await loadSprite("/images/floors07.png");
        this.sprites.floors08 = await loadSprite("/images/floors08.png");
        this.sprites.floors09 = await loadSprite("/images/floors09.png");
        this.sprites.floors10 = await loadSprite("/images/floors10.png");
        this.sprites.floors11 = await loadSprite("/images/floors11.png");
        this.sprites.sign1 = await loadSprite("/images/sign1.png");
        this.sprites.sign2 = await loadSprite("/images/sign2.png");
        this.sprites.sign3 = await loadSprite("/images/sign3.png");
        this.sprites.sign4 = await loadSprite("/images/sign4.png");
        this.sprites.sign5 = await loadSprite("/images/sign5.png");
        this.sprites.sign6 = await loadSprite("/images/sign6.png");
        this.sprites.sign7 = await loadSprite("/images/sign7.png");
        this.sprites.sign8 = await loadSprite("/images/sign8.png");
        this.sprites.sign9 = await loadSprite("/images/sign9.png");
        this.sprites.sign10 = await loadSprite("/images/sign10.png");
        this.sprites.sign11 = await loadSprite("/images/sign11.png");
        this.sprites.comboclock = await loadSprite("/images/ComboClock.png");
        this.sprites.msgs = await loadSprite("/images/messages.png");
        this.sprites.particles = await loadSprite("/images/particles.png");
        this.sprites.menu_bg = await loadSprite("/images/menu_bg.png");
        this.sprites.pointer = await loadSprite("/images/menu_arrow.png");
        this.sprites.instructs = await loadSprite("/images/instructs.png");
        this.sprites.paper1 = await loadSprite("/images/paper1.png");
        this.sprites.paper2 = await loadSprite("/images/paper2.png");
        this.sprites.arrows = await loadSprite("/images/arrows.png")
        //console.log(this.sprites);
    }

    render() {
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

        this.scene.render();

        if(this.isHighScores){
            this.ctx.fillStyle = "rgba(0,0,0,0.5)";
            this.ctx.fillRect(0,0,640,480);

            this.ctx.drawImage(this.sprites.paper2, 0, 0, this.sprites.paper2.width, this.sprites.paper2.height, 320 - this.sprites.paper2.width / 2, 0, this.sprites.paper2.width, this.sprites.paper2.height);

            let scores = [];
            if(window.localStorage['scores']){
                scores = JSON.parse(window.localStorage['scores']);
            }
            //this.ctx.font = "14px ComicFont";
            this.ctx.textAlign = "left";
            this.ctx.fillStyle = "black";

            scores.forEach((i, j) => {
                this.ctx.font = "16px ComicFont";
                this.ctx.fillText((j + 1).toString() + ". " + i.date, 180, 100 + j*75);

                this.ctx.font = "14px ComicFont";
                this.ctx.fillText("Score : " + i.score, 190, 125 + j * 75);
                this.ctx.fillText("Floor : " + i.floor, 190, 145 + j * 75);
                this.ctx.fillText("Combo : " + i.combo, 340, 145 + j * 75);
            });
        }
        else if(this.playerSelect){
            this.ctx.fillStyle = "rgba(0,0,0,0.9)";
            this.ctx.fillRect(0,0,640,480);

            this.ctx.drawImage(this.sprites[playerSkins[this.playerOption].url], 3, 11, 33, 54, 320 - 33 / 2, 240 - 27, 33, 54);
            let aw = this.sprites.arrows.width;
            let ah = this.sprites.arrows.height;
            this.ctx.drawImage(this.sprites.arrows, 0, 0, aw / 2, ah, 250 - aw / 4, 240 - ah / 2, aw / 2 , ah);
            this.ctx.drawImage(this.sprites.arrows, aw / 2, 0, aw / 2, ah, 390 - aw / 4, 240 - ah / 2, aw / 2 , ah);
            this.ctx.font = "24px ComicFont";
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = "white";
            this.ctx.strokeStyle = "black";
            this.ctx.lineWidth = 2;
            this.ctx.fillText(playerSkins[this.playerOption].name, 320, 320);
            this.ctx.strokeText(playerSkins[this.playerOption].name, 320, 320);

            this.ctx.fillText("Press Enter to select Player Skin", 320, 400);
            this.ctx.strokeText("Press Enter to select Player Skin", 320, 400);
        }
    }

    update(dt) {
        //console.log(dt);
        this.scene.update(dt);
    }

    async run() {
        await this.loadSprites();

        this.ct = Date.now();
        this.mainLoop = setInterval(() => {
            if(!document.hidden){
                this.update(Date.now() - this.ct);
                this.render();
            }
            this.ct = Date.now();
        }, 0);
    }

    exit() {
        clearInterval(this.mainLoop);
    }
}
