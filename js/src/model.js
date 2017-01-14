import {mat4} from 'gl-matrix';
import refresh from './refresh';

export default class Model {
    constructor(
        gldata,
        glutils,
        camera,
        proj,
        name,
        parent,
        meshes,
        mat4
    ) {
        this.gldata = gldata;
        this.glutils = glutils;
        this.camera = camera;
        this.proj = proj;
        this.name = name;
        this.parent = parent;
        this.meshes = meshes;
        this.objModels = {};
        this.mat4 = mat4;
    }

    // HACK DUPE
    addModel(arr, child, mTrans) {

        let myTrans = mat4.fromValues(...child.transformation);

        // fuck
        mat4.transpose(myTrans, myTrans);

        if (mTrans) {
            mat4.mul(myTrans, mTrans, myTrans);
        }
        let model = new Model(
            this.gldata,
            this.glutils,
            this.camera,
            this.proj,
            child.name,
            this,
            child.meshes,
            myTrans
        );

        this.objModels[child.name] = model;

        if ('undefined' !== typeof child.children) {
            for (let child2 of child.children) {
                model.addModel(arr, child2);
            }
        }
    }

    getMat4() {
        if (this.parent) {
            let ret = mat4.create();
            mat4.mul(ret, this.parent.getMat4(), this.mat4);
            return ret;
        }
        return this.mat4;
    }

    draw(objMeshes, program) {
        //if (!this.meshes) return;
        for (let meshIdId in this.meshes) {
            let mesh = objMeshes[this.meshes[meshIdId]];
            mesh.use(program);

            refresh(
                this.gldata,
                this.getMat4(),
                this.camera.getMat4(),
                this.proj.getMat4()
            );

            this.glUtils.draw(mesh.getIndices());
            mesh.free(program);
        }
        for (let modelName in this.objModels) {
            let model2 = this.objModels[modelName];
            model2.draw(objMeshes, program);
        }
    }
}
