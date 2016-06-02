let getAL = (program, name) => gl.getAttribLocation(program, name),
    getUL = (program, name) => gl.getUniformLocation(program, name),
    setUM4fv = (program, name, value) => gl.uniformMatrix4fv(getUL(program, name), gl.FALSE, value),
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
    },
    clear = () => {
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    },
    draw = (arrIndices) => gl.drawElements(
        gl.TRIANGLES,
        arrIndices.length,
        gl.UNSIGNED_SHORT,
        0
    ),
    enableLights = (program) => {
        //setU3f('ambientLightIntensity', 0.2, 0.2, 0.2);
        //setU3f('sun.direction', 3.0, 4.0, -2.0);
        //setU3f('sun.intensity', 0.9, 0.9, 0.9);
        setU3fv(program, 'pointLightPosition', pointLightPosition);
    },
    setColour = (program, colour) => {
        setU4fv(program, 'meshColour', colour);
    };
