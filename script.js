// v3 — cache busted, all fixes applied
"use strict";

document.addEventListener("DOMContentLoaded", () => {

  /* ── CONFIG from HTML ── */
  const CFG = window.CONFIG || {};
  const girlfriendName   = CFG.girlfriendName   || "My Love";
  const myName           = CFG.myName           || "Yours Forever";
  const startMissingDate = CFG.startMissingDate || "2026-01-01T00:00:00";
  const bgMusicUrl       = CFG.bgMusicUrl       || "";
  const apologyLetter    = CFG.apologyLetter    || "Dear My Love,\n\nI am truly sorry.\n\nForever yours ❤️";
  const memories         = CFG.memories         || [];
  const quotes           = CFG.quotes && CFG.quotes.length > 0 ? CFG.quotes : [
    "You make ordinary moments extraordinary ✨",
    "The world is softer when you're near 🌸",
    "Your laugh is my favourite sound 😊",
    "You are my home 🏡",
    "I fall for you every single day 💕",
    "Loving you is the easiest thing I do ❤️"
  ];

  /* ── Footer name ── */
  const footerEl = document.getElementById("footer-name");
  if (footerEl) footerEl.textContent = "— " + myName;

  /* ── LOADER ── */
  const loader = document.getElementById("loader");
  if (loader) {
    setTimeout(() => loader.classList.add("hidden"), 1200);
  }

  /* ── SCROLL PROGRESS ── */
  const progressBar = document.getElementById("scroll-progress");
  window.addEventListener("scroll", () => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct  = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + "%";
  }, { passive: true });

  /* ── DARK MODE ── */
  const darkBtn = document.getElementById("dark-toggle");
  let darkMode  = localStorage.getItem("darkMode") === "true";

  function applyDark(on) {
    document.body.classList.toggle("dark-mode",  on);
    document.body.classList.toggle("light-mode", !on);
    if (darkBtn) {
      darkBtn.textContent = on ? "☀️" : "🌙";
      darkBtn.setAttribute("aria-pressed", String(on));
    }
    localStorage.setItem("darkMode", String(on));
  }

  applyDark(darkMode);
  if (darkBtn) darkBtn.addEventListener("click", () => { darkMode = !darkMode; applyDark(darkMode); });

  /* ── MUSIC ── */
  const musicBtn = document.getElementById("music-toggle");
  const bgMusic  = document.getElementById("bg-music");
  let   musicOn  = false;

  if (bgMusicUrl && bgMusic) bgMusic.src = bgMusicUrl;

  if (musicBtn) {
    musicBtn.addEventListener("click", () => {
      if (!bgMusicUrl) return;
      if (musicOn) {
        bgMusic.pause();
        musicOn = false;
        musicBtn.textContent = "🎵";
      } else {
        bgMusic.play().then(() => { musicOn = true; musicBtn.textContent = "🔇"; }).catch(() => {});
      }
    });
  }

  /* ── CURSOR TRAIL ── */
  const cursorCanvas = document.getElementById("cursor-canvas");
  if (cursorCanvas) {
    const cCtx = cursorCanvas.getContext("2d");
    const particles = [];

    function resizeCC() {
      cursorCanvas.width  = window.innerWidth;
      cursorCanvas.height = window.innerHeight;
    }
    resizeCC();
    window.addEventListener("resize", resizeCC);

    document.addEventListener("mousemove", (e) => {
      if (Math.random() > 0.4) {
        particles.push({ x: e.clientX, y: e.clientY, size: Math.random() * 12 + 6,
          life: 1, decay: 0.025 + Math.random() * 0.02,
          vx: (Math.random() - 0.5) * 1.5, vy: -1 - Math.random() * 1.5 });
      }
    });

    document.addEventListener("touchmove", (e) => {
      const t = e.touches[0];
      if (Math.random() > 0.5) {
        particles.push({ x: t.clientX, y: t.clientY, size: 14, life: 1,
          decay: 0.03, vx: (Math.random() - 0.5) * 1.5, vy: -1.5 - Math.random() });
      }
    }, { passive: true });

    function drawCursor() {
      cCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        cCtx.globalAlpha = p.life;
        cCtx.font = p.size + "px serif";
        cCtx.fillText("❤️", p.x - p.size / 2, p.y + p.size / 2);
        p.x += p.vx; p.y += p.vy; p.life -= p.decay;
        if (p.life <= 0) particles.splice(i, 1);
      }
      cCtx.globalAlpha = 1;
      requestAnimationFrame(drawCursor);
    }
    drawCursor();
  }

  /* ── AMBIENT PARTICLES ── */
  const pCanvas = document.getElementById("particle-canvas");
  if (pCanvas) {
    const pCtx   = pCanvas.getContext("2d");
    const EMOJIS = ["❤️", "✨", "🌸", "💕", "⭐"];
    const ambient = [];

    function resizePC() { pCanvas.width = window.innerWidth; pCanvas.height = window.innerHeight; }
    resizePC();
    window.addEventListener("resize", resizePC);

    function makeAmbient(bottom) {
      return {
        x: Math.random() * window.innerWidth,
        y: bottom ? window.innerHeight + 20 : Math.random() * window.innerHeight,
        size: Math.random() * 14 + 8, speed: 0.25 + Math.random() * 0.4,
        drift: (Math.random() - 0.5) * 0.3, alpha: 0.1 + Math.random() * 0.25,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
      };
    }

    for (let i = 0; i < 28; i++) ambient.push(makeAmbient(false));

    function drawAmbient() {
      pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
      for (const p of ambient) {
        pCtx.globalAlpha = p.alpha;
        pCtx.font = p.size + "px serif";
        pCtx.fillText(p.emoji, p.x, p.y);
        p.y -= p.speed; p.x += p.drift;
        if (p.y < -30) Object.assign(p, makeAmbient(true));
      }
      pCtx.globalAlpha = 1;
      requestAnimationFrame(drawAmbient);
    }
    drawAmbient();
  }

  /* ── SCROLL REVEAL ── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add("revealed"), i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".scroll-reveal").forEach(el => revealObserver.observe(el));

  /* ── HERO HEART ── */
  const heroHeart = document.getElementById("hero-heart");
  const heartHint = document.getElementById("heart-hint");
  let heartClicks = Number(localStorage.getItem("heartClicks") || 0);

  function updateHeartHint() {
    if (!heartHint) return;
    const left = 10 - heartClicks;
    if (heartClicks === 0) { heartHint.textContent = ""; heartHint.classList.remove("show"); }
    else if (heartClicks < 10) {
      heartHint.textContent = left + " more click" + (left !== 1 ? "s" : "") + " to unlock a secret 🤫";
      heartHint.classList.add("show");
    } else {
      heartHint.textContent = "✨ Secret unlocked! ✨";
      heartHint.classList.add("show");
    }
  }

  updateHeartHint();

  if (heroHeart) {
    heroHeart.addEventListener("click", () => {
      heartClicks = Math.min(heartClicks + 1, 10);
      localStorage.setItem("heartClicks", heartClicks);
      updateHeartHint();
      if (heartClicks >= 10) {
        const ee = document.getElementById("easter-egg");
        if (ee) {
          ee.querySelector("p").textContent = girlfriendName + ", you are my entire world. Every heartbeat is for you. ❤️";
          ee.removeAttribute("hidden");
        }
      }
      spawnFloatHeart(heroHeart.getBoundingClientRect());
    });
  }

  const closeEaster = document.getElementById("close-easter");
  if (closeEaster) closeEaster.addEventListener("click", () => {
    document.getElementById("easter-egg").setAttribute("hidden", "");
  });

  /* ── SCROLL TO LETTER ── */
  const hearMeOut = document.getElementById("hear-me-out");
  if (hearMeOut) hearMeOut.addEventListener("click", () => {
    document.getElementById("letter").scrollIntoView({ behavior: "smooth" });
  });

  /* ── COUNTDOWN ── */
  function updateCountdown() {
    let diff = Math.max(0, Date.now() - new Date(startMissingDate).getTime());
    const days  = Math.floor(diff / 86400000); diff -= days  * 86400000;
    const hours = Math.floor(diff /  3600000); diff -= hours *  3600000;
    const mins  = Math.floor(diff /    60000); diff -= mins  *    60000;
    const secs  = Math.floor(diff /     1000);
    const d = document.getElementById("cd-days");
    const h = document.getElementById("cd-hours");
    const m = document.getElementById("cd-mins");
    const s = document.getElementById("cd-secs");
    if (d) d.textContent = days;
    if (h) h.textContent = String(hours).padStart(2, "0");
    if (m) m.textContent = String(mins).padStart(2, "0");
    if (s) s.textContent = String(secs).padStart(2, "0");
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ── APOLOGY LETTER ── */
  const letterContainer = document.getElementById("letter-paragraphs");
  const letterCard      = document.querySelector(".letter-card");

  if (letterContainer && apologyLetter) {
    // Split on one or more blank lines
    const paras = apologyLetter.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);

    paras.forEach(para => {
      const p = document.createElement("p");
      p.className   = "letter-paragraph";
      p.textContent = para;
      letterContainer.appendChild(p);
    });

    let letterStarted = false;
    const lo = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !letterStarted) {
        letterStarted = true;
        const all = letterContainer.querySelectorAll(".letter-paragraph");
        all.forEach((p, i) => setTimeout(() => p.classList.add("visible"), i * 500));
        lo.disconnect();
      }
    }, { threshold: 0.2 });

    if (letterCard) lo.observe(letterCard);
  }

  /* ── REASONS GRID ── */
  const reasons = [
    { icon: "❤️",  text: "Your smile brightens my worst days" },
    { icon: "🌸",  text: "Your kindness inspires me" },
    { icon: "😂",  text: "You make every boring moment fun" },
    { icon: "🌎",  text: "You are my favorite place" },
    { icon: "☕",  text: "Even silence feels peaceful with you" },
    { icon: "✨",  text: "You make me want to be better" }
  ];

  const grid = document.getElementById("reasons-grid");
  if (grid) {
    reasons.forEach(r => {
      const card = document.createElement("div");
      card.className = "reason-card";
      card.innerHTML = "<span class='reason-icon'>" + r.icon + "</span><p>" + r.text + "</p>";
      grid.appendChild(card);
    });

    const co = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("revealed"), i * 100);
          co.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    grid.querySelectorAll(".reason-card").forEach(c => co.observe(c));
  }

  /* ── CAROUSEL ── */
  const track  = document.getElementById("carousel-track");
  const dotsEl = document.getElementById("carousel-dots");
  let current  = 0;
  let autoPlay;
  const MEM_EMOJIS = ["📸", "💝", "🌅", "💌"];

  if (track && memories.length > 0) {
    memories.forEach((m, i) => {
      const slide = document.createElement("div");
      slide.className = "carousel-slide";

      if (m.img) {
        const img = document.createElement("img");
        img.src       = m.img;
        img.alt       = m.caption;
        img.className = "slide-img";
        img.onerror   = () => {
          const ph = document.createElement("div");
          ph.className   = "slide-placeholder";
          ph.textContent = MEM_EMOJIS[i % MEM_EMOJIS.length];
          img.replaceWith(ph);
        };
        slide.appendChild(img);
      } else {
        const ph = document.createElement("div");
        ph.className   = "slide-placeholder";
        ph.textContent = MEM_EMOJIS[i % MEM_EMOJIS.length];
        slide.appendChild(ph);
      }

      const cap = document.createElement("div");
      cap.className   = "carousel-caption";
      cap.textContent = m.caption;
      slide.appendChild(cap);
      track.appendChild(slide);

      if (dotsEl) {
        const dot = document.createElement("button");
        dot.className = "carousel-dot" + (i === 0 ? " active" : "");
        dot.setAttribute("aria-label", "Slide " + (i + 1));
        dot.addEventListener("click", () => goTo(i));
        dotsEl.appendChild(dot);
      }
    });

    function goTo(idx) {
      current = (idx + memories.length) % memories.length;
      track.style.transform = "translateX(-" + (current * 100) + "%)";
      if (dotsEl) {
        dotsEl.querySelectorAll(".carousel-dot").forEach((d, i) => d.classList.toggle("active", i === current));
      }
      clearInterval(autoPlay);
      autoPlay = setInterval(() => goTo(current + 1), 4000);
    }

    goTo(0);

    const prev = document.getElementById("carousel-prev");
    const next = document.getElementById("carousel-next");
    if (prev) prev.addEventListener("click", () => goTo(current - 1));
    if (next) next.addEventListener("click", () => goTo(current + 1));

    let swipeX = 0;
    track.addEventListener("touchstart", e => { swipeX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend",   e => {
      const dx = e.changedTouches[0].clientX - swipeX;
      if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
    });
  }

  /* ── PROMISES ── */
  const promisesData = [
    "I'll listen before reacting",
    "I'll communicate honestly",
    "I'll respect your feelings",
    "I'll make more memories with you",
    "I'll never stop choosing you"
  ];

  const promisesList = document.getElementById("promises-list");
  if (promisesList) {
    promisesData.forEach(text => {
      const li = document.createElement("li");
      li.className = "promise-item";
      li.innerHTML = "<span class='promise-check'>✔</span><span>" + text + "</span>";
      promisesList.appendChild(li);
    });

    const po = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("revealed"), i * 130);
          po.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    promisesList.querySelectorAll(".promise-item").forEach(p => po.observe(p));
  }

  /* ── MINI GAME ── */
  const gameHeart  = document.getElementById("game-heart");
  const gameArena  = document.getElementById("game-arena");
  const scoreCount = document.getElementById("score-count");
  const gameResult = document.getElementById("game-result");
  let gameScore    = Number(localStorage.getItem("gameScore") || 0);
  let gameDone     = localStorage.getItem("gameDone") === "true";

  function moveHeart() {
    if (!gameArena || !gameHeart) return;
    const margin = 40;
    const maxX = gameArena.offsetWidth  - margin * 2;
    const maxY = gameArena.offsetHeight - margin * 2;
    gameHeart.style.left = (margin + Math.random() * maxX) + "px";
    gameHeart.style.top  = (margin + Math.random() * maxY) + "px";
  }

  if (gameDone) {
    if (gameHeart) gameHeart.style.display = "none";
    if (gameResult) gameResult.removeAttribute("hidden");
  } else {
    moveHeart();
    if (scoreCount) scoreCount.textContent = gameScore;
  }

  if (gameHeart) {
    gameHeart.addEventListener("click", () => {
      if (gameDone) return;
      gameScore++;
      localStorage.setItem("gameScore", gameScore);
      if (scoreCount) scoreCount.textContent = gameScore;
      spawnFloatHeart(gameHeart.getBoundingClientRect());
      if (gameScore >= 5) {
        gameDone = true;
        localStorage.setItem("gameDone", "true");
        gameHeart.style.display = "none";
        if (gameResult) gameResult.removeAttribute("hidden");
        triggerConfetti();
      } else {
        moveHeart();
      }
    });
  }

  /* ── FORGIVENESS METER ── */
  const slider    = document.getElementById("forgiveness-slider");
  const meterMsg  = document.getElementById("meter-message");
  const meterFill = document.getElementById("meter-fill");

  const METER_MSGS = [
    { max: 10,  msg: "Sleeping on the couch 😭" },
    { max: 30,  msg: "Still in danger 😅" },
    { max: 55,  msg: "Making progress 😊" },
    { max: 80,  msg: "Almost there ❤️" },
    { max: 100, msg: "Date night unlocked 💕" }
  ];

  if (slider) {
    const saved = localStorage.getItem("forgivenessMeter");
    if (saved !== null) slider.value = saved;

    function updateMeter(val) {
      val = Number(val);
      if (meterFill) meterFill.style.width = val + "%";
      slider.style.setProperty("--slider-pct", val + "%");
      const entry = METER_MSGS.find(m => val <= m.max) || METER_MSGS[METER_MSGS.length - 1];
      if (meterMsg) meterMsg.textContent = entry.msg;
      localStorage.setItem("forgivenessMeter", val);
    }

    slider.addEventListener("input",  e => updateMeter(e.target.value));
    slider.addEventListener("change", e => updateMeter(e.target.value));
    updateMeter(slider.value);
  }

  /* ── BIG QUESTION ── */
  const btnYes    = document.getElementById("btn-yes");
  const btnMaybe  = document.getElementById("btn-maybe");
  const qResult   = document.getElementById("question-result");
  const qButtons  = document.getElementById("question-buttons");
  let maybeClicks = 0;
  let maybeAllowed = false;

  function runAway() {
    if (!qButtons || !btnMaybe || maybeAllowed) return;
    const maxX = Math.max(0, qButtons.offsetWidth  - btnMaybe.offsetWidth  - 20);
    const maxY = Math.max(0, qButtons.offsetHeight - btnMaybe.offsetHeight - 20);
    btnMaybe.style.position = "absolute";
    btnMaybe.style.left     = (Math.random() * maxX) + "px";
    btnMaybe.style.top      = (Math.random() * maxY) + "px";
  }

  if (btnMaybe) {
    btnMaybe.addEventListener("mouseenter", () => { if (!maybeAllowed) runAway(); });
    btnMaybe.addEventListener("touchstart",  e => { if (!maybeAllowed) { e.preventDefault(); runAway(); } }, { passive: false });
    btnMaybe.addEventListener("click", () => {
      maybeClicks++;
      if (maybeClicks >= 6 && !maybeAllowed) {
        maybeAllowed = true;
        btnMaybe.style.position = "relative";
        btnMaybe.style.left = "";
        btnMaybe.style.top  = "";
      } else if (maybeAllowed) {
        if (qResult) { qResult.textContent = "I'll keep trying until your answer becomes yes ❤️"; qResult.removeAttribute("hidden"); }
      } else {
        runAway();
      }
    });
  }

  if (btnYes) {
    btnYes.addEventListener("click", () => {
      triggerConfetti();
      triggerFireworks();
      const overlay = document.getElementById("yes-overlay");
      if (overlay) overlay.removeAttribute("hidden");
      document.body.style.overflow = "hidden";
    });
  }

  const closeOverlay = document.getElementById("close-overlay");
  if (closeOverlay) closeOverlay.addEventListener("click", () => {
    document.getElementById("yes-overlay").setAttribute("hidden", "");
    document.body.style.overflow = "";
  });

  /* ── CONFETTI ── */
  function triggerConfetti() {
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9980;";
    document.body.appendChild(canvas);
    const ctx    = canvas.getContext("2d");
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const COLORS = ["#f9a8d4","#c4b5fd","#fde68a","#a7f3d0","#fdba74","#ff80b5"];
    const pieces = [];
    for (let i = 0; i < 180; i++) {
      pieces.push({ x: Math.random() * canvas.width, y: -10 - Math.random() * 200,
        w: 6 + Math.random() * 10, h: 10 + Math.random() * 14,
        r: Math.random() * Math.PI * 2, dr: (Math.random() - 0.5) * 0.15,
        dx: (Math.random() - 0.5) * 3, dy: 3 + Math.random() * 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)], life: 1 });
    }
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let allDead = true;
      pieces.forEach(p => {
        if (p.life <= 0) return; allDead = false;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.fillStyle = p.color; ctx.globalAlpha = p.life;
        ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h); ctx.restore();
        p.x += p.dx; p.y += p.dy; p.r += p.dr;
        if (p.y > canvas.height) p.life -= 0.05;
      });
      if (allDead) { canvas.remove(); return; }
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ── FIREWORKS ── */
  function triggerFireworks() {
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9981;";
    document.body.appendChild(canvas);
    const ctx    = canvas.getContext("2d");
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const COLORS = ["#ff80b5","#c4b5fd","#fde68a","#a7f3d0"];
    const rockets = [];
    let frame = 0;

    function addRocket() {
      const x = 80 + Math.random() * (canvas.width - 160);
      const y = canvas.height * 0.65 + Math.random() * (canvas.height * 0.25);
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const parts = [];
      for (let i = 0; i < 60; i++) {
        const angle = (Math.PI * 2 / 60) * i;
        const speed = 2 + Math.random() * 4;
        parts.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
          life: 1, decay: 0.015 + Math.random() * 0.015 });
      }
      rockets.push({ parts, color });
    }

    for (let i = 0; i < 4; i++) setTimeout(addRocket, i * 350);

    function drawFW() {
      ctx.fillStyle = "rgba(0,0,0,0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      let active = false;
      rockets.forEach(r => {
        r.parts.forEach(p => {
          if (p.life <= 0) return; active = true;
          ctx.beginPath(); ctx.arc(p.x, p.y, 3 * p.life, 0, Math.PI * 2);
          ctx.fillStyle = r.color; ctx.globalAlpha = p.life; ctx.fill();
          p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.life -= p.decay;
        });
      });
      ctx.globalAlpha = 1; frame++;
      if (!active && frame > 60) { canvas.remove(); return; }
      requestAnimationFrame(drawFW);
    }
    drawFW();
  }

  /* ── FLOAT HEART ── */
  function spawnFloatHeart(rect) {
    const el = document.createElement("span");
    el.className = "float-heart";
    el.textContent = Math.random() > 0.5 ? "❤️" : "💕";
    el.style.cssText = "left:" + (rect.left + rect.width/2) + "px;top:" +
      (rect.top + rect.height/2 + window.scrollY) + "px;font-size:" + (14 + Math.random() * 16) + "px;";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4200);
  }

  document.addEventListener("click", (e) => {
    if (e.target.closest("#game-heart")) return;
    spawnFloatHeart({ left: e.clientX - 10, top: e.clientY - 10 + window.scrollY, width: 20, height: 20 });
  });

  /* ── COMPLIMENTS ── */
  const bubble = document.getElementById("compliment-bubble");
  if (bubble && quotes.length > 0) {
    function showCompliment() {
      bubble.textContent = quotes[Math.floor(Math.random() * quotes.length)];
      bubble.classList.add("show");
      setTimeout(() => bubble.classList.remove("show"), 3500);
    }
    setTimeout(showCompliment, 4000);
    setInterval(showCompliment, 10000);
  }

  /* ── EASTER EGG: type LOVE ── */
  let loveBuf = [];
  document.addEventListener("keydown", (e) => {
    loveBuf.push(e.key.toLowerCase());
    if (loveBuf.length > 4) loveBuf.shift();
    if (loveBuf.join("") === "love") {
      const ee = document.getElementById("easter-egg");
      if (ee) { ee.querySelector("p").textContent = "I love you infinitely ❤️"; ee.removeAttribute("hidden"); }
      loveBuf = [];
    }
  });

  /* ── TYPEWRITER ── */
  const heroSub = document.querySelector(".hero-sub");
  if (heroSub) {
    setTimeout(() => {
      const text  = heroSub.textContent.replace(/\s+/g, " ").trim();
      heroSub.textContent = "";
      heroSub.classList.add("typewriter");
      let i = 0;
      function type() {
        if (i < text.length) { heroSub.textContent += text[i++]; setTimeout(type, 35); }
        else heroSub.classList.remove("typewriter");
      }
      type();
    }, 1800);
  }

  console.info("❤️ v3 loaded — " + girlfriendName + " ❤️");
});
