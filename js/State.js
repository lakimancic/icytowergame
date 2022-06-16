/**********************************/
/*           STATE CLASS          */
/**********************************/

// Imports
import { TextureHolder, AudioHolder } from './ResourceHolder.js';

class State {
    constructor(states, ctx, canvas, pressedKeys, options, music) {
        this.states = states;
        this.ctx = ctx;
        this.canvas = canvas;

        this.textures = new TextureHolder();
        this.sounds = new AudioHolder();
        this.music = music;

        this.loading = true;
        this.loadCount = 0;
        this.loadTotal = 0;

        this.pressedKeys = pressedKeys;
        this.prevPressedKeys = {...this.pressedKeys};

        this.options = options;
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

    anyKeyDown() {
        for(let i in this.pressedKeys){
            if(this.pressedKeys[i]) return !this.prevPressedKeys[i];
        }
        return false;
    }

    getKeyDown() {
        for(let i in this.pressedKeys){
            if(this.pressedKeys[i] && !this.prevPressedKeys[i]) return {
                keyname: this.pressedKeys[i],
                keycode: i
            }
        }
        return null;
    }
}

export { State };