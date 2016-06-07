let ms = performance.now(),
    frames = 0,
    runPrograms = (objPrograms, objModelArrays) => {
        let program = objPrograms.noshadow;
            //shadowProgram = arrPrograms.shadow,
            //shadowGenProgram = arrPrograms.shadowgen;

        applySettings();
        gl.useProgram(program);
        camera = new Camera(program);

        gl.useProgram(program);
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

        let meshPlane = Mesh.createGrid('Grid', 5, 5),
            meshes = [meshPlane],
            trans = mat4.create();

        mat4.translate(trans, trans, vec3.fromValues(5, 5, 1));

        let modelPlane = new Model('Grid', null, [0], trans);

        resize(program);
        events(program);

        loop = () => {

            clear();

            checkgamepad();

            gl.useProgram(program);
            vec3.rotateY(pointLightPosition, pointLightPosition, vec3.fromValues(0, 2, 0), 0.01);

            mat4.rotate(
                objModels.bob['<BlenderRoot>'].mat4,
                objModels.bob['<BlenderRoot>'].mat4,
                T/128,
                vec3.fromValues(0, 1, 0)
            );

            enableLights(program);

            camera.gravitateTo(0);

            for (let sceneName in objModels) {
                for (let modelName in objModels[sceneName]) {
                    let model = objModels[sceneName][modelName];
                    model.draw(objMeshes[sceneName], program);
                }
            }

            modelPlane.draw(meshes, program);

            keycheck();

            frames++;
            requestAnimationFrame(loop);
        };
        loop();

        setInterval(() => {
            time = (performance.now() - ms)/1000;
            debug.innerHTML = Math.floor(frames / time) + ' FPS';
            ms = performance.now();
            frames = 0;
        }, 1000);
    }
