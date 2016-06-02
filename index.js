const
    T                       = 2 * Math.PI,
    canvas                  = document.querySelector('canvas'),
    debug                   = document.querySelector('.debug'),
    texSize                 = 512,
    eyeHeight               = 2,
    gl                      = canvas.getContext('webgl'),
    pVertexText             = loadAjax('shaders/noshadow.v.glsl'),
    pFragmentText           = loadAjax('shaders/noshadow.f.glsl'),
    pShadowVertexText       = loadAjax('shaders/shadow.v.glsl'),
    pShadowFragmentText     = loadAjax('shaders/shadow.f.glsl'),
    pShadowGenVertexText    = loadAjax('shaders/shadowgen.v.glsl'),
    pShadowGenFragmentText  = loadAjax('shaders/shadowgen.f.glsl'),
    pVinski1Text            = loadAjax('models/vinski1.json'),
    pTunnelText             = loadAjax('models/tunnel.json'),
    pPlayerText             = loadAjax('models/sandra.json'),
    pointLightPosition      = vec3.fromValues(0, 5, 5);

let h = null,
    w = null,
    world,
    proj,
    camera,
    ready;

Promise.all([
    pVertexText,
    pFragmentText,
    pShadowVertexText,
    pShadowFragmentText,
    pShadowGenVertexText,
    pShadowGenFragmentText,
    pVinski1Text,
    pTunnelText,
    pPlayerText,
]).then((r) => {
    let program = compileProgram(r[0], r[1]),
        shadowProgram = compileProgram(r[2], r[3]),
        shadowGenProgram = compileProgram(r[4], r[5]),
        arrVinski1 = JSON.parse(r[6]),
        arrTunnel = JSON.parse(r[7]);
        arrPlayer = JSON.parse(r[8]);

    runPrograms(program, shadowProgram, shadowGenProgram, arrVinski1, arrTunnel, arrPlayer);
}).catch((err) => console.log(err));
