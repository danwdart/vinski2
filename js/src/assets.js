import compileProgram from './compile';

import noshadowv from '../../assets/shaders/noshadow.v.glsl';
import noshadowf from '../../assets/shaders/noshadow.f.glsl';
import shadowv from '../../assets/shaders/shadow.v.glsl';
import shadowf from '../../assets/shaders/shadow.f.glsl';
import shadowgenv from '../../assets/shaders/shadowgen.v.glsl';
import shadowgenf from '../../assets/shaders/shadowgen.f.glsl';

//import level1 from '../../assets/models/level1.json';
//import tunnel from '../../assets/models/tunnel.json';
//import player from '../../assets/models/sandra.json';
//import bob from '../../assets/models/bob2.json';
//import director from '../../assets/models/director2.json';
//import platform from '../../assets/models/platform.json';
//import cthulhu from '../../assets/models/cthulhu.json'; // by Amanda Jackson, CC-BY-NC-SA
//import handoferis from '../../assets/models/handoferis.json'; // by Archindividual, CC-BY-SA
//import fnord from '../../assets/models/fnord.json'; // by Archindividual, CC-BY-SA
//import discoin from '../../assets/models/discoin.json'; // by scvalex, CC-BY-SA
//import macaw from '../../assets/models/macaw.json'; // by doudoulolita, CC-BY-SA
//import orb from '../../assets/models/orb.json'; // by Hannah, unlicenced

import levelone from '../../assets/blender/level1-bounding-embedded.json';

//import grass from '../../assets/textures/grass.jpg';
// free from seier plus seier
//import brick from '../../assets/textures/brick.jpg';
// CC-BY from webtreats
//import wood from '../../assets/textures/wood.jpg';

//import bobbody from '../../assets/textures/bobbody.png';
//import director from '../../assets/textures/director.png';

/* The Sigh by thanvannispen (c) 2007
Licensed under a Creative Commons Sampling Plus license.
http://dig.ccmixter.org/files/thanvannispen/10499
*/
import thesigh from '../../assets/music/thesigh.mp3';

const objPrograms = {
    noshadowv,
    noshadowf,
    shadowv,
    shadowf,
    shadowgenv,
    shadowgenf
};

export const models = {
    levelone
};

export const music = {
    thesigh
};

export const programs = (gl) => ({
    noshadow: compileProgram(gl, objPrograms.noshadowv, objPrograms.noshadowf)
    //shadow: compileProgram(r[2], r[3]),
    //shadowgen: compileProgram(r[4], r[5])
});
