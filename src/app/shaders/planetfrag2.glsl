precision highp float;
varying vec3 vPosition;
uniform float time;

void main() {
  vec3 pos = normalize(vPosition);

  float lon = atan(pos.z, pos.x);
  float lat = asin(clamp(pos.y, -1.0, 1.0));

  float bands = 7.0;
  float bandIndex = floor((lat / 3.14159 + 0.5) * bands);
  float phaseOffset = fract(sin(bandIndex * 127.1) * 43758.5) * 10.28318;

  float waveA = sin(lon * 3.0 + phaseOffset) * 0.02;
  float waveB = sin(lon * 7.0 + phaseOffset * 1.3) * 0.09;

  float stripe = mod((lat / 3.14159 + 0.5) * bands + waveA + waveB, 1.0);

  float edgeA = step(0.28, stripe);
  float edgeB = step(0.78, stripe);
  float darkStripe = edgeA - edgeB;

  vec3 colorLight = vec3(0.0, 1.0, 0.6667);
  vec3 colorDark  = vec3(0.0118, 0.2196, 0.2471);

  csm_DiffuseColor.rgb = mix(colorLight, colorDark, darkStripe);
}