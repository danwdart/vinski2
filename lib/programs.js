let ms = performance.now(),
    frames = 0,
    startGame = (objPrograms, objModelArrays) => {
        canvas.style.display = 'block';
        hud.style.display = 'block';
        let program = objPrograms.noshadow;
            //shadowProgram = arrPrograms.shadow,
            //shadowGenProgram = arrPrograms.shadowgen;

        applySettings();
        gl.useProgram(program);
        camera = new Camera(program);

        proj = new Proj(program);
        world = new World(program);
        enableLights(program);

        let objModels = {},
            objMeshes = {};
        for (let name in objModelArrays) {
            objModels[name] = {};
            objMeshes[name] = {};
            addObjects(objModels[name], objMeshes[name], name, objModelArrays[name]);
        }

        let trans = mat4.create();
        mat4.translate(trans, trans, vec3.fromValues(5, 5, 1));

        objModels['Grid'] = {Grid: new Model('Grid', null, [0], trans)};
        objMeshes['Grid'] = [Mesh.createGrid('Grid', 5, 5)];

        resize(program);
        events(program);

        enableLights(program);

        let bobRot = vec3.fromValues(0, 1, 0),
            coinRot = vec3.fromValues(1, 0, 0);

        loop = () => {
            clear();

            //vec3.rotateY(pointLightPosition, pointLightPosition, vec3.fromValues(0, 2, 0), 0.01);

            mat4.rotate(
                objModels.bob['<BlenderRoot>'].mat4,
                objModels.bob['<BlenderRoot>'].mat4,
                T/128,
                bobRot
            );

            mat4.rotate(
                objModels.discoin['<BlenderRoot>'].mat4,
                objModels.discoin['<BlenderRoot>'].mat4,
                T/256,
                coinRot
            );

            mat4.translate(
                objModels.cthulhu['<BlenderRoot>'].mat4,
                objModels.cthulhu['<BlenderRoot>'].mat4,
                vec3.fromValues(0, 0.5 * Math.sin(performance.now() / 1000), 0)
            );

            //enableLights(program);

            camera.gravitateTo(0);

            for (let sceneName in objModels) {
                for (let modelName in objModels[sceneName]) {
                    objModels[sceneName][modelName].draw(objMeshes[sceneName], program);
                }
            }

            keycheck();
            checkgamepad();

            frames++;
            if (animating) requestAnimationFrame(loop);
        };
        loop();

        setInterval(() => {
            time = (performance.now() - ms)/1000;
            debug.innerHTML = Math.floor(frames / time) + ' FPS';
            ms = performance.now();
            frames = 0;
        }, 1000);
    }
