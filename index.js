let
    canvas                  = document.querySelector('canvas'),
    gl                      = canvas.getContext('webgl'),
    h = null,
    w = null,
    loop,
    world,
    proj,
    camera,
    ready,
    arrAssetNames = [],
    arrAssetFiles = [];
    assets = {},
    objModels = {},
    objMeshes = {},
    animating = false;
const
    T                       = 2 * Math.PI,
    debug                   = document.querySelector('.debug'),
    loading                 = document.querySelector('.loading'),
    hud                     = document.querySelector('.hud'),
    texSize                 = 256,
    eyeHeight               = 2,
    pointLightPosition      = vec3.fromValues(0, 10, 0),
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
        bob: 'models/bob2.json',
        director: 'models/director2.json',
        platform: 'models/platform.json',
        cthulhu: 'models/cthulhu.json', // by Amanda Jackson, CC-BY-NC-SA
        handoferis: 'models/handoferis.json', // by Archindividual, CC-BY-SA
        fnord: 'models/fnord.json', // by Archindividual, CC-BY-SA
        discoin: 'models/discoin.json', // by scvalex, CC-BY-SA
    };

for (let key in assetsToLoad) {
    arrAssetNames.push(key);
    // Object.values() is not present: somebody screwed with time
    arrAssetFiles.push(assetsToLoad[key]);
}

let load = () => {
    Promise.all(arrAssetFiles.map((a) => loadAjax(a))).then((results) => {
        loading.remove();
        canvas.style.display = 'block';
        hud.style.display = 'block';
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
                player: JSON.parse(assets.player),
                bob: JSON.parse(assets.bob),
                director: JSON.parse(assets.director),
                platform: JSON.parse(assets.platform),
                cthulhu: JSON.parse(assets.cthulhu),
                handoferis: JSON.parse(assets.handoferis),
                fnord: JSON.parse(assets.fnord),
                discoin: JSON.parse(assets.discoin)
            };

        runPrograms(objPrograms, objModels);
    }).catch((err) => console.log(err));
};

window.addEventListener('load', load);
