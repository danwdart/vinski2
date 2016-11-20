export default class GLData {
    constructor(gl, program) {
        this.gl = gl;
        this.program = program;
        this.ALs = {};
        this.ULs = {};
    }

    getAL(name) {
        let gl = this.gl;
        
        if ('undefined' == typeof this.ALs[name])
            this.ALs[name] = gl.getAttribLocation(program, name);
        return this.ALs[name];
    }
    
    getUL(name) {
        let gl = this.gl;
        
        if ('undefined' == typeof this.ULs[name])
            this.ULs[name] = gl.getUniformLocation(program, name);
        return this.ULs[name];
    }
    
    setUM4fv(name, value) {
        this.gl.uniformMatrix4fv(
            this.getUL(name),
            false,
            value
        );
    }
    
    setU3f(name, x, y, z) {
        this.gl.uniform3f(
            this.getUL(name),
            x, y, z
        );
    }
    
    setU2fv(name, value) {
        this.gl.uniform2fv(
            this.getUL(name),
            value
        );
    }
    
    setU3fv(name, value) {
        this.gl.uniform3fv(
            this.getUL(name),
            value
        );
    }
    
    setU4fv(name, value) {
        this.gl.uniform4fv(
            this.getUL(name),
            value
        );
    }
    
    setU1i(program, name, value) {
        this.gl.uniform1i(
            this.getUL(name),
            value
        );
    }
    
    enableLights(pointLightPosition) {
        //setU3f('ambientLightIntensity', 0.2, 0.2, 0.2);
        //setU3f('sun.direction', 3.0, 4.0, -2.0);
        //setU3f('sun.intensity', 0.9, 0.9, 0.9);
        this.setU3fv('pointLightPosition', pointLightPosition);
    }
    
    setColour(colour) {
        this.setU4fv('meshColour', colour);
    }
}
