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
import macaw from '../../models/macaw.json'; // by doudoulolita, CC-BY-SA
import orb from '../../models/orb.json'; // by Hannah, unlicenced

import grass from '../../textures/grass.jpg'; // from publicdomainpictures.net
import kat from '../../textures/kat.png'; // me!
import braid01_diffuse from '../../textures/braid01_diffuse.png';
import brown_eye from '../../textures/brown_eye.png';
import fedora_displacement from '../../textures/fedora_displacement.png';
import fedora_normal from '../../textures/fedora_normal.png';
import fedora_texture from '../../textures/fedora_texture.png';
import female_elegantsuit01_diffuse from '../../textures/female_elegantsuit01_diffuse.png';
import female_elegantsuit01_normal from '../../textures/female_elegantsuit01_normal.png';

import brick from '../../textures/brick.jpg'; // free from seier plus seier
import wood from '../../textures/wood.jpg'; // CC-BY from webtreats

import tex_bobbody from '../../textures/bobbody.png';
import tex_director from '../../textures/director.png';

import tex_cthulhu from '../../textures/cthulhu.png'; // by Amanda Jackson, CC-BY-NC-SA

let programs = {
        noshadowv,
        noshadowf,
        shadowv,
        shadowf,
        shadowgenv,
        shadowgenf
    },
    objModels = {
        vinski1,
        tunnel,
        player,
        bob,
        director,
        platform,
        cthulhu,
        handoferis,
        fnord,
        discoin,
        macaw,
        orb
    },
    textures = {
        grass,
        kat,
        braid01_diffuse,
        brown_eye,
        fedora_displacement,
        fedora_normal,
        fedora_texture,
        female_elegantsuit01_diffuse,
        female_elegantsuit01_normal,
        brick,
        wood,
        bobbody: tex_bobbody,
        director: tex_director,
        cthulhu: tex_cthulhu
    };


export default (gl, loading) => new Promise((res, rej) => {
    loading.remove();

    let objPrograms = {
        noshadow: compileProgram(gl, programs.noshadowv, programs.noshadowf)
        //shadow: compileProgram(r[2], r[3]),
        //shadowgen: compileProgram(r[4], r[5])
    };

    res([objPrograms, objModels, textures]);
});
