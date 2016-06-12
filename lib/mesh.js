class Mesh {
    static createPlane(name) {
        return new Mesh(
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
    static createGrid(name, w, h) {
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
        name,
        arrVertices,
        arrIndices,
        arrTexCoords,
        arrNormals,
        colour,
        texSrc
    ) {
        this.name = name;
        this.vertices = arrVertices;
        this.texCoords = arrTexCoords;
        this.indices = arrIndices;
        this.normals = arrNormals;
        this.colour = colour;
        this.texSrc = texSrc;

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

        if (texSrc) {
            this.texElement = document.querySelector('[src="'+this.texSrc+'"]');
            if (null == this.texSrc)
                console.log('Cannot find image with src', this.texSrc);
            this.tex = enableTexture(this.texElement);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    use(program) {
        //gl.useProgram(program);
        enablePositionBuffer(program, this.posVertexBuffer);
        enableIndexBuffer(program, this.indexBuffer);
        enableNormalBuffer(program, this.normalBuffer);
        if (0 < this.texCoords.length)
            enableTexCoordBuffer(program, this.texCoordBuffer);
        if (this.tex)
            useTexture(this.tex, this.texElement);
        if (this.colour)
            setColour(program, this.colour);
    }

    free(program) {
        freeBuffers(program);
        if (this.tex)
            freeTexture();
    }

    getVertices() {
        return this.vertices;
    }

    getNormals() {
        return this.normals;
    }

    getIndices() {
        return this.indices;
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
                normal = vec3.fromValues(...v[1]),
                distToVert = vec3.create()
            vec3.transformMat4(vertex, vertex, model.getMat4());
            vec3.transformMat4(normal, normal, model.getNormalMat4());
            vec3.normalize(normal, normal);
            return [vertex, normal];
        });
    }
}
