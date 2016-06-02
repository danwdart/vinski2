let runPrograms = (
        program,
        shadowProgram,
        shadowGenProgram,
        arrVinski1,
        arrTunnel,
        arrPlayer,
        arrBob,
        arrDirector
    ) => {
        let models = [];
        addObjects(models, 'vinski', arrVinski1);
        addObjects(models, 'tunnel', arrTunnel);
        addObjects(models, 'player', arrPlayer);
        addObjects(models, 'bob', arrBob);
        addObjects(models, 'director', arrDirector);
        applySettings();
        gl.useProgram(program);
        camera = new Camera(program);

        gl.useProgram(program);
        proj = new Proj(program);
        world = new World(program);
        enableLights(program);

        resize(program);
        events(program);

        ready = true;
        loop = () => {
            clear();
            gl.useProgram(program);
            vec3.rotateY(pointLightPosition, pointLightPosition, vec3.fromValues(0, 2, 0), 0.01);
            enableLights(program);

            camera.gravitateTo(0);

            for (let model of models) {
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
