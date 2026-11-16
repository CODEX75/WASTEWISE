(function () {
  const form = document.getElementById("fbForm");
  if (!form) return;

  const thanks = document.getElementById("fbThanks");
  const errorBox = document.getElementById("fbError");
  const nameInput = document.getElementById("fbName");
  const emailInput = document.getElementById("fbEmail");
  const msgInput = document.getElementById("fbMsg");
  const stars = Array.from(document.querySelectorAll(".fb-star"));

  let rating = 0;

  function paintStars(upTo) {
    stars.forEach((s) => s.classList.toggle("on", Number(s.dataset.v) <= upTo));
  }

  stars.forEach((s) => {
    s.addEventListener("click", () => {
      rating = Number(s.dataset.v);
      paintStars(rating);
    });
    s.addEventListener("mouseenter", () => paintStars(Number(s.dataset.v)));
  });

  document.getElementById("fbStars").addEventListener("mouseleave", () => paintStars(rating));

  [nameInput, emailInput, msgInput].forEach((f) => {
    f.addEventListener("input", () => f.classList.remove("bad"));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = msgInput.value.trim();

    [nameInput, emailInput, msgInput].forEach((f) => f.classList.remove("bad"));
    errorBox.textContent = "";

    if (!name) {
      nameInput.classList.add("bad");
      errorBox.textContent = "Please enter your name.";
      nameInput.focus();
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      emailInput.classList.add("bad");
      errorBox.textContent = "Please enter a valid email address.";
      emailInput.focus();
      return;
    }
    if (rating === 0) {
      errorBox.textContent = "Please choose a star rating.";
      return;
    }
    if (message.length < 5) {
      msgInput.classList.add("bad");
      errorBox.textContent = "Please write a short message.";
      msgInput.focus();
      return;
    }

    let list = [];
    try {
      list = JSON.parse(localStorage.getItem("ww_feedback")) || [];
    } catch (err) {
      list = [];
    }
    list.push({
      user: localStorage.getItem("ww_user") || "guest",
      name: name,
      email: email,
      rating: rating,
      message: message,
      date: new Date().toISOString(),
    });
    localStorage.setItem("ww_feedback", JSON.stringify(list));

    form.hidden = true;
    thanks.hidden = false;
    thanks.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  document.getElementById("fbAgain").addEventListener("click", () => {
    form.reset();
    rating = 0;
    paintStars(0);
    errorBox.textContent = "";
    thanks.hidden = true;
    form.hidden = false;
  });
})();