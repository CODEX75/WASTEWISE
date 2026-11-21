(function () {
  const PROJECTS = [
    {
      id: "bottle-planter",
      name: "Bottle planter",
      level: "easy",
      kind: "Reuse",
      time: "20 min",
      img: "",
      video: { youtube: "pdDs1bWLKsM", file: "" },
      materials: ["Plastic bottle", "Scissors", "Soil", "Seeds or small plant", "Paint (optional)"],
      steps: [
        "Clean the bottle and remove the label.",
        "Cut the bottle in half with scissors. Ask an adult for help.",
        "Poke small holes in the bottom for drainage.",
        "Fill the bottom half with soil.",
        "Plant a seed or small plant, then water it.",
      ],
      tip: "Always ask an adult before using scissors or sharp tools.",
    },
    {
      id: "tin-can-organizer",
      name: "Tin can organizer",
      level: "easy",
      kind: "Reuse",
      time: "30 min",
      img: "",
      video: { youtube: "JY6F-htaUXs", file: "" },
      materials: ["Clean tin cans", "Colored paper or paint", "Glue or tape", "Ruler"],
      steps: [
        "Wash the cans and peel off the labels.",
        "Check the rim for sharp edges. Ask an adult to cover them with tape.",
        "Wrap each can in colored paper, or paint it and let it dry.",
        "Glue the cans side by side so they stand together.",
        "Fill them with pens, brushes and rulers.",
      ],
      tip: "Tin can rims can be sharp. Ask an adult to check and tape them first.",
    },
    {
      id: "cardboard-drawer-box",
      name: "Cardboard drawer box",
      level: "medium",
      kind: "Recycle",
      time: "45 min",
      img: "",
      video: { youtube: "lxBbJKS8gBw", file: "" },
      materials: ["Two small cardboard boxes", "Extra cardboard", "Scissors", "Glue or tape", "Ruler and pencil"],
      steps: [
        "Pick two boxes. One must be small enough to slide inside the other.",
        "Cut one short end off the bigger box so it becomes the sleeve.",
        "Cut the lid off the smaller box. This is your drawer.",
        "Check that the drawer slides in and out. Trim it if it sticks.",
        "Glue a strip of cardboard on the front as a handle, then decorate.",
      ],
      tip: "Thick cardboard is hard to cut. Ask an adult to help, and always cut away from your body.",
    },
    {
      id: "newspaper-basket",
      name: "Newspaper basket",
      level: "medium",
      kind: "Recycle",
      time: "1 hr",
      img: "",
      video: { youtube: "hJXuQRkuOYc", file: "" },
      materials: ["Old newspapers", "Glue", "Scissors", "Pencil"],
      steps: [
        "Cut the newspaper into long strips about 5 cm wide.",
        "Roll each strip tightly around a pencil and glue the end. These are your paper sticks.",
        "Make about 16 sticks. Lay half of them side by side for the base.",
        "Weave the other sticks through the base, then bend the ends up to make the walls.",
        "Trim the ends, glue them down, and let the basket dry.",
      ],
      tip: "Ask an adult for help with scissors, and let the glue dry fully before you use the basket.",
    },
    {
      id: "plastic-bonsai-tree",
      name: "Plastic bonsai tree",
      level: "hard",
      kind: "Reuse",
      time: "2 hr",
      img: "",
      video: { youtube: "vglTqRAmfZA", file: "" },
      materials: ["Plastic bottles", "Wire", "Scissors", "Glue", "Small pot and soil"],
      steps: [
        "Clean the bottles and remove the labels.",
        "Cut the plastic into small leaf shapes. Ask an adult for help.",
        "Twist the wire into a trunk with thin branches.",
        "Glue or tie the leaves onto the branches.",
        "Bend the trunk into a bonsai shape.",
        "Set the tree in a small pot filled with soil.",
      ],
      tip: "Cut plastic and wire ends can be sharp. Ask an adult to help and wear gloves.",
    },
    {
      id: "bottle-flower-vase",
      name: "Bottle flower vase",
      level: "hard",
      kind: "Reuse",
      time: "1 hr",
      img: "",
      video: { youtube: "_i1fsYS9U2w", file: "" },
      materials: ["Plastic bottle", "White cement", "Acrylic paint", "Clear varnish", "Gloves"],
      steps: [
        "Clean and dry the bottle, then remove the label.",
        "Mix the white cement with a little water until it is thick and smooth.",
        "Spread a layer of cement over the bottle and let it dry.",
        "Smooth the surface so it looks like a ceramic vase.",
        "Paint it with acrylic paint and let it dry.",
        "Finish with a coat of clear varnish.",
      ],
      tip: "White cement can irritate your skin. Wear gloves and ask an adult to help.",
    },
  ];

  const list = document.getElementById("rrList");
  const detail = document.getElementById("rrDetail");
  const grid = document.getElementById("rrGrid");
  const filterBtns = Array.from(document.querySelectorAll(".rr-filter"));
  const baseTitle = document.title;
  const LEVELS = ["easy", "medium", "hard"];
  let filter = "all";

  function cap(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function thumbOf(p) {
    if (p.img) return p.img;
    const id = p.video && p.video.youtube;
    if (id && /^[\w-]{11}$/.test(id)) return "https://i.ytimg.com/vi/" + id + "/mqdefault.jpg";
    return "";
  }

  function renderGrid() {
    const shown = PROJECTS.filter((p) => filter === "all" || p.level === filter)
      .sort((a, b) => LEVELS.indexOf(a.level) - LEVELS.indexOf(b.level));
    grid.innerHTML = shown
      .map(
        (p) =>
          '<a class="rr-card" href="#' + p.id + '">' +
            '<div class="rr-photo' + (thumbOf(p) ? " has-img" : "") + '">' +
              (thumbOf(p)
                ? '<img src="' + thumbOf(p) + '" alt="' + p.name + '" loading="lazy" data-icon="' + p.icon + '">'
                : p.icon) +
            "</div>" +
            "<h3>" + p.name + "</h3>" +
            '<div class="rr-meta">' +
              '<span class="rr-chip ' + p.level + '">' + cap(p.level) + "</span>" +
              '<span class="rr-info">' + p.time + " | " + p.materials.length + " materials</span>" +
            "</div>" +
            '<span class="rr-view">View steps &gt;</span>' +
          "</a>"
      )
      .join("");

    grid.querySelectorAll(".rr-photo img").forEach((img) => {
      img.addEventListener("error", () => {
        img.parentElement.classList.remove("has-img");
        img.replaceWith(document.createTextNode(img.dataset.icon));
      });
    });
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filter = btn.dataset.level;
      filterBtns.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      renderGrid();
    });
  });

  function videoHtml(p) {
    const v = p.video || {};
    if (v.youtube && /^[\w-]{11}$/.test(v.youtube)) {
      return (
        '<iframe src="https://www.youtube-nocookie.com/embed/' + v.youtube + '" ' +
        'title="' + p.name + ' video" loading="lazy" ' +
        'allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen></iframe>'
      );
    }
    if (v.file) {
      return '<video controls preload="metadata" src="' + v.file + '">Your browser cannot play this video.</video>';
    }
    return '<div class="rr-soon"><span class="rr-play" aria-hidden="true">▶</span><p>Video coming soon</p></div>';
  }

  function linkHtml(p) {
    const id = p.video && p.video.youtube;
    if (!id || !/^[\w-]{11}$/.test(id)) return "";
    return '<a class="rr-yt" href="https://www.youtube.com/watch?v=' + id + '" target="_blank" rel="noopener noreferrer">Video not playing? Watch on YouTube</a>';
  }

  function renderDetail(p) {
    detail.innerHTML =
      '<div class="rr-wrap">' +
        '<a class="rr-back" href="#">&lt; Back to ideas</a>' +
        '<div class="rr-title">' +
          '<div class="rr-chips">' +
            '<span class="rr-chip">' + p.kind + "</span>" +
            '<span class="rr-chip ' + p.level + '">' + cap(p.level) + "</span>" +
            '<span class="rr-chip">' + p.time + "</span>" +
          "</div>" +
          "<h1>" + p.name + "</h1>" +
        "</div>" +
        '<div class="rr-cols">' +
          '<div class="rr-left">' +
            '<div class="rr-video">' + videoHtml(p) + "</div>" +
            linkHtml(p) +
            "<h2>Steps</h2>" +
            '<ol class="rr-steps">' +
              p.steps
                .map((s, i) => '<li><b class="rr-step-n">' + (i + 1) + "</b><span>" + s + "</span></li>")
                .join("") +
            "</ol>" +
          "</div>" +
          '<aside class="rr-right">' +
            '<div class="rr-box">' +
              "<h3>Materials</h3>" +
              '<ul class="rr-checks">' +
                p.materials
                  .map((m) => '<li><label class="rr-check"><input type="checkbox"><span>' + m + "</span></label></li>")
                  .join("") +
              "</ul>" +
            "</div>" +
            '<div class="rr-box rr-tip">' +
              "<h3>Safety tip</h3>" +
              "<p>" + p.tip + "</p>" +
            "</div>" +
          "</aside>" +
        "</div>" +
      "</div>";
  }

  function route() {
    const id = decodeURIComponent(location.hash.slice(1));
    const p = PROJECTS.find((x) => x.id === id);

    if (p) {
      renderDetail(p);
      list.hidden = true;
      detail.hidden = false;
      document.title = p.name + " | WASTE WISE";
    } else {
      detail.hidden = true;
      detail.innerHTML = "";
      list.hidden = false;
      document.title = baseTitle;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  window.addEventListener("hashchange", route);

  renderGrid();
  route();
})();