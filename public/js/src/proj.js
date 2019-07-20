import {mat4} from 'gl-matrix';

const T = Math.PI * 2;

export default class Proj {
    constructor(program, aspect, fov = T / 8, near = 0.1, far = 10000.0) {
        this.program = program;
        this.fov = fov;
        this.aspect = aspect;
        this.near = near;
        this.far = far;
        this.mProj = mat4.create();
        this.apply();
    }

    apply() {
        mat4.perspective(this.mProj, this.fov, this.aspect, this.near, this.far);
    }

    getMat4() {
        return this.mProj;
    }
}
