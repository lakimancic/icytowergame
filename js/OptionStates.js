/***************************************/
/*          SP OPTIONS STATE           */
/***************************************/
// Imports
import { State } from './State.js';

const playerSkins = [
    {
        url : "player01",
        size: [ 2, 13, 36, 52 ]
    },
    {
        url : "player02",
        size: [ 2, 13, 36, 52 ]
    },
    {
        url : "player03",
        size: [ 2, 13, 36, 52 ]
    },
    {
        url : "player04",
        size: [ 2, 13, 36, 52 ]
    },
    {
        url : "player05",
        size: [ 2, 13, 36, 52 ]
    },
    {
        url : "player06",
        size: [ 2, 13, 36, 52 ]
    },
    {
        url : "player07",
        size: [ 2, 13, 36, 52 ]
    },
    {
        url : "player08",
        size: [ 2, 13, 36, 52 ]
    },
    {
        url : "player09",
        size: [ 2, 13, 36, 52 ]
    },
    {
        url : "player10",
        size: [ 2, 13, 36, 52 ]
    }
];

class SingleplayerOptionsState extends State {
    constructor(states, ctx, canvas, pressedKeys, options, music) {
        super(states, ctx, canvas, pressedKeys, options, music);

        this.menuItems = ["Character", "Back" ];
        this.selectedItem = 0;
        this.selectedCharacter = 0;

        playerSkins.forEach((skin, index) => {
            if(skin.url == this.options["singleplayer"]["character"]){
                this.selectedCharacter = index;
            }
        });
    }

    async load() {
        // Load textures
        await this.textures.load('background', '/resources/images/backgrounds/menu_bg.png');
        await this.textures.load('arrow', '/resources/images/others/menu_arrow.png');
        // Characters load
        for(let i = 0; i < playerSkins.length; i++) {
            await this.textures.load(playerSkins[i].url, '/resources/images/characters/' + playerSkins[i].url + '.png');
        }
        // Load sounds
        await this.sounds.load('menu_choose', '/resources/audio/menu_choose.ogg');
        await this.sounds.load('menu_change', '/resources/audio/menu_change.ogg');

        // Set loading to false
        this.loading = false;
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
        if(this.loading){
            //
        }
        else {
            this.ctx.drawImage(this.textures.get('background'), 0, 0);
            
            // Draw menu items
            // Draw menu items
            this.ctx.font = "22px ComicFont";
            this.ctx.fillStyle = "black";
            this.ctx.textAlign = "left";
            this.ctx.textBaseline = "middle";
            this.ctx.lineWidth = 1.8;
            for(let i = 0; i < this.menuItems.length; i++) {
                this.ctx.fillText(this.menuItems[i], 390, 340 + i * 60);
            }
            this.ctx.drawImage(this.textures.map['arrow'], 343, 333 + this.selectedItem * 60);

            this.ctx.drawImage(this.textures.get(playerSkins[this.selectedCharacter].url), 
                playerSkins[this.selectedCharacter].size[0], 
                playerSkins[this.selectedCharacter].size[1], 
                playerSkins[this.selectedCharacter].size[2], 
                playerSkins[this.selectedCharacter].size[3], 
                530 - playerSkins[this.selectedCharacter].size[2] / 2, 
                340 - playerSkins[this.selectedCharacter].size[3] / 2, 
                playerSkins[this.selectedCharacter].size[2], 
                playerSkins[this.selectedCharacter].size[3]
            );
            //this.ctx.textAlign = "center";
            //this.ctx.fillText(playerSkins[this.selectedCharacter].name, 530, 340 - playerSkins[this.selectedCharacter].size[3] / 2);
        }
    }

    handleInput() {
        // Handle arrow keys
        if(this.onKeyDown(40)){
            this.selectedItem = (this.selectedItem + 1) % this.menuItems.length;
            this.sounds.map['menu_change'].play();
        }
        if(this.onKeyDown(38)){
            this.selectedItem = (this.selectedItem + this.menuItems.length - 1) % this.menuItems.length;
            this.sounds.map['menu_change'].play();
        }
        if(this.selectedItem == 0){
            if(this.onKeyDown(39)){
                this.selectedCharacter = (this.selectedCharacter + 1) % playerSkins.length;
                this.options["singleplayer"]["character"] = playerSkins[this.selectedCharacter].url;
                this.sounds.map['menu_change'].play();
            }
            if(this.onKeyDown(37)){
                this.selectedCharacter = (this.selectedCharacter + playerSkins.length - 1) % playerSkins.length;
                this.options["singleplayer"]["character"] = playerSkins[this.selectedCharacter].url;
                this.sounds.map['menu_change'].play();
            }
        }
        // Handle enter key
        if(this.onKeyDown(13) || this.onKeyDown(32)){
            this.sounds.map['menu_choose'].play();
            if(this.selectedItem == 1){
                this.states.pop();
            }
        }
        this.prevPressedKeys = {...this.pressedKeys};
    }
}

