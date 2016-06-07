precision mediump float;

uniform vec3 pointLightPosition;
uniform vec2 shadowClipNearFar;

varying vec3 fragPosition;

void main()
{
    vec3 fromLightToFrag = fragPosition - pointLightPosition;
    float lightFragDist = (
        (length(fromLightToFrag) / 500.0)
    );
    gl_FragColor = vec4(lightFragDist, lightFragDist, lightFragDist, 1.0);
}
