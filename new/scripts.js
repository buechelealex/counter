const COLORS = ['#5b5bd6', '#e5484d', '#f76b15', '#e2a336', '#30a46c', '#12a594', '#0090ff', '#d6409f'];

const form = document.getElementById('form');
const nameInput = document.getElementById('name');
const colorsEl = document.getElementById('colors');

let selected = COLORS[Store.all().length % COLORS.length];

for (const color of COLORS) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'swatch';
  btn.style.setProperty('--c', color);
  btn.setAttribute('aria-label', `Farbe ${color}`);
  btn.setAttribute('aria-pressed', color === selected);
  btn.addEventListener('click', () => {
    selected = color;
    for (const b of colorsEl.children) b.setAttribute('aria-pressed', b === btn);
  });
  colorsEl.append(btn);
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const name = nameInput.value.trim();
  if (!name) return;
  const counter = Store.create(name, selected);
  location.replace(`../counter/index.html?id=${encodeURIComponent(counter.id)}`);
});
