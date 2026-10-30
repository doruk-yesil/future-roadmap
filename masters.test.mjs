import test from 'node:test';
import assert from 'node:assert/strict';
import {MASTER_DATA,masterFilters,filterMasters,mastersHref,renderMasters} from './masters.js';
test('desktop master import retains every actual program and public admissions fields without private ranking',()=>{
 assert.equal(MASTER_DATA.programs.length,80);assert.equal(new Set(MASTER_DATA.programs.map(p=>p.id)).size,80);assert.equal(new Set(MASTER_DATA.programs.map(p=>p.country)).size,10);
 assert.equal(MASTER_DATA.sourceCheckedAt,'2026-09-27');
 for(const p of MASTER_DATA.programs){assert.ok(p.school&&p.program&&p.content&&p.gpa&&p.references&&p.conditions);assert.equal(new URL(p.url).protocol,'https:');assert.equal(new URL(p.admissionsUrl).protocol,'https:');assert.ok(!('score' in p));}
 assert.ok(!JSON.stringify(MASTER_DATA).includes('2.98'));assert.ok(!JSON.stringify(MASTER_DATA).includes('Sabancı'));
});
test('master country, content and online filters combine and preserve URL values',()=>{
 const f={query:'cloud',country:'ABD',fit:'Tam',mode:'all'};const rows=filterMasters(MASTER_DATA.programs,f);assert.ok(rows.length>0);assert.ok(rows.every(p=>p.country==='ABD'&&p.fit==='Tam'));
 assert.deepEqual(masterFilters(new URLSearchParams(mastersHref(f).slice(1))),f);
 assert.ok(filterMasters(MASTER_DATA.programs,{...f,query:'nonexistentprogramzz'}).length===0);
 assert.equal(filterMasters(MASTER_DATA.programs,{query:'',country:'all',fit:'all',mode:'Online'}).length,7);
});
test('master rows expose dated original evidence and keep filter input markup escaped',()=>{
 const html=renderMasters(new URLSearchParams());assert.equal((html.match(/class="master-row"/g)||[]).length,80);assert.match(html,/Kaydırılabilir master programları/);assert.match(html,/27 Eylül 2026/);assert.match(html,/kabul ihtimali değildir/);
 const escaped=renderMasters(new URLSearchParams({mq:'"><img src=x>'}));assert.ok(!escaped.includes('<img'));assert.ok(escaped.includes('&lt;img'));
});
