(function(){
'use strict';
const $=s=>document.querySelector(s);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const lerp=(a,b,t)=>a+(b-a)*t;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const rnd=(a,b)=>a+Math.random()*(b-a);

/* ---------- data ---------- */
const REG=[
  {name:'Хангайн хөндий',sky:['#3d7096','#f1c58b'],sun:'#fbe3a6',sx:270,sy:104,sr:26,m:['#3f6a63','#2f5651'],ground:'#557f46',ground2:'#436b39',deco:'ger'},
  {name:'Говийн цөл',sky:['#e7a257','#f8e0a6'],sun:'#fff3c9',sx:90,sy:96,sr:30,m:['#c8985a','#b5834a'],ground:'#d9b266',ground2:'#c79d52',deco:'dunes'},
  {name:'Алтайн цас',sky:['#8db3cf','#e8eff3'],sun:'#ffffff',sx:290,sy:70,sr:20,m:['#c6d6e1','#a9bfcf'],ground:'#eef3f5',ground2:'#d3dfe5',snow:true,deco:'none'},
  {name:'Хөвсгөл нуур',sky:['#0f2139','#3a5680'],sun:'#e9edf6',sx:80,sy:64,sr:16,m:['#27405f','#1d3350'],ground:'#2d4c3b',ground2:'#243f31',stars:true,lake:true,deco:'pines'},
  {name:'Хятадын Их Хэрэм',sky:['#6f8fb0','#f0d9a8'],sun:'#fff1c2',sx:80,sy:92,sr:24,m:['#7f8f6a','#667653'],ground:'#8a9a5a',ground2:'#76864a',deco:'wall'},
  {name:'Торгоны зам',sky:['#d9784a','#ffd9a0'],sun:'#fff3d0',sx:290,sy:96,sr:30,m:['#c9935a','#b7814b'],ground:'#e0b878',ground2:'#cfa564',deco:'minaret'},
  {name:'Нилийн хөндий',sky:['#f2b45a','#ffe6b0'],sun:'#fff7d6',sx:70,sy:90,sr:34,m:['#d9a85c','#c99a50'],ground:'#e6c07a',ground2:'#d4ab62',deco:'pyramid'},
  {name:'Европын цайз',sky:['#5a7aa8','#d4dde8'],sun:'#fffbe6',sx:290,sy:80,sr:20,m:['#4f7a4f','#3d6a45'],ground:'#4f8a4a',ground2:'#3f7a3c',deco:'castle'},
  {name:'Сибирийн тайга',sky:['#8aa6c4','#e3ebf2'],sun:'#ffffff',sx:80,sy:84,sr:18,m:['#9fb2c4','#8498ad'],ground:'#e8eef2',ground2:'#cfdbe3',snow:true,deco:'taiga'},
  {name:'Энэтхэгийн сүм',sky:['#e0603f','#ffd08a'],sun:'#fff0c0',sx:280,sy:100,sr:32,m:['#b3664a','#9b5440'],ground:'#d9a15a',ground2:'#c58d48',deco:'temple'},
  {name:'Африкийн саванна',sky:['#ee8236','#ffd27a'],sun:'#fff0b8',sx:100,sy:110,sr:38,m:['#b87b3a','#a06830'],ground:'#c9a14a',ground2:'#b58c3c',deco:'acacia'},
  {name:'Дэлхийн оргил',sky:['#120a2e','#5a3a8a'],sun:'#f0e8ff',sx:290,sy:60,sr:14,m:['#3a2a66','#2a1e4e'],ground:'#2b2b4a',ground2:'#22223c',stars:true,deco:'peak'}
];
const GROUND=238;
const NL=40;
const BASE=[
 ['Хээрийн чоно','wolf',0,'Өвгөн: «Шөнө чоно маль руу ойртож байна. Чи л туслаж чадна, бөх минь.»'],
 ['Нэг нүдтэй чоно','wolf',0,'Малчин: «Энэ чоно өчигдөр нэг хурга авсан. Дахиж ирэхгүй байлгаарай.»'],
 ['Замын дээрэмчин','bandit',0,'Худалдаачин: «Тэрэгний замд дээрэмчин гарч, бараагаа алдлаа.»'],
 ['Хангайн хар чоно','wolf',0,'Анчин: «Хар чоно сүргийнхээ толгойд явдаг. Болгоомжтой яваарай.»'],
 ['Шар чоно хан','wolf',1,'Өвгөн: «Сүргийн толгой ирлээ. Айх хэрэггүй, нүдийг нь хар!»'],
 ['Элсний дээрэмчин','bandit',0,'Говийн хүн: «Элсэн шуурганд дээрэмчид нуугдаж байна.»'],
 ['Говийн мангас','brute',0,'Тэмээчин: «Цөлд том мангас байна гэсэн. Худлаа биш бололтой.»'],
 ['Цөлийн чоно','wolf',0,'Малчин: «Ус хайсан чоно хүртэл ширүүн болжээ.»'],
 ['Каравны дээрэмчин','bandit',0,'Худалдаачин: «Манай караваныг дээрэмдлээ. Ахлагч нь ойрхон байгаа.»'],
 ['Дээрэмчдийн ахлагч','bandit',1,'Тэмээчин: «Тэр л бүх дээрэмчний толгой. Түүнийг ялбал зам чөлөөтэй болно.»'],
 ['Алтайн цагаан чоно','wolf',0,'Анчин: «Цасан дунд цагаан чоно харагдахгүй. Чимээгээр нь мэд.»'],
 ['Цасны албин','spirit',0,'Шаман: «Албин хүйтэн салхи дагуулж ирдэг. Дулаанаа бүү алд.»'],
 ['Мөсөн мангас','brute',0,'Малчин: «Мөсөн мангас хад чулууг цохиж байна.»'],
 ['Салхины сүнс','spirit',0,'Шаман: «Салхины сүнс хурдан. Хамгаалалтаа зөв ашигла.»'],
 ['Цасны хатан албин','spirit',1,'Шаман: «Алтайн хатан гарч ирлээ. Нүдийг нь бүү ай.»'],
 ['Нуурын шөнийн сүнс','spirit',0,'Загасчин: «Нуурын эрэг шөнө гэрэлтдэг болжээ.»'],
 ['Нуурын мангас','brute',0,'Загасчин: «Тэр мангас миний торыг урж хаяв.»'],
 ['Ойн албин','spirit',0,'Ойчин: «Мод бүр шивнэж байна. Албин ойр байна.»'],
 ['Хар хүн','brute',0,'Шаман: «Хар хүн хүчээ цуглуулж байна. Том тулаан ойрхон.»'],
 ['Хар мангас хан','brute',1,'Шаман: «Хар мангас хан гарч ирлээ. Гэхдээ энэ бол төгсгөл биш.»']
];
const NPOOL=[
 [['Хангайн чоно','wolf'],['Хээрийн дээрэмчин','bandit'],['Ойн мангас','brute'],['Тэнгэрийн албин','spirit']],
 [['Говийн чоно','wolf'],['Элсний нүүдэлчин дээрэмчин','bandit'],['Цөлийн мангас','brute'],['Мираж албин','spirit']],
 [['Цасны чоно','wolf'],['Хадны дээрэмчин','bandit'],['Мөсөн мангас','brute'],['Борооны албин','spirit']],
 [['Нуурын чоно','wolf'],['Эргийн дээрэмчин','bandit'],['Гүний мангас','brute'],['Шөнийн албин','spirit']]
];
const WORLD=[
 {line:'Өвгөн: «Монголыг хамгаалсан бөх хэрмийн цаадах ертөнцийг харах цаг боллоо. Эхлээд хэрмийн манаачдыг ял.»',e:[['Хэрмийн манаач','bandit'],['Хилийн чоно','wolf'],['Дайны бөх','brute'],['Харуулын сүнс','spirit']],b:['Хэрмийн жанжин','brute']},
 {line:'Худалдаачин: «Торгоны замыг дээрэмчид хаажээ. Чи замыг нээвэл дэлхий чамд замаа тавина.»',e:[['Каравны дээрэмчин','bandit'],['Оазисын чоно','wolf'],['Цөлийн мангас','brute'],['Минаретын албин','spirit']],b:['Торгоны замын хаан','bandit']},
 {line:'Шаман: «Нилийн эрэгт эртний сүнснүүд сэрсэн. Тэднийг тайвшруулж чадвал Монгол бөхийн нэр дуурсана.»',e:[['Пирамидын харуул','brute'],['Элсний чоно','wolf'],['Мумийн сүнс','spirit'],['Булшны дээрэмчин','bandit']],b:['Фараоны сүнс','spirit']},
 {line:'Аялагч: «Баруунд цайз олон. Тэндээс ялбал Монгол бөх Европт нэрээ үлдээнэ.»',e:[['Цайзын цэрэг','bandit'],['Ойн чоно','wolf'],['Шөнийн сүнс','spirit'],['Төмөр бөх','brute']],b:['Цайзын гүн','brute']},
 {line:'Анчин: «Хойд зүгийн тайга хязгааргүй. Хүйтэн энд бүр хатуу.»',e:[['Тайгын чоно','wolf'],['Анчин дээрэмчин','bandit'],['Цасан арслан','brute'],['Хүйтний сүнс','spirit']],b:['Тайгын хатан','spirit']},
 {line:'Лам: «Энэтхэгийн сүмүүдэд эртний хүч нуугдаж байна. Болгоомжтой яв.»',e:[['Сүмийн харуул','bandit'],['Бар','wolf'],['Чулуун бурхан','brute'],['Тэнгэрийн сүнс','spirit']],b:['Алтан хаан','brute']},
 {line:'Аялагч: «Африкийн нарны доор хүчтэй ан амьтан бий. Айх хэрэггүй.»',e:[['Саваннагийн арслан','wolf'],['Далайн дээрэмчин','bandit'],['Хар бөх','brute'],['Борооны сүнс','spirit']],b:['Арслан хан','wolf']},
 {line:'Шаман: «Дэлхийн оргилд хүчтэй дайснууд хүлээж байна. Монгол бөх дэлхийг байлдан дагуулна!»',e:[['Оргилын сүнс','spirit'],['Мөсөн чоно','wolf'],['Тэнгэрийн харуул','bandit'],['Огторгуйн мангас','brute']],b:['Огторгуйн хаан','brute']}
];
const CHB=[
 ['Хангайн эзэн мангас','brute','Өвгөн: «Хангайн хөндийн эзэн мангас гарч ирлээ. Үүнийг ялбал хөндий чөлөөтэй болно.»'],
 ['Говийн хорт хаан','bandit','Тэмээчин: «Говийн хорт хаан хамгийн шунахай. Түүний ордонд бүү алдар.»'],
 ['Алтайн мөсөн хаан','spirit','Шаман: «Алтайн мөсөн хаан цасан шуурга дуудаж байна. Дулаанаа хадгал.»'],
 ['Тэнгэр залгигч мангас','brute','Шаман: «Сүүлчийн тулаан! Мөнх Хөх Тэнгэр чамайг харж байна.»'],
 ['Хэрмийн хаан','brute','Өвгөн: «Хэрмийн хаан хаалгаа хаасан. Түүнийг ялбал хятадын тал нээгдэнэ.»'],
 ['Торгоны ордны харуул','bandit','Худалдаачин: «Торгоны ордны харуул замыг хаасан. Үүнийг ялбал дараагийн орон нээгдэнэ.»'],
 ['Нилийн нууц хаан','spirit','Шаман: «Нилийн нууц хаан эртний хараал дуудаж байна.»'],
 ['Европын хар гүн','brute','Аялагч: «Хар гүн цайзынхаа хаалгыг хаажээ. Түүнийг ялбал Европ чамд нээгдэнэ.»'],
 ['Сибирийн цасан хаан','wolf','Анчин: «Цасан хаан нэг чоно биш, бүхэл бүтэн сүрэг дагуулдаг.»'],
 ['Сүмийн хар бурхан','brute','Лам: «Сүмийн хар бурхан сэрлээ. Чулуу ч чамд бууж өгөхгүй.»'],
 ['Африкийн нарны хаан','wolf','Аялагч: «Нарны хаан саваннаг эзэмшдэг. Түүний нүднээс бүү ай.»'],
 ['Дэлхийн эзэн мангас','brute','Шаман: «Сүүлчийн сүүлчийн тулаан! Чи дэлхийн эзэн болох гэж байна!»']
];
const GEN_ADJ=['Ууртай','Хар','Ширүүн','Хүчирхэг','Нууцлаг','Эртний','Галт','Мөсөн'];
const GEN_LINES=['Өвгөн: «Замаа үргэлжлүүл, бөх минь. Хүчтэй дайсан дахин ирлээ.»','Малчин: «Чамайг хүлээж байсан. Энэ дайсныг ялбал зам чөлөөтэй.»','Шаман: «Хийморь чинь өсч байна. Айх хэрэггүй.»','Анчин: «Тэр чиний хүчийг сорих гэж байна.»','Аялагч: «Бүх дэлхий чамайг харж байна.»'];
const lc=x=>x.charAt(0).toLowerCase()+x.slice(1);
function levelOf(m,c,k){
  const reg=m*4+c,i=c*10+k,n=i+1;
  const par=b=>b?13+Math.floor(n/5):6+Math.floor(n/6);
  if(k===9){const b=CHB[reg];return{n,name:b[0],kind:b[1],boss:true,line:b[2],region:reg,mode:m,par:par(true)}}
  let e,boss=false,line;
  if(k<5){
    if(m===0){const a=BASE[c*5+k];e=[a[0],a[1]];boss=!!a[2];line=a[3]}
    else{const W=WORLD[(m-1)*4+c];e=k===4?W.b:W.e[k];boss=k===4;line=W.line}
  }else{
    const pool=m===0?NPOOL[c]:WORLD[(m-1)*4+c].e,base=pool[(k+c)%4];
    e=[GEN_ADJ[(k*3+c+m)%8]+' '+lc(base[0]),base[1]];line=GEN_LINES[(k+c)%5];
  }
  return{n,name:e[0],kind:e[1],boss,line,region:reg,mode:m,par:par(boss)};
}
const LVALL=[0,1,2].map(m=>{const out=[];for(let c=0;c<4;c++)for(let k=0;k<10;k++)out.push(levelOf(m,c,k));return out});
const MODE_NAMES=['Хэвийн','Хэцүү','Галзуу'],MODE_SUB=['Монгол','Дэлхий','Дэлхий II'];
const MODE_STORY=['','Монголыг хамгаалсан бөх одоо дэлхийн аян эхэлж байна.','Дэлхийн хамгийн хатуу дайснууд хүлээж байна.'];
const WIN_TXT=['Хар мангас хан ялагдлаа. Хээр тал амар тайван боллоо. Одоо Монгол бөхийн нэр хилийн чанадад дуурсана. Дэлхийн аян нээгдлээ!','Дэлхийн оргилд нэг алхам үлдлээ. Эртний хүчнүүд сэрж байна. Галзуу горим нээгдлээ!','Хээр талын бөх дэлхийн эзэн боллоо! Чи жинхэнэ домог.'];
const LVL=()=>LVALL[S.mode];
const P=()=>S.mode===0?S:S.prog[S.mode];
const parOf=L=>L.par+[0,3,6][L.mode||0];


const QUESTS=[
 {id:'k5',t:'5 дайсныг ялах',key:'kills',goal:5,gold:50},
 {id:'pf',t:'«Гайхалтай» цохилтыг 6 удаа хийх',key:'perfect',goal:6,gold:80},
 {id:'th',t:'Бөхийн шидэлтийг 8 удаа хийх',key:'throws',goal:8,gold:80},
 {id:'ch1',t:'Хангайн хөндийг дуусгах (10-р түвшин)',key:'cleared',goal:10,gold:100,potion:1},
 {id:'pt',t:'Айраг 4 удаа уух',key:'potions',goal:4,gold:60},
 {id:'gd',t:'12 удаа хамгаалах',key:'guards',goal:12,gold:70},
 {id:'st',t:'15 од цуглуулах',key:'stars',goal:15,gold:120,potion:1},
 {id:'dl',t:'Өдрийн тулааныг 3 удаа ялах',key:'daily',goal:3,gold:120},
 {id:'k20',t:'20 дайсныг ялах',key:'kills',goal:20,gold:150,potion:2},
 {id:'ch2',t:'Говийн цөлийг дуусгах (20-р түвшин)',key:'cleared',goal:20,gold:200,potion:2},
 {id:'ch3',t:'Алтайн цасыг дуусгах (30-р түвшин)',key:'cleared',goal:30,gold:300,potion:2},
 {id:'ch4',t:'Тэнгэр залгигч мангасыг ялах (40-р түвшин)',key:'cleared',goal:40,gold:500,potion:3},
 {id:'mg',t:'Эд хэрэгслийг 3 удаа нэгтгэх',key:'merged',goal:3,gold:150,potion:1},
 {id:'wv10',t:'Төгсгөлгүй горимд 10 давалгаа давах',key:'wave',goal:10,gold:250,potion:2},
 {id:'wv25',t:'Төгсгөлгүй горимд 25 давалгаа давах',key:'wave',goal:25,gold:600,potion:3},
 {id:'up5',t:'Эд хэрэгслээ 5 удаа сайжруулах',key:'upg',goal:5,gold:100,potion:1},
 {id:'hd',t:'Хэцүү горимыг дуусгах (дэлхийн аян)',key:'hardcleared',goal:40,gold:600,potion:3},
 {id:'in',t:'Галзуу горимыг дуусгах',key:'insanecleared',goal:40,gold:1200,potion:5}
];
const SHOP=[
 {id:'atk',n:'Бөхийн хүч',d:'Цохилт +2',max:15,cost:l=>40+30*l},
 {id:'hp',n:'Биеийн тамир',d:'Амь +12',max:15,cost:l=>40+30*l},
 {id:'def',n:'Хуяг',d:'Авах гэмтэл −1',max:10,cost:l=>60+50*l},
 {id:'chi',n:'Хийморь',d:'Тулаан эхлэх хийморь +10',max:5,cost:l=>50+60*l}
];
const DAILY_KIND=['wolf','bandit','spirit','brute'];
const DAILY_ADJ=['Улаан','Хар','Цагаан','Ширүүн','Хурдан','Нууцлаг'];
const DAILY_NOUN={wolf:'чоно',bandit:'дээрэмчин',spirit:'албин',brute:'мангас'};
const MODS=[
 {id:'wind',t:'Салхитай өдөр',d:'Дайсны цохилт +25%',bad:1,eAtk:1.25},
 {id:'cold',t:'Хүйтэн өдөр',d:'Хийморь хоёр дахин удаан цуглана',bad:1,chiMul:.5},
 {id:'sun',t:'Наранд гэрэлтсэн өдөр',d:'Таны цохилт +25%',dmg:1.25},
 {id:'rain',t:'Алтан бороо',d:'Шагналын алт хоёр дахин',goldMul:2}
];

/* ---------- save ---------- */
const KEY='tengeriin-buh-v1';
let memSave=null;
function padStars(a){a=Array.isArray(a)?a.slice(0,NL):[];while(a.length<NL)a.push(0);return a}
const fresh=()=>({cls:0,picked:false,hs:{},er:{},lvl:1,xp:0,gold:0,potions:2,up:{atk:0,hp:0,def:0,chi:0},stars:new Array(NL).fill(0),cleared:0,
  st:{kills:0,perfect:0,throws:0,potions:0,guards:0,daily:0,upg:0},claimed:{},daily:{last:'',streak:0},muted:false,seen:false,mode:0,prog:[null,{cleared:0,stars:new Array(NL).fill(0)},{cleared:0,stars:new Array(NL).fill(0)}],items:[],eq:{w:null,a:null,c:null},timing:false,nid:0,endless:{best:0,runs:0}});
let S=fresh();
function load(){
  let raw=null;
  try{raw=localStorage.getItem(KEY)}catch(e){}
  if(!raw)raw=memSave;
  if(raw){try{const o=JSON.parse(raw);S=Object.assign(fresh(),o);S.up=Object.assign(fresh().up,o.up);S.st=Object.assign(fresh().st,o.st);S.stars=padStars(S.stars);if(!S.prog||!S.prog[1]||!S.prog[2])S.prog=fresh().prog;[1,2].forEach(m=>{S.prog[m].stars=padStars(S.prog[m].stars)});if(!S.endless)S.endless={best:0,runs:0};if(!Array.isArray(S.items))S.items=[];S.eq=Object.assign({w:null,a:null,c:null},S.eq);if(![0,1,2].includes(S.mode))S.mode=0;if(![0,1,2,3,4].includes(S.cls))S.cls=0;if(!S.er||typeof S.er!=='object')S.er={};if(!S.hs||typeof S.hs!=='object')S.hs={};S.items.forEach(it=>{if(it.k==null){let k=-1;if(Object.values(S.eq).includes(it.id))k=S.cls;else for(const i in S.hs){const h=S.hs[i];if(h&&h.eq&&Object.values(h.eq).includes(it.id)){k=+i;break}}it.k=k<0?it.id%5:k}});if(!S.hs||typeof S.hs!=='object')S.hs={}}catch(e){S=fresh()}}
}
function save(){const s=JSON.stringify(S);memSave=s;try{localStorage.setItem(KEY,s)}catch(e){}}

/* ---------- stats ---------- */
const RAR=[{n:'Энгийн',c:'#93acb8'},{n:'Сайн',c:'#46b394'},{n:'Ховор',c:'#7aa7ff'},{n:'Домог',c:'#e9b44c'}];
const CL=[
 {n:'Бөх',ds:'Тэнхлэг сайтай. Шидэлт нь дайсныг ухаан алдуулна.',hp:1.1,atk:1,def:0,st:'Цохих',th:'Бөхийн шидэлт',sk:{wind:'Салхин цохилт',bless:'Тэнгэрийн ерөөл',bolt:'Тэнгэрийн аянга'},slot:{w:'Зэр зэвсэг',a:'Хуяг',c:'Эрдэнэ'},nm:{w:['Модон бороохой','Төмөр хутга','Хөх сэлэм','Тэнгэрийн сэлэм'],a:['Арьсан дээл','Төмөр хуяг','Хөх хуяг','Алтан хуяг'],c:['Чулуун эрдэнэ','Хөх эрдэнэ','Хийморийн эрдэнэ','Чандмань эрдэнэ']},d:'Салхин цохилт: хоёр хурдан цохилт. Ерөөл: дараагийн цохилтыг бүрэн хаана, амь сэргээнэ. Аянга: хамгаалалтыг даван маш хүчтэй цохино.'},
 {n:'Харваач',ds:'Алсаас харвана. Амь бага, гэхдээ цохилт хүчтэй, яг оноох магадлал өндөр.',hp:.85,atk:1.18,def:0,st:'Сум харвах',th:'Сумны бороо',sk:{wind:'Хурдан харвалт',bless:'Тэнгэрийн ерөөл',bolt:'Тэнгэр онох сум'},slot:{w:'Нум',a:'Хантааз',c:'Сумны уут'},nm:{w:['Модон нум','Эвэр нум','Хөх нум','Тэнгэрийн нум'],a:['Арьсан хантааз','Хөнгөн хуяг','Хөх хантааз','Алтан хантааз'],c:['Энгийн сумны уут','Хөх сумны уут','Хийморийн сумны уут','Чандмань сумны уут']},d:'Сумны бороо: таван сум. Хурдан харвалт: гурван сум. Ерөөл: дараагийн цохилтыг хаана. Тэнгэр онох сум: хамгаалалтыг даван маш хүчтэй онно.'},
 {n:'Морьт цэрэг',ds:'Морьтой. Хийморь хурдан цуглана, ерөөл илүү их эдгээнэ, хуяг нэмэлттэй.',hp:1,atk:1.1,def:1,st:'Морин довтолгоо',th:'Морин мөргөлдөөн',sk:{wind:'Морин давшилт',bless:'Айргийн ерөөл',bolt:'Мянгат давшилт'},slot:{w:'Жад',a:'Хуяг',c:'Эмээл'},nm:{w:['Модон жад','Төмөр жад','Хөх жад','Тэнгэрийн жад'],a:['Арьсан хуяг','Төмөр хуяг','Хөх хуяг','Алтан хуяг'],c:['Энгийн эмээл','Хөх эмээл','Хийморийн эмээл','Чандмань эмээл']},d:'Морин мөргөлдөөн: дайсныг ухаан алдуулна. Морин давшилт: хоёр хурдан цохилт. Айргийн ерөөл: цохилтыг хаана, 25% эдгээнэ. Мянгат давшилт: хамгаалалтыг даван маш хүчтэй цохино.'},
 {n:'Бөө',ds:'Сүнс дууддаг. Хийморь маш хурдан цуглана, сүнсээр амаа эдгээнэ.',hp:.9,atk:1.05,def:0,st:'Бөөгийн цохилт',th:'Сүнс дуудах',sk:{wind:'Сүнсний сум',bless:'Бөөгийн ерөөл',bolt:'Тэнгэрийн аянга'},slot:{w:'Хэнгэрэг',a:'Бөөгийн дээл',c:'Тотем'},nm:{w:['Модон таяг','Хүрэл хэнгэрэг','Хөх хэнгэрэг','Тэнгэрийн хэнгэрэг'],a:['Арьсан дээл','Бөөгийн дээл','Хөх бөөгийн дээл','Алтан бөөгийн дээл'],c:['Модон тотем','Хөх тотем','Хийморийн тотем','Чандмань тотем']},d:'Сүнс дуудах: гурван сүнсэн сум, амь 10% нөхөнө. Сүнсний сум: дөрвөн сум. Бөөгийн ерөөл: цохилтыг хаана, 20% эдгээнэ. Аянга: хамгаалалтыг даван маш хүчтэй цохино.'},
 {n:'Хоньчин залуу',ds:'Сургаар чулуу шидэнэ. Хонь нь дайсныг ухаан алдуулна, ерөөл 25% эдгээнэ.',hp:1.05,atk:.95,def:0,st:'Чулуу шидэх',th:'Хонио дуудах',sk:{wind:'Цуврал чулуу',bless:'Малчны ерөөл',bolt:'Хонин сүргийн давшилт'},slot:{w:'Сур',a:'Дээл',c:'Хонх'},nm:{w:['Энгийн дэгээ','Арьсан сур','Хөх сур','Тэнгэрийн сур'],a:['Хуучин дээл','Бүс дээл','Хөх дээл','Алтан дээл'],c:['Хонины хонх','Хөх хонх','Хийморийн хонх','Чандмань хонх']},d:'Хонио дуудах: дөрвөн чулуу, дайсан ухаан алдана. Цуврал чулуу: гурван чулуу. Малчны ерөөл: цохилтыг хаана, 25% эдгээнэ. Хонин сүргийн давшилт: хамгаалалтыг даван маш хүчтэй цохино.'}
];
const cl=()=>CL[S.cls||0];
const SLOTN=new Proxy({},{get:(_,k)=>cl().slot[k]});
const INAME={w:['Модон бороохой','Төмөр хутга','Хөх сэлэм','Тэнгэрийн сэлэм'],a:['Арьсан дээл','Төмөр хуяг','Хөх хуяг','Алтан хуяг'],c:['Чулуун эрдэнэ','Хөх эрдэнэ','Хийморийн эрдэнэ','Чандмань эрдэнэ']};
const MPRE=['','Дэлхийн ','Мөнхийн '];
const ik=it=>it.k==null?(S.cls||0):it.k;
const slotOf=it=>CL[ik(it)].slot[it.s];
const wornAll=()=>{const a=Object.values(S.eq);for(const i in S.hs){const h=S.hs[i];if(h&&h.eq&&+i!==S.cls)a.push(...Object.values(h.eq))}return a};
const iName=it=>MPRE[it.m]+CL[ik(it)].nm[it.s][it.r]+(ik(it)!==S.cls?' ('+CL[ik(it)].n+')':'');
function iStat(it){const mm=1+.6*it.m,u=it.u;
  if(it.s==='w')return{atk:Math.round([3,6,10,16][it.r]*mm*(1+.25*u))};
  if(it.s==='a')return{hp:Math.round([14,28,46,72][it.r]*mm*(1+.25*u)),def:Math.round([0,1,2,3][it.r]*mm*(1+.15*u))};
  return{chiS:Math.round([6,12,18,26][it.r]*(1+.4*it.m)*(1+.2*u)),chiG:Math.round([8,14,20,30][it.r]*(1+.3*it.m)*(1+.1*u))};}
function iText(it){const t=iStat(it);return it.s==='w'?'Цохилт +'+t.atk:it.s==='a'?'Амь +'+t.hp+(t.def?', Хуяг +'+t.def:''):'Эхлэх хийморь +'+t.chiS+', хийморь олох +'+t.chiG+'%'}
function gear(){const g={atk:0,hp:0,def:0,chiS:0,chiG:0};['w','a','c'].forEach(k=>{const it=S.items.find(x=>x.id===S.eq[k]);if(it){const t=iStat(it);for(const q in t)g[q]+=t[q]}});return g}
function gearLook(){const f=k=>S.items.find(x=>x.id===S.eq[k]),w=f('w'),a=f('a'),c=f('c');return{wcol:w?RAR[w.r].c:null,dcol:a?['#2e6f95','#2f8a74','#3d63c0','#b27a1f'][a.r]:null,ccol:c?RAR[c.r].c:null}}
const heroMax=()=>Math.round((100+14*(S.lvl-1)+12*S.up.hp)*cl().hp)+gear().hp;
const heroAtk=()=>(13+2.2*(S.lvl-1)+2*S.up.atk)*cl().atk+gear().atk;
const heroDef=()=>S.up.def+cl().def+gear().def+((B&&B.run)?B.run.def:0);
const xpNeed=l=>40+25*l;
const totalStars=()=>S.stars.reduce((a,b)=>a+b,0);
function qVal(k){return k==='wave'?S.endless.best:k==='hardcleared'?S.prog[1].cleared:k==='insanecleared'?S.prog[2].cleared:k==='cleared'?S.cleared:k==='stars'?totalStars():S.st[k]||0}
function claimable(){return QUESTS.filter(q=>!S.claimed[q.id]&&qVal(q.key)>=q.goal).length}

/* ---------- sound ---------- */
let AC=null;
function ac(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(AC&&AC.state==='suspended'){try{AC.resume()}catch(e){}}return AC}
function tone(f,d,type,vol,slide,delay){
  if(S.muted)return;const a=ac();if(!a)return;
  try{const o=a.createOscillator(),g=a.createGain(),t0=a.currentTime+(delay||0);
    o.type=type||'sine';o.frequency.setValueAtTime(f,t0);
    if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(40,f+slide),t0+d);
    g.gain.setValueAtTime(vol||.07,t0);g.gain.exponentialRampToValueAtTime(.001,t0+d);
    o.connect(g);g.connect(a.destination);o.start(t0);o.stop(t0+d+.03)}catch(e){}
}
const SFX={
  tap:()=>tone(520,.07,'triangle',.05),
  hit:()=>{tone(170,.15,'square',.07,-100)},
  crit:()=>{tone(320,.14,'sawtooth',.08,-160);tone(620,.22,'triangle',.07,260,.07)},
  hurt:()=>{tone(120,.22,'sawtooth',.08,-60)},
  guard:()=>tone(260,.12,'triangle',.06,-60),
  heal:()=>{tone(440,.12,'sine',.06,0);tone(660,.18,'sine',.06,0,.1)},
  win:()=>{[523,659,784,1046].forEach((f,i)=>tone(f,.22,'triangle',.07,0,i*.12))},
  lose:()=>{[330,262,196].forEach((f,i)=>tone(f,.3,'sawtooth',.06,0,i*.18))},
  star:()=>tone(900,.12,'sine',.06,300),
  ah0:()=>{tone(110,.16,'square',.09,-50);tone(70,.2,'sine',.1,-20,.02)},
  ab0:()=>{tone(90,.28,'square',.11,-50);tone(55,.35,'sine',.13,-15,.03);tone(320,.12,'sawtooth',.05,-200,.06)},
  ah1:()=>{tone(180,.07,'square',.07,-80)},
  ab1:()=>{tone(220,.1,'square',.08,-100);tone(1100,.12,'triangle',.05,-700,.03)},
  rl1:()=>{tone(700,.09,'triangle',.06,-450);tone(1500,.07,'sine',.03,-1000,.02)},
  ah2:()=>{tone(700,.07,'square',.06,-250);tone(150,.1,'square',.07,-60,.05)},
  ab2:()=>{tone(180,.08,'square',.07,-60);tone(190,.08,'square',.07,-60,.1);tone(900,.2,'sawtooth',.07,-500,.2)},
  ah3:()=>{tone(130,.2,'sine',.1,-40);tone(900,.25,'sine',.04,350,.04)},
  ab3:()=>{tone(100,.3,'sine',.12,-30);tone(520,.4,'triangle',.06,500,.05);tone(1040,.45,'sine',.04,400,.12)},
  rl3:()=>{tone(300,.25,'sine',.05,400);tone(450,.25,'triangle',.03,350,.04)},
  ah4:()=>{tone(150,.08,'square',.07,-60)},
  ab4:()=>{tone(130,.12,'square',.09,-60);tone(260,.1,'triangle',.06,-150,.07)},
  rl4:()=>{tone(250,.16,'sawtooth',.04,500)}
};
const sfx=n=>{try{SFX[n]()}catch(e){}};
function sndIcon(){$('#sndIcon').innerHTML=S.muted
  ?'<path d="M2 6h3l4-3v10L5 10H2z" fill="#93acb8"/><path d="M11 5l4 6M15 5l-4 6" stroke="#93acb8" stroke-width="1.5"/>'
  :'<path d="M2 6h3l4-3v10L5 10H2z" fill="#f4e8cf"/><path d="M11 5.5c1.5 1.5 1.5 3.500 0 5M13 3.500c3 3 3 6 0 9" stroke="#f4e8cf" stroke-width="1.4" fill="none"/>'}

/* ---------- ui helpers ---------- */
let scr='home';
function toast(t){const o=$('#toast');if(o)o.remove();const d=document.createElement('div');d.id='toast';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2200)}
function modal(html,actions){
  const m=$('#modal');m.innerHTML='<div class="card">'+html+'<div class="acts"></div></div>';
  const a=m.querySelector('.acts');
  actions.forEach(x=>{const b=document.createElement('button');b.className='btn '+(x.cls||'');b.textContent=x.label;b.onclick=()=>{sfx('tap');closeModal();if(x.fn)x.fn()};a.appendChild(b)});
  m.hidden=false;
}
function closeModal(){$('#modal').hidden=true;$('#modal').innerHTML=''}
const STAR='<svg viewBox="0 0 24 24"><path d="M12 2l3 7 7.500.6-5.700 4.900 1.800 7.300L12 17.800 5.400 21.800l1.800-7.300L1.500 9.600 9 9z"/></svg>';
function starsRow(n){return '<div class="big-stars">'+[1,2,3].map(i=>STAR.replace('<svg','<svg class="'+(i<=n?'on':'')+'"')).join('')+'</div>'}

