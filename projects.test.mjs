import test from 'node:test';
import assert from 'node:assert/strict';
import {ACADEMIC_PROJECTS,renderProjects,searchProjects} from './academic-projects.js';

test('academic archive preserves evidence boundaries and complete useful sections',()=>{
 assert.equal(ACADEMIC_PROJECTS.length,9);
 assert.equal(new Set(ACADEMIC_PROJECTS.map(p=>p.id)).size,9);
 assert.equal(ACADEMIC_PROJECTS.filter(p=>p.evidence==='Yalnız portfolyo kaydı').length,2);
 for(const p of ACADEMIC_PROJECTS){
  assert.ok(p.purpose&&p.role&&p.cv&&p.sources.length,p.id);
  for(const key of ['tech','approach','results','interview','next'])assert.ok(p[key].length,p.id+': '+key);
  for(const s of p.sources){assert.equal(new URL(s.url).protocol,'https:');assert.ok(s.summary.length>20);}
 }
 const clarity=ACADEMIC_PROJECTS.find(p=>p.id==='clarity');
 assert.match(clarity.results.join(' '),/Weighted F1 = 0,7389/);
 assert.match(clarity.results.join(' '),/macro F1 yaklaşık 0,65/);
 assert.match(ACADEMIC_PROJECTS.find(p=>p.id==='forest-fire').results.join(' '),/silver standard/);
 assert.match(ACADEMIC_PROJECTS.find(p=>p.id==='2048-agent').results.join(' '),/doğrulanabilir sabit bir eğitim sonucu/);
});

test('project links open a single accordion and global search finds methods',()=>{
 const html=renderProjects('clarity');
 assert.equal((html.match(/class="academic-project"/g)||[]).length,9);
 assert.equal((html.match(/name="academic-project" open/g)||[]).length,1);
 assert.match(html,/id="project-clarity" name="academic-project" open/);
 assert.equal((renderProjects().match(/name="academic-project" open/g)||[]).length,0);
 assert.ok(searchProjects('Keycloak').some(p=>p.id==='bibliocast'));
 assert.ok(searchProjects('REINFORCE').some(p=>p.id==='2048-agent'));
 assert.ok(searchProjects('silver standard').some(p=>p.id==='forest-fire'));
 assert.deepEqual(searchProjects(''),[]);
 assert.equal(renderProjects('"><script>').includes('<script>'),false);
});
