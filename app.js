import {createStore} from './state.js';
import {layoutGraph,relationLabels,searchNodes} from './graph.js';

const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icons={home:'M3 10 12 3l9 7v11H3z M9 21v-8h6v8',map:'M3 5l6-2 6 2 6-2v16l-6 2-6-2-6 2z M9 3v16 M15 5v16',trade:'M4 7h16v14H4z M8 7V3h8v4 M4 12h16 M10 12v3h4v-3',china:'M3 7h18v14H3z M7 7V3h10v4 M3 12h18 M8 16h2 M14 16h2',career:'M3 4h18v13H3z M7 21h10 M12 17v4 M8 9l-2 2 2 2 M16 9l2 2-2 2',cyber:'M12 3l8 3v6c0 5-8 9-8 9s-8-4-8-9V6z M8 12l3 3 5-6',study:'M2 9l10-5 10 5-10 5z M6 11v6c4 3 8 3 12 0v-6 M22 9v8',globe:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 M3 12h18 M12 3c-5 5-5 13 0 18 M12 3c5 5 5 13 0 18',leaf:'M20 3C8 2 2 8 5 16c6 8 17 1 15-13 M5 20l11-12',star:'m12 3 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z',check:'M5 12l4 4L19 6',search:'M17 17l5 5 M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0',arrow:'M4 12h16 M14 6l6 6-6 6',chevron:'M9 5l7 7-7 7',close:'M5 5l14 14 M19 5 5 19',menu:'M4 6h16 M4 12h16 M4 18h16',download:'M12 3v12 M7 10l5 5 5-5 M4 16v5h16v-5',upload:'M12 16V3 M7 8l5-5 5 5 M4 16v5h16v-5',edit:'m15 4 5 5 M4 20l5-1L21 7l-5-5L4 14z',plus:'M12 5v14 M5 12h14',list:'M8 5h13 M8 12h13 M8 19h13 M3 5h1 M3 12h1 M3 19h1',external:'M14 3h7v7 M21 3 10 14 M10 3H3v18h18v-7',back:'M20 12H4 M10 6l-6 6 6 6',info:'M12 11v6 M12 7h.01 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',reset:'M3 11a9 9 0 1 1 3 8 M3 3v8h8'};
function icon(name,size=20){return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${(icons[name]||icons.map).split(' M').map((d,i)=>`<path d="${i?'M':''}${d}"/>`).join('')}</svg>`;}
const STATUS={explore:'Henüz seçilmedi',researching:'Araştırıyorum',chosen:'Seçtim',done:'Tamamladım',eliminated:'Eledim'};
const ROUTES=[
 {id:'iberya',name:'İberya & markalar',icon:'trade',tag:'AİLE ŞİRKETİ',title:'Mevcut işi bir sonraki adıma taşı.',description:'Marka hakları, tekstil üretimi, Çin tedariki ve büyüme seçenekleri.',portal:'iberya_home',groups:['biz','iberya_cn'],tone:'sand'},
 {id:'china',name:'Çin → Türkiye ticareti',icon:'china',tag:'ÜRÜN & TİCARET',title:'Bir ürün fikrinden gerçek bir işe.',description:'12 ürün fikri, fuarlar, tedarikçi seçimi, ithalat ve küçük satış denemeleri.',portal:'china_home',groups:['cn_products','cn_fairs','cn_sourcing','cn_customs','cn_safety','cn_sales'],tone:'sage'},
 {id:'career',name:'Yazılım & kariyer',icon:'career',tag:'KARİYER',title:'İlk işine giden yolu kur.',description:'Portföy, başvuru hazırlığı ve Türkiye / uygun uzaktan iş seçenekleri.',groups:['career',...Array.from({length:8},(_,i)=>'jobs_category_'+(i+1))],tone:'blue'},
 {id:'cyber',name:'Siber güvenlik',icon:'cyber',tag:'YENİ UZMANLIK',title:'Güvenliğe doğru bir yan yol.',description:'Temeller, uygulama laboratuvarları ve işe başvuruya uzanan öğrenme yolu.',groups:['cyber'],tone:'lilac'},
 {id:'masters',name:'Master & eğitim',icon:'study',tag:'EĞİTİM',title:'Eğitimi bir amaca bağla.',description:'Programlar, uygunluk koşulları, bütçe ve başvuru kararları.',groups:['masters'],tone:'sand'},
 {id:'us',name:'Amerika',icon:'globe',tag:'ÜLKE YOLU',title:'Öğrenme ve deneyimi birlikte düşün.',description:'Eğitim, izinli çalışma, perakende operasyonları ve tarım / gıda yolları.',groups:['us'],tone:'blue'},
 {id:'uae',name:'Dubai & tarım',icon:'leaf',tag:'TARIM & TEKNOLOJİ',title:'Kapalı tarımdan yeni fikirlere.',description:'BAE’de teknik keşif, alıcı ihtiyacı ve Türkiye’de küçük pilot seçenekleri.',groups:['uae'],tone:'sage'},
 {id:'decision',name:'90 günlük plan',icon:'check',tag:'KARAR & EYLEM',title:'Düşünceden denemeye geç.',description:'Zamanını, kanıtlarını ve karar noktalarını tek yerde toparla.',groups:['decision','core'],tone:'sand'}
];
let DATA,NODES,GROUPS,store,personal;
let state={view:'home',route:null,group:null,selected:null,expanded:new Set(),mode:'map',query:'',filter:'all',zoom:1,editing:false,sidebar:false};
let toastTimer,searchTimer,persistenceError='';
function toast(message){const el=$('#toast');el.textContent=persistenceError&&message!==persistenceError?'Tarayıcıya kalıcı kayıt yapılamadı; yedek indir. '+message:message;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.hidden=true,persistenceError?9000:4200);}
function getNode(id){const node=NODES.get(id);if(!node)return null;return {...node,...personal.nodes[id]?.edit};}
function nodeState(id){return personal.nodes[id]||{};}
function status(id){return nodeState(id).status||'explore';}
function routeForGroup(id){return ROUTES.find(r=>r.groups.includes(id))||ROUTES[7];}
function routeNodes(route){return DATA.nodes.filter(n=>route.groups.includes(n.group));}
function href(route,group=null,node=null){return '#'+new URLSearchParams({view:'route',route,...group?{group}:{},...node?{node}:{}}).toString();}
function navigate(view,route=null,group=null,node=null){
  const params=new URLSearchParams({view});if(route)params.set('route',route);if(group)params.set('group',group);if(node)params.set('node',node);
  const hash='#'+params.toString();if(location.hash===hash){readRoute();return;}location.hash=hash;
}
function readRoute(){
  const previousContext=state.route+'|'+state.group;
  const params=new URLSearchParams(location.hash.slice(1));state.view=params.get('view')||'home';state.route=params.get('route');state.group=params.get('group');state.selected=params.get('node');state.editing=false;state.sidebar=false;state.zoom=1;
  if(state.selected&&NODES.has(state.selected)){
    const node=getNode(state.selected);state.group=node.group;state.route=routeForGroup(node.group).id;state.view='route';
    if(previousContext!==state.route+'|'+state.group)state.expanded=new Set();state.expanded.add(node.moduleId);
  }else{state.selected=null;if(previousContext!==state.route+'|'+state.group)state.expanded=new Set();}
  if(state.view==='search')state.query=params.get('q')??state.query;
  if(!['home','route','favorites','tasks','search','settings'].includes(state.view))state.view='home';
  if(state.view==='route'&&!ROUTES.some(r=>r.id===state.route)){state.view='home';state.route=null;}
  if(state.group&&!GROUPS.has(state.group))state.group=null;
  render();
}
function saveScroll(){const map=$('.map-wrap');return map?{x:map.scrollLeft,y:map.scrollTop}:null;}
function refresh(){const pos=saveScroll();render();if(pos&&$('.map-wrap')){$('.map-wrap').scrollLeft=pos.x;$('.map-wrap').scrollTop=pos.y;}}
function currentRoute(){return ROUTES.find(r=>r.id===state.route);}
function button(action,label,ico,classes='quiet',attrs=''){return `<button type="button" class="button ${classes}" data-action="${action}" ${attrs}>${ico?icon(ico):''}<span>${esc(label)}</span></button>`;}
function render(){
 const route=currentRoute();const selected=state.selected?getNode(state.selected):null;
 const title=state.view==='home'?'Genel bakış':state.view==='route'?route?.name:({favorites:'Favorilerim',tasks:'Yapılacaklarım',search:'Haritada ara',settings:'Yedekleme & kullanım'})[state.view];
 document.title=`${title} · Future`;
 $('#app').className='app-shell'+(selected?' detail-open':'');
 $('#app').innerHTML=`<aside class="sidebar ${state.sidebar?'open':''}" aria-label="Ana gezinme">
 <a class="brand" href="#view=home"><span class="brand-mark">F<span>·</span></span><span>future<span class="brand-caption">KENDİ YOLUNU ÇİZ</span></span></a>
 <div class="nav-section"><a class="nav-item ${state.view==='home'?'active':''}" href="#view=home">${icon('home')}<span>Genel bakış</span></a></div>
 <div class="nav-section"><span class="nav-label">YOL HARİTALARIM</span>${ROUTES.map(r=>`<a href="${href(r.id)}" class="nav-item ${state.view==='route'&&route?.id===r.id?'active':''}">${icon(r.icon)}<span>${esc(r.name)}</span></a>`).join('')}</div>
 <div class="nav-section"><span class="nav-label">ÇALIŞMA ALANIM</span><a class="nav-item ${state.view==='favorites'?'active':''}" href="#view=favorites">${icon('star')}<span>Favorilerim</span><span class="nav-count">${Object.values(personal.nodes).filter(n=>n.favorite).length}</span></a><a class="nav-item ${state.view==='tasks'?'active':''}" href="#view=tasks">${icon('check')}<span>Yapılacaklarım</span><span class="nav-count">${personal.tasks.filter(t=>!t.done).length}</span></a></div>
 <div class="sidebar-bottom"><a class="nav-item" href="#view=settings">${icon('download')}<span>Yedekleme & kullanım</span></a><div class="local-note"><span class="local-dot"></span> Notların bu tarayıcıda saklanır</div></div>
 </aside><button class="mobile-scrim ${state.sidebar?'open':''}" data-action="close-menu" aria-label="Menüyü kapat"></button>
 <div class="workspace"><header class="topbar"><button class="button icon mobile-nav-toggle" data-action="menu" aria-label="Menüyü aç">${icon('menu')}</button><nav class="breadcrumbs" aria-label="Sayfa yolu"><a href="#view=home">Çalışma alanım</a><span>/</span><strong>${esc(title)}</strong></nav><div class="topbar-actions"><label class="search-box">${icon('search',18)}<input type="search" id="search" aria-label="Tüm haritada ara" placeholder="Bir fikir, şirket veya koşul ara…" value="${esc(state.query)}"><kbd>/</kbd></label><button class="button icon backup-top" data-action="export" aria-label="Yedeğini indir" title="Yedeğini indir">${icon('download')}</button></div></header>
 <main id="main" class="view" tabindex="-1">${state.view==='home'?renderHome():state.view==='route'?renderRoute():state.view==='settings'?renderSettings():state.view==='tasks'?renderTasks():renderCollection()}</main></div>${selected?renderDetail(selected):''}`;
 if(state.view==='route'&&state.mode==='map')renderGraph();
 if(state.selected&&!state.editing){const note=$('#node-notes');if(note)note.value=nodeState(state.selected).notes||'';}
}
function renderHome(){
 const active=Object.keys(personal.nodes).filter(id=>['researching','chosen','done'].includes(status(id)));
 const done=active.filter(id=>status(id)==='done').length;
 return `<section class="hero"><div><div class="eyebrow">GELECEĞİN İÇİN BİR ÇALIŞMA ALANI</div><h1 class="hero-title">Bir sonraki adımın,<br><em>gözünün önünde.</em></h1><p class="hero-description">Seçeneklerini keşfet. Gerekli koşulları aç.<br>Senin için anlamlı olan yolu, adım adım kur.</p><div class="hero-meta"><span>${DATA.nodes.length} araştırma kartı</span><i></i><span>${DATA.edges.length} bağlantı</span><i></i><span>8 ana yol</span></div></div><aside class="progress-summary"><span class="eyebrow">SENİN İLERLEMEN</span><div class="progress-numbers"><strong>${active.length}</strong><span>kart üzerinde<br>çalışıyorsun</span></div><div class="progress-line"><span style="width:${active.length?done/active.length*100:0}%"></span></div><p>${done} tamamlanan · ${personal.tasks.filter(t=>!t.done).length} bekleyen görev</p><a href="#view=tasks">Sonraki adımını yaz ${icon('arrow',16)}</a></aside></section>
 <div class="section-heading"><div><span class="eyebrow">BAŞLAMAK İÇİN BİR YOL SEÇ</span><h2>Her seçenek, yeni bir kapı.</h2></div><span class="muted small">Ayrıntılar seçtikçe açılır</span></div>
 <section class="home-grid" aria-label="Yol seçenekleri">${ROUTES.map((r,i)=>{const ns=routeNodes(r),picked=ns.filter(n=>status(n.id)==='chosen').length;return `<a class="route-card ${r.tone} ${i===1?'featured':''}" href="${href(r.id)}"><div class="route-card-top"><span class="route-icon">${icon(r.icon,24)}</span><span class="route-tag">${esc(r.tag)}</span></div><h3 class="route-title">${esc(r.name)}</h3><p class="route-description">${esc(r.description)}</p><div class="route-footer"><span class="route-stat">${ns.length} kart${picked?` · ${picked} seçim`:''}</span><span class="route-open">Yolu keşfet ${icon('arrow',18)}</span></div></a>`;}).join('')}</section>
 <section class="home-bottom"><div><h2>Haritayı kendine göre kullan.</h2><p>Bir kartı favorile, kendi notunu ekle veya bir sonraki adımını görev yap. Seçimlerin geri alınabilir; bütün yolları aynı anda seçmek zorunda değilsin.</p></div><a class="button quiet" href="#view=settings">Nasıl çalışır? ${icon('arrow',17)}</a></section><p class="research-footnote">Çin ürün ticareti: 18 Ekim 2026 · Önceki iş ve eğitim araştırmaları: 14–15 Ekim 2026. Bağlantılar güncel ilan veya kabul garantisi değildir.</p>`;
}
function routeStructure(){
 const route=currentRoute(),group=state.group?GROUPS.get(state.group):null;
 if(group)return {root:{title:group.title,body:group.description||'Bir seçeneği açıp kartların ayrıntılarını incele.'},branches:group.modules.map(m=>({id:m.id,title:m.title,body:`${m.nodeIds.length} ayrıntı kartı · koşullar kartın içinde`,nodeIds:m.nodeIds})),group};
 const portal=DATA.portals.find(p=>p.key===route.portal);
 const branches=portal?portal.cards.map((c,i)=>({id:'portal_'+i,title:c.title,body:c.body,nodeIds:[],target:c.links[0]?.target?.replace(/^menu_/,''),requirements:c.requirements})):route.groups.map(id=>{const g=GROUPS.get(id);return {id:'group_'+id,title:g.title,body:g.description||`${g.modules.length} seçenek · ${DATA.nodes.filter(n=>n.group===id).length} kart`,nodeIds:[],target:id};});
 return {root:{title:route.name,body:portal?.description||route.description},branches,group:null};
}
function renderRoute(){
 const route=currentRoute(),{group}=routeStructure();
 return `<section class="route-heading"><div><div class="eyebrow">${esc(route.tag)}</div><h1>${esc(group?.title||route.name)}</h1><p>${esc(group?.description||route.description)}</p></div>${group?`<a class="button quiet" href="${href(route.id)}">${icon('back')}Yolun başına dön</a>`:''}</section>
 <div class="map-toolbar"><div class="view-tabs" role="group" aria-label="Görünüm"><button class="tab ${state.mode==='map'?'active':''}" data-action="mode" data-mode="map">${icon('map',17)}Harita</button><button class="tab ${state.mode==='list'?'active':''}" data-action="mode" data-mode="list">${icon('list',17)}Kart listesi</button></div><div class="map-actions">${group?button('collapse','Dalları kapat',null):''}${state.mode==='map'?`${button('zoom-out','−',null,'icon','aria-label="Uzaklaştır"')}<span class="zoom-value">${Math.round(state.zoom*100)}%</span>${button('zoom-in','+',null,'icon','aria-label="Yakınlaştır"')}`:''}</div></div>
 ${state.mode==='map'?`<div class="map-wrap" aria-label="${esc(group?.title||route.name)} etkileşimli haritası"><div id="graph" class="map-canvas"></div></div><div class="map-legend"><span><i class="legend-dash"></i>Seçenek / ayrıntı</span><span><i class="legend-line"></i>Gerçek adım / koşul</span><span>Kartı aç → ilgili koşula git · Haritayı boş alandan sürükleyebilirsin</span></div>`:renderRouteList(route,group)}`;
}
function renderGraph(){
 const structure=routeStructure();
 const layout=layoutGraph({...structure,expanded:state.expanded,nodes:new Map(DATA.nodes.map(n=>[n.id,getNode(n.id)])),edges:DATA.edges,selected:state.selected});
 const related=new Set([state.selected]);if(state.selected)DATA.edges.filter(e=>e.source===state.selected||e.target===state.selected).forEach(e=>{related.add(e.source);related.add(e.target);});
 $('#graph').innerHTML=`<div class="graph-scaler" style="width:${layout.width*state.zoom}px;height:${layout.height*state.zoom}px"><div class="graph-layer" style="width:${layout.width}px;height:${layout.height}px;transform:scale(${state.zoom});transform-origin:top left"><svg class="graph-svg" width="${layout.width}" height="${layout.height}" aria-hidden="true"><defs><marker id="arrow-nav" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10" fill="#a0ada5"/></marker><marker id="arrow-real" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10" fill="#426b57"/></marker></defs>${layout.links.map(l=>`<g class="graph-edge ${l.canonical?'canonical':''} ${l.highlight?'highlight':''}"><path d="${l.path}" fill="none" stroke="${l.canonical?'#426b57':'#b7c2b9'}" stroke-width="${l.highlight?3:1.5}" ${l.canonical?'':'stroke-dasharray="5 5"'} marker-end="url(#arrow-${l.canonical?'real':'nav'})"/><text x="${l.labelX}" y="${l.labelY}" class="edge-label" text-anchor="middle">${esc(l.canonical?(relationLabels[l.type]||'İlgili yol'):l.label)}</text></g>`).join('')}</svg>${layout.items.map(item=>{
  const isNode=item.kind==='node';let footer,attrs='';
  if(isNode){footer=`<span class="badge status-${status(item.id)}">${STATUS[status(item.id)]}</span><span>${nodeState(item.id).favorite?'★':'→'}</span>`;attrs=`data-action="open-node" data-id="${esc(item.id)}"`;}
  else if(item.kind==='branch'){footer=`<span>${item.target?'Olasılıkları aç':item.open?'Ayrıntıları kapat':`${item.nodeIds.length} kartı aç`}</span>${icon(item.open?'close':'chevron',17)}`;attrs=item.target?`data-action="open-group" data-group="${esc(item.target)}"`:`data-action="expand" data-module="${esc(item.id)}" aria-expanded="${item.open}"`;}
  else{footer=`<span>${structure.branches.length} seçenek</span><span>Bir dal seç →</span>`;}
  return `<${item.kind==='root'?'div':'button'} ${attrs} class="graph-node kind-${item.kind} ${state.selected===item.key?'selected':''} ${isNode&&state.selected&&!related.has(item.key)?'dimmed':''}" style="left:${item.x}px;top:${item.y}px;width:${item.w}px;height:${item.h}px" ${item.kind==='root'?'':'type="button"'}><span class="node-kicker">${item.kind==='root'?'YOLUN BAŞLANGICI':isNode?'ARAŞTIRMA KARTI':'BİR SEÇENEK'}</span><strong class="node-title">${esc(item.title)}</strong><span class="node-excerpt">${esc(String(item.body||'').replace(/Ne yapılacak:\s*/,'').replace(/---[\s\S]*/,''))}</span><span class="node-actions">${footer}</span></${item.kind==='root'?'div':'button'}>`;
 }).join('')}</div></div>`;
 const wrap=$('.map-wrap');let drag;
 wrap.addEventListener('pointerdown',e=>{if(e.target.closest('button,a,input'))return;drag={x:e.clientX,y:e.clientY,sx:wrap.scrollLeft,sy:wrap.scrollTop};wrap.setPointerCapture(e.pointerId);});
 wrap.addEventListener('pointermove',e=>{if(!drag)return;wrap.scrollLeft=drag.sx-(e.clientX-drag.x);wrap.scrollTop=drag.sy-(e.clientY-drag.y);});
 wrap.addEventListener('pointerup',()=>drag=null);wrap.addEventListener('pointercancel',()=>drag=null);
 if(state.selected)requestAnimationFrame(()=>{const el=wrap.querySelector(`[data-id="${CSS.escape(state.selected)}"]`);if(el){wrap.scrollLeft=Math.max(0,el.offsetLeft*state.zoom-60);wrap.scrollTop=Math.max(0,el.offsetTop*state.zoom-30);}});
}
function renderRouteList(route,group){
 const groups=group?[group]:route.groups.map(id=>GROUPS.get(id));
 return `<div class="filter-bar"><label>Durum <select id="list-filter" class="status-select"><option value="all">Tüm kartlar</option>${Object.entries(STATUS).map(([k,v])=>`<option value="${k}" ${state.filter===k?'selected':''}>${v}</option>`).join('')}</select></label></div>${groups.map(g=>`<section class="list-section"><h2>${esc(g.title)}</h2>${g.modules.map(m=>{const ns=m.nodeIds.map(getNode).filter(n=>state.filter==='all'||status(n.id)===state.filter);return ns.length?`<details class="module-details" ${state.filter!=='all'?'open':''}><summary>${esc(m.title)}<span>${ns.length} kart</span></summary><div class="results-list">${ns.map(renderResult).join('')}</div></details>`:'';}).join('')}</section>`).join('')}`;
}
function renderResult(n){return `<button class="result-item" data-action="open-node" data-id="${esc(n.id)}"><span class="result-main"><span class="result-category">${esc(GROUPS.get(n.group)?.title||'Araştırma')}</span><strong>${esc(n.title)}</strong><span class="result-excerpt">${esc(String(n.body).replace(/---[\s\S]*/,'').replace(/Ne yapılacak:\s*/,''))}</span></span><span class="result-end"><span class="badge status-${status(n.id)}">${STATUS[status(n.id)]}</span>${nodeState(n.id).favorite?icon('star',17):icon('chevron',17)}</span></button>`;}
function renderCollection(){
 const favorites=state.view==='favorites';const nodes=favorites?DATA.nodes.filter(n=>nodeState(n.id).favorite).map(n=>getNode(n.id)):searchNodes(DATA.nodes.map(n=>getNode(n.id)),state.query);
 return `<section class="collection-heading"><span class="eyebrow">${favorites?'KENDİ SEÇKİN':'350 KARTIN İÇİNDE'}</span><h1>${favorites?'Geri dönmek istediğin fikirler.':'Aradığın yolu bul.'}</h1><p>${favorites?'Favorilediğin kartlar burada. Durum ve notların kartın ayrıntılarında.':state.query?`“${esc(state.query)}” için ${nodes.length} sonuç`:'Üstteki arama alanına bir ürün, şirket, ülke veya koşul yaz.'}</p></section><div class="results-list">${nodes.map(renderResult).join('')}</div>${!nodes.length?`<div class="empty-state">${icon(favorites?'star':'search',38)}<h2>${favorites?'Henüz bir favorin yok.':state.query?'Eşleşen kart bulunamadı.':'Her şey bir kelimeyle başlar.'}</h2><p>${favorites?'Bir kartın ayrıntısındaki yıldızı kullanarak buraya ekleyebilirsin.':'Farklı bir kelime dene: oyuncak, remote, master veya marka.'}</p></div>`:''}`;
}
function bodyHTML(body){return String(body||'').split(/\n\s*\n|\n---\n/).map(p=>`<p>${esc(p).replace(/\n/g,'<br>')}</p>`).join('');}
function renderDetail(n){
 const ns=nodeState(n.id),outgoing=DATA.edges.filter(e=>e.source===n.id),incoming=DATA.edges.filter(e=>e.target===n.id);
 return `<aside class="detail-panel" aria-label="Kart ayrıntısı"><div class="detail-header"><span class="eyebrow">KART AYRINTISI</span><div>${button('favorite',ns.favorite?'Favoriden çıkar':'Favorile','star','icon '+(ns.favorite?'is-favorite':''),'data-id="'+esc(n.id)+'" aria-label="'+(ns.favorite?'Favoriden çıkar':'Favorile')+'"')}${button('close-detail','Kapat','close','icon','aria-label="Ayrıntıyı kapat"')}</div></div><div class="detail-content"><a class="detail-category" href="${href(routeForGroup(n.group).id,n.group)}">${esc(GROUPS.get(n.group)?.title)}</a><h2 class="detail-title">${esc(n.title)}</h2><div class="detail-status-row"><label for="node-status">Bu yol benim için</label><select id="node-status" class="status-select">${Object.entries(STATUS).map(([k,v])=>`<option value="${k}" ${status(n.id)===k?'selected':''}>${v}</option>`).join('')}</select></div>${state.editing?renderEditor(n):`<section class="detail-section prose">${bodyHTML(n.body)}</section>${n.requirements?.length?`<section class="detail-section"><h3>Bunun için gerekenler</h3><ul class="requirement-list">${n.requirements.map(r=>`<li>${esc(r)}</li>`).join('')}</ul></section>`:''}<section class="detail-section"><div class="detail-section-title"><h3>Kendi notun</h3><span class="muted small">Otomatik kaydolur</span></div><textarea id="node-notes" class="notes-field" placeholder="Bu seçenekle ilgili düşüncen, soruların, sonraki adımın…" maxlength="50000" aria-label="Kendi notun"></textarea></section><div class="detail-buttons">${button('edit','Kartı düzenle','edit')}${button('task-from-node','Göreve ekle','plus','primary')}</div>${n.sources?.length?`<section class="detail-section"><h3>Kaynaklar <span class="muted">${n.sources.length}</span></h3>${n.sources.map(s=>safeURL(s.url)?`<a class="source-link" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${icon('external',16)}<span>${esc(s.title||s.label||new URL(s.url).hostname)}<small>${esc(new URL(s.url).hostname)}</small></span></a>`:'').join('')}</section>`:''}${renderRelations('Buradan nereye?',outgoing,'target')}${renderRelations('Bu karta bağlananlar',incoming,'source')}`}</div><div class="detail-footer">${ns.edit?'Bu kartta kişisel düzenlemen var.':'Araştırma içeriği · Karar sana ait.'} Notların ve değişikliklerin yalnız bu tarayıcıda.</div></aside>`;
}
function renderRelations(title,edges,field){return edges.length?`<section class="detail-section"><h3>${title} <span class="muted">${edges.length}</span></h3>${edges.map(e=>{const n=getNode(e[field]);return n?`<button class="relation-link" data-action="open-node" data-id="${esc(n.id)}"><span><small>${esc(relationLabels[e.type]||'İlgili seçenek')}${e.label?` · ${esc(e.label)}`:''}</small><strong>${esc(n.title)}</strong></span>${icon('arrow',17)}</button>`:'';}).join('')}</section>`:'';}
function renderEditor(n){return `<form id="edit-form" class="editor-form"><div class="field"><label class="field-label" for="edit-title">Kart başlığı</label><input class="field-input" id="edit-title" value="${esc(n.title)}" maxlength="500" required></div><div class="field"><label class="field-label" for="edit-body">Açıklama</label><textarea class="field-textarea" id="edit-body" rows="12" maxlength="100000">${esc(n.body)}</textarea></div><div class="field"><label class="field-label" for="edit-requirements">Gerekenler · Her satıra bir madde</label><textarea class="field-textarea" id="edit-requirements" rows="5">${esc(n.requirements?.join('\n'))}</textarea></div><div class="field"><label class="field-label" for="edit-sources">Kaynaklar · Her satıra Başlık | https://adres</label><textarea class="field-textarea" id="edit-sources" rows="5">${esc(n.sources?.map(s=>`${s.title||s.label||''} | ${s.url}`).join('\n'))}</textarea></div><p class="muted small">Düzenlemen bu tarayıcıda saklanır; sitenin herkesin gördüğü araştırma içeriğini değiştirmez.</p><div class="detail-buttons"><button class="button primary" type="submit">Kaydet</button>${button('cancel-edit','Vazgeç',null)}</div></form>`;}
function safeURL(url){try{return ['https:','http:'].includes(new URL(url).protocol);}catch{return false;}}
function renderTasks(){
 const marked=DATA.nodes.filter(n=>status(n.id)==='chosen'||status(n.id)==='researching');
 return `<section class="collection-heading"><span class="eyebrow">DÜŞÜNCEDEN EYLEME</span><h1>Bir sonraki küçük adım.</h1><p>Kendi görevlerini yaz veya bir kartı doğrudan görev listene ekle.</p></section><form id="task-form" class="task-form"><input class="field-input" id="task-text" placeholder="Örneğin: Üç tedarikçiden aynı ürün için teklif al" aria-label="Yeni görev" maxlength="500" required><button class="button primary" type="submit">${icon('plus',18)}Görev ekle</button></form><div class="task-list">${personal.tasks.length?personal.tasks.map(t=>`<div class="task-row ${t.done?'done':''}"><input type="checkbox" ${t.done?'checked':''} data-action="toggle-task" data-id="${esc(t.id)}" aria-label="${esc(t.text)}"><div><strong>${esc(t.text)}</strong>${t.nodeId&&getNode(t.nodeId)?`<button class="text-link" data-action="open-node" data-id="${esc(t.nodeId)}">${esc(getNode(t.nodeId).title)} ${icon('arrow',14)}</button>`:''}</div>${button('remove-task','Görevi kaldır','close','icon','data-id="'+esc(t.id)+'" aria-label="Görevi kaldır"')}</div>`).join(''):`<div class="empty-state">${icon('check',38)}<h2>Listeni küçük tut, adımını netleştir.</h2><p>İlk görevini yukarıya yazabilirsin.</p></div>`}</div>${marked.length?`<div class="section-heading"><h2>Üzerinde çalıştığın yollar</h2><span>${marked.length} kart</span></div><div class="results-list">${marked.map(n=>renderResult(getNode(n.id))).join('')}</div>`:''}`;
}
function renderSettings(){return `<section class="collection-heading"><span class="eyebrow">SANA AİT BİR ÇALIŞMA ALANI</span><h1>Notların sende kalsın.</h1><p>Kaynaklı harita herkese açık. Notların, seçimlerin ve kişisel kart düzenlemelerin bu tarayıcıda saklanır; sunucuya gönderilmez.</p></section><section class="settings-grid"><article class="settings-block"><h2>Yedeğini indir</h2><p>Tarayıcı verilerini silmeden, cihaz değiştirmeden veya önemli düzenlemelerden sonra yedek al. Dosya notlarını, favorilerini, görevlerini ve kart düzenlemelerini içerir.</p>${button('export','JSON yedeğini indir','download','primary')}</article><article class="settings-block"><h2>Yedeğini geri yükle</h2><p>Başka cihazda veya tarayıcıda devam etmek için yedek dosyanı yükle. Geri yükleme bu tarayıcıdaki kişisel çalışma verilerinin yerine geçer; önce mevcut yedeğin indirilir.</p>${button('import','Yedek dosyası seç','upload')}</article></section><section class="settings-block how-to"><h2>Harita nasıl kullanılır?</h2><ol><li>Ana sayfadan bir yol seç.</li><li>Bir seçeneği aç. İlgili kartlar görünür.</li><li>Karta tıkla; koşullar, kaynaklar ve diğer yollara bağlantılar sağda açılır.</li><li>Bir durum seç, not ekle veya kartı göreve dönüştür.</li></ol><p>Kesik oklar seçenek ve içerik ilişkisini gösterir. Düz oklar araştırmadaki gerçek adım, koşul veya geri dönüş ilişkileridir. Bütün bağlantıları kartın ayrıntısında görebilirsin.</p></section><section class="settings-block"><h2>İçeriğin kapsamı</h2><p>${DATA.nodes.length} kart · ${DATA.edges.length} ilişki · 84 şirket · 325 benzersiz kaynak bağlantısı.</p><p>Çin ürün ticareti 18 Ekim 2026, önceki kariyer / eğitim yolları 14–15 Ekim 2026 araştırmasına dayanır. Fuar, ilan ve program koşulları karar öncesi kendi resmî kaynağından yeniden kontrol edilir. Ürün fikirleri doğrulanmış talep veya kârlılık sonucu değildir.</p><p>Kişisel profil bilgileri açık sürümden çıkarıldı. Yerel notların otomatik olarak cihazlar arasında eşitlenmez.</p></section>`;}

