export class GradientArc {
    constructor(color, thickness, decreaseSize, startLength, startHeadAngle, rotationSpeed, rotationSign, arcGrowthSpeed, diameter) {
        this.color = color;
        this.thickness = thickness;
        this.decreaseSize = decreaseSize;
        this.startLength = startLength;
        this.startHeadAngle = startHeadAngle;
        this.rotationSpeed = rotationSpeed;
        this.rotationSign = rotationSign;
        this.arcGrowthSpeed = arcGrowthSpeed;

        this.diameter = diameter;
    }

    calculateCurrentHeadAngle(time) {
        return this.startHeadAngle + this.rotationSign * time * this.rotationSpeed;
    }

    calculateCurrentTailAngle(time) {
        return this.calculateCurrentHeadAngle(time) - this.calculateCurrentLength(time) * this.rotationSign;
    }

    calculateCurrentLength(time) {
        return this.startLength + time * this.arcGrowthSpeed;
    }

    draw(sk, time, resolutionFactor, centerX, centerY) {
        let headColor = this.color;
        let tailColor = withAlpha(sk, this.color, 0);

        drawGradientArc(
            sk,
            centerX,
            centerY,
            this.diameter,
            this.diameter,
            this.calculateCurrentHeadAngle(time),
            this.calculateCurrentTailAngle(time),
            headColor,
            tailColor,
            resolutionFactor,
            this.decreaseSize,
            this.thickness
            );
    }
}

export class SimpleArc {
    constructor(color, thickness, arcLength, headAngle, diameter) {
        this.color = color;
        this.thickness = thickness;
        this.arcLength = arcLength;
        this.headAngle = headAngle;

        this.diameter = diameter;
    }

    draw(sk, centerX, centerY) {
        sk.strokeWeight(this.thickness);
        sk.stroke(this.color);
        sk.arc(
            centerX,
            centerY,
            this.diameter,
            this.diameter,
            this.headAngle,
            this.headAngle + this.arcLength
        );
    }
}

export class CircularSector {

    constructor(color, arcLength, startHeadAngle, rotationSpeed, rotationSign, diameter) {
        this.color = color;
        this.arcLength = arcLength;
        this.startHeadAngle = startHeadAngle;
        this.rotationSpeed = rotationSpeed;
        this.rotationSign = rotationSign;

        this.diameter = diameter;
    }

    calculateCurrentHeadAngle(time) {
        return this.startHeadAngle + this.rotationSign * time * this.rotationSpeed;
    }

    draw(sk, time, centerX, centerY) {
        sk.noStroke();
        sk.fill(this.color);
        sk.arc(
            centerX,
            centerY,
            this.diameter,
            this.diameter,
            this.calculateCurrentHeadAngle(time),
            this.calculateCurrentHeadAngle(time) + this.arcLength
        );
    }
}


function drawGradientArc(
    sk,
    centerX,
    centerY,
    width,
    height,
    headAngle,
    tailAngle,
    headColor,
    tailColor,
    resFactor,
    decreaseSize,
    thickness) {
    /*
    * draw an arc gradient centered around (centerX, centerY) with given width and height
    **/

    let stepSign = (headAngle < tailAngle) ? 1 : -1;
    let stepSize = 2 * sk.PI / 360 / resFactor * stepSign;
    let nSteps = (tailAngle - headAngle) / stepSize;
    let currentAngle = headAngle;

    for (var step = 0; step < nSteps; step++) {

        let relativePosition = step / nSteps
        var currentColor = sk.lerpColor(headColor, tailColor, relativePosition)
        sk.stroke(currentColor);

        // shrink size depending on relative position
        if (decreaseSize) {
            var weight = (1 - relativePosition) * thickness;
        } else {
            var weight = thickness
        }
        sk.strokeWeight(weight);

        // the head should be round
        if (currentAngle == headAngle) {
            sk.strokeCap(sk.ROUND)
        } else {
            sk.strokeCap(sk.SQUARE)
        }

        sk.arc(centerX, centerY, width, height, Math.min(currentAngle, currentAngle + stepSize), Math.max(currentAngle, currentAngle + stepSize))

        currentAngle += stepSize;
    }
}

// change the alpha level of a color
function withAlpha(sk, c, alpha) {
    return sk.color(sk.hue(c), sk.brightness(c), sk.saturation(c), alpha)
}