/***************************************/
/*        GLOBAL OPTIONS STATE         */
/***************************************/

class GlobalOptionsState extends State {
    constructor(states, ctx, canvas, pressedKeys, options, music) {
        super(states, ctx, canvas, pressedKeys, options, music);

        this.menuItems = ["Music", "Sound", "Fullscreen", "Controls", "Back" ];
        this.selectedItem = 0;

        this.options["fullscreen"] = document.fullscreen;
    }

    async load() {
        // Load textures
        await this.textures.load('background', '/resources/images/backgrounds/menu_bg.png');
        await this.textures.load('arrow', '/resources/images/others/menu_arrow.png');
        await this.textures.load('sfxbar', '/resources/images/others/sfxbar.png');
        
        // Load sounds
        await this.sounds.load('menu_choose', '/resources/audio/menu_choose.ogg');
        await this.sounds.load('menu_change', '/resources/audio/menu_change.ogg');

        // Set loading to false
        this.loading = false;
    }

    update() {
        this.options["fullscreen"] = document.fullscreen;
        this.handleInput();

        for(let i in this.sounds.map){
            this.sounds.map[i].volume = this.options['sound'] / 10;
        }
        for(let i in this.music.map){
            this.music.map[i].volume = this.options['music'] / 10;
        }
    }

    render() {
        if(this.loading){
            //
        }
        else {
            this.ctx.drawImage(this.textures.get('background'), 0, 0);
            
            // Draw menu items
            this.ctx.font = "22px ComicFont";
            this.ctx.fillStyle = "black";
            this.ctx.textAlign = "left";
            this.ctx.textBaseline = "middle";
            this.ctx.lineWidth = 1.8;
            for(let i = 0; i < this.menuItems.length; i++) {
                this.ctx.fillText(this.menuItems[i], 390, 315 + i * 32);
            }
            this.ctx.drawImage(this.textures.map['arrow'], 343, 307 + this.selectedItem * 32);

            // Draw music bar
            for(let i = 0; i < 10; i++) {
                if(i < this.options["music"]){
                    this.ctx.drawImage(this.textures.get('sfxbar'), 10, 0, 10, 17, 460 + i * 10, 315 - 17/2, 10, 17);
                }
                else{
                    this.ctx.drawImage(this.textures.get('sfxbar'), 0, 0, 10, 17, 460 + i * 10, 315 - 17/2, 10, 17);
                }
            }

            // Draw sound bar
            for(let i = 0; i < 10; i++) {
                if(i < this.options["sound"]){
                    this.ctx.drawImage(this.textures.get('sfxbar'), 10, 0, 10, 17, 460 + i * 10, 347 - 17/2, 10, 17);
                }
                else{
                    this.ctx.drawImage(this.textures.get('sfxbar'), 0, 0, 10, 17, 460 + i * 10, 347 - 17/2, 10, 17);
                }
            }

            // Draw fullscreen checkbox
            if(this.options["fullscreen"]){
                this.ctx.fillText("On", 520, 379);
            }
            else{
                this.ctx.fillText("Off", 520, 379);
            }
        }
    }

