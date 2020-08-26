import p5 from "p5";

new p5(sk => {

    var n_arcs = 20;
    var n_triangles = 5;
    var n_white_arcs = 4;
    var mono_color = false;
    var speed_factor = 0.5;
    let rotation = 0;
    let ghost = false;
    let ghost_thickness = 12;
    let blend = Math.floor(speed_factor);
    let solar_system = false;
    let display_white_triangles = true;
    let modulate_epllipse = false;
    let height_factor = 0.45;
    let width_factor = 1.25;

    sk.colorMode(sk.HSB, 1);

    function uniform(min, max) {
        return Math.random() * (max - min) + min;
    }

    function with_alpha(c, alpha) {
        return sk.color(sk.hue(c), sk.brightness(c), sk.saturation(c), alpha)
        // return sk.color(sk.hue(c), sk.saturation(c), sk.brightness(c), alpha)
    }

    function interpolate_color(c1, c2, amt, rev) {
        let a = rev ? amt-1 : 1-amt
        a = Math.exp(2*a) - 1
        return sk.color(sk.hue(c1), sk.saturation(c1), sk.brightness(c1), a)
    }

    let res = 7;

    function arc_gradient(x, y, w, h, start, stop, c1, c2, rev = false) {
        for (var i = 0; i <= res * (stop - start);) {
            if (ghost) {
                if (rev) {
                    sk.strokeWeight(i / (res * (stop - start)) * ghost_thickness);
                } else {
                    sk.strokeWeight(ghost_thickness - i / (res * (stop - start)) * ghost_thickness);
                }
            }
            let angle = start + i / res
            if (blend) {
                // var c = interpolate_color(c1, c2, i / (res * (stop - start)), rev)
                var c = sk.lerpColor(c1, c2, i / (res * (stop - start)))
            } else {
                var c = c1
            }
            sk.stroke(c);
            // sk.point(x + w / 2 * Math.cos(angle), y + h / 2 * Math.sin(angle))
            if (solar_system) {
                sk.arc(x, y, width_factor * w, height_factor * h, angle, angle + 1 / res)
            } else {
                if (blend) {
                if (i == 0) {
                    sk.strokeCap(sk.ROUND)
                } else {
                    sk.strokeCap(sk.SQUARE)
                }

                }
                sk.arc(x, y, w, h, angle, angle + 0.15 / res)
            }
            i = i + 1 / res
        }
    }

    sk.setup = function setup() {
        sk.createCanvas(sk.windowWidth, sk.windowHeight);
    }

    let hue_inc = mono_color ? 0 : uniform(1 / n_arcs / 10, 1 / n_arcs / 2);
    let hues = [...Array(n_arcs)];
    for (var i = 0; i < n_arcs; i++) {
        hues[i] = i == 0 ? uniform(0, 1) : hues[i - 1] + hue_inc;
    }

    // randomly define look of the arcs
    let arcs = [...Array(n_arcs)].map((a, i) => {
        return {
            colour: sk.color(hues[i] % 1, uniform(0.6, 0.9), uniform(0.9, 0.95), 1),
            length: uniform(0.5 * sk.PI, 0.8 * sk.PI),
            angle: uniform(0, 2 * sk.PI),
            speed: uniform(0.5, 1.5),
            direction: Math.round(Math.random()) * 2 - 1,
            growth: uniform(-0.01, 0.01)
        }
    });

    var arcs_background = [...Array(n_arcs)].map((a, i) => {
        return {
            colour: sk.color(hues[i] % 1, uniform(0.5, 0.5), uniform(0.3, 0.4)),
            length: uniform(0.5 * sk.PI, 1.2 * sk.PI),
            angle: uniform(0, 2 * sk.PI),
            speed: uniform(0.2, 0.5),
            direction: Math.round(Math.random()) * 2 - 1
        }
    });

    let white_arcs = [...Array(n_white_arcs)].map((a, i) => {
        return {
            colour: sk.color(0, 0, uniform(0.5, 0.9)),
            height: Math.floor(uniform(1, n_arcs)),
            length: uniform(1 * sk.PI, 1.5 * sk.PI),
            angle: uniform(0, 2 * sk.PI),
            speed: 0,
            direction: Math.round(Math.random()) * 2 - 1
        }
    });

    // randomly define look of the arcs
    let white_triangles = [...Array(n_triangles)].map((a, i) => {
        return {
            colour: sk.color(0, 0, 1, uniform(0.1, 0.2)),
            height: Math.floor(uniform(1, n_arcs)),
            length: uniform(sk.PI / 2, sk.PI),
            angle: uniform(0, 2 * sk.PI),
            speed: 2 * uniform(0.05, 0.125),
            direction: Math.round(Math.random()) * 2 - 1
        }
    });

    sk.draw = function draw() {
        sk.clear()

        sk.noFill();
        sk.strokeWeight(10);

        arcs_background.forEach((a, i) => {
            // sk.stroke(a.colour);
            // sk.strokeCap(sk.ROUND)
            // sk.arc(sk.windowWidth / 2, sk.windowHeight / 2, 25 * i, 25 * i, a.angle + rotation * a.speed * a.direction, a.angle + rotation * a.speed * a.direction + a.length);
            arc_gradient(sk.windowWidth / 2, sk.windowHeight / 2, 25 * i, 25 * i, a.angle + rotation * a.speed * a.direction, a.angle + rotation * a.speed * a.direction + a.length, a.colour, with_alpha(a.colour,0));
            // arc_gradient(sk.windowWidth / 2, sk.windowHeight / 2, 25 * i, 25 * i, a.angle + rotation * a.speed * a.direction, a.angle + rotation * a.speed * a.direction + a.length, a.colour, a.colour, a.direction > 0);
        });

        arcs.forEach((a, i) => {
            a.length += a.growth * speed_factor;
            if (a.length > sk.PI) {
                a.length = 0
            } else if (a.length < 0) {
                a.length = sk.PI
            }
            arc_gradient(sk.windowWidth / 2, sk.windowHeight / 2, 25 * i, 25 * i, a.angle + rotation * a.speed * a.direction, a.angle + rotation * a.speed * a.direction + a.length, a.colour, with_alpha(a.colour, 0), a.direction > 0);
        });

        sk.strokeWeight(2.5);
        white_arcs.forEach((a, i) => {
            sk.stroke(a.colour);
            sk.arc(sk.windowWidth / 2, sk.windowHeight / 2, 25 * (a.height + 0.5), 25 * (a.height + 0.5), a.angle + rotation * a.speed * a.direction, a.angle + rotation * a.speed * a.direction + a.length);
        });

        if (display_white_triangles) {
            sk.noStroke();
            white_triangles.forEach((b, i) => {
                sk.fill(b.colour);
                sk.arc(sk.windowWidth / 2, sk.windowHeight / 2, 25 * (b.height + 0.5), 25 * (b.height + 0.5), b.angle + rotation * b.speed * b.direction, b.angle + rotation * b.speed * b.direction + b.length);
            });
        }


        // increase rotation
        rotation += 0.01 * speed_factor

        if (modulate_epllipse) {
            width_factor += uniform(0,0.001)
            height_factor += uniform(0,0.001)
        }

    }

});