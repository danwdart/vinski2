let runPrograms = (objPrograms, objModelArrays) => {
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

        console.log(objModels);

        resize(program);
        events(program);

        ready = true;
        loop = () => {

            clear();
            gl.useProgram(program);
            vec3.rotateY(pointLightPosition, pointLightPosition, vec3.fromValues(0, 2, 0), 0.01);

            mat4.rotate(
                objModels.bob['<BlenderRoot>'].mat4,
                objModels.bob['<BlenderRoot>'].mat4,
                T/128,
                vec3.fromValues(0, 1, 0)
            );

            mat4.rotate(
                objModels.director['<BlenderRoot>'].mat4,
                objModels.director['<BlenderRoot>'].mat4,
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

            keycheck();

            requestAnimationFrame(loop);
        };
        loop();
    }
