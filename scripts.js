const list = document.getElementById('list');
const empty = document.getElementById('empty');

function render() {
  const counters = Store.all();
  empty.hidden = counters.length > 0;
  list.innerHTML = '';

  for (const c of counters) {
    const li = document.createElement('li');
    li.className = 'card';
    li.style.setProperty('--accent', c.color);

    const link = document.createElement('a');
    link.className = 'card-link';
    link.href = `counter/index.html?id=${encodeURIComponent(c.id)}`;

    const name = document.createElement('div');
    name.className = 'card-name';
    name.textContent = c.name;

    const meta = document.createElement('div');
    meta.className = 'card-meta';
    meta.textContent = `Heute: ${Store.todayCount(c)}`;

    link.append(name, meta);

    const total = document.createElement('div');
    total.className = 'card-total';
    total.textContent = c.counts.length;

    const minus = document.createElement('button');
    minus.className = 'card-minus i-minus';
    minus.disabled = c.counts.length === 0;
    minus.setAttribute('aria-label', `${c.name} runterzaehlen`);
    minus.addEventListener('click', () => {
      Store.decrement(c.id);
      render();
    });

    const plus = document.createElement('button');
    plus.className = 'card-plus i-plus';
    plus.setAttribute('aria-label', `${c.name} hochzaehlen`);
    plus.addEventListener('click', () => {
      Store.increment(c.id);
      if (navigator.vibrate) navigator.vibrate(15);
      render();
    });

    li.append(link, total, minus, plus);
    list.append(li);
  }
}

// pageshow feuert auch beim ersten Laden und beim Zurueckkehren aus einer anderen Activity.
window.addEventListener('pageshow', render);
