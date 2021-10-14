const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext('2d');

ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

import Game from "./Game.js"

const game = new Game(ctx, canvas);
game.run();