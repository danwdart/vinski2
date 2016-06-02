let events = (program) => {
        window.addEventListener('keydown', keydown);
        window.addEventListener('keyup', keyup);
        window.addEventListener('keypress', keypress);
        window.addEventListener('resize', (ev) => resize(program));
        canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
        window.addEventListener('mousemove', mousemove);
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
    keydown = (ev) => keys.add(ev.key.toLowerCase()),
    keyup = (ev) => keys.delete(ev.key.toLowerCase()),
    keypress = (ev) => {
        if ('f' == ev.key.toLowerCase())
            goFull();
    },
    keycheck = () => {
        if (keys.has('shift'))
            camera.setFast();
        else
            camera.setSlow();

        if (keys.has('w') && !keys.has('s'))
            camera.moveForward();
        if (keys.has('s') && !keys.has('w'))
            camera.moveBack();
        if (keys.has('a') && !keys.has('d'))
            camera.strafeLeft();
        if (keys.has('d') && !keys.has('a'))
            camera.strafeRight();
        if (keys.has('arrowup') && !keys.has('arrowdown'))
            camera.pitchUp();
        if (keys.has('arrowdown') && !keys.has('arrowup'))
            camera.pitchDown();
        if (keys.has('arrowleft') && !keys.has('arrowright'))
            camera.yawLeft();
        if (keys.has('arrowright') && !keys.has('arrowleft'))
            camera.yawRight();
        if (keys.has(' '))
            camera.jump();
    },
    mousemove = (ev) => {
        ev.movementX = ev.movementX || ev.mozMovementX;
        ev.movementY = ev.movementY || ev.mozMovementY;
        if (camera)
            camera.yawAndPitch(ev.movementX, ev.movementY);
    };
