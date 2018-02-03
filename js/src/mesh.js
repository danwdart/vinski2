import {vec3, vec4} from 'gl-matrix';
import Texture from './tex';

export default class Mesh {
    static createPlane(gl, glData, program, buffers, name) {
        return new Mesh(
            gl,
            glData,
            program,
            buffers,
            name,
            [
                0, 0, 0,
                1, 0, 0,
                0, 1, 0,
                1, 1, 0,
            ],
            [
                0, 1, 2,
                1, 3, 2
            ],
            [],
            [
                0, 0, 1,
                0, 0, 1,
                0, 0, 1,
                0, 0, 1
            ],
            vec4.create(0.5, 0.5, 0.5, 1),
            null
        );
    }
    static createGrid(gl, glData, program, buffers, name, w, h) {
        let vertices = [],
            indices = [],
            normals = [];

        for (let i = 0; i < w; i++) {
            for (let j = 0; j < h; j++) {
                vertices.push(i);
                vertices.push(j);
                vertices.push(Math.random() / 2);
                normals.push(0);
                normals.push(0);
                normals.push(1);
                if (j < h - 1 && i < w - 1) {
                    indices.push(h * (i + 1) + j);
                    indices.push(h * i + j + 1);
                    indices.push(h * i + j);
                    indices.push(h * (i + 1) + j);
                    indices.push(h * (i + 1) + j + 1);
                    indices.push(h * i + j + 1);

                }
            }
        }

        return new Mesh(
            gl,
            glData,
            program,
            buffers,
            name,
            vertices,
            indices,
            [],
            normals,
            vec4.fromValues(0.5, 0.9, 0.5, 1),
            null
        );
    }
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
        texSrc
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
        this.texSrc = texSrc;

        this.posVertexBuffer = buffers.createFloat32ArrayBuffer(arrVertices);
        this.indexBuffer = buffers.createUint16ElementArrayBuffer(arrIndices);
        this.normalBuffer = buffers.createFloat32ArrayBuffer(arrNormals);

        if (0 < arrTexCoords.length) {
            this.texCoordBuffer = buffers.createFloat32ArrayBuffer(arrTexCoords);
        }

        if (texSrc) {
            let texElement = document.querySelector(`[src="`+this.texSrc+`"]`);
            if (null == texElement)
                console.log(`Cannot find image with src`, this.texSrc);
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

        return intermediates.map((v) => {
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
