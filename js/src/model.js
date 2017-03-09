import {mat4, vec3} from 'gl-matrix';
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
        this.objModels = [];
        this.mat4 = mat4;
    }

    // HACK DUPE
    addModel(strSceneName, arr, child, mTrans) {

        let myTrans = mat4.fromValues(...child.transformation);

        // fuck
        mat4.transpose(myTrans, myTrans);

        if (mTrans) {
            //mat4.mul(myTrans, mTrans, myTrans);
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

        this.objModels.push(model);

        if ('undefined' !== typeof child.children) {
            for (let child2 of child.children) {
                model.addModel(strSceneName, arr, child2, myTrans);
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

    draw(strSceneName, objMeshes, program) {
        if (this.name.includes('BoundingBox')) {
            return;
        }
        //if (!this.meshes) return;
        for (let meshIdId in this.meshes) {
            let mesh = objMeshes[this.meshes[meshIdId]];
            mesh.use();

            refresh(
                this.gldata,
                this.getMat4(),
                this.camera.getMat4(),
                this.proj.getMat4()
            );

            this.glutils.draw(mesh.getIndices());
            mesh.free();
        }
        for (let modelName in this.objModels) {
            let model2 = this.objModels[modelName];
            model2.draw(strSceneName, objMeshes, program);
        }
    }

    getCollisionMatrixSphere(sphereLocation, sphereSize, objMeshes) {
        let push = vec3.create(),
            nPushes = 0;

        if (this.name.includes('BoundingBox')) {
            for (let meshIdId in this.meshes) {
                let mesh = objMeshes[this.meshes[meshIdId]],
                    mapped = mesh.getTransformedVertexNormalArray(this),
                    indices = mesh.getIndices();

                for (let i = 0; i < indices.length; i += 3) {
                    //console.log(i);
                    let indexA = indices[i],
                        indexB = indices[i + 1],
                        indexC = indices[i + 2],
                        Adata = mapped[indexA],
                        Bdata = mapped[indexB],
                        Cdata = mapped[indexC],
                        A = Adata[0],
                        B = Bdata[0],
                        C = Cdata[0],
                        N = Adata[1],
                        P = sphereLocation,
                        AP = vec3.create(),
                        BP = vec3.create(),
                        CP = vec3.create(),
                        AB = vec3.create(),
                        BC = vec3.create(),
                        CA = vec3.create(),
                        ABxAP = vec3.create(),
                        BCxBP = vec3.create(),
                        CAxCP = vec3.create();

                    vec3.sub(AP, A, P);

                    // console.log({A, B, C, N});

                    let dotted = vec3.dot(N, AP),
                        collidesWithPlane = dotted < sphereSize;

                    //console.log(this.name, dotted, collidesWithPlane)

                    if (!collidesWithPlane) continue;

                    vec3.sub(BP, B, sphereLocation);
                    vec3.sub(CP, C, sphereLocation);
                    vec3.sub(AB, A, B);
                    vec3.sub(BC, B, C);
                    vec3.sub(CA, C, A);

                    vec3.cross(ABxAP, AB, AP);
                    vec3.cross(BCxBP, BC, BP);
                    vec3.cross(CAxCP, CA, CP);

                    let ABxAPdN = vec3.dot(ABxAP, N),
                        BCxBPdN = vec3.dot(BCxBP, N),
                        CAxCPdN = vec3.dot(CAxCP, N);

                    if (Math.sign(ABxAPdN) == Math.sign(BCxBPdN) &&
                        Math.sign(BCxBPdN) == Math.sign(CAxCPdN)) {
                        // TODO get actual push
                        nPushes++;
                        vec3.add(push, push, N);
                    }
                }
            }
        }

        for (let modelName in this.objModels) {
            let model2 = this.objModels[modelName];
            let modelPush = model2.getCollisionMatrixSphere(
                sphereLocation,
                sphereSize,
                objMeshes
            );

            vec3.add(push, push, modelPush);
        }

        return push;
    }
}
