const siteHeader = document.querySelector("header");
if (siteHeader) {
  window.addEventListener("scroll", () => {
    siteHeader.classList.toggle("scrolled", window.scrollY > 10);
  });
}
if (!localStorage.getItem('ww_user')){
  location.replace('index.html');
}

function pointsKey(){
  return 'ww_pts_' + (localStorage.getItem('ww_user') || 'guest');
}

function getPoints(){
  return Number(localStorage.getItem(pointsKey())) || 0;
}

function showPoints(){
  const el = document.getElementById('pts');
  if (el) el.textContent = getPoints();
}

function updateLevels(){
  const pts = getPoints();
  const levels = document.querySelectorAll('.level');
  if (!levels.length) return;

  let current = null;
  levels.forEach(l => {
    const reached = pts >= Number(l.dataset.pts);
    l.classList.toggle('reached', reached);
    l.classList.remove('current');
    if (reached) current = l;
  });
  if (current) current.classList.add('current');

  const now = document.getElementById('levelPts');
  if (now) now.textContent = pts;
}

function setPoints(n){
  localStorage.setItem(pointsKey(), n);
  showPoints();
  updateLevels();
}

function addPoints(n){
  setPoints(getPoints() + n);
}

showPoints();
updateLevels();

const who = document.getElementById('who');
if (who) who.textContent = localStorage.getItem('ww_user') || 'guest';

document.addEventListener('click', e => {
  if (e.target.closest('#logoutBtn')){
    localStorage.removeItem('ww_user');
    location.href = 'index.html';
  }
});

const REWARD_TARGET = 1000;

function claimsKey(){
  return 'ww_claims_' + (localStorage.getItem('ww_user') || 'guest');
}

function getClaims(){
  return Number(localStorage.getItem(claimsKey())) || 0;
}

function renderReward(){
  const pts = getPoints();
  const claims = getClaims();
  const nextTarget = (claims + 1) * REWARD_TARGET;
  const unlocked = pts >= nextTarget;

  document.getElementById('chairBox').classList.toggle('unlocked', unlocked);

  const progress = Math.max(0, Math.min(100, (pts - claims * REWARD_TARGET) / REWARD_TARGET * 100));
  document.getElementById('rewardBar').style.width = progress + '%';

  const info = document.getElementById('rewardInfo');
  const btn = document.getElementById('claimBtn');
  const claimedText = claims > 0 ? 'Rewards claimed: ' + claims + '. ' : '';

  if (unlocked){
    info.textContent = claimedText + 'You reached ' + nextTarget + ' points. Your reward is unlocked!';
    btn.textContent = 'Claim reward';
    btn.disabled = false;
  } else {
    info.textContent = claimedText + (nextTarget - pts) + ' more points to unlock (' + pts + ' / ' + nextTarget + ')';
    btn.textContent = 'Locked';
    btn.disabled = true;
  }
}

const rewardModal = document.getElementById('rewardModal');
if (rewardModal){
  const openBtn = document.getElementById('openReward');
  const closeBtn = document.getElementById('closeReward');
  const claimBtn = document.getElementById('claimBtn');
  const slides = document.querySelectorAll('.slide');
  const dotsBox = document.getElementById('dots');
  let slideIndex = 0;
  let slideTimer = null;

  function showSlide(i){
    slideIndex = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle('active', n === slideIndex));
    dotsBox.querySelectorAll('.dot-btn').forEach((d, n) => d.classList.toggle('on', n === slideIndex));
  }

  function stopSlides(){
    clearInterval(slideTimer);
    slideTimer = null;
  }

  function startSlides(){
    stopSlides();
    if (slides.length > 1){
      slideTimer = setInterval(() => showSlide(slideIndex + 1), 3000);
    }
  }

  slides.forEach((s, i) => {
    const d = document.createElement('button');
    d.type = 'button';
    d.className = 'dot-btn';
    d.setAttribute('aria-label', 'Show chair ' + (i + 1));
    d.addEventListener('click', () => { showSlide(i); startSlides(); });
    dotsBox.appendChild(d);
  });

  document.getElementById('prevSlide').addEventListener('click', () => { showSlide(slideIndex - 1); startSlides(); });
  document.getElementById('nextSlide').addEventListener('click', () => { showSlide(slideIndex + 1); startSlides(); });

  function openReward(){
    renderReward();
    showSlide(0);
    startSlides();
    rewardModal.hidden = false;
  }

  function closeReward(){
    stopSlides();
    rewardModal.hidden = true;
  }

  openBtn.addEventListener('click', openReward);
  closeBtn.addEventListener('click', closeReward);
  rewardModal.addEventListener('click', e => { if (e.target === rewardModal) closeReward(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeReward(); });

  claimBtn.addEventListener('click', () => {
    if (getPoints() < (getClaims() + 1) * REWARD_TARGET) return;
    localStorage.setItem(claimsKey(), getClaims() + 1);
    renderReward();
  });
}