const id = new URLSearchParams(location.search).get('id');

const els = {
  title: document.getElementById('title'),
  tap: document.getElementById('tap'),
  total: document.getElementById('total'),
  today: document.getElementById('today'),
  days: document.getElementById('days'),
  minus: document.getElementById('minus'),
  history: document.getElementById('history'),
  noHistory: document.getElementById('no-history'),
  delete: document.getElementById('delete')
};

function goHome() {
  location.replace('../index.html');
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
  els.minus.disabled = c.counts.length === 0;
  els.noHistory.hidden = days.length > 0;

  els.history.innerHTML = '';
  for (const [day, count] of days) {
    const li = document.createElement('li');
    const label = document.createElement('span');
    label.textContent = formatDay(day);
    const num = document.createElement('span');
    num.className = 'count';
    num.textContent = count;
    const minus = document.createElement('button');
    minus.className = 'day-minus i-minus';
    minus.setAttribute('aria-label', `Einen Klick vom ${formatDay(day)} entfernen`);
    minus.addEventListener('click', () => {
      Store.decrement(id, day);
      render();
    });
    li.append(label, num, minus);
    els.history.append(li);
  }
}

els.tap.addEventListener('click', () => {
  Store.increment(id);
  if (navigator.vibrate) navigator.vibrate(15);
  render();
});

els.minus.addEventListener('click', () => {
  Store.decrement(id);
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
