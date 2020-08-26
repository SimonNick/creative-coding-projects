import p5 from "p5";

function uniform(min, max) {
    return Math.random() * (max - min) + min;
}


new p5(sk => {

    let frameRate = 30;

    let shader;
    let image;
    let mask;
    let texture;
    let textureGraphics;
    let cnv;

    let canvasWidth;
    let canvasHeight = 800;
    let scalingFactor = 1;
    let backgroundColor = '#111';
    let distortionAmount = 0.02;
    let save = false;
    let interactiveMode = false;
    let animated = true;

    function displayFrameRate(updatesPerSecond = 2) {
        if (sk.frameCount % Math.round(frameRate / updatesPerSecond) == 0) {
            window.document.getElementById('framerate').textContent = Math.round(sk.frameRate());
        }
    }

    sk.preload = function preload() {
        image = sk.loadImage('image.jpg')
        mask = sk.loadImage('mask.png')
        shader = sk.loadShader('effect.vert', 'effect.frag');
    }

    sk.setup = function setup() {

        // use same aspect ratio as the image for the canvas
        canvasHeight *= scalingFactor;
        canvasWidth = Math.round(canvasHeight / image.height * image.width)

        window.document.getElementsByTagName('body')[0].style.backgroundColor = backgroundColor;

        cnv = sk.createCanvas(canvasWidth, canvasHeight, sk.WEBGL);
        cnv.position((sk.windowWidth - canvasWidth) / 2, (sk.windowHeight - canvasHeight) / 2)
    
        // position (0,0) is always in the center of its respective parent
        texture = sk.createGraphics(sk.width, sk.height, sk.WEBGL)
        textureGraphics = sk.createGraphics(sk.width, sk.height, sk.WEBGL)

        if (!(interactiveMode || animated)) {
            sk.noLoop();
        }
        sk.colorMode(sk.HSB, 1)
        sk.pixelDensity(2);
        sk.frameRate(frameRate);

    }

    sk.draw = function draw() {
        displayFrameRate();
        sk.clear()
        cnv.clear()

        sk.background(backgroundColor);

        texture.clear()
        textureGraphics.clear()

        let nLines = 50;
        let lineThickness = 11;

        if (interactiveMode) {
            var hue1 = sk.map(sk.mouseX, (canvasWidth - sk.windowWidth) / 2, (canvasWidth + sk.windowWidth) / 2, 0, 1)
            var sat = sk.map(sk.mouseY, (canvasHeight - sk.windowHeight) / 2, (canvasHeight + sk.windowHeight) / 2, 0, 1)
            var hue2 = hue1 + 0.2; // = 34 / 360
        } else {
            var hue1 = 354 / 360
            var hue2 = 34 / 360 + 1;
            var sat = 0.95;
        }

        // draw the texture
        for (let i = 0; i < nLines; i++) {

            let ellipseX = 30;
            let ellipseHeight = 600;

            ellipseX *= scalingFactor
            ellipseHeight *= scalingFactor

            let position = 1 - i / nLines;
            let c = sk.color((hue1 + position * (hue2 - hue1)) % 1, sat, 0.9)
            let lineThicknessScaled = lineThickness * position;
            let y = -sk.height / 2 + i * sk.height / nLines + sk.frameCount / frameRate * 8 % (sk.height / nLines);
            let circleY = y - ellipseHeight / 2;

            texture.stroke(c);
            texture.noFill();
            texture.strokeWeight(lineThicknessScaled * scalingFactor)
            texture.arc(ellipseX, circleY, sk.width, ellipseHeight, 0, sk.PI);

        }

        textureGraphics.shader(shader);
        shader.setUniform('img', image);
        shader.setUniform('tex', texture.get());
        shader.setUniform('amty', distortionAmount);
        textureGraphics.rect(-sk.width/2, -sk.height/2, sk.width, sk.height);

        let textureCanvasImg = textureGraphics.get()
        textureCanvasImg.mask(mask.get())
        sk.image(textureCanvasImg, -sk.width/2, -sk.height/2)
        if (save) {
            sk.saveCanvas('canvas.jpg');
        }
    }

    sk.windowResized = function windowResized(){
        sk.resizeCanvas(canvasWidth, canvasHeight);
        cnv.position((sk.windowWidth - canvasWidth) / 2, (sk.windowHeight - canvasHeight) / 2)
    }


});