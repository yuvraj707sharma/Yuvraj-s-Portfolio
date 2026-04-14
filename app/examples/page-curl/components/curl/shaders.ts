export const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3 iResolution;
  uniform vec4 iMouse;
  uniform float iActive;
  uniform sampler2D iChannel0;
  uniform sampler2D iChannel1;
  varying vec2 vUv;

  #define pi 3.14159265359
  #define radius .1

  void main() {
    vec2 fragCoord = vUv * iResolution.xy;
    float aspect = iResolution.x / iResolution.y;

    if (iActive < 0.5) {
      gl_FragColor = texture2D(iChannel1, vUv);
      return;
    }

    vec2 uv = fragCoord * vec2(aspect, 1.) / iResolution.xy;
    vec2 mouse = iMouse.xy * vec2(aspect, 1.) / iResolution.xy;
    vec2 mouseDir = normalize(abs(iMouse.zw) - iMouse.xy);
    vec2 origin = mouse - mouseDir * mouse.x / mouseDir.x;

    float mouseDist = dot(mouse - origin, mouseDir)
      + (aspect - (abs(iMouse.z) / iResolution.x) * aspect) / mouseDir.x;

    if (mouseDir.x < 0.) {
      mouseDist = dot(mouse - origin, mouseDir);
    }

    float proj = dot(uv - origin, mouseDir);
    float dist = proj - mouseDist;

    vec2 linePoint = uv - dist * mouseDir;

    vec4 color;
    bool isBack = false;

    if (dist > radius) {
      color = texture2D(iChannel1, uv * vec2(1. / aspect, 1.));
      color.rgb *= clamp(pow(clamp(dist * 2.0 - radius, 0., 1.) * 1.5, .2), 0., 1.);
    } else if (dist >= 0.) {
      float theta = asin(dist / radius);
      vec2 p2 = linePoint + mouseDir * (pi - theta) * radius;
      vec2 p1 = linePoint + mouseDir * theta * radius;
      bool p2In = (p2.x <= aspect && p2.y <= 1. && p2.x > 0. && p2.y > 0.);
      vec2 tuv = p2In ? p2 : p1;
      isBack = p2In;
      vec2 sampleUv = isBack
        ? vec2(aspect - tuv.x, tuv.y) * vec2(1. / aspect, 1.)
        : tuv * vec2(1. / aspect, 1.);
      color = texture2D(iChannel0, sampleUv);
      if (isBack) {
        color.rgb *= pow(clamp((radius - dist) / radius, 0., 1.), .2);
      }
    } else {
      vec2 p = linePoint + mouseDir * (abs(dist) + pi * radius);
      bool pIn = (p.x <= aspect && p.y <= 1. && p.x > 0. && p.y > 0.);
      isBack = pIn;
      vec2 tuv = pIn ? p : uv;
      vec2 sampleUv = isBack
        ? vec2(aspect - tuv.x, tuv.y) * vec2(1. / aspect, 1.)
        : tuv * vec2(1. / aspect, 1.);
      color = texture2D(iChannel0, sampleUv);
    }

    if (isBack) {
      color.rgb = vec3(219. / 255., 234. / 255., 254. / 255.);
      color.rgb *= pow(clamp((radius - dist) / radius, 0., 1.), .2);
    }

    gl_FragColor = color;
  }
`;
