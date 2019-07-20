import {mat4} from 'gl-matrix';

export default class World {
    constructor(program) {
        this.program = program;
        this.mWorld = mat4.create();
        mat4.identity(this.mWorld);
    }

    getMat4() {
        return this.mWorld;
    }
}