function renderTop(){
  $('#tHero').textContent=cl().n;
  $('#tLv').textContent='Түвшин '+S.lvl;
  $('#tXp').style.width=Math.round(100*S.xp/xpNeed(S.lvl))+'%';
  $('#tGold').textContent=S.gold;$('#tPot').textContent=S.potions;
  const c=claimable();const qd=$('#questDot');qd.hidden=!c;
  $('#dailyDot').hidden=dailyDone();
}
function go(name){
  if(B&&B.active&&name!=='battle')return;
  scr=name;
  document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('on',s.id===name));
  $('#top').hidden=name==='home';
  $('#nav').hidden=(name==='home'||name==='battle');
  document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.go===name));
  renderTop();
  if(name==='map')renderMap();
  if(name==='daily')renderDaily();
  if(name==='quests')renderQuests();
  if(name==='shop')renderShop();
  if(name==='gear')renderGear();
  if(name==='home')renderHome();
  const el=$('#'+name);if(el&&name!=='map')el.scrollTop=0;
  fitCanvases();
}

/* ---------- home ---------- */
function renderHome(){
  $('#btnStart').textContent=S.cleared>0?'Үргэлжлүүлэх':'Эхлэх';
  $('#homeInfo').textContent=S.cleared>0?(cl().n+' · Түвшин '+S.lvl+' · '+S.cleared+'/'+NL+' түвшин дууссан · '+totalStars()+' од'):'';
}

/* ---------- map ---------- */
const modeUnlocked=m=>m===0||(m===1&&(S.cleared>=NL||S.prog[1].cleared>0))||(m===2&&(S.prog[1].cleared>=NL||S.prog[2].cleared>0));
function renderMap(){
  const el=$('#map'),M=S.mode,PR=P(),lvs=LVL();
  const W=Math.max(260,Math.min(window.innerWidth,480)-32-2);
  const xs=[.2,.5,.76,.42,.7];
  let html='<div class="modes">'+[0,1,2].map(m=>'<button class="mode '+(m===M?'on':'')+'" data-m="'+m+'"'+(modeUnlocked(m)?'':' data-lock="1"')+'><b>'+MODE_NAMES[m]+'</b><small>'+(modeUnlocked(m)?MODE_SUB[m]:'Түгжээтэй')+'</small></button>').join('')+'</div>';
  if(M>0)html+='<p class="say">'+MODE_STORY[M]+'</p>';
  for(let r=0;r<4;r++){
    const reg=4*M+r,lv=lvs.filter(l=>l.region===reg);
    const got=lv.reduce((a,l)=>a+PR.stars[l.n-1],0);
    const H=lv.length*96+24;
    const pts=lv.map((l,i)=>({x:xs[i%5]*W,y:H-60-i*96,l}));
    let d='';pts.forEach((p,i)=>{if(i===0)d+='M'+p.x+' '+p.y;else{const q=pts[i-1];const my=(q.y+p.y)/2;d+=' C'+q.x+' '+my+' '+p.x+' '+my+' '+p.x+' '+p.y}});
    html+='<div class="chapter"><h3>'+REG[reg].name+'<span>'+got+'/30 од</span></h3><div class="trail" style="height:'+H+'px;background:linear-gradient(180deg,'+REG[reg].sky[0]+'33,'+REG[reg].ground+'33)">'
      +'<svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none"><path d="'+d+'" fill="none" stroke="#f4e8cf" stroke-opacity=".35" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round"/></svg>';
    pts.forEach(p=>{
      const l=p.l,s=PR.stars[l.n-1];
      const st=s>0?'done':(l.n===PR.cleared+1?'cur':(l.n>PR.cleared+1?'locked':'done'));
      html+='<button class="node '+(l.boss?'boss ':'')+st+'" style="left:'+p.x+'px;top:'+p.y+'px" data-n="'+l.n+'" aria-label="Түвшин '+l.n+'"><span>'+(st==='locked'?'–':l.n)+'</span></button>';
      html+='<div class="stars" style="left:'+p.x+'px;top:'+(p.y+(l.boss?36:32))+'px">'+'★'.repeat(s)+'<em>'+'★'.repeat(3-s)+'</em></div>';
      html+='<div class="nlabel" style="left:'+p.x+'px;top:'+(p.y-52)+'px">'+l.name+'</div>';
    });
    html+='</div></div>';
  }
  el.innerHTML=html;
  el.querySelectorAll('.node').forEach(b=>b.onclick=()=>{sfx('tap');openLevel(+b.dataset.n)});
  el.querySelectorAll('.mode').forEach(b=>b.onclick=()=>{
    sfx('tap');const m=+b.dataset.m;
    if(!modeUnlocked(m)){modal('<h2>Түгжээтэй</h2><p class="sub">'+(m===1?'Хэвийн горимын 40 түвшнийг дуусгаад дэлхийн аян руу гар.':'Хэцүү горимын 40 түвшнийг дуусгавал нээгдэнэ.')+'</p>',[{label:'За',cls:'gold'}]);return}
    S.mode=m;save();renderMap();el.scrollTop=0});
  const cur=el.querySelector('.node.cur');
  if(cur)setTimeout(()=>{try{cur.scrollIntoView({block:'center'})}catch(e){}},30);
}
function openLevel(n){
  const L=LVL()[n-1],PR=P();
  if(n>PR.cleared+1){modal('<h2>Түвшин '+n+'</h2><p class="sub">Өмнөх түвшнийг ялж энэ замыг нээнэ.</p>',[{label:'За',cls:'gold'}]);return}
  const s=PR.stars[n-1];
  const help=!S.seen?'<div class="card2"><b>Тулааны дүрэм</b><ul class="list mini"><li>Дайсны дараагийн нүүдэл тулааны дээд талд харагдана.</li><li>«Цохих» товч гурван цохилтын комбо хийнэ.</li><li>Хүчтэй цохилт ирэхээр хамгаал.</li><li>Хийморь цугларвал шидэлт, салхин цохилт, аянга хэрэглэ.</li><li>Дайснаас эд хэрэгсэл унана. Эд хэрэгсэл табаас өмсөж, сайжруул.</li></ul></div>':'';
  modal('<h2>'+n+'. '+L.name+'</h2><p class="mini">'+REG[L.region].name+(L.boss?' · Ахлагч':'')+(S.mode?' · '+MODE_NAMES[S.mode]+' горим':'')+'</p><p class="say">'+L.line+'</p>'
    +'<div class="card2"><div class="row"><span class="grow">★ Ялах</span></div><div class="row"><span class="grow">★ Амийн 50%-аас дээш үлдэх</span></div><div class="row"><span class="grow">★ '+parOf(L)+' нүүдэлд ялах</span></div><p class="mini" style="margin:0">Одоогийн дүн: '+(s?'★'.repeat(s)+'☆'.repeat(3-s):'эхний удаа')+'</p></div>'+help,
    [{label:'Буцах',cls:'ghost'},{label:'Тулаан эхлэх',cls:'gold',fn:()=>{S.seen=true;save();startBattle(L,{})}}]);
}

