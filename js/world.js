'use strict';
const STEP=1/60, clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
class World{
 constructor(save,emit=()=>{}){
  this.emit=emit;this.t=0;this.camera=0;this.sector=-1;this.hp=3;this.hero=save?.hero==='Boro'?'Boro':'Nira';this.collected=new Set((save?.items||[]).filter(i=>Number.isInteger(i)&&loot[i]));this.check=!!save;this.checkSave=save;this.elapsed=save?.time||0;this.charge=0;this.echo=0;this.used=new Set();this.over=false;
  this.foes=LEVEL.foes.map(([x,range,type],i)=>({home:x,range,type,x,y:baseY(x),dead:false,phase:i*1.7,dir:1,warning:0,attack:0,rest:0}));this.sparks=[];this.spawn()
 }
 spawn(){this.x=this.check?LEVEL.checkpoint:110;this.y=baseY(this.x);this.vx=this.vy=0;this.face=1;this.floor=LEVEL.surfaces.find(s=>this.x>=s.a&&this.x<=s.b);this.coyote=.1;this.jumpBuffer=this.roll=this.cool=this.inv=this.throwLock=0;this.glide=1;this.camera=clamp(this.x-320,0,LEVEL.end-760);this.px=this.x;this.py=this.y;this.pc=this.camera;this.squash=0;this.trail=[];this.pal={x:this.x-64,y:this.y,face:1};this.zoneHint=''}
 burst(x,y,color,n=12){for(let i=0;i<n;i++){let a=Math.random()*Math.PI*2,v=35+Math.random()*110;this.sparks.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-34,life:.35+Math.random()*.35,color})}}
 count(type){return [...this.collected].filter(i=>loot[i].type===type).length}
 snapshot(){return {level:LEVEL.id,hero:this.hero,items:[...this.collected],time:this.elapsed}}
 pulse(key){if(this.used.has(key))return;this.used.add(key);this.charge=Math.min(100,this.charge+30)}
 hit(){if(this.inv>0)return;this.hp--;this.inv=1.15;this.burst(this.x,this.y-28,'#ff9d6a');this.emit('hurt');if(this.hp<=0)this.fall();else this.vy=-235}
 fall(){this.spawn();this.hp=3;this.inv=1.15;this.emit('message',this.check?'De volta ao marco':'De volta à enseada')}
 step(keys,press){
  if(this.over)return;
  this.px=this.x;this.py=this.y;this.pc=this.camera;this.t+=STEP;this.elapsed+=STEP;
  for(const k of ['inv','roll','cool','throwLock','squash','echo'])this[k]=Math.max(0,this[k]-STEP);
  if(press.swap){this.hero=this.hero==='Nira'?'Boro':'Nira';this.burst(this.x,this.y-25,'#a8f6ce');this.emit('swap')}
  const dir=Number(!!keys.right)-Number(!!keys.left);
  if(dir)this.face=dir;
  if(press.roll&&this.cool===0&&this.floor){this.roll=this.hero==='Boro'?.44:.37;this.cool=.58;this.emit('roll');this.burst(this.x,this.y-3,'#f4cf92',7)}
  if(press.jump)this.jumpBuffer=.12;else this.jumpBuffer=Math.max(0,this.jumpBuffer-STEP);
  if(this.floor){this.coyote=.1;this.glide=1.05}else this.coyote=Math.max(0,this.coyote-STEP);
  if(this.jumpBuffer>0&&this.coyote>0){this.vy=-554;this.floor=null;this.coyote=this.jumpBuffer=0;this.emit('jump')}
  const mark=LEVEL.marks.find(x=>Math.abs(x-this.x)<105);
  if(press.action&&this.throwLock===0){
    if(mark&&this.charge>=30){this.charge-=30;this.echo=8;this.vy=-655;this.floor=null;this.coyote=0;this.emit('message',this.hero==='Nira'?'Sopro • corrente revelada':'Eco • raízes despertas');this.burst(this.x,this.y,'#b8ffe0',24)}
    else{this.hero=this.hero==='Nira'?'Boro':'Nira';this.vy=-610;this.floor=null;this.coyote=0;this.emit('throw');this.burst(this.x,this.y-17,'#b8ffe0')}
    this.throwLock=1e5
  }
  let target=this.roll?this.face*475:dir*(this.hero==='Boro'?300:322);
  let accel=(dir?1850:2450)*STEP;this.vx+=clamp(target-this.vx,-accel,accel);
  this.x=clamp(this.x+this.vx*STEP,28,LEVEL.end+60);
  let glide=this.hero==='Nira'&&keys.jump&&!this.floor&&this.vy>35&&this.glide>0;
  if(glide)this.glide-=STEP;
  this.vy=Math.min(glide?105:780,this.vy+(this.vy<0&&!keys.jump?2230:1375)*STEP);
  if(!this.floor&&keys.jump&&LEVEL.wind.some(x=>Math.abs(x-this.x)<34)&&this.y>240){this.vy=Math.min(this.vy,-390);this.pulse('wind'+Math.round(this.x/100))}
  let next=this.y+this.vy*STEP,land=null,landY=Infinity;
  for(const s of LEVEL.surfaces){if(s.type==='echo'&&!this.echo||this.x<s.a-6||this.x>s.b+6)continue;let sy=surfaceY(s,this.x,this.t);if(this.vy>=0&&this.y<=sy+Math.max(5,Math.abs(this.vx)*STEP*.25)&&next>=sy-2&&sy<landY){land=s;landY=sy}}
  if(land){if(!this.floor&&this.vy>225){this.squash=.12;this.burst(this.x,this.y,'#e0cf9e',5);this.emit('land')}this.floor=land;this.y=landY;this.vy=0;this.throwLock=0}else{this.floor=null;this.y=next}
  if(this.y>625){this.fall();return}
  for(const [i,f] of this.foes.entries()){if(f.dead)continue;
    if(f.type==='crab'){
      f.rest=Math.max(0,f.rest-STEP);
      if(f.warning>0){f.warning-=STEP;if(f.warning<=0){f.warning=0;f.attack=.34}}
      else if(f.attack>0){f.attack-=STEP;f.x=clamp(f.x+f.dir*170*STEP,f.home-f.range*.75,f.home+f.range*.75);if(f.attack<=0)f.rest=1.7}
      else if(!f.rest&&Math.abs(this.x-f.x)<117&&Math.abs(this.y-f.y)<58){f.dir=this.x>=f.x?1:-1;f.warning=.48}
      else{const dest=f.home+Math.sin(this.t*.95+f.phase)*f.range*.45;let dx=clamp(dest-f.x,-.7,.7);f.x+=dx;if(Math.abs(dx)>.05)f.dir=Math.sign(dx)}
    }else{f.x=f.home+Math.sin(this.t*1.25+f.phase)*f.range*.52;f.dir=Math.cos(this.t*1.25+f.phase)>=0?1:-1}f.y=baseY(f.x);
    if(Math.abs(f.x-this.x)>31||this.y<f.y-32||this.y-45>f.y-6)continue;
    if(this.roll>0||this.vy>15&&this.py<f.y-23){f.dead=true;this.pulse('foe'+i);if(!this.roll)this.vy=keys.jump?-470:-325;this.burst(f.x,f.y-14,'#ffd08b');this.emit('stomp')}else this.hit()
  }
  loot.forEach((p,i)=>{if(this.collected.has(i)||Math.abs(p.x-this.x)>30||Math.abs(p.y-(this.y-29))>40)return;this.collected.add(i);this.burst(p.x,p.y,p.type==='fruit'?'#ffce75':'#b5ffe7',8);this.emit(p.type);if(p.type!=='fruit')this.pulse('loot'+i)});
  if(this.x>=LEVEL.checkpoint&&!this.check){this.check=true;this.hp=3;this.checkSave=this.snapshot();this.emit('checkpoint',this.checkSave)}
  let sector=LEVEL.sections.findLastIndex(s=>this.x>=s[0]);if(sector>this.sector){this.sector=sector;this.emit('sector',LEVEL.sections[sector][1])}
  this.zoneHint=mark?'✧  '+(this.charge>=30?'Ativar ressonância':'Arremessar parceiro'):'';
  this.trail.push({x:this.x,y:this.y,face:this.face});if(this.trail.length>17){const p=this.trail.shift();this.pal.x+=(p.x-this.face*40-this.pal.x)*.14;this.pal.y+=(p.y-this.pal.y)*.19;this.pal.face=p.face}
  const aim=clamp(this.x-355+this.vx*.19,0,LEVEL.end-760);this.camera+=(aim-this.camera)*.065;
  for(const p of this.sparks){p.x+=p.vx*STEP;p.y+=p.vy*STEP;p.vy+=180*STEP;p.life-=STEP}this.sparks=this.sparks.filter(p=>p.life>0);
  if(this.x>=LEVEL.end){this.over=true;this.emit('win')}
 }
}
