import test from 'node:test';
import assert from 'node:assert/strict';
import {filterJobs,renderJobsBoard,jobFiltersFromParams,jobsHref} from './jobs.js';
import {createStore} from './state.js';
const memory=()=>{const m=new Map();return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v)};};
test('manual jobs persist edits and backup restore, with old backups supported',()=>{
 const storage=memory(),s=createStore({storage});const j=s.addJob('Zeta','Developer');
 s.updateJob(j.id,{country:'DE',workModel:'hybrid',application:'test_2'});
 const next=createStore({storage});assert.equal(next.getState().jobs[0].application,'test_2');
 const other=createStore({storage:memory()});other.importBackup(s.exportBackup());assert.deepEqual(other.getState().jobs,s.getState().jobs);
 const old=s.exportBackup();delete old.state.jobs;other.importBackup(old);assert.deepEqual(other.getState().jobs,[]);
 s.removeJob(j.id);assert.equal(s.getState().jobs.length,0);s.restoreJob(next.getState().jobs[0]);assert.equal(s.getState().jobs.length,1);
 assert.throws(()=>s.addJob(' ','Developer'));assert.throws(()=>s.updateJob(j.id,{application:'bogus'}));
});
test('country, model and application filters combine and results are always alphabetical',()=>{
 const s=createStore({storage:memory()});const z=s.addJob('Zeta','Dev');const a=s.addJob('Alfa','Tester');s.updateJob(a.id,{country:'US',workModel:'remote',application:'interview_1'});
 const all=jobFiltersFromParams(new URLSearchParams());assert.deepEqual(filterJobs(s.getState().jobs,all).map(j=>j.company),['Alfa','Zeta']);
 const f={country:'US',model:'remote',application:'interview_1'};assert.equal(filterJobs(s.getState().jobs,f)[0].id,a.id);assert.deepEqual(jobFiltersFromParams(new URLSearchParams(jobsHref(f).split('?')[0].slice(1))),f);
 assert.equal(filterJobs(s.getState().jobs,{...f,application:'applied'}).length,0);
});
test('board exposes only three filters, inline dropdowns, add form and escaped personal data',()=>{
 const s=createStore({storage:memory()});s.addJob('<script>','<img>');const html=renderJobsBoard(s.getState().jobs,jobFiltersFromParams(new URLSearchParams()));
 assert.equal((html.match(/data-job-filter /g)||[]).length,3);assert.equal((html.match(/data-job-edit=/g)||[]).length,3);assert.match(html,/job-add-form/);assert.match(html,/Kaydırılabilir/);assert.ok(!html.includes('<script>'));assert.match(html,/&lt;script&gt;/);assert.ok(!html.includes('jobs-role'));assert.ok(!html.includes('Doğrulanamayan'));
});
