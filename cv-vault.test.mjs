import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareCVFiles,prepareAcademicRecord,renderCVVault} from './cv-vault.js';
test('CV source import checks PDF bytes, complete LaTeX, sizes and duplicate types before storage',async()=>{
 const pdf=new File(['%PDF-1.4\nfixture'], 'source.pdf',{type:'application/pdf'});
 const tex=new File(['\\documentclass{article}\n\\begin{document}Example\\end{document}'],'source.tex');
 const rows=await prepareCVFiles([pdf,tex]);assert.deepEqual(rows.map(r=>r.id),['pdf','latex']);
 assert.equal(rows[1].name,'CV.tex');assert.match(rows[0].sha256,/^[0-9a-f]{64}$/);
 assert.equal(await rows[0].blob.text(),await pdf.text());assert.equal(rows[1].text,await tex.text());
 await assert.rejects(prepareCVFiles([new File(['not pdf'],'bad.pdf')]),/PDF başlığı/);
 await assert.rejects(prepareCVFiles([pdf,new File(['plain text'],'bad.tex')]),/LaTeX/);
 await assert.rejects(prepareCVFiles([tex,tex]),/Aynı türden/);
 await assert.rejects(prepareCVFiles([new File(['binary'],'x.exe')]),/Yalnız/);
});
test('public CV screen contains no source file bytes and states device-local scope',()=>{
 const html=renderCVVault();assert.match(html,/Yalnız bu tarayıcıda/);assert.match(html,/GitHub’a veya işverene gönderilmez/);
 assert.equal(html.includes('\\documentclass'),false);assert.match(html,/Genel harita yedeği bu dosyaları içermez/);
 assert.equal((html.match(/henüz eklenmedi/g)||[]).length,3);assert.match(html,/<h1>Ma files<\/h1>/);
});

test('academic PDF has an independent slot and preserves the original filename and bytes',async()=>{
 const file=new File(['%PDF-1.4\nacademic fixture'],'Academic Records Summary.pdf',{type:'application/pdf'});
 const academic=await prepareAcademicRecord(file),[cv]=await prepareCVFiles([file]);
 assert.equal(academic.id,'academic-records');assert.equal(cv.id,'pdf');assert.equal(academic.name,file.name);
 assert.equal(academic.sha256,cv.sha256);assert.equal(await academic.blob.text(),await file.text());
 await assert.rejects(prepareAcademicRecord(new File(['plain'],'bad.pdf')),/PDF başlığı/);
 await assert.rejects(prepareAcademicRecord(new File(['\\documentclass{article}\\begin{document}'],'a.tex')),/Transkript/);
 const html=renderCVVault([academic,cv]);assert.match(html,/Kaydedildi · Academic Records Summary.pdf/);
 assert.match(html,/data-cv="academic-records"/);assert.match(html,/data-action="academic-choose"/);
});
