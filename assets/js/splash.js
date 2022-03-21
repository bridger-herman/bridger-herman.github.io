export function SplashCanvas(p) {
    const G = 0.1;
    const timeScale = 0.2;
    const maxAccel = 0.001;
    let canvasCenter;

    let positions = [];
    let velocities = [];
    let masses = [];

    // draw an arrow for a vector at a given base position
    function drawArrow(base, vec, myColor) {
        p.push();
        p.stroke(myColor);
        p.strokeWeight(3);
        p.fill(myColor);
        p.translate(base.x, base.y);
        p.line(0, 0, vec.x, vec.y);
        p.rotate(vec.heading());
        let arrowSize = 7;
        p.translate(vec.mag() - arrowSize, 0);
        p.triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
        p.pop();
    }

    p.setup = () => {
        p.createCanvas(p.windowWidth * 0.5, 250);

        canvasCenter = p.createVector(p.width / 2, p.height / 2);

        positions.push(p.createVector(p.width / 3, p.height * 2 / 3));
        positions.push(p.createVector(p.width / 2, p.height / 3));
        positions.push(p.createVector(p.width * 2 / 3, p.height * 2 / 3));

        velocities.push(p.createVector(0.01, 0));
        velocities.push(p.createVector(-0.01, 0));
        velocities.push(p.createVector(0.01, 0));

        masses.push(10.0);
        masses.push(10.0);
        masses.push(10.0);

        if (masses.length != positions.length) {
            console.error('mass length != position length');
        }

    };

    p.draw = () => {
        // Update acceleration
        let accelerations = [];
        for (let i in positions) {
            let forceOnBodyI = p.createVector(0, 0);
            // accelerations.push(p.createVector(0, 0));
            for (let j in positions) {
                if (i != j) {
                    // Calculate the vector between the two bodies
                    let between = p5.Vector.sub(positions[j], positions[i]);
                    let forceDir = between.normalize();
                    let betweenMag = between.mag();

                    // Calculate the gravitational effect of body `j` on body `i`
                    // (G * m1 * m2 / ((p2 - p1) ^ 3))
                    let g = (G * masses[i] * masses[j]) / (betweenMag * betweenMag * betweenMag);
                    let forceGravityFromJ = p5.Vector.mult(forceDir, g);
                    forceOnBodyI.add(forceGravityFromJ);
                }
            }
            // Add a force to seek to center when we get too far away
            let toCenter = p5.Vector.sub(canvasCenter, positions[i]);
            let dist = toCenter.mag();
            let forceCenter = p5.Vector.mult(toCenter, dist*dist*dist*dist);
            forceOnBodyI.add(forceCenter);

            // Turn sum of forces into acceleration
            let accel = p5.Vector.div(forceOnBodyI, masses[i]);
            accel.limit(maxAccel);
            accelerations.push(accel);
        }

        // Update velocity
        for (let i in velocities) {
            velocities[i].add(p5.Vector.mult(accelerations[i], p.deltaTime * timeScale));
        }

        // Update position
        for (let i in positions) {
            positions[i].add(p5.Vector.mult(velocities[i], p.deltaTime * timeScale));
        }

        // Draw
        p.clear();
        p.fill(255);
        for (let i in positions) {
            p.textAlign(p.CENTER);
            p.text(`${velocities[i].x.toFixed(4)}, ${velocities[i].y.toFixed(4)}`, positions[i].x, positions[i].y - 10);
            p.circle(positions[i].x, positions[i].y, masses[i]);
        }
    };
}