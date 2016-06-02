let refresh = (program, mWorld, mView, mProj) => {
    //if (!ready) return;
    gl.useProgram(program);
    let mPos = mat4.create();
    mat4.identity(mPos);
    setUM4fv(program, 'mWorld', mWorld);
    //setUM4fv('mView', camera.getMat4());
    //setUM4fv('mProj', proj.getMat4());

    mat4.multiply(mPos, mWorld, mPos);
    mat4.multiply(mPos, mView, mPos);
    mat4.multiply(mPos, mProj, mPos);
    setUM4fv(program, 'mPos', mPos);

    return mPos;
};
