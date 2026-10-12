/* =========================================================
   Glossy Events — interactions & animations
   GSAP 3.13 (ScrollTrigger + SplitText) · Lenis 1.3 · CSS scroll-driven
   ========================================================= */

// « réduire les animations » : on garde les apparitions douces,
// on coupe seulement ce qui bouge beaucoup (scroll fluide, parallaxe, ballons)
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;
const hasGsap = !!(window.gsap && window.ScrollTrigger);
const root = document.documentElement;
if (!hasGsap) root.classList.add("no-gsap");

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ---------- Données : les publications Instagram ---------- */
const P = "images/insta/";
const img = (name, alt) => ({ type: "img", src: `${P}${name}.jpg`, thumb: `${P}thumbs/${name}.jpg`, alt });
const vid = (file, poster, alt) => ({ type: "video", src: `images/video/${file}.mp4`, thumb: `${P}thumbs/${poster}.jpg`, alt });

const EVENTS = {
  eliyana: {
    title: "Eliyana · Berry First Birthday",
    type: "Anniversaire · 1 an",
    date: "14 septembre 2026",
    caption: "Un univers fraise tout en rouge et blanc, en plein air, pour le premier anniversaire d'Eliyana 🍓",
    short: "Berry First Birthday 🍓 un univers fraise en plein air.",
    media: [
      img("eliyana-1", "Backdrop fraises « Eliyana Berry First Birthday » et ballons rouges et blancs"),
      img("eliyana-2", "Backdrop en forme de cœur avec chiffre 1 géant"),
      vid("reel-juin", "eliyana-2", "Reel de l'installation Berry First Birthday"),
    ],
  },
  dcte: {
    title: "DCTE School",
    type: "Formation · DCTE School",
    date: "11 mai 2026",
    caption: "Retour sur ce décor découvert pendant la formation DCTE School : lettres lumineuses XXL, structures de ballons, zèbre et fleurs fraîches ✨",
    short: "Lettres lumineuses XXL, ballons et zèbre ✨",
    media: [
      img("dcte-6", "Lettres lumineuses DCTE entourées de ballons"),
      img("dcte-2", "Lettres DCTE lumineuses vertes et roses et ballons"),
      img("dcte-1", "Podium rose, motif zèbre et ballons"),
      img("dcte-3", "Bouquet de tulipes et roses avec boule à facettes"),
      img("dcte-4", "Fleurs rouges, cubes zèbre et boules à facettes"),
      img("dcte-5", "Structure de ballons roses et verts devant un mur de motivation"),
      img("dcte-7", "Tunnel de ballons lumineux « Impossible »"),
      vid("reel-dcte", "dcte-8", "Reel des lettres lumineuses DCTE"),
      vid("reel-mai", "dcte-9", "Reel fleurs et motif zèbre"),
    ],
  },
  zayn: {
    title: "Zayn is One",
    type: "Anniversaire · 1 an",
    date: "6 avril 2026",
    caption: "Bleu ciel, vichy et petites oies : une table champêtre toute en douceur pour le premier anniversaire de Zayn 🤍",
    short: "Bleu ciel, vichy et petites oies 🤍",
    media: [
      img("zayn-3", "Table dressée bleu ciel et vichy devant le décor Zayn is One"),
      img("zayn-2", "Panneau Zayn is One, arbre en ballons verts et oie"),
      img("zayn-1", "Arche de ballons pastel, fenêtre et chiffre 1"),
      img("zayn-4", "Oie décorative et bouquet de fleurs des champs"),
    ],
  },
};

/* ---------- Icônes ---------- */
const ICON = {
  heart: '<svg viewBox="0 0 24 24"><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.4 4.5 6.9 4.5c2 0 3.3 1 5.1 3 1.8-2 3.1-3 5.1-3 3.5 0 5.5 3.5 4.2 6.8-1.8 4.6-9.3 9.2-9.3 9.2z"/></svg>',
  comment: '<svg viewBox="0 0 24 24"><path d="M20.5 11.6a8.4 8.4 0 0 1-12.3 7.5L3.5 20.5l1.4-4.6A8.4 8.4 0 1 1 20.5 11.6z"/></svg>',
  send: '<svg viewBox="0 0 24 24"><path d="M21.5 3.5L10 14M21.5 3.5l-7 17-4.5-6.5-6.5-4.5 18-6z"/></svg>',
  save: '<svg viewBox="0 0 24 24"><path d="M18.5 20.5L12 15.8l-6.5 4.7V4.8c0-.7.6-1.3 1.3-1.3h10.4c.7 0 1.3.6 1.3 1.3z"/></svg>',
  prev: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
  next: '<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>',
};

