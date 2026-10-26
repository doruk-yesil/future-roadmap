import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {filterJobs,jobFiltersFromParams,jobsHref,renderJobsBoard} from './jobs.js';
const data=JSON.parse(readFileSync(new URL('./jobs-data.json',import.meta.url),'utf8'));
const source=JSON.parse(readFileSync(new URL('./data.json',import.meta.url),'utf8'));
const records=data.records;
const filters=overrides=>({...jobFiltersFromParams(new URLSearchParams()),...overrides});

test('legacy company channels and actual job records remain distinct with provenance',()=>{
 const companies=source.nodes.filter(n=>n.kind==='company');
 assert.equal(companies.length,84);assert.equal(records.filter(r=>r.kind==='channel').length,84);
 for(const c of companies)assert.ok(records.find(r=>r.sourceNodeId===c.id&&r.kind==='channel'));
 assert.equal(records.filter(r=>r.status==='open').length,5);
 const old=records.find(r=>r.id==='career_job_dream_devops');assert.equal(old.status,'unverified');
 assert.equal(filterJobs(records,filters({type:'open'})).some(r=>r.id===old.id),false);
 assert.equal(new Set(records.map(r=>r.id)).size,records.length);
 for(const r of records){assert.ok(r.sources.length&&r.checkedAt);assert.ok(r.roles.length);for(const s of r.sources)assert.equal(new URL(s.url).protocol,'https:');}
});
test('country is a job location, remote is independent, filters combine and survive links',()=>{
 const remote=filterJobs(records,filters({type:'open',region:'tr',model:'remote',role:'cyber'}));
 assert.equal(remote.length,1);assert.equal(remote[0].company,'TervaX');
 assert.equal(filterJobs(records,filters({region:'us'})).length,0);
 assert.ok(records.filter(r=>r.kind==='channel'&&r.region==='global').every(r=>r.countries.length===0&&r.workModel==='unknown'));
 const f=filters({query:'Go',role:'backend',model:'onsite',type:'open',region:'tr',group:'company'});
 assert.ok(filterJobs(records,f).some(r=>r.company==='Good Job Games'));
 assert.deepEqual(jobFiltersFromParams(new URLSearchParams(jobsHref(f,'career_job_goodjob').slice(1))),f);
 const fixture={...remote[0],id:'test-eu',region:'eu',countries:['DE'],workModel:'hybrid'};
 assert.equal(filterJobs([fixture],filters({region:'eu',country:'DE',model:'hybrid'})).length,1);
 assert.equal(filterJobs([fixture],filters({country:'TR'})).length,0);
});
test('list keeps closed-link evidence honest and does not render imported markup',()=>{
 const html=renderJobsBoard(records,filters());assert.match(html,/5 ilan sayfası açık/);assert.match(html,/84 şirket başvuru kanalı/);
 assert.match(html,/Doğrulanamayan eski kayıtlar/);
 assert.match(html,/Şirket merkezi işin ülkesi sayılmaz/);
 const injected=renderJobsBoard([{...records[0],company:'<img src=x onerror=alert(1)>'}],filters());
 assert.equal(injected.includes('<img'),false);assert.ok(injected.includes('&lt;img'));
});
