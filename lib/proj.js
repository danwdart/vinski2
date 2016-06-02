class Proj {
    constructor(program, fov = T / 8, aspect = w / h, near = 0.1, far = 10000.0) {
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
