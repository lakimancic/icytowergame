export default class Floor{
    constructor(ctx, sprites, x, y, width, type, num){
        this.ctx = ctx;
        this.sprites = sprites;
        
        this.x = x;
        this.y = y;
        this.width = width;
        this.HEIGHT = 37;
        this.type = type;

        this.num = num;
    }

    render(){
        if(this.num < 100) {
            this.ctx.drawImage(this.sprites["floors01"], 0, this.type*(this.HEIGHT + 1), this.width, this.HEIGHT, this.x, this.y, this.width, this.HEIGHT);
            if(this.num % 10 == 0){
                let img_w = this.sprites["sign1"].width;
                let img_h = this.sprites["sign1"].height;
                this.ctx.drawImage(this.sprites["sign1"], 0, 0, img_w, img_h, this.x + this.width / 2 - img_w / 2, this.y + 20, img_w, img_h);
                this.ctx.font = "12px Arial";
                this.ctx.textAlign = "center";
                this.ctx.fillStyle = "white";
                this.ctx.fillText(this.num.toString(), this.x + this.width / 2, this.y + 24 + img_h / 2);
            }
        }
        else if(this.num < 200) {
            this.ctx.drawImage(this.sprites["floors02"], 0, this.type*(this.HEIGHT + 1), this.width, this.HEIGHT, this.x, this.y, this.width, this.HEIGHT);
            if(this.num % 10 == 0){
                let img_w = this.sprites["sign2"].width;
                let img_h = this.sprites["sign2"].height;
                this.ctx.drawImage(this.sprites["sign2"], 0, 0, img_w, img_h, this.x + this.width / 2 - img_w / 2, this.y + 20, img_w, img_h);
                this.ctx.font = "12px Arial";
                this.ctx.textAlign = "center";
                this.ctx.fillStyle = "white";
                this.ctx.fillText(this.num.toString(), this.x + this.width / 2, this.y + 24 + img_h / 2);
            }
        }
        else if(this.num < 300){
            this.ctx.drawImage(this.sprites["floors03"], 0, this.type*(this.HEIGHT + 1), this.width, this.HEIGHT, this.x, this.y, this.width, this.HEIGHT);
            if(this.num % 10 == 0){
                let img_w = this.sprites["sign3"].width;
                let img_h = this.sprites["sign3"].height;
                this.ctx.drawImage(this.sprites["sign3"], 0, 0, img_w, img_h, this.x + this.width / 2 - img_w / 2, this.y + 20, img_w, img_h);
                this.ctx.font = "12px Arial";
                this.ctx.textAlign = "center";
                this.ctx.fillStyle = "white";
                this.ctx.fillText(this.num.toString(), this.x + this.width / 2, this.y + 24 + img_h / 2);
            }
        }
        else if(this.num < 400){
            this.ctx.drawImage(this.sprites["floors04"], 0, this.type*(this.HEIGHT + 1), this.width, this.HEIGHT, this.x, this.y, this.width, this.HEIGHT);
            if(this.num % 10 == 0){
                let img_w = this.sprites["sign4"].width;
                let img_h = this.sprites["sign4"].height;
                this.ctx.drawImage(this.sprites["sign4"], 0, 0, img_w, img_h, this.x + this.width / 2 - img_w / 2, this.y + 20, img_w, img_h);
                this.ctx.font = "12px Arial";
                this.ctx.textAlign = "center";
                this.ctx.fillStyle = "white";
                this.ctx.fillText(this.num.toString(), this.x + this.width / 2, this.y + 24 + img_h / 2);
            }
        }
        else if(this.num < 500){
            this.ctx.drawImage(this.sprites["floors05"], 0, this.type*(this.HEIGHT + 1), this.width, this.HEIGHT, this.x, this.y, this.width, this.HEIGHT);
            if(this.num % 10 == 0){
                let img_w = this.sprites["sign5"].width;
                let img_h = this.sprites["sign5"].height;
                this.ctx.drawImage(this.sprites["sign5"], 0, 0, img_w, img_h, this.x + this.width / 2 - img_w / 2, this.y + 20, img_w, img_h);
                this.ctx.font = "12px Arial";
                this.ctx.textAlign = "center";
                this.ctx.fillStyle = "white";
                this.ctx.fillText(this.num.toString(), this.x + this.width / 2, this.y + 24 + img_h / 2);
            }
        }
        else if(this.num < 600){
            this.ctx.drawImage(this.sprites["floors06"], 0, this.type*(this.HEIGHT + 1), this.width, this.HEIGHT, this.x, this.y, this.width, this.HEIGHT);
            if(this.num % 10 == 0){
                let img_w = this.sprites["sign6"].width;
                let img_h = this.sprites["sign6"].height;
                this.ctx.drawImage(this.sprites["sign6"], 0, 0, img_w, img_h, this.x + this.width / 2 - img_w / 2, this.y + 20, img_w, img_h);
                this.ctx.font = "12px Arial";
                this.ctx.textAlign = "center";
                this.ctx.fillStyle = "white";
                this.ctx.fillText(this.num.toString(), this.x + this.width / 2, this.y + 24 + img_h / 2);
            }
        }
        else if(this.num < 700){
            this.ctx.drawImage(this.sprites["floors07"], 0, this.type*(this.HEIGHT + 1), this.width, this.HEIGHT, this.x, this.y, this.width, this.HEIGHT);
            if(this.num % 10 == 0){
                let img_w = this.sprites["sign7"].width;
                let img_h = this.sprites["sign7"].height;
                this.ctx.drawImage(this.sprites["sign7"], 0, 0, img_w, img_h, this.x + this.width / 2 - img_w / 2, this.y + 20, img_w, img_h);
                this.ctx.font = "12px Arial";
                this.ctx.textAlign = "center";
                this.ctx.fillStyle = "white";
                this.ctx.fillText(this.num.toString(), this.x + this.width / 2, this.y + 24 + img_h / 2);
            }
        }
        else if(this.num < 800){
            this.ctx.drawImage(this.sprites["floors08"], 0, this.type*(this.HEIGHT + 1), this.width, this.HEIGHT, this.x, this.y, this.width, this.HEIGHT);
            if(this.num % 10 == 0){
                let img_w = this.sprites["sign8"].width;
                let img_h = this.sprites["sign8"].height;
                this.ctx.drawImage(this.sprites["sign8"], 0, 0, img_w, img_h, this.x + this.width / 2 - img_w / 2, this.y + 20, img_w, img_h);
                this.ctx.font = "12px Arial";
                this.ctx.textAlign = "center";
                this.ctx.fillStyle = "white";
                this.ctx.fillText(this.num.toString(), this.x + this.width / 2, this.y + 24 + img_h / 2);
            }
        }
        else if(this.num < 900){
            this.ctx.drawImage(this.sprites["floors09"], 0, this.type*(this.HEIGHT + 1), this.width, this.HEIGHT, this.x, this.y, this.width, this.HEIGHT);
            if(this.num % 10 == 0){
                let img_w = this.sprites["sign9"].width;
                let img_h = this.sprites["sign9"].height;
                this.ctx.drawImage(this.sprites["sign9"], 0, 0, img_w, img_h, this.x + this.width / 2 - img_w / 2, this.y + 20, img_w, img_h);
                this.ctx.font = "12px Arial";
                this.ctx.textAlign = "center";
                this.ctx.fillStyle = "white";
                this.ctx.fillText(this.num.toString(), this.x + this.width / 2, this.y + 24 + img_h / 2);
            }
        }
        else if(this.num < 1000){
            this.ctx.drawImage(this.sprites["floors10"], 0, this.type*(this.HEIGHT + 1), this.width, this.HEIGHT, this.x, this.y, this.width, this.HEIGHT);
            if(this.num % 10 == 0){
                let img_w = this.sprites["sign10"].width;
                let img_h = this.sprites["sign10"].height;
                this.ctx.drawImage(this.sprites["sign10"], 0, 0, img_w, img_h, this.x + this.width / 2 - img_w / 2, this.y + 20, img_w, img_h);
                this.ctx.font = "12px Arial";
                this.ctx.textAlign = "center";
                this.ctx.fillStyle = "white";
                this.ctx.fillText(this.num.toString(), this.x + this.width / 2, this.y + 24 + img_h / 2);
            }
        }
        else {
            this.ctx.drawImage(this.sprites["floors11"], 0, this.type*(this.HEIGHT + 1), this.width, this.HEIGHT, this.x, this.y, this.width, this.HEIGHT);
            if(this.num % 10 == 0){
                let img_w = this.sprites["sign11"].width;
                let img_h = this.sprites["sign11"].height;
                this.ctx.drawImage(this.sprites["sign11"], 0, 0, img_w, img_h, this.x + this.width / 2 - img_w / 2, this.y + 20, img_w, img_h);
                this.ctx.font = "12px Arial";
                this.ctx.textAlign = "center";
                this.ctx.fillStyle = "white";
                this.ctx.fillText(this.num.toString(), this.x + this.width / 2, this.y + 24 + img_h / 2);
            }
        }
    }
}