'use strict';
// Coordinates are in world pixels. Each surface uses its two top endpoints.
let LEVEL = {
  id:'w01_l01', title:'Trilha das Conchas', end:8350, checkpoint:4130,
  sections:[[0,'Enseada do Sol'],[980,'Raiz dos Ventos'],[2070,'Ponte de Galhos'],[3250,'Gruta das Marés'],[4280,'Véu da Cascata'],[5400,'Escada de Musgo'],[6480,'Ponte Viva'],[7460,'Farol das Conchas']],
  surfaces:[
    [0,700,414,414,'sand'],[700,1160,414,363,'sand'],[1160,1540,363,389,'root'],[1540,1980,389,417,'sand'],
    [2090,2460,397,378,'root'],[2460,2800,378,394,'bridge'],[2900,3170,398,396,'moss'],[3170,3650,396,417,'cave'],[3650,4220,417,406,'cave'],
    [4220,4700,406,441,'moss'],[4820,5170,428,412,'root'],[5260,5500,404,395,'moss'],[5600,5810,365,365,'moss'],[5910,6150,333,326,'moss'],
    [6260,6510,310,319,'moss'],[6510,6770,319,360,'root'],[6840,7180,366,366,'swing'],[7270,7530,365,386,'moss'],[7530,7810,386,392,'sand'],[7920,8550,402,365,'sand'],
    [1250,1430,285,282,'branch'],[3300,3450,320,318,'branch'],[3520,3710,260,260,'branch'],[3820,3950,205,211,'branch'],
    [6630,6760,245,245,'branch'],[6860,7040,203,203,'echo'],[7120,7250,194,200,'branch']
  ].map(([a,b,y,z,type],i)=>({a,b,y,z,type,i})),
  foes:[[690,115,'beetle'],[1710,125,'crab'],[2200,125,'beetle'],[2980,90,'crab'],[4380,100,'beetle'],[4570,77,'beetle'],[4980,92,'crab'],[6360,60,'beetle'],[7600,104,'crab']],
  relics:[[1330,247,'glyph'],[3610,224,'glyph'],[6040,286,'glyph'],[8050,346,'glyph'],[3880,167,'seal'],[7180,152,'seal']],
  marks:[3410,6635], wind:[5350,6600]
};
function surfaceY(s,x,t){
  const tilt=s.type==='swing'?Math.sin(t*1.8)*(x-(s.a+s.b)/2)*.055:0;
  return s.y+(s.z-s.y)*(x-s.a)/(s.b-s.a)+tilt;
}
function baseY(x){const s=LEVEL.surfaces.find(s=>x>=s.a&&x<=s.b);return s?surfaceY(s,x,0):410}
let loot=LEVEL.relics.map(([x,y,type])=>({x,y,type}));
for(const [a,b] of [[250,570],[970,1210],[1560,1840],[1930,2160],[2360,2660],[2710,2950],[3120,3360],[3720,4000],[4310,4610],[4650,4870],[5100,5330],[5470,5660],[5770,5980],[6110,6330],[6480,6690],[6720,6910],[7150,7350],[7740,7970],[8040,8290]]){
  for(let i=0;i<5;i++){const x=a+(b-a)*i/4;loot.push({x,y:baseY(x)-36-50*Math.sin(Math.PI*i/4),type:'fruit'})}
}
