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
 const f={query:'',country:'Türkiye',kind:'all'};const rows=filterAgri(AGRI_DATA.records,'experience',f);assert.ok(rows.length);assert.ok(rows.every(r=>r.track==='experience'&&r.country==='Türkiye'));assert.deepEqual(agriFilters(new URLSearchParams(agriHref('experience',f).slice(1))),f);
 const html=renderAgriculture('experience');assert.ok(html.includes('Kaydırılabilir tarım seçenekleri'));assert.ok(html.includes('Gönüllü'));assert.ok(html.includes('Güncel durum:'));
 const unsafe=renderAgriculture('agri-study',new URLSearchParams({aq:'"><img src=x>'}));assert.ok(!unsafe.includes('<img'));assert.ok(unsafe.includes('&lt;img'));
});
