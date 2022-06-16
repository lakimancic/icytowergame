/***************************/
/*        GAME CLASS       */
/***************************/
// Imports
import { MainMenuState } from './MenuStates.js';
import { AudioHolder } from './ResourceHolder.js';

//console.log(CryptoJS.SHA256("tests").toString());

// Game class
class Game {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        this.states = [];

        this.pressedKeys = {};

        this.music = new AudioHolder();

        if(localStorage.getItem('options') !== null) {
            this.options = JSON.parse(localStorage.getItem('options'));
            this.options.fullscreen = false;
        } else {
            this.options = {
                "singleplayer" : {
                    "character" : "player01"
                },
                "music": 10,
                "sound": 10,
                "fullscreen": false,
                "controls": {
                    "up": {
                        keyname: "ArrowUp",
                        keycode: 38
                    },
                    "left": {
                        keyname: "ArrowLeft",
                        keycode: 37
                    },
                    "right": {
                        keyname: "ArrowRight",
                        keycode: 39
                    },
                    "jump": {
                        keyname: "Space",
                        keycode: 32
                    }
                }
            };
        }

        addEventListener('keydown', (e) => {
            this.pressedKeys[e.keyCode] = e.code;
            //if(e.keyCode == 27) e.preventDefault();
        });

        addEventListener('keyup', (e) => {
            this.pressedKeys[e.keyCode] = false;
        });

        // When user leaves the page
        addEventListener('beforeunload', (e) => {
            this.saveOptions();
        });
    }

    run() {
        let mainmenu = new MainMenuState(this.states, this.ctx, this.canvas, this.pressedKeys, this.options, this.music, true);
        mainmenu.load();

        this.states.push(mainmenu);

        // Current time
        let ct = null;
        let timePerFrame = 1/60;
        let timeSinceLastUpdate = 0;

        let step = (timestamp) => {

            if(!ct) ct = timestamp;
            
            // Update Game with Delta time
            let dt = (timestamp - ct) / 1000;
            timeSinceLastUpdate += dt;
            while(timeSinceLastUpdate > timePerFrame) {
                this.update(timePerFrame);
                timeSinceLastUpdate -= timePerFrame;
            }
            ct = timestamp;

            // Render Game
            this.render();

            // Request Animation Frame
            window.requestAnimationFrame(step);
        }

        // Request Animation Frame
        window.requestAnimationFrame(step);
    }

    update(dt){
        if(this.states.length > 0)
            this.states[this.states.length - 1].update(dt);
        else {
            this.saveOptions();
        }
    }

    render(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if(this.states.length > 0)
            this.states[this.states.length - 1].render();
    }

    saveOptions() {
        localStorage.setItem('options', JSON.stringify(this.options));
    }
}

// Exports
export { Game };