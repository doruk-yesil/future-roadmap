import test from 'node:test';
import assert from 'node:assert/strict';
import {AGRI_DATA,agriFilters,agriHref,filterAgri,renderAgriculture} from './agriculture.js';
test('agriculture discovery shows only two independent learning paths',()=>{
 const html=renderAgriculture(null);assert.equal((html.match(/class="option-card topic-card"/g)||[]).length,2);assert.ok(html.includes('Çalışarak ve sahada öğren'));assert.ok(html.includes('Kurs veya okul ile öğren'));assert.ok(!html.includes('Küçük bir iş'));assert.ok(!html.includes('agri-pilot'));
});
test('selected agricultural records have explicit entry, cost, availability and dated read sources',()=>{
 assert.ok(AGRI_DATA.records.length>=10&&AGRI_DATA.records.length<=20);assert.equal(new Set(AGRI_DATA.records.map(r=>r.id)).size,AGRI_DATA.records.length);
 for(const r of AGRI_DATA.records){assert.ok(['experience','education'].includes(r.track));assert.ok(r.entry.length&&r.learn.length&&r.applySteps.length>=2&&r.costPay&&r.availability&&r.kind);assert.ok(r.sources.length);for(const s of r.sources){assert.equal(s.status,'read');assert.equal(s.checkedAt,'2026-10-31');assert.ok(s.summary);assert.equal(new URL(s.url).protocol,'https:');}}
});
test('agriculture filters scope the learning path and country without inventing paid jobs',()=>{
 const f={query:'',country:'ABD',kind:'all'};const rows=filterAgri(AGRI_DATA.records,'experience',f);assert.ok(rows.length);assert.ok(rows.every(r=>r.track==='experience'&&r.country==='ABD'));assert.deepEqual(agriFilters(new URLSearchParams(agriHref('experience',f).slice(1))),f);
 const html=renderAgriculture('experience');assert.ok(html.includes('Kaydırılabilir tarım seçenekleri'));assert.ok(html.includes('Gönüllü'));assert.ok(html.includes('Güncel durum:'));
 const unsafe=renderAgriculture('agri-study',new URLSearchParams({aq:'"><img src=x>'}));assert.ok(!unsafe.includes('<img'));assert.ok(unsafe.includes('&lt;img'));
});

test('exchange platforms appear once with homepages instead of separate host records',()=>{
 const exp=AGRI_DATA.records.filter(r=>r.track==='experience');assert.equal(exp.length,4);
 assert.equal(exp.filter(r=>r.organization==='WWOOF').length,1);assert.equal(exp.filter(r=>r.organization==='Workaway').length,1);
 assert.equal(exp.find(r=>r.organization==='WWOOF').url,'https://wwoof.net/');assert.equal(exp.find(r=>r.organization==='Workaway').url,'https://www.workaway.info/');
 assert.ok(!exp.some(r=>/West Town|Sunshine|Fehmi|Küçükyoncalı/.test(r.title+' '+r.organization)));
});

import {createStore} from './state.js';
import {renderManualAgriculture,renderAgricultureCard} from './manual-agriculture.js';
test('personal agriculture cards save edits, reload and round-trip through existing backups',()=>{
 const m=new Map(),storage={getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v)},s=createStore({storage});
 const c=s.addAgricultureCard('Çiftlik fikri');s.updateAgricultureCard(c.id,{description:'Sahada öğrenme',notes:'İletişim kurulacak'});
 const reloaded=createStore({storage});assert.equal(reloaded.getState().agricultureCards[0].notes,'İletişim kurulacak');
 const other=createStore({storage:null});other.importBackup(s.exportBackup());assert.deepEqual(other.getState().agricultureCards,s.getState().agricultureCards);
 const card=s.getState().agricultureCards[0];s.removeAgricultureCard(c.id);assert.equal(s.getState().agricultureCards.length,0);s.restoreAgricultureCard(card);assert.equal(s.getState().agricultureCards.length,1);
 const old=s.exportBackup();delete old.state.agricultureCards;other.importBackup(old);assert.deepEqual(other.getState().agricultureCards,[]);
});
test('manual agriculture page starts empty and editable side panel escapes personal text',()=>{
 const html=renderManualAgriculture([]);assert.match(html,/Kart ekle/);assert.ok(!html.includes('WWOOF'));assert.ok(!html.includes('Çalışarak ve sahada öğren'));
 const panel=renderAgricultureCard({id:'test',title:'<script>',description:'</textarea><script>',notes:'not'});assert.match(panel,/role="dialog"/);assert.match(panel,/data-agriculture-edit="notes"/);assert.ok(!panel.includes('<script>'));
});

