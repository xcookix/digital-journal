const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const uid=()=>Math.random().toString(36).slice(2,10),today=()=>new Date().toLocaleDateString('sv');
const STICKERS='⭐🌙☀️🌸🌿🍂☕📖✏️💌🎀🦋🌈💭❤️✨🐾🍓🎧📌🧸🎞️🕯️🍵'.match(/\p{Extended_Pictographic}\uFE0F?/gu);

/* storage: IndexedDB */
const db=new Promise((ok,no)=>{const r=indexedDB.open('inkwell',1);r.onupgradeneeded=()=>r.result.createObjectStore('entries',{keyPath:'id'});r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)});
const tx=async(m,f)=>{const d=await db;return new Promise((ok,no)=>{const t=d.transaction('entries',m),q=f(t.objectStore('entries'));t.oncomplete=()=>ok(q.result);t.onerror=()=>no(t.error)})};
const all=()=>tx('readonly',s=>s.getAll()),put=e=>tx('readwrite',s=>s.put(e)),del=id=>tx('readwrite',s=>s.delete(id));

/* safety: imported entries are untrusted */
const clean=h=>{const d=new DOMParser().parseFromString(String(h),'text/html');d.body.querySelectorAll('*').forEach(n=>{if(!/^(B|I|U|BR|DIV|P|SPAN|STRIKE)$/.test(n.tagName))n.replaceWith(...n.childNodes);else[...n.attributes].forEach(a=>n.removeAttribute(a.name))});return d.body.innerHTML};
const plain=h=>new DOMParser().parseFromString(String(h),'text/html').body.textContent;
const txt=e=>(e.elements||[]).filter(x=>x.type=='text').map(x=>plain(x.html||'')).join(' ').trim();

/* theme */
const setTheme=t=>{document.documentElement.dataset.theme=t;try{localStorage.theme=t}catch{}};
try{if(localStorage.theme){setTheme(localStorage.theme);$('#theme').value=localStorage.theme}}catch{}
$('#theme').onchange=e=>setTheme(e.target.value);

/* library */
let E=null,sel=null,tool='select',scale=1,saveT,pts,snap,hist=[],fut=[];
async function showLib(){
  E=null;$('#ed').hidden=true;$('#lib').hidden=false;
  const q=$('#q').value.toLowerCase(),a=(await all()).sort((x,y)=>String(y.date).localeCompare(String(x.date))||y.updated-x.updated).filter(e=>(e.title+' '+txt(e)).toLowerCase().includes(q));
  const L=$('#list');L.innerHTML='';
  if(!a.length)L.innerHTML=`<p class="empty">${q?'No entries match your search.':'No entries yet. Start your first page.'}</p>`;
  a.forEach(e=>{const c=document.createElement('div');c.className='card';c.tabIndex=0;
    c.innerHTML='<b></b><small></small><p></p><button>Delete</button>';
    c.children[0].textContent=e.title||'Untitled';c.children[1].textContent=e.date;c.children[2].textContent=txt(e);
    c.onclick=()=>openEntry(e);c.onkeydown=k=>{if(k.key=='Enter'&&k.target==c)openEntry(e)};
    c.children[3].onclick=async k=>{k.stopPropagation();if(confirm('Delete this entry? This cannot be undone.')){await del(e.id);showLib()}};
    L.append(c)});
}
$('#q').oninput=showLib;
$('#new').onclick=()=>openEntry({id:uid(),title:'',date:today(),paper:'lined',elements:[],drawing:'',updated:Date.now()});
$('#exp').onclick=async()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(await all())],{type:'application/json'}));a.download='inkwell-backup-'+today()+'.json';a.click()};
$('#imp').onchange=async e=>{try{for(const x of JSON.parse(await e.target.files[0].text()))if(x&&x.id&&Array.isArray(x.elements))await put({...x,id:String(x.id)})}catch{alert('That file is not an Inkwell backup.')}e.target.value='';if(!$('#lib').hidden)showLib()};

/* editor */
const P=$('#page'),cv=$('#cv'),ctx=cv.getContext('2d',{willReadFrequently:true}),L=$('#els');
const cur=()=>E&&E.elements.find(x=>x.id==sel),node=id=>L.querySelector(`[data-id="${id}"]`);
const commit=()=>{clearTimeout(saveT);if(!E)return Promise.resolve();E.updated=Date.now();return put(E).then(()=>{$('#st').textContent='Saved'})};
const save=()=>{$('#st').textContent='Saving…';clearTimeout(saveT);saveT=setTimeout(commit,600)};

