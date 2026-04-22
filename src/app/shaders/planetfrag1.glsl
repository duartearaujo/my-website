precision highp float;
varying vec3 vPosition;
uniform float time;
uniform float density;

float hash3(vec3 p) {
  p = fract(p * vec3(127.1, 311.7, 74.7));
  p += dot(p, p.yxz + 19.19);
  return fract(p.x * p.y * p.z);
}

float noise3(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(
      mix(hash3(i+vec3(0,0,0)), hash3(i+vec3(1,0,0)), u.x),
      mix(hash3(i+vec3(0,1,0)), hash3(i+vec3(1,1,0)), u.x), u.y),
    mix(
      mix(hash3(i+vec3(0,0,1)), hash3(i+vec3(1,0,1)), u.x),
      mix(hash3(i+vec3(0,1,1)), hash3(i+vec3(1,1,1)), u.x), u.y),
    u.z
  );
}

void main() {
  vec3 pos = normalize(vPosition);
  float scale = 17.0;

  float n1 = noise3(pos * scale);

  float n2 = noise3(pos * scale * 1.4 + vec3(3.1, 1.7, 2.4));

  float n3 = noise3(pos * scale * 0.6 + vec3(8.3, 4.1, 6.7));

  float warped = n1 + (n2 - 0.1) * 0.2;

  float threshold = 0.62 + (n3 - 0.5) * 0.12;

  float dot = step(threshold, warped);

  vec3 colorA = vec3(0.9216, 0.0471, 0.6588); 
  vec3 colorB = vec3(0.2392, 0.0353, 0.3020); 

  csm_DiffuseColor.rgb = mix(colorA, colorB, dot);
}