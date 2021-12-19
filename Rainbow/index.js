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

    let width = 2 * (config.arcs.thickness + config.arcs.distance) * config.arcs.num;
    let height = width;

    sk.colorMode(sk.HSB, 1);
    sk.setup = function setup() {
        sk.createCanvas(width, height);
    }

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
                uniform(config.arcs.backgroundArcs.minLength, config.arcs.backgroundArcs.maxLength) * 2 * sk.PI,
                config.arcs.backgroundArcs.randomStartAngle ? uniform(0, 1) * 2 * sk.PI : 0,
                uniform(config.arcs.backgroundArcs.minSpeed, config.arcs.backgroundArcs.maxSpeed),
                config.arcs.backgroundArcs.randomDirection ? randomSign() : 1,
                uniform(config.arcs.minGrowth, config.arcs.maxGrowth),
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
            uniform(config.arcs.minLength, config.arcs.maxLength) * 2 * sk.PI,
            config.arcs.randomStartAngle ? uniform(0, 1) * 2 * sk.PI : 0,
            uniform(config.arcs.minSpeed, config.arcs.maxSpeed),
            config.arcs.randomDirection ? randomSign() : 1,
            uniform(config.arcs.minGrowth, config.arcs.maxGrowth),
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
                uniform(config.whiteArcs.minLength, config.whiteArcs.maxLength) * 2 * sk.PI,
                uniform(0, 1) * 2 * sk.PI,
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
                uniform(config.triangles.minLength, config.triangles.minLength) * 2 * sk.PI,
                uniform(0, 1) * 2 * sk.PI,
                uniform(config.triangles.minSpeed, config.triangles.maxSpeed),
                randomSign(),
                (Math.floor(uniform(1, config.arcs.num)) + 0.5) * 2 * (config.arcs.thickness + config.arcs.distance),
            ))
        }
    }


    // draw the components
    let time = 0;
    sk.draw = function draw() {

        // position of the center
        let centerX = width / 2;
        let centerY = height / 2;

        sk.clear()
        sk.noFill();

        arcs.forEach(arc => arc.draw(sk, time, config.resolutionFactor, centerX, centerY));
        whiteArcs.forEach(arc => arc.draw(sk, centerX, centerY));
        triangles.forEach(triangle => triangle.draw(sk, time, centerX, centerY));

        time += 0.01 * config.speedFactor;

    }
});