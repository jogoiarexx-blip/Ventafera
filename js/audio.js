'use strict';
class Soundscape{
 constructor(){this.volume=.55;this.music=true;this.next=0;this.beat=0}
 unlock(){try{if(!this.ctx){this.ctx=new AudioContext();this.master=this.ctx.createGain();this.master.connect(this.ctx.destination);this.setVolume(this.volume)}if(this.ctx.state==='suspended')this.ctx.resume().catch(()=>{})}catch{}}
 setVolume(v){this.volume=v;if(this.master)this.master.gain.setTargetAtTime(v*.55,this.ctx.currentTime,.03)}
 tone(freq,len,amp,type='sine',delay=0,end=freq){
  if(!this.ctx||!this.volume)return;let t=this.ctx.currentTime+delay,o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);o.frequency.exponentialRampToValueAtTime(end,t+len);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(amp,t+.009);g.gain.exponentialRampToValueAtTime(.0001,t+len);o.connect(g);g.connect(this.master);o.start(t);o.stop(t+len+.02);o.onended=()=>{o.disconnect();g.disconnect()}
 }
 fx(e){const notes={jump:[300,.13,.14,'sine',0,510],roll:[135,.19,.15,'triangle',0,62],land:[110,.08,.10,'sine',0,53],fruit:[840,.14,.12,'sine',0,1120],hurt:[146,.22,.16,'triangle',0,63],stomp:[175,.17,.22,'triangle',0,82],swap:[462,.2,.12,'sine',0,690],throw:[320,.25,.12,'sine',0,830]};if(notes[e])this.tone(...notes[e]);if(['seal','glyph','checkpoint','win'].includes(e)){(e==='win'?[0,4,7,12,16]:[0,7,12]).forEach((n,i)=>this.tone(392*2**(n/12),.52,.13,'sine',i*.11))}}
 tick(zone){if(!this.ctx||!this.music||this.ctx.state!=='running')return;let now=this.ctx.currentTime;if(this.next>now+.12)return;if(this.next<now)this.next=now;
 const root=[50,55,52,57][Math.floor(this.beat/16)%4],step=this.beat%16,delay=this.next-now,hz=n=>440*2**((n-69)/12);if(step%4===0)this.tone(hz(root-12),.55,.13,'sine',delay);if([0,3,6,8,11,14].includes(step))this.tone(hz(root+[12,19,16,14,19,21][[0,3,6,8,11,14].indexOf(step)]),zone===3?.62:.34,.075,'triangle',delay);if(zone>=4&&step%4===2)this.tone(155,.09,.11,'sine',delay,73);this.next+=.197;this.beat++}
}
