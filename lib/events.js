const BUTTON_LEFT = 0,
      BUTTON_MIDDLE = 1,
      BUTTON_RIGHT = 2;

let events = (program) => {
        window.addEventListener('keydown', keydown);
        window.addEventListener('keyup', keyup);
        window.addEventListener('keypress', keypress);
        window.addEventListener('resize', (ev) => resize(program));
        window.addEventListener('mousemove', mousemove);
        window.addEventListener('click', click);
        window.addEventListener('scroll', scroll);
        window.addEventListener('beforeunload', unload);
        window.addEventListener('unload', unload);
        window.addEventListener('gamepadconnected', gamepadconnected);
        window.addEventListener('gamepaddisconnected', gamepaddisconnected);

        canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;


        setInterval(pollGamepads, 500);
    },
    unload = (ev) => {
        cancelAnimationFrame(loop);
        gl = null;
    },
    gamepadconnected = (ev) => {
        console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
            ev.gamepad.index, ev.gamepad.id,
            ev.gamepad.buttons.length, ev.gamepad.axes.length
        );
        addgamepad(ev.gamepad);
    },
    gamepaddisconnected = (ev) => {
        console.log("Gamepad disconnected from index %d: %s",
            ev.gamepad.index, ev.gamepad.id
        );
        removegamepad(ev.gamepad);
    },
    click = (ev) => {
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
    },
    scroll = (ev) => {

    },
    goFull = () => {
        if (canvas)
            canvas.requestPointerLock();
        toggleFullScreen();
    },
    resize = (program) => {
        h = window.innerHeight;
        w = window.innerWidth;
        canvas.height = h;
        canvas.width = w;
        canvas.style.height = h+'px';
        canvas.style.width = w + 'px';
        gl.viewport(0, 0, w, h);
        if (proj) {
            proj.aspect = w/h;
            proj.apply();
            refresh(
                program,
                world.getMat4(),
                camera.getMat4(),
                proj.getMat4()
            );
        }
    },
    keys = new Set(),
    keydown = (ev) => keys.add(ev.code.toLowerCase());
    keyup = (ev) => keys.delete(ev.code.toLowerCase()),
    keypress = (ev) => {
        if ('keyf' == ev.code.toLowerCase())
            goFull();
    },
    keycheck = () => {
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
    },
    mousemove = (ev) => {
        ev.movementX = ev.movementX || ev.mozMovementX;
        ev.movementY = ev.movementY || ev.mozMovementY;
        if (camera)
            camera.yawAndPitch(ev.movementX, ev.movementY);
    };
