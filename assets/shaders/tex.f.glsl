precision mediump float;

struct DirectionalLight
{
    vec3 direction;
    vec3 intensity;
};

varying vec3 fragPosition;
varying vec2 fragTexCoord;
varying vec3 fragNormal;

uniform vec3 ambientLightIntensity;
uniform DirectionalLight sun;
uniform vec3 sunlightDirection;

uniform sampler2D sampler;

void main()
{
    vec4 texel = texture2D(sampler, fragTexCoord);

    gl_FragColor = vec4(
        texel.rgb * (
            ambientLightIntensity + (
                sun.intensity * max(
                    dot(
                        normalize(fragNormal), normalize(sun.direction)
                    ),
                    0.0
                )
            )
        ),
        texel.a
    );
}
