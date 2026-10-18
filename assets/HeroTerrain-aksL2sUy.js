import{F as e,G as t,H as n,t as r}from"./Box-Bd04PBA0.js";import{n as i}from"./ThemeProviderWithVars-B34YiR5F.js";import{C as a}from"./index-C21I5J9H.js";import{n as o}from"./Home-CUPtUsVQ.js";var s=t(n(),1),c=24,l=64,u=124,d=`
attribute vec2 a_pos;
uniform mat4 u_proj;
uniform float u_time;
uniform float u_level;
uniform float u_sway;
uniform float u_cam;
varying float v_h;
varying float v_depth;
// Passed on as a varying: a uniform shared by both shaders must match precision, which differs between them
varying float v_level;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

void main() {
  float x = a_pos.x;
  float z = a_pos.y;
  // The height field flows toward the camera, so the flight reads as forward motion without moving the grid
  vec2 p = vec2(x * 0.22, (z - u_time * 2.2) * 0.22);
  float h = noise(p) * 0.65 + noise(p * 2.3) * 0.35;
  // Flat valley down the middle keeps the area under the hero title calm
  float valley = smoothstep(1.5, 7.0, abs(x));
  // Beat: peaks lift with the level, plus a ring that ripples out from the middle distance
  float ring = sin(length(vec2(x, z + 18.0)) * 0.9 - u_time * 6.0) * 0.5 + 0.5;
  float y = h * valley * (2.4 + u_level * 2.2) + u_level * ring * 0.35;
  v_h = h * valley;
  v_level = u_level;
  v_depth = -z / ${l.toFixed(1)};
  vec4 pos = u_proj * vec4(x + u_sway, y - u_cam, z, 1.0);
  // Drop the horizon below the hero title so the lines never cross the text
  pos.y -= 0.36 * pos.w;
  gl_Position = pos;
}
`,f=`
precision mediump float;
uniform vec3 u_base;
uniform vec3 u_accent;
varying float v_h;
varying float v_depth;
varying float v_level;

void main() {
  // Neutral lines; only the highest peaks turn purple (STYLE_RULES 15% budget)
  float peak = smoothstep(0.55, 0.85, v_h);
  vec3 color = mix(u_base, u_accent, peak);
  // Fade in near the camera, fog out toward the horizon
  float alpha = smoothstep(0.0, 0.08, v_depth) * (1.0 - smoothstep(0.25, 0.8, v_depth));
  gl_FragColor = vec4(color, alpha * (0.55 + peak * 0.45 + v_level * 0.2));
}
`;function p(e){let t=parseInt(e.slice(1),16);return[(t>>16&255)/255,(t>>8&255)/255,(t&255)/255]}function m(e,t,n,r){let i=1/Math.tan(e/2),a=1/(n-r);return new Float32Array([i/t,0,0,0,0,i,0,0,0,0,(r+n)*a,-1,0,0,2*r*n*a,0])}function h(){let e=[];for(let t=0;t>=-64;--t)for(let n=-24;n<c;n+=1)e.push(n,t,n+1,t);for(let t=-24;t<=c;t+=1)for(let n=0;n>-64;--n)e.push(t,n,t,n-1);return new Float32Array(e)}function g(e,t,n){let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:null):null}function _(e,t){(0,s.useEffect)(()=>{let n=e.current,r=n?.getContext(`webgl`,{antialias:!0,alpha:!0});if(!n||!r)return;let i=g(r,r.VERTEX_SHADER,d),a=g(r,r.FRAGMENT_SHADER,f),s=r.createProgram();if(!i||!a||!s||(r.attachShader(s,i),r.attachShader(s,a),r.linkProgram(s),!r.getProgramParameter(s,r.LINK_STATUS)))return;r.useProgram(s);let c=h(),l=r.createBuffer();r.bindBuffer(r.ARRAY_BUFFER,l),r.bufferData(r.ARRAY_BUFFER,c,r.STATIC_DRAW);let _=r.getAttribLocation(s,`a_pos`);r.enableVertexAttribArray(_),r.vertexAttribPointer(_,2,r.FLOAT,!1,0,0);let v=e=>r.getUniformLocation(s,e),y=v(`u_proj`),b=v(`u_time`),x=v(`u_level`),S=v(`u_sway`),C=v(`u_cam`);r.uniform3fv(v(`u_base`),p(t.base)),r.uniform3fv(v(`u_accent`),p(t.accent)),r.enable(r.BLEND),r.blendFunc(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA),r.clearColor(0,0,0,0);let w=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,T=0,E=0,D=0,O=e=>{T+=(E-T)*.04;let t=Math.exp(-(e*u/60%1)*6)*.35,n=o.playing?o.value:t;D+=(n-D)*.25,r.uniform1f(b,e),r.uniform1f(x,D),r.uniform1f(S,T),r.uniform1f(C,2.2+Math.min(window.scrollY,600)*.004),r.clear(r.COLOR_BUFFER_BIT),r.drawArrays(r.LINES,0,c.length/2)},k=()=>{let e=Math.min(window.devicePixelRatio||1,1.5),t=Math.round(n.clientWidth*e),i=Math.round(n.clientHeight*e);n.width=t,n.height=i,r.viewport(0,0,t,i),r.uniformMatrix4fv(y,!1,m(Math.PI/3,t/Math.max(i,1),.1,100)),w&&O(8)};k();let A=new ResizeObserver(k);A.observe(n);let j=e=>{E=(e.clientX/window.innerWidth-.5)*-3};window.addEventListener(`pointermove`,j);let M=0,N=!0,P=performance.now(),F=e=>{O((e-P)/1e3),M=requestAnimationFrame(F)},I=()=>{cancelAnimationFrame(M),w?O(8):N&&!document.hidden&&(M=requestAnimationFrame(F))},L=new IntersectionObserver(([e])=>{N=e.isIntersecting,I()});return L.observe(n),document.addEventListener(`visibilitychange`,I),I(),()=>{cancelAnimationFrame(M),A.disconnect(),L.disconnect(),window.removeEventListener(`pointermove`,j),document.removeEventListener(`visibilitychange`,I),r.deleteBuffer(l),r.deleteProgram(s),r.deleteShader(i),r.deleteShader(a)}},[e,t])}var v=e(),y=`linear-gradient(to bottom, transparent 0%, black 30%, black 75%, transparent 100%)`;function b(){let e=(0,s.useRef)(null),{colorScheme:t}=i(),n=a.colorSchemes[t??`dark`]?.palette??a.palette;return _(e,(0,s.useMemo)(()=>({base:n.text.secondary,accent:n.primary.main}),[n])),(0,v.jsx)(r,{component:`canvas`,ref:e,"aria-hidden":!0,sx:{position:`absolute`,top:0,left:`calc(50% - 50vw)`,width:`100vw`,height:`100%`,zIndex:-1,pointerEvents:`none`,maskImage:y,WebkitMaskImage:y}})}export{b as default};