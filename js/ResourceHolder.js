/*****************************************/
/*         RESOURCE HOLDER CLASS         */
/*****************************************/

// Abstract class ResourceHolder
class ResourceHolder {
    constructor() {
        this.map = {};
    }

    get(name) {
        return this.map[name];
    }
}

/*****************************************/
/*         TEXTURE HOLDER CLASS          */
/*****************************************/

// Method for loading image from file url
const loadImage = (url) => new Promise((res,err) => {
    let image = new Image();
    image.src = url;
    image.onload = () => {
        res(image);
    }
});

// Class TextrueHolder
class TextureHolder extends ResourceHolder {
    constructor() {
        super();
    }

    async load(name, url) {
        let image = await loadImage(url);
        this.map[name] = image;
    }
}

/***********************************/
/*        ANIMATION HOLDER         */
/***********************************/

// Method for loading animation from file url
const loadAnimations = async (url) => {
    let obj = null;
    await fetch(url).then(response => response.json()).then(json => { obj = json; });
    //console.log(obj);
    return obj;
};

// Animation holder class
class AnimationHolder extends ResourceHolder {
    // Constructor
    constructor() {
        super();
    }

    // Load Method
    async load(animationName, url) {
        this.map[animationName] = await loadAnimations(url);
    }
}

/***********************************/
/*          AUDIO HOLDER           */
/***********************************/

const loadAudio = (url) => new Promise((res,err) => {
    let audio = new Audio(url);
    audio.addEventListener("canplaythrough", function() {
        res(audio);
    })
});

// Audio holder class
class AudioHolder extends ResourceHolder {
    // Constructor
    constructor() {
        super();
    }

    // Load Method
    async load(name, url) {
        let audio = await loadAudio(url);
        this.map[name] = audio;
    }
}

// Exports
export { TextureHolder, AnimationHolder, AudioHolder };