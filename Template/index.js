import p5 from "p5";

new p5(sk => {

    let frameRate = 30;

    let canvasWidth = 800;
    let canvasHeight = 800;
    
    let backgroundColor = '#111';

    function displayFrameRate(updatesPerSecond = 2) {
        if (sk.frameCount % Math.round(frameRate / updatesPerSecond) == 0) {
            window.document.getElementById('framerate').textContent = Math.round(sk.frameRate());
        }
    }

    sk.setup = function setup() {

        cnv = sk.createCanvas(canvasWidth, canvasHeight, sk.WEBGL);
        cnv.position((sk.windowWidth - canvasWidth) / 2, (sk.windowHeight - canvasHeight) / 2)

        sk.colorMode(sk.HSB, 1)
        sk.pixelDensity(2);
        sk.frameRate(frameRate);

        window.document.getElementsByTagName('body')[0].style.backgroundColor = backgroundColor;
    }

    sk.draw = function draw() {
        displayFrameRate()
        sk.clear()
        sk.circle(sk.windowWidth / 2, sk.windowHeight / 2, 20)
    }

    sk.windowResized = function windowResized(){
        sk.resizeCanvas(canvasWidth, canvasHeight);
        cnv.position((sk.windowWidth - canvasWidth) / 2, (sk.windowHeight - canvasHeight) / 2)
    }

});