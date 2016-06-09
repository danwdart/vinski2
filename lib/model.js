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

    getVertices(objMeshes) {
        let arrVex = [];

        for (let meshIdId in this.meshes) {
            let mesh = objMeshes[this.meshes[meshIdId]];

            let arrOldVertices = mesh.getVertices(),
                arrOldNormals = mesh.getNormals(),
                intermediates = [];

            // The clever bit makes [1,2,3,4,5,6], [7,8,9,10,11,12] into
            // [[[1,2,3], [7,8,9]],[[4,5,6],[10,11,12]]]
            for (let idx = 0; idx < arrOldVertices.length; idx += 3) {
                let nextThreeVertices = arrOldVertices.slice(idx, idx + 3),
                    nextThreeNormals = arrOldNormals.slice(idx, idx + 3),
                    nextDataPoints = [nextThreeVertices, nextThreeNormals];
                intermediates.push(nextDataPoints);
            }

            let mapped = intermediates.map((v) => {
                // mul with...
                let vertex = vec3.fromValues(...v[0]),
                    normal = vec3.fromValues(...v[1]),
                    distToVert = vec3.create();
                vec3.transformMat4(vertex, vertex, this.getMat4());
                vec3.transformMat4(normal, normal, this.getMat4());
                vec3.normalize(normal, normal);

                return [vertex, normal];
            });

            arrVex = arrVex.concat(mapped);
        }

        for (let modelName in this.objModels) {
            let model2 = this.objModels[modelName];
            let m2v = model2.getVertices(objMeshes);
            arrVex = arrVex.concat(m2v);
        }

        return arrVex;
    }

    getCollisionMatrixSphere(sphereLocation, sphereSize, objMeshes) {

        let verts = this.getVertices(objMeshes),
            lenaff = 0;

        let arrPushVecs = verts.map((v) => {
            let vertex = v[0],
                normal = v[1],
                distToVert = vec3.create();

            vec3.sub(distToVert, vertex, sphereLocation);

            let dotted = vec3.dot(normal, distToVert),
                // TODO detect if you are outside of the triangle
                collides = Math.abs(dotted) < sphereSize;

            if (collides) lenaff++;

            return collides ?
                normal:
                vec3.create();
        });

        let len = arrPushVecs.length;

        let push = arrPushVecs.reduce((prev, current, idx, arr) => {
            vec3.add(prev, prev, current);
            return prev;
        }, vec3.create());

        vec3.scale(push, push, 1/lenaff);


        return push;
    }
}
