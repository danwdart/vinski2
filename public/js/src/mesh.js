import {vec3} from 'gl-matrix';
import Texture from './tex';

export default class Mesh {
    constructor(
        gl,
        glData,
        program,
        buffers,
        name,
        arrVertices,
        arrIndices,
        arrTexCoords,
        arrNormals,
        colour,
        textures,
        textureName
    ) {
        this.gl = gl;
        this.glData = glData;
        this.program = program;
        this.buffers = buffers;
        this.name = name;
        this.vertices = arrVertices;
        this.texCoords = arrTexCoords;
        this.indices = arrIndices;
        this.normals = arrNormals;
        this.colour = colour;
        this.textures = textures;
        this.textureName = textureName;

        this.posVertexBuffer = buffers.createFloat32ArrayBuffer(arrVertices);
        this.indexBuffer = buffers.createUint16ElementArrayBuffer(arrIndices);
        this.normalBuffer = buffers.createFloat32ArrayBuffer(arrNormals);

        if (0 < arrTexCoords.length) {
            this.texCoordBuffer = buffers.createFloat32ArrayBuffer(arrTexCoords);
        }

        if (textureName) {
            // GET IT HERE
            let texElement = this.textures[textureName];
            if (`undefined` === typeof texElement) {
                throw new Error(`${textureName} was not found.`);
            }

            this.tex = new Texture(gl, texElement);

            this.tex.enable();
        }

        this.buffers.clear();
    }

    use() {
        //gl.useProgram(program);
        this.buffers.enablePositionBuffer(this.posVertexBuffer);
        this.buffers.enableIndexBuffer(this.indexBuffer);
        this.buffers.enableNormalBuffer(this.normalBuffer);
        if (0 < this.texCoords.length)
            this.buffers.enableTexCoordBuffer(this.texCoordBuffer);
        if (this.tex)
            this.tex.use();
        if (this.colour)
            this.glData.setColour(this.colour);
    }

    free() {
        this.buffers.free();
        if (this.tex) {
            this.tex.free();
        }
    }

    getVertices() {
        return this.vertices;
    }

    getIndices() {
        return this.indices;
    }

    getNormals() {
        return this.normals;
    }

    getTransformedVertexNormalArray(model) {
        let arrOldVertices = this.getVertices(),
            arrOldNormals = this.getNormals(),
            intermediates = [];

        // The clever bit makes [1,2,3,4,5,6], [7,8,9,10,11,12] into
        // [[[1,2,3], [7,8,9]],[[4,5,6],[10,11,12]]]
        for (let idx = 0; idx < arrOldVertices.length; idx += 3) {
            let nextThreeVertices = arrOldVertices.slice(idx, idx + 3),
                nextThreeNormals = arrOldNormals.slice(idx, idx + 3),
                nextDataPoints = [nextThreeVertices, nextThreeNormals];
            intermediates.push(nextDataPoints);
        }

        return intermediates.map(v => {
            // mul with...
            let vertex = vec3.fromValues(...v[0]),
                normal = vec3.fromValues(...v[1]);
            vec3.transformMat4(vertex, vertex, model.getMat4());
            vec3.transformMat4(normal, normal, model.getMat4());
            vec3.normalize(normal, normal);

            return [vertex, normal];
        });
    }
}
