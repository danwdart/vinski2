class Model {
    constructor(
        name,
        parent,
        arrVertices,
        arrIndices,
        arrTexCoords,
        arrNormals,
        mat4,
        colour,
        texture
    ) {
        this.name = name;
        this.parent = parent;
        this.vertices = arrVertices;
        this.texCoords = arrTexCoords;
        this.indices = arrIndices;
        this.normals = arrNormals;
        this.mat4 = mat4;
        this.colour = colour;
        this.texture = texture;

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        this.posVertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.posVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrVertices), gl.STATIC_DRAW);

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(arrIndices), gl.STATIC_DRAW);

        this.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrNormals), gl.STATIC_DRAW);

        if (0 < arrTexCoords.length) {
            this.texCoordBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrTexCoords), gl.STATIC_DRAW);
        }

        if (texture) {
            this.tex = enableTexture(this.texture);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    use(program) {
        gl.useProgram(program);
        enablePositionBuffer(program, this.posVertexBuffer);
        enableIndexBuffer(program, this.indexBuffer);
        enableNormalBuffer(program, this.normalBuffer);
        if (0 < this.texCoords.length)
            enableTexCoordBuffer(program, this.texCoordBuffer);
        if (this.tex) {
            useTexture(this.tex);
        }
        if (this.colour)
            setColour(program, this.colour);
    }

    free() {
        freeBuffers();
        if (this.tex)
            freeTexture();
    }

    getVertices() {
        return this.vertices;
    }

    getIndices() {
        return this.indices;
    }

    getMat4() {
        if (this.parent) {
            let ret = mat4.create();
            mat4.mul(ret, this.parent.mat4, this.mat4);
            return ret;
        }
        return this.mat4;
    }
}
