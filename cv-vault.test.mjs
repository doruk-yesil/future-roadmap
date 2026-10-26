import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareCVFiles,renderCVVault} from './cv-vault.js';
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
 assert.equal(html.includes('\\documentclass'),false);assert.match(html,/Genel harita yedeği CV dosyalarını içermez/);
 assert.equal((html.match(/henüz eklenmedi/g)||[]).length,2);
});
