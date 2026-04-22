#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: snoise4 = require(glsl-noise/simplex/4d)
#pragma glslify: cnoise2 = require(glsl-noise/classic/2d)
#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)
#pragma glslify: cnoise4 = require(glsl-noise/classic/4d)
#pragma glslify: pnoise2 = require(glsl-noise/periodic/2d)
#pragma glslify: pnoise3 = require(glsl-noise/periodic/3d)
#pragma glslify: pnoise4 = require(glsl-noise/periodic/4d)


uniform float uTime;
varying vec2 vUv;

vec3 colorA = vec3(0.0745, 0.0588, 0.0863);
vec3 colorB = vec3(0.2353, 0.2118, 0.3451);

void main() {    
  float str = smoothstep(0.85, 0.9, sin(cnoise2(vUv * 7.0 + uTime * 0.1) * 20.0 + uTime * 0.5));

  vec3 colorC = vec3(vUv, 1.0);
  vec3 col = mix(colorA, colorB, str);
  vec3 col2 = mix(colorA, colorC, str);

  gl_FragColor = vec4(col, 1.0);

}
