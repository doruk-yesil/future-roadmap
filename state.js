export const STORAGE_KEY = 'future-roadmap-v1';

const STATUSES = new Set(['explore', 'researching', 'chosen', 'done', 'eliminated']);
const FORBIDDEN = new Set(['__proto__', 'prototype', 'constructor']);
const MAX_BYTES = 10 * 1024 * 1024;
const MAX_ITEMS = 10000;
let taskSequence = 0;

const now = () => new Date().toISOString();
const clone = value => JSON.parse(JSON.stringify(value));
const fail = message => { throw new Error(message); };
const freshState = () => ({ version: 1, nodes: {}, tasks: [], updatedAt: now() });

function object(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value) ||
      ![Object.prototype, null].includes(Object.getPrototypeOf(value))) {
    fail(`${label}: geçerli bir nesne gerekli.`);
  }
  return value;
}

function keys(value, allowed, label) {
  object(value, label);
  if (Object.keys(value).some(key => !allowed.includes(key))) fail(`${label}: tanınmayan alan var.`);
}

function string(value, limit, label, allowEmpty = true) {
  if (typeof value !== 'string' || value.length > limit || (!allowEmpty && !value.trim())) {
    fail(`${label}: metin eksik veya izin verilen uzunluğu aşıyor.`);
  }
  return value;
}

function identifier(value, label = 'Kimlik') {
  string(value, 200, label, false);
  if (FORBIDDEN.has(value) || /[\u0000-\u001f]/.test(value)) fail(`${label}: geçersiz değer.`);
  return value;
}

function boolean(value, label) {
  if (typeof value !== 'boolean') fail(`${label}: doğru/yanlış değeri gerekli.`);
  return value;
}

function date(value, label) {
  string(value, 40, label, false);
  if (!/^\d{4}-\d{2}-\d{2}T/.test(value) || !Number.isFinite(Date.parse(value))) fail(`${label}: geçersiz tarih.`);
  return value;
}

function scan(value, seen = new WeakSet(), depth = 0) {
  if (depth > 20) fail('Yedek dosyası çok fazla iç içe alan içeriyor.');
  if (value === null || typeof value !== 'object') {
    if (!['string', 'number', 'boolean', 'undefined'].includes(typeof value) && value !== null) fail('Desteklenmeyen veri türü.');
    return;
  }
  if (seen.has(value)) fail('Döngü içeren veri kabul edilmiyor.');
  seen.add(value);
  if (!Array.isArray(value)) object(value, 'Veri');
  for (const key of Object.keys(value)) {
    if (FORBIDDEN.has(key)) fail('Yedekte güvenli olmayan bir alan adı var.');
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (!descriptor || !('value' in descriptor)) fail('Çalıştırılabilir nesne alanları kabul edilmiyor.');
    scan(descriptor.value, seen, depth + 1);
  }
  seen.delete(value);
}

function parseInput(value) {
  if (typeof value === 'string') {
    if (new TextEncoder().encode(value).byteLength > MAX_BYTES) fail('Yedek dosyası en fazla 10 MB olabilir.');
    try { value = JSON.parse(value); } catch { fail('Yedek dosyası geçerli JSON değil.'); }
  }
  scan(value);
  const serialized = JSON.stringify(value);
  if (!serialized || new TextEncoder().encode(serialized).byteLength > MAX_BYTES) fail('Yedek dosyası en fazla 10 MB olabilir.');
  return value;
}

function source(value) {
  keys(value, ['title', 'label', 'url'], 'Kaynak');
  const result = { url: string(value.url, 4000, 'Kaynak adresi', false) };
  let url;
  try { url = new URL(result.url); } catch { fail('Kaynak adresi geçerli bir web adresi olmalı.'); }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) fail('Kaynaklar yalnızca HTTP veya HTTPS adresi olabilir.');
  if (value.title !== undefined) result.title = string(value.title, 500, 'Kaynak başlığı');
  if (value.label !== undefined) result.label = string(value.label, 500, 'Kaynak etiketi');
  return result;
}

function edit(value) {
  keys(value, ['title', 'body', 'requirements', 'sources'], 'Kart düzenlemesi');
  if (!Array.isArray(value.requirements) || value.requirements.length > 100 ||
      !Array.isArray(value.sources) || value.sources.length > 100) fail('Kart koşulları ve kaynakları en fazla 100 öğe içermeli.');
  return {
    title: string(value.title, 500, 'Kart başlığı', false),
    body: string(value.body, 100000, 'Kart açıklaması'),
    requirements: value.requirements.map(item => string(item, 10000, 'Kart koşulu')),
    sources: value.sources.map(source),
  };
}

function node(value) {
  keys(value, ['status', 'favorite', 'notes', 'edit'], 'Kart');
  if (!STATUSES.has(value.status)) fail('Geçersiz kart durumu.');
  const result = { status: value.status, favorite: boolean(value.favorite, 'Favori'), notes: string(value.notes, 100000, 'Notlar') };
  if (value.edit !== undefined) result.edit = edit(value.edit);
  return result;
}

