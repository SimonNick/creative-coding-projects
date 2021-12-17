import p5 from "p5";
import config from './config.yaml';
import { GradientArc, SimpleArc, CircularSector } from "./arcs.js"; 

// uniformly generates a random number between in [min, max]
function uniform(min, max) {
    return Math.random() * (max - min) + min;
}

// uniformly generates a random sign (-1 or 1)
function randomSign() {
    return Math.round(Math.random()) * 2 - 1;
}

new p5(sk => {

    sk.colorMode(sk.HSB, 1);
    sk.setup = function setup() {
        sk.createCanvas(sk.windowWidth, sk.windowHeight);
    }

    // position of the center
    let centerX = sk.windowWidth / 2;
    let centerY = sk.windowHeight / 2;

    // create the arcs in the background
    let hueInc = config.arcs.monoColor ? 0 : uniform(1 / config.arcs.num / 10, 1 / config.arcs.num / 2);
    let hues = [];
    for (var i = 0; i < config.arcs.num; i++) {
        hues.push(i == 0 ? uniform(0, 1) : hues[i - 1] + hueInc);
    }

    let arcs = []
    if (config.arcs.backgroundArcs.active) {
        for (var i = 0; i < config.arcs.num; i++) {
            arcs.push(new GradientArc(
                sk.color(hues[i] % 1, uniform(config.arcs.backgroundArcs.minSaturation, config.arcs.backgroundArcs.maxSaturation), uniform(config.arcs.backgroundArcs.minBrightness, config.arcs.backgroundArcs.maxBrightness)),
                config.arcs.thickness,
                config.arcs.ghost.active,
                uniform(config.arcs.backgroundArcs.minLength * 2 * sk.PI, config.arcs.backgroundArcs.maxLength * 2 * sk.PI),
                uniform(0, 2 * sk.PI),
                uniform(config.arcs.backgroundArcs.minSpeed, config.arcs.backgroundArcs.maxSpeed),
                randomSign(),
                uniform(config.arcs.minGrowth, config.arcs.maxGrowth),
                centerX,
                centerY,
                2 * (config.arcs.thickness + config.arcs.distance) * i,
            ))
        }
    }

    // create the arcs in the foreground
    for (var i = 0; i < config.arcs.num; i++) {
        arcs.push(new GradientArc(
            sk.color(hues[i] % 1, uniform(config.arcs.minSaturation, config.arcs.maxSaturation), uniform(config.arcs.minBrightness, config.arcs.maxBrightness), 1),
            config.arcs.thickness,
            config.arcs.ghost.active,
            uniform(config.arcs.minLength * 2 * sk.PI, config.arcs.maxLength * 2 * sk.PI),
            uniform(0, 2 * sk.PI),
            uniform(config.arcs.minSpeed, config.arcs.maxSpeed),
            randomSign(),
            uniform(config.arcs.minGrowth, config.arcs.maxGrowth),
            centerX,
            centerY,
            2 * (config.arcs.thickness + config.arcs.distance) * i,
        ))
    }

    // create the white arcs
    let whiteArcs = []
    if (config.whiteArcs.active) {
        for (var i = 0; i < config.whiteArcs.num; i++) {
            whiteArcs.push(new SimpleArc(
                sk.color(0, 0, uniform(config.whiteArcs.minBrightness, config.whiteArcs.maxBrightness)),
                config.whiteArcs.thickness,
                uniform(config.whiteArcs.minLength * 2 * sk.PI, config.whiteArcs.maxLength * 2 * sk.PI),
                uniform(0, 2 * sk.PI),
                centerX,
                centerY,
                (Math.floor(uniform(1, config.arcs.num)) + 0.5) * 2 * (config.arcs.thickness + config.arcs.distance),
            ))
        }
    }

    // create the triangles
    let triangles = []
    if (config.triangles.active) {
        for (var i = 0; i < config.triangles.num; i++) {
            triangles.push(new CircularSector(
                sk.color(0, 0, 1, uniform(config.triangles.minBrightness, config.triangles.maxBrightness)),
                uniform(config.triangles.minLength * 2 * sk.PI, config.triangles.minLength * 2 * sk.PI),
                uniform(0, 2 * sk.PI),
                uniform(config.triangles.minSpeed, config.triangles.maxSpeed),
                randomSign(),
                centerX,
                centerY,
                (Math.floor(uniform(1, config.arcs.num)) + 0.5) * 2 * (config.arcs.thickness + config.arcs.distance),
            ))
        }
    }


    // draw the components
    let time = 0;
    sk.draw = function draw() {

        sk.clear()
        sk.noFill();

        arcs.forEach(arc => arc.draw(sk, time, config.resolutionFactor));
        whiteArcs.forEach(arc => arc.draw(sk));
        triangles.forEach(triangle => triangle.draw(sk, time));

        time += 0.01 * config.speedFactor;

    }
});