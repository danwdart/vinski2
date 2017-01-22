const DS3 = {
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

export default class Gamepad
{
    constructor() {
        this.gamepad = null;
        this.gamepads = {};
    }

    pollGamepads() {
        let gotGamepads = navigator.getGamepads ?
            navigator.getGamepads() :
            (
                navigator.webkitGetGamepads ?
                navigator.webkitGetGamepads() :
                []
            );
        this.gamepads = {};
        for (let i in gotGamepads) {
            if (!gotGamepads.hasOwnProperty(i)) continue;
            if ('undefined' == typeof gotGamepads[i]) continue;
                this.addgamepad(gotGamepads[i]);
        }
    }

    addgamepad(gamepad) {
        this.gamepads[gamepad.index] = gamepad;
    }

    removegamepad(gamepad) {
        delete this.gamepads[gamepad.index];
    }

    checkgamepad() {
        // Axes: the name starts with the -1 and ends with the +1
        for (let i in this.gamepads) {

            //if (this.gamepads[i].id.includes(DS3.NAME)) {
                camera.moveBack(4 * this.gamepads[i].axes[DS3.AXES.LEFT.UD]);
                camera.strafeRight(4 * this.gamepads[i].axes[DS3.AXES.LEFT.LR]);
                camera.yawRight(20 * this.gamepads[i].axes[DS3.AXES.RIGHT.LR]);
                if (this.gamepads[i].buttons[DS3.BUTTONS.TRIANGLE].pressed) // could use value but not gonna
                    camera.jump();
            //}
        }
    }
};
