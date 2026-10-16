// Shared pieces most library templates use: the title row, colour grids, reference grids, and a few patterns.
import {note,task,photo,heading,sticky,table,column,stack,grid,single,row} from './dsl.mjs';
import {swatch} from './assets.mjs';

/** The title row: a heading with a one-line purpose, and a "how to use" sticky. */
export const intro=(title,purpose,how,{w=1180,howW=380,color='sky'}={})=>row([stack(w,[heading(title,purpose)]),single(howW,sticky('How to use this template',how,{color}))],{after:40});
/** Colour chips in a grid: [[hex, name], …]. */
export const swatches=(colors,cols=3,cell=150)=>grid(cols,cell,colors.map(([hex,name])=>swatch(hex,name)),{gap:12});
/** Reference photos in a grid: [[key, want, title?, ratio?], …]. */
export const photos=(list,cols=3,cell=260,o={})=>grid(cols,cell,list.map(([key,want,title,ratio])=>photo(key,want,{ratio:ratio||o.ratio||0.75,...(title?{title}:{})})),{gap:16,...o});
/** A column of short notes from [title, body] pairs. */
export const notes=(title,w,pairs,o={})=>column(title,w,pairs.map(([t,b,extra])=>note(t,b,extra||{})),o);
