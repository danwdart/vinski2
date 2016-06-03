const
    T                       = 2 * Math.PI,
    canvas                  = document.querySelector('canvas'),
    debug                   = document.querySelector('.debug'),
    texSize                 = 512,
    eyeHeight               = 2,
    gl                      = canvas.getContext('webgl'),
    pointLightPosition      = vec3.fromValues(0, 5, 5),
    assetsToLoad            = {
        noshadowv: 'shaders/noshadow.v.glsl',
        noshadowf: 'shaders/noshadow.f.glsl',
        shadowv: 'shaders/shadow.v.glsl',
        shadowf: 'shaders/shadow.f.glsl',
        shadowgenv: 'shaders/shadowgen.v.glsl',
        shadowgenf: 'shaders/shadowgen.f.glsl',
        vinski1: 'models/vinski1.json',
        tunnel: 'models/tunnel.json',
        player: 'models/sandra.json',
        bob: 'models/bob.json',
        director: 'models/director.json',
        platform: 'models/platform.json'
    };

let h = null,
    w = null,
    world,
    proj,
    camera,
    ready,
    arrAssetNames = [],
    arrAssetFiles = [];
    assets = {};

for (let key in assetsToLoad) {
    arrAssetNames.push(key);
    // Object.values() is not present: somebody screwed with time
    arrAssetFiles.push(assetsToLoad[key]);
}

Promise.all(arrAssetFiles.map((a) => loadAjax(a))).then((results) => {
    for (let i in results) {
        assets[arrAssetNames[i]] = results[i];
    }
    let objPrograms = {
            noshadow: compileProgram(assets.noshadowv, assets.noshadowf)
            //shadow: compileProgram(r[2], r[3]),
            //shadowgen: compileProgram(r[4], r[5])
        },
        objModels = {
            vinski1: JSON.parse(assets.vinski1),
            tunnel: JSON.parse(assets.tunnel),
            //player: JSON.parse(r[8]),
            bob: JSON.parse(assets.bob),
            director: JSON.parse(assets.director),
            platform: JSON.parse(assets.platform)
        };

    runPrograms(objPrograms, objModels);
}).catch((err) => console.log(err));
