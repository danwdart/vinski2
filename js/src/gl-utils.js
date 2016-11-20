export default class GLUtils {
    constructor(gl) {
        this.gl = gl;
    }
    
    applySettings() {
        let gl = this.gl;
        
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);
        gl.frontFace(gl.CCW);
        gl.clearColor(0, 0, 0, 1);
    }
    
    clear() {
        let gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
    
    draw(arrIndices) {
        let gl = this.gl;
        gl.drawElements(
            gl.TRIANGLES,
            arrIndices.length,
            gl.UNSIGNED_SHORT,
            0
        );
    }
}
