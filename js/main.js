const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext('2d');

ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

// Game
import { Game } from './Game.js';

let game = new Game(canvas, ctx);
game.run();