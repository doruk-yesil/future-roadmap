import test from 'node:test';
import assert from 'node:assert/strict';
import { createStore, STORAGE_KEY } from './state.js';

function memoryStorage() {
  const data = new Map();
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
}
const validEdit = () => ({ title: 'Çin’den ürün ticareti', body: 'İlk adım: tedarikçi araştırması. <script>saklı metin</script>', requirements: ['Ölçülebilir pilot', 'GTİP doğrulaması'], sources: [{ label: 'Resmî kaynak', url: 'https://example.com/çin' }] });

test('kişisel notlar, Türkçe düzenlemeler ve favoriler yenilemede korunur; kopyalar durumu değiştirmez', () => {
  const storage = memoryStorage();
  const store = createStore({ storage });
  store.updateNode('cn_a', { status: 'researching', notes: 'İberya’dan ayrı, Türkiye pazarı.' });
  store.toggleFavorite('cn_a');
  store.saveEdit('cn_a', validEdit());
  const copy = store.getState();
  copy.nodes.cn_a.notes = 'değiştir';
  const reloaded = createStore({ storage });
  assert.equal(reloaded.getState().nodes.cn_a.notes, 'İberya’dan ayrı, Türkiye pazarı.');
  assert.equal(reloaded.getState().nodes.cn_a.favorite, true);
  assert.deepEqual(reloaded.getState().nodes.cn_a.edit, validEdit());
  assert.ok(storage.getItem(STORAGE_KEY));
});

test('yedek geri yükleme atomiktir, yalnız bilinen kartları kabul eder ve mevcut durumu değiştirir', () => {
  const store = createStore({ storage: memoryStorage() });
  store.updateNode('old', { notes: 'korunacak' });
  const before = store.getState();
  const backup = store.exportBackup();
  backup.state.nodes.unknown = { status: 'chosen', favorite: true, notes: '' };
  assert.throws(() => store.importBackup(backup, ['old']), /bulunmayan kart/);
  assert.deepEqual(store.getState(), before);
  const other = createStore({ storage: memoryStorage() });
  other.updateNode('new', { notes: 'Yeni Türkçe not' });
  store.importBackup(JSON.stringify(other.exportBackup()), new Set(['new']));
  assert.equal(store.getState().nodes.old, undefined);
  assert.equal(store.getState().nodes.new.notes, 'Yeni Türkçe not');
});

test('bozuk şema, prototip alanları, tehlikeli adresler ve büyük yedekler reddedilir', () => {
  const store = createStore({ storage: memoryStorage() });
  const before = store.getState();
  assert.throws(() => store.importBackup({ version: 1 }), /yedeği değil/);
  assert.throws(() => store.importBackup('{"__proto__":{"polluted":true}}'), /güvenli olmayan/);
  assert.throws(() => store.importBackup({ ...store.exportBackup(), state: { ...before, nodes: Object.create({ polluted: true }) } }), /geçerli bir nesne/);
  for (const url of ['javascript:alert(1)', 'data:text/html,hello', 'file:///tmp/secret', 'https://user:password@example.com']) {
    const unsafe = validEdit();
    unsafe.sources[0].url = url;
    assert.throws(() => store.saveEdit('cn_a', unsafe), /HTTP veya HTTPS/);
  }
  assert.throws(() => store.importBackup(' '.repeat(10 * 1024 * 1024 + 1)), /10 MB/);
  assert.deepEqual(store.getState(), before);
  assert.equal({}.polluted, undefined);
});

test('görev akışı, abonelikten çıkma ve yedekleme çalışır', () => {
  const store = createStore({ storage: memoryStorage() });
  let notices = 0;
  const unsubscribe = store.subscribe(() => { notices += 1; });
  const task = store.addTask('  Numune teklifini al  ', 'cn_a');
  assert.equal(task.text, 'Numune teklifini al');
  store.toggleTask(task.id);
  assert.equal(store.getState().tasks[0].done, true);
  const restored = createStore({ storage: memoryStorage() });
  restored.importBackup(store.exportBackup(), ['cn_a']);
  assert.equal(restored.getState().tasks[0].nodeId, 'cn_a');
  unsubscribe();
  store.removeTask(task.id);
  assert.equal(notices, 2);
  assert.equal(store.getState().tasks.length, 0);
  assert.throws(() => store.toggleTask(task.id), /bulunamadı/);
});

test('kayıt engeli ve bozuk önceki kayıt görünür hata bildirir, oturumda çalışma devam eder', () => {
  const errors = [];
  const storage = { getItem: () => '{broken', setItem: () => { throw new Error('QuotaExceededError'); } };
  const store = createStore({ storage, onError: error => errors.push(error.message) });
  assert.equal(errors.length, 1);
  store.updateNode('cn_a', { notes: 'Kaybolmamalı' });
  assert.equal(errors.length, 2);
  assert.match(errors[1], /Yedek indirin/);
  assert.equal(store.exportBackup().state.nodes.cn_a.notes, 'Kaybolmamalı');
});

test('sadece izin verilen kart alanları ve durumlar kabul edilir; HTML metin olarak saklanır', () => {
  const store = createStore({ storage: memoryStorage() });
  assert.throws(() => store.updateNode('cn_a', { admin: true }), /tanınmayan alan/);
  assert.throws(() => store.updateNode('cn_a', { status: 'unknown' }), /Geçersiz kart durumu/);
  assert.throws(() => store.updateNode('__proto__', { notes: 'x' }), /geçersiz değer/);
  store.saveEdit('cn_a', validEdit());
  assert.match(store.getState().nodes.cn_a.edit.body, /<script>/);
});
