class World {
    constructor(program) {
        this.program = program;
        this.mWorld = mat4.create();
        mat4.identity(this.mWorld);
    }

    getMat4() {
        return this.mWorld;
    }
}
