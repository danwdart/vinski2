let T = 2 * Math.PI,
    canvas = document.querySelector('canvas'),
    texSize = 512,
    h = null,
    w = null,
    gl = canvas.getContext('webgl'),
    loadAjax = (name) => new Promise((res, rej) => {
        let x = new XMLHttpRequest();
        x.open('GET', name, true);
        x.onreadystatechange = () => {
            if (4 == x.readyState) {
                if (200 !== x.status)
                    return rej('Error loading '+name);
                return res(x.responseText);
            }
        };
        x.send();
    }),
    pVertexText = loadAjax('noshadow.v.glsl'),
    pFragmentText = loadAjax('noshadow.f.glsl'),
    pShadowVertexText = loadAjax('shadow.v.glsl'),
    pShadowFragmentText = loadAjax('shadow.f.glsl'),
    pShadowGenVertexText = loadAjax('shadowgen.v.glsl'),
    pShadowGenFragmentText = loadAjax('shadowgen.f.glsl'),
    pVerticesText = loadAjax('vinski1.json'),
    clear = () => {
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    },
    draw = (arrIndices) => gl.drawElements(
        gl.TRIANGLES,
        arrIndices.length,
        gl.UNSIGNED_SHORT,
        0
    ),
    compileProgram = (vertexText, fragmentText) => {
        let vertexShader = gl.createShader(gl.VERTEX_SHADER),
            fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

        gl.shaderSource(vertexShader, vertexText);
        gl.shaderSource(fragmentShader, fragmentText);

        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            console.log(vertexText);
            console.log(gl.getShaderInfoLog(vertexShader));
            throw new Error('Error compiling vertex shader');
        }

        gl.compileShader(fragmentShader);
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            console.log(fragmentText);
            console.log(gl.getShaderInfoLog(fragmentShader));
            throw new Error('Error compiling fragment shader');
        }

        program = gl.createProgram();

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);

        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.log(gl.getProgramInfoLog(program));
            throw new Error('Error linking program');
        }

        gl.validateProgram(program);
        if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
            console.log(gl.getProgramInfoLog(program));
            throw new Error('Error validating program');
        }

        return program;
    },
    applySettings = () => {
        gl.enable(gl.DEPTH_TEST);
        //gl.enable(gl.CULL_FACE);
        //gl.cullFace(gl.BACK);
        gl.frontFace(gl.CCW);
    },
    enablePositionBuffer = (program, positionBuffer) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        let positionAttributeLocation = gl.getAttribLocation(program, 'vertPosition');
        gl.vertexAttribPointer(
            positionAttributeLocation,
            3, gl.FLOAT,
            gl.FALSE,
            3 * Float32Array.BYTES_PER_ELEMENT,
            0
        );

        gl.enableVertexAttribArray(positionAttributeLocation);
    },
    enableTexCoordBuffer = (program, texCoordBuffer) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        let texCoordAttributeLocation = gl.getAttribLocation(program, 'vertTexCoord');
        gl.vertexAttribPointer(
            texCoordAttributeLocation,
            2, gl.FLOAT,
            gl.FALSE,
            2 * Float32Array.BYTES_PER_ELEMENT,
            0
        );
        gl.enableVertexAttribArray(texCoordAttributeLocation);
    },
    enableNormalBuffer = (program, normalBuffer) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        let normalAttribLocation = gl.getAttribLocation(program, 'vertNormal');
        gl.vertexAttribPointer(
            normalAttribLocation,
            3, gl.FLOAT,
            gl.TRUE,
            3 * Float32Array.BYTES_PER_ELEMENT,
            0
        );
        gl.enableVertexAttribArray(normalAttribLocation);
    },
    enableIndexBuffer = (program, indexBuffer) => {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    },
    enableTexture = (texId) => {
        let tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            document.getElementById(texId)
        );
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return tex;
    },
    getUL = (program, name) => gl.getUniformLocation(program, name),
    setUM4fv = (program, name, value) => gl.uniformMatrix4fv(getUL(program, name), gl.FALSE, value),
    setU3f = (program, name, x, y, z) => gl.uniform3f(getUL(program, name), x, y, z),
    setU2fv = (program, name, value) => gl.uniform2fv(getUL(program, name), value),
    setU3fv = (program, name, value) => gl.uniform3fv(getUL(program, name), value),
    setU4fv = (program, name, value) => gl.uniform4fv(getUL(program, name), value),
    setU1i = (program, name, value) => gl.uniform1i(getUL(program, name), value),
    World = class World {
        constructor(program) {
            this.program = program;
            this.mWorld = mat4.create();
            mat4.identity(this.mWorld);
        }

        getMat4() {
            return this.mWorld;
        }
    },
    world,
    pointLightPosition = vec3.fromValues(0, 5, 5),
    enableLights = (program) => {
        //setU3f('ambientLightIntensity', 0.2, 0.2, 0.2);
        //setU3f('sun.direction', 3.0, 4.0, -2.0);
        //setU3f('sun.intensity', 0.9, 0.9, 0.9);
        setU3fv(program, 'pointLightPosition', pointLightPosition);
    },
    setColour = (program, colour) => {
        setU4fv(program, 'meshColour', colour);
    },
    useTexture = (tex) => {
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.activeTexture(gl.TEXTURE0);
    },
    Proj = class Proj {
        constructor(program, fov = T / 8, aspect = w / h, near = 0.1, far = 10000.0) {
            this.program = program;
            this.fov = fov;
            this.aspect = aspect;
            this.near = near;
            this.far = far;
            this.mProj = mat4.create();
            this.apply();
        }

        apply() {
            mat4.perspective(this.mProj, this.fov, this.aspect, this.near, this.far);
            if (world && camera)
                refresh(
                    this.program,
                    world.getMat4(),
                    camera.getMat4(),
                    this.mProj
                );
        }

        getMat4() {
            return this.mProj;
        }
    },
    proj,
    Camera = class Camera {
        constructor(program, position = [15, 0, 2], lookAt = [0, 0, 1], up = [-1, 0, 0]) {
            this.program = program;
            this.forward = vec3.create();
            this.up = vec3.create();
            this.right = vec3.create();

            this.position = vec3.fromValues(...position);

            this.mView = mat4.create();

            // get what I'm looking at from my perspective
            vec3.subtract(this.forward, vec3.fromValues(...lookAt), this.position);
            vec3.add(this.up, this.up, up);

            this.renorm();

            this.rotSpeed = 0.001;
            this.moveSpeed = 0.01;
            this.slowSpeed = 0.01;
            this.fastSpeed = 0.02;
        }

        setFast() {
            this.moveSpeed = this.fastSpeed;
        }

        setSlow() {
            this.moveSpeed = this.slowSpeed;
        }

        renorm() {
            vec3.cross(this.right, this.forward, this.up);
            vec3.cross(this.up, this.right, this.forward);

            vec3.normalize(this.forward, this.forward);
            vec3.normalize(this.right, this.right);
            vec3.normalize(this.up, this.up);
        }

        getMat4() {
            let lookAt = vec3.create();
            vec3.add(lookAt, this.position, this.forward);
            mat4.lookAt(this.mView, this.position, lookAt, this.up);
            return this.mView;
        }

        moveForward() {
            vec3.scaleAndAdd(this.position, this.position, this.forward, this.moveSpeed);
            this.apply();
        }

        moveBack() {
            vec3.scaleAndAdd(this.position, this.position, this.forward, -this.moveSpeed);
            this.apply();
        }

        strafeLeft() {
            vec3.scaleAndAdd(this.position, this.position, this.right, -this.moveSpeed);
            this.apply();
        }

        strafeRight() {
            vec3.scaleAndAdd(this.position, this.position, this.right, this.moveSpeed);
            this.apply();
        }

        yawLeft() {
            let mRight = mat4.create();
            mat4.rotate(mRight, mRight, this.rotSpeed, vec3.fromValues(0, 0, 1));
            vec3.transformMat4(this.forward, this.forward, mRight);
            this.renorm();
            this.apply();
        }

        yawRight() {
            let mRight = mat4.create();
            mat4.rotate(mRight, mRight, -this.rotSpeed, vec3.fromValues(0, 0, 1));
            vec3.transformMat4(this.forward, this.forward, mRight);
            this.renorm();
            this.apply();
        }

        pitchUp() {
            //let mUp = mat4.create();
            //mat4.rotate(mUp, mUp, -this.rotSpeed, vec3.fromValues(1, 0, 0));
            //vec3.transformMat4(this.forward, this.forward, mUp);
            this.renorm();
            this.apply();
        }

        pitchDown() {
            //let mUp = mat4.create();
            //mat4.rotate(mUp, mUp, this.rotSpeed, vec3.fromValues(1, 0, 0));
            //vec3.transformMat4(this.forward, this.forward, mUp);
            this.renorm();
            this.apply();
        }

        yawAndPitch(x, y) {
            let mRot = mat4.create();
            mat4.rotate(mRot, mRot, -this.rotSpeed * x, vec3.fromValues(0, 0, 1));
            //mat4.rotate(mRot, mRot, this.rotSpeed * y, vec3.fromValues(1, 0, 0));
            vec3.transformMat4(this.forward, this.forward, mRot);
            this.renorm();
            this.apply();
        }

        apply() {
            refresh(
                this.program,
                world.getMat4(),
                camera.getMat4(),
                proj.getMat4()
            );
        }
    },
    camera,
    ready,
    refresh = (program, mWorld, mView, mProj) => {
        //if (!ready) return;
        gl.useProgram(program);
        let mPos = mat4.create();
        mat4.identity(mPos);
        setUM4fv(program, 'mWorld', mWorld);
        //setUM4fv('mView', camera.getMat4());
        //setUM4fv('mProj', proj.getMat4());

        mat4.multiply(mPos, mWorld, mPos);
        mat4.multiply(mPos, mView, mPos);
        mat4.multiply(mPos, mProj, mPos);
        setUM4fv(program, 'mPos', mPos);

        return mPos;
    },
    Model = class Model {
        constructor(name, arrVertices, arrIndices, arrTexCoords, arrNormals, v4Trans, colour) {
            this.vertices = arrVertices;
            this.texCoords = arrTexCoords;
            this.indices = arrIndices;
            this.normals = arrNormals;
            this.v4Trans = v4Trans;
            this.colour = colour;

            //mat4.invert(this.v4Trans, this.v4Trans);

            //this.v4Trans = mat4.create();
            //mat4.translate(this.v4Trans, this.v4Trans, vec3.fromValues(Math.random() * 20, Math.random() * 20, Math.random() * 20));

            this.posVertexBuffer = gl.createBuffer();
            this.texCoordBuffer = gl.createBuffer();
            this.indexBuffer = gl.createBuffer();
            this.normalBuffer = gl.createBuffer();

            gl.bindBuffer(gl.ARRAY_BUFFER, this.posVertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrVertices), gl.STATIC_DRAW);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrTexCoords), gl.STATIC_DRAW);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(arrIndices), gl.STATIC_DRAW);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrNormals), gl.STATIC_DRAW);

            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        }

        use(program) {
            gl.useProgram(program);
            enablePositionBuffer(program, this.posVertexBuffer);
            enableIndexBuffer(program, this.indexBuffer);
            //enableTexCoordBuffer(program, this.texCoordBuffer);
            enableNormalBuffer(program, this.normalBuffer);
        }

        getVertices() {
            return this.vertices;
        }

        getIndices() {
            return this.indices;
        }

        getMat4() {
            return this.v4Trans;
        }

        getColour() {
            return this.colour;
        }
    },
    addChild = (models, arr, child) => {
        let trans = mat4.create(),
            colour = vec4.create();
        mat4.identity(trans);
        // sadly the original file's translations I didn't understand
        switch(child.name) {
            case 'Thingy':
                colour = vec4.fromValues(0.7, 0, 0.7, 1);
                break;
            case 'Floor':
                mat4.scale(trans, trans, mat3.fromValues(40, 40, 0));
                colour = vec4.fromValues(0.6, 0.6, 0.6, 1);
                break;
            case 'Trunk':
                mat4.translate(trans, trans, mat3.fromValues(3, 5, 0));
                colour = vec4.fromValues(0.5, 0.5, 0.1, 1);
                break;
            case 'Trunk.001':
                mat4.translate(trans, trans, mat3.fromValues(3, -5, 0));
                colour = vec4.fromValues(0.5, 0.5, 0.1, 1);
                break;
            case 'Trunk.002':
                mat4.translate(trans, trans, mat3.fromValues(-6, 5, 0));
                colour = vec4.fromValues(0.5, 0.5, 0.1, 1);
                break;
            case 'Trunk.003':
                mat4.translate(trans, trans, mat3.fromValues(-6, -5, 0));
                colour = vec4.fromValues(0.5, 0.5, 0.1, 1);
                break;
            case 'Tree':
                mat4.scale(trans, trans, mat3.fromValues(3, 3, 3));
                mat4.translate(trans, trans, mat3.fromValues(2/3, 5/3, 8/3));
                colour = vec4.fromValues(0, 0.5, 0, 1);
                break;
            case 'Tree.001':
                mat4.scale(trans, trans, mat3.fromValues(2.5, 2.5, 2.5));
                mat4.translate(trans, trans, mat3.fromValues(3/3, -5/3, 8/3));
                colour = vec4.fromValues(0, 0.5, 0, 1);
                break;
            case 'Tree.002':
                mat4.scale(trans, trans, mat3.fromValues(2.5, 2.5, 2.5));
                mat4.translate(trans, trans, mat3.fromValues(-6/3, 5/3, 8/3));
                colour = vec4.fromValues(0, 0.5, 0, 1);
                break;
            case 'Tree.003':
                mat4.scale(trans, trans, mat3.fromValues(2.5, 2.5, 2.5));
                mat4.translate(trans, trans, mat3.fromValues(-6/3, -5/3, 8/3));
                colour = vec4.fromValues(0, 0.5, 0, 1);
                break;
            default:
        }

        if ('undefined' !== typeof child.meshes) {
            for (let meshId of child.meshes) {
                let mesh = arr.meshes[meshId];

                let model = new Model(
                    child.name,
                    mesh.vertices,
                    [].concat.apply([], mesh.faces),
                    mesh.texturecoords[0],
                    mesh.normals,
                    trans,
                    colour
                );
                models.push(model);
            }
        }

        if ('undefined' !== typeof child.children) {
            for (let child2 of child.children) {
                addChild(models, arr, child2);
            }
        }
    }
    addObjects = (arr) => {
        let models = [];
        console.log(arr)
        for (let child of arr.rootnode.children) {
            addChild(models, arr, child);
        }
        return models;
    },
    createPrograms = (
        vertexText,
        fragmentText,
        shadowVertexText,
        shadowFragmentText,
        shadowGenVertexText,
        shadowGenFragmentText,
        verticesText
    ) => {
        let arr = JSON.parse(verticesText),
            program = compileProgram(vertexText, fragmentText);
            //tex = enableTexture('texture');

        let models = addObjects(arr);
        applySettings();
        gl.useProgram(program);
        camera = new Camera(program);

        gl.useProgram(program);
        proj = new Proj(program);
        world = new World(program);
        enableLights(program);


        ready = true;
        loop = () => {
            clear();
            gl.useProgram(program);
            //useTexture(tex);
            for (let model of models) {
                model.use(program, false);
                setColour(program, model.getColour());
                refresh(
                    program,
                    model.getMat4(),
                    camera.getMat4(),
                    proj.getMat4()
                );

                draw(model.getIndices());
                keycheck();
            }

            requestAnimationFrame(loop);
        };
        loop();
    },
    load = () => {
        Promise.all([
            pVertexText,
            pFragmentText,
            pShadowVertexText,
            pShadowFragmentText,
            pShadowGenVertexText,
            pShadowGenFragmentText,
            pVerticesText
        ]).then((r) => createPrograms(...r)).catch((err) => console.log(err));

        resize();
        events();
    },
    events = () => {
        window.addEventListener('keydown', keydown);
        window.addEventListener('keyup', keyup);
        window.addEventListener('keypress', keypress);
        window.addEventListener('resize', resize);
        canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
        window.addEventListener('mousemove', mousemove);
    },
    goFull = () => {
        if (canvas)
            canvas.requestPointerLock();
        toggleFullScreen();
    },
    resize = () => {
        h = window.innerHeight;
        w = window.innerWidth;
        canvas.height = h;
        canvas.width = w;
        canvas.style.height = h+'px';
        canvas.style.width = w + 'px';
        gl.viewport(0, 0, w, h);
        if (proj) {
            proj.aspect = w/h;
            proj.apply();
        }
    },
    toggleFullScreen = () => {
        if (!document.fullscreenElement &&    // alternative standard method
            !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement )
        {  // current working methods
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    },
    keys = new Set(),
    keydown = (ev) => keys.add(ev.key.toLowerCase()),
    keyup = (ev) => keys.delete(ev.key.toLowerCase()),
    keypress = (ev) => {
        if ('f' == ev.key.toLowerCase())
            goFull();
    },
    keycheck = () => {
        if (keys.has('shift'))
            camera.setFast();
        else
            camera.setSlow();

        if (keys.has('w') && !keys.has('s'))
            camera.moveForward();
        if (keys.has('s') && !keys.has('w'))
            camera.moveBack();
        if (keys.has('a') && !keys.has('d'))
            camera.strafeLeft();
        if (keys.has('d') && !keys.has('a'))
            camera.strafeRight();
        if (keys.has('arrowup') && !keys.has('arrowdown'))
            camera.pitchUp();
        if (keys.has('arrowdown') && !keys.has('arrowup'))
            camera.pitchDown();
        if (keys.has('arrowleft') && !keys.has('arrowright'))
            camera.yawLeft();
        if (keys.has('arrowright') && !keys.has('arrowleft'))
            camera.yawRight();
    };
    mousemove = (ev) => {
        ev.movementX = ev.movementX || ev.mozMovementX;
        ev.movementY = ev.movementY || ev.mozMovementY;
        if (camera)
            camera.yawAndPitch(ev.movementX, ev.movementY);
    }

load();
