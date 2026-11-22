'use strict';
const CASCATA = {
  id:'w01_l02', title:'Cascata Escondida', end:7210, checkpoint:3440,
  sections:[[0,'Passarela das Samambaias'],[960,'Tocos da Correnteza'],[2180,'Queda das Andorinhas'],[3370,'Pedra do Abrigo'],[3990,'Fenda das Águas'],[5380,'Galeria da Névoa'],[6540,'Nascente de Cristal']],
  surfaces:[
    [0,680,410,380,'moss'],[680,990,380,403,'bridge'],[1065,1250,398,398,'swing'],[1340,1525,384,384,'swing'],[1605,1815,376,376,'swing'],
    [1900,2430,388,380,'moss'],[2530,2850,401,381,'root'],[2940,3190,370,375,'swing'],[3270,3770,395,375,'moss'],
    [3770,4120,375,410,'moss'],[4120,4610,410,444,'cave'],[4610,5150,444,420,'cave'],[5230,5510,409,384,'moss'],
    [5590,5850,374,374,'swing'],[5940,6170,356,356,'swing'],[6250,6520,354,385,'root'],[6600,6920,399,384,'moss'],[7000,7410,380,363,'moss'],
    [2020,2200,312,309,'branch'],[2290,2480,251,252,'moss'],[3740,3940,300,292,'branch'],[4025,4175,226,220,'moss'],
    [4465,4730,236,236,'cave'],[4800,5050,252,258,'branch'],[5110,5270,305,306,'branch']
  ].map(([a,b,y,z,type],i)=>({a,b,y,z,type,i})),
  foes:[[535,95,'beetle'],[2040,95,'crab'],[2660,90,'beetle'],[3600,110,'beetle'],[4350,110,'crab'],[4890,130,'crab'],[5430,60,'beetle'],[6750,130,'beetle']],
  relics:[[1420,341,'glyph'],[2360,211,'glyph'],[4650,394,'glyph'],[6080,318,'glyph'],[2460,212,'seal'],[4600,193,'seal']],
  marks:[3790,5105],wind:[2145,3890],
  fruitArcs:[[225,545],[900,1090],[1200,1385],[1490,1650],[1760,1950],[2350,2560],[2790,3000],[3120,3320],[3510,3730],[4080,4360],[4420,4600],[4750,4940],[5080,5290],[5470,5640],[5800,5990],[6120,6300],[6480,6670],[6850,7040]]
};
const CONCHAS=LEVEL, conchaLoot=loot;
function selectLevel(id){
  LEVEL=id===CASCATA.id?CASCATA:CONCHAS;
  if(LEVEL===CONCHAS){loot=conchaLoot;return}
  loot=LEVEL.relics.map(([x,y,type])=>({x,y,type}));
  for(const [a,b] of LEVEL.fruitArcs){
    for(let i=0;i<5;i++){
      const u=i/4,x=a+(b-a)*u;
      const y=a===4080?193-59*Math.sin(Math.PI*u):a===4420?194:baseY(x)-40-48*Math.sin(Math.PI*u);
      loot.push({x,y,type:'fruit'});
    }
  }
}
// Thin animated water ribbons. The closest curtain parts when the heroes enter the dry shelf.
function waterCurtain(c,x,width,top,bottom,t,opacity,reduced){
  c.save();c.translate(x,top);c.globalAlpha=opacity;
  const height=bottom-top, gradient=c.createLinearGradient(0,0,width,0);
  gradient.addColorStop(0,'#b4fff000');gradient.addColorStop(.18,'#a4eadbcc');
  gradient.addColorStop(.52,'#e2fff1d9');gradient.addColorStop(.86,'#7bcfc1b0');gradient.addColorStop(1,'#d9fff300');
  c.fillStyle=gradient;c.fillRect(0,0,width,height);
  for(let i=0;i<(reduced?8:23);i++){const y=(t*(130+i%5*19)+i*53)%height;
    const px=width*(.07+((i*31)%83)/100);
    stroke(c,[[px,y],[px-1,Math.min(y+24,height)]],'#f0fff4a8',1.6)
  }
  for(let i=0;i<10;i++)oval(c,width*i/9,height+Math.sin(t*3+i)*4,9+i%4,4,'#ddfff1a0');
  c.restore()
}
