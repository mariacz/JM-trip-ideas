function tagsHtml(tags) {
  return `<div class="tags">${tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>`;
}

function tripTags(trip) {
  return [trip.travel, trip.season];
}

function matchesFilter(trip, filter) {
  return filter === "All" || trip.travel === filter || trip.season === filter;
}

function cardHtml(trip) {
  return `
    <a class="card" href="trip.html?id=${trip.id}">
      <div class="card-art">
        <img src="${trip.image}" alt="${trip.name}, ${trip.state}" loading="lazy" />
        <span class="card-country">${trip.state}</span>
      </div>
      <div class="card-body">
        ${tagsHtml(tripTags(trip))}
        <h2>${trip.name}</h2>
        <p>${trip.tagline}</p>
        <div class="card-meta">
          <span><strong>3 nights</strong> (Thu–Sun)</span>
          <span><strong>${trip.budgetEstimate.replace(" for two", "")}</strong> for two</span>
        </div>
        <div class="card-meta card-meta-sub">
          <span>${trip.travel === "Driveable" ? "🚗" : "✈️"} ${trip.gettingThere.split(",")[0].split(".")[0]}</span>
        </div>
        <div class="card-cta">See trip details →</div>
      </div>
    </a>`;
}

/* ---------- Home page ---------- */
function renderHome() {
  const grid = document.getElementById("trip-grid");
  const filters = document.getElementById("filters");
  let active = "All";

  function draw() {
    grid.innerHTML = TRIPS.filter((t) => matchesFilter(t, active)).map(cardHtml).join("");
    filters.innerHTML = FILTERS.map(
      (f) => `<button class="filter-btn ${f === active ? "active" : ""}" data-filter="${f}">${f}</button>`
    ).join("");
  }

  filters.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    active = btn.dataset.filter;
    draw();
  });

  draw();
}

/* ---------- Trip detail page ---------- */
function renderTrip() {
  const page = document.getElementById("trip-page");
  const id = new URLSearchParams(location.search).get("id");
  const trip = TRIPS.find((t) => t.id === id);

  if (!trip) {
    page.innerHTML = `
      <div class="not-found">
        <h1>Trip not found</h1>
        <p><a href="index.html">← Back to all trips</a></p>
      </div>`;
    return;
  }

  document.title = `${trip.name} · Trips for Two`;
  // Suggest other trips from the same season first.
  const others = TRIPS.filter((t) => t.id !== trip.id)
    .sort((a, b) => (b.season === trip.season) - (a.season === trip.season))
    .slice(0, 3);

  page.innerHTML = `
    <section class="detail-hero" style="background-image:linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.7)), url('${trip.image}')">
      <div class="container">
        <a href="index.html" class="back-link">← All trips</a>
        <h1>${trip.name}, ${trip.state}</h1>
        <p class="subtitle">${trip.tagline}</p>
        <div style="margin-top:16px">${tagsHtml(tripTags(trip))}</div>
        <a class="photo-credit" href="${trip.credit.url}" target="_blank" rel="noopener">Photo: ${trip.credit.author} · ${trip.credit.license}</a>
      </div>
    </section>

    <div class="container">
      <div class="facts">
        <div class="fact"><div class="label">Suggested dates</div><div class="value">${trip.dates}</div></div>
        <div class="fact"><div class="label">Trip length</div><div class="value">${LENGTH}</div></div>
        <div class="fact"><div class="label">Getting there (from Pittsburgh)</div><div class="value">${trip.gettingThere}</div></div>
        <div class="fact"><div class="label">Weather</div><div class="value">${trip.weather}</div></div>
        <div class="fact"><div class="label">Est. budget</div><div class="value">${trip.budgetEstimate}</div></div>
      </div>

      <div class="detail-layout">
        <div>
          <section class="section">
            <h2>Overview</h2>
            <p>${trip.overview}</p>
          </section>

          <section class="section">
            <h2>Highlights</h2>
            <ul class="highlights">${trip.highlights.map((h) => `<li>${h}</li>`).join("")}</ul>
          </section>

          <section class="section">
            <h2>Day-by-day plan</h2>
            <p class="legend">Every day mixes something to <b>do</b>, time to <b>relax</b>, and a good place to <b>eat</b>.</p>
            <div class="timeline">
              ${trip.itinerary
                .map(
                  (d) => `
                <div class="timeline-item">
                  <div class="day">${d.day}</div>
                  <h3>${d.title}</h3>
                  <div class="plan-row"><span class="plan-label do">🎟️ Do</span><p>${d.do}</p></div>
                  <div class="plan-row"><span class="plan-label relax">🛋️ Relax</span><p>${d.relax}</p></div>
                  <div class="plan-row"><span class="plan-label eat">🍽️ Eat</span><p>${d.eat}</p></div>
                </div>`
                )
                .join("")}
            </div>
          </section>
        </div>

        <aside>
          <div class="panel">
            <h2>Budget for two</h2>
            ${trip.budgetBreakdown
              .map((b) => `<div class="budget-row"><span>${b.item}</span><span>${b.cost}</span></div>`)
              .join("")}
            <div class="budget-total"><span>Total</span><span>${trip.budgetEstimate.replace(" for two", "")}</span></div>
          </div>

          <div class="panel">
            <h2>Where to stay</h2>
            ${trip.stay.map((s) => `<div class="stay-item"><strong>${s.name}</strong><span>${s.note}</span></div>`).join("")}
          </div>

          <div class="panel">
            <h2>Must-try food</h2>
            ${tagsHtml(trip.food)}
          </div>

          <div class="panel">
            <h2>Tips</h2>
            <ul>${trip.tips.map((t) => `<li>${t}</li>`).join("")}</ul>
          </div>
        </aside>
      </div>
    </div>

    <section class="other-trips">
      <div class="container">
        <h2>Other ideas</h2>
        <div class="grid">${others.map(cardHtml).join("")}</div>
      </div>
    </section>`;
}