/* ---------- Publication façon Instagram ---------- */
function postHTML(key, mode) {
  const ev = EVENTS[key];
  const photos = ev.media.filter((m) => m.type === "img");
  const n = photos.length;
  const feed = mode === "feed";
  return `
  <article class="ig-post" data-event="${key}">
    <header class="ig-post__head">
      <span class="ig-avatar"><span>G</span></span>
      <div><strong>glossy.events</strong><small>${ev.title}</small></div>
      <span class="ig-post__more" aria-hidden="true">•••</span>
    </header>
    <div class="ig-post__media">
      <div class="ig-slides">
        ${photos.map((m, i) => `<img src="${m.thumb}" alt="${m.alt}" ${i ? 'loading="lazy"' : ""} draggable="false">`).join("")}
      </div>
      ${n > 1 ? `
        <span class="ig-count">1/${n}</span>
        <button class="ig-arrow ig-arrow--prev" aria-label="Photo précédente" disabled>${ICON.prev}</button>
        <button class="ig-arrow ig-arrow--next" aria-label="Photo suivante">${ICON.next}</button>` : ""}
      <span class="ig-burst" aria-hidden="true">${ICON.heart}</span>
    </div>
    <div class="ig-post__actions">
      <button class="ig-like" aria-label="J'aime" aria-pressed="false">${ICON.heart}</button>
      <button class="ig-comment" aria-label="Ouvrir la publication">${ICON.comment}</button>
      <button class="ig-share" aria-label="Partager">${ICON.send}</button>
      ${n > 1 ? `<span class="ig-pager" aria-hidden="true">${photos.map((_, i) => `<span${i ? "" : ' class="is-active"'}></span>`).join("")}</span>` : ""}
      <button class="ig-save" aria-label="Enregistrer" aria-pressed="false">${ICON.save}</button>
    </div>
    <div class="ig-post__body">
      ${feed ? `<span class="ig-post__title">${ev.title}</span>` : ""}
      <p class="ig-post__caption"><strong>glossy.events</strong>${feed ? ev.caption : ev.short}</p>
      ${feed ? `<button class="ig-post__open">Voir les ${ev.media.length} photos et vidéos</button>` : ""}
      <time class="ig-post__date">${ev.date}</time>
    </div>
  </article>`;
}

function bindPost(post) {
  const key = post.dataset.event;
  const slides = $(".ig-slides", post);
  const count = $(".ig-count", post);
  const pager = $$(".ig-pager span", post);
  const prev = $(".ig-arrow--prev", post);
  const next = $(".ig-arrow--next", post);
  const like = $(".ig-like", post);
  const burst = $(".ig-burst", post);
  const total = slides.children.length;
  let index = 0;

  const update = () => {
    index = Math.round(slides.scrollLeft / slides.clientWidth);
    if (count) count.textContent = `${index + 1}/${total}`;
    pager.forEach((d, i) => d.classList.toggle("is-active", i === index));
    if (prev) prev.disabled = index === 0;
    if (next) next.disabled = index === total - 1;
  };
  slides.addEventListener("scroll", update, { passive: true });
  const step = (dir) => slides.scrollBy({ left: dir * slides.clientWidth, behavior: "smooth" });
  prev?.addEventListener("click", (e) => { e.stopPropagation(); step(-1); });
  next?.addEventListener("click", (e) => { e.stopPropagation(); step(1); });

  const setLiked = (on) => {
    like.classList.toggle("is-liked", on);
    like.setAttribute("aria-pressed", String(on));
  };
  like.addEventListener("click", () => setLiked(!like.classList.contains("is-liked")));

  // simple clic → ouvre la galerie · double clic → ❤️ comme sur Instagram
  let timer = null;
  $(".ig-post__media", post).addEventListener("click", (e) => {
    if (e.target.closest(".ig-arrow")) return;
    if (timer) {
      clearTimeout(timer);
      timer = null;
      setLiked(true);
      burst.classList.remove("is-on");
      void burst.offsetWidth;
      burst.classList.add("is-on");
      return;
    }
    timer = setTimeout(() => {
      timer = null;
      Lightbox.open(key, mediaIndexOfPhoto(key, index), post);
    }, 260);
  });

  $(".ig-comment", post).addEventListener("click", () => Lightbox.open(key, 0, post));
  $(".ig-post__open", post)?.addEventListener("click", () => Lightbox.open(key, 0, post));
  $(".ig-save", post).addEventListener("click", (e) => {
    const b = e.currentTarget;
    const on = b.getAttribute("aria-pressed") !== "true";
    b.setAttribute("aria-pressed", String(on));
    $("svg", b).style.fill = on ? "var(--espresso)" : "";
  });
  $(".ig-share", post).addEventListener("click", async () => {
    const data = { title: `Glossy Events · ${EVENTS[key].title}`, url: "https://www.instagram.com/glossy.events/" };
    try {
      if (navigator.share) await navigator.share(data);
      else window.open(data.url, "_blank", "noopener");
    } catch (_) { /* partage annulé */ }
  });

  post.resetSlides = () => { slides.scrollLeft = 0; update(); };
}

