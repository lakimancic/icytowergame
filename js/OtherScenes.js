const options = [
    "Play Game", "Instructions", "High Scores", "Change Skin"
];

class MenuScene {
    constructor(sprites, ctx){
        this.sprites = sprites;
        this.ctx = ctx;

        this.option = 0;

        let obj = this;

        window.addEventListener("keydown", function(e){
            //e.preventDefault();
            if(e.keyCode == 38){
                obj.option--;
                if(obj.option < 0) obj.option += options.length;
            }
            else if(e.keyCode == 40){
                obj.option++;
                if(obj.option >= options.length) obj.option -= options.length;
            }
            //console.log(e.keyCode)
        });
    }

    render() {
        this.ctx.drawImage(this.sprites.menu_bg, 0, 0, 640, 480);

        options.forEach((i,j) => {
            // 370, 310
            this.ctx.font = "24px ComicFont";
            this.ctx.textAlign = "left";
            this.ctx.fillStyle = "black";
            this.ctx.fillText(i, 370, 325 + j * 40);
        });
        // this.ctx.font = "24px ComicFont";
        //     this.ctx.textAlign = "left";
        //     this.ctx.fillStyle = "black";
        // this.ctx.fillText(options[0], 370, 325);
        this.ctx.drawImage(this.sprites.pointer, 0, 0, this.sprites.pointer.width, this.sprites.pointer.height, 325, 310 + this.option *40, this.sprites.pointer.width, this.sprites.pointer.height);
    }

    update(dt) {

    }
}

class InstructScene {
    constructor(sprites, ctx){
        this.sprites = sprites;
        this.ctx = ctx;
    }

    render() {
        this.ctx.drawImage(this.sprites.instructs, 0, 0);
    }

    update(dt) {

    }
}

export { MenuScene, InstructScene };