/* ---------- daily ---------- */
const dkey=(d)=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const today=()=>dkey(new Date());
const yesterday=()=>{const d=new Date();d.setDate(d.getDate()-1);return dkey(d)};
const dailyDone=()=>S.daily.last===today();
function dailyStreak(){return (S.daily.last===today()||S.daily.last===yesterday())?S.daily.streak:0}
function hashStr(s){let h=7;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h}
function dailySetup(){
  const h=hashStr(today());
  const dm=modeUnlocked(1)?(modeUnlocked(2)?2:1):0,kind=DAILY_KIND[h%4],n=clamp(S.cleared+3,3,42);
  const mods=[MODS[(h>>3)%4]];
  let m2=MODS[(h>>6)%4];if(m2!==mods[0]&&((h>>9)%2===0))mods.push(m2);
  const name=DAILY_ADJ[(h>>4)%6]+' '+DAILY_NOUN[kind];
  const boss=(h>>12)%3===0;
  const gold=Math.round((50+n*8)*(boss?1.5:1)*(1+Math.min(dailyStreak(),7)*.1)*[1,2,3.5][dm]);
  return{dm,kind,n,mods,name:name.charAt(0).toUpperCase()+name.slice(1),boss,gold,region:(h%4)+4*((h>>5)%(dm+1)),xp:Math.round((20+n*4)*[1,1.8,3][dm])};
}
function renderDaily(){
  const D=dailySetup(),el=$('#daily'),st=dailyStreak(),done=dailyDone();
  const nm=new Date();const left=new Date(nm.getFullYear(),nm.getMonth(),nm.getDate()+1)-nm;
  const hh=Math.floor(left/3600000),mm=Math.floor(left%3600000/60000);
  el.innerHTML='<h2>Өдрийн тулаан</h2><p class="sub">Өдөр бүр өөр дайсан, өөр нөхцөл. Ялбал өдөр бүрийн шагнал авна.</p>'
   +'<div class="card2"><div class="row"><div class="grow"><b style="font-family:var(--f-disp);font-size:18px">'+D.name+'</b><div class="mini">'+REG[D.region].name+(D.boss?' · Ахлагч':'')+'</div></div><span class="tag">'+D.n+'-р түвшний хүч</span></div>'
   +D.mods.map(m=>'<div class="row"><span class="tag '+(m.bad?'bad':'good')+'">'+m.t+'</span><span class="mini grow">'+m.d+'</span></div>').join('')+'</div>'
   +'<div class="card2"><b>Шагнал</b><div class="row"><span class="grow">Алт '+D.gold*(D.mods.some(m=>m.goldMul)?2:1)+', 1 айраг, '+D.xp+' туршлага</span></div>'
   +'<div class="mini">Дараалсан өдрүүд: '+st+(st?' · өдөр тутам +10% алт (7 хүртэл)':'')+'</div><div class="streak">'+[0,1,2,3,4,5,6].map(i=>'<i class="'+(i<st?'on':'')+'"></i>').join('')+'</div></div>'
   +(done?'<div class="card2"><b>Өнөөдрийн шагнал авсан.</b><span class="mini">Шинэ дайсан '+hh+' цаг '+mm+' минутын дараа ирнэ.</span></div>':'')
   +'<button class="btn '+(done?'ghost':'gold')+'" id="dGo">'+(done?'Дахин тулалдах (шагналгүй)':'Тулаан эхлэх')+'</button>';
  $('#dGo').onclick=()=>{sfx('tap');startDaily(D)};
  el.insertAdjacentHTML('beforeend','<div class="card2"><div class="row"><div class="grow"><b style="font-family:var(--f-disp);font-size:18px">Төгсгөлгүй горим</b><div class="mini">Давалгаа дараалан ирнэ. Давалгаа бүрийн дараа нэг ерөөл сонгоно.</div></div><span class="tag">Рекорд '+S.endless.best+'</span></div><ul class="list mini"><li>Амь давалгаа хооронд бага зэрэг л эдгэнэ.</li><li>5 давалгаа тутам ахлагч гарч, эд хэрэгсэл унана.</li><li>Шагналаа аваад гарвал бүтнээр нь, ялагдвал 60%-ийг нь авна.</li></ul><button class="btn gold" id="eGo">Төгсгөлгүй горим эхлэх</button></div>');
  $('#eGo').onclick=()=>{sfx('tap');startEndless()};
  if(S.er[S.cls])$('#eGo').textContent='Үргэлжлүүлэх · давалгаа '+S.er[S.cls].wave;
}
function startDaily(D){
  const L={n:D.n,name:D.name,kind:D.kind,boss:D.boss,region:D.region,par:99,line:'',mode:D.dm};
  startBattle(L,{daily:D});
}

/* ---------- endless ---------- */
const PERKS=[
 {id:'atk',n:'Бөхийн хүч',d:'Цохилт +20%',f:r=>{r.atk*=1.2}},
 {id:'hp',n:'Хад чулуу',d:'Хамгийн их амь +25%, тэр хэмжээгээр эдгэнэ',f:(r,h)=>{const a=Math.round(h.max*.25);h.max+=a;h.hp+=a}},
 {id:'chi',n:'Хийморийн урсгал',d:'Хийморь олох +40%',f:r=>{r.chi+=.4}},
 {id:'ls',n:'Цусны цангаа',d:'Цохилтын 12% нь амь болж сэргэнэ',f:r=>{r.ls+=.12}},
 {id:'sh',n:'Ерөөлт эхлэл',d:'Давалгаа бүрийг ерөөлтэй эхэлнэ',f:r=>{r.sh=true}},
 {id:'pot',n:'Айрагны сав',d:'+2 айраг',f:r=>{r.pot+=2}},
 {id:'crit',n:'Хурц нүд',d:'Гайхалтай цохилтын магадлал +15%',f:r=>{r.crit+=.15}},
 {id:'def',n:'Төмөр дээл',d:'Хуяг +3',f:r=>{r.def+=3}},
 {id:'heal',n:'Эдгэрэлт',d:'Давалгааны дараах эдгэрэлт +15%',f:r=>{r.heal+=.15}}
];
function endlessL(w){
  const kind=DAILY_KIND[Math.floor(Math.random()*4)],boss=w%5===0;
  return{n:w,name:DAILY_ADJ[Math.floor(Math.random()*6)]+' '+DAILY_NOUN[kind],kind,boss,region:Math.floor((w-1)/2)%12,par:99,line:'',mode:0};
}
function newEndless(){
  const run={wave:1,atk:1,chi:0,ls:0,sh:false,pot:2,crit:0,def:0,heal:0,hp:heroMax(),max:heroMax(),chi0:Math.min(100,10*S.up.chi+gear().chiS),gold:0,kills:0,perks:[],drops:[]};
  run.cp=JSON.parse(JSON.stringify(run));
  S.er[S.cls]=JSON.parse(JSON.stringify(run));save();startBattle(endlessL(1),{run});
}
function startEndless(){
  const sv=S.er[S.cls];
  if(!sv){newEndless();return}
  modal('<h2>Төгсгөлгүй горим</h2><p class="mini">'+cl().n+': давалгаа '+sv.wave+' дээр хадгалагдсан байна.</p>',[{label:'Үргэлжлүүлэх · давалгаа '+sv.wave,cls:'gold',fn:()=>{const r=JSON.parse(JSON.stringify(sv));delete r.np;startBattle(endlessL(r.wave),{run:r})}},{label:'Шинээр эхлэх',cls:'red',fn:()=>{delete S.er[S.cls];newEndless()}},{label:'Болих',cls:'ghost'}]);
}
async function endlessPayout(run,cleared,full){
  const f=full?1:.6,l0=S.lvl;
  const g=Math.round((run.gold+cleared*6)*f),xp=Math.round(cleared*(16+cleared*1.5)*f);
  S.gold+=g;const up=await gainXp(xp);delete S.er[S.cls];S.endless.runs++;if(cleared>S.endless.best)S.endless.best=cleared;save();renderTop();
  return{g,xp,up,l0};
}
function endlessSummary(run,cleared,r,full){
  return '<h2>'+(full?'Шагналаа авлаа':'Ялагдлаа')+'</h2><div class="card2"><div class="row"><span class="grow">Давсан давалгаа</span><b>'+cleared+'</b></div><div class="row"><span class="grow">Рекорд</span><b>'+S.endless.best+'</b></div><div class="row"><span class="grow">Алт</span><b>+'+r.g+'</b></div><div class="row"><span class="grow">Туршлага</span><b>+'+r.xp+'</b></div>'
   +(r.up?'<div class="tag good" style="align-self:flex-start">Түвшин '+S.lvl+' боллоо!</div>'+skillNote(r.l0):'')
   +(run.drops.length?'<b>Унасан эд ('+run.drops.length+')</b>'+run.drops.map(d=>dropHTML(d)).join(''):'')+'</div>'
   +(full?'':'<p class="mini">Ялагдсан тул шагналын 60%-ийг авлаа. Дараагийн удаа шагналаа аваад гарвал бүтнээр нь авна.</p>');
}
const endlessActs=()=>[{label:'Дахин эхлэх',cls:'gold',fn:()=>{endBattle();startEndless()}},{label:'Буцах',cls:'ghost',fn:()=>{endBattle();go('daily')}}];
async function endlessCash(run,cleared){const r=await endlessPayout(run,cleared,true);modal(endlessSummary(run,cleared,r,true),endlessActs())}
async function endlessOver(){
  const run=B.run,cp=run.cp;
  if(!cp){const r=await endlessPayout(run,run.wave-1,false);modal(endlessSummary(run,run.wave-1,r,false),endlessActs());return}
  const r=JSON.parse(JSON.stringify(cp));r.cp=JSON.parse(JSON.stringify(cp));r.hp=r.max;r.drops=(r.drops||[]);
  S.er[S.cls]=JSON.parse(JSON.stringify(r));save();
  const at=r.wave-1;
  modal('<h2>\u042f\u043b\u0430\u0433\u0434\u043b\u0430\u0430</h2><p>'+(at>0?'\u0421\u04af\u04af\u043b\u0434 \u044f\u043b\u0441\u0430\u043d \u0430\u0445\u043b\u0430\u0433\u0447 (\u0434\u0430\u0432\u0430\u043b\u0433\u0430\u0430 '+at+') \u0434\u044d\u044d\u0440\u044d\u044d\u0441 \u0434\u0430\u0445\u0438\u043d \u044d\u0445\u043b\u044d\u043d\u044d.':'\u0422\u043e\u0433\u043b\u043e\u043e\u043c\u044b\u043d \u044d\u0445\u043b\u044d\u043b\u044d\u044d\u0441 \u0434\u0430\u0445\u0438\u043d \u044d\u0445\u043b\u044d\u043d\u044d.')+' \u0410\u043c\u044c \u0431\u04af\u0440\u044d\u043d \u0441\u044d\u0440\u0433\u044d\u043d\u044d.</p><p class="mini">\u042d\u0434 \u0445\u044d\u0440\u044d\u0433\u0441\u044d\u043b \u0446\u04af\u043d\u0445\u044d\u043d\u0434 \u0445\u044d\u0432\u044d\u044d\u0440\u044d\u044d. \u0410\u043b\u0442, \u044f\u043b\u0441\u0430\u043d \u0442\u043e\u043e, \u0435\u0440\u04e9\u04e9\u043b \u043d\u044c \u0445\u0430\u0434\u0433\u0430\u043b\u0442\u044b\u043d \u0446\u044d\u0433\u0438\u0439\u043d \u0445\u044d\u043c\u0436\u044d\u044d\u043d\u0434 \u0431\u0443\u0446\u043d\u0430.</p>',
    [{label:'\u0414\u0430\u0445\u0438\u043d \u043e\u0440\u043e\u043b\u0434\u043e\u0445 \xb7 \u0434\u0430\u0432\u0430\u043b\u0433\u0430\u0430 '+r.wave,cls:'gold',fn:()=>startBattle(endlessL(r.wave),{run:r})},{label:'\u0428\u0430\u0433\u043d\u0430\u043b\u0430\u0430 \u0430\u0432\u0430\u0430\u0434 \u0433\u0430\u0440\u0430\u0445',cls:'ghost',fn:()=>endlessCash(r,at)}]);
}
async function endlessWave(){
  const run=B.run,h=B.hero,w=run.wave,boss=w%5===0;
  run.kills++;run.gold+=8+w*3;
  const drop=rollDrop(w>=30?2:w>=15?1:0,boss,false);
  if(drop)run.drops.push(drop);
  h.hp=Math.min(h.max,h.hp+Math.round(h.max*(.2+run.heal)));h.bleed=null;
  run.hp=h.hp;run.max=h.max;run.chi0=Math.min(100,h.chi+20);
  if(w>S.endless.best)S.endless.best=w;
  if(!boss){
    run.wave=w+1;S.er[S.cls]=JSON.parse(JSON.stringify(run));save();updateHUD();
    floatText(h.x,GROUND-135,'\u0414\u0430\u0432\u0430\u043b\u0433\u0430\u0430 '+w+' \u2713','#ffd54a',18);
    toast('\u0414\u0430\u0432\u0430\u043b\u0433\u0430\u0430 '+w+' \u0434\u0430\u0432\u043b\u0430\u0430'+(drop&&!drop.sold?' \xb7 \u043e\u043b\u0437: '+iName(drop):''));
    await sleep(900);startBattle(endlessL(w+1),{run});return;
  }
  run.pot++;
  run.wave=w+1;S.er[S.cls]=JSON.parse(JSON.stringify(run));save();updateHUD();
  const pool=PERKS.filter(p=>!(p.id==='sh'&&run.sh)),picks=[];
  while(picks.length<3&&pool.length)picks.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]);
  modal('<h2>\u0410\u0445\u043b\u0430\u0433\u0447 ('+w+') \u044f\u043b\u0430\u0433\u0434\u043b\u0430\u0430!</h2><p class="mini">\u0428\u0438\u043d\u044d \u0445\u0430\u0434\u0433\u0430\u043b\u0430\u043b\u0442\u044b\u043d \u0446\u044d\u0433. \u0425\u044d\u0440\u0432\u044d\u044d \u044f\u043b\u0430\u0433\u0434\u0432\u044d\u043b \u044d\u043d\u044d \u0430\u0445\u043b\u0430\u0433\u0447\u0430\u0430\u0441 \u0434\u0430\u0445\u0438\u043d \u044d\u0445\u043b\u044d\u043d\u044d.</p><p class="mini">\u041e\u0434\u043e\u043e\u0433\u0438\u0439\u043d \u0434\u04af\u043d: \u0430\u043b\u0442 '+run.gold+' \xb7 \u044f\u043b\u0441\u0430\u043d '+run.kills+' \xb7 +1 \u0430\u0439\u0440\u0430\u0433</p>'+dropHTML(drop)
    +'<div class="card2"><b>\u041d\u044d\u0433 \u0435\u0440\u04e9\u04e9\u043b \u0441\u043e\u043d\u0433\u043e</b>'+picks.map(p=>'<div><b>'+p.n+'</b><div class="mini">'+p.d+'</div></div>').join('')+'</div>',
    picks.map(p=>({label:p.n,cls:'gold',fn:()=>{p.f(run,h);run.hp=h.hp;run.max=h.max;run.perks.push(p.id);run.wave=w+1;delete run.cp;run.cp=JSON.parse(JSON.stringify(run));S.er[S.cls]=JSON.parse(JSON.stringify(run));save();startBattle(endlessL(w+1),{run})}}))
     .concat([{label:'\u0428\u0430\u0433\u043d\u0430\u043b\u0430\u0430 \u0430\u0432\u0430\u0430\u0434 \u0433\u0430\u0440\u0430\u0445',cls:'ghost',fn:()=>endlessCash(run,w)}]));
}

/* ---------- quests ---------- */
function renderQuests(){
  const el=$('#quests');
  el.innerHTML='<h2>Даалгавар</h2><p class="sub">Гүйцэтгээд шагналаа аваарай.</p>'+QUESTS.map(q=>{
    const v=Math.min(qVal(q.key),q.goal),done=S.claimed[q.id],ok=v>=q.goal;
    return '<div class="card2 q '+(ok?'done':'')+'"><div class="row"><div class="grow"><b>'+q.t+'</b><div class="mini">Шагнал: '+q.gold+' алт'+(q.potion?', '+q.potion+' айраг':'')+'</div></div>'
     +(done?'<span class="tag good">Авсан</span>':ok?'<button class="btn gold" data-q="'+q.id+'" style="padding:8px 14px;min-height:40px">Авах</button>':'<span class="mini">'+v+'/'+q.goal+'</span>')+'</div>'
     +'<div class="bar"><i style="width:'+Math.round(100*v/q.goal)+'%"></i></div></div>'}).join('');
  el.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{
    const q=QUESTS.find(x=>x.id===b.dataset.q);if(!q||S.claimed[q.id])return;
    S.claimed[q.id]=1;S.gold+=q.gold;S.potions+=q.potion||0;save();sfx('win');toast('+'+q.gold+' алт'+(q.potion?' · +'+q.potion+' айраг':''));renderTop();renderQuests()});
}

/* ---------- gear ---------- */
const ICON={
 w:c=>'<svg viewBox="0 0 32 32"><path d="M26 3l3 3-15 15-4-4z" fill="'+c+'"/><path d="M7 19l6 6-3 3-6-6z" fill="#8a5a34"/><path d="M9 20l5 5" stroke="#e9b44c" stroke-width="3"/></svg>',
 a:c=>'<svg viewBox="0 0 32 32"><path d="M16 3l11 4v9c0 7-5 11-11 13C10 27 5 23 5 16V7z" fill="'+c+'"/><path d="M16 8v18M9 14h14" stroke="#0d2231" stroke-opacity=".45" stroke-width="2"/></svg>',
 c:c=>'<svg viewBox="0 0 32 32"><path d="M16 3l9 9-9 17-9-17z" fill="'+c+'"/><path d="M7 12h18M16 3v26" stroke="#fff" stroke-opacity=".4" stroke-width="1.5"/></svg>'};
