'use strict';
const assets={};for(const name of ['coast','cavern','tree','tower','flowers','sand','stone','bark','rock','beetle0','beetle1','crab0','crab1',...['nira','boro'].flatMap(n=>[0,1,2,3].map(i=>n+i))]){const im=new Image();im.src='./assets/'+name+'.webp';assets[name]=im}
function rng(seed){return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}}
function shape(c,points,fill){c.fillStyle=fill;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill()}
function oval(c,x,y,a,b,fill,rot=0){c.fillStyle=fill;c.beginPath();c.ellipse(x,y,a,b,rot,0,Math.PI*2);c.fill()}
function stroke(c,pts,color,w){c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle=color;c.lineWidth=w;c.stroke()}
function frond(c,x,y,size,flip,colors){
 c.save();c.translate(x,y);c.scale(flip*size,size);let p=[[0,0],[10,-12],[25,-21],[45,-24],[57,-23]];stroke(c,p,colors[0],1.7);
 for(let i=1;i<=8;i++){let u=i/9,xx=u*55,yy=-Math.sin(u*1.65)*23,l=Math.sin(u*Math.PI)*15+3;
 shape(c,[[xx-4,yy+2],[xx+2,yy-l],[xx+9,yy-l-4],[xx+4,yy-2]],colors[1]);shape(c,[[xx,yy],[xx+12,yy+2],[xx+16,yy+l*.7],[xx+5,yy+5]],colors[0])}c.restore()
}
function terrain(s){
 const len=s.b-s.a, oy=80, cvs=document.createElement('canvas');cvs.width=len+16;cvs.height=340;const c=cvs.getContext('2d'),rand=rng(201+s.i*477);c.translate(8,oy);
 const branch=['bridge','root','branch','echo','swing'].includes(s.type),sand=s.type==='sand',cave=s.type==='cave',dy=s.z-s.y;
 const depth=branch?(s.type==='root'?53:26):183;
 const top=[],bottom=[];for(let x=0;x<len;x+=9){let y=dy*x/len;top.push([x,y+rand()*2]);bottom.push([x,y+depth+(branch?Math.sin(x/len*Math.PI)*8:(rand()*19-6))])}top.push([len,dy]);bottom.push([len,dy+depth*.65]);let pts=[...top,...bottom.reverse()];
 let grad=c.createLinearGradient(0,0,0,depth);grad.addColorStop(0,branch?'#a17b45':sand?'#dda964':cave?'#537269':'#677e50');grad.addColorStop(.19,branch?'#77513a':sand?'#cb8f5b':'#526749');grad.addColorStop(1,branch?'#403b32':sand?'#74554d':'#293d40');shape(c,pts,grad);
 c.save();c.clip();
 if(branch){for(let i=0;i<40;i++){let x=rand()*len,y=rand()*depth;let p=[];for(let dx=0;dx<100;dx+=6)p.push([x+dx,dy*(x+dx)/len+y+Math.sin((x+dx)/19+y)*1.8]);stroke(c,p,i%3?'#442f292e':'#f8d39a55',1+rand()*2)}
 for(let i=0;i<len;i+=62){let y=dy*i/len+depth*.6;for(let k=0;k<3;k++){c.strokeStyle='#4e3b2f77';c.lineWidth=1;c.beginPath();c.ellipse(i+15,y,5+k*4,2+k*1.6,-.12,0,7);c.stroke()}}}
 else{for(let row=0;row<5;row++){let x=-rand()*40;while(x<len){let w=32+rand()*70,h=25+rand()*22,y=dy*x/len+16+row*32;shape(c,[[x,y+3],[x+w*.28,y-6],[x+w,y],[x+w*.82,y+h],[x+w*.28,y+h+4],[x-3,y+h*.65]],['#203b3b27','#f9ca8728','#16323926','#e6aa7927'][Math.floor(rand()*4)]);stroke(c,[[x,y+3],[x+w*.28,y-6],[x+w*.73,y-2]],'#f1c29a42',1.4);x+=w+1}}}
 for(let i=0;i<len*1.4;i++){let x=rand()*len,y=dy*x/len+rand()*depth;c.fillStyle=i%2?'#ffe6a524':'#13262820';c.fillRect(x,y,rand()*4+.8,1.3)}// Project the illustrated material along the slope, inside the collision silhouette.
 const tex=assets[branch?'bark':sand?'sand':cave?'rock':'stone'];
 if(tex.naturalWidth){c.save();c.transform(1,dy/len,0,1,0,0);const tile=branch?320:680;for(let j=0;j<len;j+=tile){c.save();c.translate(j,0);if((j/tile)%2){c.translate(tile,0);c.scale(-1,1)}c.drawImage(tex,0,-1,tile,depth+(branch?10:22));c.restore()}c.restore()}c.restore();
 let rim=sand?'#ffe0a2':cave?'#88c0a0':branch?'#c2a263':'#c2d480';stroke(c,top,rim,3.6);
 for(let x=4;x<len-5;x+=6+rand()*10){let y=dy*x/len;if(sand){oval(c,x,y+rand()*6,1+rand()*3,1,'#b88b61');if(rand()<.05)oval(c,x,y,4,2,'#fff1cf',-.3)}else{let h=2+rand()*7;shape(c,[[x-3,y+1],[x-5,y-h],[x,y-2],[x+3,y-h*1.3],[x+4,y+1]],cave?'#6fb095':'#96af62')}}
 for(let x=28;x<len-8;x+=45+rand()*96){let y=dy*x/len;if(rand()>.35){frond(c,x,y,.18+rand()*.38,rand()>.5?1:-1,['#477b58','#80a96b']);if(rand()<.35)for(let j=0;j<3;j++)oval(c,x+j*3,y-4-j*3,2,3,'#e29160',.5)}}
 return cvs
}
const terrainCache=new Map();
for(const n of ['bark','sand','stone','rock'])assets[n].addEventListener?.('load',()=>terrainCache.clear());
function heroArt(c,name,x,y,dir,v,air,rolling,t,scale=1,land=0){
 const moving=Math.abs(v)>12,frame=air?3:moving?1+(Math.floor(t*(Math.abs(v)>350?13:9))%2):0,im=assets[name.toLowerCase()+frame];if(!im?.naturalWidth)return;
 let h=(name==='Boro'?76:68)*(frame===1?.90:1),w=im.width*h/im.height;
 c.save();c.translate(x,y);c.scale(dir*scale,scale);if(rolling&&name==='Nira'){c.translate(0,-24);c.rotate(t*18*dir);c.scale(.78,.72);c.translate(0,26)}else if(rolling)c.transform(1,0,.12,.81,0,0);
 let bob=moving&&!air?Math.sin(t*18)*1.8:Math.sin(t*3)*.65;c.scale(1+land*.68,1-land*.7);c.drawImage(im,-w*.58,-h+bob,w,h);c.restore()
}
function creature(c,f,t){
 const frame=Math.floor(t*(f.attack>0?12:5)+f.phase)%2,im=assets[f.type+frame];
 if(im.naturalWidth){const w=f.type==='crab'?51:50,h=w*im.height/im.width;c.save();c.translate(f.x,f.y);oval(c,0,0,20,3,'#173d3b65');c.scale(f.dir||1,1);c.drawImage(im,-w/2,-h,w,h);if(f.warning){shape(c,[[-1,-h-12],[2,-h-12],[1,-h-5],[-1,-h-5]],'#fff2b5');oval(c,0,-h-2,1,1,'#fff2b5')}c.restore();return}

 let x=f.x,y=f.y,w=Math.sin(t*10+f.phase);
 c.save();c.translate(x,y);oval(c,0,0,19,3,'#14333155');
 for(let i=-1;i<=1;i+=2)for(let j=0;j<3;j++){let q=i*(6+j*4);stroke(c,[[q,-9],[q+i*(6+j),-12+w*2],[q+i*(8+j),-2]],'#4c4134',2.8)}
 if(f.type==='beetle'){oval(c,0,-12,16,11,'#245b5c',-.1);oval(c,-2,-15,14,8,'#69a99a',-.1);stroke(c,[[-13,-12],[-3,-17],[9,-18]],'#eed39c',2);oval(c,13,-10,6,6,'#343c34');oval(c,15,-12,1.7,1.7,'#ffdaa0')}
 else{oval(c,0,-11,16,8,'#d36743');for(const d of [-1,1]){oval(c,d*18,-15-w*2,7,5,'#f59159',d*.5);shape(c,[[d*19,-16],[d*24,-25],[d*24,-15]],'#fbb578');stroke(c,[[d*7,-14],[d*8,-23]],'#994834',3);oval(c,d*8,-23,3,3,'#fff0a4');oval(c,d*8,-23,1.3,1.6,'#2b3931')}}c.restore()
}
function shell(c,x,y,scale,color){c.save();c.translate(x,y);c.scale(scale,scale);c.fillStyle=color;c.beginPath();c.moveTo(0,7);for(let i=0;i<=12;i++){let a=Math.PI+i*Math.PI/12,r=i%2?11:13;c.lineTo(Math.cos(a)*r,Math.sin(a)*r)}c.closePath();c.fill();for(let j=-2;j<=2;j++)stroke(c,[[0,5],[j*4,-9+Math.abs(j)*1.8]],'#995e46',1);c.restore()}
function beacon(c,x,y,active,t,large=false){
 c.save();c.translate(x,y);let k=large?1.7:1;c.scale(k,k);shape(c,[[-17,0],[-12,-8],[-7,-11],[-6,-50],[6,-52],[9,-9],[17,-4],[17,0]],'#45584c');stroke(c,[[-7,-10],[-5,-47]],'#dbb17a',3);oval(c,0,-52,13,5,'#dabb84');
 c.strokeStyle=active?'#ffe5a1':'#b59970';c.lineWidth=3;c.beginPath();c.arc(0,-69,16,0,7);c.stroke();c.rotate(0);shape(c,[[0,-82],[7,-69],[0,-56],[-7,-69]],active?'#a7ffdb':'#f8c77b');if(active){c.globalAlpha=.2+.1*Math.sin(t*3);oval(c,0,-69,24,24,'#b7ffcd')}c.restore()
}
function render(c,w,alpha,reduced){
 const t=w.t,cam=w.pc+(w.camera-w.pc)*alpha,x=w.px+(w.x-w.px)*alpha,y=w.py+(w.y-w.py)*alpha;
 c.setTransform(c.canvas.width/960,0,0,c.canvas.height/540,0,0);c.clearRect(0,0,960,540);
 const bg=assets.coast;if(bg.naturalWidth){const wide=1380,off=cam/(8550-960)*(wide-960);c.drawImage(bg,-off,-100,wide,777)}else{c.fillStyle='#80bea7';c.fillRect(0,0,960,540)}
 // Painted haze and two independently moving layers of sea and foliage.
 let sea=c.createLinearGradient(0,443,0,540);sea.addColorStop(0,'#42aaa8b0');sea.addColorStop(1,'#134f59');c.fillStyle=sea;c.fillRect(0,463,960,77);
 for(let i=0;i<47;i++){let yy=466+(i*37)%78,xx=((i*113-cam*.46+t*(i%3+1)*3)%1050+1050)%1050-55;stroke(c,[[xx,yy],[xx+12,yy-1],[xx+24+i%14,yy]],'#daf5d66b',1.3)}
 for(let i=0;i<4;i++){let bx=(900+i*33+t*9-cam*.09)%1090,by=84+Math.sin(t*.9+i)*3+i%2*9;stroke(c,[[bx-5,by-2],[bx,by+1],[bx+5,by-2]],'#436a635f',1.3)}
 const dark=clamp(1-Math.abs(x-3660)/570,0,1);if(dark&&assets.cavern.naturalWidth){c.globalAlpha=dark;c.drawImage(assets.cavern,-(x-3090)*.12,-35,1140,645);c.globalAlpha=1}else if(dark){c.fillStyle='rgba(8,34,42,'+dark*.67+')';c.fillRect(0,0,960,540)}
 c.save();c.translate(-cam,0);
 for(let i=Math.max(0,Math.floor(cam/194)-1);i<(cam+1100)/194;i++){
 let xx=i*194+Math.sin(i*5)*57,yy=484+Math.sin(i)*16;frond(c,xx,yy,1.25+Math.sin(i)*.44,i%2?1:-1,['#366e67','#578678'])}
 if(!assets.cavern.naturalWidth&&cam<4160&&cam+960>3150){for(let i=0;i<18;i++){let xx=3180+i*54,yy=54+52*Math.sin(i*.7);shape(c,[[xx-90,-20],[xx+80,-20],[xx+57,yy],[xx+19,yy+30],[xx-19,yy+7]],i%2?'#254f4b':'#325954');if(i%3===0){stroke(c,[[xx,yy],[xx+7,yy+34],[xx,yy+67]],'#4d806d',3);oval(c,xx,yy+67,3,4,'#a2e3be')}}}
 for(const sx of LEVEL.wind){if(Math.abs(sx-cam-480)>575)continue;for(let j=0;j<6;j++){let yy=455-((t*73+j*34)%210);c.beginPath();c.moveTo(sx-16,yy);c.bezierCurveTo(sx+32,yy-8,sx-26,yy-21,sx+6,yy-37);c.strokeStyle='#d5ffe3a0';c.lineWidth=2;c.stroke()}}
 function prop(name,px,py,height,flip=false){let im=assets[name];if(!im.naturalWidth||Math.abs(px-cam-480)>1050)return;let width=height*im.width/im.height;c.save();c.translate(px,py);if(flip)c.scale(-1,1);c.drawImage(im,-width*.5,-height,width,height);c.restore()}
 prop('tree',-60,430,300);prop('tree',1210,375,255,true);prop('tree',2990,408,190);prop('tree',6410,326,173,true);prop('tower',8370,baseY(8370)+2,242);
 for(const px of [52,615,1010,1640,2140,2920,4100,4510,5080,5690,6370,7480,7980])prop('flowers',px,baseY(px)+2,35+(px%19),!!(px%3));
 for(const s of LEVEL.surfaces){if(s.b<cam-20||s.a>cam+980||s.type==='echo'&&!w.echo)continue;if(!terrainCache.has(s.i))terrainCache.set(s.i,terrain(s));c.save();c.translate(s.a,surfaceY(s,s.a,t));if(s.type==='swing')c.transform(1,Math.sin(t*1.8)*.055,0,1,0,0);c.drawImage(terrainCache.get(s.i),-8,-80);c.restore()}
 // Etched ancient windstones and the shell lighthouse.
 for(const m of LEVEL.marks){if(Math.abs(m-cam-480)<530){let yy=baseY(m);shape(c,[[m-16,yy],[m-10,yy-40],[m+5,yy-46],[m+15,yy-3]],'#426f63');c.fillStyle='#bcf0c6';c.font='21px Georgia';c.fillText('✧',m-8,yy-16)}}
 beacon(c,LEVEL.checkpoint,baseY(LEVEL.checkpoint),w.check,t);beacon(c,LEVEL.end,baseY(LEVEL.end),true,t,true);
 loot.forEach((p,i)=>{if(w.collected.has(i)||p.x<cam-20||p.x>cam+980)return;let yy=p.y+Math.sin(t*2.7+i)*3,xx=p.x;if(p.type==='fruit'){oval(c,xx,yy,6.2,7.7,'#993e32',.22);oval(c,xx-1,yy-2,5.6,6,'#ffb34f',.22);oval(c,xx+3,yy-8,4.8,2,'#35785b',-.65);oval(c,xx-2,yy-4,1.4,2,'#ffe4a1')}else{oval(c,xx,yy,19,19,'#b5ffcf33');if(p.type==='seal')shell(c,xx,yy,1.2,'#ffe2a2');else{shape(c,[[xx,yy-14],[xx+10,yy],[xx,yy+14],[xx-10,yy]],'#1b7972');stroke(c,[[xx,yy-12],[xx+8,yy],[xx,yy+12],[xx-8,yy],[xx,yy-12]],'#ccfee4',2);stroke(c,[[xx-2,yy+4],[xx+2,yy-4]],'#fff0b4',2)}}});
 for(const f of w.foes)if(!f.dead&&f.x>=cam-40&&f.x<=cam+1000)creature(c,f,t);
 heroArt(c,w.hero==='Nira'?'Boro':'Nira',w.pal.x,w.pal.y,w.pal.face,w.vx,!w.floor,false,t-.17,.76);
 if(w.over){for(let i=0;i<22;i++){let a=i*2.399,phase=(w.celebration||0)*1.7;oval(c,LEVEL.end+Math.cos(a)*phase*58,baseY(LEVEL.end)-110+Math.sin(a)*phase*44-phase*20,2.3,3.8,i%2?'#ffdf96':'#a4f2ce',a)}}
 if(w.floor)oval(c,x,y+1,22,3.5,'#19363065');
 c.globalAlpha=w.inv>0&&Math.floor(t*12)%2?.5:1;heroArt(c,w.hero,x,y,w.face,w.vx,!w.floor,w.roll>0,t,1,w.squash);c.globalAlpha=1;
 if(!reduced){for(const p of w.sparks){c.globalAlpha=clamp(p.life*3,0,1);oval(c,p.x,p.y,2.5,1.6,p.color)}c.globalAlpha=1}
 c.restore();
 for(let i=0;i<5;i++){let xx=((i*289-cam*1.13)%1300+1300)%1300-140;frond(c,xx,558,1.5+Math.sin(i)*.25,i%2?1:-1,['#154841','#29614e'])}
}
