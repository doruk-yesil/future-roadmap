import test from 'node:test';
import assert from 'node:assert/strict';
import {US_AGRI_MASTERS,mergeUSAgriPrograms,renderUSAgricultureMasters,filterUSAgriPrograms,usMasterFilters,usAgricultureMastersHref,createUSMasterDraft} from './us-agriculture-masters.js';
import {createStore} from './state.js';

test('state and city filters round-trip through URLs and combine with tracking status',()=>{
 const f={usState:'Texas',city:'Lubbock',application:'review'};
 const url=usAgricultureMastersHref(null,f);
 assert.deepEqual(usMasterFilters(new URLSearchParams(url.slice(1))),f);
 const records=[{usState:'Texas',city:'Lubbock',application:'review'},{usState:'Texas',city:'Kingsville',application:'review'},{usState:'Other',city:'Lubbock',application:'review'}];
 assert.deepEqual(filterUSAgriPrograms(records,f),[records[0]]);
 assert.equal(filterUSAgriPrograms(records,{...f,city:'all'}).length,2);
 assert.equal(filterUSAgriPrograms(records,{...f,application:'applied'}).length,0);
 assert.equal(usMasterFilters(new URLSearchParams()).city,'all');
});

test('verified campus is read-only and old personal state overrides do not move a program',()=>{
 const base=US_AGRI_MASTERS[0];
 const old={id:base.id,usState:'Wrong state',location:'Wrong city',city:'Wrong city',notes:'Özel not',application:'applied'};
 const merged=mergeUSAgriPrograms([old]).find(p=>p.id===base.id);
 assert.equal(merged.usState,base.usState);assert.equal(merged.location,base.location);
 assert.equal(merged.notes,'Özel not');assert.equal(merged.application,'applied');
 assert.equal(old.usState,'Wrong state');
 const draft=createUSMasterDraft(merged);
 for(const key of ['city','usState','location'])assert.ok(!Object.hasOwn(draft,key));
 const html=renderUSAgricultureMasters(null,[old],{usState:'all',city:'all',application:'all'},new Set([base.id]),{drafts:new Map([[base.id,draft]]),tabs:new Map([[base.id,'program']])});
 assert.match(html,/id="usm-filter-city"/);assert.match(html,/Eyalet \/ şehir/);
 assert.ok(!html.includes('data-usm-edit="usState"'));assert.ok(!html.includes('data-usm-draft="location"'));
 assert.ok(!html.includes('Wrong city'));assert.ok(html.includes('Özel not'));
});

test('new personal campus city survives storage and backup without changing old backups',()=>{
 const s=createStore({storage:null});s.saveUSAgriProgram('custom-city',{custom:true,school:'Test',program:'Master',usState:'Texas',city:'Austin'});
 const other=createStore({storage:null});other.importBackup(s.exportBackup());
 assert.equal(mergeUSAgriPrograms(other.getState().usAgriPrograms).find(p=>p.id==='custom-city').city,'Austin');
 s.saveUSAgriProgram('old-custom',{custom:true,school:'Old',program:'MS',location:'Los Angeles, California',usState:'California'});
 assert.equal(mergeUSAgriPrograms(s.getState().usAgriPrograms).find(p=>p.id==='old-custom').city,'Los Angeles');
});

test('narrow catalog contains evidence-linked ranch or precision routes and state-scoped cities',()=>{
 for(const p of US_AGRI_MASTERS){
  assert.ok(p.city&&p.usState&&p.fitReason);
  assert.ok(['ranch','precision','both'].includes(p.fit));
  assert.ok(p.sources.length>0);
 }
 const html=renderUSAgricultureMasters(null,[],{usState:'Texas',city:'all',application:'all'});
 const cityOptions=html.match(/id="usm-filter-city"[\s\S]*?<\/select>/)?.[0];
 assert.ok(cityOptions?.includes('Lubbock'));assert.ok(cityOptions.includes('Kingsville'));
 assert.ok(!cityOptions.includes('Berkeley'));assert.ok(!cityOptions.includes('Lincoln'));
 const retired=['cornell-animal-mps','delaware-applied-animal-ms','kstate-agribusiness','csu-animal-beef','cpp-integrated-animal'];
 assert.ok(!US_AGRI_MASTERS.some(p=>retired.includes(p.id)));
});