function validateState(value, validNodeIds) {
  keys(value, ['version', 'nodes', 'tasks', 'updatedAt'], 'Durum');
  if (value.version !== 1) fail('Bu yedek sürümü desteklenmiyor.');
  object(value.nodes, 'Kartlar');
  if (Object.keys(value.nodes).length > MAX_ITEMS || !Array.isArray(value.tasks) || value.tasks.length > MAX_ITEMS) fail('Yedekte çok fazla kart veya görev var.');
  const valid = validNodeIds == null ? null : new Set(validNodeIds);
  const checkId = id => {
    identifier(id);
    if (valid && !valid.has(id)) fail(`Yedekte bu yol haritasında bulunmayan kart var: ${id}`);
    return id;
  };
  const nodes = {};
  for (const [id, valueNode] of Object.entries(value.nodes)) nodes[checkId(id)] = node(valueNode);
  const taskIds = new Set();
  const tasks = value.tasks.map(valueTask => {
    keys(valueTask, ['id', 'text', 'nodeId', 'done', 'createdAt'], 'Görev');
    const id = identifier(valueTask.id, 'Görev kimliği');
    if (taskIds.has(id)) fail('Yedekte yinelenen görev kimliği var.');
    taskIds.add(id);
    const result = { id, text: string(valueTask.text, 2000, 'Görev', false), done: boolean(valueTask.done, 'Görev durumu'), createdAt: date(valueTask.createdAt, 'Görev tarihi') };
    if (valueTask.nodeId !== undefined) result.nodeId = checkId(valueTask.nodeId);
    return result;
  });
  return { version: 1, nodes, tasks, updatedAt: date(value.updatedAt, 'Güncelleme tarihi') };
}

export function createStore(options = {}) {
  const onError = options.onError || (() => {});
  const report = error => { try { onError(error instanceof Error ? error : new Error(String(error))); } catch { /* An error handler cannot disable editing. */ } };
  let storage;
  try { storage = Object.hasOwn(options, 'storage') ? options.storage : globalThis.localStorage; }
  catch (error) { report(new Error(`Tarayıcı kaydına erişilemiyor. Değişiklikleri yedek indirerek saklayın. ${error.message}`)); }
  const subscribers = new Set();
  let state = freshState();
  if (storage) {
    try {
      const saved = storage.getItem(STORAGE_KEY);
      if (saved !== null) state = validateState(parseInput(saved));
    } catch (error) { report(new Error(`Kayıt yüklenemedi; boş kişisel alan açıldı. Eski kayıt üzerine ilk değişikliğe kadar yazılmaz. ${error.message}`)); }
  } else if (Object.hasOwn(options, 'storage')) {
    report(new Error('Kalıcı tarayıcı kaydı kullanılamıyor. Değişiklikleri yedek indirerek saklayın.'));
  }

  function commit(next) {
    next.updatedAt = now();
    state = next;
    try {
      if (!storage) fail('Tarayıcı kaydı kullanılamıyor.');
      const serialized = JSON.stringify(state);
      if (new TextEncoder().encode(serialized).byteLength > MAX_BYTES) fail('Kişisel kayıt 10 MB sınırını aşıyor.');
      storage.setItem(STORAGE_KEY, serialized);
    } catch (error) { report(new Error(`Değişiklikler bu oturumda duruyor fakat tarayıcıya kaydedilemedi. Yedek indirin. ${error.message}`)); }
    for (const subscriber of subscribers) {
      try { subscriber(clone(state)); } catch (error) { report(error); }
    }
    return clone(state);
  }

  function updateNode(id, patch) {
    identifier(id);
    keys(patch, ['status', 'favorite', 'notes'], 'Kart değişikliği');
    const next = clone(state);
    next.nodes[id] = node({ status: 'explore', favorite: false, notes: '', ...next.nodes[id], ...patch });
    return commit(next);
  }

  return {
    getState: () => clone(state),
    subscribe(fn) {
      if (typeof fn !== 'function') fail('Abone bir fonksiyon olmalı.');
      subscribers.add(fn);
      return () => subscribers.delete(fn);
    },
    updateNode,
    toggleFavorite(id) { return updateNode(id, { favorite: !state.nodes[id]?.favorite }); },
    saveEdit(id, value) {
      identifier(id);
      scan(value);
      const validated = edit(value);
      const next = clone(state);
      next.nodes[id] = { status: 'explore', favorite: false, notes: '', ...next.nodes[id], edit: validated };
      return commit(next);
    },
    addTask(text, nodeId) {
      string(text, 2000, 'Görev', false);
      if (nodeId !== undefined && nodeId !== null && nodeId !== '') identifier(nodeId);
      if (state.tasks.length >= MAX_ITEMS) fail('En fazla 10.000 görev saklanabilir.');
      const next = clone(state);
      const id = globalThis.crypto?.randomUUID?.() || `task-${Date.now()}-${++taskSequence}`;
      const task = { id, text: text.trim(), done: false, createdAt: now() };
      if (nodeId !== undefined && nodeId !== null && nodeId !== '') task.nodeId = nodeId;
      next.tasks.push(task);
      commit(next);
      return clone(task);
    },
    toggleTask(id) {
      identifier(id, 'Görev kimliği');
      const next = clone(state);
      const task = next.tasks.find(item => item.id === id);
      if (!task) fail('Görev bulunamadı.');
      task.done = !task.done;
      return commit(next);
    },
    removeTask(id) {
      identifier(id, 'Görev kimliği');
      if (!state.tasks.some(item => item.id === id)) fail('Görev bulunamadı.');
      return commit({ ...clone(state), tasks: state.tasks.filter(item => item.id !== id).map(clone) });
    },
    exportBackup() { return { app: 'future-roadmap', version: 1, exportedAt: now(), state: clone(state) }; },
    importBackup(value, validNodeIds) {
      const backup = parseInput(value);
      keys(backup, ['app', 'version', 'exportedAt', 'state'], 'Yedek');
      if (backup.app !== 'future-roadmap' || backup.version !== 1) fail('Bu dosya Future yol haritası yedeği değil veya sürümü desteklenmiyor.');
      date(backup.exportedAt, 'Yedek tarihi');
      const next = validateState(backup.state, validNodeIds);
      return commit(next);
    },
    reset() { return commit(freshState()); },
  };
}
