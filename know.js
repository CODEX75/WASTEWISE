const WASTE_TYPES = [
  { name:'Biodegradable', letter:'B', color:'#00b84a', bin:'Biodegradable bin', desc:'Waste that rots naturally and returns to the soil.', examples:['Food scraps','Fruit peels','Dried leaves'], fact:'Compost can turn food scraps into plant food.' },
  { name:'Non-biodegradable', letter:'N', color:'#8e8ea9', bin:'Non-recyclable bin', desc:'Waste that does not break down easily.', examples:['Styrofoam','Candy wrappers','Diapers'], fact:'Many plastics take a very long time to break down.' },
  { name:'Recyclable', letter:'R', color:'#1e90ff', bin:'Recyclable bin', desc:'Clean materials that can be made into new products.', examples:['Plastic bottles','Cardboard','Glass jars'], fact:'Rinse and dry items first so they can be recycled.' },
  { name:'Hazardous', letter:'H', color:'#ff3b3b', bin:'Hazardous bin', desc:'Waste that can harm people or the environment.', examples:['Batteries','Light bulbs','Paint'], fact:'Take batteries to a collection point, not the regular trash.' },
  { name:'E-waste', letter:'E', color:'#9b6bff', bin:'E-waste drop-off point', desc:'Old electronics and their parts.', examples:['Phones','Chargers','Earphones'], fact:'E-waste holds metals that can be recovered. Bring it to a drop-off point.' }
];

const deck = document.getElementById('deck');
if (deck){
  const zoom = document.getElementById('zoom');
  const zoomCard = document.getElementById('zoomCard');
  const zoomBody = document.getElementById('zoomBody');
  const order = WASTE_TYPES.map((t, i) => i);

  const cards = WASTE_TYPES.map((t, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'deck-card';
    b.style.setProperty('--c', t.color);
    b.innerHTML =
      '<span class="d-band"><b class="d-icon">' + t.letter + '</b><span class="d-name">' + t.name + '</span></span>' +
      '<span class="d-text">' + t.desc + '</span>' +
      '<span class="d-hint">Click to open</span>';
    b.addEventListener('click', () => onCard(i));
    deck.appendChild(b);
    return b;
  });

  function layout(){
    order.forEach((idx, p) => {
      cards[idx].style.setProperty('--p', p);
      cards[idx].classList.toggle('top', p === 0);
      cards[idx].classList.toggle('far', p >= 4);
    });
  }

  function onCard(i){
    if (order[0] === i){
      openZoom(i);
    } else {
      order.splice(order.indexOf(i), 1);
      order.unshift(i);
      layout();
    }
  }

  function shuffle(){
    for (let i = order.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    deck.classList.remove('shake');
    void deck.offsetWidth;
    deck.classList.add('shake');
    layout();
  }

  function next(){
    order.push(order.shift());
    layout();
  }

  function openZoom(i){
    const t = WASTE_TYPES[i];
    zoomCard.style.setProperty('--c', t.color);
    zoomBody.innerHTML =
      '<div class="z-band"><b class="d-icon">' + t.letter + '</b><h2>' + t.name + '</h2></div>' +
      '<div class="z-body">' +
        '<p>' + t.desc + '</p>' +
        '<h4>Examples</h4>' +
        '<ul>' + t.examples.map(e => '<li>' + e + '</li>').join('') + '</ul>' +
        '<p class="z-bin">Goes in: <b>' + t.bin + '</b></p>' +
        '<div class="z-know"><h4>Did you know?</h4><p>' + t.fact + '</p></div>' +
      '</div>';
    zoom.hidden = false;
  }

  function closeZoom(){
    zoom.hidden = true;
  }

  document.getElementById('shuffleBtn').addEventListener('click', shuffle);
  document.getElementById('nextBtn').addEventListener('click', next);
  document.getElementById('zoomClose').addEventListener('click', closeZoom);
  zoom.addEventListener('click', e => { if (e.target === zoom) closeZoom(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeZoom(); });

  layout();
}
const revealTargets = document.querySelectorAll(
  '.block h2, .block .lead, .poll-card, .tip-card, .tip-list li, .cta'
);

revealTargets.forEach(el => {
  el.classList.add('reveal');
  const siblings = Array.from(el.parentElement.children);
  const index = siblings.indexOf(el);
  el.style.transitionDelay = (index * 0.1) + 's';
});

if ('IntersectionObserver' in window){
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold:0.15 });

  revealTargets.forEach(el => observer.observe(el));
} else {
  revealTargets.forEach(el => el.classList.add('in'));
}