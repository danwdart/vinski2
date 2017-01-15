export default class Texture {
    constructor(gl, texElement) {
        this.gl = gl;
        this.texElement = texElement;
        this.tex = null;
    }

    enable() {
        let texElement = this.texElement,
            gl = this.gl;

        this.tex = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        this.paint();
    }

    paint() {
        let gl = this.gl;

        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            this.texElement
        );
    }

    use() {
        let gl = this.gl,
            texElement = this.texElement;
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        if ('HTMLVideoElement' == texElement.constructor.name)
            this.paint();
        //gl.activeTexture(gl.TEXTURE0);
    }

    free() {
        let gl = this.gl;
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}