test('food cards use the same editor while staying separate from agriculture and persisting in backups',()=>{
 const s=createStore({storage:null});s.addAgricultureCard('Çiftlik');const card=s.addFoodCard('Zincir restoran');s.updateFoodCard(card.id,{notes:'Operasyonu öğren',description:'Yemek sektörü'});
 assert.equal(s.getState().agricultureCards.length,1);assert.equal(s.getState().foodCards[0].notes,'Operasyonu öğren');
 const copy=createStore({storage:null});copy.importBackup(s.exportBackup());assert.equal(copy.getState().foodCards[0].description,'Yemek sektörü');
 const html=renderManualAgriculture(copy.getState().foodCards,'food');assert.match(html,/<h1>Gıda<\/h1>/);assert.match(html,/route=food/);assert.ok(!html.includes('Çiftlik'));
 assert.match(renderAgricultureCard(card,'food'),/>GIDA</);copy.removeFoodCard(card.id);assert.equal(copy.getState().foodCards.length,0);copy.restoreFoodCard(card);assert.equal(copy.getState().foodCards.length,1);
 const old=s.exportBackup();delete old.state.foodCards;copy.importBackup(old);assert.deepEqual(copy.getState().foodCards,[]);
});

import {isUSAgricultureMasterCard,US_AGRI_MASTERS,renderUSAgricultureMasters,mergeUSAgriPrograms,filterUSAgriPrograms,renderUSAgriMasterDetail,createUSMasterDraft} from './us-agriculture-masters.js';
test('only named US agriculture master card links to separate US list; removed header button stays absent',()=>{
 const card={id:'mine',title:'Amerikada Master Agriculture',description:'',notes:''};assert.ok(isUSAgricultureMasterCard(card));
 const html=renderManualAgriculture([card]);assert.match(html,/study=us-masters/);assert.ok(!html.includes('master-mini-card'));assert.ok(!html.includes('route=career'));
 const other=renderManualAgriculture([{...card,title:'Çiftlik'}]);assert.ok(!other.includes('study=us-masters'));assert.match(other,/card=mine/);
 assert.equal(US_AGRI_MASTERS.length,4);for(const p of US_AGRI_MASTERS){assert.ok(p.entry&&p.transition);for(const source of p.sources)assert.equal(new URL(source[1]).protocol,'https:');}
 const list=renderUSAgricultureMasters('mine');assert.match(list,/ABD tarım masterları listesi/);assert.match(list,/card=mine/);assert.match(list,/Cornell University/);assert.ok(!list.includes('Georgia Tech'));
});

