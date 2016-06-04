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
                objModels.bob['<BlenderRoot>'].objModels.Body.mat4,
                objModels.bob['<BlenderRoot>'].objModels.Body.mat4,
                T/128,
                vec3.fromValues(0, 1, 0)
            );

            mat4.rotate(
                objModels.director['<BlenderRoot>'].objModels.Director.objModels.Body.mat4,
                objModels.director['<BlenderRoot>'].objModels.Director.objModels.Body.mat4,
                T/128,
                vec3.fromValues(0, 1, 0)
            );

            mat4.rotate(
                objModels.vinski1['<BlenderRoot>'].objModels.Trunk.objModels.Tree.mat4,
                objModels.vinski1['<BlenderRoot>'].objModels.Trunk.objModels.Tree.mat4,
                T/128,
                vec3.fromValues(0, 0, 1)
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
