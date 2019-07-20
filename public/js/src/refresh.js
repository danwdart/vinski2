import {mat4} from 'gl-matrix';


let mPos = mat4.create();

export default (gldata, mWorld, mView, mProj) => {
    //if (!ready) return;
    //gl.useProgram(program);
    mat4.identity(mPos);
    gldata.setUM4fv(`mWorld`, mWorld);
    //setUM4fv('mView', camera.getMat4());
    //setUM4fv('mProj', proj.getMat4());

    mat4.multiply(mPos, mWorld, mPos);
    mat4.multiply(mPos, mView, mPos);
    mat4.multiply(mPos, mProj, mPos);
    gldata.setUM4fv(`mPos`, mPos);
};