function mediaIndexOfPhoto(key, photoIndex) {
  const photo = EVENTS[key].media.filter((m) => m.type === "img")[photoIndex];
  return Math.max(0, EVENTS[key].media.indexOf(photo));
}

/* ---------- Fil des réalisations ---------- */
const feed = $("#feed");
feed.innerHTML = ["eliyana", "dcte", "zayn"].map((k) => postHTML(k, "feed")).join("");
$$(".ig-post", feed).forEach(bindPost);

/* ---------- Pile de publications (hero) ---------- */
const stack = $("#stack");
stack.innerHTML = ["dcte", "eliyana", "zayn"].map((k) => postHTML(k, "stack")).join("");
const stackPosts = $$(".ig-post", stack);
stackPosts.forEach((p, i) => { p.dataset.pos = String(i); bindPost(p); });

let stackOrder = [...stackPosts];
let stackPaused = false;
stack.addEventListener("mouseenter", () => (stackPaused = true));
stack.addEventListener("mouseleave", () => (stackPaused = false));
stack.addEventListener("focusin", () => (stackPaused = true));
stack.addEventListener("focusout", () => (stackPaused = false));

function cycleStack() {
  if (stackPaused || document.hidden || Lightbox.isOpen) return;
  const [front, second, third] = stackOrder;
  front.dataset.pos = "out";
  second.dataset.pos = "0";
  third.dataset.pos = "1";
  setTimeout(() => { front.dataset.pos = "2"; front.resetSlides(); }, 650);
  stackOrder = [second, third, front];
}
let stackTimer = null;
const startStack = () => { if (!stackTimer) stackTimer = setInterval(cycleStack, 4200); };

/* ---------- Galerie horizontale ---------- */
const hTrack = $("#hscroll-track");
const allPhotos = [];
const lists = Object.entries(EVENTS).map(([key, ev]) => ev.media.map((m, i) => ({ key, i, m })).filter((x) => x.m.type === "img"));
for (let r = 0; lists.some((l) => l[r]); r++) lists.forEach((l) => l[r] && allPhotos.push(l[r]));
hTrack.innerHTML = allPhotos.map(({ key, i, m }) => `
  <figure class="hs-item" data-event="${key}" data-index="${i}" tabindex="0" role="button" aria-label="Agrandir : ${m.alt}">
    <img src="${m.thumb}" alt="${m.alt}" loading="lazy" draggable="false">
    <figcaption>${EVENTS[key].title}</figcaption>
  </figure>`).join("");
$$(".hs-item", hTrack).forEach((item) => {
  const open = () => Lightbox.open(item.dataset.event, Number(item.dataset.index), item);
  item.addEventListener("click", open);
  item.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
});

/* ---------- Reels : lecture auto quand visibles ---------- */
const reels = $$(".reel");
const reelIO = new IntersectionObserver((entries) => entries.forEach(({ target, isIntersecting }) => {
  const v = $("video", target);
  if (isIntersecting) {
    v.preload = "auto";
    v.play().then(() => target.classList.add("is-playing")).catch(() => {});
  } else {
    v.pause();
    target.classList.remove("is-playing");
  }
}), { threshold: 0.45 });
reels.forEach((r) => {
  reelIO.observe(r);
  r.addEventListener("click", () => {
    const key = r.dataset.event;
    const i = EVENTS[key].media.findIndex((m) => m.src === r.dataset.video);
    Lightbox.open(key, Math.max(0, i), r);
  });
});

