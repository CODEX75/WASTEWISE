(function () {
  const ITEMS = [
    { name: "Banana peel", img:'gallery/banana.jpg', bin: "bio", why: "Banana peels rot naturally and can become compost." },
    { name: "Apple core", img:'gallery/apple.jpg', bin: "bio", why: "Apple cores break down naturally in the soil." },
    { name: "Dried leaves", img:'gallery/Dleaves.jpg', bin: "bio", why: "Leaves rot and make good compost." },
    { name: "Egg shells", img:'gallery/Eshell.jpg', bin: "bio", why: "Egg shells break down and add nutrients to the soil." },
    { name: "Plastic bottle", img:'gallery/plastic.jpg', bin: "rec", why: "Clean plastic bottles can be recycled into new products." },
    { name: "Newspaper", img:'gallery/nwp.jpg', bin: "rec", why: "Clean paper can be recycled again and again." },
    { name: "Glass jar", img:'gallery/jar.jpg', bin: "rec", why: "Rinse glass jars and recycle them." },
    { name: "Tin can", img:'gallery/tin.jpg', bin: "rec", why: "Metal cans can be melted down and reused." },
    { name: "Cardboard box", img:'gallery/cardboard.jpg', bin: "rec", why: "Flatten and keep cardboard dry so it can be recycled." },
    { name: "Candy wrapper", img:'gallery/candy.jpg', bin: "non", why: "Wrappers mix plastic and foil, so they cannot be recycled." },
    { name: "Styrofoam cup", img:'gallery/styrofoam.jpg', bin: "non", why: "Styrofoam does not break down easily and is hard to recycle." },
    { name: "Chip bag", img:'gallery/chip.jpg', bin: "non", why: "Chip bags are made of mixed materials that cannot be recycled." },
    { name: "Used battery", img:'gallery/battery.jpg', bin: "haz", why: "Batteries are hazardous waste. Take them to a collection point." },
    { name: "Light bulb", img:'gallery/light.jpg', bin: "haz", why: "Bulbs can contain harmful materials. Use a collection point." },
    { name: "Paint can", img:'gallery/paint.jpg', bin: "haz", why: "Leftover paint is hazardous. Never pour it in the trash." },
  ];

  const BIN_NAMES = {
    bio: "Biodegradable",
    rec: "Recyclable",
    non: "Non-recyclable",
    haz: "Hazardous",
  };

  const LEVELS = [
    [0, "Seedling"],
    [100, "Sorter"],
    [300, "Eco Warrior"],
    [500, "Waste Wise Master"],
  ];

  const ROUNDS = 10;
  const START_LIVES = 3;
  const ROUND_TIME = 15;
  const POINTS_PER_CORRECT = 5;
  const STREAK_BONUS = 2;
  const PERFECT_BONUS = 10;

  const el = (id) => document.getElementById(id);
  const board = el("board");
  const intro = el("intro");
  const results = el("results");
  const gameCard = el("gCard");
  const bins = Array.from(document.querySelectorAll(".g-bin"));

  let G = null;
  let drag = null;

  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function formatTime(t) {
    return "0:" + String(Math.max(t, 0)).padStart(2, "0");
  }

  function updateHud() {
    el("roundText").textContent = "Round " + (G.i + 1) + " of " + ROUNDS;
    el("gScore").textContent = G.score;
    el("gTime").textContent = formatTime(G.time);
    el("gStreak").textContent = "x" + G.streak;
    document.querySelectorAll("#lives i").forEach((dot, n) => {
      dot.classList.toggle("lost", n >= G.lives);
    });
  }

  function startGame() {
    
    if (G) clearInterval(G.timer);
    intro.hidden = true;
    G = {
      order: shuffle(ITEMS).slice(0, ROUNDS),
      i: 0,
      score: 0,
      streak: 0,
      best: 0,
      lives: START_LIVES,
      correct: 0,
      time: ROUND_TIME,
      phase: "play",
      timer: null,
    };
        G.order.forEach((item) => {
      if (item.img) {
        const pre = new Image();
        pre.src = item.img;
      }
    });
    results.hidden = true;
    board.hidden = false;
    loadItem();
  }

  function loadItem() {
    const item = G.order[G.i];
    G.phase = "play";
    G.time = ROUND_TIME;
    board.dataset.phase = "play";

    el("gName").textContent = item.name;
    if (item.img) {
      el("gPhoto").innerHTML = '<img src="' + item.img + '" alt="' + item.name + '">';
    } else {
      el("gPhoto").textContent = item.icon;
    }

    gameCard.style.transform = "";
    gameCard.classList.remove("dragging");
    el("gHint").hidden = false;
    el("gHint").textContent = "Drag the item to the bin where it belongs.";
    el("gFeedback").hidden = true;
    bins.forEach((b) => b.classList.remove("good", "bad", "over"));

    updateHud();
    clearInterval(G.timer);
    G.timer = setInterval(tick, 1000);
  }

  function tick() {
    G.time--;
    el("gTime").textContent = formatTime(G.time);
    if (G.time <= 0) answer(null);
  }

  function answer(choice) {
    if (!G || G.phase !== "play") return;
    clearInterval(G.timer);
    G.phase = "fb";
    board.dataset.phase = "fb";

    const item = G.order[G.i];
    const ok = choice === item.bin;

    if (ok) {
      G.score += POINTS_PER_CORRECT;
      G.streak += 1;
      G.best = Math.max(G.best, G.streak);
      G.correct += 1;
    } else {
      G.streak = 0;
      G.lives -= 1;
    }

    gameCard.classList.remove("dragging");
    gameCard.style.transform = "";
    bins.forEach((b) => {
      b.classList.toggle("good", b.dataset.bin === item.bin);
      b.classList.toggle("bad", !ok && b.dataset.bin === choice);
      b.classList.remove("over");
    });

    el("gHint").hidden = true;
    const box = el("gFeedback");
    box.hidden = false;
    box.classList.toggle("wrong", !ok);
    el("fbBadge").textContent = ok ? "+" + POINTS_PER_CORRECT : "X";

    if (ok) {
      el("fbTitle").textContent = "Correct! +" + POINTS_PER_CORRECT + " points";
      el("fbText").textContent = item.why;
    } else {
      el("fbTitle").textContent =
        choice === null ? "Time is up! Here is why" : "Not quite. Here is why";
      el("fbText").textContent =
        item.name + " goes in the " + BIN_NAMES[item.bin] + " bin. " + item.why;
    }

    const last = G.lives <= 0 || G.i >= ROUNDS - 1;
    el("nextBtn").textContent = last ? "See results" : "Next item";
    updateHud();
  }

  function next() {
    if (!G || G.phase !== "fb") return;
    if (G.lives <= 0 || G.i >= ROUNDS - 1) {
      finish();
    } else {
      G.i += 1;
      loadItem();
    }
  }

  function levelInfo(total) {
    let idx = 0;
    LEVELS.forEach((l, n) => {
      if (total >= l[0]) idx = n;
    });
    return { current: LEVELS[idx], next: LEVELS[idx + 1] || null };
  }

  function finish() {
    G.phase = "end";
    clearInterval(G.timer);

    const perfect = G.correct === G.order.length;
    const earned = G.score + G.best * STREAK_BONUS + (perfect ? PERFECT_BONUS : 0);
    addPoints(earned);
    const total = getPoints();

    const stars = G.correct >= 9 ? 3 : G.correct >= 6 ? 2 : G.correct >= 3 ? 1 : 0;
    el("stars").innerHTML =
      "★".repeat(stars) + '<span class="off">' + "★".repeat(3 - stars) + "</span>";

    el("resTitle").textContent =
      G.lives <= 0 ? "Game over" : G.correct >= 8 ? "Great sorting!" : "Nice try!";
    el("resSub").textContent =
      "You sorted " + G.correct + " of " + G.order.length + " items correctly." +
      (perfect ? " Perfect round! +" + PERFECT_BONUS + " bonus." : "");
    el("resScore").textContent = G.score;
    el("resBest").textContent = "x" + G.best;
    el("resEarned").textContent = "+" + earned;

    const info = levelInfo(total);
    if (info.next) {
      el("resLevel").textContent = "Level: " + info.current[1] + " > " + info.next[1];
      el("resMore").textContent = info.next[0] - total + " more points to level up";
      const pct = ((total - info.current[0]) / (info.next[0] - info.current[0])) * 100;
      el("resBar").style.width = "0%";
      setTimeout(() => {
        el("resBar").style.width = Math.min(100, pct) + "%";
      }, 50);
    } else {
      el("resLevel").textContent = "Level: " + info.current[1];
      el("resMore").textContent = "Top level reached!";
      el("resBar").style.width = "100%";
    }

    board.hidden = true;
    results.hidden = false;
  }

  function binAt(x, y) {
    const stack = document.elementsFromPoint(x, y);
    for (const node of stack) {
      const b = node.closest ? node.closest(".g-bin") : null;
      if (b) return b;
    }
    return null;
  }

  function onMove(e) {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    const tilt = Math.max(-8, Math.min(8, dx / 40));
    gameCard.style.transform =
      "translate(" + dx + "px, " + dy + "px) scale(0.6) rotate(" + tilt + "deg)";
    const under = binAt(e.clientX, e.clientY);
    bins.forEach((b) => b.classList.toggle("over", b === under));
  }

  function onUp(e) {
    if (!drag) return;
    document.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerup", onUp);
    document.removeEventListener("pointercancel", onUp);
    drag = null;

    const under = binAt(e.clientX, e.clientY);
    bins.forEach((b) => b.classList.remove("over"));
    gameCard.classList.remove("dragging");

    if (under) {
      answer(under.dataset.bin);
    } else {
      gameCard.style.transform = "";
      el("gHint").textContent = "Drag the item to the bin where it belongs.";
    }
  }

  gameCard.addEventListener("pointerdown", (e) => {
    if (!G || G.phase !== "play") return;
    e.preventDefault();
    drag = { x: e.clientX, y: e.clientY };
    gameCard.classList.add("dragging");
    el("gHint").textContent = "Drop it in a bin!";
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    document.addEventListener("pointercancel", onUp);
  });

  bins.forEach((b) => b.addEventListener("click", () => answer(b.dataset.bin)));

  document.addEventListener("click", (e) => {
    if (e.target.closest("#nextBtn")) next();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && G && G.phase === "fb") next();
  });

  el("againBtn").addEventListener("click", startGame);
  el("startBtn").addEventListener("click", startGame);
  el("introPts").textContent = getPoints();
})();