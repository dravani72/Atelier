// Color math for card shades and board backings. Pure functions over '#rrggbb' strings, so they run in Node tests too.
// The stylesheet stays the source of every color; the app reads those tokens and uses this to decide two things the
// stylesheet cannot: which ink reads on a board's chosen backing, and how strong a card's shade must be to stand apart
// from that backing.
export const isHex=v=>typeof v==='string'&&/^#[0-9a-f]{6}$/i.test(v);
const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255);
const linear=v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4;
export const hex=channels=>'#'+channels.map(v=>Math.round(Math.max(0,Math.min(1,v))*255).toString(16).padStart(2,'0')).join('');
// `amount` of `a` over `b`, in sRGB: the same result as CSS color-mix(in srgb, a amount, b).
export const mix=(a,b,amount)=>{const x=rgb(a),y=rgb(b);return hex(x.map((v,i)=>v*amount+y[i]*(1-amount)));};
export const luminance=h=>{const [r,g,b]=rgb(h).map(linear);return .2126*r+.7152*g+.0722*b;};
export const contrast=(a,b)=>{const [hi,lo]=[luminance(a),luminance(b)].sort((x,y)=>y-x);return (hi+.05)/(lo+.05);};
const oklab=h=>{const [r,g,b]=rgb(h).map(linear),l=Math.cbrt(.4122214708*r+.5363325363*g+.0514459929*b),m=Math.cbrt(.2119034982*r+.6806995451*g+.1073969566*b),s=Math.cbrt(.0883024619*r+.2817188376*g+.6299787005*b);return [.2104542553*l+.793617785*m-.0040720468*s,1.9779984951*l-2.428592205*m+.4505937099*s,.0259040371*l+.7827717662*m-.808675766*s];};
// Perceptual distance (OKLab). Around .02 is a just-visible step between two flat areas; .05 reads at a glance.
export const distance=(a,b)=>{const x=oklab(a),y=oklab(b);return Math.hypot(x[0]-y[0],x[1]-y[1],x[2]-y[2]);};

// Mirrors of --ink in the light and dark token sets in style.css.
const INK={light:'#18181b',dark:'#ededea'};
// The ink that reads best on this backing, for marks drawn straight on the board.
export const inkOn=backing=>contrast(backing,INK.dark)>contrast(backing,INK.light)?INK.dark:INK.light;

// How much of a type's pigment a card needs so its shade stands apart from the board behind it. Starts from the token
// set's usual strength and deepens only while the shade and the backing are too close, up to `most`.
export const CLEAR=.04,MOST=36;
export function shadeStrength(pigment,surface,backing,usual,{clear=CLEAR,most=MOST,step=3}={}){
 let strength=usual;
 while(strength<most&&distance(mix(pigment,surface,strength/100),backing)<clear)strength=Math.min(most,strength+step);
 return strength;
}
