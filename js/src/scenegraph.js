import {vec3, vec4, mat4} from 'gl-matrix';
import Model from './model';
import Mesh from './mesh';

const T = 2 * Math.PI;

export default class SceneGraph {
    constructor() {
        this.program = program;
        this.objModels = {};
        this.objMeshes = {};
    }
    
    draw() {
        for (let sceneName in this.objModels) {
            for (let modelName in objModels[sceneName]) {
                this.objModels[sceneName][modelName].draw(this.objMeshes[sceneName], this.program);
            }
        }
    }
    
    addAllObjects(objModelArrays) {
        for (let name in objModelArrays) {
            this.addObjects(name, objModelArrays[name]);
        }
    }

    addModel(arr, child, mTrans) {

        let myTrans = mat4.fromValues(...child.transformation);

        // fuck
        mat4.transpose(myTrans, myTrans);

        if (mTrans) {
            mat4.mul(myTrans, mTrans, myTrans);
        }
        let model = new Model(
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
    
    addMeshes(arr) {
        for (let meshId in arr.meshes) {
            let arrMesh = arr.meshes[meshId],
                materialProperties = arr.materials[arrMesh.materialindex].properties,
                colour = vec4.create(),
                texture = null;

            for (let property of materialProperties) {
                switch (property.key) {
                    case '$clr.diffuse':
                        vec4.add(colour, colour, vec4.fromValues(...property.value, 1.0));
                        break;
                    case '$clr.ambient':
                        //vec4.add(colour, colour, vec4.fromValues(...property.value, 1.0));
                        break;
                    case '$clr.specular':
                        //vec4.add(colour, colour, vec4.fromValues(...property.value, 1.0));
                        break;

                    case '$tex.file':
                        texture = property.value;
                        break;
                    default:
                }
            }

            let mesh = new Mesh(
                arrMesh.name,
                arrMesh.vertices,
                [].concat.apply([], arrMesh.faces),
                arrMesh.texturecoords?arrMesh.texturecoords[0]:[],
                arrMesh.normals,
                colour,
                texture
            );

            this.objMeshes[meshId] = mesh;
        }
    }
    
    addObjects(name, arr) {
        //console.log(arr);
        let trans = mat4.create();
        mat4.identity(trans);
        switch (name) {
            case 'vinski1':
                // Leave it alone
                break;
            case 'tunnel':
                mat4.rotate(trans, trans, T/4, vec3.fromValues(1, 0, 0));
                mat4.rotate(trans, trans, 3*T/4, vec3.fromValues(0, 1, 0));
                mat4.translate(trans, trans, vec3.fromValues(0, 4, 20));
                break;
            case 'player':
                mat4.translate(trans, trans, vec3.fromValues(6, 0, 0));
                mat4.scale(trans, trans, vec3.fromValues(0.12, 0.12, 0.12));
                mat4.rotate(trans, trans, T/4, vec3.fromValues(1, 0, 0));
                mat4.rotate(trans, trans, T/4, vec3.fromValues(0, 1, 0));
                break;
            case 'bob':
                mat4.translate(trans, trans, vec3.fromValues(-5, -6, 2.5));
                mat4.scale(trans, trans, vec3.fromValues(25, 25, 25));
                mat4.rotate(trans, trans, T/4, vec3.fromValues(1, 0, 0));
                mat4.rotate(trans, trans, T/4, vec3.fromValues(0, 1, 0));
                break;
            case 'director':
                mat4.translate(trans, trans, vec3.fromValues(-5, -12, 1.5));
                mat4.scale(trans, trans, vec3.fromValues(25, 25, 25));
                mat4.rotate(trans, trans, T/4, vec3.fromValues(1, 0, 0));
                mat4.rotate(trans, trans, T/4, vec3.fromValues(0, 1, 0));
                break;
            case 'platform':
                mat4.translate(trans, trans, vec3.fromValues(0, 6, 0));
                break;
            case 'cthulhu':
                mat4.translate(trans, trans, vec3.fromValues(0, 0, 5));
                mat4.rotate(trans, trans, T/4, vec3.fromValues(0, 0, 1));
                mat4.rotate(trans, trans, -T/4, vec3.fromValues(1, 0, 0));
                mat4.scale(trans, trans, vec3.fromValues(0.05, 0.05, 0.05));
                break;
            case 'fnord':
                mat4.translate(trans, trans, vec3.fromValues(-5, -20, 5));
                mat4.rotate(trans, trans, T/3, vec3.fromValues(0, 0, 1));
                mat4.rotate(trans, trans, T/4, vec3.fromValues(1, 0, 0));
                mat4.scale(trans, trans, vec3.fromValues(0.1, 0.1, 0.1));
                break;
            case 'discoin':
                mat4.translate(trans, trans, vec3.fromValues(-4, 15, 8));
                mat4.scale(trans, trans, vec3.fromValues(0.2, 0.2, 0.2));
                mat4.rotate(trans, trans, T/4, vec3.fromValues(0, 0, 1));
                mat4.rotate(trans, trans, -T/4, vec3.fromValues(0, 1, 0));
                break;
            case 'handoferis':
                mat4.translate(trans, trans, vec3.fromValues(-15, -3, 12));
                mat4.rotate(trans, trans, T/4, vec3.fromValues(0, 0, 1));
                mat4.rotate(trans, trans, T/4, vec3.fromValues(1, 0, 0));
                mat4.scale(trans, trans, vec3.fromValues(0.1, 0.1, 0.1));
                break;
            default:
                console.log('Dunno where to put', name);
        }

        this.addMeshes(arr);
        this.addModel(arr, arr.rootnode, trans);
    }
}
