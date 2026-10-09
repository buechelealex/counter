// Gemeinsame Datenschicht fuer alle Activities (localStorage).
// Ein Counter: { id, name, color, created, counts: ["YYYY-MM-DD", ...] }
// Jeder Eintrag in `counts` ist ein einzelner Klick mit dem Tag, an dem er passiert ist.

const STORE_KEY = 'counters.v1';

function todayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDay(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('de-DE', {
    weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric'
  });
}

const Store = {
  all() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY)) || [];
    } catch {
      return [];
    }
  },

  save(counters) {
    localStorage.setItem(STORE_KEY, JSON.stringify(counters));
  },

  get(id) {
    return this.all().find(c => c.id === id) || null;
  },

  create(name, color) {
    const counters = this.all();
    const counter = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name,
      color,
      created: todayKey(),
      counts: []
    };
    counters.push(counter);
    this.save(counters);
    return counter;
  },

  update(id, fn) {
    const counters = this.all();
    const counter = counters.find(c => c.id === id);
    if (!counter) return null;
    fn(counter);
    this.save(counters);
    return counter;
  },

  increment(id) {
    return this.update(id, c => c.counts.push(todayKey()));
  },

  undo(id) {
    return this.update(id, c => c.counts.pop());
  },

  remove(id) {
    this.save(this.all().filter(c => c.id !== id));
  },

  todayCount(counter) {
    const today = todayKey();
    return counter.counts.filter(d => d === today).length;
  },

  // [["YYYY-MM-DD", anzahl], ...], neueste Tage zuerst
  byDay(counter) {
    const days = {};
    for (const d of counter.counts) days[d] = (days[d] || 0) + 1;
    return Object.entries(days).sort((a, b) => b[0].localeCompare(a[0]));
  }
};

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('../sw.js', { scope: '../' });
}
