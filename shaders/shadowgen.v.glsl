precision mediump float;

attribute vec3 vertPosition;

uniform mat4 mPos;
uniform mat4 mWorld;

varying vec3 fragPosition;

void main()
{
    fragPosition = (mWorld * vec4(vertPosition, 1.0)).xyz;
    gl_Position = mPos * vec4(vertPosition, 1.0);
}