const nextId=()=>{S.nid=(S.nid||0)+1;return S.nid};
const sellVal=it=>Math.round(12*(it.r+1)*(1+it.m)*(1+.6*it.u));
const upCost=it=>Math.round(25*(it.r+1)*(it.u+1)*(1+it.m));
function rollDrop(mode,boss,daily){
  if(!boss&&!daily&&Math.random()>.6)return null;
  const lv=(B&&B.L)?B.L.n:10,score=Math.min(lv,40)/20+mode+(boss?.5:0)+(daily?.3:0);
  const x=Math.random()+score*.22;
  const r=x<.55?0:x<.85?1:x<1.1?2:3;
  const it={id:nextId(),s:['w','a','c'][Math.floor(Math.random()*3)],k:Math.floor(Math.random()*5),r,m:mode,u:0};
  if(S.items.length>=40){S.gold+=sellVal(it);it.sold=true;return it}
  S.items.push(it);
  if(it.k===S.cls&&!S.eq[it.s]){S.eq[it.s]=it.id;it.auto=true}
  return it;
}
function dropHTML(it){
  if(!it)return '';
  return '<div class="item" style="border-color:'+RAR[it.r].c+'"><span class="ico">'+ICON[it.s](RAR[it.r].c)+'</span><div class="grow"><b style="color:'+RAR[it.r].c+'">'+iName(it)+'</b><div class="mini">'+RAR[it.r].n+' · '+iText(it)+'</div></div><span class="tag good">'+(it.sold?'Зарлаа':it.auto?'Өмссөн':'Шинэ')+'</span></div>';
}
function itemRow(it){
  const eq=S.eq[it.s]===it.id;
  return '<button class="item" data-i="'+it.id+'" style="border-color:'+RAR[it.r].c+'"><span class="ico">'+ICON[it.s](RAR[it.r].c)+'</span><div class="grow"><b>'+iName(it)+(it.u?' +'+it.u:'')+'</b><div class="mini">'+RAR[it.r].n+' · '+slotOf(it)+'</div><div class="mini">'+iText(it)+'</div></div>'+(eq?'<span class="tag good">Өмссөн</span>':'')+'</button>';
}
function mergeGroups(){
  const worn=wornAll(),g={};
  S.items.filter(it=>!worn.includes(it.id)).forEach(it=>{const key=it.k+'|'+it.s+'|'+it.r+'|'+it.m;(g[key]=g[key]||[]).push(it)});
  return Object.values(g).filter(a=>a.length>=3).map(a=>a.slice().sort((x,y)=>x.u-y.u));
}
const mergeCost=a=>Math.round(40*(a[0].r+1)*(1+a[0].m));
const isTop=t=>t.r===3&&t.m===2;
const maxUp=t=>isTop(t)?10:5;
function mergeTarget(t,mu){if(isTop(t))return{k:t.k,s:t.s,r:3,m:2,u:Math.min(10,(mu||0)+3)};return{k:t.k,s:t.s,r:t.r<3?t.r+1:3,m:t.r<3?t.m:t.m+1,u:0}}
function doMerge(a){
  const use=a.slice(0,3),maxU=Math.max(...use.map(x=>x.u)),pv=mergeTarget(use[0],maxU);
  S.items=S.items.filter(x=>!use.includes(x));
  const it={id:nextId(),k:pv.k,s:pv.s,r:pv.r,m:pv.m,u:isTop(use[0])?pv.u:Math.max(0,maxU-2)};
  S.items.push(it);S.st.merged=(S.st.merged||0)+1;save();return it;
}
function mergeCard(){
  const gs=mergeGroups();
  let h='<div class="card2"><b>Нэгтгэх</b><p class="mini" style="margin:0">Ижил төрөл, ижил зэрэглэлийн 3 эдийг нэгтгээд дараагийн зэрэглэлийн 1 эд гаргана. Домог эдийг нэгтгэвэл «Дэлхийн», «Мөнхийн» болж хөгжинө. Хамгийн дээд «Мөнхийн Домог» эдийг нэгтгэвэл +3 түвшин нэмэгдэж, +10 хүртэл өсөнө. Өмссөн эд орохгүй.</p>';
  if(!gs.length)h+='<p class="mini" style="margin:0">Одоогоор нэгтгэх 3 ижил эд алга.</p>';
  const worn=wornAll(),cnt={};
  S.items.filter(it=>!worn.includes(it.id)).forEach(it=>{const k=it.k+'|'+it.s+'|'+it.r+'|'+it.m;cnt[k]=cnt[k]||{it,n:0};cnt[k].n++});
  const part=Object.values(cnt).filter(c=>c.n<3).sort((a,b)=>b.n-a.n).slice(0,6);
  if(part.length)h+='<p class="mini" style="margin:0">Цуглуулж байгаа: '+part.map(c=>iName(c.it)+' '+c.n+'/3').join(' · ')+'</p>';
  gs.forEach((a,i)=>{const t=a[0],pv=mergeTarget(t,Math.max(...a.slice(0,3).map(x=>x.u)));
    h+='<div class="item" style="border-color:'+RAR[pv.r].c+'"><span class="ico">'+ICON[t.s](RAR[pv.r].c)+'</span><div class="grow"><b>3 × '+iName(t)+' → '+iName(pv)+(isTop(t)?' +'+pv.u:'')+'</b><div class="mini">'+RAR[pv.r].n+' · '+iText(pv)+'</div></div><button class="btn gold" data-mg="'+i+'" style="padding:6px 12px;min-height:38px">'+mergeCost(a)+' алт</button></div>'});
  if(gs.length)h+='<button class="btn" id="mgAll">Бүгдийг нэгтгэх</button>';
  return h+'</div>';
}
function renderGear(){
  const el=$('#gear'),g=gear(),worn=wornAll();
  const bag=S.items.filter(it=>!worn.includes(it.id)).sort((a,b)=>(ik(b)===S.cls)-(ik(a)===S.cls)||b.r-a.r||b.u-a.u||b.m-a.m);
  el.innerHTML='<h2>Эд хэрэгсэл</h2><p class="sub">Дайснаас унасан зүйлээ өмсөж, алтаар сайжруулна.</p>'
   +'<div class="card2"><b>Өмссөн</b>'+['w','a','c'].map(k=>{const it=S.items.find(x=>x.id===S.eq[k]);return it?itemRow(it):'<div class="item empty"><span class="mini">'+SLOTN[k]+': хоосон</span></div>'}).join('')
   +'<button class="btn" id="autoEq">Хамгийн сайныг өмсөх</button><p class="mini" style="margin:0">Нийт нэмэлт: цохилт +'+g.atk+', амь +'+g.hp+', хуяг +'+g.def+', эхлэх хийморь +'+g.chiS+', хийморь олох +'+g.chiG+'%</p></div>'
   +mergeCard()+'<div class="card2"><b>Цүнх ('+bag.length+')</b>'+(bag.length?bag.map(itemRow).join(''):'<p class="mini" style="margin:0">Хоосон байна. Дайсан ялбал эд хэрэгсэл унана.</p>')+'</div>';
  el.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{sfx('tap');itemModal(+b.dataset.i)});
  el.querySelectorAll('[data-mg]').forEach(b=>b.onclick=()=>{
    const a=mergeGroups()[+b.dataset.mg];if(!a)return;
    if(S.gold<mergeCost(a)){toast('Алт хүрэлцэхгүй байна');return}
    S.gold-=mergeCost(a);const it=doMerge(a);sfx('win');renderGear();renderTop();
    modal('<h2>Нэгтгэв!</h2>'+dropHTML(it)+'<p class="mini">Шинэ эд цүнхэнд орлоо. Хүсвэл өмсөж, сайжруулна.</p>',[{label:'За',cls:'gold'}])});
  const ae=$('#autoEq');if(ae)ae.onclick=()=>{
    const pw=it=>{const t=iStat(it);return(t.atk||0)*3+(t.hp||0)+(t.def||0)*8+(t.chiS||0)*2+(t.chiG||0)*2};
    ['w','a','c'].forEach(k=>{const best=S.items.filter(x=>x.s===k&&ik(x)===S.cls).sort((a,b)=>pw(b)-pw(a))[0];if(best)S.eq[k]=best.id});
    save();sfx('heal');toast('Хамгийн сайн эдүүдийг өмслөө');renderGear();renderTop()};
  const ma=$('#mgAll');if(ma)ma.onclick=()=>{let n=0;for(let g=0;g<30;g++){const a=mergeGroups().find(x=>S.gold>=mergeCost(x));if(!a)break;S.gold-=mergeCost(a);doMerge(a);n++}
    if(n){sfx('win');toast(n+' удаа нэгтгэв');renderGear();renderTop()}else toast('Алт хүрэлцэхгүй байна')};
}
function itemModal(id){
  const it=S.items.find(x=>x.id===id);if(!it)return;
  const eq=S.eq[it.s]===id,max=it.u>=maxUp(it),cost=upCost(it),nxt=Object.assign({},it,{u:it.u+1});
  const cur=S.items.find(x=>x.id===S.eq[it.s]);
  const html='<h2 style="color:'+RAR[it.r].c+'">'+iName(it)+(it.u?' +'+it.u:'')+'</h2><p class="mini">'+RAR[it.r].n+' · '+slotOf(it)+'</p>'
   +'<div class="card2"><div>'+iText(it)+'</div>'+(max?'<p class="mini" style="margin:0">Дээд түвшинд хүрсэн (+'+maxUp(it)+')</p>':'<p class="mini" style="margin:0">Сайжруулбал: '+iText(nxt)+'</p>')
   +(cur&&cur.id!==id?'<p class="mini" style="margin:0">Одоо өмссөн: '+iName(cur)+' · '+iText(cur)+'</p>':'')+'</div>';
  const acts=[{label:'Хаах',cls:'ghost'},
    {label:eq?'Тайлах':'Өмсөх',cls:'gold',fn:()=>{if(ik(it)!==S.cls){toast('Энэ эд '+CL[ik(it)].n+'-д зориулагдсан');return}S.eq[it.s]=eq?null:id;save();renderGear();renderTop()}}];
  if(!max)acts.push({label:'Сайжруулах · '+cost+' алт',cls:'gold',fn:()=>{
    if(S.gold<cost){toast('Алт хүрэлцэхгүй байна');return}
    S.gold-=cost;it.u++;S.st.upg++;save();sfx('heal');renderGear();renderTop();itemModal(id)}});
  acts.push({label:'Зарах · '+sellVal(it)+' алт',cls:'red',fn:()=>{
    S.gold+=sellVal(it);if(eq)S.eq[it.s]=null;S.items=S.items.filter(x=>x.id!==id);save();renderGear();renderTop()}});
  modal(html,acts);
}

/* ---------- shop ---------- */
function renderShop(){
  const el=$('#shop');
  el.innerHTML='<h2>Дэлгүүр</h2><div class="card2"><div class="row"><span class="grow">Цохилт</span><b>'+Math.round(heroAtk())+'</b></div><div class="row"><span class="grow">Амь</span><b>'+heroMax()+'</b></div><div class="row"><span class="grow">Хуяг</span><b>'+heroDef()+'</b></div></div>'+skillCard()
   +SHOP.map(it=>{const l=S.up[it.id],c=it.cost(l),max=l>=it.max;
     return '<div class="card2"><div class="row"><div class="grow"><b>'+it.n+'</b><div class="mini">'+it.d+'</div></div><button class="btn gold" data-b="'+it.id+'" style="padding:8px 14px;min-height:42px" '+(max||S.gold<c?'disabled':'')+'>'+(max?'Дээд':c+' алт')+'</button></div>'
     +'<div class="pips">'+Array.from({length:it.max},(_,i)=>'<i class="'+(i<l?'on':'')+'"></i>').join('')+'</div></div>'}).join('')
   +'<div class="card2"><div class="row"><div class="grow"><b>Айраг</b><div class="mini">Амийн 45%-ийг сэргээнэ · одоо '+S.potions+'</div></div><button class="btn gold" data-b="potion" style="padding:8px 14px;min-height:42px" '+(S.gold<30||S.potions>=9?'disabled':'')+'>30 алт</button></div></div>';
  el.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{
    const id=b.dataset.b;
    if(id==='potion'){if(S.gold<30||S.potions>=9)return;S.gold-=30;S.potions++}
    else{const it=SHOP.find(x=>x.id===id),c=it.cost(S.up[id]);if(S.gold<c||S.up[id]>=it.max)return;S.gold-=c;S.up[id]++}
    save();sfx('heal');renderTop();renderShop();
  });
}

