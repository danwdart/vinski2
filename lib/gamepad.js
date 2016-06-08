let gamepad = null,
    gamepads = {};
const SIXAXIS = {
        NAME: 'Sony PLAYSTATION(R)3 Controller',
        AXES: {
            LEFT: {
                LR: 0,
                UD: 1
            },
            RIGHT: {
                LR: 2,
                UD: 3
            }
        },
        BUTTONS: {
            SELECT: 0,
            LEFTSTICK: 1,
            RIGHTSTICK: 2,
            START: 3,
            ARROWUP: 4,
            ARROWRIGHT: 5,
            ARROWDOWN: 6,
            ARROWLEFT: 7,
            L2: 8,
            R2: 9,
            L1: 10,
            R1: 11,
            TRIANGLE: 12,
            CIRCLE: 13,
            CROSS: 14,
            SQUARE: 15,
            PS: 16
        }
    };

let pollGamepads = () => {
        let gotGamepads = navigator.getGamepads ?
            navigator.getGamepads() :
            (
                navigator.webkitGetGamepads ?
                navigator.webkitGetGamepads() :
                []
            );
        gamepads = {};
        for (let i in gotGamepads) {
            if (!gotGamepads.hasOwnProperty(i)) continue;
            if ('undefined' == typeof gotGamepads[i]) continue;
                addgamepad(gotGamepads[i]);
        }
    },
    addgamepad = (gamepad) => {
        gamepads[gamepad.index] = gamepad;
    },
    removegamepad = (gamepad) => {
        delete gamepads[gamepad.index];
    },
    checkgamepad = () => {
        // Axes: the name starts with the -1 and ends with the +1
        for (let i in gamepads) {

            if (gamepads[i].id.includes(SIXAXIS.NAME)) {
                camera.moveBack(4 * gamepads[i].axes[SIXAXIS.AXES.LEFT.UD]);
                camera.strafeRight(4 * gamepads[i].axes[SIXAXIS.AXES.LEFT.LR]);
                camera.yawRight(20 * gamepads[i].axes[SIXAXIS.AXES.RIGHT.LR]);
                if (gamepads[i].buttons[SIXAXIS.BUTTONS.TRIANGLE].pressed) // could use value but not gonna
                    camera.jump();
            }
        }
    };
