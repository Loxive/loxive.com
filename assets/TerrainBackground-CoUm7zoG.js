import{F as e,G as t,H as n,t as r}from"./Box-Bd04PBA0.js";import{G as i,K as a,_ as o,g as s,v as c}from"./index-R3fJo9HI.js";import{t as l}from"./audioLevel-BhG9TaUc.js";var u=t(n(),1),d=24,f=64,p=124,m=`
attribute vec2 a_pos;
uniform mat4 u_proj;
uniform float u_time;
uniform float u_level;
uniform float u_sway;
uniform float u_cam;
uniform float u_horizon;
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
  // Lower hills down the middle, so a peak still shows at the end of the speaker street
  float valley = 0.45 + 0.55 * smoothstep(1.5, 7.0, abs(x));
  // Beat: peaks lift with the level, plus a ring that ripples out from the middle distance
  float ring = sin(length(vec2(x, z + 18.0)) * 0.9 - u_time * 6.0) * 0.5 + 0.5;
  // Far rows tower into a mountain range; only what rises above the camera shows over the city's ground
  float range = 1.0 + smoothstep(0.15, 0.9, -z / ${f.toFixed(1)}) * 7.0;
  float y = h * valley * range * (2.4 + u_level * 2.2) + u_level * ring * 0.35;
  v_h = h * valley;
  v_level = u_level;
  v_depth = -z / ${f.toFixed(1)};
  vec4 pos = u_proj * vec4(x + u_sway, y - u_cam, z, 1.0);
  // Put the terrain's horizon on the speaker city's horizon (clip-space y)
  pos.y += u_horizon * pos.w;
  gl_Position = pos;
}
`,h=`
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
  // Faint up close, strongest on the distant ridges, thinning right at the far edge
  float alpha = smoothstep(0.1, 0.4, v_depth) * (1.0 - smoothstep(0.9, 1.0, v_depth));
  gl_FragColor = vec4(color, alpha * (0.55 + peak * 0.45 + v_level * 0.2));
}
`;function g(e){let t=parseInt(e.slice(1),16);return[(t>>16&255)/255,(t>>8&255)/255,(t&255)/255]}function _(e,t,n,r){let i=1/Math.tan(e/2),a=1/(n-r);return new Float32Array([i/t,0,0,0,0,i,0,0,0,0,(r+n)*a,-1,0,0,2*r*n*a,0])}function v(){let e=[];for(let t=0;t>=-64;--t)for(let n=-24;n<d;n+=1)e.push(n,t,n+1,t);for(let t=-24;t<=d;t+=1)for(let n=0;n>-64;--n)e.push(t,n,t,n-1);return new Float32Array(e)}function y(e,t,n){let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:null):null}function b(e,t){(0,u.useEffect)(()=>{let n=e.current,r=n?.getContext(`webgl`,{antialias:!0,alpha:!0});if(!n||!r)return;let i=y(r,r.VERTEX_SHADER,m),a=y(r,r.FRAGMENT_SHADER,h),u=r.createProgram();if(!i||!a||!u||(r.attachShader(u,i),r.attachShader(u,a),r.linkProgram(u),!r.getProgramParameter(u,r.LINK_STATUS)))return;r.useProgram(u);let d=v(),f=r.createBuffer();r.bindBuffer(r.ARRAY_BUFFER,f),r.bufferData(r.ARRAY_BUFFER,d,r.STATIC_DRAW);let b=r.getAttribLocation(u,`a_pos`);r.enableVertexAttribArray(b),r.vertexAttribPointer(b,2,r.FLOAT,!1,0,0);let x=e=>r.getUniformLocation(u,e),S=x(`u_proj`),C=x(`u_time`),w=x(`u_level`),T=x(`u_sway`),E=x(`u_cam`),D=x(`u_horizon`);r.uniform3fv(x(`u_base`),g(t.base)),r.uniform3fv(x(`u_accent`),g(t.accent)),r.enable(r.BLEND),r.blendFunc(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA),r.clearColor(0,0,0,0);let O=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,k=0,A=0,j=0,M=e=>{k+=(A-k)*.04;let t=Math.exp(-(e*p/60%1)*6)*.35,i=l.playing?l.value:t;j+=(i-j)*.25,r.uniform1f(C,e),r.uniform1f(w,j),r.uniform1f(T,k),r.uniform1f(E,2.2),r.clear(r.COLOR_BUFFER_BIT);let a=s.bottom;a>0&&a<1/0&&(r.uniform1f(D,1-2*a/Math.max(n.clientHeight,1)),r.drawArrays(r.LINES,0,d.length/2))},N=()=>{let e=Math.min(window.devicePixelRatio||1,1.5),t=Math.round(n.clientWidth*e),i=Math.round(n.clientHeight*e);n.width=t,n.height=i,r.viewport(0,0,t,i),r.uniformMatrix4fv(S,!1,_(Math.PI/3,t/Math.max(i,1),.1,100)),O&&M(8)};N();let P=new ResizeObserver(N);P.observe(n);let F=e=>{A=(e.clientX/window.innerWidth-.5)*-3};window.addEventListener(`pointermove`,F);let I=0,L=0,R=!1,z=performance.now(),B=e=>{let t=o();if(t===`asleep`){R=!1;return}I=requestAnimationFrame(B),!(e-L<(t===`active`?1e3/30:1e3/12)-2)&&(L=e,M((e-z)/1e3))},V=()=>{cancelAnimationFrame(I),R=!1,O?M(8):document.hidden||(R=!0,I=requestAnimationFrame(B))},H=c(()=>{R||V()});return document.addEventListener(`visibilitychange`,V),V(),()=>{cancelAnimationFrame(I),P.disconnect(),H(),window.removeEventListener(`pointermove`,F),document.removeEventListener(`visibilitychange`,V),r.deleteBuffer(f),r.deleteProgram(u),r.deleteShader(i),r.deleteShader(a)}},[e,t])}var x=e();function S(){let e=(0,u.useRef)(null),{colorScheme:t}=a(),n=i.colorSchemes[t??`dark`]?.palette??i.palette;return b(e,(0,u.useMemo)(()=>({base:n.text.secondary,accent:n.primary.main}),[n])),(0,x.jsx)(r,{component:`canvas`,ref:e,"aria-hidden":!0,sx:{position:`fixed`,top:0,left:0,width:`100vw`,height:`100vh`,zIndex:-1,pointerEvents:`none`}})}export{S as default};