(function () {
  const BIN_NAMES = ["Biodegradable", "Recyclable", "Non-recyclable", "Hazardous"];

  const LEARN = [
    {
      q: "What does biodegradable waste do?",
      icon: "🍂",
      options: ["It rots naturally and returns to the soil", "It never breaks down", "It can be melted into new products", "It always needs a special drop-off"],
      answer: 0,
      why: "Biodegradable waste rots naturally and returns to the soil.",
    },
    {
      q: "Which of these is an example of hazardous waste?",
      icon: "⚠️",
      options: ["Fruit peels", "Batteries", "Cardboard", "Dried leaves"],
      answer: 1,
      why: "Batteries, light bulbs and paint are hazardous because they can harm people or the environment.",
    },
    {
      q: "What should you do with old batteries?",
      icon: "🔋",
      options: ["Put them in the regular trash", "Bury them in the garden", "Take them to a collection point", "Burn them"],
      answer: 2,
      why: "Batteries are hazardous, so they belong at a collection point, not the regular trash.",
    },
    {
      q: "Why should you rinse and dry items before recycling them?",
      icon: "🫧",
      options: ["It makes them heavier", "So they can be recycled properly", "To change their color", "It is not needed"],
      answer: 1,
      why: "Clean, dry items can be made into new products. Dirty ones can spoil a whole batch.",
    },
    {
      q: "Which type of pollution is caused by smoke from burning trash?",
      icon: "🌫️",
      options: ["Land pollution", "Water pollution", "Air pollution", "Noise pollution"],
      answer: 2,
      why: "Burning trash puts smoke and harmful chemicals into the air.",
    },
    {
      q: "What can drains clogged with litter cause?",
      icon: "🌊",
      options: ["Flooding", "Cleaner water", "Better soil", "Less rain"],
      answer: 0,
      why: "Litter blocks drains and waterways, and that can lead to floods.",
    },
    {
      q: "What can happen to sea animals when plastic gets into the ocean?",
      icon: "🐢",
      options: ["Nothing at all", "They grow bigger", "They may swallow it or get tangled in it", "They move to land"],
      answer: 2,
      why: "Turtles, birds and fish can swallow plastic or get tangled in it.",
    },
    {
      q: "What can you make from food scraps and dried leaves at home?",
      icon: "🌱",
      options: ["Plastic", "Compost", "Glass", "Paper"],
      answer: 1,
      why: "Compost turns food scraps and leaves into plant food.",
    },
    {
      q: "Which of these is a good waste habit at school?",
      icon: "🏫",
      options: ["Throw everything in one bin", "Use both sides of the paper", "Use a new plastic bottle every day", "Burn old notebooks"],
      answer: 1,
      why: "Using both sides of the paper means less paper to throw away.",
    },
    {
      q: "Which of these does not break down easily?",
      icon: "🥤",
      options: ["Styrofoam", "Fruit peels", "Dried leaves", "Egg shells"],
      answer: 0,
      why: "Styrofoam is non-biodegradable and stays in the environment for a very long time.",
    },
  ];

  function sortQuestion(name, icon, bin, why) {
    return {
      q: "Which bin does a " + name + " go in?",
      icon: icon,
      options: BIN_NAMES,
      answer: bin,
      why: why,
      keepOrder: true,
    };
  }

  const GAME = [
    sortQuestion("banana peel", "🍌", 0, "Banana peels rot naturally and can become compost."),
    sortQuestion("glass jar", "🫙", 1, "Rinse glass jars and recycle them."),
    sortQuestion("candy wrapper", "🍬", 2, "Wrappers mix plastic and foil, so they cannot be recycled."),
    sortQuestion("light bulb", "💡", 3, "Bulbs can contain harmful materials. Use a collection point."),
    sortQuestion("newspaper", "📰", 1, "Clean paper can be recycled again and again."),
    sortQuestion("styrofoam cup", "🥤", 2, "Styrofoam does not break down easily and is hard to recycle."),
    sortQuestion("paint can", "🎨", 3, "Leftover paint is hazardous. Never pour it in the trash."),
    sortQuestion("apple core", "🍎", 0, "Apple cores break down naturally in the soil."),
  ];

  const LEVELS = [
    [0, "Seedling"],
    [100, "Sorter"],
    [300, "Eco Warrior"],
    [500, "Waste Wise Master"],
  ];

  const LEARN_COUNT = 6;
  const GAME_COUNT = 4;
  const TOTAL = LEARN_COUNT + GAME_COUNT;
  const POINTS_PER_CORRECT = 7;

  const el = (id) => document.getElementById(id);
  const intro = el("qIntro");
  const card = el("qCard");
  const resultsBox = el("qResults");
  const optionsBox = el("qOptions");

  let Q = null;

  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function rankFor(total) {
    let name = LEVELS[0][1];
    LEVELS.forEach((l) => {
      if (total >= l[0]) name = l[1];
    });
    return name;
  }

  function buildQuestion(item, topic) {
    let opts = item.options.map((text, i) => ({ text: text, correct: i === item.answer }));
    if (!item.keepOrder) opts = shuffle(opts);
    return { q: item.q, icon: item.icon, why: item.why, topic: topic, opts: opts };
  }

  function start() {
    const learn = shuffle(LEARN).slice(0, LEARN_COUNT).map((x) => buildQuestion(x, "learn"));
    const game = shuffle(GAME).slice(0, GAME_COUNT).map((x) => buildQuestion(x, "game"));

    Q = {
      order: shuffle(learn.concat(game)),
      i: 0,
      score: 0,
      answered: false,
      added: false,
    };

    intro.hidden = true;
    resultsBox.hidden = true;
    card.hidden = false;
    showQuestion();
  }

  function showQuestion() {
    const q = Q.order[Q.i];
    Q.answered = false;

    el("qCount").textContent = "Question " + (Q.i + 1) + " of " + TOTAL;
    el("qBar").style.width = ((Q.i + 1) / TOTAL) * 100 + "%";
    el("qText").textContent = q.q;
    el("qSub").textContent = "+" + POINTS_PER_CORRECT + " points for a correct answer";
    el("qPhoto").textContent = q.icon;

    const topic = el("qTopic");
    topic.textContent = q.topic === "learn" ? "From Know Your Trash" : "From the game";
    topic.classList.toggle("game", q.topic === "game");

    optionsBox.innerHTML = q.opts
      .map(
        (o, n) =>
          '<button class="q-opt" type="button" data-n="' + n + '"><b>' +
          "ABCD"[n] + "</b><span>" + o.text + "</span></button>"
      )
      .join("");

    el("qFeedback").hidden = true;
  }

  function choose(n) {
    if (!Q || Q.answered) return;
    const q = Q.order[Q.i];
    if (!q.opts[n]) return;
    Q.answered = true;

    const ok = q.opts[n].correct;
    if (ok) Q.score += 1;

    optionsBox.querySelectorAll(".q-opt").forEach((btn, i) => {
      btn.disabled = true;
      if (q.opts[i].correct) btn.classList.add("right");
      else if (i === n) btn.classList.add("wrong");
      else btn.classList.add("dim");
    });

    const box = el("qFeedback");
    box.hidden = false;
    box.classList.toggle("bad", !ok);
    el("qFbTitle").textContent = ok
      ? "Correct! +" + POINTS_PER_CORRECT + " points"
      : "Not quite. The answer is " + q.opts.find((o) => o.correct).text;
    el("qFbText").textContent = q.why;
    el("qNext").textContent = Q.i >= TOTAL - 1 ? "See results" : "Next question";
  }

  function next() {
    if (!Q || !Q.answered) return;
    if (Q.i >= TOTAL - 1) {
      finish();
    } else {
      Q.i += 1;
      showQuestion();
    }
  }

  function finish() {
    const earned = Q.score * POINTS_PER_CORRECT;

    if (!Q.added) {
      Q.added = true;
      if (earned > 0) addPoints(earned);
    }

    const total = getPoints();

    card.hidden = true;
    resultsBox.hidden = false;
    el("qResSub").textContent = "You answered " + Q.score + " of " + TOTAL + " correctly.";
    el("qScore").textContent = earned;
    el("qEarned").textContent = "+" + earned;
    el("qTotal").textContent = total;
    el("rankName").textContent = rankFor(total);
    el("qAdded").textContent = earned > 0
      ? earned + " points were added to your total."
      : "No points this time. Try again to earn some!";
  }

  function finish() {
    const earned = Q.score * POINTS_PER_CORRECT;

    if (!Q.added) {
      Q.added = true;
      if (earned > 0) addPoints(earned);
    }

    const total = getPoints();

    card.hidden = true;
    resultsBox.hidden = false;
    el("qResSub").textContent = "You answered " + Q.score + " of " + TOTAL + " correctly.";
    el("qScore").textContent = earned;
    el("qEarned").textContent = "+" + earned;
    el("qTotal").textContent = total;
    el("rankName").textContent = rankFor(total);
    el("qAdded").textContent = earned > 0
      ? earned + " points were added to your total."
      : "No points this time. Try again to earn some!";
  }

  function claim() {
    if (!Q || Q.claimed) return;
    const earned = Q.score * POINTS_PER_CORRECT;
    if (earned <= 0) return;
    Q.claimed = true;
    addPoints(earned);
  }

  optionsBox.addEventListener("click", (e) => {
    const btn = e.target.closest(".q-opt");
    if (btn) choose(Number(btn.dataset.n));
  });

  document.addEventListener("click", (e) => {
    if (e.target.closest("#qNext")) next();
  });

  document.addEventListener("keydown", (e) => {
    if (!Q || card.hidden) return;
    const n = ["a", "b", "c", "d"].indexOf(e.key.toLowerCase());
    if (n >= 0 && !Q.answered) choose(n);
    if (e.key === "Enter" && Q.answered) next();
  });

  el("qStart").addEventListener("click", start);
  el("qAgain").addEventListener("click", start);
  el("qIntroPts").textContent = getPoints();
})();