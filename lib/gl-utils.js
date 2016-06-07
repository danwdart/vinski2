let ALs = {},
    ULs = {},
    getAL = (program, name) => gl.getAttribLocation(program, name),
    getUL = (program, name) => gl.getUniformLocation(program, name),
    setUM4fv = (program, name, value) => gl.uniformMatrix4fv(getUL(program, name), false, value),
    setU3f = (program, name, x, y, z) => gl.uniform3f(getUL(program, name), x, y, z),
    setU2fv = (program, name, value) => gl.uniform2fv(getUL(program, name), value),
    setU3fv = (program, name, value) => gl.uniform3fv(getUL(program, name), value),
    setU4fv = (program, name, value) => gl.uniform4fv(getUL(program, name), value),
    setU1i = (program, name, value) => gl.uniform1i(getUL(program, name), value),
    applySettings = () => {
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);
        gl.frontFace(gl.CCW);
        gl.clearColor(0, 0, 0, 1);
    },
    clear = () => {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    },
    draw = (arrIndices) => gl.drawElements(
        gl.TRIANGLES,
        arrIndices.length,
        gl.UNSIGNED_SHORT,
        0
    ),
    enableShadowGenUniforms = (program) => {
        setU3fv(program, 'pointLightPosition', pointLightPosition);
        setU2fv(program, 'shadowClipNearFar', shadowClipNearFar);
    }
    enableShadowUniforms = (program) => {
        setU3fv(program, 'pointLightPosition', pointLightPosition);
        setU2fv(program, 'shadowClipNearFar', shadowClipNearFar);
        setU1i(program, 'lightShadowMap', 0);
    },
    setColour = (program, colour) => {
        setU4fv(program, 'meshColour', colour);
    };
