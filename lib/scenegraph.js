let addChild = (models, arr, child, mParent) => {
        if (!mParent) {
            mParent = mat4.create();
            mat4.identity(mParent);
        }

        let trans = mat4.create(),
            colour = vec4.create(),
            texture = null,
            enabled = true,
            myTrans = mat4.fromValues(...child.transformation);

        // fuck
        mat4.transpose(myTrans, myTrans);

        //colour = vec4.fromValues(Math.random(), Math.random(), Math.random(), Math.random());

        mat4.mul(trans, mParent, myTrans);

        if ('undefined' !== typeof child.meshes) {
            for (let meshId of child.meshes) {
                let mesh = arr.meshes[meshId],
                    materialProperties = arr.materials[mesh.materialindex].properties;

                for (let property of materialProperties) {
                    switch (property.key) {
                        case '$clr.diffuse':
                            vec4.add(colour, colour, vec4.fromValues(...property.value, 1.0));
                            break;
                        case '$clr.ambient':
                            //vec4.add(colour, colour, vec4.fromValues(...property.value, 1.0));
                            break;
                        case '$clr.specular':
                            //vec4.add(colour, colour, vec4.fromValues(...property.value, 1.0));
                            break;

                        case '$tex.file':
                            texture = property.value;
                            break;
                        default:
                    }
                }

                if (!enabled) continue;
                let model = new Model(
                    child.name,
                    mesh.vertices,
                    [].concat.apply([], mesh.faces),
                    mesh.texturecoords?mesh.texturecoords[0]:[],
                    mesh.normals,
                    trans,
                    colour,
                    texture
                );
                models.push(model);
            }
        }

        if ('undefined' !== typeof child.children) {
            for (let child2 of child.children) {
                addChild(models, arr, child2, trans);
            }
        }
    },
    addObjects = (models, name, arr) => {
        console.log(arr);
        let trans = mat4.create();
        mat4.identity(trans);
        switch (name) {
            case 'vinski':
                // Leave it alone
                break;
            case 'tunnel':
                mat4.rotate(trans, trans, T/4, vec3.fromValues(1, 0, 0));
                mat4.rotate(trans, trans, 3*T/4, vec3.fromValues(0, 1, 0));
                mat4.translate(trans, trans, vec3.fromValues(0, 5, 20));
                break;
            case 'player':
                mat4.translate(trans, trans, vec3.fromValues(6, 0, 0));
                mat4.scale(trans, trans, vec3.fromValues(0.12, 0.12, 0.12));
                mat4.rotate(trans, trans, T/4, vec3.fromValues(1, 0, 0));
                mat4.rotate(trans, trans, T/4, vec3.fromValues(0, 1, 0));
                break;
            case 'bob':
                mat4.translate(trans, trans, vec3.fromValues(-5, -6, 2.5));
                mat4.scale(trans, trans, vec3.fromValues(25, 25, 25));
                mat4.rotate(trans, trans, T/4, vec3.fromValues(1, 0, 0));
                mat4.rotate(trans, trans, T/4, vec3.fromValues(0, 1, 0));
                break;
            case 'director':
                mat4.translate(trans, trans, vec3.fromValues(-5, -12, 1.5));
                mat4.scale(trans, trans, vec3.fromValues(25, 25, 25));
                mat4.rotate(trans, trans, T/4, vec3.fromValues(1, 0, 0));
                mat4.rotate(trans, trans, T/4, vec3.fromValues(0, 1, 0));
                break;
            default:
                console.log('Dunno where to put', name);
        }

        addChild(models, arr, arr.rootnode, trans);
        return models;
    };
