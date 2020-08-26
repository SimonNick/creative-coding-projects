precision mediump float;

varying vec2 vTexCoord;
uniform sampler2D img;
uniform sampler2D tex;

uniform float amtx;
uniform float amty;

void main() {

  vec2 uv = vTexCoord;
  // the texture is loaded upside down and backwards by default so lets flip it
  uv = vec2(uv.x, 1.0 - uv.y);

  // get the webcam as a vec4 using texture2D
  vec4 img4d = texture2D(img, uv);

  // lets get the average color of the rgb values
  float avg = dot(img4d.rgb, vec3(0.33333));

  // then spread it between -1 and 1
  avg = avg * 2.0 - 1.0;

  // we will displace the image by the average color times the amt of displacement 
  vec2 disp = vec2(uv.x + avg * amtx, uv.y + avg * amty);
  
  // displacement works by moving the texture coordinates of one image with the colors of another image
  // add the displacement to the texture coordinages
  vec4 pup = texture2D(tex, disp);

  // output the image
  gl_FragColor = pup;
}