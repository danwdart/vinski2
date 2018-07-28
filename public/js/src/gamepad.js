const CONTROLLER_CONFIG = {
    'Sony PLAYSTATION(R)3 Controller': {
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
            LTRIGGER2: 8,
            RTRIGGER2: 9,
            LTRIGGER1: 10,
            RTRIGGER1: 11,
            JUMP: 12,
            BACK: 13,
            SELECT: 14,
            SECONDARYSELECT: 15,
            HOME: 16
        }
    }
};

export default class Gamepad
{
    constructor(camera) {
        this.gamepad = null;
        this.gamepads = {};
        this.camera = camera;
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
            if (!gotGamepads.hasOwnProperty(i) ||
                `undefined` == typeof gotGamepads[i] ||
                null === gotGamepads[i]) {
                continue;
            }
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

            let controller;

            if (controller = CONTROLLER_CONFIG[this.gamepads[i].id]) {
                this.camera.moveBack(4 * this.gamepads[i].axes[controller.AXES.LEFT.UD]);
                this.camera.strafeRight(4 * this.gamepads[i].axes[controller.AXES.LEFT.LR]);
                this.camera.yawRight(20 * this.gamepads[i].axes[controller.AXES.RIGHT.LR]);
                if (this.gamepads[i].buttons[controller.BUTTONS.JUMP].pressed)
                    this.camera.jump();
            } else {
                //console.debug(`Unsupported gamepad: gamepad control = `, this.gamepads[i])
            }

        }
    }
}
