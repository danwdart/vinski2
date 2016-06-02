precision mediump float;

attribute vec3 vertPosition;
attribute vec2 vertTexCoord;
attribute vec3 vertNormal;

uniform mat4 mPos;
uniform mat4 mWorld;

varying vec2 fragTexCoord;
varying vec3 fragPosition;
varying vec3 fragNormal;

void main()
{
    fragTexCoord = vertTexCoord;
    fragPosition = (mWorld * vec4(vertPosition, 1.0)).xyz;
    fragNormal = (mWorld * vec4(vertNormal, 0.0)).xyz * vec3(1,1,-1);
    gl_Position = mPos * vec4(vertPosition, 1.0);
}
