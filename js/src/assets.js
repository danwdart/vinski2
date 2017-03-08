import loadAjax from './ajax';
import compileProgram from './compile';

import noshadowv from '../../shaders/noshadow.v.glsl';
import noshadowf from '../../shaders/noshadow.f.glsl';
import shadowv from '../../shaders/shadow.v.glsl';
import shadowf from '../../shaders/shadow.f.glsl';
import shadowgenv from '../../shaders/shadowgen.v.glsl';
import shadowgenf from '../../shaders/shadowgen.f.glsl';

import vinski1 from '../../models/vinski1.json';
import tunnel from '../../models/tunnel.json';

/*
    player: 'models/sandra.json',
    bob: 'models/bob2.json',
    director: 'models/director2.json',
    platform: 'models/platform.json',
    cthulhu: 'models/cthulhu.json', // by Amanda Jackson, CC-BY-NC-SA
    handoferis: 'models/handoferis.json', // by Archindividual, CC-BY-SA
    fnord: 'models/fnord.json', // by Archindividual, CC-BY-SA
    discoin: 'models/discoin.json', // by scvalex, CC-BY-SA
*/

let assets = {
    noshadowv,
    noshadowf,
    shadowv,
    shadowf,
    shadowgenv,
    shadowgenf,
    vinski1,
    tunnel
};


export default (gl, loading) => new Promise((res, rej) => {
    loading.remove();

    let objPrograms = {
        noshadow: compileProgram(gl, assets.noshadowv, assets.noshadowf)
        //shadow: compileProgram(r[2], r[3]),
        //shadowgen: compileProgram(r[4], r[5])
    },
    objModels = {
        vinski1: assets.vinski1,
        tunnel: assets.tunnel/*,
        player: JSON.parse(assets.player),
        bob: JSON.parse(assets.bob),
        director: JSON.parse(assets.director),
        platform: JSON.parse(assets.platform),
        cthulhu: JSON.parse(assets.cthulhu),
        handoferis: JSON.parse(assets.handoferis),
        fnord: JSON.parse(assets.fnord),
        discoin: JSON.parse(assets.discoin)*/
    };
    res([objPrograms, objModels]);
});
