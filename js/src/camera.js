import {vec3, mat4} from 'gl-matrix';
import refresh from './refresh';

const eyeHeight = 2,
    x = 0,
    y = 1,
    z = 2;

export default class Camera {
    constructor(program, gldata, world, proj, position = [15, 0, eyeHeight], lookAt = [-10000, 0, eyeHeight], up = [0, 0, 1]) {
        this.program = program;
        this.gldata = gldata;
        this.world = world;
        this.proj = proj;
        this.forward = vec3.create();
        this.up = vec3.create();
        this.right = vec3.create();
        this.thirdPerson = false;

        this.position = vec3.fromValues(...position);

        this.mView = mat4.create();

        // get what I'm looking at from my perspective
        this.lookAt = vec3.fromValues(...lookAt);
        //vec3.normalize(this.lookAt, this.lookAt);
        vec3.subtract(this.forward, this.lookAt, this.position);
        vec3.add(this.up, this.up, up);

        this.renorm();

        this.rotSpeed = 0.001;
        this.moveSpeed = 0.05;
        this.slowSpeed = 0.05;
        this.fastSpeed = 0.1;

        this.accelDown = 1;
        this.velUp = 0;
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
        if (this.thirdPerson) {
            let backwards = vec3.create();
            vec3.scaleAndAdd(backwards, backwards, this.forward, 5);
            vec3.scaleAndAdd(backwards, backwards, this.up, -2);
            mat4.translate(this.mView, this.mView, backwards);
        }
        return this.mView;
    }

    jump() {
        this.velUp = 1;
        vec3.scaleAndAdd(this.position, this.position, this.up, this.moveSpeed * this.velUp);
    }

    gravitateTo(height) {
        if (this.position[z] <= height + eyeHeight) return;
        this.velUp -= this.accelDown;
        vec3.scaleAndAdd(this.position, this.position, this.up, this.moveSpeed * this.velUp);
    }

    moveForward(by = 1) {
        vec3.scaleAndAdd(this.position, this.position, this.forward, this.moveSpeed * by);
        this.apply();
    }

    moveBack(by = 1) {
        vec3.scaleAndAdd(this.position, this.position, this.forward, -this.moveSpeed * by);
        this.apply();
    }

    strafeLeft(by = 1) {
        vec3.scaleAndAdd(this.position, this.position, this.right, -this.moveSpeed * by);
        this.apply();
    }

    strafeRight(by = 1) {
        vec3.scaleAndAdd(this.position, this.position, this.right, this.moveSpeed * by);
        this.apply();
    }

    yawLeft(by = 1) {
        let mRight = mat4.create();
        mat4.rotate(mRight, mRight, this.rotSpeed * by, this.up);
        vec3.transformMat4(this.forward, this.forward, mRight);
        this.renorm();
        this.apply();
    }

    yawRight(by = 1) {
        let mRight = mat4.create();
        mat4.rotate(mRight, mRight, -this.rotSpeed * by, this.up);
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

        this.renorm();
        this.apply();
    }

    apply() {
        refresh(
            this.gldata,
            this.world.getMat4(),
            this.getMat4(),
            this.proj.getMat4()
        );
    }
}
