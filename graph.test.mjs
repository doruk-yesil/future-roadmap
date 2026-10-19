import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { layoutGraph, searchNodes, normalizeSearch } from './graph.js';

const data = JSON.parse(readFileSync(new URL('./data.json', import.meta.url), 'utf8'));
const nodeMap = new Map(data.nodes.map(node => [node.id, node]));
const key = edge => JSON.stringify([edge.source, edge.target, edge.type, edge.label || '']);
function overlaps(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
function groupLayout(group, expanded = []) {
  return layoutGraph({ root: { title: group.title }, branches: group.modules, expanded: new Set(expanded), nodes: nodeMap, edges: data.edges });
}

test('tüm gerçek gruplar kapalı ve tamamen açıkken kartlar çakışmaz; tuval tüm kartları kapsar', () => {
  for (const group of data.groups) {
    for (const expanded of [[], group.modules.map(module => module.id)]) {
      const layout = groupLayout(group, expanded);
      assert.equal(new Set(layout.items.map(item => item.key)).size, layout.items.length, `${group.id}: yinelenen kart`);
      for (const item of layout.items) {
        assert.ok(item.x >= 0 && item.y >= 0 && item.x + item.w <= layout.width && item.y + item.h <= layout.height, `${group.id}: ${item.key} tuval dışına taşıyor`);
        for (const other of layout.items) {
          if (item.key !== other.key) assert.equal(overlaps(item, other), false, `${group.id}: ${item.key} / ${other.key} çakışıyor`);
        }
      }
    }
  }
});

test('tek dal açılınca yalnız kendi çocukları görünür; dalları kapatmak kanonik bağlantı üretmez', () => {
  for (const group of data.groups) {
    const closed = groupLayout(group);
    assert.equal(closed.items.filter(item => item.kind === 'node').length, 0);
    assert.equal(closed.links.filter(link => link.canonical).length, 0);
    for (const module of group.modules) {
      const opened = groupLayout(group, [module.id]);
      assert.deepEqual(opened.items.filter(item => item.kind === 'node').map(item => item.id), module.nodeIds);
      assert.equal(opened.items.find(item => item.key === module.id).open, module.nodeIds.length > 0);
    }
  }
});

test('çizilen gerçek ilişkiler kaynak verisinin yönünü, türünü ve etiketini aynen korur', () => {
  for (const group of data.groups) {
    const layout = groupLayout(group, group.modules.map(module => module.id));
    const visible = new Set(layout.items.filter(item => item.kind === 'node').map(item => item.id));
    const expected = data.edges.filter(edge => visible.has(edge.source) && visible.has(edge.target));
    assert.deepEqual(layout.links.filter(link => link.canonical).map(key), expected.map(key), `${group.id}: ilişki kaybı veya uydurma ilişki`);
    const itemKeys = new Set(layout.items.map(item => item.key));
    for (const link of layout.links) {
      assert.ok(itemKeys.has(link.source) && itemKeys.has(link.target));
      assert.match(link.path, /^M/);
      assert.equal(/undefined|NaN/.test(link.path), false);
      if (!link.canonical) assert.ok(['navigation', 'membership'].includes(link.type));
    }
  }
});

test('geri dönüş yönü ve seçilen karta bağlı kenar vurgusu korunur', () => {
  const nodes = new Map([{ id: 'a', title: 'Başla' }, { id: 'b', title: 'Deneme' }].map(node => [node.id, node]));
  const layout = layoutGraph({ root: { title: 'Yol' }, branches: [{ id: 'module', nodeIds: ['a', 'b'] }], expanded: new Set(['module']), nodes, selected: 'a', edges: [{ source: 'a', target: 'b', type: 'path' }, { source: 'b', target: 'a', type: 'feedback' }] });
  const feedback = layout.links.find(link => link.canonical && link.type === 'feedback');
  assert.equal(feedback.source, 'b');
  assert.equal(feedback.target, 'a');
  assert.equal(feedback.highlight, true);
  assert.ok(layout.links.filter(link => link.canonical).every(link => link.highlight));
});

test('Türkçe arama noktalı/noktasız I, aksan ve çoklu kelimeleri doğru eşleştirir', () => {
  assert.equal(normalizeSearch('İBERYA İTHALAT ÇİN ŞİRKETİ'), 'iberya ithalat cin sirketi');
  assert.equal(normalizeSearch('ışık'), 'isik');
  const nodes = [
    { id: 'body', title: 'Diğer yol', body: 'İberya için tedarik', requirements: ['İthalat koşulu'] },
    { id: 'title', title: 'İberya İthalat', body: 'Pijama', requirements: [] },
    { id: 'miss', title: 'İberya', body: 'Yazılım', requirements: [] },
  ];
  assert.deepEqual(searchNodes(nodes, 'IBERYA ithalat').map(node => node.id), ['title', 'body']);
  assert.deepEqual(searchNodes(nodes, '   '), []);
  assert.deepEqual(searchNodes(nodes, 'olmayan kelime'), []);
  assert.ok(searchNodes(data.nodes, 'oyuncak').length > 0);
});