document.addEventListener('click',event=>{
 const el=event.target.closest('[data-action]');if(!el)return;
 const action=el.dataset.action,id=el.dataset.id;
 try{
 switch(action){
 case 'menu':state.sidebar=!state.sidebar;render();break;
 case 'close-menu':state.sidebar=false;render();break;
 case 'open-group':navigate('route',state.route,el.dataset.group);break;
 case 'expand':state.expanded.has(el.dataset.module)?state.expanded.delete(el.dataset.module):state.expanded.add(el.dataset.module);refresh();break;
 case 'collapse':state.expanded.clear();refresh();break;
 case 'open-node':{const n=getNode(id);if(n)navigate('route',routeForGroup(n.group).id,n.group,id);break;}
 case 'close-detail':navigate('route',state.route,state.group);break;
 case 'favorite':store.toggleFavorite(id);refresh();break;
 case 'mode':state.mode=el.dataset.mode;refresh();break;
 case 'zoom-in':state.zoom=Math.min(1.5,Math.round((state.zoom+.1)*10)/10);refresh();break;
 case 'zoom-out':state.zoom=Math.max(.5,Math.round((state.zoom-.1)*10)/10);refresh();break;
 case 'edit':state.editing=true;refresh();$('#edit-title')?.focus();break;
 case 'cancel-edit':state.editing=false;refresh();break;
 case 'task-from-node':store.addTask(getNode(state.selected).title,state.selected);refresh();toast('Kart yapılacaklarına eklendi.');break;
 case 'toggle-task':store.toggleTask(id);refresh();break;
 case 'remove-task':store.removeTask(id);refresh();break;
 case 'export':downloadBackup();break;
 case 'import':$('#backup-file').click();break;
 case 'cancel-import':$('#modal-root').innerHTML='';pendingBackup=null;break;
 case 'confirm-import':downloadBackup();store.importBackup(pendingBackup,new Set(NODES.keys()));pendingBackup=null;$('#modal-root').innerHTML='';refresh();toast('Yedek geri yüklendi. Önceki verilerin yedeği indirildi.');break;
 }
 }catch(error){toast(error.message||'İşlem tamamlanamadı.');}
});
document.addEventListener('input',event=>{
 if(event.target.id==='node-notes'){try{store.updateNode(state.selected,{notes:event.target.value});}catch(e){toast(e.message);}return;}
 if(event.target.id==='search'){
  state.query=event.target.value;clearTimeout(searchTimer);searchTimer=setTimeout(()=>{
   if(state.view!=='search'){state.selected=null;state.view='search';history.pushState(null,'','#view=search&q='+encodeURIComponent(state.query));}
   else history.replaceState(null,'','#view=search&q='+encodeURIComponent(state.query));
   const field=$('#search'),position=field.selectionStart;render();const next=$('#search');next.focus();if(next.type!=='search')next.setSelectionRange(position,position);
  },180);
 }
});
document.addEventListener('change',event=>{
 try{if(event.target.id==='node-status'){store.updateNode(state.selected,{status:event.target.value});refresh();}if(event.target.id==='list-filter'){state.filter=event.target.value;refresh();}}catch(e){toast(e.message);}
});
document.addEventListener('submit',event=>{
 if(event.target.id==='task-form'){event.preventDefault();try{store.addTask($('#task-text').value);refresh();toast('Yeni görev eklendi.');}catch(e){toast(e.message);}}
 if(event.target.id==='edit-form'){
  event.preventDefault();try{
   const sources=$('#edit-sources').value.split('\n').filter(l=>l.trim()).map(line=>{const p=line.indexOf('|');return p<0?{title:'Kaynak',url:line.trim()}:{title:line.slice(0,p).trim(),url:line.slice(p+1).trim()};});
   store.saveEdit(state.selected,{title:$('#edit-title').value,body:$('#edit-body').value,requirements:$('#edit-requirements').value.split('\n').map(s=>s.trim()).filter(Boolean),sources});state.editing=false;refresh();toast('Kişisel düzenlemen kaydedildi.');
  }catch(e){toast(e.message);}
 }
});
document.addEventListener('keydown',event=>{
 if(event.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){event.preventDefault();$('#search')?.focus();}
 if(event.key==='Escape'){
  if($('#modal-root').children.length){$('#modal-root').innerHTML='';pendingBackup=null;}
  else if(state.editing){state.editing=false;refresh();}
  else if(state.selected)navigate('route',state.route,state.group);
  else if(state.sidebar){state.sidebar=false;render();}
 }
});
let pendingBackup;
$('#backup-file').addEventListener('change',async event=>{
 const file=event.target.files[0];event.target.value='';if(!file)return;
 try{if(file.size>10*1024*1024)throw Error('Yedek dosyası 10 MB sınırını aşıyor.');pendingBackup=JSON.parse(await file.text());
  if(pendingBackup.app!=='future-roadmap'||pendingBackup.version!==1)throw Error('Bu dosya geçerli bir Future yedeği değil.');
  $('#modal-root').innerHTML=`<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="import-title"><h2 id="import-title">Yedek geri yüklensin mi?</h2><p>Bu tarayıcıdaki kişisel veriler seçtiğin yedekle değişecek. Mevcut verilerin önce bir dosyaya indirilecek.</p><div class="detail-buttons">${button('confirm-import','Yedeği geri yükle','upload','primary')}${button('cancel-import','Vazgeç',null)}</div></section></div>`;$('#modal-root button').focus();
 }catch(e){toast(e.message);pendingBackup=null;}
});
function downloadBackup(){const value=store.exportBackup();const blob=new Blob([JSON.stringify(value,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`future-yedek-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);}
async function init(){
 try{const response=await fetch('./data.json');if(!response.ok)throw Error('Harita verisi yüklenemedi.');DATA=await response.json();NODES=new Map(DATA.nodes.map(n=>[n.id,n]));GROUPS=new Map(DATA.groups.map(g=>[g.id,g]));
  store=createStore({onError:error=>{persistenceError=error.message;toast(error.message);}});personal=store.getState();store.subscribe(next=>{personal=next;});window.addEventListener('hashchange',readRoute);readRoute();
 }catch(error){$('#app').innerHTML=`<main class="empty-state"><h1>Harita açılamadı.</h1><p>${esc(error.message)}</p><p>Sayfayı yeniden yükleyebilirsin. Yerel dosyayı doğrudan açıyorsan önizleme sunucusunu kullan.</p><button class="button primary" onclick="location.reload()">Yeniden dene</button></main>`;}
}
init();
