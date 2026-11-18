(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js");

  /* ---------- Names (letter reveal animation from reference) ---------- */
  const namesEl = $("#names");
  if (namesEl && CONFIG.couple) {
    const split = (w, offset) => [...w].map((c, i) => `<span class="ch" style="animation-delay:${(offset + i) * 55}ms">${c}</span>`).join("");
    namesEl.innerHTML = `<span class="nm">${split(CONFIG.couple.groom, 0)}</span> <span class="ch amp" style="animation-delay:${CONFIG.couple.groom.length * 55}ms">&amp;</span><span class="nm">${split(CONFIG.couple.bride, CONFIG.couple.groom.length + 1)}</span>`;
  }

  /* Names reveal observer */
  if ("IntersectionObserver" in window && namesEl) {
    const no = new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting) {
        namesEl.classList.add("go");
        no.disconnect();
      }
    }), { threshold: 0.25 });
    no.observe(namesEl);
  } else if (namesEl) {
    namesEl.classList.add("go");
  }

  /* ---------- Falling Petals Canvas (from reference) ---------- */
  const cv = $("#petals"), ctx = cv ? cv.getContext("2d") : null;
  let W = 0, H = 0, DPR = 1, petals = [], running = false, last = 0;
  const COLORS = ["#F2C3AE", "#EBA79D", "#F8DCD1", "#FFF6F1", "#D9958B", "#C9D3DE", "#DFC794"];

  function resize() {
    if (!cv) return;
    DPR = Math.min(2, devicePixelRatio || 1);
    W = innerWidth; H = innerHeight;
    cv.width = W * DPR; cv.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function mk(burst) {
    const s = 6 + Math.random() * 9;
    return burst
      ? { x: W / 2 + (Math.random() - .5) * 80, y: H * .45, vx: (Math.random() - .5) * 7, vy: -4 - Math.random() * 6, s, r: Math.random() * 6.28, vr: (Math.random() - .5) * .12, ph: Math.random() * 6.28, c: COLORS[(Math.random() * COLORS.length) | 0], burst: true, life: 1 }
      : { x: Math.random() * W, y: -20 - Math.random() * H, vx: .2 + Math.random() * .5, vy: .5 + Math.random() * .8, s, r: Math.random() * 6.28, vr: (Math.random() - .5) * .03, ph: Math.random() * 6.28, c: COLORS[(Math.random() * COLORS.length) | 0], burst: false, life: 1 };
  }

  function drawPetal(p) {
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.scale(Math.cos(p.ph) * .9 + .1, 1);
    ctx.globalAlpha = .85 * p.life; ctx.fillStyle = p.c;
    const s = p.s; ctx.beginPath(); ctx.moveTo(0, -s);
    ctx.bezierCurveTo(s * .95, -s * .55, s * .55, s * .85, 0, s);
    ctx.bezierCurveTo(-s * .55, s * .85, -s * .95, -s * .55, 0, -s);
    ctx.fill(); ctx.restore();
  }

  function frame(t) {
    if (!running) return;
    const dt = Math.min(3, (t - last) / 16.7 || 1); last = t;
    ctx.clearRect(0, 0, W, H);
    for (let i = petals.length - 1; i >= 0; i--) {
      const p = petals[i];
      p.ph += .04 * dt; p.r += p.vr * dt;
      if (p.burst) { p.vy += .12 * dt; p.vx *= .99; p.life -= .006 * dt; }
      p.x += (p.vx + Math.sin(p.ph * .5) * .4) * dt; p.y += p.vy * dt;
      if (p.burst && (p.life <= 0 || p.y > H + 30)) { petals.splice(i, 1); continue; }
      if (!p.burst && (p.y > H + 20 || p.x > W + 20)) Object.assign(p, mk(false), { y: -20, x: Math.random() * W * .9 - 40 });
      drawPetal(p);
    }
    requestAnimationFrame(frame);
  }

  function startPetals(burst) {
    if (reduce || !cv) return;
    resize();
    const n = W < 600 ? 14 : 24;
    while (petals.filter(p => !p.burst).length < n) petals.push(mk(false));
    if (burst) for (let i = 0; i < 46; i++) petals.push(mk(true));
    if (!running) { running = true; last = performance.now(); requestAnimationFrame(frame); }
  }

  addEventListener("resize", () => running && resize());
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) running = false;
    else if (petals.length && !reduce) { running = true; last = performance.now(); requestAnimationFrame(frame); }
  });

  /* ---------- Background Music (Loop 0:59 to 2:36) ---------- */
  const audio = $("#music"), mBtn = $("#musicBtn");
  const loopStart = (CONFIG.musicLoopStart != null) ? CONFIG.musicLoopStart : 59;
  const loopEnd = (CONFIG.musicLoopEnd != null) ? CONFIG.musicLoopEnd : 156;
  let musicReady = false;

  if (CONFIG.music && audio) {
    audio.src = CONFIG.music;
    audio.addEventListener("canplay", () => {
      musicReady = true;
    }, { once: true });
    audio.addEventListener("error", () => {
      if (mBtn) mBtn.hidden = true;
    });

    // Precise loop between loopStart (0:59) and loopEnd (2:36)
    audio.addEventListener("timeupdate", () => {
      if (audio.currentTime >= loopEnd) {
        audio.currentTime = loopStart;
      }
    });

    audio.addEventListener("ended", () => {
      audio.currentTime = loopStart;
      audio.play().catch(() => {});
    });
  }

  function setPlaying(on) {
    if (!mBtn) return;
    mBtn.classList.toggle("playing", on);
    mBtn.setAttribute("aria-label", on ? "Mute audio" : "Unmute audio");
    mBtn.setAttribute("title", on ? "Mute audio" : "Unmute audio");
  }

  if (mBtn && audio) {
    mBtn.addEventListener("click", () => {
      if (audio.paused) {
        if (audio.currentTime < loopStart || audio.currentTime >= loopEnd) {
          audio.currentTime = loopStart;
        }
        audio.play().then(() => setPlaying(true)).catch(() => {});
      } else {
        audio.pause();
        setPlaying(false);
      }
    });
  }

  /* ---------- Cover: Interactive Opening Invitation ---------- */
  const cover = $("#cover");
  let opened = false;

  // Generate floating musical notes (PDF Page 1)
  const notesContainer = $("#cvNotes");
  if (notesContainer) {
    const symbols = ["♫", "♪", "♩", "♬", "𝄞"];
    for (let i = 0; i < 8; i++) {
      const span = document.createElement("span");
      span.textContent = symbols[i % symbols.length];
      span.style.left = `${15 + Math.random() * 70}%`;
      span.style.top = `${28 + Math.random() * 45}%`;
      span.style.setProperty("--d", `${4 + Math.random() * 3}s`);
      span.style.setProperty("--delay", `${(i * 0.7).toFixed(1)}s`);
      span.style.setProperty("--dx", `${(Math.random() > 0.5 ? 1 : -1) * (20 + Math.random() * 30)}px`);
      span.style.setProperty("--rot", `${(Math.random() - 0.5) * 45}deg`);
      notesContainer.appendChild(span);
    }
  }

  function openInvite() {
    if (opened) return;
    opened = true;
    if (CONFIG.music && audio) {
      audio.currentTime = loopStart;
      audio.volume = .3;
      audio.play().then(() => {
        if (mBtn) mBtn.hidden = false;
        setPlaying(true);
        let v = .3;
        const f = setInterval(() => {
          v = Math.min(.6, v + .05);
          audio.volume = v;
          if (v >= .6) clearInterval(f);
        }, 100);
      }).catch(() => {
        // In case autoplay is restricted on mobile, reveal the mute/unmute button so user can tap
        if (mBtn) {
          mBtn.hidden = false;
          setPlaying(false);
        }
      });
    }

    if (cover) cover.classList.add("open");
    document.body.classList.remove("locked");
    startPetals(true);
    setTimeout(() => {
      if (cover) cover.classList.add("gone");
      if (namesEl) namesEl.classList.add("go");
    }, reduce ? 50 : 2100);
  }

  const openBtn = $("#openBtn");
  if (openBtn) openBtn.addEventListener("click", openInvite);
  if (location.hash === "#open" || location.hash === "#top") { openInvite(); }

  /* ---------- Scratch Card for Date Only (User requested addition) ---------- */
  const scratchCanvas = $("#scratchCanvas");

  if (scratchCanvas) {
    const sCtx = scratchCanvas.getContext("2d");
    let isDrawing = false, isRevealed = false, sW = 0, sH = 0;

    function initFoil() {
      const rect = scratchCanvas.getBoundingClientRect();
      sW = rect.width; sH = rect.height;
      scratchCanvas.width = sW; scratchCanvas.height = sH;

      // Golden metallic foil
      const grad = sCtx.createLinearGradient(0, 0, sW, sH);
      grad.addColorStop(0, "#C9A15F");
      grad.addColorStop(0.3, "#DFC794");
      grad.addColorStop(0.5, "#B88E4B");
      grad.addColorStop(0.7, "#E6D4AA");
      grad.addColorStop(1, "#A9874F");

      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, sW, sH);

      // Gold shimmer sparkles
      sCtx.save();
      sCtx.fillStyle = "rgba(255, 255, 255, 0.2)";
      for (let i = 0; i < 30; i++) {
        sCtx.beginPath();
        sCtx.arc(Math.random() * sW, Math.random() * sH, 1 + Math.random() * 2, 0, Math.PI * 2);
        sCtx.fill();
      }
      sCtx.restore();

      // Gold shimmer sparkles & delicate foil border (No text)
      sCtx.save();
      sCtx.fillStyle = "rgba(255, 255, 255, 0.22)";
      for (let i = 0; i < 40; i++) {
        sCtx.beginPath();
        sCtx.arc(Math.random() * sW, Math.random() * sH, 1 + Math.random() * 2.2, 0, Math.PI * 2);
        sCtx.fill();
      }
      sCtx.strokeStyle = "rgba(255, 255, 255, 0.32)";
      sCtx.lineWidth = 1;
      sCtx.strokeRect(8, 8, sW - 16, sH - 16);
      sCtx.restore();
    }

    setTimeout(initFoil, 200);
    addEventListener("resize", () => { if (!isRevealed) initFoil(); });

    function getPos(e) {
      const rect = scratchCanvas.getBoundingClientRect();
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: cx - rect.left, y: cy - rect.top };
    }

    function hideHint() {
      const hint = $("#scratchHint");
      if (hint && !hint.classList.contains("scratched")) {
        hint.classList.add("scratched");
      }
    }

    function scratch(x, y) {
      hideHint();
      sCtx.globalCompositeOperation = "destination-out";
      sCtx.beginPath();
      sCtx.arc(x, y, 26, 0, Math.PI * 2);
      sCtx.fill();

      if (Math.random() < 0.25) checkPercent();
    }

    function checkPercent() {
      if (isRevealed) return;
      try {
        const data = sCtx.getImageData(0, 0, sW, sH).data;
        let trans = 0;
        for (let i = 3; i < data.length; i += 16) {
          if (data[i] === 0) trans += 4;
        }
        if (trans / (data.length / 4) > 0.38) revealDate();
      } catch (e) {}
    }

    function revealDate() {
      if (isRevealed) return;
      isRevealed = true;
      scratchCanvas.classList.add("revealed");
      hideHint();
      startPetals(true);
    }

    scratchCanvas.addEventListener("mousedown", e => { isDrawing = true; hideHint(); const p = getPos(e); scratch(p.x, p.y); });
    addEventListener("mouseup", () => { if (isDrawing) { isDrawing = false; checkPercent(); } });
    scratchCanvas.addEventListener("mousemove", e => { if (isDrawing) { const p = getPos(e); scratch(p.x, p.y); } });
    scratchCanvas.addEventListener("touchstart", e => { isDrawing = true; hideHint(); const p = getPos(e); scratch(p.x, p.y); }, { passive: true });
    addEventListener("touchend", () => { if (isDrawing) { isDrawing = false; checkPercent(); } });
    scratchCanvas.addEventListener("touchmove", e => { if (isDrawing) { const p = getPos(e); scratch(p.x, p.y); } }, { passive: true });
  }

  /* ---------- Live Countdown (from reference) ---------- */
  const target = new Date(CONFIG.weddingStart).getTime();
  const cd = { d: $("#cd-d"), h: $("#cd-h"), m: $("#cd-m"), s: $("#cd-s") };
  const pad = n => String(n).padStart(2, "0");

  function setNum(el, v) {
    if (!el) return;
    if (el.textContent !== v) {
      el.textContent = v;
      if (!reduce) {
        el.classList.remove("tick");
        void el.offsetWidth;
        el.classList.add("tick");
      }
    }
  }

  function tickCd() {
    let diff = Math.max(0, target - Date.now());
    if (diff === 0) {
      const countEl = $(".count");
      if (countEl) countEl.hidden = true;
      const noteEl = $("#cd-note");
      if (noteEl) noteEl.textContent = "Today is the day. Thank you for celebrating with us.";
      return;
    }
    const d = Math.floor(diff / 864e5); diff -= d * 864e5;
    const h = Math.floor(diff / 36e5); diff -= h * 36e5;
    const m = Math.floor(diff / 6e4); diff -= m * 6e4;
    const s = Math.floor(diff / 1e3);
    setNum(cd.d, String(d));
    setNum(cd.h, pad(h));
    setNum(cd.m, pad(m));
    setNum(cd.s, pad(s));
    setTimeout(tickCd, 1000 - (Date.now() % 1000));
  }
  tickCd();

  /* ---------- Events Timeline Rendering (from reference) ---------- */
  const ICON_PIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';
  const ICON_CAL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>';
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const tl = $("#timeline");

  if (tl && CONFIG.events) {
    const vineEl = tl.querySelector(".vine");
    tl.innerHTML = "";
    if (vineEl) tl.appendChild(vineEl);
    else tl.innerHTML = '<div class="vine" aria-hidden="true"><i id="vineFill"></i></div>';

    CONFIG.events.forEach((ev, i) => {
      const art = document.createElement("article");
      art.className = "event rv" + (ev.highlight ? " highlight" : "");
      const isCeremony = ev.id === "ceremony";
      const isReception = ev.id === "reception";
      const tagText = isCeremony ? "The Wedding" : (isReception ? "Celebration" : "");
      art.innerHTML = `
        <div class="bud" aria-hidden="true"><img src="assets/img/breakpoint.png" alt="" class="bud-img"></div>
        <div class="ev-body">
          <h3 class="ev-title">${esc(ev.title)}${tagText ? `<span class="tag">${tagText}</span>` : ""}</h3>
          ${ev.host ? `<p class="ev-host">${esc(ev.host)}</p>` : ""}
          <ul class="ev-parts">
            ${ev.parts.map(p => `
              <li class="part">
                <div class="part-time">${esc(p.time)}</div>
                <div>
                  <div class="part-what">${esc(p.what)}</div>
                  <div class="part-where">${esc(p.where)}</div>
                  ${p.map ? `<div class="ev-actions"><a class="btn" href="${esc(p.map)}" target="_blank" rel="noopener">${ICON_PIN}Directions</a></div>` : ""}
                </div>
              </li>`).join("")}
          </ul>
          ${ev.cal ? `
          <div class="ev-actions">
            <div class="cal">
              <button class="btn" type="button" data-cal="${i}" aria-expanded="false">${ICON_CAL}Add to calendar</button>
            </div>
          </div>` : ""}
        </div>`;
      tl.appendChild(art);
    });
  }

  /* Calendar Actions */
  const utc = iso => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  function calText(ev) {
    return ev.parts.map(p => `${p.time}: ${p.what}, ${p.where}${p.map ? " (" + p.map + ")" : ""}`).join("\n") + `\n\nBibin & Christeena`;
  }
  function gcal(ev) {
    const u = new URL("https://calendar.google.com/calendar/render");
    u.searchParams.set("action", "TEMPLATE");
    u.searchParams.set("text", `${ev.title} · Bibin & Christeena`);
    u.searchParams.set("dates", `${utc(ev.cal.start)}/${utc(ev.cal.end)}`);
    u.searchParams.set("details", calText(ev));
    u.searchParams.set("location", ev.parts[0].where);
    u.searchParams.set("ctz", "Asia/Kolkata");
    return u.toString();
  }
  function ics(ev) {
    const escI = s => s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
    const body = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Bibin & Christeena//Invitation//EN", "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
      `UID:${ev.id}-2027@bibinchristeena`, `DTSTAMP:${utc(new Date().toISOString())}`, `DTSTART:${utc(ev.cal.start)}`, `DTEND:${utc(ev.cal.end)}`,
      `SUMMARY:${escI(ev.title + " · Bibin & Christeena")}`, `LOCATION:${escI(ev.parts[0].where)}`, `DESCRIPTION:${escI(calText(ev))}`,
      "BEGIN:VALARM", "TRIGGER:-PT3H", "ACTION:DISPLAY", "DESCRIPTION:Reminder", "END:VALARM", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([body], { type: "text/calendar" }));
    a.download = `bibin-christeena-${ev.id}.ics`;
    document.body.appendChild(a); a.click(); a.remove();
  }

  let openMenu = null;
  function closeMenu() { if (openMenu) { openMenu.menu.remove(); openMenu.btn.setAttribute("aria-expanded", "false"); openMenu = null; } }
  if (tl) {
    tl.addEventListener("click", e => {
      const btn = e.target.closest("[data-cal]");
      if (!btn) return;
      e.stopPropagation();
      const wasSame = openMenu && openMenu.btn === btn; closeMenu(); if (wasSame) return;
      const val = btn.dataset.cal;
      const ev = isNaN(+val) ? CONFIG.events.find(e => e.id === val) : CONFIG.events[+val];
      if (!ev) return;
      const menu = document.createElement("div");
      menu.className = "cal-menu";
      menu.innerHTML = `<a href="${esc(gcal(ev))}" target="_blank" rel="noopener">Google Calendar</a><button type="button">Apple / Outlook (.ics)</button>`;
      menu.querySelector("button").addEventListener("click", () => { ics(ev); closeMenu(); });
      btn.parentElement.appendChild(menu); btn.setAttribute("aria-expanded", "true");
      openMenu = { btn, menu };
    });
  }
  document.addEventListener("click", e => { if (openMenu && !openMenu.menu.contains(e.target)) closeMenu(); });

  /* Vine scroll progress */
  const vineFill = $("#vineFill");
  function vine() {
    if (!tl || !vineFill) return;
    const vineEl = tl.querySelector(".vine");
    const firstBud = tl.querySelector(".event .bud");
    const tlRect = tl.getBoundingClientRect();
    const vineTop = firstBud ? (firstBud.getBoundingClientRect().bottom - tlRect.top) : 54;
    if (vineEl) vineEl.style.top = vineTop + "px";

    const vineHeight = Math.max(1, tlRect.height - vineTop - 8);
    const startY = tlRect.top + vineTop;
    const p = Math.min(1, Math.max(0, (innerHeight * .7 - startY) / vineHeight));
    vineFill.style.setProperty("--p", p.toFixed(3));
  }
  addEventListener("scroll", vine, { passive: true });
  addEventListener("resize", vine, { passive: true });
  vine();

  /* Moments timeline spine scroll progress */
  const momentsContainer = $(".moments-container");
  const momentsSpine = $(".moments-spine");
  const momentsSpineFill = $("#momentsSpineFill");
  function momentsTrail() {
    if (!momentsContainer || !momentsSpineFill || !momentsSpine) return;
    const rows = momentsContainer.querySelectorAll(".moments-row");
    if (!rows.length) return;
    const firstLogo = rows[0].querySelector(".moments-logo");
    const lastLogo = rows[rows.length - 1].querySelector(".moments-logo");
    if (!firstLogo || !lastLogo) return;

    const cRect = momentsContainer.getBoundingClientRect();
    const fRect = firstLogo.getBoundingClientRect();
    const lRect = lastLogo.getBoundingClientRect();

    // The spine connects from the center of the first logo to the center of the last logo
    const topOffset = (fRect.top + fRect.height / 2) - cRect.top;
    const bottomOffset = (lRect.top + lRect.height / 2) - cRect.top;
    const height = Math.max(1, bottomOffset - topOffset);

    momentsSpine.style.top = topOffset + "px";
    momentsSpine.style.height = height + "px";

    const triggerY = innerHeight * 0.7;
    const startY = fRect.top + fRect.height / 2;
    const p = Math.min(1, Math.max(0, (triggerY - startY) / height));

    momentsSpineFill.style.setProperty("--mp", p.toFixed(3));

    rows.forEach(r => {
      const logo = r.querySelector(".moments-logo");
      if (logo) {
        const lY = logo.getBoundingClientRect().top + logo.offsetHeight / 2;
        logo.classList.toggle("passed", lY <= triggerY);
      }
    });
  }
  addEventListener("scroll", momentsTrail, { passive: true });
  addEventListener("resize", momentsTrail, { passive: true });
  window.addEventListener("load", () => { momentsTrail(); vine(); });
  document.querySelectorAll("#moments img, #timeline img").forEach(img => {
    if (!img.complete) {
      img.addEventListener("load", () => { momentsTrail(); vine(); }, { once: true });
    }
  });
  momentsTrail();

  /* ---------- Gallery & Lightbox (from reference) ---------- */
  const grid = $("#galleryGrid");
  if (grid && CONFIG.photos) {
    CONFIG.photos.forEach((p, i) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "ph rv" + (p.arch ? " arch" : "");
      b.setAttribute("aria-label", "Open photo: " + p.alt);
      b.innerHTML = `<img src="${p.src}" alt="${esc(p.alt)}" loading="lazy" decoding="async">`;
      b.addEventListener("click", () => showLb(i));
      grid.appendChild(b);
    });
  }

  const lb = $("#lightbox"), lbImg = $("#lbImg"), lbCount = $("#lbCount");
  let lbI = 0, lastFocus = null;
  function setLb(i) {
    lbI = (i + CONFIG.photos.length) % CONFIG.photos.length;
    const p = CONFIG.photos[lbI];
    lbImg.style.opacity = 0;
    const im = new Image();
    im.onload = () => { lbImg.src = p.src; lbImg.alt = p.alt; lbImg.style.opacity = 1; };
    im.src = p.src;
    lbCount.textContent = `${lbI + 1} / ${CONFIG.photos.length}`;
  }

  function showLb(i) {
    lastFocus = document.activeElement; setLb(i);
    lb.classList.add("on"); lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    $("#lbClose").focus();
  }

  function hideLb() {
    lb.classList.remove("on"); lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lastFocus && lastFocus.focus();
  }

  if ($("#lbClose")) $("#lbClose").addEventListener("click", hideLb);
  if ($("#lbPrev")) $("#lbPrev").addEventListener("click", () => setLb(lbI - 1));
  if ($("#lbNext")) $("#lbNext").addEventListener("click", () => setLb(lbI + 1));
  if (lb) lb.addEventListener("click", e => { if (e.target === lb) hideLb(); });
  addEventListener("keydown", e => {
    if (!lb || !lb.classList.contains("on")) return;
    if (e.key === "Escape") hideLb();
    if (e.key === "ArrowLeft") setLb(lbI - 1);
    if (e.key === "ArrowRight") setLb(lbI + 1);
  });

  /* Touch swipe on lightbox */
  let tx = null;
  if (lb) {
    lb.addEventListener("touchstart", e => { tx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", e => {
      if (tx == null) return;
      const dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 45) setLb(lbI + (dx < 0 ? 1 : -1));
      tx = null;
    });
  }

  /* Bind Photo Cards & Vignettes Polaroids to Lightbox */
  document.querySelectorAll(".photo-card, .vignette-polaroid").forEach(card => {
    card.addEventListener("click", () => {
      const idx = parseInt(card.getAttribute("data-index"), 10);
      showLb(isNaN(idx) ? 0 : idx);
    });
  });

  /* ---------- Reveal on Scroll (from reference) ---------- */
  const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) {
      en.target.classList.add("in");
      io.unobserve(en.target);
    }
  }), { threshold: .12, rootMargin: "0px 0px -6% 0px" }) : null;

  document.querySelectorAll(".rv").forEach(el => {
    if (io) io.observe(el); else el.classList.add("in");
  });
  setTimeout(() => document.querySelectorAll(".rv:not(.in)").forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight) el.classList.add("in");
  }), 1500);

  /* ---------- Guest Wishes Form & Persistent Storage ---------- */
  const form = $("#wishesForm"), err = $("#wishErr"), submit = $("#wishSubmit");
  const thanks = $("#thanks"), stream = $("#wishesStream");
  const storeKey = (CONFIG.guestbook && CONFIG.guestbook.storageKey) || "bibin_christeena_wishes_v1";

  function getStoredWishes() {
    try {
      const data = localStorage.getItem(storeKey);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return [];
  }

  function renderWishes() {
    if (!stream) return;
    const list = getStoredWishes();
    if (!list.length) {
      stream.innerHTML = "";
      return;
    }
    stream.innerHTML = list.map(w => `
      <div class="wish-bubble">
        <div class="wb-head"><span class="wb-name">${esc(w.name)}</span><span class="wb-time">${esc(w.time || "Recently")}</span></div>
        <p class="wb-text">“${esc(w.text)}”</p>
      </div>`).join("");
  }
  renderWishes();

  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      err.textContent = "";
      const name = $("#wish-name").value.trim();
      const text = $("#wish-msg").value.trim();

      if (name.length < 2) {
        err.textContent = "Please enter your name so the couple knows who sent this blessing.";
        $("#wish-name").focus();
        return;
      }
      if (text.length < 3) {
        err.textContent = "Please enter a message for Bibin & Christeena.";
        $("#wish-msg").focus();
        return;
      }

      submit.disabled = true;
      submit.textContent = "Sending…";

      // Send to Google Form
      const gf = CONFIG.guestbook && CONFIG.guestbook.googleForm;
      if (gf && gf.endpoint) {
        try {
          const body = new URLSearchParams();
          body.append(gf.nameEntry || "entry.1266621477", name);
          body.append(gf.messageEntry || "entry.381587613", text);
          fetch(gf.endpoint, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: body.toString()
          }).catch(e => console.warn("Google Form submit notice:", e));
        } catch (e) {}
      }

      const newWish = { name, text, time: "Just now" };
      const list = getStoredWishes();
      list.unshift(newWish);
      try {
        localStorage.setItem(storeKey, JSON.stringify(list));
      } catch (e) {}

      startPetals(true);
      form.hidden = true;
      thanks.hidden = false;
      thanks.classList.remove("in");
      void thanks.offsetWidth;
      thanks.classList.add("in");
      $("#thanksName").textContent = `Thank you, ${name}`;

      renderWishes();
      submit.disabled = false;
      submit.textContent = "Share your wishes";
    });
  }

  const editReplyBtn = $("#editReply");
  if (editReplyBtn) {
    editReplyBtn.addEventListener("click", () => {
      thanks.hidden = true;
      form.hidden = false;
      form.reset();
      $("#wish-name").focus();
    });
  }
})();
