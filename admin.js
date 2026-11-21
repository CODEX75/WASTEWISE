(() => {
  const ADMIN = "admin";
  const $ = id => document.getElementById(id);

  if ((localStorage.getItem("ww_user") || "").toLowerCase() !== ADMIN) {
    location.replace("index.html");
    return;
  }

  function getUsers() {
    let saved = [];
    try {
      const parsed = JSON.parse(localStorage.getItem("ww_users") || "[]");
      if (Array.isArray(parsed)) saved = parsed;
    } catch (e) {}
    return [{ username: "cha" }, ...saved]
      .filter((user, index, list) =>
        user.username &&
        user.username.toLowerCase() !== ADMIN &&
        list.findIndex(item => item.username.toLowerCase() === user.username.toLowerCase()) === index
      );
  }

  const pointsKey = username => "ww_pts_" + username;
  const claimsKey = username => "ww_claims_" + username;
  const readCount = key => {
    const value = Number(localStorage.getItem(key));
    return Number.isSafeInteger(value) && value > 0 ? value : 0;
  };
  const status = message => { $("adminStatus").textContent = message; };

  function renderUsers() {
    const search = $("userSearch").value.trim().toLowerCase();
    const players = getUsers().filter(user => user.username.toLowerCase().includes(search));
    const body = $("userRows");
    body.replaceChildren();
    $("emptyUsers").hidden = players.length > 0;

    players.forEach(user => {
      const username = user.username;
      const row = document.createElement("tr");
      const name = document.createElement("td");
      name.textContent = username;

      const current = document.createElement("td");
      current.textContent = readCount(pointsKey(username));

      const editCell = document.createElement("td");
      const input = document.createElement("input");
      input.type = "number";
      input.min = "0";
      input.step = "1";
      input.value = readCount(pointsKey(username));
      input.setAttribute("aria-label", "New points for " + username);
      editCell.append(input);

      const claims = document.createElement("td");
      claims.textContent = readCount(claimsKey(username));

      const actions = document.createElement("td");
      const save = document.createElement("button");
      save.type = "button";
      save.className = "admin-btn";
      save.textContent = "Save";
      save.addEventListener("click", () => {
        const value = Number(input.value);
        if (!Number.isSafeInteger(value) || value < 0) {
          status("Enter a whole number of 0 or higher.");
          return;
        }
        localStorage.setItem(pointsKey(username), String(value));
        status("Updated " + username + "'s points.");
        renderUsers();
      });

      const reset = document.createElement("button");
      reset.type = "button";
      reset.className = "admin-btn danger";
      reset.textContent = "Reset";
      reset.addEventListener("click", () => {
        if (!confirm("Reset " + username + "'s points and claimed rewards?")) return;
        localStorage.setItem(pointsKey(username), "0");
        localStorage.setItem(claimsKey(username), "0");
        status(username + "'s points and claimed rewards were reset.");
        renderUsers();
      });

      actions.append(save, reset);
      row.append(name, current, editCell, claims, actions);
      body.append(row);
    });
  }

  $("resetAdmin").addEventListener("click", () => {
    if (!confirm("Reset admin points and claimed rewards to zero? Your login credentials will stay the same.")) return;
    localStorage.setItem(pointsKey(ADMIN), "0");
    localStorage.setItem(claimsKey(ADMIN), "0");
    status("Admin points and claimed rewards have been reset. Login credentials were kept.");
  });

  $("refreshUsers").addEventListener("click", renderUsers);
  $("userSearch").addEventListener("input", renderUsers);
  $("adminLogout").addEventListener("click", () => {
    localStorage.removeItem("ww_user");
    localStorage.removeItem("ww_role");
    location.href = "index.html";
  });

  renderUsers();
})();