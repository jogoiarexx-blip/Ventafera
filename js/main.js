'use strict';
const $=id=>document.getElementById(id),menu=$('menu'),stage=$('stage'),panel=$('panel'),body=$('panelContent'),canvas=$('view'),ctx=canvas.getContext('2d'),audio=new Soundscape();
const SAVE='VENTAFERA_TRILHA_V1';let saved={};try{saved=JSON.parse(localStorage.getItem(SAVE))||{}}catch{}
function persist(){try{localStorage.setItem(SAVE,JSON.stringify(saved))}catch{}}
saved.marcos ||= {};
if(saved.checkpoint){saved.marcos[saved.checkpoint.level||CONCHAS.id]=saved.checkpoint;delete saved.checkpoint;persist()}
function menuLevel(){return saved.active===CASCATA.id?CASCATA:CONCHAS}
function chapters(){
 const buttons=[CONCHAS,CASCATA].map((l,i)=>[(i+1)+' · '+l.title,()=>enter(l)]);
 dialog('Costa das Cascatas','<p>Escolha a trilha para jogar. Cada fase guarda seu próprio marco.</p>',[...buttons,['Voltar',closePanel]]);
}
function enter(l){
 const cp=saved.marcos[l.id];
 if(!cp){start(false,l);return}
 dialog(l.title,'<p>Há um marco salvo nesta fase.</p>',[['Continuar do marco',()=>start(true,l)],['Recomeçar',()=>start(false,l)],['Voltar',()=>state==='won'?finish():closePanel()]]);
}
const settings=Object.assign({volume:.55,music:true,reduced:matchMedia('(prefers-reduced-motion: reduce)').matches},saved.settings);audio.setVolume(settings.volume);audio.music=settings.music;
const touch=matchMedia('(pointer:coarse)').matches||navigator.maxTouchPoints>0;if(touch)document.body.classList.add('touch');
let game=null,state='menu',keys={},edges={},held=new Map(),last=0,acc=0,toastTime=0,winDelay=0;
const fmt=s=>Math.floor(s/60)+'min '+String(Math.floor(s%60)).padStart(2,'0')+'s';
function home(){state='menu';game=null;stage.hidden=true;menu.hidden=false;$('resume').hidden=!saved.marcos[menuLevel().id];document.querySelector('footer div').lastChild.textContent=' '+menuLevel().title;document.querySelector('footer b').textContent=menuLevel()===CASCATA?'02':'01';const best=menuLevel()===CASCATA?saved.fallsBest:saved.best;$('record').textContent=best?'MELHOR TEMPO · '+fmt(best):'CAPÍTULO I';closePanel();$('start').focus({preventScroll:true})}
function clearInput(){keys={};edges={};held.clear()}
function closePanel(){if(panel.open)panel.close()}
function dialog(title,html,buttons,tag='ATLAS DAS ILHAS'){closePanel();body.replaceChildren();const label=document.createElement('small');label.className='kicker';label.textContent=tag;const h=document.createElement('h2');h.textContent=title;const div=document.createElement('div');div.innerHTML=html;body.append(label,h,div);buttons.forEach(([name,fn],i)=>{let b=document.createElement('button');b.className=i?'menuBtn':'primary';b.textContent=name;b.onclick=fn;body.append(b)});panel.showModal()}
function toast(msg,sec=2){$('toast').textContent=msg;toastTime=sec}
function event(name,data){
 audio.fx(name);
 if(name==='checkpoint'){saved.marcos[LEVEL.id]=data;persist();toast('Marco aceso • progresso salvo')}
 if(name==='message')toast(data);
 if(name==='sector'&&(!toastTime||game?.sector===0))toast(data,2.2);
 if(name==='glyph')toast('Glifo encontrado',1.35);
 if(name==='seal')toast('Segredo • selo de concha',1.8);
 if(name==='win'){winDelay=.85;toast(LEVEL===CASCATA?'Nascente encontrada!':'O farol despertou!');const k=LEVEL===CASCATA?'fallsBest':'best';saved[k]=Math.min(saved[k]||Infinity,game.elapsed);delete saved.marcos[LEVEL.id];persist();clearInput()}
}
function start(continuing=false,l=menuLevel()){
 closePanel();clearInput();audio.unlock();selectLevel(l.id);terrainCache.clear();saved.active=l.id;
 if(!continuing)delete saved.marcos[l.id];persist();stage.setAttribute('aria-label',l.title);
 game=new World(continuing?saved.marcos[l.id]:null,event);state='playing';menu.hidden=true;stage.hidden=false;toastTime=0;winDelay=0;acc=0;last=0;resize();hud()}
function resize(){if(stage.hidden)return;const ratio=Math.min(devicePixelRatio||1,1.75),w=Math.max(640,Math.round(stage.clientWidth*ratio));canvas.width=w;canvas.height=Math.round(w*9/16)}
function setLabel(id,value){const el=$(id),v=String(value);if(el.textContent!==v)el.textContent=v}
function hud(){const w=game,n=w.hero.toLowerCase();if($('heroName').textContent!==w.hero){$('heroName').textContent=w.hero;$('portrait').src='./assets/'+n+'0.webp'}setLabel('hearts','♥'.repeat(w.hp)+'♡'.repeat(3-w.hp));setLabel('fruit',w.count('fruit'));setLabel('glyph',w.count('glyph')+'/4');
 let h=w.zoneHint;if(LEVEL===CASCATA){if(!h&&w.x<570)h='Atravesse os tocos até a nascente';if(!h&&w.x>3700&&w.x<4210)h='Fenda seca • plane com Nira seguindo os frutos'}else if(!h&&w.x<530)h=touch?'◀ ▶  Mover   ·   ↑  Pular':'A D  Mover   ·   Espaço  Pular';else if(!h&&w.x>1030&&w.x<1280)h=touch?'↻  Rolar ou investir':'X  Rolar ou investir';else if(!h&&w.x>5300&&w.x<5480)h='Segure o salto na corrente de brisa';if(!h&&touch&&innerHeight>innerWidth)h='Gire o celular para ampliar a trilha';setLabel('hint',h)}
