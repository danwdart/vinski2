import Buffers from './buffers';
import Camera from './camera';
import Events from './events';
import Gamepad from './gamepad';
import GlUtils from './gl-utils';
import GlData from './gl-data';
import Menu from './menu';
import Proj from './proj';
import SceneGraph from './scenegraph';
import World from './world';

import {vec3, mat4} from 'gl-matrix';

export default class Game {
    constructor(canvas, hud, debug, gl, models, textures, music, programs) {
        this.frames = 0;
        this.debug = debug;
        this.canvas = canvas;
        this.hud = hud;
        this.gl = gl;
        this.models = models;
        this.textures = textures;
        this.music = music;
        this.programs = programs;
        this.menu = new Menu(this);
    }

    start() {
        let gl = this.gl;

        this.animating = true;
        this.ms = performance.now();

        this.canvas.style.display = `block`;
        this.hud.style.display = `block`;

        let program = this.programs.noshadow,
            //shadowProgram = arrPrograms.shadow,
            //shadowGenProgram = arrPrograms.shadowgen;
            glData = new GlData(gl, program),
            pointLightPosition = vec3.fromValues(0, 10, 0),
            buffers = new Buffers(gl, glData, program);

        this.glUtil = new GlUtils(gl);

        this.glUtil.applySettings();

        gl.useProgram(program);

        let proj = new Proj(program, window.innerWidth / window.innerHeight),
            world = new World(program);

        this.camera = new Camera(program, glData, world, proj);
        this.sceneGraph = new SceneGraph(program, gl, glData, this.glUtil, buffers, this.camera, proj, this.textures);
        this.gamepad = new Gamepad(this.camera);
        this.events = new Events(gl, program, glData, this.loop, world, this.camera, this.canvas, proj, this.gamepad, this.menu);

        glData.enableLights(pointLightPosition);
        this.sceneGraph.addAllObjects(this.models);
        console.log(this.sceneGraph)

        let trans = mat4.create();
        mat4.translate(trans, trans, vec3.fromValues(5, 5, 1));

        this.events.resize();
        this.loop();
        setInterval(::this.countFrames, 1000);
    }

    loop() {
        this.glUtil.clear();
        //vec3.rotateY(pointLightPosition, pointLightPosition, vec3.fromValues(0, 2, 0), 0.01);
        //enableLights(program);
        this.camera.gravitateTo(0);
        this.sceneGraph.addResistances(this.camera);
        this.sceneGraph.draw();
        this.events.always();
        this.events.keycheck();
        this.gamepad.checkgamepad();
        this.frames++;
        if (this.animating) {
            requestAnimationFrame(::this.loop);
        }
    }

    countFrames() {
        let time = (performance.now() - this.ms)/1000;
        this.debug.innerHTML = Math.floor(this.frames / time) + ` FPS`;
        this.ms = performance.now();
        this.frames = 0;
    }
}
