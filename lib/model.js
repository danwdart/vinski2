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

    getNormalMat4() {
        let normalTransformation = mat4.create();
        mat4.invert(normalTransformation, this.getMat4());
        mat4.transpose(normalTransformation, normalTransformation);
        return normalTransformation;
    }

    draw(objMeshes, program) {
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
            model2.draw(objMeshes, program);
        }
    }

    getCollisionMatrixSphere(sphereLocation, sphereSize, objMeshes) {
        let push = vec3.create(),
            nPushes = 0;

        for (let meshIdId in this.meshes) {
            let mesh = objMeshes[this.meshes[meshIdId]],
                mapped = mesh.getBoundingTransformedVertexNormalArray(this),
                indices = mesh.getBoundingIndices();

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
                    collidesWithPlane = Math.abs(dotted) < sphereSize;

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
                    //console.log(mesh.name, i, mapped.map(v=>v[0]))
                    // TODO get actual push
                    nPushes++;
                    vec3.add(push, push, N);
                }
            }
        }

        for (let modelName in this.objModels) {
            let model2 = this.objModels[modelName];
            let modelPush = model2.getCollisionMatrixSphere(sphereLocation, sphereSize, objMeshes);

            vec3.add(push, push, modelPush);

        }

        return push;
    }
}
