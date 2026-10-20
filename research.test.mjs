import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createNavigation} from './navigation.js';
import {applyResearch,getActionSteps,searchableChoices} from './research.js';
import {searchNodes} from './graph.js';
const data=JSON.parse(readFileSync(new URL('./data.json',import.meta.url),'utf8'));
const research=JSON.parse(readFileSync(new URL('./research.json',import.meta.url),'utf8'));
test('published research has dated read summaries, honest unread entries and valid source references',()=>{
 const sources=new Map(research.sources.map(s=>[s.id,s]));
 assert.equal(sources.size,research.sources.length);
 assert.ok(research.sources.filter(s=>s.status==='read').length>=25);
 for(const s of sources.values()){
  assert.ok(['http:','https:'].includes(new URL(s.url).protocol));
  assert.ok(['read','unread'].includes(s.status));
  assert.match(s.checkedAt,/^\d{4}-\d{2}-\d{2}$/);
  if(s.status==='read')assert.ok(s.summary?.length>30, s.id);
  else assert.ok(!s.summary,s.id+': unread source must not have a read summary');
 }
 for(const c of Object.values(research.choices))for(const guide of [c,...c.variants||[]]){
  assert.ok(guide.steps.length>=2&&guide.steps.length<=3);
  for(const step of guide.steps){assert.ok(step.title&&step.action&&step.output);for(const id of step.sourceIds||[])assert.ok(sources.has(id),id);}
 }
});
test('all trade options receive specific steps; beauty branches stay distinct and searchable',()=>{
 const routes=applyResearch(createNavigation(data),research);
 const trade=routes.find(r=>r.id==='china');
 for(const choice of trade.topics.flatMap(t=>t.choices))assert.equal(getActionSteps(choice).length,3,choice.id);
 const beauty=trade.topics[0].choices.find(c=>c.id==='beauty');
 assert.equal(beauty.variants.length,4);
 assert.equal(new Set(beauty.variants.map(v=>v.id)).size,4);
 for(const v of beauty.variants)assert.ok(v.steps.some(s=>s.sources.length));
 assert.ok(searchNodes(searchableChoices(routes),'güzellik').some(c=>c.id==='beauty'));
});
test('research enrichment leaves original node IDs, edges and source data untouched',()=>{
 const before=JSON.stringify(data);applyResearch(createNavigation(data),research);assert.equal(JSON.stringify(data),before);
 const fallback=getActionSteps({firstStep:'Bir küçük deneme seç.',summary:'Örnek'});
 assert.equal(fallback.length,2);assert.ok(fallback.every(s=>s.sources.length===0));
});
