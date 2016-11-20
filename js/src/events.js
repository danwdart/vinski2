const BUTTON_LEFT = 0,
      BUTTON_MIDDLE = 1,
      BUTTON_RIGHT = 2;

import Gamepad from './gamepad';
import toggleFullScreen from './togglefullscreen';
import refresh from './refresh';
      
export default class Events {
    constructor(gl, program, loop, world, camera, canvas, proj) {
        this.gl = gl;
        this.program = program;
        this.loop = loop;
        this.world = world;
        this.camera = camera;
        this.canvas = canvas;
        this.proj = proj;
        this.keys = new Set();
        window.addEventListener('keydown', keydown);
        window.addEventListener('keyup', keyup);
        window.addEventListener('keypress', keypress);
        window.addEventListener('resize', (ev) => resize(this.program));
        window.addEventListener('mousemove', mousemove);
        window.addEventListener('click', click);
        window.addEventListener('scroll', scroll);
        window.addEventListener('beforeunload', unload);
        window.addEventListener('unload', unload);
        window.addEventListener('gamepadconnected', gamepadconnected);
        window.addEventListener('gamepaddisconnected', gamepaddisconnected);

        setInterval(Gamepad.pollGamepads, 500);
    }
    
    unload(ev) {
        cancelAnimationFrame(this.loop);
        this.gl = null;
    }
    
    gamepadconnected(ev) {
        console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
            ev.gamepad.index, ev.gamepad.id,
            ev.gamepad.buttons.length, ev.gamepad.axes.length
        );
        Gamepad.addgamepad(ev.gamepad);
    }
    
    gamepaddisconnected(ev) {
        console.log("Gamepad disconnected from index %d: %s",
            ev.gamepad.index, ev.gamepad.id
        );
        Gamepad.removegamepad(ev.gamepad);
    }
    
    click(ev) {
        switch (ev.button) {
            case BUTTON_LEFT:
                // Shoot
                break;
            case BUTTON_MIDDLE:
                if (camera)
                    camera.thirdPerson = !camera.thirdPerson;
                break;
            case BUTTON_RIGHT:
                // Alternative shoot
        }
    }
    
    scroll(ev) {

    }
    
    static goFull(canvas) {
        canvas.requestPointerLock();
        toggleFullScreen();
    }
    
    resize(program) {
        let canvas = this.canvas;
        
        let h = window.innerHeight,
            w = window.innerWidth;
            
        canvas.height = h;
        canvas.width = w;
        canvas.style.height = h+'px';
        canvas.style.width = w + 'px';
        this.gl.viewport(0, 0, w, h);
        if (this.proj) {
            proj.apply();
            refresh(
                this.program,
                this.world.getMat4(),
                this.camera.getMat4(),
                this.proj.getMat4()
            );
        }
    }
    
    keydown(ev) {
        this.keys.add(ev.code.toLowerCase());
    }
    
    keyup(ev) {
        this.keys.delete(ev.code.toLowerCase());
    }
    
    keypress(ev) {
        if ('keyf' == ev.code.toLowerCase())
            Events.goFull(this.canvas);
        
        if ('escape' == ev.code.toLowerCase())
            pause();
    }
    
    keycheck() {
        let keys = this.keys,
            camera = this.camera;
        
        if (keys.has('shiftleft') || keys.has('shiftright'))
            camera.setFast();
        else
            camera.setSlow();

        if (keys.has('keyw') && !keys.has('keys'))
            camera.moveForward();
        if (keys.has('keys') && !keys.has('keyw'))
            camera.moveBack();
        if (keys.has('keya') && !keys.has('keyd'))
            camera.strafeLeft();
        if (keys.has('keyd') && !keys.has('keya'))
            camera.strafeRight();
        if (keys.has('arrowup') && !keys.has('arrowdown'))
            camera.pitchUp();
        if (keys.has('arrowdown') && !keys.has('arrowup'))
            camera.pitchDown();
        if (keys.has('arrowleft') && !keys.has('arrowright'))
            camera.yawLeft();
        if (keys.has('arrowright') && !keys.has('arrowleft'))
            camera.yawRight();
        if (keys.has('space'))
            camera.jump();
    }
    
    mousemove(ev) {
        ev.movementX = ev.movementX || ev.mozMovementX;
        ev.movementY = ev.movementY || ev.mozMovementY;
        this.camera.yawAndPitch(ev.movementX, ev.movementY);
    }
}