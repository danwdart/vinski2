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
import player from '../../models/sandra.json';
import bob from '../../models/bob2.json';
import director from '../../models/director2.json';
import platform from '../../models/platform.json';
import cthulhu from '../../models/cthulhu.json'; // by Amanda Jackson, CC-BY-NC-SA
import handoferis from '../../models/handoferis.json'; // by Archindividual, CC-BY-SA
import fnord from '../../models/fnord.json'; // by Archindividual, CC-BY-SA
import discoin from '../../models/discoin.json'; // by scvalex, CC-BY-SA

let assets = {
    noshadowv,
    noshadowf,
    shadowv,
    shadowf,
    shadowgenv,
    shadowgenf,
    vinski1,
    tunnel,
    player,
    bob,
    director,
    platform,
    cthulhu,
    handoferis,
    fnord,
    discoin
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
        tunnel: assets.tunnel,
        player: assets.player,
        bob: assets.bob,
        director: assets.director,
        platform: assets.platform,
        cthulhu: assets.cthulhu,
        handoferis: assets.handoferis,
        fnord: assets.fnord,
        discoin: assets.discoin
    };
    res([objPrograms, objModels]);
});
