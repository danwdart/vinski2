let createShadowTexture = () => {
        let shadowMapCube = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, shadowMapCube);

        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);

        for (let i = 0; i < 6; i++) {
            gl.texImage2D(
                gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,
                0, gl.RGBA,
                texSize, texSize,
                0, gl.RGBA,
                gl.UNSIGNED_BYTE, null
            );
        }

        let shadowMapFrameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, shadowMapFrameBuffer);

        let shadowMapRenderBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, shadowMapRenderBuffer);

        gl.renderbufferStorage(
            gl.RENDERBUFFER,
            gl.DEPTH_COMPONENT16,
            texSize,
            texSize
        );

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        return [
            shadowMapCube,
            shadowMapFrameBuffer,
            shadowMapRenderBuffer
        ];
    },
    generateShadowMap = (
        shadowMapGenProgram,
        shadowMapCube,
        shadowMapFrameBuffer,
        shadowMapRenderBuffer,
        shadowMapCameras,
        objModels,
        objMeshes
    ) => {
        gl.useProgram(shadowMapGenProgram);

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, shadowMapCube);
        gl.bindFramebuffer(gl.FRAMEBUFFER, shadowMapFrameBuffer);
        gl.bindRenderbuffer(gl.RENDERBUFFER, shadowMapRenderBuffer);

        gl.viewport(0, 0, texSize, texSize);
        applySettings();

        setU2fv(shadowMapGenProgram, 'shadowClipNearFar', shadowClipNearFar);
        setU3fv(shadowMapGenProgram, 'pointLightPosition', pointLightPosition);

        let shadowMapProj = new Proj(
            T/4,
            1.0,
            shadowClipNearFar[0],
            shadowClipNearFar[1]
        );

        for (let i = 0; i < shadowMapCameras.length; i++) {

            gl.framebufferTexture2D(
                gl.FRAMEBUFFER,
                gl.COLOR_ATTACHMENT0,
                gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,
                shadowMapCube,
                0
            );
            gl.framebufferRenderbuffer(
                gl.FRAMEBUFFER,
                gl.DEPTH_ATTACHMENT,
                gl.RENDERBUFFER,
                shadowMapRenderBuffer
            );
            gl.clearColor(1, 1, 1, 1);
            clear();

            for (let sceneName in objModels) {
                for (let modelName in objModels[sceneName]) {
                    let model = objModels[sceneName][modelName];
                    model.draw(
                        objMeshes[sceneName],
                        shadowMapGenProgram,
                        shadowMapCameras[i],
                        shadowMapProj,
                        true
                    );
                }
            }
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    },
    createShadowMapCameras = () => [
        new Camera(
            pointLightPosition,
            vec3.add(vec3.create(), pointLightPosition, vec3.fromValues(1, 0, 0)),
            vec3.fromValues(0, -1, 0)
        ),
        new Camera(
            pointLightPosition,
            vec3.add(vec3.create(), pointLightPosition, vec3.fromValues(-1, 0, 0)),
            vec3.fromValues(0, -1, 0)
        ),
        new Camera(
            pointLightPosition,
            vec3.add(vec3.create(), pointLightPosition, vec3.fromValues(0, 1, 0)),
            vec3.fromValues(0, 0, 1)
        ),
        new Camera(
            pointLightPosition,
            vec3.add(vec3.create(), pointLightPosition, vec3.fromValues(0, -1, 0)),
            vec3.fromValues(0, 0, -1)
        ),
        new Camera(
            pointLightPosition,
            vec3.add(vec3.create(), pointLightPosition, vec3.fromValues(0, 0, 1)),
            vec3.fromValues(0, -1, 0)
        ),
        new Camera(
            pointLightPosition,
            vec3.add(vec3.create(), pointLightPosition, vec3.fromValues(0, 0, -1)),
            vec3.fromValues(0, -1, 0)
        )
    ],
    useShadowMap = (shadowMapCube) => {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, shadowMapCube);
    };
