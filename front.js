const fxTargets = document.querySelectorAll(
  '.stat-card, .journey-title, .journey-sub, .step, .prize, .level'
);

fxTargets.forEach(el => {
  el.classList.add('fx');
  const index = Array.from(el.parentElement.children).indexOf(el);
  el.style.transitionDelay = (index * 0.10) + 's';
});

if ('IntersectionObserver' in window){
  const watcher = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold:0.15 });

  fxTargets.forEach(el => watcher.observe(el));
} else {
  fxTargets.forEach(el => el.classList.add('in'));
}

const heroCard = document.getElementById('itemCard');

if (heroCard && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  const DEMO_ITEMS = [
    { name:'Plastic bottle', img:'gallery/plastic.jpg', bin:'blue' },
    { name:'Banana peel', img:'gallery/banana.jpg', bin:'green' },
    { name:'Used battery', img:'gallery/battery.jpg', bin:'red' },
    { name:'Candy wrapper', img:'gallery/candy.jpg', bin:'gray' },
    { name:'Newspaper', img:'gallery/nwp.jpg', bin:'blue' },
  ];

  const photo = heroCard.querySelector('.item-photo');
  const title = heroCard.querySelector('h3');
  const heroBins = document.querySelectorAll('.ill .bin');
  const scoreEl = document.getElementById('score');
  const streakEl = document.getElementById('streakNum');
  const streakBox = document.getElementById('streak');

  let current = 0;
  let score = 40;
  let streak = 3;

  function showItem(item){
    title.textContent = item.name;
    if (item.img){
      photo.innerHTML = '<img src="' + item.img + '" alt="' + item.name + '">';
    } else {
      photo.textContent = item.icon;
    }
  }

  function addScore(){
    score += 10;
    streak += 1;
    if (score > 100){
      score = 40;
      streak = 3;
    }
    scoreEl.textContent = score;
    streakEl.textContent = streak;
    streakBox.classList.remove('pop');
    void streakBox.offsetWidth;
    streakBox.classList.add('pop');
  }

  function play(){
    heroCard.getAnimations().forEach(a => a.cancel());
    heroBins.forEach(b => b.classList.remove('target'));

    const item = DEMO_ITEMS[current];
    showItem(item);

    const bin = document.querySelector('.ill .bin.' + item.bin);
    const cardBox = heroCard.getBoundingClientRect();
    const bodyBox = bin.querySelector('.body').getBoundingClientRect();

    const dx = bodyBox.left + bodyBox.width / 2 - (cardBox.left + cardBox.width / 2);
    const dy = bodyBox.top - (cardBox.top + cardBox.height / 2) + 20;

    const anim = heroCard.animate([
      { transform:'translate(0px, 0px) scale(1)', opacity:0, offset:0 },
      { transform:'translate(0px, 0px) scale(1)', opacity:1, offset:0.08 },
      { transform:'translate(0px, -10px) scale(1)', opacity:1, offset:0.16 },
      { transform:'translate(0px, 0px) scale(1)', opacity:1, offset:0.3, easing:'ease-in' },
      { transform:'translate(' + dx + 'px, ' + dy + 'px) scale(0.5)', opacity:1, offset:0.7 },
      { transform:'translate(' + dx + 'px, ' + dy + 'px) scale(0.2)', opacity:0, offset:0.8 },
      { transform:'translate(0px, 0px) scale(1)', opacity:0, offset:1 }
    ], { duration:5000, easing:'linear', fill:'forwards' });

    setTimeout(() => bin.classList.add('target'), 2800);
    setTimeout(addScore, 3700);

    anim.onfinish = () => {
      current = (current + 1) % DEMO_ITEMS.length;
      play();
    };
  }

  window.addEventListener('load', play);
}