test('US master overrides and custom programs persist and remain included in compatible backups',()=>{
 const m=new Map(),storage={getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v)},s=createStore({storage});
 s.saveUSAgriProgram('cornell-cea',{application:'eligible',notes:'Sorulacaklar',description:'Kısa açıklama',usState:'New York'});
 s.saveUSAgriProgram('my-program',{custom:true,school:'Yeni Üniversite',program:'Agriculture MS',usState:'Texas',application:'conditional'});
 const restored=createStore({storage});assert.equal(restored.getState().usAgriPrograms[0].notes,'Sorulacaklar');
 const other=createStore({storage:null});other.importBackup(s.exportBackup());const rows=mergeUSAgriPrograms(other.getState().usAgriPrograms);assert.equal(rows.length,5);
 assert.equal(filterUSAgriPrograms(rows,{usState:'New York',application:'eligible'}).length,1);
 assert.equal(filterUSAgriPrograms(rows,{usState:'Texas',application:'eligible'}).length,0);
 assert.throws(()=>s.saveUSAgriProgram('my-program',{application:'fake'}));assert.throws(()=>s.saveUSAgriProgram('my-program',{applicationUrl:'javascript:alert(1)'}));
 const old=s.exportBackup();delete old.state.usAgriPrograms;other.importBackup(old);assert.deepEqual(other.getState().usAgriPrograms,[]);
});
test('master rows have three inline tabs and notes stay editable while other information requires edit mode',()=>{
 const p=mergeUSAgriPrograms([{id:'cornell-cea',notes:'<script>not</script>'}])[0];
 const view=renderUSAgricultureMasters(null,[{id:'cornell-cea',notes:'<script>not</script>'}]);
 assert.match(view,/data-usm-filter/);assert.match(view,/Bilgileri düzenle/);assert.match(view,/role="tablist"/);assert.match(view,/Program bilgisi/);assert.match(view,/Gereklilikler/);
 assert.match(view,/data-usm-edit="notes"/);assert.ok(!view.includes('data-usm-draft='));assert.ok(!view.includes('Tüm detaylar'));assert.ok(!view.includes('role="dialog"'));assert.equal(renderUSAgriMasterDetail(p),'');
 const ui={drafts:new Map([[p.id,createUSMasterDraft(p)]]),tabs:new Map([[p.id,'program']])};
 const editing=renderUSAgricultureMasters(null,[],{usState:'all',application:'all'},new Set([p.id]),ui);
 assert.match(editing,/data-usm-draft="duration"/);assert.match(editing,/Bilgileri kaydet/);assert.match(editing,/Düzenlemeden vazgeç/);
 assert.ok(!view.includes('<script>'));
});
test('metadata drafts are isolated until save and cancelling cannot discard auto-saved notes',()=>{
 const s=createStore({storage:null}),base=mergeUSAgriPrograms()[0],draft=createUSMasterDraft(base);
 draft.description='Henüz kaydedilmedi';draft.duration='2 yıl';
 s.saveUSAgriProgram(base.id,{notes:'Kalıcı not'});
 assert.notEqual(mergeUSAgriPrograms(s.getState().usAgriPrograms)[0].description,draft.description);
 s.saveUSAgriProgram(base.id,draft);const changed=mergeUSAgriPrograms(s.getState().usAgriPrograms)[0];
 assert.equal(changed.duration,'2 yıl');assert.equal(changed.notes,'Kalıcı not');
 const invalid={...createUSMasterDraft(changed),programUrl:'javascript:alert(1)'};const before=s.getState();assert.throws(()=>s.saveUSAgriProgram(base.id,invalid));assert.deepEqual(s.getState(),before);
});

test('program creation is inline like the jobs form and uses entered country/state/status',()=>{
 const html=renderUSAgricultureMasters();assert.match(html,/id="usm-add-form" class="job-add-form/);assert.match(html,/id="usm-new-country"/);assert.match(html,/id="usm-new-state"/);assert.match(html,/id="usm-new-application"/);assert.ok(!html.includes('data-action="usm-add"'));
 const s=createStore({storage:null});s.saveUSAgriProgram('manual',{custom:true,school:'Üniversite',program:'Tarım',country:'ABD',usState:'Texas',application:'eligible'});
 const record=mergeUSAgriPrograms(s.getState().usAgriPrograms).find(p=>p.id==='manual');assert.equal(record.country,'ABD');assert.equal(record.usState,'Texas');assert.equal(record.application,'eligible');
 assert.ok(!html.includes('<option value="Alabama"'));assert.match(html,/usm-country-suggestions/);
});
