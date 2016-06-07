let enablePositionBuffer = (program, positionBuffer) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        let positionAttributeLocation = getAL(program, 'vertPosition');
        gl.vertexAttribPointer(
            positionAttributeLocation,
            3, gl.FLOAT,
            gl.FALSE,
            3 * Float32Array.BYTES_PER_ELEMENT,
            0
        );

        gl.enableVertexAttribArray(positionAttributeLocation);
    },
    disablePositionBuffer = (program) => {
        let positionAttributeLocation = getAL(program, 'vertPosition');
        gl.disableVertexAttribArray(positionAttributeLocation);
    },
    enableTexCoordBuffer = (program, texCoordBuffer) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        let texCoordAttributeLocation = getAL(program, 'vertTexCoord');
        gl.vertexAttribPointer(
            texCoordAttributeLocation,
            2, gl.FLOAT,
            gl.FALSE,
            2 * Float32Array.BYTES_PER_ELEMENT,
            0
        );
        gl.enableVertexAttribArray(texCoordAttributeLocation);
    },
    disableTexCoordBuffer = (program) => {
        let texCoordAttributeLocation = getAL(program, 'vertTexCoord');
        gl.disableVertexAttribArray(texCoordAttributeLocation);
    },
    enableNormalBuffer = (program, normalBuffer) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        let normalAttribLocation = getAL(program, 'vertNormal');
        gl.vertexAttribPointer(
            normalAttribLocation,
            3, gl.FLOAT,
            gl.TRUE,
            3 * Float32Array.BYTES_PER_ELEMENT,
            0
        );
        gl.enableVertexAttribArray(normalAttribLocation);
    },
    disableNormalBuffer = (program) => {
        let normalAttribLocation = getAL(program, 'vertNormal');
        gl.disableVertexAttribArray(normalAttribLocation);
    }
    enableIndexBuffer = (program, indexBuffer) => {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    },
    freeBuffers = (program) => {
        disablePositionBuffer(program);
        disableTexCoordBuffer(program);
        disableNormalBuffer(program);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    };