/* ---------- drawing ---------- */
let TINT=0;
const mix=(hex,f)=>{f=f===undefined?TINT:f;if(!f)return hex;const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;r=r+(255-r)*f|0;g=g+(255-g)*f|0;b=b+(255-b)*f|0;return 'rgb('+r+','+g+','+b+')'};
function ridge(c,base,amp,freq,ph,color){
  c.fillStyle=color;c.beginPath();c.moveTo(0,GROUND);
  for(let x=0;x<=360;x+=10){const y=base-amp*Math.abs(Math.sin(x*freq+ph))*(0.65+0.35*Math.sin(x*freq*2.3+ph));c.lineTo(x,y)}
  c.lineTo(360,GROUND);c.closePath();c.fill();
}
function tree(c,x,y,s,col,snow){c.save();c.translate(x,y);c.scale(s,s);c.fillStyle=col;for(let k=0;k<3;k++){c.beginPath();c.moveTo(-14+k*2,-k*16);c.lineTo(0,-30-k*16);c.lineTo(14-k*2,-k*16);c.fill()}if(snow){c.fillStyle='rgba(255,255,255,.85)';for(let k=0;k<3;k++){c.beginPath();c.moveTo(-6+k*1.5,-k*16-12);c.lineTo(0,-30-k*16);c.lineTo(6-k*1.5,-k*16-12);c.fill()}}c.fillStyle='#3a2a1c';c.fillRect(-2,0,4,8);c.restore()}
function decor(c,R,t){
  const d=R.deco,G=GROUND;
  if(d==='ger'){
    c.save();c.translate(196,G-4);c.fillStyle='#f1e6cf';c.beginPath();c.ellipse(0,-12,26,12,0,Math.PI,0);c.lineTo(26,0);c.lineTo(-26,0);c.fill();
    c.fillStyle='#d1583a';c.fillRect(-26,-12,52,3);c.fillStyle='#8a5a34';c.fillRect(-5,-14,10,14);c.fillStyle='#3b2a1c';c.fillRect(-1,-26,2,6);c.restore();
  }else if(d==='dunes'){
    c.strokeStyle='rgba(120,80,30,.35)';c.lineWidth=2;for(let i=0;i<3;i++){c.beginPath();c.moveTo(0,G+16+i*14);c.bezierCurveTo(90,G+8+i*14,200,G+24+i*14,360,G+12+i*14);c.stroke()}
  }else if(d==='pines'){
    [[28,.9],[330,1.1],[300,.7]].forEach(([x,s])=>tree(c,x,G-4,s,'#16301f',false));
  }else if(d==='wall'){
    c.fillStyle='#9b8d76';c.beginPath();c.moveTo(0,G-26);c.lineTo(360,G-60);c.lineTo(360,G-48);c.lineTo(0,G-12);c.closePath();c.fill();
    c.fillStyle='#7d705c';for(let x=6;x<360;x+=16){const y=G-26-(x/360)*34;c.fillRect(x,y-5,8,6)}
    [[70,.9],[190,.75],[300,.6]].forEach(([x,s])=>{const y=G-18-(x/360)*34;c.save();c.translate(x,y);c.scale(s,s);c.fillStyle='#8c7f69';c.fillRect(-12,-30,24,34);c.fillStyle='#b5452f';c.beginPath();c.moveTo(-16,-30);c.lineTo(0,-46);c.lineTo(16,-30);c.fill();c.fillStyle='#2a2018';c.fillRect(-3,-20,6,10);c.restore()});
  }else if(d==='minaret'){
    c.save();c.translate(250,G-6);c.fillStyle='#f3e4c4';c.fillRect(-34,-30,68,30);c.beginPath();c.arc(0,-30,22,Math.PI,0);c.fill();c.fillStyle='#3a8fa0';c.beginPath();c.arc(0,-34,12,Math.PI,0);c.fill();
    c.fillStyle='#f3e4c4';c.fillRect(42,-62,8,62);c.fillStyle='#3a8fa0';c.beginPath();c.moveTo(40,-62);c.lineTo(46,-78);c.lineTo(52,-62);c.fill();c.fillStyle='#8a5a34';c.fillRect(-6,-16,12,16);c.restore();
    c.save();c.translate(36,G-4);c.strokeStyle='#5a3d22';c.lineWidth=4;c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(6,-24,2,-48);c.stroke();c.fillStyle='#3f7a3a';for(let k=0;k<5;k++){c.beginPath();c.ellipse(2,-48,18,4,(k-2)*.5,0,7);c.fill()}c.restore();
  }else if(d==='pyramid'){
    [[190,70,1],[262,44,.8]].forEach(([x,h,k])=>{c.fillStyle='#d3a85e';c.beginPath();c.moveTo(x-h*.9,G-6);c.lineTo(x,G-6-h);c.lineTo(x+h*.9,G-6);c.fill();c.fillStyle='#b98c48';c.beginPath();c.moveTo(x,G-6-h);c.lineTo(x+h*.9,G-6);c.lineTo(x,G-6);c.fill()});
  }else if(d==='castle'){
    c.save();c.translate(232,G-6);c.fillStyle='#aeb7c2';c.fillRect(-46,-34,92,34);for(let x=-46;x<46;x+=12)c.fillRect(x,-40,7,7);
    [[-46,50],[46,60]].forEach(([x,h])=>{c.fillStyle='#b9c2cc';c.fillRect(x-10,-h,20,h);c.fillStyle='#b5452f';c.beginPath();c.moveTo(x-14,-h);c.lineTo(x,-h-22);c.lineTo(x+14,-h);c.fill()});
    c.fillStyle='#4a3a2a';c.beginPath();c.arc(0,0,10,Math.PI,0);c.fill();c.strokeStyle='#3a2a1c';c.lineWidth=1.5;c.beginPath();c.moveTo(46,-82);c.lineTo(46,-96);c.stroke();c.fillStyle='#d1583a';const w=Math.sin(t*4)*2;c.beginPath();c.moveTo(46,-96);c.lineTo(58,-92+w);c.lineTo(46,-88);c.fill();c.restore();
  }else if(d==='taiga'){
    [[24,1],[64,.8],[300,1.1],[338,.8],[260,.7]].forEach(([x,s])=>tree(c,x,G-4,s,'#2d4a40',true));
  }else if(d==='temple'){
    c.save();c.translate(232,G-6);c.fillStyle='#ecc07a';c.fillRect(-40,-14,80,14);c.beginPath();c.arc(0,-14,26,Math.PI,0);c.fill();c.fillStyle='#d1583a';c.fillRect(-2,-62,4,22);c.beginPath();c.moveTo(-6,-40);c.lineTo(0,-64);c.lineTo(6,-40);c.fill();
    [[-34,.5],[34,.5]].forEach(([x,k])=>{c.fillStyle='#ecc07a';c.beginPath();c.arc(x,-14,26*k,Math.PI,0);c.fill()});c.restore();
  }else if(d==='acacia'){
    [[62,1],[310,.8]].forEach(([x,s])=>{c.save();c.translate(x,G-4);c.scale(s,s);c.strokeStyle='#4a3420';c.lineWidth=5;c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(4,-26,-2,-46);c.stroke();c.fillStyle='#4d6b2a';c.beginPath();c.ellipse(0,-50,34,9,0,0,7);c.fill();c.restore()});
  }else if(d==='peak'){
    c.fillStyle='#3b3270';c.beginPath();c.moveTo(110,G-6);c.lineTo(150,G-118);c.lineTo(175,G-70);c.lineTo(205,G-150);c.lineTo(250,G-6);c.fill();
    c.fillStyle='#6a5cc0';c.beginPath();c.moveTo(205,G-150);c.lineTo(250,G-6);c.lineTo(214,G-6);c.fill();
    const g=c.createRadialGradient(205,G-150,2,205,G-150,40);g.addColorStop(0,'rgba(200,180,255,'+(.5+.2*Math.sin(t*3))+')');g.addColorStop(1,'rgba(200,180,255,0)');c.fillStyle=g;c.fillRect(160,G-200,90,90);
  }
}
function drawBG(c,r,t){
  const R=REG[r];
  const g=c.createLinearGradient(0,0,0,GROUND);g.addColorStop(0,R.sky[0]);g.addColorStop(1,R.sky[1]);
  c.fillStyle=g;c.fillRect(0,0,360,300);
  if(R.stars){c.fillStyle='#fff';for(let i=0;i<40;i++){c.globalAlpha=.35+.45*Math.abs(Math.sin(t*1.5+i));c.fillRect((i*83)%360,(i*47)%130,1.6,1.6)}c.globalAlpha=1}
  if(R.deco==='peak'){c.lineCap='round';[['rgba(110,255,190,.22)',46],['rgba(170,120,255,.2)',70],['rgba(110,255,190,.14)',92]].forEach(([col,y0],k)=>{c.strokeStyle=col;c.lineWidth=26;c.beginPath();for(let x=-10;x<=370;x+=20){const y=y0+Math.sin(x*.02+t*.6+k)*14;x<0?c.moveTo(x,y):c.lineTo(x,y)}c.stroke()})}
  const sg=c.createRadialGradient(R.sx,R.sy,R.sr*.4,R.sx,R.sy,R.sr*2.4);sg.addColorStop(0,R.sun+'cc');sg.addColorStop(1,R.sun+'00');
  c.fillStyle=sg;c.fillRect(0,0,360,260);c.fillStyle=R.sun;c.beginPath();c.arc(R.sx,R.sy,R.sr,0,7);c.fill();
  c.fillStyle='rgba(255,255,255,.55)';
  for(let i=0;i<3;i++){const x=((t*7+i*140)%440)-40,y=40+i*26;c.beginPath();c.ellipse(x,y,34,8,0,0,7);c.ellipse(x+18,y-5,20,8,0,0,7);c.fill()}
  ridge(c,GROUND-44,62,.021,r*1.7,R.m[1]);ridge(c,GROUND-18,46,.034,r*2.9+1,R.m[0]);
  c.fillStyle=R.ground;c.fillRect(0,GROUND-8,360,70);
  c.fillStyle=R.ground2;c.fillRect(0,GROUND+22,360,50);
  if(R.lake){c.fillStyle='#3d6f8f';c.fillRect(0,GROUND-22,360,16);c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=1;for(let i=0;i<9;i++){const x=(i*47+t*10)%360;c.beginPath();c.moveTo(x,GROUND-16+(i%3)*3);c.lineTo(x+14,GROUND-16+(i%3)*3);c.stroke()}}
  decor(c,R,t);
  c.strokeStyle=R.snow?'rgba(120,150,170,.5)':'rgba(20,40,20,.28)';c.lineWidth=1.6;
  for(let i=0;i<24;i++){const x=i*15+(i%3)*4,y=GROUND+10+((i*29)%52),sw=Math.sin(t*2+i)*2;c.beginPath();c.moveTo(x,y);c.lineTo(x+sw,y-6);c.stroke()}
  if(R.snow){c.fillStyle='#fff';for(let i=0;i<34;i++){const x=(i*37+t*16*(.5+(i%3)*.3))%360,y=(i*53+t*34)%300;c.globalAlpha=.8;c.beginPath();c.arc(x,y,1.4,0,7);c.fill()}c.globalAlpha=1}
}
function limb(c,x,y,a,len,w,col){c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';c.beginPath();c.moveTo(x,y);const x2=x+Math.cos(a)*len,y2=y+Math.sin(a)*len;c.lineTo(x2,y2);c.stroke();return[x2,y2]}
function shadow(c,x,w,lift){c.fillStyle='rgba(0,0,0,'+(.28-lift*.002)+')';c.beginPath();c.ellipse(x,GROUND+3,w*(1-lift*.004),6,0,0,7);c.fill()}

function drawHero(c,h,t){
  TINT=h.flash;const bob=h.hp>0?Math.sin(t*3)*1.5:0,sw=Math.sin(t*3)*1.5;
  shadow(c,h.x+h.off,30,-h.dy);
  c.save();c.translate(h.x+h.off,GROUND+h.dy);c.rotate(h.rot);c.globalAlpha=h.alpha;
  if(S.cls===2){const lg=Math.sin(t*6)*5,hc=mix('#6b4226');c.fillStyle=hc;c.beginPath();c.ellipse(0,-30,42,17,0,0,7);c.fill();c.strokeStyle=hc;c.lineWidth=6;c.lineCap='round';[[-28,lg],[-16,-lg],[18,lg],[30,-lg]].forEach(([x,d])=>{c.beginPath();c.moveTo(x,-22);c.lineTo(x+d,-2);c.stroke()});c.lineWidth=14;c.beginPath();c.moveTo(32,-38);c.lineTo(52,-62);c.stroke();c.beginPath();c.ellipse(58,-62,13,8,.6,0,7);c.fill();c.lineWidth=5;c.beginPath();c.moveTo(-40,-34);c.quadraticCurveTo(-58,-30,-52,-10+lg);c.stroke();c.fillStyle=mix('#d1583a');c.fillRect(-14,-47,28,7);c.translate(0,-34)}
  if(S.cls===4){c.fillStyle=mix('#f4efe4');c.beginPath();c.ellipse(-44,-14,14,9,0,0,7);c.fill();c.beginPath();c.arc(-29,-20,6,0,7);c.fill();c.strokeStyle=mix('#5a4636');c.lineWidth=3;[-50,-38].forEach(x=>{c.beginPath();c.moveTo(x,-8);c.lineTo(x,-1);c.stroke()});c.scale(.86,.86)}
  const skin=mix('#e6b48c'),deel=mix(h.dcol||['#2e6f95','#3f7d4f','#8a3a2e','#6a3fa0','#8a6a3a'][S.cls||0]),trim=mix('#e9b44c');
  limb(c,-13,-76+bob,lerp(2.1,-1.3,h.gu),26,10,mix(h.dcol||'#245a7b'));
  c.fillStyle=mix('#2a3d52');c.fillRect(-13+sw,-34,10,28);c.fillRect(3-sw,-34,10,28);
  c.fillStyle=mix('#1b120d');c.fillRect(-15+sw,-10,14,10);c.fillRect(2-sw,-10,14,10);
  c.fillStyle=deel;c.beginPath();c.moveTo(-23,-28);c.lineTo(23,-28);c.lineTo(17,-80+bob);c.lineTo(-17,-80+bob);c.closePath();c.fill();
  c.strokeStyle=trim;c.lineWidth=3;c.beginPath();c.moveTo(-4,-80+bob);c.lineTo(15,-30);c.stroke();
  c.fillStyle=mix('#d1583a');c.fillRect(-21,-52,42,7);
  if(h.ccol){c.fillStyle=h.ccol;c.beginPath();c.arc(0,-62,4,0,7);c.fill();c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=1;c.stroke()}
  c.fillStyle=skin;c.beginPath();c.arc(0,-94+bob,14,0,7);c.fill();
  c.fillStyle=mix('#1f4e79');c.beginPath();c.moveTo(-15,-101+bob);c.lineTo(15,-101+bob);c.lineTo(7,-123+bob);c.lineTo(-7,-123+bob);c.closePath();c.fill();
  c.fillStyle=trim;c.fillRect(-17,-104+bob,34,5);
  c.fillStyle=mix('#d1583a');c.beginPath();c.arc(0,-126+bob,3.5,0,7);c.fill();
  c.fillStyle='#1a1a1a';c.beginPath();c.arc(6,-94+bob,1.8,0,7);c.fill();
  const a=lerp(lerp(1.15,.1,h.arm),-1.25,h.gu);
  const e=limb(c,14,-76+bob,a,29,10,deel);
  if(h.wcol&&!S.cls){const ba=a-1.25;c.strokeStyle=mix(h.wcol);c.lineWidth=5;c.lineCap='round';c.beginPath();c.moveTo(e[0]-Math.cos(ba)*6,e[1]-Math.sin(ba)*6);c.lineTo(e[0]+Math.cos(ba)*36,e[1]+Math.sin(ba)*36);c.stroke();c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=1.5;c.stroke();c.strokeStyle='#e9b44c';c.lineWidth=4;c.beginPath();c.moveTo(e[0]+Math.cos(ba+1.57)*7,e[1]+Math.sin(ba+1.57)*7);c.lineTo(e[0]-Math.cos(ba+1.57)*7,e[1]-Math.sin(ba+1.57)*7);c.stroke()}
  c.fillStyle=skin;c.beginPath();c.arc(e[0],e[1],6,0,7);c.fill();
  if(S.cls===1){const bx=e[0]+3,bc=mix(h.wcol||'#8a5a2b');c.strokeStyle=bc;c.lineWidth=4;c.beginPath();c.arc(bx,e[1],26,-1.25,1.25);c.stroke();c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=1;c.beginPath();c.moveTo(bx+26*Math.cos(-1.25),e[1]+26*Math.sin(-1.25));c.lineTo(bx+26*Math.cos(1.25),e[1]+26*Math.sin(1.25));c.stroke();c.save();c.translate(-14,-70+bob);c.rotate(-.4);c.fillStyle=mix('#6b4226');c.fillRect(-5,-18,10,36);c.fillStyle='#f4e8cf';c.fillRect(-3,-24,2,8);c.fillRect(1,-26,2,10);c.restore()}
  if(S.cls===2){c.strokeStyle=mix(h.wcol||'#b08a4a');c.lineWidth=4;c.beginPath();c.moveTo(e[0]-18,e[1]+12);c.lineTo(e[0]+58,e[1]-14);c.stroke();c.fillStyle='#e8eef2';c.beginPath();c.moveTo(e[0]+62,e[1]-15);c.lineTo(e[0]+48,e[1]-23);c.lineTo(e[0]+50,e[1]-8);c.fill()}
  if(S.cls===3){[-.5,-.25,0,.25,.5].forEach((a,i)=>{c.strokeStyle=['#d1583a','#e9b44c','#46b394','#e9b44c','#d1583a'][i];c.lineWidth=3;c.beginPath();c.moveTo(Math.sin(a)*6,-124+bob);c.lineTo(Math.sin(a)*30,-150+bob);c.stroke()});c.strokeStyle=mix('#6b4226');c.lineWidth=4;c.beginPath();c.moveTo(e[0]+2,e[1]+34);c.lineTo(e[0]+6,e[1]-46);c.stroke();c.fillStyle='rgba(185,140,255,.95)';c.beginPath();c.arc(e[0]+6,e[1]-52,7,0,7);c.fill()}
  if(S.cls===4){c.strokeStyle=mix('#8a5a2b');c.lineWidth=4;c.beginPath();c.moveTo(e[0]+2,e[1]+34);c.lineTo(e[0]+4,e[1]-44);c.stroke();c.beginPath();c.arc(e[0]+12,e[1]-46,8,Math.PI*.9,Math.PI*2.1);c.stroke()}
  if(h.shield){const sp=.6+.4*Math.sin(performance.now()/180);c.fillStyle='rgba(233,180,76,'+.13*sp+')';c.strokeStyle='rgba(255,213,84,'+.85*sp+')';c.lineWidth=3;c.beginPath();c.ellipse(4,-64,48,80,0,0,7);c.fill();c.stroke()}
  if(h.gu>.3){c.strokeStyle='rgba(233,180,76,'+h.gu*.8+')';c.lineWidth=3;c.beginPath();c.arc(22,-70,44,-1.2,1.2);c.stroke()}
  c.restore();TINT=0;
}
function wolf(c,e,t,P){
  const run=Math.sin(t*5)*3;
  c.strokeStyle=mix(P.body);c.lineWidth=8;c.lineCap='round';c.beginPath();c.moveTo(-30,-38);c.quadraticCurveTo(-54,-54+run,-52,-26);c.stroke();
  c.fillStyle=mix(P.dark);[[-24,0],[-11,1],[13,1],[26,0]].forEach(([x,k])=>c.fillRect(x-3+(k?run*.3:-run*.3),-26,7,26));
  c.fillStyle=mix(P.body);c.beginPath();c.ellipse(0,-38,37,18,0,0,7);c.fill();
  c.fillStyle=mix(P.dark);c.beginPath();c.moveTo(-26,-50);for(let i=0;i<5;i++){c.lineTo(-20+i*10,-62+(i%2)*4);c.lineTo(-15+i*10,-52)}c.fill();
  c.fillStyle=mix(P.body);c.beginPath();c.arc(38,-50,14,0,7);c.fill();
  c.beginPath();c.moveTo(46,-57);c.lineTo(68,-45);c.lineTo(46,-40);c.closePath();c.fill();
  c.fillStyle=mix(P.dark);c.beginPath();c.moveTo(30,-60);c.lineTo(34,-76);c.lineTo(41,-62);c.fill();c.beginPath();c.moveTo(40,-62);c.lineTo(46,-75);c.lineTo(48,-58);c.fill();
  c.fillStyle='#fff';c.beginPath();c.moveTo(50,-43);c.lineTo(54,-38);c.lineTo(57,-44);c.fill();
  c.fillStyle=P.eye;c.beginPath();c.arc(44,-55,2.8,0,7);c.fill();
  c.fillStyle='#111';c.beginPath();c.arc(67,-46,2.4,0,7);c.fill();
}
function bandit(c,e,t,P){
  const sw=Math.sin(t*3)*1.5,bob=Math.sin(t*3)*1.2;
  limb(c,-13,-76,2.1,24,10,mix(P.dark));
  c.fillStyle=mix('#2b2b33');c.fillRect(-13+sw,-34,10,28);c.fillRect(3-sw,-34,10,28);
  c.fillStyle=mix('#18130f');c.fillRect(-15+sw,-10,14,10);c.fillRect(2-sw,-10,14,10);
  c.fillStyle=mix(P.body);c.beginPath();c.moveTo(-23,-28);c.lineTo(23,-28);c.lineTo(17,-80+bob);c.lineTo(-17,-80+bob);c.closePath();c.fill();
  c.fillStyle=mix('#2b2b33');c.fillRect(-21,-52,42,7);
  c.fillStyle=mix('#d9a67e');c.beginPath();c.arc(0,-94+bob,14,0,7);c.fill();
  c.fillStyle=mix('#2a2a32');c.beginPath();c.moveTo(-14,-92+bob);c.lineTo(14,-92+bob);c.lineTo(10,-80+bob);c.lineTo(-10,-80+bob);c.fill();
  c.fillStyle=mix('#b4382a');c.fillRect(-15,-104+bob,30,6);c.fillRect(-18,-103+bob,5,12);
  c.fillStyle=P.eye;c.beginPath();c.arc(6,-97+bob,2,0,7);c.fill();
  const a=lerp(1.1,-.1,e.arm),h=limb(c,14,-76+bob,a,28,10,mix(P.body));
  c.fillStyle=mix('#d9a67e');c.beginPath();c.arc(h[0],h[1],5.5,0,7);c.fill();
  const ba=a-1.5-e.arm*.3;c.strokeStyle=mix('#d8e0e5');c.lineWidth=4;c.lineCap='round';c.beginPath();c.moveTo(h[0],h[1]);c.quadraticCurveTo(h[0]+Math.cos(ba)*20+8,h[1]+Math.sin(ba)*20,h[0]+Math.cos(ba)*38,h[1]+Math.sin(ba)*38+8);c.stroke();
}
function spirit(c,e,t,P){
  const hv=Math.sin(t*2)*6;c.translate(0,-18+hv);
  const g=c.createRadialGradient(0,-56,6,0,-56,70);g.addColorStop(0,P.body+'66');g.addColorStop(1,P.body+'00');c.fillStyle=g;c.fillRect(-80,-130,160,160);
  c.globalAlpha*=.85;c.fillStyle=mix(P.body);c.beginPath();c.moveTo(-26,0);c.bezierCurveTo(-32,-60,-24,-92,0,-94);c.bezierCurveTo(24,-92,32,-60,26,0);
  for(let x=26;x>=-26;x-=13)c.lineTo(x,8+Math.sin(t*5+x*.3)*6);c.closePath();c.fill();
  c.globalAlpha=1;
  limb(c,22,-52,.7+Math.sin(t*3)*.2-e.arm*1.2,30,7,mix(P.body));limb(c,-22,-52,2.4-Math.sin(t*3)*.2,26,7,mix(P.body));
  c.fillStyle='#10202c';c.beginPath();c.ellipse(-9,-68,5,8,0,0,7);c.ellipse(9,-68,5,8,0,0,7);c.fill();
  c.fillStyle=P.eye;c.beginPath();c.arc(-9,-69,2.4,0,7);c.arc(9,-69,2.4,0,7);c.fill();
  c.fillStyle='#10202c';c.beginPath();c.ellipse(0,-48,6,9+Math.sin(t*4)*2,0,0,7);c.fill();
}
function brute(c,e,t,P){
  const sw=Math.sin(t*2.4)*1.5,bob=Math.sin(t*2.4)*1.4;
  limb(c,-26,-78,2.2,28,15,mix(P.dark));
  c.fillStyle=mix(P.dark);c.fillRect(-22+sw,-34,17,34);c.fillRect(5-sw,-34,17,34);
  c.fillStyle=mix(P.body);c.beginPath();c.moveTo(-32,-28);c.lineTo(32,-28);c.lineTo(34,-84+bob);c.lineTo(-34,-84+bob);c.closePath();c.fill();
  c.fillStyle=mix('#4b3326');c.fillRect(-32,-40,64,12);
  c.fillStyle=mix(P.body);c.beginPath();c.arc(4,-100+bob,16,0,7);c.fill();
  c.fillStyle='#efe6d1';c.beginPath();c.moveTo(-8,-108+bob);c.lineTo(-20,-134+bob);c.lineTo(-1,-112+bob);c.fill();c.beginPath();c.moveTo(14,-110+bob);c.lineTo(26,-134+bob);c.lineTo(20,-106+bob);c.fill();
  c.fillStyle=P.eye;c.beginPath();c.arc(12,-103+bob,2.8,0,7);c.arc(3,-103+bob,2.8,0,7);c.fill();
  c.fillStyle='#efe6d1';c.beginPath();c.moveTo(10,-92+bob);c.lineTo(14,-84+bob);c.lineTo(17,-93+bob);c.fill();
  const a=lerp(1.0,-1.6,e.arm),h=limb(c,28,-78+bob,a,32,15,mix(P.body));
  c.fillStyle=mix(P.dark);c.beginPath();c.arc(h[0],h[1],8,0,7);c.fill();
  const ca=a+.5;c.strokeStyle=mix('#6b4a2f');c.lineWidth=8;c.lineCap='round';c.beginPath();c.moveTo(h[0],h[1]);c.lineTo(h[0]+Math.cos(ca)*34,h[1]+Math.sin(ca)*34);c.stroke();
  c.fillStyle=mix('#4a3322');c.beginPath();c.arc(h[0]+Math.cos(ca)*40,h[1]+Math.sin(ca)*40,12,0,7);c.fill();
}
const HGT={wolf:78,bandit:130,spirit:116,brute:150};
function pal(kind,r,boss){
  const rr=r%4,eye=boss?'#ffd54a':'#ff5a3c';
  if(kind==='wolf')return{body:rr===1?'#b79a6b':rr===2?'#dfe7ec':boss?'#a9843a':'#69737b',dark:rr===2?'#b9c7d0':rr===1?'#8f764f':'#434a50',eye};
  if(kind==='bandit')return{body:['#7a4e2d','#9b6b3a','#4b5d73','#35503f'][rr],dark:['#573620','#70492a','#33435a','#243a2d'][rr],eye};
  if(kind==='spirit')return{body:['#9be0c8','#f3d28a','#bfe3ff','#a58bff'][rr],dark:'#000000',eye:'#fff6c8'};
  return{body:['#6b8f4e','#b4673c','#8fb3c9','#4a4f7a'][rr],dark:['#47653a','#8a4b2b','#6a8da3','#323659'][rr],eye};
}
function drawEnemy(c,e,t){
  TINT=e.flash;
  const sc=e.scale;
  shadow(c,e.x+e.off,34*sc,-e.dy);
  c.save();c.translate(e.x+e.off,GROUND+e.dy);c.rotate(e.rot);c.globalAlpha=e.alpha;c.scale(-sc,sc);
  if(e.boss){const g=c.createRadialGradient(0,-60,10,0,-60,90);const p=.5+.2*Math.sin(t*3);g.addColorStop(0,'rgba(233,180,76,'+p*.5+')');g.addColorStop(1,'rgba(233,180,76,0)');c.fillStyle=g;c.fillRect(-100,-160,200,200)}
  ({wolf,bandit,spirit,brute})[e.kind](c,e,t,e.P);
  c.restore();TINT=0;
  if(e.stun&&e.hp>0){for(let i=0;i<3;i++){const a=t*4+i*2.1,x=e.x+e.off+Math.cos(a)*20,y=GROUND-HGT[e.kind]*sc-12+Math.sin(a)*5;c.fillStyle='#ffd54a';c.beginPath();for(let k=0;k<10;k++){const r=k%2?2.5:6;c.lineTo(x+Math.cos(k*Math.PI/5-1.57)*r,y+Math.sin(k*Math.PI/5-1.57)*r)}c.closePath();c.fill()}}
}
function drawFx(c,dt){
  for(let i=B.parts.length-1;i>=0;i--){const p=B.parts[i];p.life-=dt;if(p.life<=0){B.parts.splice(i,1);continue}p.vy+=p.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;c.globalAlpha=clamp(p.life/p.max,0,1);c.fillStyle=p.col;c.beginPath();c.arc(p.x,p.y,p.r,0,7);c.fill()}
  c.globalAlpha=1;c.textAlign='center';
  for(let i=B.texts.length-1;i>=0;i--){const q=B.texts[i];q.life-=dt;if(q.life<=0){B.texts.splice(i,1);continue}q.y-=26*dt;c.globalAlpha=clamp(q.life/.4,0,1);c.font='800 '+q.size+'px Rubik,system-ui,sans-serif';c.lineWidth=4;c.strokeStyle='rgba(9,22,31,.85)';c.strokeText(q.txt,q.x,q.y);c.fillStyle=q.col;c.fillText(q.txt,q.x,q.y)}
  c.globalAlpha=1;
}
function burst(x,y,col,n,sp){for(let i=0;i<n;i++){const a=rnd(0,6.28),s=rnd(30,sp||130);B.parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-30,g:260,r:rnd(1.5,3.8),col,life:rnd(.3,.7),max:.7})}}
function floatText(x,y,txt,col,size){B.texts.push({x,y,txt,col,size:size||20,life:1})}

