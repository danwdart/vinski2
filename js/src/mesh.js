import {vec4} from 'gl-matrix';
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
            this.texElement = document.querySelector('[src="'+this.texSrc+'"]');
            if (null == this.texElement)
                console.log('Cannot find image with src', this.texSrc);
            this.tex = new Texture(gl, this.texElement);

            this.tex.enableTexture();
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
            this.tex.useTexture();
        if (this.colour)
            this.glData.setColour(this.colour);
    }

    free(program) {
        this.buffers.freeBuffers(program);
        if (this.tex)
            this.tex.freeTexture();
    }

    getVertices() {
        return this.vertices;
    }

    getIndices() {
        return this.indices;
    }
}