function pause(){if(state!=='playing'||game.over)return;state='paused';clearInput();dialog('Pausa na trilha','<p>'+LEVEL.sections[Math.max(game.sector,0)][1]+' · '+fmt(game.elapsed)+'</p>',[['Continuar',unpause],['Controles',()=>guide(true)],['Menu principal',home]],LEVEL.title.toUpperCase())}
function unpause(){closePanel();state='playing';last=0;acc=0;clearInput();audio.unlock()}
function guide(inGame=false){dialog('Como jogar','<dl><div><dt>A D / ← →</dt><dd>Mover</dd></div><div><dt>Espaço / ↑</dt><dd>Pular e segurar para planar com Nira</dd></div><div><dt>X / Shift</dt><dd>Rolar com Nira ou investir com Boro</dd></div><div><dt>C</dt><dd>Trocar de herói</dd></div><div><dt>E</dt><dd>Arremessar o parceiro ou ativar um marco de vento</dd></div><div><dt>Esc / P</dt><dd>Pausar</dd></div></dl><p style="margin-top:12px">Siga os frutos até o farol. Rebata nos inimigos e reúna glifos para carregar os marcos de vento. Há dois selos escondidos.</p>',[['Voltar',inGame?()=>{state='playing';pause()}:closePanel]])}
function options(){dialog('Opções','<label>Volume <input id="vol" type="range" min="0" max="100" aria-label="Volume"></label><label>Trilha musical <input id="music" type="checkbox"></label><label>Reduzir partículas <input id="reduce" type="checkbox"></label>',[['Voltar',closePanel]]);$('vol').value=settings.volume*100;$('music').checked=settings.music;$('reduce').checked=settings.reduced;const update=()=>{audio.unlock();settings.volume=$('vol').value/100;settings.music=$('music').checked;settings.reduced=$('reduce').checked;audio.setVolume(settings.volume);audio.music=settings.music;saved.settings=settings;persist()};$('vol').oninput=()=>{update();audio.fx('fruit')};$('music').onchange=$('reduce').onchange=update}
function finish(){state='won';const w=game;dialog(LEVEL===CASCATA?'Nascente encontrada':'Farol desperto',(LEVEL===CASCATA?'<p>A dupla atravessou a Cascata Escondida e chegou à nascente.</p>':'<p>O farol revelou o caminho para a Cascata Escondida.</p>')+'<dl><div><dt>Tempo de travessia</dt><dd>'+fmt(w.elapsed)+'</dd></div><div><dt>Frutos</dt><dd>'+w.count('fruit')+' / '+loot.filter(p=>p.type==='fruit').length+'</dd></div><div><dt>Glifos</dt><dd>'+w.count('glyph')+' / 4</dd></div><div><dt>Selos secretos</dt><dd>'+w.count('seal')+' / 2</dd></div></dl>',[...(LEVEL===CONCHAS?[['Próxima fase',()=>enter(CASCATA)]]:[]),['Jogar novamente',()=>start(false,LEVEL)],['Menu principal',home]],LEVEL.title+' • CONCLUÍDA')}
$('start').onclick=()=>enter(menuLevel());$('chapters').onclick=chapters;$('resume').onclick=()=>start(true,menuLevel());$('options').onclick=options;$('guide').onclick=()=>guide();$('pause').onclick=pause;
panel.addEventListener('cancel',e=>{e.preventDefault();if(state==='paused')unpause();else if(state==='won')home();else closePanel()});
const mapping={KeyA:'left',ArrowLeft:'left',KeyD:'right',ArrowRight:'right',Space:'jump',KeyW:'jump',ArrowUp:'jump',KeyC:'swap',KeyX:'roll',ShiftLeft:'roll',ShiftRight:'roll',KeyE:'action'};
function input(id,act,down){if(down){if(!keys[act])edges[act]=true;held.set(id,act)}else held.delete(id);keys[act]=[...held.values()].includes(act)}
addEventListener('keydown',e=>{if(e.repeat)return;if(state==='paused'&&e.code==='KeyP'){e.preventDefault();unpause();return}if(state!=='playing')return;if(['Escape','KeyP'].includes(e.code)){e.preventDefault();pause();return}const a=mapping[e.code];if(a){e.preventDefault();input(e.code,a,true)}});addEventListener('keyup',e=>{if(mapping[e.code])input(e.code,mapping[e.code],false)});
document.querySelectorAll('[data-key]').forEach(b=>{const a=b.dataset.key;b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);input(e.pointerId,a,true)};b.onlostpointercapture=b.onpointercancel=b.onpointerup=e=>input(e.pointerId,a,false)});
addEventListener('blur',()=>{clearInput();pause()});document.addEventListener('visibilitychange',()=>{if(document.hidden){clearInput();pause()}});addEventListener('resize',resize);
function frame(now){if(state==='playing'){
 const dt=last?Math.min((now-last)/1000,5*STEP):0;acc+=dt;while(acc>=STEP){game.step(keys,edges);edges={};acc-=STEP}
 if(!game.over)audio.tick(game.sector);else game.celebration=.85-winDelay;if(toastTime>0&&(toastTime-=dt)<=0)$('toast').textContent='';hud();render(ctx,game,acc/STEP,settings.reduced);if(game.over&&(winDelay-=dt)<=0)finish()
 }last=now;requestAnimationFrame(frame)}
home();requestAnimationFrame(frame);