/* ---------- canvas plumbing ---------- */
const cvB=$('#cvBattle'),cxB=cvB.getContext('2d'),cvC=$('#cvCover'),cxC=cvC.getContext('2d');
function fit(cv){const r=cv.getBoundingClientRect();if(!r.width)return;const d=Math.min(window.devicePixelRatio||1,2);const w=Math.round(r.width*d),h=Math.round(r.width*300/360*d);if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h}}
function fitCanvases(){fit(cvB);fit(cvC)}
window.addEventListener('resize',()=>{fitCanvases();if(scr==='map')renderMap()});

const coverHero={x:100,off:0,dy:0,rot:0,alpha:1,flash:0,arm:0,gu:0,hp:1};
let coverEnemy=null;
function drawCover(t){
  if(!cvC.width)return;
  const c=cxC;c.setTransform(cvC.width/360,0,0,cvC.height/300,0,0);
  const r=Math.floor(t/6)%12;Object.assign(coverHero,gearLook());
  drawBG(c,r,t);
  coverHero.arm=Math.max(0,Math.sin(t*1.3))*.9;
  if(!coverEnemy||coverEnemy.r!==r){const kinds=['wolf','bandit','spirit','brute'];coverEnemy={r,x:272,off:0,dy:0,rot:0,alpha:1,flash:0,arm:0,scale:1,kind:kinds[r%4],boss:false,hp:1,P:pal(kinds[r%4],r,false)}}
  coverEnemy.arm=Math.max(0,Math.sin(t*1.3+1.5))*.8;
  drawHero(c,coverHero,t);drawEnemy(c,coverEnemy,t);
}