/* =========================================================
   LIGHTBOX — publication plein écran façon Instagram
   ========================================================= */
const Lightbox = (() => {
  const el = $("#lb");
  const track = $("#lb-track");
  const dots = $("#lb-dots");
  const thumbs = $("#lb-thumbs");
  const prev = $("#lb-prev");
  const next = $("#lb-next");
  let media = [];
  let i = 0;
  let opener = null;
  let closeTimer = null;
  const api = { isOpen: false };

  const pad = (n) => String(n).padStart(2, "0");

  function render(key) {
    const ev = EVENTS[key];
    media = ev.media;
    $("#lb-type").textContent = ev.type;
    $("#lb-title").textContent = ev.title;
    $("#lb-desc").textContent = ev.caption;
    $("#lb-total").textContent = pad(media.length);
    track.innerHTML = media.map((m) => `<div class="lb__slide">${
      m.type === "img"
        ? `<img src="${m.src}" alt="${m.alt}" draggable="false">`
        : `<video src="${m.src}" poster="${m.thumb}" controls playsinline preload="metadata" aria-label="${m.alt}"></video>`
    }</div>`).join("");
    dots.innerHTML = media.length > 1 ? media.map(() => "<span></span>").join("") : "";
    thumbs.innerHTML = media.map((m, n) => `<button class="${m.type === "video" ? "is-video" : ""}" aria-label="Afficher le média ${n + 1}"><img src="${m.thumb}" alt=""></button>`).join("");
    $$("button", thumbs).forEach((b, n) => b.addEventListener("click", () => go(n)));
  }

  function go(n) {
    i = Math.max(0, Math.min(media.length - 1, n));
    track.style.transform = `translateX(${-i * 100}%)`;
    $("#lb-current").textContent = pad(i + 1);
    $$("span", dots).forEach((d, k) => d.classList.toggle("is-active", k === i));
    $$("button", thumbs).forEach((b, k) => b.classList.toggle("is-active", k === i));
    prev.disabled = i === 0;
    next.disabled = i === media.length - 1;
    [...track.children].forEach((slide, k) => {
      const v = $("video", slide);
      if (!v) return;
      if (k === i) v.play().catch(() => { v.muted = true; v.play().catch(() => {}); });
      else v.pause();
    });
  }

  api.open = (key, index = 0, from = null) => {
    clearTimeout(closeTimer);
    opener = from || document.activeElement;
    render(key);
    el.hidden = false;
    track.classList.add("is-dragging");
    go(index);
    void track.offsetWidth;
    track.classList.remove("is-dragging");
    requestAnimationFrame(() => el.classList.add("is-open"));
    api.isOpen = true;
    lenis?.stop();
    root.style.overflow = "hidden";
    $(".lb__close", el).focus({ preventScroll: true });
  };

  api.close = (then) => {
    if (!api.isOpen) return;
    api.isOpen = false;
    el.classList.remove("is-open");
    $$("video", track).forEach((v) => v.pause());
    root.style.overflow = "";
    lenis?.start();
    closeTimer = setTimeout(() => {
      el.hidden = true;
      track.innerHTML = "";
      if (typeof then === "function") then();
      else opener?.focus?.({ preventScroll: true });
    }, 450);
  };

  prev.addEventListener("click", () => go(i - 1));
  next.addEventListener("click", () => go(i + 1));
  $$("[data-close]", el).forEach((b) => b.addEventListener("click", (e) => {
    const href = b.getAttribute("href");
    if (href) {
      e.preventDefault();
      api.close(() => scrollToTarget(href));
    } else api.close();
  }));

  document.addEventListener("keydown", (e) => {
    if (!api.isOpen) return;
    if (e.key === "Escape") api.close();
    if (e.key === "ArrowLeft") go(i - 1);
    if (e.key === "ArrowRight") go(i + 1);
    if (e.key === "Tab") {
      const f = $$("button:not([disabled]), a[href], video", el).filter((x) => x.offsetParent !== null);
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // glisser au doigt / à la souris
  const stage = $(".lb__stage", el);
  let startX = 0, dx = 0, dragging = false;
  stage.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button, video")) return;
    dragging = true; startX = e.clientX; dx = 0;
    track.classList.add("is-dragging");
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    dx = e.clientX - startX;
    const edge = (i === 0 && dx > 0) || (i === media.length - 1 && dx < 0) ? 0.3 : 1;
    track.style.transform = `translateX(calc(${-i * 100}% + ${dx * edge}px))`;
  });
  const end = () => {
    if (!dragging) return;
    dragging = false;
    track.classList.remove("is-dragging");
    if (Math.abs(dx) > 60) go(i + (dx < 0 ? 1 : -1));
    else go(i);
  };
  stage.addEventListener("pointerup", end);
  stage.addEventListener("pointercancel", end);

  return api;
})();

/* =========================================================
   Défilement fluide (Lenis) + ancres
   ========================================================= */
let lenis = null;
if (hasGsap && window.Lenis && !reduced) {
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

function scrollToTarget(hash) {
  const target = hash === "#top" ? 0 : $(hash);
  if (target === null) return;
  const behavior = reduced ? "auto" : "smooth";
  if (lenis) lenis.scrollTo(target, { duration: 1.5 });
  else if (target === 0) window.scrollTo({ top: 0, behavior });
  else target.scrollIntoView({ behavior });
}
$$('a[href^="#"]').forEach((a) => {
  if (a.hasAttribute("data-close")) return;
  a.addEventListener("click", (e) => {
    const hash = a.getAttribute("href");
    if (hash.length < 2) return;
    e.preventDefault();
    closeMenu();
    scrollToTarget(hash);
  });
});

/* ---------- Header : se cache en descendant, revient en remontant ---------- */
const header = $(".header");
header.insertAdjacentHTML("beforeend", '<span class="progress" aria-hidden="true"></span>');
let lastY = 0;
const onScroll = () => {
  const y = window.scrollY;
  header.classList.toggle("is-scrolled", y > 20);
  header.classList.toggle("is-hidden", y > 400 && y > lastY && !nav.classList.contains("is-open"));
  lastY = y;
};
window.addEventListener("scroll", onScroll, { passive: true });

/* ---------- Menu mobile ---------- */
const burger = $("#burger");
const nav = $("#nav");
function closeMenu() {
  burger.setAttribute("aria-expanded", "false");
  burger.setAttribute("aria-label", "Ouvrir le menu");
  nav.classList.remove("is-open");
  header.classList.remove("is-menu");
}
burger.addEventListener("click", () => {
  const open = burger.getAttribute("aria-expanded") !== "true";
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  nav.classList.toggle("is-open", open);
  header.classList.toggle("is-menu", open);
});

/* ---------- Boutons magnétiques ---------- */
if (finePointer && hasGsap) {
  $$("[data-magnetic]").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * 0.22, y: (e.clientY - r.top - r.height / 2) * 0.32, duration: 0.5, ease: "power3.out" });
    });
    btn.addEventListener("mouseleave", () => gsap.to(btn, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, .4)" }));
  });
}

