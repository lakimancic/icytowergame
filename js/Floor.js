/*************************************/
/*            FLOOR CLASS            */
/*************************************/

class Floor {
    constructor(ctx, canvas, textures, x, y, width, type, num) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.textures = textures;

        this.x = x;
        this.y = y;

        this.width = width;
        this.HEIGHT = 37;

        this.num = num;
        this.type = type;
    }

    render(viewY) {
        let tempNum = Math.floor(this.num / 100) + 1;
        if(tempNum > 11) tempNum = 11;
        
        this.ctx.drawImage(this.textures.get('floors' + tempNum), 0, this.type*(this.HEIGHT + 1), this.width, this.HEIGHT, this.x, this.y - viewY, this.width, this.HEIGHT);
        if(this.num % 10 == 0){
            let img_w = this.textures.get('sign' + tempNum).width;
            let img_h = this.textures.get('sign' + tempNum).height;
            this.ctx.drawImage(this.textures.get('sign' + tempNum), 0, 0, img_w, img_h, this.x + this.width / 2 - img_w / 2, this.y + 20 - viewY, img_w, img_h);
            this.ctx.font = "12px Arial";
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "bottom";
            this.ctx.fillStyle = "white";
            this.ctx.fillText(this.num.toString(), this.x + this.width / 2, this.y + 27 + img_h / 2 - viewY);
        }
    }
}

export { Floor };