/* ---------- battle ---------- */
let B=null,lastT=0;
function drawEffects(c,dt){
  for(let i=B.fx.length-1;i>=0;i--){
    const f=B.fx[i];f.life-=dt;if(f.life<=0){B.fx.splice(i,1);continue}
    const p=1-f.life/f.max;c.save();
    if(f.k==='ring'){c.globalAlpha=1-p;c.strokeStyle=f.col;c.lineWidth=f.w*(1-p)+1;c.beginPath();c.arc(f.x,f.y,lerp(f.r0,f.r1,Math.sqrt(p)),0,7);c.stroke()}
    else if(f.k==='slash'){c.translate(f.x,f.y);c.rotate(f.ang);c.globalAlpha=1-p*p;const L=f.len*(.5+.5*Math.min(1,p*3));c.fillStyle=f.col;c.beginPath();c.moveTo(-L,0);c.quadraticCurveTo(0,-f.w*2.2,L,0);c.quadraticCurveTo(0,-f.w*.5,-L,0);c.fill()}
    else if(f.k==='bolt'){c.globalAlpha=Math.min(1,f.life/f.max*2);c.lineJoin='round';c.strokeStyle=(f.cols&&f.cols[0])||'rgba(120,190,255,.6)';c.lineWidth=11;c.beginPath();f.pts.forEach((q,k)=>k?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.stroke();c.strokeStyle=(f.cols&&f.cols[1])||'#ffffff';c.lineWidth=3.5;c.stroke()}
    else if(f.k==='streak'){c.globalAlpha=1-p;c.strokeStyle=f.col;c.lineWidth=2.2;c.lineCap='round';const x=f.x+f.vx*p,d=f.vx<0?-1:1;c.beginPath();c.moveTo(x,f.y);c.lineTo(x+f.len*d*-1,f.y);c.stroke()}
    else if(f.k==='glow'){c.globalAlpha=1-p;const r=Math.max(1,lerp(f.r0,f.r1,p)),g=c.createRadialGradient(f.x,f.y,1,f.x,f.y,r);g.addColorStop(0,'rgba('+f.rgb+',.9)');g.addColorStop(1,'rgba('+f.rgb+',0)');c.fillStyle=g;c.fillRect(f.x-r,f.y-r,r*2,r*2)}
    else if(f.k==='spark'){c.globalAlpha=1-p;c.strokeStyle=f.col;c.lineWidth=2;c.lineCap='round';const a=f.ang,r0=f.len*.3+f.len*p*.8,r1=r0+f.len*.35;c.beginPath();c.moveTo(f.x+Math.cos(a)*r0,f.y+Math.sin(a)*r0);c.lineTo(f.x+Math.cos(a)*r1,f.y+Math.sin(a)*r1);c.stroke()}
    else if(f.k==='arrow'){const q=(p*f.max-f.d)/f.dur;if(q>0){const y=lerp(f.y0,f.y1,Math.min(1,q)),L=f.big?46:26;c.globalAlpha=q>1?Math.max(0,1-(q-1)*8):1;if(f.big){const g=c.createRadialGradient(f.x,y,2,f.x,y,40);g.addColorStop(0,'rgba(255,240,170,.9)');g.addColorStop(1,'rgba(255,240,170,0)');c.fillStyle=g;c.fillRect(f.x-40,y-40,80,80)}c.strokeStyle=f.col;c.fillStyle=f.col;c.lineWidth=f.big?4:2;c.lineCap='round';c.beginPath();c.moveTo(f.x,y-L);c.lineTo(f.x,y);c.stroke();c.beginPath();c.moveTo(f.x,y+5);c.lineTo(f.x-4,y-3);c.lineTo(f.x+4,y-3);c.fill();c.lineWidth=1.5;c.beginPath();c.moveTo(f.x,y-L);c.lineTo(f.x-4,y-L-5);c.moveTo(f.x,y-L);c.lineTo(f.x+4,y-L-5);c.stroke()}}
    else if(f.k==='run'){const q=(p*f.max-f.d)/f.dur;if(q>0&&q<1.15)drawAnimal(c,f.kind,lerp(f.x0,f.x1,Math.min(1,q)),f.y,performance.now()/55,f.col,(q>1?Math.max(0,1-(q-1)*6):1)*(f.al||1),f.sc,f.rider)}
    else if(f.k==='lasso'){c.globalAlpha=1-p*p;c.translate(f.x,f.y);c.rotate(p*18);c.strokeStyle='#d9d2c0';c.lineWidth=2;c.beginPath();c.ellipse(0,0,30,10,0,0,7);c.stroke();c.fillStyle='#9a9a9a';c.beginPath();c.arc(30,0,4.5,0,7);c.fill()}
    c.restore();
  }
}
function drawBattle(t,dt){
  if(!B||!cvB.width)return;
  const c=cxB;c.setTransform(cvB.width/360,0,0,cvB.height/300,0,0);
  c.save();
  if(B.shake>0){B.shake=Math.max(0,B.shake-dt*30);c.translate(rnd(-B.shake,B.shake),rnd(-B.shake,B.shake))}
  B.zoom=1+(B.zoom-1)*Math.max(0,1-dt*8);
  if(B.zoom>1.002){c.translate(180,170);c.scale(B.zoom,B.zoom);c.translate(-180,-170)}
  drawBG(c,B.L.region,t);
  const h=B.hero,e=B.enemy;
  h.flash=Math.max(0,h.flash-dt*3.5);e.flash=Math.max(0,e.flash-dt*3.5);
  if(B.intent&&!B.over&&e.hp>0){
    const it=B.intent,col=it.type==='guard'?'233,180,76':it.type==='special'?'190,90,220':'209,88,58';
    const k=it.type==='heavy'||it.type==='special'?1:it.type==='guard'?.6:.4,pp=.5+.5*Math.sin(t*6);
    const gx=e.x+e.off,gy=GROUND-HGT[e.kind]*e.scale*.5,R=70*e.scale;
    const g=c.createRadialGradient(gx,gy,8,gx,gy,R);g.addColorStop(0,'rgba('+col+','+(.1+.3*pp)*k+')');g.addColorStop(1,'rgba('+col+',0)');
    c.fillStyle=g;c.fillRect(gx-R,gy-R,R*2,R*2);
  }
  for(let i=B.ghosts.length-1;i>=0;i--){const g=B.ghosts[i];g.life-=dt;if(g.life<=0){B.ghosts.splice(i,1);continue}
    drawHero(c,Object.assign({},h,{off:g.off,arm:g.arm,flash:.6,alpha:g.life/.18*.3,shield:false,gu:0}),t)}
  if(B.e2){B.e2.flash=Math.max(0,B.e2.flash-dt*3.5);drawEnemy(c,B.e2,t)}
  drawHero(c,h,t);drawEnemy(c,e,t);drawEffects(c,dt);drawFx(c,dt);
  if(B.flashA>0){c.globalAlpha=B.flashA;c.fillStyle=B.flashC;c.fillRect(-20,-20,400,340);c.globalAlpha=1;B.flashA=Math.max(0,B.flashA-dt*3)}
  c.restore();
}
function loop(now){
  const t=now/1000,dt=Math.min(.05,t-lastT||.016);lastT=t;
  if(scr==='battle')drawBattle(t,dt);else if(scr==='home')drawCover(t);
  requestAnimationFrame(loop);
}
function tween(ms,fn){return new Promise(res=>{const s=performance.now();(function st(now){const p=Math.min(1,(now-s)/ms);fn(p);if(p<1)requestAnimationFrame(st);else res()})(s)})}

function say(t){$('#log').textContent=t}
const SKL={wind:{lvl:2,cost:30},bless:{lvl:4,cost:40},bolt:{lvl:7,cost:80}};
const SKN=new Proxy({},{get:(_,k)=>cl().sk[k]});
const SP_MULT={wolf:0,bandit:.6,spirit:.8,brute:1.2};
const effAtk=e=>e.atk*(1+.25*(e.buff||0))*(B.mods.eAtk||1);
function skillNote(l0){return Object.keys(SKL).filter(k=>SKL[k].lvl>l0&&SKL[k].lvl<=S.lvl).map(k=>'<div class="tag good" style="align-self:flex-start">Шинэ чадвар: '+SKN[k]+'</div>').join('')}
function skillCard(){return '<div class="card2"><b>Чадварууд</b>'
  +'<div class="row"><span class="grow">'+cl().th+'</span><span class="mini">эхнээс · 50 хийморь</span></div>'
  +Object.keys(SKL).map(k=>'<div class="row"><span class="grow">'+SKN[k]+'</span><span class="'+(S.lvl>=SKL[k].lvl?'tag good':'mini')+'">'+(S.lvl>=SKL[k].lvl?'нээгдсэн':'Түвшин '+SKL[k].lvl)+' · '+SKL[k].cost+'</span></div>').join('')
  +'<p class="mini" style="margin:0">'+cl().d+'</p></div>'}
function updateHUD0(){
  const h=B.hero,e=B.enemy,C=cl();
  document.querySelector('.hud .who b').textContent=C.n;$('#aStrike b').textContent=C.st;$('#aThrow b').textContent=C.th;$('#aWind b').textContent=C.sk.wind;$('#aBless b').textContent=C.sk.bless;$('#aBolt b').textContent=C.sk.bolt;
  $('#hHp').style.width=Math.max(0,100*h.hp/h.max)+'%';
  $('#hChi').style.width=h.chi+'%';
  $('#hNum').textContent=Math.max(0,Math.ceil(h.hp))+'/'+h.max+' · Хийморь '+Math.floor(h.chi)+(h.shield?' · Ерөөл':'')+(h.bleed?' · Цус алдаж байна':'');
  $('#eHp').style.width=Math.max(0,100*e.hp/e.max)+'%';
  $('#eNum').textContent=Math.max(0,Math.ceil(e.hp))+'/'+e.max+(e.buff?' · Хүч +'+e.buff*25+'%':'');
  $('#potSmall').textContent='Үлдсэн: '+(B.run?B.run.pot:S.potions);
  $('#aStrike small').textContent=S.timing?'Цагийг барь · +Хийморь':'Гурвалсан цохилт · +Хийморь';
  $('#tmToggle').textContent='Нарийн цохилт: '+(S.timing?'асаалттай (илүү хүч)':'унтарсан');
  const lock=B.busy;
  $('#aThrow').disabled=lock||h.chi<50;
  $('#aStrike').disabled=lock;$('#aGuard').disabled=lock;$('#aPotion').disabled=lock||(B.run?B.run.pot:S.potions)<1||(h.hp>=h.max&&!h.bleed);
  [['aWind','wind'],['aBless','bless'],['aBolt','bolt']].forEach(([id,k])=>{
    const b=$('#'+id),sk=SKL[k],ok=S.lvl>=sk.lvl;
    b.disabled=lock||!ok||h.chi<sk.cost||(k==='bless'&&h.shield);
    b.querySelector('small').textContent=ok?sk.cost+' хийморь':'Түвшин '+sk.lvl+'-д';
  });
}
function pickIntent0(){
  const e=B.enemy,r=Math.random();
  const w=e.boss?[.26,.34,.06]:[.38,.30,.07];
  const type=r<w[0]?'atk':r<w[0]+w[1]?'heavy':r<w[0]+w[1]+w[2]?'guard':'special';
  const mult=type==='atk'?1:type==='heavy'?1.8:type==='special'?SP_MULT[e.kind]:0;
  B.intent={type,mult};
  const el=$('#intent'),d=Math.max(1,Math.round(effAtk(e)*mult-heroDef()));
  if(type==='guard'){el.className='intent guard';el.textContent='Дайсан хамгаалалтад бэлдэж байна'}
  else if(type==='special'){el.className='intent heavy';el.textContent={wolf:'Дайсан улих гэж байна. Цохилт нь хүчтэй болно',bandit:'Хорт сум ≈ '+d+', цус алдуулна',spirit:'Амь сорох ≈ '+d+', өөрөө эдгэрнэ',brute:'Газар доргиох ≈ '+d+', хийморь буурна'}[e.kind]}
  else{el.className='intent '+(type==='heavy'?'heavy':'atk');el.textContent=(type==='heavy'?'Хүчтэй цохилт ирж байна! ':'Дайсан цохих гэж байна ')+'≈ '+d}
}
function startBattle0(L,opts){
  const n=L.n,boss=L.boss;
  const md=L.mode||0,nb=n<=20?n:20+(n-20)*.75;
  const ne=opts.run?(n<=25?n*.9:22.5+(n-25)*.6):nb+[0,8,16][md];
  const hp=Math.round((46+15*ne)*1.3*(boss?2.1:1)*[1,1.35,1.8][md]),atk=Math.round((6+1.4*ne)*1.2*(boss?1.3:1)*[1,1.25,1.5][md]);
  const mods={};(opts.daily?opts.daily.mods:[]).forEach(m=>{if(m.eAtk)mods.eAtk=m.eAtk;if(m.chiMul)mods.chiMul=m.chiMul;if(m.dmg)mods.dmg=m.dmg;if(m.goldMul)mods.goldMul=m.goldMul});
  B={active:true,L,opts,run:opts.run||null,endless:!!opts.run,daily:opts.daily||null,mods,turn:0,busy:true,over:false,shake:0,parts:[],texts:[],fx:[],ghosts:[],zoom:1,flashA:0,flashC:'#fff',intent:null,
    hero:{x:92,off:0,dy:0,rot:0,alpha:1,flash:0,arm:0,gu:0,guard:false,shield:!!(opts.run&&opts.run.sh),bleed:null,wcol:gearLook().wcol,dcol:gearLook().dcol,ccol:gearLook().ccol,hp:opts.run?opts.run.hp:heroMax(),max:opts.run?opts.run.max:heroMax(),chi:opts.run?opts.run.chi0:Math.min(100,10*S.up.chi+gear().chiS)},
    enemy:{x:268,off:140,dy:0,rot:0,alpha:0,flash:0,arm:0,scale:boss?1.28:(L.kind==='brute'?1.05:1),kind:L.kind,boss,hp,max:hp,atk,buff:(md===2?1:0)+(opts.run?(n>=20?2:n>=10?1:0):0),enraged:false,guarding:false,stun:false,P:pal(L.kind,L.region,boss)}};
  $('#eName').textContent=(opts.run?'Давалгаа '+L.n+' · ':'')+(boss?'Ахлагч · ':'')+L.name;
  $('#intent').className='intent';$('#intent').textContent='';
  $('#timing').hidden=true;
  say(opts.run?('Давалгаа '+L.n):L.n&&!opts.daily?(L.n+'-р түвшин'):'Өдрийн тулаан');
  go('battle');fitCanvases();updateHUD();
  tween(600,p=>{B.enemy.off=140*(1-p)*(1-p);B.enemy.alpha=Math.min(1,p*2)}).then(()=>{
    if(!B||B.over)return;
    say('Тулаан эхэллээ. Нүүдлээ сонго.');pickIntent();B.busy=false;updateHUD();
  });
}

const twinWave=n=>n>=3&&n%5!==0&&n%2===1;
function updateHUD(){updateHUD0();if(B&&B.e2)$('#eNum').textContent+=' \xb7 2-\u0440 \u0434\u0430\u0439\u0441\u0430\u043d '+Math.max(0,Math.ceil(B.e2.hp))+'/'+B.e2.max}
function pickIntent(){pickIntent0();if(B.e2){const e2=B.e2,d2=Math.max(1,Math.round(e2.atk*(1+.25*(e2.buff||0))*(B.mods.eAtk||1)-heroDef())),el=$('#intent');el.textContent+=' \xb7 2-\u0440 \u0434\u0430\u0439\u0441\u0430\u043d \u2248 '+d2}}
function startBattle(L,opts){
  startBattle0(L,opts);
  if(opts.run&&twinWave(L.n)){
    const e=B.enemy,K=['wolf','bandit','spirit','brute'],k2=K[(K.indexOf(e.kind)+1+(L.n>>1)%3)%4];
    e.hp=e.max=Math.round(e.max*.65);e.atk=Math.round(e.atk*.7);e.x=258;
    B.e2={x:322,off:0,dy:0,rot:0,alpha:1,flash:0,arm:0,scale:.85,kind:k2,boss:false,hp:e.max,max:e.max,atk:e.atk,buff:e.buff,enraged:false,guarding:false,stun:false,P:pal(k2,L.region,false)};
    $('#eName').textContent+=' + 2-\u0440 \u0434\u0430\u0439\u0441\u0430\u043d';
    updateHUD();
  }
}
async function promote(){
  const o=B.enemy,n=B.e2;
  await tween(600,p=>{o.rot=p*1.4;o.alpha=1-p;o.dy=p*18;o.off=p*30});
  sfx('win');S.st.kills++;
  B.e2=null;B.enemy=n;n.arrive=true;
  await tween(450,p=>{n.x=lerp(322,258,p);n.scale=lerp(.85,1,p)});
  $('#eName').textContent=$('#eName').textContent.replace(/ \+ .*$/,'');
  pickIntent();updateHUD();
}
async function e2Turn(){
  const e=B.e2,h=B.hero;if(!e)return;
  if(e.stun){e.stun=false;return}
  let dmg=Math.max(1,Math.round(e.atk*(1+.25*(e.buff||0))*(B.mods.eAtk||1)*rnd(.92,1.08)-heroDef()));
  const sh=h.shield;if(sh){dmg=0;h.shield=false}else if(h.guard)dmg=Math.max(1,Math.round(dmg*.5));
  say('2-\u0440 \u0434\u0430\u0439\u0441\u0430\u043d \u0446\u043e\u0445\u0438\u043b\u043e\u043e.');
  let hit=false;
  await tween(340,p=>{
    e.off=-Math.sin(p*Math.PI)*170;e.arm=Math.sin(Math.min(1,p*1.3)*Math.PI);
    if(!hit&&p>.5){hit=true;
      if(sh){fxRing(h.x,GROUND-64,20,76,'#ffd54a',6,.4);floatText(h.x,GROUND-135,'\u0415\u0440\u04e9\u04e9\u043b \u0445\u0430\u0430\u043b\u0430\u0430!','#ffd54a',18);sfx('guard')}
      else if(h.guard){h.flash=.5;B.shake=3;fxRing(h.x+22,GROUND-70,6,40,'#ffd54a',5,.3);floatText(h.x,GROUND-135,'-'+dmg,'#ffd54a',20);h.hp=Math.max(0,h.hp-dmg);sfx('guard');updateHUD()}
      else hurtHero(dmg,false)}
  });
  e.off=0;e.arm=0;updateHUD();
}
function timing(){
  return new Promise(res=>{
    const box=$('#timing'),cur=$('#tbc');box.hidden=false;
    const sp=1.45+Math.min(B.L.n,24)*.055,s=performance.now();let done=false,raf;
    (function f(now){if(done)return;const p=1-Math.abs(1-(((now-s)/1000*sp)%2));cur.style.left=(p*100)+'%';cur.dataset.p=p;raf=requestAnimationFrame(f)})(s);
    const stop=()=>{if(done)return;done=true;cancelAnimationFrame(raf);const p=+cur.dataset.p||0;$('#tbHit').onclick=null;box.onpointerdown=null;box.hidden=true;res(p>=.455&&p<=.545?'perfect':(p>=.33&&p<=.67?'good':'miss'))};
    $('#tbHit').onclick=e=>{e.stopPropagation();stop()};box.onpointerdown=stop;
  });
}
const fxRing=(x,y,r0,r1,col,w,life)=>B.fx.push({k:'ring',x,y,r0,r1,col,w:w||6,life:life||.4,max:life||.4});
const fxSlash=(x,y,ang,len,col,w,life)=>B.fx.push({k:'slash',x,y,ang,len,col,w:w||10,life:life||.28,max:life||.28});
const fxGlow=(x,y,r0,r1,rgb,life)=>B.fx.push({k:'glow',x,y,r0,r1,rgb,life:life||.5,max:life||.5});
function fxBolt(x,y,cols){const pts=[[x+rnd(-24,24),-10]];let cy=-10;while(cy<y-20){cy+=rnd(18,32);pts.push([x+rnd(-20,20),Math.min(cy,y)])}pts.push([x,y]);B.fx.push({k:'bolt',pts,cols,life:.38,max:.38})}
function fxSparks(x,y,col,n){for(let i=0;i<n;i++)B.fx.push({k:'spark',x,y,ang:rnd(0,6.28),len:rnd(16,36),col,life:.26,max:.26})}
function fxFlash(col,a){B.flashC=col;B.flashA=a}
function hitEnemy(dmg,type,ign){
  const e=B.enemy,big=type!=='hit';
  sfx((big?'ab':'ah')+(S.cls||0));
  if(e.guarding&&!ign)dmg=Math.max(1,Math.round(dmg*.5));
  e.hp=Math.max(0,e.hp-dmg);e.flash=1;
  const cx=e.x,cy=GROUND-HGT[e.kind]*e.scale*.55;
  B.shake=big?11:5;if(big)B.zoom=1.06;
  fxSlash(cx,cy,rnd(-.9,-.4),big?64:44,big?'#ffd54a':'#fff6e0',big?15:10);
  if(big)fxSlash(cx,cy,rnd(.4,.9),54,'#ffffff',9,.3);
  fxRing(cx,cy,6,big?74:44,big?'#ffd54a':'#f4e8cf',big?8:5,.38);
  fxSparks(cx,cy,big?'#ffd54a':'#ffffff',big?13:7);
  if(big)fxFlash('#fff4d0',.28);
  burst(e.x-10,GROUND-60*e.scale,big?'#ffd54a':'#f4e8cf',big?22:12,big?190:120);
  floatText(e.x,GROUND-HGT[e.kind]*e.scale-4,(type==='crit'?'ГАЙХАЛТАЙ! ':'')+dmg,big?'#ffd54a':'#fff',big?26:20);
  if(B.run&&B.run.ls&&B.hero.hp>0){const hl=Math.max(1,Math.round(dmg*B.run.ls));B.hero.hp=Math.min(B.hero.max,B.hero.hp+hl);floatText(B.hero.x,GROUND-130,'+'+hl,'#7be3bd',16)}
  sfx(big?'crit':'hit');updateHUD();
}
function hurtHero(dmg,heavy){
  const h=B.hero;h.hp=Math.max(0,h.hp-dmg);h.flash=1;B.shake=heavy?12:6;if(heavy)B.zoom=1.04;
  const cx=h.x,cy=GROUND-64;
  fxSlash(cx,cy,rnd(.4,.9),heavy?58:42,'#ff8b6e',heavy?14:10);fxRing(cx,cy,6,heavy?62:40,'#d1583a',6,.35);fxSparks(cx,cy,'#ffb09a',heavy?10:6);
  fxFlash('#d1583a',heavy?.3:.16);
  burst(h.x+10,GROUND-60,'#d1583a',12,120);floatText(h.x,GROUND-130,'-'+dmg,'#ff8b6e',22);sfx('hurt');updateHUD();
}
function addChi(n){B.hero.chi=Math.min(100,B.hero.chi+n*[1,1,1.25,1.4,1.15][S.cls||0]*(B.mods.chiMul||1)*(1+gear().chiG/100+(B.run?B.run.chi:0)))}
const dmgBase=()=>heroAtk()*(B.mods.dmg||1)*(B.run?B.run.atk:1)*rnd(.92,1.08);
async function heroLunge(onHit){
  let hit=false;
  await tween(320,p=>{
    B.hero.off=Math.sin(p*Math.PI)*118;B.hero.arm=Math.sin(Math.min(1,p*1.3)*Math.PI);
    B.ghosts.push({off:B.hero.off,arm:B.hero.arm,life:.18});if(B.ghosts.length>14)B.ghosts.shift();
    if(!hit&&p>.5){hit=true;onHit()}});
  B.hero.off=0;B.hero.arm=0;
}
async function heroCombo(total,crit){
  const parts=[.3,.3,.4],at=[.26,.5,.74];let k=0;
  await tween(640,p=>{
    B.hero.off=Math.sin(Math.min(1,p*1.08)*Math.PI)*118;B.hero.arm=Math.abs(Math.sin(p*Math.PI*3));
    B.ghosts.push({off:B.hero.off,arm:B.hero.arm,life:.18});if(B.ghosts.length>14)B.ghosts.shift();
    while(k<3&&p>at[k]){const last=k===2;if(B.enemy.hp>0)hitEnemy(Math.max(1,Math.round(total*parts[k])),last&&crit?'crit':'hit');k++}
  });
  B.hero.off=0;B.hero.arm=0;
}

const pick=a=>a[Math.floor(Math.random()*a.length)];
function fxFire(x,y,n){for(let i=0;i<n;i++)B.parts.push({x:x+rnd(-14,14),y,vx:rnd(-20,20),vy:rnd(-110,-30),g:-140,r:rnd(3,6.5),col:pick(['#ff7a2a','#ffb23a','#ffe08a']),life:rnd(.4,.8),max:.8})}
function fxDust(x,y,n){for(let i=0;i<n;i++)B.parts.push({x:x+rnd(-8,8),y,vx:rnd(-60,10),vy:rnd(-40,-8),g:30,r:rnd(3,7),col:'#bda37c',life:rnd(.3,.6),max:.6})}
function fxArrow(x,y1,d,dur,col,big){B.fx.push({k:'arrow',x,y0:-20,y1,d,dur,col,big,life:d+dur+.14,max:d+dur+.14})}
function drawAnimal(c,k,x,y,g,col,al,sc,rd){
  c.save();c.translate(x,y);c.scale(sc,sc);c.globalAlpha=al;c.fillStyle=col;c.strokeStyle=col;c.lineCap='round';c.shadowColor=col;c.shadowBlur=10;
  const L=Math.sin(g)*7,L2=-L;
  if(k==='sheep'){c.fillStyle='#f4efe4';[[-10,-18],[0,-21],[10,-18],[-4,-14],[6,-14]].forEach(([a,b])=>{c.beginPath();c.arc(a,b,8,0,7);c.fill()});c.fillStyle='#3a3a3a';c.beginPath();c.arc(19,-17,5,0,7);c.fill();c.strokeStyle='#3a3a3a';c.lineWidth=3;[[-8,L],[8,L2]].forEach(([a,d])=>{c.beginPath();c.moveTo(a,-9);c.lineTo(a+d*.6,0);c.stroke()})}
  else{const hs=k==='horse',bl=hs?30:19,bh=hs?12:7,by=hs?-28:-17;
    c.beginPath();c.ellipse(0,by,bl,bh,0,0,7);c.fill();
    c.lineWidth=hs?6:4;[[-bl*.7,L],[-bl*.45,L2],[bl*.5,L2],[bl*.7,L]].forEach(([a,d])=>{c.beginPath();c.moveTo(a,by+bh*.5);c.lineTo(a+d,0);c.stroke()});
    c.lineWidth=hs?12:7;c.beginPath();c.moveTo(bl*.7,by-3);c.lineTo(bl*.95,by-(hs?20:9));c.stroke();
    c.beginPath();c.ellipse(bl*1.1,by-(hs?22:10),hs?11:8,hs?6:4.5,.5,0,7);c.fill();
    c.lineWidth=hs?5:3;c.beginPath();c.moveTo(-bl,by-2);c.quadraticCurveTo(-bl-14,by+(hs?2:-8),-bl-10,by+(hs?18:4)+L*.3);c.stroke();
    if(rd){c.lineWidth=7;c.beginPath();c.moveTo(-2,by-8);c.lineTo(-2,by-30);c.stroke();c.beginPath();c.arc(-2,by-37,6,0,7);c.fill();c.lineWidth=2.5;c.beginPath();c.moveTo(-6,by-22);c.lineTo(46,by-34);c.stroke()}}
  c.restore();
}
async function charge(kind,n,o){
  const e=B.enemy,h=B.hero,dur=o.dur||.55,gap=o.gap||.12;
  for(let i=0;i<n;i++){const d=i*gap;
    B.fx.push({k:'run',kind,x0:h.x-20,x1:e.x-22,y:GROUND+(i%3-1)*5,col:o.col,sc:o.sc||1,rider:o.rider,al:o.al,d,dur,life:d+dur*1.15,max:d+dur*1.15});
    setTimeout(()=>{if(B&&!B.over&&e.hp>0){o.hit(i);fxDust(e.x-20,GROUND-4,3)}},(d+dur)*1000)}
  await sleep((n-1)*gap*1000+dur*1000+300);
}
async function shoot(n,dm,type,ign){
  const h=B.hero,e=B.enemy,col=['#f4e8cf','#f4e8cf','#f4e8cf','#c9a0ff','#d9d2c0'][S.cls||0];
  for(let i=0;i<n;i++){
    if(e.hp<=0)break;
    await tween(130,p=>{h.arm=p*.85});sfx('rl'+S.cls);
    const y=GROUND-98+rnd(-5,5);
    B.fx.push({k:'streak',x:h.x+34,y,vx:200,len:46,col,life:.2,max:.2});
    await sleep(190);
    hitEnemy(Math.round(dm),i===n-1?type:'hit',ign);fxSparks(e.x-18,y,col==='#f4e8cf'?'#ffe9a8':col,5);
    h.arm=0;await sleep(n>2?60:110);
  }
}
async function strikeArcher(){
  let mult=1,type='hit',n=S.timing?1:2;
  if(S.timing){const q=await timing();mult={perfect:2.1,good:1.2,miss:.65}[q];if(q==='perfect'){S.st.perfect++;type='crit'}say(q==='perfect'?'Яг онолоо!':q==='good'?'Сайн харвалт.':'Алдлаа.')}
  else{const crit=Math.random()<(S.cls===1?.35:.25)+(B.run?B.run.crit:0);if(crit){S.st.perfect++;type='crit'}mult=crit?2:1.3;say(crit?'Яг онолоо!':'Хоёр сум харвалаа!')}
  await shoot(n,dmgBase()*mult/n,type);addChi(25);
}
async function actStrike(){
  if(S.cls===1||S.cls>=3)return strikeArcher();
  if(!S.timing){
    const crit=Math.random()<.2+(B.run?B.run.crit:0);if(crit)S.st.perfect++;
    say(crit?'Гайхалтай гурвалсан цохилт!':'Гурвалсан цохилт!');
    await heroCombo(Math.round(dmgBase()*(crit?1.9:1.3)),crit);addChi(25);return;
  }
  const q=await timing();
  const mult={perfect:2.1,good:1.2,miss:.65}[q];
  if(q==='perfect')S.st.perfect++;
  const dmg=Math.round(dmgBase()*mult);
  say(q==='perfect'?'Яг онож цохилоо!':q==='good'?'Сайн цохилт.':'Хоцорлоо.');
  await heroLunge(()=>hitEnemy(dmg,q==='perfect'?'crit':'hit'));
  addChi(25);
}
async function actThrow(){
  const h=B.hero,e=B.enemy,c=S.cls;h.chi-=50;S.st.throws++;say(cl().th+'!');
  if(c===1){
    await tween(260,p=>{h.arm=p});sfx('rl1');
    for(let i=0;i<5;i++){fxArrow(e.x+rnd(-26,26),GROUND-30-rnd(0,40),i*.1,.3,'#f4e8cf');const dm=dmgBase()*.46;setTimeout(()=>{if(B&&e.hp>0){hitEnemy(Math.round(dm),i===4?'big':'hit');fxSparks(e.x,GROUND-50,'#ffe9a8',4)}},(i*.1+.3)*1000)}
    await sleep(1000);h.arm=0;addChi(10);return}
  if(c===3){
    fxGlow(h.x,GROUND-70,10,90,'185,140,255',.6);fxRing(h.x,GROUND-60,8,70,'#c9a0ff',5,.5);await sleep(320);
    await charge('wolf',3,{col:'#c9a0ff',sc:1.05,al:.85,dur:.5,gap:.18,hit:i=>hitEnemy(Math.round(dmgBase()*.8),i===2?'big':'hit')});
    const a=Math.round(h.max*.1);h.hp=Math.min(h.max,h.hp+a);floatText(h.x,GROUND-132,'+'+a,'#7be3bd',20);sfx('heal');fxRing(h.x,GROUND-60,8,60,'#7be3bd',5,.5);updateHUD();addChi(10);return}
  if(c===4){
    await charge('wolf',4,{col:'#c9a15a',sc:.8,dur:.45,gap:.13,hit:i=>hitEnemy(Math.round(dmgBase()*.55),i===3?'big':'hit')});
    if(e.hp>0)e.stun=true;B.shake=8;addChi(10);return}
  let hit=false;const cv=c===2;
  await tween(300,p=>{h.off=p*110;h.arm=p;if(cv&&Math.random()<.7)fxDust(h.x+h.off-14,GROUND-4,1);B.ghosts.push({off:h.off,arm:h.arm,life:.18});if(B.ghosts.length>14)B.ghosts.shift()});
  fxRing(e.x,GROUND-40,8,50,'#f4e8cf',4,.3);
  await tween(620,p=>{
    e.dy=-Math.sin(p*Math.PI)*(cv?24:90);e.rot=cv?-Math.sin(p*Math.PI)*.4:-p*Math.PI*2;if(cv)e.off=Math.sin(p*Math.PI)*46;h.arm=1-p;
    if(Math.random()<.5)B.fx.push({k:'streak',x:e.x+rnd(-20,20),y:GROUND-30+e.dy+rnd(-30,30),vx:-60,len:26,col:'#f4e8cf',life:.2,max:.2});
    if(!hit&&p>.92){hit=true;e.rot=0;e.dy=0;hitEnemy(Math.round(dmgBase()*2.1),'big');e.stun=true;B.shake=14;fxRing(e.x,GROUND-4,10,100,'#e9d9b0',6,.45);if(cv)fxDust(e.x,GROUND-6,14)}
  });
  e.dy=0;e.rot=0;e.off=0;
  await tween(240,p=>{h.off=110*(1-p);h.arm=0});h.off=0;
  addChi(10);
}
async function actWind(){
  const h=B.hero,e=B.enemy,c=S.cls;h.chi-=SKL.wind.cost;say(cl().sk.wind+'!');
  if(c===1){await shoot(3,dmgBase()*.68,'hit');addChi(10);return}
  if(c===3){
    for(let i=0;i<4;i++){await tween(110,p=>{h.arm=p*.9});sfx('rl3');const y=GROUND-100;fxGlow(h.x+36,y,4,26,'255,150,60',.25);B.fx.push({k:'streak',x:h.x+34,y,vx:200,len:50,col:'#ff9a3c',life:.22,max:.22});await sleep(200);if(e.hp<=0)break;hitEnemy(Math.round(dmgBase()*.5),'hit');fxFire(e.x,GROUND-50,10);fxGlow(e.x,GROUND-50,6,50,'255,140,40',.3);h.arm=0;await sleep(70)}
    addChi(10);return}
  if(c===4){
    B.fx.push({k:'lasso',x:h.x+30,y:GROUND-118,life:.6,max:.6});await tween(600,p=>{h.arm=.5+.4*Math.sin(p*20)});h.arm=0;
    await shoot(3,dmgBase()*.68,'hit');addChi(10);return}
  for(let k=0;k<2;k++){
    await heroLunge(()=>{
      for(let i=0;i<6;i++)B.fx.push({k:'streak',x:h.x+30,y:GROUND-110+i*14,vx:190+rnd(0,70),len:56,col:'#cfeffd',life:.32,max:.32});
      fxSlash(e.x-30,GROUND-70,k?.7:-.7,70,'#cfeffd',12,.3);fxSlash(e.x-34,GROUND-62,k?-.5:.5,56,'#ffffff',8,.26);
      if(c===2)fxDust(h.x+h.off-10,GROUND-4,8);else burst(e.x-30,GROUND-70,'#cfeffd',10,160);
      hitEnemy(Math.round(dmgBase()*.95),'hit');
    });
  }
  addChi(10);
}
async function actBless(){
  const h=B.hero;h.chi-=SKL.bless.cost;say('Тэнгэрийн ерөөл! Дараагийн цохилтыг хаана.');sfx('heal');
  fxGlow(h.x,GROUND-60,10,90,'233,180,76',.8);fxRing(h.x,GROUND-60,10,74,'#ffd54a',6,.6);fxRing(h.x,GROUND-60,6,52,'#fff6d0',4,.85);
  const add=Math.round(h.max*[.15,.15,.25,.2,.25][S.cls||0]);h.hp=Math.min(h.max,h.hp+add);h.shield=true;h.bleed=null;
  floatText(h.x,GROUND-132,'+'+add,'#7be3bd',22);burst(h.x,GROUND-60,'#ffd54a',18,80);updateHUD();await sleep(650);
}
async function actBolt(){
  const h=B.hero,e=B.enemy,c=S.cls;h.chi-=SKL.bolt.cost;say(cl().sk.bolt+'!');
  const T=()=>Math.round(dmgBase()*3.3);
  if(c===1){
    fxFlash('#ffe9a8',.25);
    await tween(420,p=>{h.arm=p;if(Math.random()<.5)B.fx.push({k:'glow',x:h.x+34,y:GROUND-98,r0:30,r1:4,rgb:'255,230,150',life:.14,max:.14})});
    fxArrow(e.x,GROUND-25,0,.28,'#fff3b0',true);B.zoom=1.08;await sleep(280);
    hitEnemy(T(),'big',true);fxRing(e.x,GROUND-50,10,120,'#ffe9a8',7,.45);fxSparks(e.x,GROUND-50,'#fff3b0',14);B.shake=14;h.arm=0;await sleep(200);return}
  if(c===2){
    fxFlash('#ffe9a8',.2);const dm=T()/7;
    await charge('horse',7,{col:'rgba(255,224,150,.95)',al:.8,rider:true,dur:.5,gap:.09,hit:i=>{fxSlash(e.x-10,GROUND-60,rnd(-.8,.8),50,'#fff3b0',9,.25);fxSparks(e.x,GROUND-50,'#ffe9a8',5);hitEnemy(Math.round(dm),i===6?'big':'hit',true)}});
    B.shake=16;fxRing(e.x,GROUND-6,10,120,'#ffe9a8',8,.5);return}
  if(c===3){
    fxFlash('#2a0f4a',.5);
    await tween(520,p=>{h.arm=p;h.dy=-Math.sin(p*Math.PI)*8;if(Math.random()<.6)B.fx.push({k:'glow',x:h.x+24,y:GROUND-135,r0:34,r1:6,rgb:'170,90,255',life:.16,max:.16})});
    const P=['rgba(170,90,255,.6)','#f0d9ff'];fxBolt(e.x,GROUND-20,P);fxBolt(e.x-12,GROUND-20,P);fxBolt(e.x+12,GROUND-20,P);
    for(let i=0;i<22;i++)B.parts.push({x:e.x+rnd(-22,22),y:GROUND-8,vx:rnd(-15,15),vy:rnd(-140,-50),g:-60,r:rnd(2,4.5),col:'#b57cff',life:.9,max:.9});
    B.zoom=1.1;hitEnemy(T(),'big',true);B.shake=16;
    fxRing(e.x,GROUND-6,10,120,'#b57cff',8,.55);fxRing(e.x,GROUND-6,6,80,'#f0d9ff',5,.7);fxGlow(e.x,GROUND-50,10,110,'170,90,255',.6);
    await tween(320,p=>{h.arm=1-p;h.dy=0});h.arm=0;h.dy=0;return}
  if(c===4){
    const dm=T()/8;
    await charge('sheep',8,{sc:1.1,dur:.55,gap:.08,hit:i=>hitEnemy(Math.round(dm),i===7?'big':'hit',true)});
    B.shake=14;fxDust(e.x,GROUND-6,16);fxRing(e.x,GROUND-6,10,110,'#e9d9b0',6,.45);return}
  await tween(560,p=>{h.arm=p;h.dy=-Math.sin(p*Math.PI)*8;if(Math.random()<.6)B.fx.push({k:'glow',x:h.x+24,y:GROUND-135,r0:34,r1:6,rgb:'160,210,255',life:.14,max:.14})});
  fxFlash('#9fd0ff',.55);fxBolt(e.x,GROUND-20);fxBolt(e.x+8,GROUND-20);
  B.zoom=1.1;
  hitEnemy(T(),'big',true);B.shake=18;
  fxRing(e.x,GROUND-6,10,120,'#bfe3ff',8,.5);fxGlow(e.x,GROUND-50,10,100,'160,210,255',.5);
  await tween(320,p=>{h.arm=1-p;h.dy=0});h.arm=0;h.dy=0;
}
async function actGuard(){
  S.st.guards++;B.hero.guard=true;say('Хамгаалалтад бэлдлээ.');addChi(20);sfx('guard');
  await tween(220,p=>{B.hero.gu=p});
  floatText(B.hero.x,GROUND-135,'Хамгаалалт','#ffd54a',16);
}
async function actPotion(){
  if(B.run)B.run.pot--;else{S.potions--;S.st.potions++}const h=B.hero,add=Math.round(h.max*.45);h.hp=Math.min(h.max,h.hp+add);h.bleed=null;sfx('heal');say('Айраг уулаа.');
  burst(h.x,GROUND-60,'#bff1de',16,90);fxRing(h.x,GROUND-60,8,60,'#7be3bd',5,.5);floatText(h.x,GROUND-130,'+'+add,'#7be3bd',22);updateHUD();await sleep(450);
}
async function enemyTurn(){
  const e=B.enemy,h=B.hero;e.guarding=false;const hadBleed=!!h.bleed;
  if(e.arrive){e.arrive=false;say('\u0414\u0430\u0439\u0441\u0430\u043d \u0443\u0440\u0430\u0433\u0448\u0438\u043b\u043b\u0430\u0430.');await sleep(500);return}
  if(e.boss&&!e.enraged&&e.hp>0&&e.hp/e.max<.35){
    e.enraged=true;e.buff=Math.min(3,e.buff+1);say('Ахлагч ууссан!');floatText(e.x,GROUND-HGT[e.kind]*e.scale-6,'ЦАЙЛАВ!','#ff8b6e',24);
    fxRing(e.x,GROUND-60,10,130,'#d1583a',8,.6);fxFlash('#d1583a',.25);B.shake=10;sfx('hurt');updateHUD();await sleep(750);
  }
  if(e.stun){e.stun=false;say('Дайсан ухаан алдсан тул нүүдлээ алдлаа.');await sleep(600);return}
  const it=B.intent;
  if(it.type==='guard'){e.guarding=true;say('Дайсан хамгаалалтад бэлдлээ.');floatText(e.x,GROUND-HGT[e.kind]*e.scale-4,'Хамгаалалт','#ffd54a',16);burst(e.x,GROUND-50,'#ffd54a',10,70);fxRing(e.x,GROUND-50,10,60,'#ffd54a',5,.4);await sleep(600);return}
  if(it.type==='special'&&e.kind==='wolf'){
    e.buff=Math.min(3,e.buff+1);say('Чоно улив. Цохилт нь хүчтэй болов!');sfx('hurt');
    await tween(520,p=>{e.dy=-Math.sin(p*Math.PI)*16});e.dy=0;
    fxRing(e.x,GROUND-60,10,100,'#ff8b6e',6,.5);floatText(e.x,GROUND-HGT.wolf*e.scale-4,'Хүч +25%','#ff8b6e',18);updateHUD();await sleep(300);return;
  }
  const heavy=it.type==='heavy'||it.type==='special';
  let dmg=Math.max(1,Math.round(effAtk(e)*it.mult*rnd(.92,1.08)-heroDef()));
  const shielded=h.shield;
  if(shielded){dmg=0;h.shield=false}else if(h.guard)dmg=Math.max(1,Math.round(dmg*.5));
  say(it.type==='special'?'Дайсан онцгой хүч хэрэглэв!':heavy?'Дайсан хүчтэй цохилоо!':'Дайсан цохилоо.');
  let hit=false;
  await tween(heavy?440:320,p=>{
    e.off=-Math.sin(p*Math.PI)*118;e.arm=Math.sin(Math.min(1,p*1.3)*Math.PI);
    if(!hit&&p>.5){hit=true;
      if(shielded){fxRing(h.x,GROUND-64,20,76,'#ffd54a',6,.4);fxGlow(h.x,GROUND-64,10,70,'233,180,76',.4);floatText(h.x,GROUND-135,'Ерөөл хаалаа!','#ffd54a',18);sfx('guard');B.shake=3}
      else if(h.guard){h.flash=.5;B.shake=3;burst(h.x+22,GROUND-70,'#ffd54a',10,90);fxRing(h.x+22,GROUND-70,6,40,'#ffd54a',5,.3);fxSparks(h.x+22,GROUND-70,'#ffd54a',6);floatText(h.x,GROUND-135,'-'+dmg,'#ffd54a',20);h.hp=Math.max(0,h.hp-dmg);sfx('guard');updateHUD()}
      else hurtHero(dmg,heavy)}
  });
  e.off=0;e.arm=0;updateHUD();
  if(h.hp<=0)return;
  if(it.type==='special'&&!shielded){
    if(e.kind==='bandit'){h.bleed={t:3,d:Math.max(2,Math.round(e.atk*.3))};floatText(h.x,GROUND-150,'Цус алдаж байна','#ff8b6e',15)}
    else if(e.kind==='spirit'){e.hp=Math.min(e.max,e.hp+dmg);floatText(e.x,GROUND-HGT.spirit*e.scale-6,'+'+dmg,'#7be3bd',20);burst(e.x,GROUND-60,'#7be3bd',12,80);fxRing(e.x,GROUND-60,8,60,'#7be3bd',5,.4)}
    else if(e.kind==='brute'){h.chi=Math.max(0,h.chi-35);floatText(h.x,GROUND-150,'Хийморь −35','#ffd54a',15);B.shake=12;fxRing(e.x-30,GROUND-4,10,120,'#e9d9b0',6,.45)}
    updateHUD();
  }
  if(hadBleed&&h.bleed){
    await sleep(250);const d=h.bleed.d;h.hp=Math.max(0,h.hp-d);h.flash=.6;floatText(h.x,GROUND-120,'-'+d,'#ff8b6e',16);sfx('hurt');
    h.bleed.t--;if(h.bleed.t<=0)h.bleed=null;updateHUD();
  }
}
async function act(kind){
  if(!B||B.busy||B.over)return;
  B.busy=true;updateHUD();ac();
  let e=B.enemy;const h=B.hero;B.turn++;
  try{
    if(kind==='strike')await actStrike();
    else if(kind==='throw')await actThrow();
    else if(kind==='wind')await actWind();
    else if(kind==='bless')await actBless();
    else if(kind==='bolt')await actBolt();
    else if(kind==='guard')await actGuard();
    else if(kind==='potion')await actPotion();
    if(!B||B.over)return;
    updateHUD();
    if(e.hp<=0){if(B.e2){await promote();e=B.enemy}else{await winBattle();return}}
    if(kind!=='guard')h.guard=false;
    await sleep(250);
    if(kind==='guard'){await enemyTurn();if(B.e2&&h.hp>0)await e2Turn();h.guard=false;await tween(200,p=>{h.gu=1-p})}
    else{await enemyTurn();if(B.e2&&h.hp>0)await e2Turn()}
    if(h.hp<=0){await loseBattle();return}
    if(kind!=='guard')h.gu=0;
    pickIntent();B.busy=false;say('Нүүдлээ сонго.');updateHUD();
  }catch(err){console.error(err);B.busy=false;updateHUD()}
}
async function gainXp(n){
  S.xp+=n;let up=0;
  while(S.xp>=xpNeed(S.lvl)){S.xp-=xpNeed(S.lvl);S.lvl++;up++}
  return up;
}
async function winBattle(){
  B.over=true;const e=B.enemy,h=B.hero;
  await tween(700,p=>{e.rot=p*1.4;e.alpha=1-p;e.dy=p*18;e.off=p*30});
  sfx('win');S.st.kills++;const l0=S.lvl;
  if(B.run){await endlessWave();return}
  const L=B.L;let html,acts;
  if(B.daily){
    const D=B.daily,first=!dailyDone();let g=0,up=0,drop=null;
    if(first){
      const st=dailyStreak();S.daily.streak=(S.daily.last===yesterday()?st:0)+1;S.daily.last=today();
      g=Math.round(D.gold*(B.mods.goldMul||1));S.gold+=g;S.potions=Math.min(9,S.potions+1);S.st.daily++;up=await gainXp(D.xp);drop=rollDrop(D.dm,false,true);
    }
    save();
    html='<h2>Өдрийн тулаан дууслаа</h2>'+(first?'<p>Шагнал: <b>'+g+' алт</b>, 1 айраг, '+D.xp+' туршлага.</p><p class="mini">Дараалсан өдөр: '+S.daily.streak+'</p>'+(up?'<p class="tag good">Түвшин '+S.lvl+' боллоо!</p>':'')+skillNote(l0)+dropHTML(drop):'<p>Өнөөдрийн шагналыг аль хэдийн авсан байна. Маргааш шинэ дайсан ирнэ.</p>');
    acts=[{label:'Өдрийн тулаан',cls:'gold',fn:()=>{endBattle();go('daily')}}];
  }else{
    const hpPct=h.hp/h.max;let stars=1+(hpPct>=.5?1:0)+(B.turn<=parOf(L)?1:0);
    const PR=P(),prev=PR.stars[L.n-1],replay=prev>0;
    PR.stars[L.n-1]=Math.max(prev,stars);
    const md=L.mode||0,k=replay?.5:1,g=Math.round((12+L.n*6+stars*10)*k*[1,2,3.5][md]),xp=Math.round((18+(L.n+[0,8,16][md])*4)*(L.boss?2:1)*k*[1,1.6,2.4][md]);
    S.gold+=g;const up=await gainXp(xp);const drop=rollDrop(md,L.boss,false);
    const firstClear=L.n>PR.cleared;if(firstClear)PR.cleared=L.n;
    save();
    html='<h2>Ялалт!</h2><p class="mini">'+L.name+' ялагдлаа</p>'+starsRow(stars)
     +'<div class="card2"><div class="row"><span class="grow">Алт</span><b>+'+g+'</b></div><div class="row"><span class="grow">Туршлага</span><b>+'+xp+'</b></div>'+(up?'<div class="tag good" style="align-self:flex-start">Түвшин '+S.lvl+' боллоо! Амь, цохилт нэмэгдлээ.</div>':'')+skillNote(l0)+dropHTML(drop)
     +'<p class="mini" style="margin:0">'+(stars<3?(hpPct<.5?'Амийн 50%-аас дээш үлдвэл 2 од. ':'')+(B.turn>parOf(L)?parOf(L)+' нүүдэлд ялбал 3 од.':''):'Гурван од авлаа!')+'</p></div>'
     +(L.n===NL&&firstClear?'<p class="say">'+WIN_TXT[md]+'</p>':'');
    acts=[];
    if(L.n<NL&&firstClear)acts.push({label:'Дараагийн түвшин',cls:'gold',fn:()=>{endBattle();go('map');setTimeout(()=>openLevel(L.n+1),60)}});
    if(L.n===NL&&firstClear&&md<2)acts.push({label:'Дараагийн горим',cls:'gold',fn:()=>{S.mode=md+1;save();endBattle();go('map')}});
    acts.push({label:'Газрын зураг',cls:L.n<NL&&firstClear?'ghost':'gold',fn:()=>{endBattle();go('map')}});
  }
  renderTop();
  modal(html,acts);
  if(!B.daily)[1,2,3].forEach((i,idx)=>{if(i<=P().stars[L.n-1])setTimeout(()=>sfx('star'),idx*250+300)});
}
async function loseBattle(){
  B.over=true;const h=B.hero;
  await tween(700,p=>{h.rot=-p*1.3;h.alpha=1-p*.7;h.dy=p*22;h.off=-p*20});
  sfx('lose');if(B.run){await endlessOver();return}
  modal('<h2>Ялагдлаа</h2><p>Бөх минь, унасан ч босно. Хэдэн зөвлөгөө:</p><ul class="list"><li>Хүчтэй цохилт ирэхэд хамгаал.</li><li>Хийморь 50 болмогц шидэлт хий. Дайсан нэг нүүдэл алдана.</li><li>Дэлгүүрээс хүч, хуяг, айраг ав.</li></ul>',
    [{label:'Газрын зураг',cls:'ghost',fn:()=>{endBattle();go('map')}},{label:'Дахин оролдох',cls:'gold',fn:()=>{const L=B.L,o=B.opts;startBattle(L,o)}}]);
}
function endBattle(){if(B)B.active=false;B=null;$('#timing').hidden=true}

/* ---------- wiring ---------- */
$('#aStrike').onclick=()=>act('strike');
$('#aThrow').onclick=()=>act('throw');
$('#aGuard').onclick=()=>act('guard');
$('#aPotion').onclick=()=>act('potion');
$('#aWind').onclick=()=>act('wind');
$('#tmToggle').onclick=()=>{S.timing=!S.timing;save();if(B)updateHUD()};
$('#aBless').onclick=()=>act('bless');
$('#aBolt').onclick=()=>act('bolt');
document.querySelectorAll('#nav button').forEach(b=>b.onclick=()=>{sfx('tap');go(b.dataset.go)});
function setHero(i){
  S.hs=S.hs||{};S.hs[S.cls]={lvl:S.lvl,xp:S.xp,up:S.up,eq:S.eq};
  const t=S.hs[i]||{lvl:1,xp:0,up:{atk:0,hp:0,def:0,chi:0},eq:{w:null,a:null,c:null}};
  S.lvl=t.lvl;S.xp=t.xp;S.up=t.up;S.eq=t.eq;S.cls=i;S.picked=true;save();renderHome();go(scr==='home'||scr==='battle'?'map':scr);
}
const heroLv=i=>i===S.cls&&S.picked?S.lvl:(S.hs&&S.hs[i]?S.hs[i].lvl:0);
function pickClass(){modal('<h2>Баатраа сонго</h2><p class="mini" style="margin:0 0 8px">Баатар бүр өөрийн түвшин, чадвартай. Олдсон эд хэрэгсэл бүгдэд нийтлэг.</p>'+CL.map(c=>'<p class="mini" style="margin:0 0 6px"><b>'+c.n+'</b> — '+c.ds+'</p>').join(''),CL.map((c,i)=>({label:c.n+(heroLv(i)?' · Түвшин '+heroLv(i):' · шинэ'),cls:i===S.cls&&S.picked?'':'gold',fn:()=>setHero(i)})))}
$('#btnStart').onclick=()=>{ac();sfx('tap');if(!S.picked&&S.cleared===0)pickClass();else go('map')};
$('#btnHero').onclick=()=>{ac();sfx('tap');pickClass()};
$('#tHero').onclick=()=>{ac();sfx('tap');if(B&&B.active){toast('Тулааны үеэр баатар солихгүй');return}pickClass()};
$('#btnReset').onclick=()=>modal('<h2>Шинээр эхлэх үү?</h2><p>Бүх ахиц, од, алт устана.</p>',[{label:'Болих',cls:'ghost'},{label:'Устгаад эхлэх',cls:'red',fn:()=>{S=fresh();save();sndIcon();go('home')}}]);
$('#snd').onclick=()=>{S.muted=!S.muted;save();sndIcon();if(!S.muted)sfx('tap')};
document.addEventListener('pointerdown',()=>{ac()},{once:true});

load();sndIcon();renderTop();renderHome();fitCanvases();
go('home');
requestAnimationFrame(loop);
})();
