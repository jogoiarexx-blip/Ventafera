'use strict';

// The slab becomes a walkable ramp when Boro breaks the stone that holds it.
CONCHAS.passages={
  stones:[{x:3230,y:baseYFor(CONCHAS,3230),end:3385,rise:68}],
  rings:[{x:6900,y:121},{x:7020,y:150}]
};
CASCATA.passages={
  stones:[{x:1990,y:baseYFor(CASCATA,1990),end:2150,rise:78}],
  rings:[{x:4335,y:123},{x:4515,y:156}]
};
function baseYFor(level,x){
  const floor=level.surfaces.find(s=>x>=s.a&&x<=s.b);
  return surfaceY(floor,x,0);
}
for(const level of [CONCHAS,CASCATA]){
  level.checkpoints=level===CONCHAS?[1580,level.checkpoint,6380]:[965,level.checkpoint,6350];
  for(const stone of level.passages.stones){
    const ramp={a:stone.x-12,b:stone.end,y:stone.y,z:stone.y-stone.rise,
      type:'root',i:level.surfaces.length,unlock:'stone'+stone.x};
    stone.key=ramp.unlock;level.surfaces.push(ramp);
  }
}
function openSurface(world,s){
  return (!s.unlock||world.used.has(s.unlock))&&(s.type!=='echo'||world.echo>0);
}
function resolvePassage(world){
  let hint='';
  for(const stone of LEVEL.passages.stones){
    if(world.used.has(stone.key))continue;
    const dx=world.x-stone.x,dy=world.y-stone.y;
    if(Math.abs(dx)<138&&Math.abs(dy)<80)hint='Boro • invista na pedra rachada';
    if(Math.abs(dx)>25||dy< -48||dy>40)continue;
    if(world.hero==='Boro'&&world.roll>0){
      world.pulse(stone.key);
      world.burst(stone.x,stone.y-20,'#e5bd89',24);
      world.emit('break');world.emit('message','Passagem aberta');
    }else if(Math.abs(world.px-stone.x)>=25){
      world.x=stone.x+Math.sign(world.px-stone.x)*25;world.vx=0;
    }
  }
  for(const ring of LEVEL.passages.rings){
    const key='ring'+ring.x;
    if(world.used.has(key))continue;
    const dx=world.x-ring.x,dy=world.y-30-ring.y;
    if(Math.abs(dx)<145&&Math.abs(dy)<110)hint='Nira • segure o salto para planar pelo anel';
    if(!world.gliding||dx*dx/1156+dy*dy/1600>1)continue;
    world.pulse(key);world.glide=1.05;world.vy=-230;world.floor=null;
    world.burst(ring.x,ring.y,'#aeffe1',16);world.emit('gust');
  }
  return hint;
}
function drawPassages(c,w,cam){
  for(const {x,y,key} of LEVEL.passages.stones){
    if(w.used.has(key)||x<cam-40||x>cam+1000)continue;
    const points=[[-20,0],[-24,-21],[-14,-44],[1,-50],[20,-36],[24,-9],[15,0]];
    c.save();c.translate(x,y);
    shape(c,points,'#526758');
    shape(c,[[-24,-21],[-14,-44],[1,-50],[20,-36],[3,-30],[-4,-16]],'#a2ae80');
    stroke(c,[[-2,-45],[3,-34],[-6,-26],[3,-18],[-4,-6]],'#ffe7a7',3);
    stroke(c,[[-6,-26],[-13,-24],[-17,-30]],'#6c593d',2);
    c.restore();
  }
  for(const {x,y} of LEVEL.passages.rings){
    if(w.used.has('ring'+x)||x<cam-50||x>cam+1010)continue;
    c.save();c.translate(x,y);c.rotate(-.19);
    for(let j=0;j<3;j++){
      c.beginPath();c.ellipse(0,0,17+j*3,32+j*2,0,w.t*1.6+j*2.1,w.t*1.6+j*2.1+3.9);
      c.strokeStyle=j===1?'#305e59':'#cdffe6';c.lineWidth=j===1?3:2;c.stroke();
    }
    for(let j=0;j<3;j++){let a=w.t*1.6+j*2.1;oval(c,21*Math.cos(a),34*Math.sin(a),5,2.4,'#dfd379',a)}
    c.restore();
  }
}