function openEntry(e){
  E=e;sel=null;hist=[];fut=[];$('#lib').hidden=true;$('#ed').hidden=false;
  $('#title').value=e.title||'';$('#date').value=e.date;$('#st').textContent='';
  P.dataset.paper=e.paper||'lined';$('#paper').value=P.dataset.paper;
  L.innerHTML='';e.elements.forEach(add);ctx.clearRect(0,0,720,960);
  if(typeof e.drawing=='string'&&e.drawing.startsWith('data:image/')){const i=new Image();i.onload=()=>ctx.drawImage(i,0,0);i.src=e.drawing}
  select(null);setTool('select');fit();scrollTo(0,0);
}
$('#back').onclick=async()=>{clearTimeout(saveT);if(!E.title&&!E.elements.length&&!E.drawing)await del(E.id);else await commit();showLib()};
$('#title').oninput=e=>{E.title=e.target.value;save()};
$('#date').oninput=e=>{E.date=e.target.value||today();save()};
$('#paper').onchange=e=>{E.paper=P.dataset.paper=e.target.value;save()};

function fit(){scale=Math.min(1,($('#wrap').clientWidth-24)/720);P.style.transform=`scale(${scale})`;$('#box').style.cssText=`width:${720*scale}px;height:${960*scale}px`}
addEventListener('resize',()=>E&&fit());

function add(el){
  if(el.type=='image'&&!/^data:image\//.test(el.src))return;
  const n=document.createElement('div');n.className='el '+el.type;n.dataset.id=el.id;let c;
  if(el.type=='text'){c=document.createElement('div');c.className='t';c.contentEditable=true;c.innerHTML=clean(el.html||'');c.oninput=()=>{el.html=c.innerHTML;save()}}
  else if(el.type=='image'){c=new Image();c.alt='Journal photo';c.src=el.src}
  else{c=document.createElement('span');c.className='s';c.textContent=el.ch}
  n.append(c);n.insertAdjacentHTML('beforeend','<i class="h"></i><i class="g"></i>');
  L.append(n);paint(el,n);return n;
}
function paint(el,n=node(el.id)){
  n.style.left=el.x+'px';n.style.top=el.y+'px';n.style.transform=`rotate(${el.r||0}deg)`;
  if(el.type=='sticker')n.style.fontSize=el.w+'px';else n.style.width=el.w+'px';
  if(el.type=='text')Object.assign(n.firstChild.style,{fontFamily:`'${el.font}'`,fontSize:el.size+'px',color:el.color||''});
}
function addEl(el){E.elements.push(el);add(el);select(el.id);save()}
function select(id){
  sel=id;$$('.el').forEach(n=>n.classList.toggle('sel',n.dataset.id==id));
  const el=cur();$('#opt-sel').hidden=!el;$('#opt-text').hidden=!(el&&el.type=='text');
  if(el&&el.type=='text'){$('#font').value=el.font;$('#size').value=el.size;if(el.color)$('#tcolor').value=el.color}
}
function setTool(t){
  tool=t;P.classList.toggle('draw',t=='draw'||t=='erase');P.classList.toggle('txt',t=='text');
  $$('[data-t]').forEach(b=>b.classList.toggle('on',b.dataset.t==t));$('#opt-draw').hidden=!(t=='draw'||t=='erase');
}
$$('[data-t]').forEach(b=>b.onclick=()=>{select(null);setTool(b.dataset.t)});

/* move, resize, create text */
L.addEventListener('pointerdown',e=>{
  const n=e.target.closest('.el');
  if(!n){
    if(tool=='text'){const r=P.getBoundingClientRect(),el={id:uid(),type:'text',x:(e.clientX-r.left)/scale,y:(e.clientY-r.top)/scale,w:260,r:0,html:'',font:$('#font').value,size:+$('#size').value||28,color:null};
      e.preventDefault();addEl(el);setTool('select');node(el.id).firstChild.focus()}
    else select(null);
    return;
  }
  select(n.dataset.id);const el=cur(),h=e.target.matches('.h'),g=e.target.matches('.g');
  if(el.type=='text'&&!h&&!g)return;
  e.preventDefault();const sx=e.clientX,sy=e.clientY,o={...el};
  const mv=v=>{const dx=(v.clientX-sx)/scale,dy=(v.clientY-sy)/scale;if(h)el.w=Math.max(24,o.w+dx);else{el.x=o.x+dx;el.y=o.y+dy}paint(el)};
  const up=()=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up);save()};
  addEventListener('pointermove',mv);addEventListener('pointerup',up);
});
addEventListener('keydown',e=>{if(e.key=='Delete'&&cur()&&!e.target.isContentEditable&&!/INPUT|SELECT/.test(e.target.tagName))$('#rm').click()});

