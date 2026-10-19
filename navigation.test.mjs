import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createNavigation,contextForNode,matchesCountry,summarize} from './navigation.js';
const data=JSON.parse(readFileSync(new URL('./data.json',import.meta.url),'utf8'));
const routes=createNavigation(data);
test('four purpose routes retain access to every original card and keep all references valid',()=>{
 assert.deepEqual(routes.filter(r=>!r.secondary).map(r=>r.id),['iberya','china','career','agriculture']);
 const valid=new Set(data.nodes.map(n=>n.id));const choices=routes.flatMap(r=>r.topics.flatMap(t=>t.choices));
 assert.equal(new Set(choices.map(c=>c.id)).size,choices.length);
 for(const c of choices)for(const id of [...c.nodeIds,...c.extraNodeIds||[]])assert.ok(valid.has(id),id);
 for(const n of data.nodes)assert.ok(contextForNode(routes,n.id),n.id);
 for(const r of routes){assert.ok(r.topics.length<=4);for(const t of r.topics)assert.ok(t.choices.length<=4);}
});
test('cyber and CS masters are inside technology; agriculture experience and study stay independent',()=>{
 assert.equal(contextForNode(routes,'cyber_soc').route.id,'career');
 assert.equal(contextForNode(routes,'ms_depaul_cs').route.id,'career');
 assert.equal(contextForNode(routes,'us_purdue').route.id,'agriculture');
 const ag=routes.find(r=>r.id==='agriculture');
 for(const id of ['experience','agri-study','agri-pilot'])assert.ok(ag.topics.some(t=>t.id===id));
 const exp=ag.topics.find(t=>t.id==='experience');
 for(const country of ['tr','eu','ae','us'])assert.ok(exp.choices.some(c=>matchesCountry(c,country)));
 assert.equal(matchesCountry(exp.choices.find(c=>c.id==='experience-tr'),'us'),false);
 assert.equal(matchesCountry(exp.choices.find(c=>c.id==='experience-us'),'all'),true);
});
test('shared sources preserve the selected route and summaries remain short',()=>{
 assert.equal(contextForNode(routes,'uae_iot','career').route.id,'career');
 assert.equal(contextForNode(routes,'uae_iot','agriculture').route.id,'agriculture');
 const text='Ne yapılacak: '+('Uzun bir araştırma metni burada. '.repeat(30));
 assert.ok(summarize(text).length<=140);assert.doesNotMatch(summarize(text),/Ne yapılacak/);
 for(const n of data.nodes)assert.ok(summarize(n.body).length<=140);
});
