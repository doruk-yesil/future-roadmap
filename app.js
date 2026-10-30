import {renderAgriculture,agriHref} from './agriculture.js?v=2.6.0';
import {renderMasters,mastersHref} from './masters.js?v=2.6.0';
import {createStore} from './state.js';
import {relationLabels,searchNodes} from './graph.js';
import {createNavigation,contextForNode,matchesCountry,COUNTRIES,summarize} from './navigation.js?v=2.6.0';
import {applyResearch,getActionSteps,searchableChoices} from './research.js';
import {renderProjects,searchProjects,renderProjectResults} from './academic-projects.js';
import {renderJobsBoard,renderJobDetail,jobFiltersFromParams,jobsHref} from './jobs.js?v=2.6.0';
import {getCVSummary,importCVFiles,getCVFile,downloadCVRecord,renderCVVault} from './cv-vault.js?v=2.6.0';
import {renderProductCatalog,renderProductDetail,renderProductSuppliers,productHref,searchProducts,renderProductResults} from './products.js?v=2.6.0';

const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icons={home:'M3 10 12 3l9 7v11H3z M9 21v-8h6v8',map:'M3 5l6-2 6 2 6-2v16l-6 2-6-2-6 2z M9 3v16 M15 5v16',trade:'M4 7h16v14H4z M8 7V3h8v4 M4 12h16 M10 12v3h4v-3',china:'M3 7h18v14H3z M7 7V3h10v4 M3 12h18 M8 16h2 M14 16h2',career:'M3 4h18v13H3z M7 21h10 M12 17v4 M8 9l-2 2 2 2 M16 9l2 2-2 2',cyber:'M12 3l8 3v6c0 5-8 9-8 9s-8-4-8-9V6z M8 12l3 3 5-6',study:'M2 9l10-5 10 5-10 5z M6 11v6c4 3 8 3 12 0v-6 M22 9v8',globe:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 M3 12h18 M12 3c-5 5-5 13 0 18 M12 3c5 5 5 13 0 18',leaf:'M20 3C8 2 2 8 5 16c6 8 17 1 15-13 M5 20l11-12',star:'m12 3 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z',check:'M5 12l4 4L19 6',search:'M17 17l5 5 M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0',arrow:'M4 12h16 M14 6l6 6-6 6',chevron:'M9 5l7 7-7 7',close:'M5 5l14 14 M19 5 5 19',menu:'M4 6h16 M4 12h16 M4 18h16',download:'M12 3v12 M7 10l5 5 5-5 M4 16v5h16v-5',upload:'M12 16V3 M7 8l5-5 5 5 M4 16v5h16v-5',edit:'m15 4 5 5 M4 20l5-1L21 7l-5-5L4 14z',plus:'M12 5v14 M5 12h14',list:'M8 5h13 M8 12h13 M8 19h13 M3 5h1 M3 12h1 M3 19h1',external:'M14 3h7v7 M21 3 10 14 M10 3H3v18h18v-7',back:'M20 12H4 M10 6l-6 6 6 6',info:'M12 11v6 M12 7h.01 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',reset:'M3 11a9 9 0 1 1 3 8 M3 3v8h8'};
function icon(name,size=20){return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${(icons[name]||icons.map).split(' M').map((d,i)=>`<path d="${i?'M':''}${d}"/>`).join('')}</svg>`;}
const STATUS={explore:'Henüz seçilmedi',researching:'Araştırıyorum',chosen:'Seçtim',done:'Tamamladım',eliminated:'Eledim'};
let ROUTES,JOBS=[],cvSummary=[],cvError='';
let PRODUCTS=[],expandedProductCategories=new Set();
let DATA,NODES,GROUPS,store,personal,RESEARCH,SOURCES_BY_URL;
let state={view:'home',route:null,topic:null,choice:null,country:'all',selected:null,expanded:new Set(),mode:'map',query:'',filter:'all',zoom:1,editing:false,sidebar:false};
let toastTimer,searchTimer,persistenceError='';
function toast(message){const el=$('#toast');el.textContent=persistenceError&&message!==persistenceError?'Tarayıcıya kalıcı kayıt yapılamadı; yedek indir. '+message:message;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.hidden=true,persistenceError?9000:4200);}
function getNode(id){const node=NODES.get(id);if(!node)return null;return {...node,...personal.nodes[id]?.edit};}
function nodeState(id){return personal.nodes[id]||{};}
function status(id){return nodeState(id).status||'explore';}
function nodeContext(id){return contextForNode(ROUTES,id,state.route);}
function routeForGroup(id){return nodeContext(DATA.nodes.find(n=>n.group===id)?.id)?.route||ROUTES.at(-1);}
function routeNodes(route){const ids=new Set(route.topics.flatMap(t=>t.choices.flatMap(c=>[...c.nodeIds,...c.extraNodeIds||[]])));return DATA.nodes.filter(n=>ids.has(n.id));}
function href(route,topic=null,choice=null,node=null){return '#'+new URLSearchParams({view:'route',route,...topic?{topic}:{},...choice?{choice}:{},...node?{node}:{},...state.country!=='all'&&state.route===route?{country:state.country}:{}}).toString();}
function navigate(view,route=null,topic=null,choice=null,node=null){
 const params=new URLSearchParams({view});if(route)params.set('route',route);if(topic)params.set('topic',topic);if(choice)params.set('choice',choice);if(node)params.set('node',node);if(state.country!=='all'&&view==='route')params.set('country',state.country);
 const hash='#'+params.toString();if(location.hash===hash){readRoute();return;}location.hash=hash;
}
function readRoute(){
 const previousProduct=state.product;
 const params=new URLSearchParams(location.hash.slice(1));
 state.product=params.get('product');
 state.job=params.get('job');state.jobFilters=jobFiltersFromParams(params);
 state.view=params.get('view')||'home';state.project=params.get('project');state.route=params.get('route');state.topic=params.get('topic');state.choice=params.get('choice');state.variant=params.get('variant');state.selected=params.get('node');state.country=COUNTRIES[params.get('country')]?params.get('country'):'all';state.editing=false;state.sidebar=false;
 const aliases={cyber:['career','cyber'],masters:['career','tech-study'],us:['agriculture','agri-study'],uae:['agriculture',null]};
 if(aliases[state.route]){[state.route,state.topic]=aliases[state.route];}
 if(!['home','route','favorites','tasks','search','settings','projects','cv'].includes(state.view))state.view='home';
 if(state.view==='search')state.query=params.get('q')??state.query;
 if(state.selected&&NODES.has(state.selected)){
  const currentChoice=currentRoute()?.topics.find(t=>t.id===state.topic)?.choices.find(c=>c.id===state.choice);
  if(!currentChoice||![...currentChoice.nodeIds,...currentChoice.extraNodeIds||[]].includes(state.selected)){
   const context=nodeContext(state.selected);if(context){state.route=context.route.id;state.topic=context.topic.id;state.choice=context.choice.id;}
  }
  state.view='route';
 }else state.selected=null;
 // Old bookmarked group URLs resolve into the new purpose-based navigation.
 if(params.has('group')&&!state.topic&&!state.selected){const n=DATA.nodes.find(n=>n.group===params.get('group'));const c=n&&nodeContext(n.id);if(c){state.route=c.route.id;state.topic=c.topic.id;}}
 if(state.view==='route'&&!currentRoute()){state.view='home';state.route=null;}
 if(state.topic&&!currentRoute()?.topics.some(t=>t.id===state.topic)){state.topic=null;state.choice=null;}
 if(state.choice&&!currentTopic()?.choices.some(c=>c.id===state.choice))state.choice=null;
 if(state.view==='route'&&state.route==='career'&&!state.topic)state.topic='jobs';
 if(state.route==='career'&&state.topic==='jobs'&&!state.selected){
  if(state.choice==='jobs-tr'&&!params.has('jr'))state.jobFilters.region='tr';
  if(state.choice==='jobs-remote'&&!params.has('jr'))state.jobFilters.region='global';
  if(state.choice==='jobs-cyber'&&!params.has('jrole'))state.jobFilters.role='cyber';
  state.choice=null;
 }
 if(state.view==='route'&&state.route==='china'&&!state.topic)state.topic='product';
 if(state.job&&!JOBS.some(j=>j.id===state.job))state.job=null;
 if(state.route==='china'&&state.topic==='product'&&!state.selected&&state.choice){
  const legacy={beauty:'salon-towels','tech-toys':'coding-kit','simple-products':'cable-organizers'};
  state.product=legacy[state.choice]||null;state.choice=null;
 }
 if(state.product&&!PRODUCTS.some(p=>p.id===state.product))state.product=null;
 if(state.product)expandedProductCategories.add(PRODUCTS.find(p=>p.id===state.product).category);
 render();
 if(previousProduct&&!state.product&&state.route==='china'&&state.topic==='product')document.querySelector(`[data-product-row="${CSS.escape(previousProduct)}"]`)?.focus();
}
function currentTopic(){return currentRoute()?.topics.find(t=>t.id===state.topic);}
function currentChoice(){return currentTopic()?.choices.find(c=>c.id===state.choice);}
function openNode(id){
 if(!getNode(id))return;
 const choice=currentChoice();
 if(choice&&[...choice.nodeIds,...choice.extraNodeIds||[]].includes(id))navigate('route',state.route,state.topic,state.choice,id);
 else {const c=nodeContext(id);if(c){state.country='all';navigate('route',c.route.id,c.topic.id,c.choice.id,id);}}
}
function saveScroll(){const map=$('.map-wrap');return map?{x:map.scrollLeft,y:map.scrollTop}:null;}
function refresh(){const pos=saveScroll();render();if(pos&&$('.map-wrap')){$('.map-wrap').scrollLeft=pos.x;$('.map-wrap').scrollTop=pos.y;}}
function currentRoute(){return ROUTES.find(r=>r.id===state.route);}
function button(action,label,ico,classes='quiet',attrs=''){return `<button type="button" class="button ${classes}" data-action="${action}" ${attrs}>${ico?icon(ico):''}<span>${esc(label)}</span></button>`;}
function render(){
 const route=currentRoute();const selected=state.selected?getNode(state.selected):null;const choice=currentChoice();
 const job=state.view==='route'&&state.route==='career'&&state.topic==='jobs'&&state.job?JOBS.find(j=>j.id===state.job):null;
 const product=state.view==='route'&&state.route==='china'&&state.topic==='product'&&state.product?PRODUCTS.find(p=>p.id===state.product):null;
 const panel=Boolean(selected||choice||job||product);
 const title=state.view==='home'?'Genel bakış':state.view==='route'?(state.route==='career'&&state.topic==='jobs'?'İş İlanları':state.route==='career'&&state.topic==='tech-study'?'Master opsiyonları':route?.name):({favorites:'Favorilerim',tasks:'Yapılacaklarım',search:'Haritada ara',settings:'Yedekleme & kullanım',projects:'Okul Projelerim',cv:'CV dosyalarım'})[state.view];
 document.title=`${title} · Future`;
 $('#app').className='app-shell'+(panel?' detail-open':'');
 $('#app').innerHTML=`<aside class="sidebar ${state.sidebar?'open':''}" aria-label="Ana gezinme">
 <a class="brand" href="#view=home"><span class="brand-mark">F<span>·</span></span><span>future<span class="brand-caption">KENDİ YOLUNU ÇİZ</span></span></a>
 <div class="nav-section"><a class="nav-item ${state.view==='home'?'active':''}" href="#view=home">${icon('home')}<span>Genel bakış</span></a></div>
 <div class="nav-section"><span class="nav-label">YOL HARİTALARIM</span>${ROUTES.filter(r=>!r.secondary).map(r=>`<a href="${href(r.id)}" class="nav-item ${state.view==='route'&&route?.id===r.id?'active':''}">${icon(r.icon)}<span>${esc(r.name)}</span></a>`).join('')}</div>
 <div class="nav-section"><span class="nav-label">ÇALIŞMA ALANIM</span><a class="nav-item projects-nav-link ${state.view==='projects'?'active':''}" href="#view=projects">${icon('study')}<span>Okul Projelerim</span></a><a class="nav-item ${state.view==='cv'?'active':''}" href="#view=cv">${icon('list')}<span>CV dosyalarım</span></a><a class="nav-item ${state.route==='decision'?'active':''}" href="${href('decision')}">${icon('check')}<span>90 günlük plan</span></a><a class="nav-item ${state.view==='favorites'?'active':''}" href="#view=favorites">${icon('star')}<span>Favorilerim</span><span class="nav-count">${Object.values(personal.nodes).filter(n=>n.favorite).length}</span></a><a class="nav-item ${state.view==='tasks'?'active':''}" href="#view=tasks">${icon('check')}<span>Yapılacaklarım</span><span class="nav-count">${personal.tasks.filter(t=>!t.done).length}</span></a></div>
 <div class="sidebar-bottom"><a class="nav-item" href="#view=settings">${icon('download')}<span>Yedekleme & kullanım</span></a><div class="local-note"><span class="local-dot"></span> Notların bu tarayıcıda saklanır</div></div>
 </aside><button class="mobile-scrim ${state.sidebar?'open':''}" data-action="close-menu" aria-label="Menüyü kapat"></button>${panel?'<button class="drawer-scrim" data-action="close-detail" aria-label="Panelin dışından kapat"></button>':''}
 <div class="workspace"><header class="topbar"><button class="button icon mobile-nav-toggle" data-action="menu" aria-label="Menüyü aç">${icon('menu')}</button><nav class="breadcrumbs" aria-label="Sayfa yolu"><a href="#view=home">Çalışma alanım</a><span>/</span><strong>${esc(title)}</strong></nav><div class="topbar-actions"><label class="search-box">${icon('search',18)}<input type="search" id="search" aria-label="Tüm haritada ara" placeholder="Bir fikir, şirket veya koşul ara…" value="${esc(state.query)}"><kbd>/</kbd></label><button class="button icon backup-top" data-action="export" aria-label="Yedeğini indir" title="Yedeğini indir">${icon('download')}</button></div></header>
 <main id="main" class="view" tabindex="-1">${state.view==='home'?renderHome():state.view==='route'?renderRoute():state.view==='projects'?renderProjects(state.project):state.view==='cv'?renderCVVault(cvSummary,JOBS.find(j=>j.id===state.job),cvError):state.view==='settings'?renderSettings():state.view==='tasks'?renderTasks():renderCollection()}</main></div>${selected?renderDetail(selected):choice?renderChoiceDetail(choice):job?renderJobDetail(job,state.jobFilters):product?renderProductDetail(product):''}`;
 if(state.selected&&!state.editing){const note=$('#node-notes');if(note)note.value=nodeState(state.selected).notes||'';}
 $('.workspace').inert=panel;$('.sidebar').inert=panel;
 if(job)$('#job-detail-close')?.focus();
 if(product)$('#product-detail-close')?.focus();
}
function renderHome(){
 const active=Object.keys(personal.nodes).filter(id=>['researching','chosen','done'].includes(status(id)));
 const done=active.filter(id=>status(id)==='done').length;
 return `<section class="hero"><div><div class="eyebrow">GELECEĞİN İÇİN BİR ÇALIŞMA ALANI</div><h1 class="hero-title">Bir sonraki adımın,<br><em>gözünün önünde.</em></h1><p class="hero-description">Önce ne yapmak istediğini seç.<br>Yalnız ilgilendiğin yolun ayrıntılarını aç.</p><div class="hero-meta"><span>4 ana yol</span><i></i><span>Önce amaç, sonra yer</span></div></div><aside class="progress-summary"><span class="eyebrow">SENİN İLERLEMEN</span><div class="progress-numbers"><strong>${active.length}</strong><span>kart üzerinde<br>çalışıyorsun</span></div><div class="progress-line"><span style="width:${active.length?done/active.length*100:0}%"></span></div><p>${done} tamamlanan · ${personal.tasks.filter(t=>!t.done).length} bekleyen görev</p><a href="#view=tasks">Sonraki adımını yaz ${icon('arrow',16)}</a></aside></section>
 <div class="section-heading"><div><span class="eyebrow">BAŞLAMAK İÇİN BİR YOL SEÇ</span><h2>Her seçenek, yeni bir kapı.</h2></div><span class="muted small">Ayrıntılar seçtikçe açılır</span></div>
 <section class="home-grid" aria-label="Yol seçenekleri">${ROUTES.filter(r=>!r.secondary).map((r,i)=>{const ns=routeNodes(r),picked=ns.filter(n=>status(n.id)==='chosen').length;return `<a class="route-card ${r.tone} ${i===1?'featured':''}" href="${href(r.id)}"><div class="route-card-top"><span class="route-icon">${icon(r.icon,24)}</span><span class="route-tag">${esc(r.tag)}</span></div><h3 class="route-title">${esc(r.name)}</h3><p class="route-description">${esc(r.description)}</p><div class="route-footer"><span class="route-stat">${r.id==='agriculture'?2:r.topics.length} seçenek${picked?` · ${picked} seçim`:''}</span><span class="route-open">Yolu keşfet ${icon('arrow',18)}</span></div></a>`;}).join('')}</section>
 <section class="home-bottom"><div><h2>Haritayı kendine göre kullan.</h2><p>Bir yol seç → bir seçeneği aç → ayrıntıyı sağda incele. Notların, favorilerin ve 90 günlük planın çalışma alanında seni bekler.</p></div><a class="button quiet" href="#view=settings">Nasıl çalışır? ${icon('arrow',17)}</a></section><p class="research-footnote">Güzellik ürünleri ve eylem planları: 20 Ekim 2026 · Çin ürün ticareti: 18 Ekim 2026 · İş ve eğitim: 14–15 Ekim 2026. Bağlantılar güncel ilan veya kabul garantisi değildir.</p>`;
}
function choiceCard(c){
 return `<button class="option-card ${state.choice===c.id?'selected':''}" data-action="open-choice" data-choice="${esc(c.id)}"><span class="option-icon">${icon(currentRoute().icon,22)}</span><strong>${esc(c.title)}</strong><span class="option-summary">${esc(c.summary)}</span><span class="option-tags">${c.countries.map(x=>`<span>${COUNTRIES[x]}</span>`).join('')}</span><span class="option-open">Özeti ve ilk adımı gör ${icon('arrow',17)}</span></button>`;
}
function renderRoute(){
 if(state.route==='agriculture'&&!state.selected&&!state.choice)return renderAgriculture(state.topic,new URLSearchParams(location.hash.slice(1)));
 if(state.route==='career'&&state.topic==='tech-study'&&!state.selected)return renderMasters(new URLSearchParams(location.hash.slice(1)));
 if(state.route==='career'&&state.topic==='jobs')return renderJobsBoard(JOBS,state.jobFilters,state.job,cvSummary);
 if(state.route==='china'&&state.topic==='product')return renderProductCatalog(PRODUCTS,expandedProductCategories,state.product);
 if(state.route==='china'&&state.topic==='supply'){
  const p=PRODUCTS.find(p=>p.id===state.product);
  return (p?renderProductSuppliers(p):renderProductCatalog(PRODUCTS,expandedProductCategories,null,true))+`<details class="catalog-old-notes"><summary>Fuar ve tedarik araştırması</summary>${currentTopic().choices.map(c=>`<button class="relation-link" data-action="open-choice" data-choice="${esc(c.id)}"><span><strong>${esc(c.title)}</strong></span>${icon('arrow',16)}</button>`).join('')}</details>`;
 }
 const route=currentRoute(),topic=currentTopic();
 const careerMenu=route.id==='career'&&!topic;
 const menuTopics=careerMenu?route.topics.filter(t=>t.id==='jobs'):route.topics;
 const sequential=route.sequence&&!topic;
 const countries=[...new Set((topic?[topic]:menuTopics).flatMap(t=>t.choices.flatMap(c=>c.countries)))];
 const topics=menuTopics.map(t=>({...t,choices:t.choices.filter(c=>matchesCountry(c,state.country))})).filter(t=>t.choices.length);
 const choices=topic?.choices.filter(c=>matchesCountry(c,state.country))||[];
 return `<nav class="route-trail" aria-label="Yol içinde gezinme"><a href="#view=home">Dört ana yol</a>${icon('chevron',13)}${topic?`<a href="${href(route.id)}">${esc(route.name)}</a>${icon('chevron',13)}<span>${esc(topic.title)}</span>`:`<span>${esc(route.name)}</span>`}</nav>
 <section class="route-heading"><div><div class="eyebrow">${esc(route.tag)}</div><h1>${esc(topic?.title||route.name)}</h1><p>${esc(topic?.summary||route.description)}</p></div>${topic?`<a class="button quiet" href="${href(route.id)}">${icon('back')}Diğer yollar</a>`:careerMenu?`<a class="button quiet" href="${href('career','tech-study')}">${icon('study')}Master imkanları</a>`:''}</section>
 ${route.id==='agriculture'?`<div class="independent-note">${icon('info',19)}<span>Çalışmak, eğitim almak ve pilot denemek ayrı seçenekler. Birini yapmak için diğerini tamamlaman gerekmiyor.</span></div>`:''}
 ${countries.length?`<div class="country-filter" role="group" aria-label="Ülkeye göre daralt"><span>Nerede?</span>${['all',...countries].map(c=>`<button class="country-chip ${state.country===c?'active':''}" data-action="country" data-country="${c}" aria-pressed="${state.country===c}">${COUNTRIES[c]}</button>`).join('')}</div>`:''}
 <div class="section-heading compact"><h2>${sequential?'Nasıl ilerleyeceksin?':topic?'Hangi seçeneği incelemek istersin?':'Ne yapmak istersin?'}</h2><span class="muted small">${sequential?'Genel iş akışı · yukarıdan aşağıya':topic?'Kartın ayrıntısı sağda açılır':'Önce bir amaç seç'}</span></div>
 ${sequential?`<p class="flow-note">Ürün uygunluğu ve maliyet kontrolüne ilk aşamada başla; siparişten önce tamamla. <a href="${href(route.id,'sell')}">İlgili kontrolleri aç ${icon('arrow',13)}</a></p><ol class="sequence-list" aria-label="Ürün ticareti adımları">${topics.map(t=>`<li><a class="sequence-card" href="${href(route.id,t.id)}"><span class="step-number" aria-label="${route.topics.findIndex(x=>x.id===t.id)+1}. adım">${route.topics.findIndex(x=>x.id===t.id)+1}</span><span class="step-content"><strong>${esc(t.title)}</strong><span class="option-summary">${esc(t.summary)}</span></span><span class="step-open">${t.id==='product'?PRODUCTS.length+' ürün':t.id==='supply'?'Ürüne göre tedarik':t.choices.length+' seçenek'} ${icon('arrow',18)}</span></a></li>`).join('')}</ol>`:`<section class="option-grid" aria-label="${topic?'Alt seçenekler':'Amaç seçenekleri'}">${topic?choices.map(choiceCard).join(''):topics.map(t=>`<a class="option-card topic-card" href="${href(route.id,t.id)}"><span class="option-icon">${icon(route.icon,22)}</span><strong>${esc(t.title)}</strong><span class="option-summary">${esc(t.summary)}</span><span class="option-open">${route.id==='career'&&t.id==='jobs'?`${JOBS.filter(j=>j.status==='open').length} doğrulanmış ilan · ${JOBS.filter(j=>j.status==='unverified').length} doğrulanamayan`:`${t.choices.length} seçenek`} ${icon('arrow',17)}</span></a>`).join('')}</section>`}
 ${topic&&!choices.length?'<div class="empty-state"><h2>Bu yerde henüz araştırılmış seçenek yok.</h2><p>Diğer yerleri görmek için “Tüm yerler”i seç.</p></div>':''}
 ${topic?`<p class="quiet-hint">Bu seçenekler bir sıra veya zorunluluk listesi değil. Sana uygun olanı aç.</p>`:''}`;
}
function sourceLinks(sources){return sources.map(source=>{
 if(!safeURL(source.url))return '';
 const s=SOURCES_BY_URL?.get(source.url)||source;
 return `<article class="source-note"><a class="source-link" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${icon('external',16)}<span>${esc(s.title||s.label||new URL(s.url).hostname)}<small>${esc(new URL(s.url).hostname)}</small></span></a>${s.status==='read'&&s.summary?`<p class="source-summary">${esc(s.summary)}</p><span class="source-date">Sayfa okundu · ${esc(s.checkedAt||RESEARCH.checkedAt)}</span>${s.contact?`<p class="source-contact"><strong>Resmî temas:</strong> ${esc(typeof s.contact==='string'?s.contact:JSON.stringify(s.contact))}</p>`:''}`:`<p class="source-pending">${esc(s.status==='unread'?(s.reason||'Bu sayfa açılamadı; okunmuş özet sunulmuyor.'):'Bu bağlantı için yeni sayfa özeti henüz eklenmedi.')}</p>`}</article>`;
 }).join('');}
function selectedGuide(c){return c.variants?.find(v=>v.id===state.variant)||c;}
function renderActionSteps(c){
 const guide=selectedGuide(c),steps=getActionSteps(guide);
 return `<section class="action-plan" aria-label="Yapılacak aşamalar"><div class="plan-heading"><span class="eyebrow">NE YAPACAĞIM?</span><h3>${steps.length} mantıklı aşama</h3><p>Aşamayı aç; araştırılacak noktaları, görüşülecek kanalı ve kaynak özetini incele.</p></div>${guide!==c?`<p class="variant-summary">${esc(guide.summary)}</p>`:''}<ol class="action-steps">${steps.map((step,i)=>`<li><details class="action-step"><summary><span class="action-number">${i+1}</span><span><strong>${esc(step.title)}</strong><small>${esc(step.action)}</small></span><span class="fold-icon">+</span></summary><div class="action-body"><div class="action-columns">${step.research?.length?`<section><h4>Araştırılacak noktalar</h4><ul>${step.research.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section>`:''}${step.contact?`<section><h4>Kiminle, ne için görüş?</h4><p>${esc(step.contact)}</p></section>`:''}</div>${step.output?`<p class="action-output"><strong>Bu aşamanın çıktısı:</strong> ${esc(step.output)}</p>`:''}${step.sources?.length?`<section class="step-sources"><h4>Okunan kaynaklar ve kısa özetleri</h4>${sourceLinks(step.sources)}</section>`:''}<button class="button quiet" data-action="task-from-step" data-text="${esc((step.title+': '+step.action).slice(0,500))}">${icon('plus',16)}Görevlerime ekle</button></div></details></li>`).join('')}</ol></section>`;
}
function renderChoiceDetail(c){
 const topic=currentTopic();const visible=c.nodeIds.map(getNode).filter(Boolean).filter(n=>status(n.id)!=='eliminated');
 const eliminated=c.nodeIds.map(getNode).filter(Boolean).filter(n=>status(n.id)==='eliminated');
 const related=topic.choices.filter(x=>x.id!==c.id&&matchesCountry(x,state.country));
 return `<aside class="detail-panel" role="complementary" aria-label="Seçenek ayrıntısı"><div class="detail-header"><span class="eyebrow">SEÇENEK ÖZETİ</span>${button('close-detail','Kapat','close','icon','aria-label="Ayrıntıyı kapat"')}</div><div class="detail-content"><span class="detail-category">${esc(currentRoute().name)} / ${esc(topic.title)}</span><h2 class="detail-title">${esc(c.title)}</h2><p class="choice-intro">${esc(c.summary)}</p><div class="option-tags">${c.countries.map(x=>`<span>${COUNTRIES[x]}</span>`).join('')}</div>
 ${c.variants?.length?`<section class="variant-picker"><h3>Hangi ürün kolunu inceleyeceksin?</h3><div role="group" aria-label="Güzellik ürünü türü"><button class="variant-button ${!state.variant?'active':''}" data-action="variant" data-variant="" aria-pressed="${!state.variant}">Genel yol</button>${c.variants.map(v=>`<button class="variant-button ${state.variant===v.id?'active':''}" data-action="variant" data-variant="${esc(v.id)}" aria-pressed="${state.variant===v.id}">${esc(v.title)}</button>`).join('')}</div></section>`:''}
 ${renderActionSteps(c)}
 ${c.details?`<section class="detail-section prose">${bodyHTML(c.details)}</section>`:''}
 ${c.requirements?.length?`<details class="detail-fold"><summary>Bunun için gerekenler</summary><ul class="requirement-list">${c.requirements.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></details>`:''}
 ${visible.length?`<details class="detail-fold"><summary>Ek araştırma kartları <span>${visible.length}</span></summary><div class="drawer-cards">${visible.map(renderResearchLink).join('')}</div></details>`:''}
 ${eliminated.length?`<details class="detail-fold"><summary>Elediğin ${eliminated.length} kart</summary>${eliminated.map(renderResearchLink).join('')}</details>`:''}
 ${c.sources?.length?`<details class="detail-fold"><summary>Başlangıç kaynakları</summary>${sourceLinks(c.sources)}</details>`:''}
 ${c.extraNodeIds?.length?`<details class="detail-fold"><summary>Önceki genel notlar</summary>${c.extraNodeIds.map(getNode).filter(Boolean).map(renderResearchLink).join('')}</details>`:''}
 ${currentRoute().id==='agriculture'?`<section class="detail-section"><h3>Başka bir yola da geçebilirsin</h3>${currentRoute().topics.filter(t=>t.id!==topic.id).map(t=>`<a class="transition-link" href="${href(state.route,t.id)}"><span>${esc(t.title)}<small>Bağımsız alternatif · tamamlanması gereken koşul değil</small></span>${icon('arrow',16)}</a>`).join('')}</section>`:related.length?`<details class="detail-fold"><summary>Yan yana değerlendirebileceğin seçenekler</summary>${related.map(x=>`<button class="relation-link" data-action="open-choice" data-choice="${x.id}"><span><strong>${esc(x.title)}</strong></span>${icon('arrow',16)}</button>`).join('')}</details>`:''}
 </div><div class="detail-footer">Kaynak özetleri belirtilen kontrol tarihinin notlarıdır; sayfalar canlı olarak izlenmez. Açılmayan sayfa okunmuş gösterilmez.</div></aside>`;
}
function renderResearchLink(n){return `<button class="research-link" data-action="open-node" data-id="${esc(n.id)}"><span><strong>${esc(n.title)}</strong><small>${esc(summarize(n.body,100))}</small></span>${icon('chevron',16)}</button>`;}
function renderResult(n){return `<button class="result-item" data-action="open-node" data-id="${esc(n.id)}"><span class="result-main"><span class="result-category">${esc(GROUPS.get(n.group)?.title||'Araştırma')}</span><strong>${esc(n.title)}</strong><span class="result-excerpt">${esc(summarize(n.body))}</span></span><span class="result-end"><span class="badge status-${status(n.id)}">${STATUS[status(n.id)]}</span>${nodeState(n.id).favorite?icon('star',17):icon('chevron',17)}</span></button>`;}
function renderCollection(){
 const favorites=state.view==='favorites';const nodes=favorites?DATA.nodes.filter(n=>nodeState(n.id).favorite).map(n=>getNode(n.id)):searchNodes(DATA.nodes.map(n=>getNode(n.id)),state.query);
 const choices=favorites?[]:searchNodes(searchableChoices(ROUTES),state.query);
 const projects=favorites?[]:searchProjects(state.query);
 const products=favorites?[]:searchProducts(PRODUCTS,state.query);
 return `<section class="collection-heading"><span class="eyebrow">${favorites?'KENDİ SEÇKİN':'YOLLAR VE ARAŞTIRMA'}</span><h1>${favorites?'Geri dönmek istediğin fikirler.':'Aradığın yolu bul.'}</h1><p>${favorites?'Favorilediğin kartlar burada. Durum ve notların kartın ayrıntılarında.':state.query?`“${esc(state.query)}” için ${nodes.length+choices.length+projects.length+products.length} sonuç`:'Üstteki arama alanına bir ürün, şirket, ülke veya koşul yaz.'}</p></section><div class="results-list">${renderProductResults(products)}${renderProjectResults(projects)}${choices.map(c=>`<button class="result-item" data-action="open-choice" data-choice="${esc(c.id)}" data-route="${esc(c.route)}" data-topic="${esc(c.topic)}"><span class="result-main"><span class="result-category">SEÇENEK VE EYLEM PLANI</span><strong>${esc(c.title)}</strong><span class="result-excerpt">${esc(summarize(c.body))}</span></span>${icon('arrow',17)}</button>`).join('')}${nodes.map(renderResult).join('')}</div>${!nodes.length&&!choices.length&&!projects.length&&!products.length?`<div class="empty-state">${icon(favorites?'star':'search',38)}<h2>${favorites?'Henüz bir favorin yok.':state.query?'Eşleşen kart bulunamadı.':'Her şey bir kelimeyle başlar.'}</h2><p>${favorites?'Bir kartın ayrıntısındaki yıldızı kullanarak buraya ekleyebilirsin.':'Farklı bir kelime dene: güzellik, oyuncak, remote, master veya marka.'}</p></div>`:''}`;
}
function bodyHTML(body){return String(body||'').split(/\n\s*\n|\n---\n/).map(p=>`<p>${esc(p).replace(/\n/g,'<br>')}</p>`).join('');}
function renderDetail(n){
 const ns=nodeState(n.id),outgoing=DATA.edges.filter(e=>e.source===n.id),incoming=DATA.edges.filter(e=>e.target===n.id);
 return `<aside class="detail-panel" aria-label="Kart ayrıntısı"><div class="detail-header"><span class="eyebrow">KART AYRINTISI</span><div>${button('favorite',ns.favorite?'Favoriden çıkar':'Favorile','star','icon '+(ns.favorite?'is-favorite':''),'data-id="'+esc(n.id)+'" aria-label="'+(ns.favorite?'Favoriden çıkar':'Favorile')+'"')}${button('close-detail','Kapat','close','icon','aria-label="Ayrıntıyı kapat"')}</div></div><div class="detail-content"><button class="text-link back-to-choice" data-action="back-choice">${icon('back',15)} Seçeneğin özetine dön</button><span class="detail-category">${esc(currentRoute()?.name)} / ${esc(currentTopic()?.title)}</span><h2 class="detail-title">${esc(n.title)}</h2><div class="detail-status-row"><label for="node-status">Bu yol benim için</label><select id="node-status" class="status-select">${Object.entries(STATUS).map(([k,v])=>`<option value="${k}" ${status(n.id)===k?'selected':''}>${v}</option>`).join('')}</select></div>${state.editing?renderEditor(n):`<p class="choice-intro">${esc(summarize(n.body,210))}</p><details class="detail-fold"><summary>Araştırmanın tamamını oku</summary><section class="prose">${bodyHTML(n.body)}</section></details>${n.requirements?.length?`<details class="detail-fold"><summary>Bunun için gerekenler <span>${n.requirements.length}</span></summary><ul class="requirement-list">${n.requirements.map(r=>`<li>${esc(r)}</li>`).join('')}</ul></details>`:''}<section class="detail-section"><div class="detail-section-title"><h3>Kendi notun</h3><span class="muted small">Otomatik kaydolur</span></div><textarea id="node-notes" class="notes-field" placeholder="Bu seçenekle ilgili düşüncen, soruların, sonraki adımın…" maxlength="50000" aria-label="Kendi notun"></textarea></section><div class="detail-buttons">${button('edit','Kartı düzenle','edit')}${button('task-from-node','Göreve ekle','plus','primary')}</div>${n.sources?.length?`<details class="detail-fold"><summary>Kaynaklar <span>${n.sources.length}</span></summary>${sourceLinks(n.sources)}</details>`:''}${renderRelations('Buradan nereye?',outgoing,'target')}${renderRelations('Bu karta bağlananlar',incoming,'source')}`}</div><div class="detail-footer">${ns.edit?'Bu kartta kişisel düzenlemen var.':'Araştırma içeriği · Karar sana ait.'} Notların ve değişikliklerin yalnız bu tarayıcıda.</div></aside>`;
}
function renderRelations(title,edges,field){return edges.length?`<details class="detail-fold"><summary>${title} <span>${edges.length}</span></summary>${edges.map(e=>{const n=getNode(e[field]);return n?`<button class="relation-link" data-action="open-node" data-id="${esc(n.id)}"><span><small>${esc(relationLabels[e.type]||'İlgili seçenek')}${e.label?` · ${esc(e.label)}`:''}</small><strong>${esc(n.title)}</strong></span>${icon(field==='source'?'back':'arrow',17)}</button>`:'';}).join('')}</details>`:'';}
function renderEditor(n){return `<form id="edit-form" class="editor-form"><div class="field"><label class="field-label" for="edit-title">Kart başlığı</label><input class="field-input" id="edit-title" value="${esc(n.title)}" maxlength="500" required></div><div class="field"><label class="field-label" for="edit-body">Açıklama</label><textarea class="field-textarea" id="edit-body" rows="12" maxlength="100000">${esc(n.body)}</textarea></div><div class="field"><label class="field-label" for="edit-requirements">Gerekenler · Her satıra bir madde</label><textarea class="field-textarea" id="edit-requirements" rows="5">${esc(n.requirements?.join('\n'))}</textarea></div><div class="field"><label class="field-label" for="edit-sources">Kaynaklar · Her satıra Başlık | https://adres</label><textarea class="field-textarea" id="edit-sources" rows="5">${esc(n.sources?.map(s=>`${s.title||s.label||''} | ${s.url}`).join('\n'))}</textarea></div><p class="muted small">Düzenlemen bu tarayıcıda saklanır; sitenin herkesin gördüğü araştırma içeriğini değiştirmez.</p><div class="detail-buttons"><button class="button primary" type="submit">Kaydet</button>${button('cancel-edit','Vazgeç',null)}</div></form>`;}
function safeURL(url){try{return ['https:','http:'].includes(new URL(url).protocol);}catch{return false;}}
function renderTasks(){
 const marked=DATA.nodes.filter(n=>status(n.id)==='chosen'||status(n.id)==='researching');
 return `<section class="collection-heading"><span class="eyebrow">DÜŞÜNCEDEN EYLEME</span><h1>Bir sonraki küçük adım.</h1><p>Kendi görevlerini yaz veya bir kartı doğrudan görev listene ekle.</p></section><form id="task-form" class="task-form"><input class="field-input" id="task-text" placeholder="Örneğin: Üç tedarikçiden aynı ürün için teklif al" aria-label="Yeni görev" maxlength="500" required><button class="button primary" type="submit">${icon('plus',18)}Görev ekle</button></form><div class="task-list">${personal.tasks.length?personal.tasks.map(t=>`<div class="task-row ${t.done?'done':''}"><input type="checkbox" ${t.done?'checked':''} data-action="toggle-task" data-id="${esc(t.id)}" aria-label="${esc(t.text)}"><div><strong>${esc(t.text)}</strong>${t.nodeId&&getNode(t.nodeId)?`<button class="text-link" data-action="open-node" data-id="${esc(t.nodeId)}">${esc(getNode(t.nodeId).title)} ${icon('arrow',14)}</button>`:''}</div>${button('remove-task','Görevi kaldır','close','icon','data-id="'+esc(t.id)+'" aria-label="Görevi kaldır"')}</div>`).join(''):`<div class="empty-state">${icon('check',38)}<h2>Listeni küçük tut, adımını netleştir.</h2><p>İlk görevini yukarıya yazabilirsin.</p></div>`}</div>${marked.length?`<div class="section-heading"><h2>Üzerinde çalıştığın yollar</h2><span>${marked.length} kart</span></div><div class="results-list">${marked.map(n=>renderResult(getNode(n.id))).join('')}</div>`:''}`;
}
function renderSettings(){return `<section class="collection-heading"><span class="eyebrow">SANA AİT BİR ÇALIŞMA ALANI</span><h1>Notların sende kalsın.</h1><p>Kaynaklı harita herkese açık. Notların, seçimlerin ve kişisel kart düzenlemelerin bu tarayıcıda saklanır; sunucuya gönderilmez.</p></section><section class="settings-grid"><article class="settings-block"><h2>Yedeğini indir</h2><p>Tarayıcı verilerini silmeden, cihaz değiştirmeden veya önemli düzenlemelerden sonra yedek al. Dosya notlarını, favorilerini, görevlerini ve kart düzenlemelerini içerir.</p>${button('export','JSON yedeğini indir','download','primary')}</article><article class="settings-block"><h2>Yedeğini geri yükle</h2><p>Başka cihazda veya tarayıcıda devam etmek için yedek dosyanı yükle. Geri yükleme bu tarayıcıdaki kişisel çalışma verilerinin yerine geçer; önce mevcut yedeğin indirilir.</p>${button('import','Yedek dosyası seç','upload')}</article></section><section class="settings-block how-to"><h2>Harita nasıl kullanılır?</h2><ol><li>Ana sayfadan bir yol seç.</li><li>Bir amaç seç; kısa seçenek kartları görünür.</li><li>Bir seçeneğe tıkla; özet ve ilk adım sağda açılır. Araştırmanın tamamını, koşulları ve kaynakları istediğinde genişlet.</li><li>Bir durum seç, not ekle veya kartı göreve dönüştür.</li></ol><p>Önce amaç seçilir, ülke filtresi sonra uygulanır. Seçenekler birbirinin zorunlu ön koşulu değildir. Gerçek koşullar ve geri dönüşler araştırma kartının bağlantılarında belirtilir. Elediğin kartlar seçenek özetinde kapalı tutulur; aramada erişilebilir.</p></section><section class="settings-block"><h2>İçeriğin kapsamı</h2><p>${DATA.nodes.length} özgün kart · ${DATA.edges.length} ilişki · 84 şirket · 325 özgün kaynak bağlantısı. Yeni eylem planında ${new Set(RESEARCH.sources.filter(s=>s.status==='read').map(s=>s.url)).size} farklı okunmuş sayfa ve ${RESEARCH.sources.filter(s=>s.status==='unread').length} erişilemeyen bağlantı kaydı var.</p><p>Çin ürün ticareti 18 Ekim 2026, önceki kariyer / eğitim yolları 14–15 Ekim 2026 araştırmasına dayanır. Fuar, ilan ve program koşulları karar öncesi kendi resmî kaynağından yeniden kontrol edilir. Ürün fikirleri doğrulanmış talep veya kârlılık sonucu değildir.</p><p>Kişisel profil bilgileri açık sürümden çıkarıldı. Yerel notların otomatik olarak cihazlar arasında eşitlenmez.</p></section>`;}

document.addEventListener('click',async event=>{
 const el=event.target.closest('[data-action]');if(!el)return;
 const action=el.dataset.action,id=el.dataset.id;
 try{
 switch(action){
 case 'menu':state.sidebar=!state.sidebar;render();break;
 case 'close-menu':state.sidebar=false;render();break;
 case 'open-choice':if(el.dataset.route)state.country='all';navigate('route',el.dataset.route||state.route,el.dataset.topic||state.topic,el.dataset.choice);break;
 case 'variant':{const p=new URLSearchParams(location.hash.slice(1));el.dataset.variant?p.set('variant',el.dataset.variant):p.delete('variant');location.hash=p.toString();break;}
 case 'task-from-step':store.addTask(el.dataset.text);toast('Aşama yapılacaklarına eklendi.');break;
 case 'country':state.country=el.dataset.country;navigate('route',state.route,state.topic);break;
 case 'back-choice':navigate('route',state.route,state.topic,state.choice);break;
 case 'expand':state.expanded.has(el.dataset.module)?state.expanded.delete(el.dataset.module):state.expanded.add(el.dataset.module);refresh();break;
 case 'collapse':state.expanded.clear();refresh();break;
 case 'open-node':openNode(id);break;
 case 'close-detail':if(state.product&&state.route==='china'&&state.topic==='product'&&!state.selected)location.hash=productHref();else if(state.job)location.hash=jobsHref(state.jobFilters);else navigate('route',state.route,state.topic);break;
 case 'close-product':location.hash=productHref();break;
 case 'close-job':location.hash=jobsHref(state.jobFilters);break;
 case 'jobs-clear':location.hash=jobsHref();break;
 case 'cv-choose':$('#cv-files')?.click();break;
 case 'cv-download':downloadCVRecord(await getCVFile(el.dataset.cv));break;
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
 if(event.target.id==='agri-query'){clearTimeout(searchTimer);searchTimer=setTimeout(updateAgriFilters,180);return;}
 if(event.target.id==='master-query'){clearTimeout(searchTimer);searchTimer=setTimeout(updateMasterFilters,180);return;}
 if(event.target.id==='jobs-query'){clearTimeout(searchTimer);searchTimer=setTimeout(updateJobFilters,180);return;}
 if(event.target.id==='node-notes'){try{store.updateNode(state.selected,{notes:event.target.value});}catch(e){toast(e.message);}return;}
 if(event.target.id==='search'){
  state.query=event.target.value;clearTimeout(searchTimer);searchTimer=setTimeout(()=>{
   if(state.view!=='search'){state.selected=null;state.choice=null;state.view='search';history.pushState(null,'','#view=search&q='+encodeURIComponent(state.query));}
   else history.replaceState(null,'','#view=search&q='+encodeURIComponent(state.query));
   const field=$('#search'),position=field.selectionStart;render();const next=$('#search');next.focus();if(next.type!=='search')next.setSelectionRange(position,position);
  },180);
 }
});
document.addEventListener('change',async event=>{
 if(event.target.matches('[data-agri-filter]')){updateAgriFilters();return;}
 if(event.target.matches('[data-master-filter]')){updateMasterFilters();return;}
 if(event.target.matches('[data-job-filter]')){updateJobFilters();return;}
 if(event.target.id==='cv-files'){
  const files=Array.from(event.target.files);event.target.value='';if(!files.length)return;
  try{cvSummary=await importCVFiles(files);cvError='';refresh();toast('CV kaynakların yalnız bu tarayıcıya kaydedildi.');}catch(error){cvError=error.message;refresh();toast(error.message);}return;
 }
 try{if(event.target.id==='node-status'){store.updateNode(state.selected,{status:event.target.value});refresh();}if(event.target.id==='list-filter'){state.filter=event.target.value;refresh();}}catch(e){toast(e.message);}
});
document.addEventListener('submit',event=>{
 if(event.target.id==='agri-filters'){event.preventDefault();updateAgriFilters();return;}
 if(event.target.id==='master-filters'){event.preventDefault();updateMasterFilters();return;}
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
  else if(state.job&&state.view==='route')location.hash=jobsHref(state.jobFilters);
  else if(state.product&&state.route==='china'&&state.topic==='product'&&!state.selected)location.hash=productHref();
  else if(state.selected)navigate('route',state.route,state.topic,state.choice);
  else if(state.choice)navigate('route',state.route,state.topic);
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

function updateAgriFilters(){
 const field=document.activeElement,focus=field?.id,caret=focus==='agri-query'?field.selectionStart:null;
 const form=document.getElementById('agri-filters');if(!form)return;
 const f=Object.fromEntries(new FormData(form));history.replaceState(null,'',agriHref(state.topic==='experience'?'experience':'education',f));render();
 const next=focus&&document.getElementById(focus);if(next){next.focus();if(caret!==null)next.setSelectionRange(caret,caret);}
}
function updateMasterFilters(){
 const field=document.activeElement,focus=field?.id,caret=focus==='master-query'?field.selectionStart:null;
 const f=Object.fromEntries(new FormData(document.getElementById('master-filters')));
 history.replaceState(null,'',mastersHref(f));render();
 const next=focus&&document.getElementById(focus);if(next){next.focus();if(caret!==null)next.setSelectionRange(caret,caret);}
}
function updateJobFilters(){
 const ids={query:'jobs-query',region:'jobs-region',country:'jobs-country',model:'jobs-model',role:'jobs-role',type:'jobs-type',group:'jobs-group'};
 const f={};for(const [key,id]of Object.entries(ids)){const field=document.getElementById(id);if(!field)return;f[key]=field.value;}
 const focus=document.activeElement?.id;const caret=focus==='jobs-query'?document.activeElement.selectionStart:null;
 const hash=jobsHref(f);history.replaceState(null,'',hash);state.jobFilters=jobFiltersFromParams(new URLSearchParams(hash.slice(1)));state.job=null;render();
 const field=focus&&document.getElementById(focus);if(field){field.focus();if(caret!==null)field.setSelectionRange(caret,caret);}
}
document.addEventListener('toggle',async event=>{
 if(event.target.matches('.product-category')&&event.target.isConnected){const id=event.target.dataset.productCategory;event.target.open?expandedProductCategories.add(id):expandedProductCategories.delete(id);return;}
 if(!event.target.matches('.cv-source')||!event.target.open)return;
 const field=document.getElementById('cv-source-text');if(!field)return;
 try{const record=await getCVFile('latex');if(field.isConnected)field.value=record?.text||'LaTeX kaynağı bulunamadı.';}catch(error){toast(error.message);}
},true);

async function init(){
 try{const [response,researchResponse,jobsResponse,productsResponse]=await Promise.all([fetch('./data.json'),fetch('./research.json'),fetch('./jobs-data.json?v=2.6.0'),fetch('./products-data.json?v=2.6.0')]);if(!productsResponse.ok)throw Error('Ürün kataloğu yüklenemedi.');PRODUCTS=(await productsResponse.json()).products;if(!jobsResponse.ok)throw Error('İş ilanları yüklenemedi.');JOBS=(await jobsResponse.json()).records;if(!response.ok||!researchResponse.ok)throw Error('Harita veya kaynak notları yüklenemedi.');[DATA,RESEARCH]=await Promise.all([response.json(),researchResponse.json()]);SOURCES_BY_URL=new Map((RESEARCH.sources||[]).map(s=>[s.url,s]));NODES=new Map(DATA.nodes.map(n=>[n.id,n]));GROUPS=new Map(DATA.groups.map(g=>[g.id,g]));ROUTES=applyResearch(createNavigation(DATA),RESEARCH);
  try{cvSummary=await getCVSummary();}catch(error){cvError=error.message;}
  store=createStore({onError:error=>{persistenceError=error.message;toast(error.message);}});personal=store.getState();store.subscribe(next=>{personal=next;});window.addEventListener('hashchange',readRoute);readRoute();
 }catch(error){$('#app').innerHTML=`<main class="empty-state"><h1>Harita açılamadı.</h1><p>${esc(error.message)}</p><p>Sayfayı yeniden yükleyebilirsin. Yerel dosyayı doğrudan açıyorsan önizleme sunucusunu kullan.</p><button class="button primary" onclick="location.reload()">Yeniden dene</button></main>`;}
}
init();
