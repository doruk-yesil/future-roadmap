import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {filterJobs,jobFiltersFromParams,jobsHref,renderJobsBoard,renderJobDetail} from './jobs.js';
const data=JSON.parse(readFileSync(new URL('./jobs-data.json',import.meta.url),'utf8'));
const source=JSON.parse(readFileSync(new URL('./data.json',import.meta.url),'utf8'));
const records=data.records;
const filters=overrides=>({...jobFiltersFromParams(new URLSearchParams()),...overrides});

test('all original records retain a visited audit; only evidenced graduate vacancies are admitted',()=>{
 const companies=source.nodes.filter(n=>n.kind==='company');
 assert.equal(companies.length,84);
 for(const c of companies)assert.ok(records.find(r=>r.sourceNodeId===c.id));
 assert.equal(data.auditCoverage.checkedOriginalRecords,90);
 assert.equal(data.auditCoverage.originalRecords,90);
 const verified=records.filter(r=>r.status==='open');assert.equal(verified.length,7);
 assert.equal(records.filter(r=>r.status==='unverified').length,86);
 for(const r of verified){assert.equal(r.kind,'vacancy');assert.equal(r.verification.newGradConfirmed,true);assert.equal(r.verification.modelConfirmed,true);assert.notEqual(r.workModel,'unknown');assert.ok(r.verification.newGradEvidence&&r.verification.modelEvidence);}
 for(const r of records){assert.ok(r.auditVisitedUrls.length);assert.ok(r.checkedAt);assert.ok(r.sources.length);for(const s of r.sources)assert.equal(new URL(s.url).protocol,'https:');}
 for(const id of ['career_job_tervax','career_job_dream_devops','company_052','company_053'])assert.equal(records.find(r=>r.id===id).status,'unverified');
 assert.equal(new Set(records.map(r=>r.id)).size,records.length);
});
test('default excludes unverified records and country, role and work model filters combine',()=>{
 assert.equal(filterJobs(records,filters()).length,7);
 const remote=filterJobs(records,filters({model:'remote'}));assert.equal(remote.length,1);assert.equal(remote[0].company,'Canonical / Ubuntu');
 assert.equal(filterJobs(records,filters({region:'us',model:'hybrid'}))[0].id,'hpe_1213624');
 assert.equal(filterJobs(records,filters({country:'SG',model:'hybrid'}))[0].id,'sap_447781');
 assert.equal(filterJobs(records,filters({type:'unverified',role:'cyber',model:'remote'}))[0].id,'career_job_tervax');
 const f=filters({query:'Go',role:'backend',model:'onsite',region:'tr',group:'company'});
 assert.ok(filterJobs(records,f).some(r=>r.company==='Good Job Games'));
 assert.deepEqual(jobFiltersFromParams(new URLSearchParams(jobsHref(f,'career_job_goodjob').slice(1))),f);
 const amazon=records.find(r=>r.id==='company_052');assert.equal(amazon.region,'eu');assert.equal(amazon.workModel,'unknown');assert.equal(amazon.verification.newGradConfirmed,true);
});
test('render exposes bounded scroll area, unknown reasons and evidence without allowing markup',()=>{
 const html=renderJobsBoard(records,filters());assert.match(html,/7 doğrulanmış yeni mezun ilanı/);assert.match(html,/86 doğrulanamayan kayıt/);
 assert.match(html,/Kaydırılabilir iş ilanları listesi/);assert.match(html,/tabindex="0"/);assert.match(html,/Doğrulanamayanlar/);
 assert.equal(html.includes('Junior Penetration Test Engineer'),false);
 const old=renderJobDetail(records.find(r=>r.id==='career_job_tervax'),filters());assert.match(old,/Bu grupta olma nedeni/);assert.match(old,/Junior yazıyor/);
 const malicious={...records.find(r=>r.status==='open'),company:'<img src=x onerror=alert(1)>',auditReason:'<script>bad</script>',status:'unverified'};
 const injected=renderJobsBoard([malicious],filters({type:'unverified'}));assert.equal(injected.includes('<img'),false);assert.equal(injected.includes('<script>'),false);assert.ok(injected.includes('&lt;img'));
});