    handleInput() {
        // Handle arrow keys
        if(this.onKeyDown(40)){
            this.selectedItem = (this.selectedItem + 1) % this.menuItems.length;
            
            this.sounds.map['menu_change'].play();
        }
        if(this.onKeyDown(38)){
            this.selectedItem = (this.selectedItem + this.menuItems.length - 1) % this.menuItems.length;

            this.sounds.map['menu_change'].play();
        }
        if(this.selectedItem == 0){
            if(this.onKeyDown(39)){
                this.options["music"] = Math.min(this.options["music"] + 1, 10);
                this.sounds.map['menu_change'].play();
            }
            if(this.onKeyDown(37)){
                this.options["music"] = Math.max(this.options["music"] - 1, 0);
                this.sounds.map['menu_change'].play();
            }
        }
        if(this.selectedItem == 1){
            if(this.onKeyDown(39)){
                this.options["sound"] = Math.min(this.options["sound"] + 1, 10);
                this.sounds.map['menu_change'].play();
            }
            if(this.onKeyDown(37)){
                this.options["sound"] = Math.max(this.options["sound"] - 1, 0);
                this.sounds.map['menu_change'].play();
            }
        }
        // Handle enter key
        if(this.onKeyDown(13) || this.onKeyDown(32)){
            this.sounds.map['menu_choose'].play();
            if(this.selectedItem == this.menuItems.length - 1){
                this.states.pop();
            }
            else if(this.selectedItem == 2){
                this.options["fullscreen"] = !this.options["fullscreen"];
                
                if(this.options["fullscreen"]){
                    document.getElementsByClassName("container")[0].requestFullscreen();
                }
                else{
                    document.exitFullscreen();
                }
            }
            else if(this.selectedItem == 3){
                let newcontrol = new ControlsState(this.states, this.ctx, this.canvas, this.pressedKeys, this.options, this.music);
                newcontrol.load();
                this.states.push(newcontrol);
            }
        }
        this.prevPressedKeys = {...this.pressedKeys};
    }
}

/***************************************/
/*           CONTROLS STATE            */
/***************************************/

class ControlsState extends State {
    constructor(states, ctx, canvas, pressedKeys, options, music) {
        super(states, ctx, canvas, pressedKeys, options, music);

        this.menuItems = ["Up", "Left", "Right", "Jump", "Back" ];
        this.selectedItem = 0;

        this.isChooseMode = null;
    }

    async load() {
        // Load textures
        await this.textures.load('background', '/resources/images/backgrounds/menu_bg.png');
        await this.textures.load('arrow', '/resources/images/others/menu_arrow.png');

        // Load sounds
        await this.sounds.load('menu_choose', '/resources/audio/menu_choose.ogg');
        await this.sounds.load('menu_change', '/resources/audio/menu_change.ogg');

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
        if(this.loading){
            //
        }
        else {
            this.ctx.drawImage(this.textures.get('background'), 0, 0);
            
            // Draw menu items
            this.ctx.font = "22px ComicFont";
            this.ctx.fillStyle = "black";
            this.ctx.textAlign = "left";
            this.ctx.textBaseline = "middle";
            this.ctx.lineWidth = 1.8;
            for(let i = 0; i < this.menuItems.length; i++) {
                this.ctx.fillText(this.menuItems[i], 390, 315 + i * 32);
                if(i < this.menuItems.length - 1){
                    this.ctx.fillText(this.options["controls"][this.menuItems[i].toLowerCase()].keyname, 460, 315 + i * 32);
                }
            }
            this.ctx.drawImage(this.textures.map['arrow'], 343, 307 + this.selectedItem * 32);

            // Draw choose mode
            if(this.isChooseMode){
                this.ctx.fillStyle = "rgba(0,0,0,0.5)";
                this.ctx.fillRect(0,0,640,480);
    
                this.ctx.font = "32px ComicFont";
                this.ctx.textAlign = "center";
                this.ctx.fillStyle = "white";
                this.ctx.strokeStyle = "black";
                this.ctx.lineWidth = 2;
    
                this.ctx.fillText("Choose a key for " + this.isChooseMode, 320, 240);
                this.ctx.strokeText("Choose a key for " + this.isChooseMode, 320, 240);
            }
        }
    }

    handleInput() {
        // Handle arrow keys
        if(this.isChooseMode == null){
            if(this.onKeyDown(40)){
                this.selectedItem = (this.selectedItem + 1) % this.menuItems.length;

                this.sounds.map['menu_change'].play();
            }
            if(this.onKeyDown(38)){
                this.selectedItem = (this.selectedItem + this.menuItems.length - 1) % this.menuItems.length;

                this.sounds.map['menu_change'].play();
            }
            // Enter
            if(this.onKeyDown(13) || this.onKeyDown(32)){
                this.sounds.map['menu_choose'].play();
                if(this.selectedItem == this.menuItems.length - 1){
                    this.states.pop();
                }
                else{
                    this.isChooseMode = this.menuItems[this.selectedItem].toLowerCase();
                }
            }
        }
        else{
            let kname = this.getKeyDown();
            this.sounds.map['menu_choose'].play();
            if(kname != null){
                this.options["controls"][this.isChooseMode].keyname = kname.keyname;
                this.options["controls"][this.isChooseMode].keycode = kname.keycode;
                this.isChooseMode = null;
            }
        }
        this.prevPressedKeys = {...this.pressedKeys};
    }
}

// Exports
export { SingleplayerOptionsState, GlobalOptionsState };