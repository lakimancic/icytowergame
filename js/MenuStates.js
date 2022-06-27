/***************************************/
/*           MAIN MENU STATE           */
/***************************************/

// Imports
import { State } from './State.js';
import { SingleplayerState } from './SingleplayerState.js';
import { SingleplayerOptionsState, GlobalOptionsState } from './OptionStates.js';

// MainMenuState class
class MainMenuState extends State{
    constructor(states, ctx, canvas, pressedKeys, options, music, startMusic = false) {
        super(states, ctx, canvas, pressedKeys, options, music);

        this.menuItems = [ "Singleplayer", "Instructions", "Options", "Exit" ];
        this.selectedItem = 0;

        this.startMusic = startMusic;

        this.isInstructs = false;
    }

    async load() {
        // Load textures
        await this.textures.load('background', '/icytowergame/resources/images/backgrounds/menu_bg.png');
        await this.textures.load('instructs', '/icytowergame/resources/images/backgrounds/instructs.png');
        await this.textures.load('arrow', '/icytowergame/resources/images/others/menu_arrow.png');
        
        // Load sounds
        await this.sounds.load('menu_choose', '/icytowergame/resources/audio/menu_choose.ogg');
        await this.sounds.load('menu_change', '/icytowergame/resources/audio/menu_change.ogg');

        // Load music background
        if(this.startMusic){
            await this.music.load('background', '/icytowergame/resources/audio/background.ogg');
            this.music.map['background'].loop = true;
        }

        // Set loading to false
        this.loading = false;

        //this.music.map['background'].play();
    }

    update() {
        this.handleInput();

        for(let i in this.sounds.map){
            this.sounds.map[i].volume = this.options['sound'] / 10;
        }
        for(let i in this.music.map){
            this.music.map[i].volume = this.options['music'] / 10;
        }
    }

    render() {
        if(this.loading) {
            // Render loading screen
        }
        else {
            if(!this.isInstructs){
                // Draw background
                this.ctx.drawImage(this.textures.map['background'], 0, 0);

                // Draw menu items
                this.ctx.font = "22px ComicFont";
                this.ctx.fillStyle = "black";
                this.ctx.textAlign = "left";
                this.ctx.textBaseline = "middle";
                this.ctx.lineWidth = 1.8;
                for(let i = 0; i < this.menuItems.length; i++) {
                    this.ctx.fillText(this.menuItems[i], 390, 315 + i * 32);
                }

                // Draw selected item arrow
                this.ctx.drawImage(this.textures.map['arrow'], 343, 308 + this.selectedItem * 32);

                if(this.startMusic){
                    this.ctx.fillStyle = "rgba(0,0,0,0.5)";
                    this.ctx.fillRect(0,0,640,480);
        
                    this.ctx.font = "32px ComicFont";
                    this.ctx.textAlign = "center";
                    this.ctx.fillStyle = "white";
                    this.ctx.strokeStyle = "black";
                    this.ctx.lineWidth = 2;
        
                    this.ctx.fillText("This game contains audio material !", 320, 220);
                    this.ctx.strokeText("This game contains audio material !", 320, 220);
        
                    this.ctx.font = "28px ComicFont";
                    this.ctx.fillText("Press any key to continue !", 320, 260);
                    this.ctx.strokeText("Press any key to continue !", 320, 260);
                }
            }
            else{
                this.ctx.drawImage(this.textures.map['instructs'], 0, 0);
            }
        }
    }

    onMenuItemSelected() {
        switch(this.selectedItem) {
            case 0:
                let menuSp = new SingleplayerMenuState(this.states, this.ctx, this.canvas, this.pressedKeys, this.options, this.music);
                menuSp.load();
                this.states.push(menuSp);
                break;
            case 1:
                this.isInstructs = true;
                break;
            case 2:
                let globOpt = new GlobalOptionsState(this.states, this.ctx, this.canvas, this.pressedKeys, this.options, this.music);
                globOpt.load();
                this.states.push(globOpt);
                break;
            case 3:
                this.states.pop();
                console.log("Exiting game...");
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                break;
        }
    }

