// CV bytes stay in this browser's IndexedDB. This module never uploads them.
const DB_NAME='future-private-cv-v1';
const STORE='files';
const escapeHTML=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let databasePromise;
function database(){
 if(databasePromise)return databasePromise;
 databasePromise=new Promise((resolve,reject)=>{
  if(!globalThis.indexedDB){reject(Error('Bu tarayıcı özel dosya saklamayı desteklemiyor.'));return;}
  const request=indexedDB.open(DB_NAME,1);
  request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains(STORE))request.result.createObjectStore(STORE,{keyPath:'id'});};
  request.onsuccess=()=>resolve(request.result);
  request.onerror=()=>reject(Error('CV dosya alanı açılamadı. Tarayıcı depolama iznini kontrol et.'));
  request.onblocked=()=>reject(Error('CV dosya alanı başka sekmede açık. Diğer Future sekmesini yenile.'));
 }).catch(error=>{databasePromise=null;throw error;});
 return databasePromise;
}
export async function prepareCVFiles(files){
 if(!files?.length)throw Error('En az bir PDF veya LaTeX dosyası seç.');
 if(files.length>2)throw Error('Bir PDF ve bir LaTeX kaynağı seçebilirsin.');
 const records=[];
 for(const file of files){
  const pdf=/\.pdf$/i.test(file.name);const latex=/\.(tex|txt)$/i.test(file.name);
  if(!pdf&&!latex)throw Error('Yalnız PDF, .tex veya LaTeX içeren .txt dosyası kabul edilir.');
  if(!file.size||file.size>(pdf?10*1024*1024:512*1024))throw Error(pdf?'PDF en fazla 10 MB olabilir.':'LaTeX kaynağı en fazla 512 KB olabilir.');
  const bytes=await file.arrayBuffer();const header=new TextDecoder().decode(bytes.slice(0,8));
  let text=null;
  if(pdf&&!header.startsWith('%PDF-'))throw Error('Seçilen PDF dosyasının içeriği geçerli bir PDF başlığı taşımıyor.');
  if(latex){text=new TextDecoder('utf-8',{fatal:true}).decode(bytes);if(!/\\documentclass(?:\[[^\]]*\])?\s*\{/.test(text)||!text.includes('\\begin{document}'))throw Error('Kaynak dosyada tam bir LaTeX belgesi bulunamadı.');}
  const id=pdf?'pdf':'latex';if(records.some(r=>r.id===id))throw Error('Aynı türden yalnız bir ana dosya seç.');
  const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),x=>x.toString(16).padStart(2,'0')).join('');
  records.push({id,name:pdf?'CV.pdf':'CV.tex',originalName:file.name,type:pdf?'application/pdf':'text/x-tex',size:file.size,sha256:hash,updatedAt:new Date().toISOString(),blob:new Blob([bytes],{type:pdf?'application/pdf':'text/x-tex'}),text});
 }
 return records;
}
export async function importCVFiles(files){
 // Validate the whole selection before opening one atomic write transaction.
 const records=await prepareCVFiles(Array.from(files));const db=await database();
 await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');const store=tx.objectStore(STORE);records.forEach(r=>store.put(r));tx.oncomplete=resolve;tx.onerror=()=>reject(Error('CV kaydedilemedi. Depolama alanını kontrol et.'));tx.onabort=()=>reject(Error('CV kayıt işlemi tamamlanamadı. Önceki dosyalar korundu.'));});
 return getCVSummary();
}
export async function getCVFile(id){
 if(!['pdf','latex'].includes(id))throw Error('Bilinmeyen CV kaynağı.');
 const db=await database();return new Promise((resolve,reject)=>{const request=db.transaction(STORE,'readonly').objectStore(STORE).get(id);request.onsuccess=()=>resolve(request.result||null);request.onerror=()=>reject(Error('CV dosyası okunamadı.'));});
}
export async function getCVSummary(){
 const db=await database();const rows=await new Promise((resolve,reject)=>{const request=db.transaction(STORE,'readonly').objectStore(STORE).getAll();request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(Error('CV dosya listesi okunamadı.'));});
 return rows.map(({id,name,originalName,size,updatedAt,sha256})=>({id,name,originalName,size,updatedAt,sha256}));
}
export function downloadCVRecord(record){
 if(!record?.blob)throw Error('Önce bu CV dosyasını ekle.');
 const url=URL.createObjectURL(record.blob);const a=document.createElement('a');a.href=url;a.download=record.name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);
}
export function renderCVVault(summary=[],job=null,error=''){
 const cards=[['pdf','Ana CV · PDF','Başvurularda kullanacağın mevcut PDF.'],['latex','Düzenlenebilir kaynak · LaTeX','İlana özel sürümleri hazırlamak için ana metin ve biçim.']].map(([id,title,note])=>{
  const saved=summary.find(r=>r.id===id);
  return `<article class="cv-file"><div><span class="eyebrow">${id==='pdf'?'PDF':'LATEX'}</span><h2>${title}</h2><p>${note}</p></div>${saved?`<p class="cv-file-status">Kaydedildi · ${escapeHTML(saved.name)} · ${Math.ceil(saved.size/1024)} KB</p><p class="cv-file-date">${escapeHTML(new Date(saved.updatedAt).toLocaleString('tr-TR'))}</p><button class="button quiet" data-action="cv-download" data-cv="${id}">Dosyayı indir</button>${id==='latex'?'<details class="cv-source"><summary>LaTeX kaynağını oku</summary><textarea id="cv-source-text" class="field-textarea" rows="14" readonly aria-label="CV LaTeX kaynağı" placeholder="Kaynağı görmek için başlığı aç."></textarea></details>':''}`:'<p class="cv-file-status missing">Bu tarayıcıya henüz eklenmedi.</p>'}</article>`;
 }).join('');
 return `<section class="collection-heading"><span class="eyebrow">ÇALIŞMA ALANIM / BAŞVURU DOSYALARI</span><h1>CV dosyalarım</h1><p>Mevcut PDF’ini ve düzenlenebilir LaTeX kaynağını birlikte sakla. İlanın istediği becerilere göre hazırlayacağımız sürümlerde bu ana kaynakları kullanabiliriz.</p></section>
 ${job?`<section class="cv-job-context"><span class="eyebrow">SEÇİLEN İLAN</span><h2>${escapeHTML(job.company)} · ${escapeHTML(job.title)}</h2><p>${escapeHTML(job.summary)}</p><h3>Uyarlamada kontrol edilecekler</h3><ul>${job.requirements.map(r=>`<li>${escapeHTML(r)}</li>`).join('')}</ul><p>CV’de yalnız gerçekten sahip olduğun beceri ve katkılar öne çıkarılmalı. Bu ekran henüz ilana özel yeni bir CV üretmez.</p><a class="text-link" href="#view=route&route=career&topic=jobs&job=${escapeHTML(job.id)}">İlan ayrıntısına dön →</a></section>`:''}
 <div class="cv-private-note"><strong>Yalnız bu tarayıcıda saklanır.</strong><p>Dosyalar siteye, GitHub’a veya işverene gönderilmez. Diğer cihazda kullanmak için PDF ve LaTeX’i indirip orada içe aktar. Genel harita yedeği CV dosyalarını içermez; tarayıcı verilerini silmeden önce dosyalarını indir.</p></div>
 ${error?`<p role="alert" class="cv-error">${escapeHTML(error)}</p>`:''}<div class="cv-actions"><button class="button primary" data-action="cv-choose">PDF / LaTeX dosyalarını ekle veya güncelle</button><span>Bir PDF ve bir .tex / .txt · PDF en fazla 10 MB</span><input id="cv-files" type="file" accept=".pdf,.tex,.txt" multiple hidden></div><div class="cv-files">${cards}</div>`;
}
