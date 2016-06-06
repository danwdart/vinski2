let checkgamepad = () => {
    // 0: Left, -1 = left, 1 = right
    // 1: Left, -1 = up, 1 = down
    // 2: Right, -1 = left, 1 = right
    // 3: Right, -1 = up, 1 = down

    for (let i in gamepads) {
        let gamepad = gamepads[i];

        camera.moveBack(4 * gamepad.axes[1]);
        camera.strafeRight(4 * gamepad.axes[0]);
        camera.yawRight(20 * gamepad.axes[2]);
    }
};
