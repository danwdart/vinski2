let runPrograms = (objPrograms, objModels) => {
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

        let arrModels = [];
        for (let name in objModels) {
            addObjects(arrModels, name, objModels[name]);
        }

        resize(program);
        events(program);

        ready = true;
        loop = () => {

            clear();
            gl.useProgram(program);
            vec3.rotateY(pointLightPosition, pointLightPosition, vec3.fromValues(0, 2, 0), 0.01);

            enableLights(program);

            camera.gravitateTo(0);

            for (let model of arrModels) {
                model.use(program);

                refresh(
                    program,
                    model.getMat4(),
                    camera.getMat4(),
                    proj.getMat4()
                );

                draw(model.getIndices());

                model.free();
                keycheck();
            }

            requestAnimationFrame(loop);
        };
        loop();
    }