/* selection actions */
const rot=d=>{const el=cur();if(el){el.r=((el.r||0)+d)%360;paint(el);save()}};
$('#rl').onclick=()=>rot(-15);$('#rr').onclick=()=>rot(15);
$('#fr').onclick=()=>{const el=cur();if(!el)return;E.elements=E.elements.filter(x=>x!==el).concat(el);L.append(node(el.id));save()};
$('#rm').onclick=()=>{const el=cur();if(!el)return;E.elements=E.elements.filter(x=>x!==el);node(el.id).remove();select(null);save()};

/* text options */
const edit=f=>{const el=cur();if(el&&el.type=='text'){f(el);paint(el);save()}};
$('#font').onchange=e=>edit(el=>el.font=e.target.value);
$('#size').oninput=e=>edit(el=>el.size=Math.min(96,Math.max(10,+e.target.value||28)));
$('#tcolor').oninput=e=>edit(el=>el.color=e.target.value);
[['#b','bold'],['#i','italic']].forEach(([s,c])=>{const b=$(s);b.onmousedown=e=>e.preventDefault();b.onclick=()=>document.execCommand(c)});

/* photos and stickers */
const shrink=f=>new Promise(ok=>{const i=new Image();i.onload=()=>{const k=Math.min(1,1200/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=i.width*k;c.height=i.height*k;c.getContext('2d').drawImage(i,0,0,c.width,c.height);ok(c.toDataURL('image/webp',.8))};i.src=URL.createObjectURL(f)});
$('#img').onclick=()=>$('#file').click();
$('#file').onchange=async e=>{for(const f of e.target.files)addEl({id:uid(),type:'image',src:await shrink(f),x:80,y:120,w:300,r:0});e.target.value=''};
STICKERS.forEach(ch=>{const b=document.createElement('button');b.textContent=ch;b.setAttribute('aria-label','Add sticker '+ch);
  b.onclick=()=>addEl({id:uid(),type:'sticker',ch,x:260+Math.random()*120,y:300+Math.random()*120,w:72,r:0});$('#pick').append(b)});
$('#stk').onclick=()=>$('#pick').toggleAttribute('hidden');

/* drawing */
const brush={pen:[1,1],marker:[2.5,.85],hl:[6,.3]};
const pt=e=>{const r=cv.getBoundingClientRect();return[(e.clientX-r.left)/scale,(e.clientY-r.top)/scale]};
function stroke(){
  ctx.putImageData(snap,0,0);const[m,a]=brush[$('#brush').value],er=tool=='erase';
  ctx.save();ctx.globalCompositeOperation=er?'destination-out':'source-over';ctx.globalAlpha=er?1:a;
  ctx.strokeStyle=$('#dcolor').value;ctx.lineWidth=(er?4:m)*$('#dsize').value;ctx.lineCap=ctx.lineJoin='round';
  ctx.beginPath();ctx.moveTo(...pts[0]);
  if(pts.length<3)pts.forEach(p=>ctx.lineTo(p[0]+(pts.length==1?.01:0),p[1]));
  else{for(let i=1;i<pts.length-1;i++){const[x,y]=pts[i],[x2,y2]=pts[i+1];ctx.quadraticCurveTo(x,y,(x+x2)/2,(y+y2)/2)}ctx.lineTo(...pts.at(-1))}
  ctx.stroke();ctx.restore();
}
cv.onpointerdown=e=>{if(!P.classList.contains('draw'))return;cv.setPointerCapture(e.pointerId);snap=ctx.getImageData(0,0,720,960);pts=[pt(e)];stroke()};
cv.onpointermove=e=>{if(!pts)return;(e.getCoalescedEvents?.()||[e]).forEach(x=>pts.push(pt(x)));stroke()};
cv.onpointerup=cv.onpointercancel=()=>{if(!pts)return;hist.push(snap);if(hist.length>25)hist.shift();fut=[];pts=null;E.drawing=cv.toDataURL();save()};
const frame=()=>ctx.getImageData(0,0,720,960);
$('#undo').onclick=()=>{if(!hist.length)return;fut.push(frame());ctx.putImageData(hist.pop(),0,0);E.drawing=cv.toDataURL();save()};
$('#redo').onclick=()=>{if(!fut.length)return;hist.push(frame());ctx.putImageData(fut.pop(),0,0);E.drawing=cv.toDataURL();save()};
$('#clear').onclick=()=>{hist.push(frame());ctx.clearRect(0,0,720,960);E.drawing='';save()};

showLib();
