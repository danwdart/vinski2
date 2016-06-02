precision mediump float;

varying vec3 fragPosition;
varying vec2 fragTexCoord;
varying vec3 fragNormal;

uniform samplerCube lightShadowMap;
uniform vec2 shadowClipNearFar;

uniform vec3 pointLightPosition;
uniform vec4 meshColour;

void main()
{
    vec3 toLightNormal = normalize(pointLightPosition - fragPosition);

    float fromLightToFrag = (length(pointLightPosition - fragPosition) - shadowClipNearFar.x)
        /
        (shadowClipNearFar.y / shadowClipNearFar.x);

    float shadowMapValue = textureCube(lightShadowMap, -toLightNormal).r;

    float lightIntensity = 0.6;
    if ((shadowMapValue + 0.003) >= fromLightToFrag) {
        lightIntensity += 0.4 * max(dot(fragNormal, toLightNormal), 0.0);
    }

    gl_FragColor = vec4(meshColour.rgb * lightIntensity, meshColour.a);
}