/* ---------- Formulaire de devis ----------
   TODO : brancher à l'email de Sarah (Formspree, Netlify Forms…). */
const form = $("#devis");
const note = $("#form-note");
form.addEventListener("input", (e) => e.target.classList.remove("is-invalid"));
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let ok = true;
  $$("[required]", form).forEach((field) => {
    const valid = field.value.trim() !== "" && field.checkValidity();
    field.classList.toggle("is-invalid", !valid);
    if (!valid) ok = false;
  });
  if (!ok) {
    note.textContent = "Merci de renseigner votre nom et un email valide.";
    return;
  }
  note.textContent = "Merci ! Votre demande est prête à être envoyée (formulaire de démo, à brancher).";
  form.reset();
});

$("#year").textContent = new Date().getFullYear();

/* =========================================================
   ANIMATIONS GSAP
   ========================================================= */
if (!hasGsap) {
  $(".loader")?.remove();
  startStack();
} else {
  gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(SplitText);
  const ease = "expo.out";

  /* --- états initiaux du hero (cachés sous le loader) --- */
  gsap.set(".hero__title .line > span", { yPercent: 115 });
  gsap.set([".hero__eyebrow", ".hero__lead", ".hero__actions"], { y: 30, opacity: 0 });
  gsap.set(".hero__visual", { y: 180, rotate: -6, opacity: 0 });
  gsap.set(stackPosts, { opacity: 0 });
  gsap.set(".hero__badge", { scale: 0, rotate: -90 });
  gsap.set(".balloon", { scale: 0, opacity: 0 });
  gsap.set(".header", { yPercent: -100 });

  /* --- loader --- */
  const pageReady = Promise.race([
    new Promise((r) => (document.readyState === "complete" ? r() : window.addEventListener("load", r, { once: true }))),
    new Promise((r) => setTimeout(r, 2600)),
  ]);
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();

  const tl = gsap.timeline({ paused: true });
  tl.from(".loader__word span", { yPercent: 110, duration: 1, stagger: 0.06, ease })
    .from(".loader__script", { opacity: 0, x: -20, duration: 0.9, ease }, "-=.6")
    .to(".loader__bar span", { scaleX: 1, duration: 1.1, ease: "power2.inOut" }, 0);

  if (document.visibilityState === "hidden") {
    // page ouverte dans un onglet en arrière-plan : pas d'intro, tout s'affiche directement
    gsap.set(".loader", { display: "none" });
    heroIntro().progress(1);
  } else {
    fontsReady.then(() => {
      tl.play();
      Promise.all([pageReady, new Promise((r) => tl.eventCallback("onComplete", r))]).then(() => {
        gsap.timeline()
          .to(".loader", { clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "expo.inOut" })
          .set(".loader", { display: "none" })
          .add(heroIntro(), "-=.55");
      });
    });
  }

  function heroIntro() {
    return gsap.timeline({ onComplete: startStack })
      .to(".header", { yPercent: 0, duration: 1, ease, clearProps: "transform" }, 0)
      .to(".hero__title .line > span", { yPercent: 0, duration: 1.3, stagger: 0.12, ease }, 0)
      .to(".hero__eyebrow", { y: 0, opacity: 1, duration: 1, ease }, 0.1)
      .to([".hero__lead", ".hero__actions"], { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease }, 0.35)
      .to(".hero__visual", { y: 0, rotate: 0, opacity: 1, duration: 1.5, ease }, 0.15)
      .to(stackPosts.slice().reverse(), { opacity: 1, duration: 0.8, stagger: 0.15, ease: "power2.out", clearProps: "opacity" }, 0.25)
      .to(".hero__badge", { scale: 1, rotate: 0, duration: 1.2, ease: "back.out(1.6)" }, 0.8)
      .to(".balloon", { scale: 1, opacity: 1, duration: 1.4, stagger: 0.08, ease: "elastic.out(1, .6)" }, 0.6);
  }

  /* --- titres : révélation mot par mot (SplitText) --- */
  fontsReady.then(() => {
    $$("[data-split]").forEach((el) => {
      if (window.SplitText) {
        SplitText.create(el, {
          type: "lines,words",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) => gsap.from(self.words, {
            yPercent: 120, duration: 1.2, stagger: 0.07, ease,
            scrollTrigger: { trigger: el, start: "top 86%" },
          }),
        });
      } else {
        gsap.from(el, { y: 50, opacity: 0, duration: 1.2, ease, scrollTrigger: { trigger: el, start: "top 86%" } });
      }
    });
    ScrollTrigger.refresh();
  });

  /* --- apparitions simples --- */
  $$("[data-fade]").forEach((el) => gsap.from(el, {
    y: 40, opacity: 0, duration: 1.2, ease,
    scrollTrigger: { trigger: el, start: "top 88%" },
  }));

  gsap.set("[data-stagger]", { y: 60, opacity: 0 });
  ScrollTrigger.batch("[data-stagger]", {
    start: "top 90%",
    once: true,
    onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease }),
  });

  /* --- images : rideau + dézoom --- */
  $$("[data-reveal]").forEach((el) => {
    const media = $("img, video", el);
    const t = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 85%" } });
    t.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" });
    if (media) t.from(media, { scale: 1.35, duration: 1.8, ease }, 0);
  });

  /* --- fil Instagram : cartes qui montent en cascade --- */
  gsap.from("#feed .ig-post", {
    y: 120, rotate: (i) => [-4, 0, 4][i % 3], opacity: 0, duration: 1.4, stagger: 0.14, ease,
    scrollTrigger: { trigger: "#feed", start: "top 85%" },
  });

  /* --- parallaxe --- */
  if (!reduced) $$("[data-speed]").forEach((el) => gsap.to(el, {
    y: Number(el.dataset.speed), ease: "none",
    scrollTrigger: { trigger: el.closest("section") || el, start: "top bottom", end: "bottom top", scrub: true },
  }));

  // la pile du hero s'éloigne doucement en scrollant
  gsap.to("#stack", {
    y: -90, rotate: -4, scale: 0.94, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });
  gsap.to(".hero__text", {
    y: -60, opacity: 0.2, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "center center", end: "bottom top", scrub: true },
  });

  // ballons qui suivent la souris
  if (finePointer && !reduced) {
    const balloons = $$(".balloon").map((b) => ({ x: gsap.quickTo(b, "x", { duration: 1.4, ease: "power3" }), y: gsap.quickTo(b, "y", { duration: 1.4, ease: "power3" }), d: Number(b.dataset.depth) }));
    window.addEventListener("mousemove", (e) => {
      const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
      balloons.forEach((b) => { b.x(nx * b.d * 2); b.y(ny * b.d * 2); });
    }, { passive: true });
  }

  /* --- marquee piloté par la vitesse de scroll --- */
  const marquee = $(".marquee");
  marquee.classList.add("is-js");
  const rows = $$(".marquee__row", marquee).map((row) => {
    const track = $(".marquee__track", row);
    return { track, dir: Number(row.dataset.dir), x: 0, half: 0 };
  });
  const measure = () => rows.forEach((r) => (r.half = r.track.scrollWidth / 2));
  measure();
  window.addEventListener("resize", measure);
  let boost = 0;
  gsap.ticker.add((_, dt) => {
    const v = lenis ? lenis.velocity : 0;
    boost += (Math.min(Math.abs(v), 60) - boost) * 0.08;
    rows.forEach((r) => {
      if (!r.half) return;
      r.x += r.dir * (0.6 + boost * 0.25) * (dt / 16.7);
      r.x = gsap.utils.wrap(-r.half, 0, r.x);
      r.track.style.transform = `translate3d(${r.x}px,0,0) skewX(${(-r.dir * boost * 0.12).toFixed(2)}deg)`;
    });
  });

  /* --- galerie : les photos glissent pendant qu'on passe devant (sans bloquer le scroll) --- */
  const mm = gsap.matchMedia();
  mm.add("(min-width: 861px)", () => {
    const scrub = { trigger: ".hscroll", start: "top bottom", end: "bottom top", scrub: 0.8, invalidateOnRefresh: true };
    gsap.fromTo(hTrack, { x: () => innerWidth * 0.08 }, { x: () => -(hTrack.scrollWidth - innerWidth * 0.92), ease: "none", scrollTrigger: scrub });
    $$(".hs-item img", hTrack).forEach((im) => gsap.fromTo(im, { xPercent: -7 }, { xPercent: 7, ease: "none", scrollTrigger: scrub }));
  });

  /* --- reels : légère cascade au scroll --- */
  gsap.from(".reel", {
    y: 140, opacity: 0, duration: 1.4, stagger: 0.15, ease,
    scrollTrigger: { trigger: ".reels", start: "top 85%" },
  });

  /* --- étapes : la ligne se dessine --- */
  gsap.to(".steps__line span", {
    scaleX: 1, ease: "none",
    scrollTrigger: { trigger: ".steps", start: "top 80%", end: "bottom 55%", scrub: true },
  });

  /* --- compteurs --- */
  $$("[data-count]").forEach((el) => {
    const end = Number(el.dataset.count);
    const dec = Number(el.dataset.decimals || 0);
    const obj = { v: end > 1000 ? end - 20 : 0 };
    gsap.to(obj, {
      v: end, duration: 2, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 90%" },
      onUpdate: () => (el.textContent = obj.v.toFixed(dec).replace(".", ",")),
    });
  });

  /* --- grille Instagram : légère rotation d'entrée --- */
  gsap.from(".insta__item", {
    scale: 0.8, rotate: (i) => (i % 2 ? 6 : -6), opacity: 0, duration: 1.2, stagger: 0.08, ease,
    scrollTrigger: { trigger: ".insta__grid", start: "top 88%" },
  });

  /* --- footer : la signature monte --- */
  gsap.from(".footer__word", {
    yPercent: 60, opacity: 0, ease: "none",
    scrollTrigger: { trigger: ".footer", start: "top bottom", end: "bottom bottom", scrub: true },
  });
  gsap.from(".footer__script", {
    scale: 0.6, rotate: -12, opacity: 0, duration: 1.4, ease: "back.out(1.6)",
    scrollTrigger: { trigger: ".footer__brand", start: "top 80%" },
  });

  window.addEventListener("load", () => ScrollTrigger.refresh());
}
