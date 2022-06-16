const msg_types = [
    [0, 57, 127, 39],
    [0, 98, 203, 53],
    [0, 152, 241, 64],
    [0, 219, 271, 70],
    [0, 291, 239, 76],
    [0, 368, 488, 89],
    [0, 459, 522, 100],
    [0, 560, 541, 100],
    [0, 668, 580, 114],
    [0, 784, 612, 133]
];

class Message{
    constructor(ctx,sprites,type){
        this.ctx = ctx;
        this.sprites = sprites;

        this.scale = 0;
        this.angle = 0;

        this.w = msg_types[type][2];
        this.h = msg_types[type][3];
        this.sx = msg_types[type][0];
        this.sy = msg_types[type][1];
        this.x = 320 - this.w/2;
        this.y = 380 - this.h/2;
    }

    render() {
        this.ctx.save();
        this.ctx.translate(320, 380);
        this.ctx.rotate(this.angle * Math.PI / 180);
        this.ctx.scale(this.scale, this.scale);
        this.ctx.translate(-320, -380);
        this.ctx.drawImage(this.sprites.get("messages"), this.sx, this.sy, this.w, this.h, this.x, this.y, this.w, this.h);
        this.ctx.restore();
    }
}

export { Message };