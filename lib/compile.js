let compileProgram = (vertexText, fragmentText) => {
    let vertexShader = gl.createShader(gl.VERTEX_SHADER),
        fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexText);
    gl.shaderSource(fragmentShader, fragmentText);

    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.log(vertexText);
        console.log(gl.getShaderInfoLog(vertexShader));
        throw new Error('Error compiling vertex shader');
    }

    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.log(fragmentText);
        console.log(gl.getShaderInfoLog(fragmentShader));
        throw new Error('Error compiling fragment shader');
    }

    program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log(gl.getProgramInfoLog(program));
        throw new Error('Error linking program');
    }

    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.log(gl.getProgramInfoLog(program));
        throw new Error('Error validating program');
    }

    return program;
};
