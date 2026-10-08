const escape=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function inline(text){return escape(text).replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\*([^*]+)\*/g,'<em>$1</em>');}
export function renderMarkdown(text){
 const out=[];let list=false;
 for(const line of String(text).split('\n')){
  const item=line.match(/^\s*[-*] (.*)$/);
  if(item){if(!list){out.push('<ul>');list=true;}out.push('<li>'+inline(item[1])+'</li>');continue;}
  if(list){out.push('</ul>');list=false;}
  const heading=line.match(/^(#{1,3}) (.*)$/);
  if(heading)out.push('<div class="note-heading">'+inline(heading[2])+'</div>');
  else if(line.startsWith('> '))out.push('<blockquote>'+inline(line.slice(2))+'</blockquote>');
  else out.push(line?'<div>'+inline(line)+'</div>':'<div class="note-break"></div>');
 }
 if(list)out.push('</ul>');return out.join('');
}
