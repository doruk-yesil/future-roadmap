import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PRODUCT_CATEGORIES,productHref,renderProductCatalog,renderProductDetail,renderProductSuppliers,searchProducts} from './products.js';
const products=JSON.parse(readFileSync(new URL('./products-data.json',import.meta.url),'utf8')).products;
test('each product has concrete options and multiple dated readable supplier channels',()=>{
 assert.equal(products.length,14);assert.equal(new Set(products.map(p=>p.id)).size,14);
 assert.equal(new Set(products.map(p=>p.category)).size,5);
 for(const p of products){assert.ok(PRODUCT_CATEGORIES.some(c=>c.id===p.category));assert.ok(p.options.length>=2);assert.equal(p.steps.length,3);assert.ok(p.suppliers.filter(s=>s.status==='read').length>=3);for(const s of p.suppliers){assert.equal(new URL(s.url).protocol,'https:');assert.ok(s.type&&s.summary&&s.name&&s.checkedAt);}}
 assert.equal(products.flatMap(p=>p.suppliers).filter(s=>s.status==='read').length,55);
});
test('product discovery uses fixed expandable categories and routes the chosen product to supply',()=>{
 const p=products[0];const catalog=renderProductCatalog(products);assert.equal((catalog.match(/class="product-category"/g)||[]).length,5);assert.ok(!catalog.includes('<select'));assert.ok(!catalog.includes('country-chip'));
 const expanded=renderProductCatalog(products,new Set(['beauty']));assert.match(expanded,/data-product-category="beauty" open/);
 const detail=renderProductDetail(p);assert.ok(detail.includes('Ürün seçenekleri'));assert.ok(detail.includes('Aşamalar'));assert.ok(!detail.includes('mantıklı aşama'));assert.ok(!detail.includes('option-tags'));assert.ok(!detail.includes('href="https://'));assert.ok(detail.includes(productHref(p.id,true)));
 for(const o of p.options)assert.ok(detail.includes(o.name));
 const params=new URLSearchParams(productHref(p.id,true).slice(1));assert.equal(params.get('topic'),'supply');assert.equal(params.get('product'),p.id);
});
test('supplier page scopes links to one product, separates unread pages and escapes source markup',()=>{
 const p=products.find(p=>p.id==='salon-towels');const html=renderProductSuppliers(p);for(const s of p.suppliers)assert.ok(html.includes(s.url));assert.ok(!html.includes('Clementoni'));assert.ok(html.includes('Üretici'));assert.ok(html.includes('Perakende'));
 const unsafe={...p,title:'<img src=x>',options:[{name:'<script>bad</script>',description:'bad',url:'javascript:alert(1)'}],suppliers:[{name:'<script>bad</script>',url:'javascript:alert(1)',type:'Üretici',summary:'<img>',status:'read',checkedAt:'2026-10-27'}]};
 const escaped=renderProductSuppliers(unsafe);assert.ok(!escaped.includes('href="javascript:'));assert.ok(!escaped.includes('<img'));assert.ok(!escaped.includes('<script>'));assert.ok(escaped.includes('Kontrol edilemeyen bağlantılar'));assert.ok(!escaped.includes('Sayfa okundu'));
});
test('model and supplier names are discoverable in the global product search',()=>{
 assert.ok(searchProducts(products,'MOREMO').some(p=>p.id==='korean-haircare'));assert.ok(searchProducts(products,'TSC').some(p=>p.id==='label-printer'));assert.equal(searchProducts(products,'').length,0);assert.equal(searchProducts(products,'definitelynotaproduct').length,0);
});
