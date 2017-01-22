const VERT_POSITION = 'vertPosition',
    VERT_TEX_COORD = 'vertTexCoord',
    VERT_NORMAL = 'vertNormal';

export default class Buffers {
    constructor(gl, gldata, program) {
        this.gl = gl;
        this.gldata = gldata;
        this.program = program;
        this.positionAttributeLocation = null;
        this.texCoordAttributeLocation = null;
        this.normalAttribLocation = null;
    }

    createFloat32ArrayBuffer(arr) {
        let gl = this.gl,
            buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW);
        return buffer;
    }

    createUint16ElementArrayBuffer(arr) {
        let gl = this.gl,
            buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(arr), gl.STATIC_DRAW);
        return buffer;
    }

    clear() {
        let gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    enablePositionBuffer(positionBuffer) {
        let gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        this.positionAttributeLocation = this.gldata.getAL(VERT_POSITION);
        gl.vertexAttribPointer(
            this.positionAttributeLocation,
            3, gl.FLOAT,
            gl.FALSE,
            3 * Float32Array.BYTES_PER_ELEMENT,
            0
        );

        gl.enableVertexAttribArray(this.positionAttributeLocation);
    }

    disablePositionBuffer() {
        let gl = this.gl;
        this.positionAttributeLocation = this.gldata.getAL(VERT_POSITION);
        gl.disableVertexAttribArray(this.positionAttributeLocation);
    }

    enableTexCoordBuffer(texCoordBuffer) {
        let gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        this.texCoordAttributeLocation = this.gldata.getAL(VERT_TEX_COORD);
        gl.vertexAttribPointer(
            this.texCoordAttributeLocation,
            2, gl.FLOAT,
            gl.FALSE,
            2 * Float32Array.BYTES_PER_ELEMENT,
            0
        );
        gl.enableVertexAttribArray(this.texCoordAttributeLocation);
    }

    disableTexCoordBuffer() {
        let gl = this.gl;
        this.texCoordAttributeLocation = this.gldata.getAL(VERT_TEX_COORD);
        gl.disableVertexAttribArray(this.texCoordAttributeLocation);
    }

    enableNormalBuffer(normalBuffer) {
        let gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        this.normalAttribLocation = this.gldata.getAL(VERT_NORMAL);
        gl.vertexAttribPointer(
            this.normalAttribLocation,
            3, gl.FLOAT,
            gl.TRUE,
            3 * Float32Array.BYTES_PER_ELEMENT,
            0
        );
        gl.enableVertexAttribArray(this.normalAttribLocation);
    }

    disableNormalBuffer() {
        let gl = this.gl;
        this.normalAttribLocation = this.gldata.getAL(VERT_NORMAL);
        gl.disableVertexAttribArray(this.normalAttribLocation);
    }

    enableIndexBuffer(indexBuffer) {
        let gl = this.gl;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    }

    free() {
        this.disablePositionBuffer();
        this.disableTexCoordBuffer();
        this.disableNormalBuffer();
        //gl.bindBuffer(gl.ARRAY_BUFFER, null);
        //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
}
