class Camera {
    constructor(program, position = [15, 0, eyeHeight], lookAt = [-10000, 0, eyeHeight], up = [0, 0, 1]) {
        this.program = program;
        this.forward = vec3.create();
        this.up = vec3.create();
        this.right = vec3.create();

        this.position = vec3.fromValues(...position);

        this.mView = mat4.create();

        // get what I'm looking at from my perspective
        this.lookAt = vec3.fromValues(...lookAt);
        //vec3.normalize(this.lookAt, this.lookAt);
        vec3.subtract(this.forward, this.lookAt, this.position);
        vec3.add(this.up, this.up, up);

        this.renorm();

        this.rotSpeed = 0.001;
        this.moveSpeed = 0.01;
        this.slowSpeed = 0.01;
        this.fastSpeed = 0.02;
    }

    setFast() {
        this.moveSpeed = this.fastSpeed;
    }

    setSlow() {
        this.moveSpeed = this.slowSpeed;
    }

    renorm() {
        vec3.cross(this.right, this.forward, this.up);
        vec3.cross(this.up, this.right, this.forward);

        vec3.normalize(this.forward, this.forward);
        vec3.normalize(this.right, this.right);
        vec3.normalize(this.up, this.up);
    }

    getMat4() {
        let lookAt = vec3.create();
        vec3.add(lookAt, this.position, this.forward);
        mat4.lookAt(this.mView, this.position, lookAt, this.up);
        return this.mView;
    }

    jump() {
        vec3.scaleAndAdd(this.position, this.position, this.up, this.moveSpeed);
    }

    gravitateTo(z) {
        if (this.position[2] <= eyeHeight) return;
        vec3.scaleAndAdd(this.position, this.position, this.up, -this.moveSpeed * 5);
    }

    moveForward() {
        vec3.scaleAndAdd(this.position, this.position, this.forward, this.moveSpeed);
        this.apply();
    }

    moveBack() {
        vec3.scaleAndAdd(this.position, this.position, this.forward, -this.moveSpeed);
        this.apply();
    }

    strafeLeft() {
        vec3.scaleAndAdd(this.position, this.position, this.right, -this.moveSpeed);
        this.apply();
    }

    strafeRight() {
        vec3.scaleAndAdd(this.position, this.position, this.right, this.moveSpeed);
        this.apply();
    }

    yawLeft() {
        let mRight = mat4.create();
        mat4.rotate(mRight, mRight, this.rotSpeed, this.up);
        vec3.transformMat4(this.forward, this.forward, mRight);
        this.renorm();
        this.apply();
    }

    yawRight() {
        let mRight = mat4.create();
        mat4.rotate(mRight, mRight, -this.rotSpeed, this.up);
        vec3.transformMat4(this.forward, this.forward, mRight);
        this.renorm();
        this.apply();
    }

    pitchUp() {
        //let mUp = mat4.create();
        //mat4.rotate(mUp, mUp, -this.rotSpeed, vec3.fromValues(1, 0, 0));
        //vec3.transformMat4(this.forward, this.forward, mUp);
        this.renorm();
        this.apply();
    }

    pitchDown() {
        //let mUp = mat4.create();
        //mat4.rotate(mUp, mUp, this.rotSpeed, vec3.fromValues(1, 0, 0));
        //vec3.transformMat4(this.forward, this.forward, mUp);
        this.renorm();
        this.apply();
    }

    yawAndPitch(x, y) {
        let mRot = mat4.create();
        mat4.rotate(mRot, mRot, -this.rotSpeed * x, this.up);
        let mRot2 = mat4.create();
        mat4.rotate(mRot2, mRot2, -this.rotSpeed * y, this.right);
        vec3.transformMat4(this.forward, this.forward, mRot);
        //vec3.transformMat4(this.forward, this.forward, mRot2);

        debug.innerHTML = 'F '+this.forward.map((v) => Math.floor(v*360/T)).join(',') +
            '<br/>U '+this.up.map((v) => Math.floor(v*360/T)).join(',') +
            '<br/>R '+this.right.map((v) => Math.floor(v*360/T)).join(',');
        this.renorm();
        this.apply();
    }

    apply() {
        refresh(
            this.program,
            world.getMat4(),
            camera.getMat4(),
            proj.getMat4()
        );
    }
}
