const BUTTON_LEFT = 0,
    BUTTON_MIDDLE = 1,
    BUTTON_RIGHT = 2;

import toggleFullScreen from './togglefullscreen';
import refresh from './refresh';

export default class Events {
    constructor(gl, program, gldata, loop, world, camera, canvas, proj, gamepad, menu) {
        this.gl = gl;
        this.program = program;
        this.gldata = gldata;
        this.loop = loop;
        this.world = world;
        this.camera = camera;
        this.canvas = canvas;
        this.proj = proj;
        this.gamepad = gamepad;
        this.menu = menu;
        this.keys = new Set();
        window.addEventListener(`keydown`, ::this.keydown);
        window.addEventListener(`keyup`, ::this.keyup);
        window.addEventListener(`keypress`, ::this.keypress);
        window.addEventListener(`resize`, ::this.resize);
        window.addEventListener(`mousemove`, ::this.mousemove);
        window.addEventListener(`contextmenu`, ::this.click);
        window.addEventListener(`click`, ::this.click);
        window.addEventListener(`mousedown`, ::this.mousedown);
        window.addEventListener(`mouseup`, ::this.mouseup);
        window.addEventListener(`scroll`, ::this.scroll);
        window.addEventListener(`beforeunload`, ::this.unload);
        window.addEventListener(`unload`, ::this.unload);
        window.addEventListener(`gamepadconnected`, ::this.gamepadconnected);
        window.addEventListener(`gamepaddisconnected`, ::this.gamepaddisconnected);

        setInterval(::gamepad.pollGamepads, 500);
    }

    unload() {
        cancelAnimationFrame(this.loop);
        this.gl = null;
    }

    gamepadconnected(ev) {
        console.log(`Gamepad connected at index %d: %s. %d buttons, %d axes.`,
            ev.gamepad.index, ev.gamepad.id,
            ev.gamepad.buttons.length, ev.gamepad.axes.length
        );
        this.gamepad.addgamepad(ev.gamepad);
    }

    gamepaddisconnected(ev) {
        console.log(`Gamepad disconnected from index %d: %s`,
            ev.gamepad.index, ev.gamepad.id
        );
        this.gamepad.removegamepad(ev.gamepad);
    }

    mousedown() {
    }

    mouseup() {
    }

    always() {
    }

    click(ev) {
        ev.preventDefault();
        
        switch (ev.button) {
        case BUTTON_LEFT:
            break;
        case BUTTON_MIDDLE:
            if (this.camera)
                this.camera.thirdPerson = !this.camera.thirdPerson;
            break;
        case BUTTON_RIGHT:
            if (this.camera)
                this.camera.rotateQuarter();
            break;
        }
    }

    scroll() {
    }

    static goFull(canvas) {
        canvas.requestPointerLock();
        toggleFullScreen();
    }

    resize() {
        let canvas = this.canvas;

        let h = window.innerHeight,
            w = window.innerWidth;

        canvas.height = h;
        canvas.width = w;
        canvas.style.height = h+`px`;
        canvas.style.width = w + `px`;
        this.gl.viewport(0, 0, w, h);
        if (this.proj) {
            this.proj.apply();
            refresh(
                this.gldata,
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
        if (`keyf` == ev.code.toLowerCase())
            Events.goFull(this.canvas);

        if (`escape` == ev.code.toLowerCase())
            this.menu.pause();
    }

    keycheck() {
        let keys = this.keys,
            camera = this.camera;

        if (keys.has(`shiftleft`) || keys.has(`shiftright`))
            camera.setFast();
        else
            camera.setSlow();

        if (keys.has(`keyw`) && !keys.has(`keys`))
            camera.moveForward();
        if (keys.has(`keys`) && !keys.has(`keyw`))
            camera.moveBack();
        if (keys.has(`keya`) && !keys.has(`keyd`))
            camera.strafeLeft();
        if (keys.has(`keyd`) && !keys.has(`keya`))
            camera.strafeRight();
        if (keys.has(`arrowup`) && !keys.has(`arrowdown`))
            camera.pitchUp();
        if (keys.has(`arrowdown`) && !keys.has(`arrowup`))
            camera.pitchDown();
        if (keys.has(`arrowleft`) && !keys.has(`arrowright`))
            camera.yawLeft();
        if (keys.has(`arrowright`) && !keys.has(`arrowleft`))
            camera.yawRight();
        if (keys.has(`space`))
            camera.jump();
    }

    mousemove(ev) {
        let movementX = ev.movementX || ev.mozMovementX,
            movementY = ev.movementY || ev.mozMovementY;

        this.camera.yawAndPitch(movementX || 0,  movementY || 0);
    }
}
