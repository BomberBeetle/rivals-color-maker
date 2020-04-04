document.getElementById("hue_slider").min = 0;
document.getElementById("hue_slider").max = 360;
document.getElementById("hue_slider").step = 1;
document.getElementById("hue_slider").value = 0;

document.getElementById("sat_slider").min = 0;
document.getElementById("sat_slider").max = 1;
document.getElementById("sat_slider").step = 0.01;
document.getElementById("sat_slider").value = 1;

document.getElementById("val_slider").min = 0;
document.getElementById("val_slider").max = 1;
document.getElementById("val_slider").step = 0.01;
document.getElementById("sat_slider").value = 1;

function SpritePiece(imgUrl, canvasId, name){
    this.imgUrl = imgUrl;
    this.canvasId = canvasId;
    this.name = name
    this.image = new Image();
    this.loadImg = function loadImg(){
        this.image.src = imgUrl;
    }
    this.h = 0;
    this.s = 1;
    this.v = 1;

    this.r = 255;
    this.g = 0;
    this.b = 0;
}

function  createCanvasFromSpritePiece(sprite){

    sprite.image.onload = () => {
        let canvas = document.createElement("canvas");
        canvas.classList.add("spriteCanvas");

        canvas.id = sprite.canvasId;
        canvas.width = sprite.image.width;
        canvas.height = sprite.image.height;

        let ctx = canvas.getContext("2d");
        ctx.drawImage(sprite.image, 0, 0);

        let button = document.createElement("button");

        button.onclick = (e) => {
            activeSprite = sprite;
            document.getElementById("hue_slider").value = sprite.h;
            document.getElementById("sat_slider").value = sprite.s;
            document.getElementById("val_slider").value = sprite.v;
        }

        button.textContent = sprite.name;

        document.getElementById("canvas_container").append(canvas);
        document.getElementById("layer_change_container").append(button);

        return button;
    }

    sprite.loadImg();
    
}

function colorChanged(){
    let ctx = document.getElementById(activeSprite.canvasId).getContext("2d");

    activeSprite.h = document.getElementById("hue_slider").value;
    activeSprite.s = document.getElementById("sat_slider").value;
    activeSprite.v = document.getElementById("val_slider").value;

    ctx.drawImage(activeSprite.image, 0,0);
    let imageData = ctx.getImageData(0,0,activeSprite.image.width,activeSprite.image.height);
    for(let i = 0; i < imageData.data.length ;i+=4){
        let newPixel = new RGBColour(imageData.data[i], imageData.data[i+1], imageData.data[i+2]).getHSV();
        newPixel.h += 360 - Number(document.getElementById("hue_slider").value);
        newPixel.h%=360
        newPixel.s *= document.getElementById("sat_slider").value;
        newPixel.v *= document.getElementById("val_slider").value;
        let rgb = new HSVColour(newPixel.h, newPixel.s, newPixel.v).getRGB();
        imageData.data[i] = Math.round(rgb.r);
        imageData.data[i+1] = Math.round(rgb.b);
        imageData.data[i+2] = Math.round(rgb.g);
    }
    ctx.putImageData(imageData, 0, 0)
}

function setPixelAt(x, y, canvas){
    
}

var sprite = [
 new SpritePiece("sprites/orcane/base.png", "base_canvas", "base"),
 new SpritePiece("sprites/orcane/body.png", "body_canvas", "body"),
 new SpritePiece("sprites/orcane/belly.png", "belly_canvas", "belly")
]

var activeSprite = sprite[1];
sprite.map((spritePiece) => {
    createCanvasFromSpritePiece(spritePiece);
})
