class Model {
    constructor(
        name,
        parent,
        meshes,
        mat4
    ) {
        this.name = name;
        this.parent = parent;
        this.meshes = meshes;
        this.objModels = {};
        this.mat4 = mat4;
    }

    getMat4() {
        if (this.parent) {
            let ret = mat4.create();
            mat4.mul(ret, this.parent.getMat4(), this.mat4);
            return ret;
        }
        return this.mat4;
    }

    draw(objMeshes, program, camera, proj) {
        //if (!this.meshes) return;
        for (let meshIdId in this.meshes) {
            let mesh = objMeshes[this.meshes[meshIdId]];
            mesh.use(program);

            refresh(
                program,
                this.getMat4(),
                camera.getMat4(),
                proj.getMat4()
            );

            draw(mesh.getIndices());
            mesh.free(program);
        }
        for (let modelName in this.objModels) {
            let model2 = this.objModels[modelName];
            model2.draw(objMeshes, program, camera, proj);
        }
    }
}
