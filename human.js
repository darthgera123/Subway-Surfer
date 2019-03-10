let human = class {
    constructor(gl, pos) {
        this.scale = 1;
        this.position = pos;
        this.gl = gl;
        this.score = 0;
        this.base = pos[1];
        this.angle = 0;
        this.change = [0, 0, 0];
        this.duck = -0.2;
        this.head = new base(gl, [this.position[0], this.position[1] + 0.35, this.position[2]], 0.05 * this.scale, 0.05 * this.scale, 0.05 * this.scale, this.angle);
        this.body = new base(gl, [this.position[0], this.position[1] + 0.2, this.position[2]], 0.1 * this.scale, 0.1 * this.scale, 0.1 * this.scale, this.angle);
        this.left_leg = new base(gl, [this.position[0], this.position[1], this.position[2] - 0.05], 0.05 * this.scale, 0.105 * this.scale, 0.025 * this.scale, this.angle);
        this.right_leg = new base(gl, [this.position[0], this.position[1], this.position[2] + 0.05], 0.05 * this.scale, 0.105 * this.scale, 0.025 * this.scale, this.angle);
        console.log(this.head.angle);
    }
    moveLeft() {
        console.log(this.position[2]);
        if (this.position[2] != -1.1) {
            this.position[2] -= 1.1;
            this.setPosition();

        }
    }
    moveRight() {
        console.log(this.position[2]);
        if (this.position[2] != 1.1) {
            console.log('move bc');
            this.position[2] += 1.1;
            this.setPosition();
        }
    }
    moveUp() {
        if (this.position[1] == this.base) {
            this.position[1] += 0.65;
        }
        this.setPosition();
    }
    moveDown() {
        if (this.position[1] > this.base) {
            console.log(this.position[1]);
            this.position[1] -= 0.025;
            if (this.position[1] < this.base) {
                this.position[1] = this.base;
            }
        }
        this.setPosition();
    }
    fly() {
        if (this.position[1] == this.base) {
            this.position[1] += 2;
        }
        this.angle = 90;
        this.change[1] = 0.2;
        this.change[0] = -0.2;
        this.setPosition();
    }
    reset() {
        this.change = [0, 0, 0];
        this.angle = 0;
        if (this.position[1] < this.base) {
            this.position[1] = this.base;
        }

        this.setPosition();
    }
    moveAhead(x) {
        this.position[0] += x;
        this.setPosition();
    }
    duckP() {
        if (this.position[1] == this.base) {
            this.change[1] = 0.2;
            this.change[0] = -0.2;
            this.position[1] -= 0.2;
        }

        this.setPosition();

    }
    newPosition(x, y, z) {
        this.position = [x, y, z];
        this.setPosition();
    }
    grayScale() {
        this.head.uGray = (this.head.uGray == 0) ? 1 : 0;
        this.body.uGray = (this.body.uGray == 0) ? 1 : 0;
        this.left_leg.uGray = (this.left_leg.uGray == 0) ? 1 : 0;
        this.right_leg.uGray = (this.right_leg.uGray == 0) ? 1 : 0;
    }
    setPosition() {
        this.head = new base(this.gl, [this.position[0] - this.change[0], this.position[1] + 0.35 - this.change[1] / 2, this.position[2]],
            0.05 * this.scale, 0.05 * this.scale, 0.05 * this.scale, 0);
        this.body = new base(this.gl, [this.position[0], this.position[1] + 0.2, this.position[2]]
            , 0.1 * this.scale, 0.1 * this.scale, 0.1 * this.scale, 0);
        this.left_leg = new base(this.gl, [this.position[0] + this.change[0], this.position[1] + this.change[1],
        this.position[2] - 0.05], 0.05 * this.scale, 0.105 * this.scale, 0.025 * this.scale, this.angle);
        this.right_leg = new base(this.gl, [this.position[0] + this.change[0], this.position[1] + this.change[1],
        this.position[2] + 0.05], 0.05 * this.scale, 0.105 * this.scale, 0.025 * this.scale, this.angle);
    }
}