    handleInput() {
        if(!this.startMusic && !this.isInstructs){
            // Handle arrow keys
            if(this.onKeyDown(40)){
                this.selectedItem = (this.selectedItem + 1) % this.menuItems.length;
                this.sounds.map['menu_change'].play();
            }
            if(this.onKeyDown(38)){
                this.selectedItem = (this.selectedItem + this.menuItems.length - 1) % this.menuItems.length;
                this.sounds.map['menu_change'].play();
            }
            // Handle enter key
            if(this.onKeyDown(13) || this.onKeyDown(32)){
                this.onMenuItemSelected();
                this.sounds.map['menu_choose'].play();
            }
        }
        else if(this.startMusic && !this.isInstructs){
            if(this.anyKeyDown()){
                this.startMusic = false;
                this.music.map['background'].play();
            }
        }
        else if(this.isInstructs){
            if(this.anyKeyDown()){
                this.isInstructs = false;
            }
        }
        this.prevPressedKeys = {...this.pressedKeys};
    }
}

/***************************************/
/*      SINGLEPLAYER MENU STATE        */
/***************************************/

class SingleplayerMenuState extends State{
    constructor(states, ctx, canvas, pressedKeys, options, music) {
        super(states, ctx, canvas, pressedKeys, options, music);

        this.menuItems = [ "Play", "High Scores", "Options", "Back" ];
        this.selectedItem = 0;

        this.isHighScores = false;
    }

    async load() {
        // Load textures
        await this.textures.load('background', '/icytowergame/resources/images/backgrounds/menu_bg.png');
        await this.textures.load('arrow', '/icytowergame/resources/images/others/menu_arrow.png');
        await this.textures.load('paper2', '/resources/images/others/paper2.png');

        // Load sounds
        await this.sounds.load('menu_choose', '/icytowergame/resources/audio/menu_choose.ogg');
        await this.sounds.load('menu_change', '/icytowergame/resources/audio/menu_change.ogg');

        // Set loading to false
        this.loading = false;
    }

    update() {
        this.handleInput();

        for(let i in this.sounds.map){
            this.sounds.map[i].volume = this.options['sound'] / 10;
        }
    }

    render() {
        if(this.loading) {
            // Render loading screen
        }
        else {
            // Draw background
            this.ctx.drawImage(this.textures.map['background'], 0, 0);

            // Draw menu items
            this.ctx.font = "26px ComicFont";
            this.ctx.fillStyle = "black";
            this.ctx.textBaseline = "middle";
            this.ctx.textAlign = "left";
            this.ctx.lineWidth = 1.8;
            for(let i = 0; i < this.menuItems.length; i++) {
                this.ctx.fillText(this.menuItems[i], 390, 315 + i * 35);
            }

            // Draw selected item arrow
            this.ctx.drawImage(this.textures.map['arrow'], 343, 308 + this.selectedItem * 35);

            if(this.isHighScores){
                this.ctx.fillStyle = "rgba(0,0,0,0.5)";
                this.ctx.fillRect(0,0,640,480);
    
                this.ctx.drawImage(this.textures.get("paper2"), 0, 0, this.textures.get("paper2").width, this.textures.get("paper2").height, 320 - this.textures.get("paper2").width / 2, 0, this.textures.get("paper2").width, this.textures.get("paper2").height);
    
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
        }
    }

    handleInput() {
        if(!this.isHighScores) {
            // Handle arrow keys
            if(this.onKeyDown(40)){
                this.selectedItem = (this.selectedItem + 1) % this.menuItems.length;
                this.sounds.map['menu_change'].play();
            }
            if(this.onKeyDown(38)){
                this.selectedItem = (this.selectedItem + this.menuItems.length - 1) % this.menuItems.length;
                this.sounds.map['menu_change'].play();
            }
            // Handle enter key
            if(this.onKeyDown(13) || this.onKeyDown(32)){
                this.onMenuItemSelected();
                this.sounds.map['menu_choose'].play();
            }
        }
        else {
            if(this.anyKeyDown()) {
                this.isHighScores = false;
                this.sounds.map['menu_choose'].play();
            }
        }
        this.prevPressedKeys = {...this.pressedKeys};
    }

    onMenuItemSelected() {
        switch(this.selectedItem) {
            case 0:
                let spState = new SingleplayerState(this.states, this.ctx, this.canvas, this.pressedKeys, this.options, this.music);
                spState.load();
                this.states.push(spState);
                break;
            case 1:
                this.isHighScores = true;
                break;
            case 2:
                let menuOp = new SingleplayerOptionsState(this.states, this.ctx, this.canvas, this.pressedKeys, this.options, this.music);
                menuOp.load();
                this.states.push(menuOp);
                break;
            case 3:
                this.states.pop();
                console.log("Exiting singleplayer...");
                //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                break;
        }
    }
}


// Exports
export { MainMenuState, SingleplayerMenuState };
