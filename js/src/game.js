import GlUtils from './gl-utils';
import GlData from './gl-data';
import Camera from './camera';
import Proj from './proj';
import World from './world';
import SceneGraph from './scenegraph';
import Events from './events';
import Gamepad from './gamepad';
import {vec3, mat4} from 'gl-matrix';

export default class Game {
    constructor(canvas, hud, debug, gl, objPrograms, objModelArrays) {
        this.animating = true;
        this.ms = performance.now(),
        this.frames = 0;
        this.debug = debug;

        canvas.style.display = 'block';
        hud.style.display = 'block';

        let program = objPrograms.noshadow,
            //shadowProgram = arrPrograms.shadow,
            //shadowGenProgram = arrPrograms.shadowgen;
            glData = new GlData(gl, program),
            pointLightPosition = vec3.fromValues(0, 10, 0);

        this.glUtil = new GlUtils(gl);

        this.glUtil.applySettings();

        gl.useProgram(program);

        let proj = new Proj(program, window.innerWidth / window.innerHeight),
            world = new World(program);

        this.camera = new Camera(program, glData, world, proj);
        this.sceneGraph = new SceneGraph(program, glData);
        this.events = new Events(gl, program, glData, this.loop, world, this.camera, canvas, proj);

        glData.enableLights(pointLightPosition);

        this.sceneGraph.addAllObjects(objModelArrays);

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

        this.sceneGraph.draw();

        this.events.keycheck();
        Gamepad.checkgamepad();

        this.frames++;
        if (this.animating) requestAnimationFrame(::this.loop);
    }

    countFrames() {
        let time = (performance.now() - this.ms)/1000;
        this.debug.innerHTML = Math.floor(this.frames / time) + ' FPS';
        this.ms = performance.now();
        this.frames = 0;
    }
}
