const id = new URLSearchParams(location.search).get('id');

const els = {
  title: document.getElementById('title'),
  tap: document.getElementById('tap'),
  total: document.getElementById('total'),
  today: document.getElementById('today'),
  days: document.getElementById('days'),
  undo: document.getElementById('undo'),
  history: document.getElementById('history'),
  noHistory: document.getElementById('no-history'),
  delete: document.getElementById('delete')
};

function goHome() {
  location.replace('../home/index.html');
}

function render() {
  const c = Store.get(id);
  if (!c) return goHome();

  document.title = c.name;
  els.title.textContent = c.name;
  document.body.style.setProperty('--accent', c.color);
  document.querySelector('meta[name="theme-color"]').content = c.color;

  const days = Store.byDay(c);
  els.total.textContent = c.counts.length;
  els.today.textContent = Store.todayCount(c);
  els.days.textContent = days.length;
  els.undo.disabled = c.counts.length === 0;
  els.noHistory.hidden = days.length > 0;

  els.history.innerHTML = '';
  for (const [day, count] of days) {
    const li = document.createElement('li');
    const label = document.createElement('span');
    label.textContent = formatDay(day);
    const num = document.createElement('span');
    num.className = 'count';
    num.textContent = count;
    li.append(label, num);
    els.history.append(li);
  }
}

els.tap.addEventListener('click', () => {
  Store.increment(id);
  if (navigator.vibrate) navigator.vibrate(15);
  render();
});

els.undo.addEventListener('click', () => {
  Store.undo(id);
  render();
});

els.delete.addEventListener('click', () => {
  const c = Store.get(id);
  if (c && confirm(`"${c.name}" wirklich löschen? Alle Einträge gehen verloren.`)) {
    Store.remove(id);
    goHome();
  }
});

window.addEventListener('pageshow', render);
