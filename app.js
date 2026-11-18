/* =========================================================
   눈,그림 (NUNGRIM) — app.js
   - data/content.json 의 3개 국어 문구를 화면에 반영
   - 예약 링크: 한국어 → 카카오톡 / 일본어·영어 → LINE ID
   - 인플루언서 카드 · 갤러리 · 릴스 캐러셀 · FAQ 아코디언
   ========================================================= */
(function () {
  "use strict";

  /* ---------- 1. 기본값 ---------- */
  var URLS = {
    kakao: "https://pf.kakao.com/_HEyixj/chat",
    kakaoHome: "https://pf.kakao.com/_HEyixj",
    instagram: "https://www.instagram.com/nn.grim/",
    naver: "https://naver.me/5XpGfmaa",
    reserve: "https://pf.kakao.com/_HEyixj/chat"
  };

  var LINE_ID = "nn.grim";
  var LANG_KEY = "nngrim-lang";
  var CONTENT_KEY = "nngrim-content-v";

  var META = {
    kr: {
      lang: "ko",
      title: "눈,그림｜청담 수지눈썹 전문 · 강남 눈썹문신",
      desc: "청담 눈,그림. 손으로 점을 찍어 그리는 수지기법 눈썹 전문입니다. 원장 전여원이 상담부터 1차 시술, 리터치까지 직접 담당합니다. 청담역 12번 출구 도보 3분, 일요일 휴무."
    },
    jp: {
      lang: "ja",
      title: "눈,그림（ヌン・グリム）｜清潭 スジ眉毛専門 · 韓国アートメイク",
      desc: "清潭のスジ（手彫り）眉毛専門店 눈,그림。院長チョン・ヨウォンがカウンセリングから施術・リタッチまで一貫して担当します。清潭駅12番出口から徒歩3分、日曜定休。ご予約はLINEで。"
    },
    en: {
      lang: "en",
      title: "NUNGRIM｜Cheongdam suji brow atelier, Seoul",
      desc: "NUNGRIM is a suji (hand-drawn) brow studio in Cheongdam, Seoul. Artist Jeon Yeowon handles consultation, treatment and touch-up herself. Three minutes from Cheongdam Station exit 12, closed Sundays."
    }
  };

  var IG_PATH = "M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 5.3a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm0 7.4a2.9 2.9 0 1 1 0-5.8 2.9 2.9 0 0 1 0 5.8Zm5.7-7.6a1.05 1.05 0 1 1-2.1 0 1.05 1.05 0 0 1 2.1 0Z";

  var CONTENT = null;
  var lang = "kr";

  /* ---------- 2. 도구 ---------- */
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }
  function pick(v) {
    if (v === null || v === undefined) return "";
    if (typeof v === "string") return v;
    if (typeof v === "object") {
      if (v[lang] !== undefined && v[lang] !== null && String(v[lang]).trim() !== "") return String(v[lang]);
      if (v.kr !== undefined && v.kr !== null) return String(v.kr);
    }
    return "";
  }
  function getPath(path) {
    var parts = String(path).split("."), cur = CONTENT;
    for (var i = 0; i < parts.length; i++) {
      if (cur === null || cur === undefined) return null;
      cur = cur[parts[i]];
    }
    return cur;
  }
  function toast(msg) {
    var t = $("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("is-on");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.remove("is-on"); }, 2200);
  }

  /* ---------- 3. 링크 ---------- */
  function applyChannels() {
    if (CONTENT && CONTENT.channels) {
      Object.keys(CONTENT.channels).forEach(function (k) {
        if (typeof CONTENT.channels[k] === "string" && CONTENT.channels[k].trim()) URLS[k] = CONTENT.channels[k].trim();
      });
    }
    if (CONTENT && CONTENT.channels && CONTENT.channels.line) LINE_ID = CONTENT.channels.line;
    document.querySelectorAll("[data-line-id]").forEach(function (n) { n.textContent = LINE_ID; });

    document.querySelectorAll("[data-link]").forEach(function (a) {
      var key = a.getAttribute("data-link");
      if (key === "primary") return;
      var url = URLS[key];
      if (!url) return;
      a.setAttribute("href", url);
      if (/^https?:/i.test(url)) {
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener");
      } else {
        a.removeAttribute("target");
        a.removeAttribute("rel");
      }
    });
  }

  function applyPrimary() {
    var toLine = lang !== "kr";
    document.querySelectorAll('[data-link="primary"]').forEach(function (a) {
      a.classList.toggle("is-line", toLine);
      if (toLine) {
        a.setAttribute("href", "#line");
        a.removeAttribute("target");
        a.removeAttribute("rel");
      } else {
        a.setAttribute("href", URLS.kakao);
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener");
      }
      var label = a.querySelector("span:last-child") || a.querySelector("span");
      var text = toLine ? pick(getPath("ui.ctaPrimaryJp")) : pick(getPath("ui.ctaPrimaryKr"));
      if (label) label.innerHTML = text;
      else if (!a.querySelector("svg")) a.textContent = text;
    });
    var box = $("lineBox");
    if (box) box.hidden = !toLine;
    var hint = document.querySelector(".hero__line");
    if (hint) hint.hidden = !toLine;
  }

  /* ---------- 4. 문구 ---------- */
  function applyText() {
    if (!CONTENT) return;
    document.querySelectorAll("[data-content]").forEach(function (node) {
      var val = getPath(node.getAttribute("data-content"));
      var out = pick(val);
      if (out.trim() !== "") node.innerHTML = out;
    });
    document.querySelectorAll("[data-img]").forEach(function (node) {
      var src = getPath(node.getAttribute("data-img"));
      if (typeof src === "string" && src.trim() && node.getAttribute("src") !== src) node.src = src;
      var altPath = node.getAttribute("data-img-alt");
      if (altPath) {
        var alt = pick(getPath(altPath));
        if (alt.trim()) node.alt = alt;
      }
    });
    var kr = document.querySelector(".brand__kr"), en = document.querySelector(".brand__en");
    if (kr && en) en.style.display = (kr.textContent.trim() === en.textContent.trim()) ? "none" : "";
    var ld = document.querySelector('script[type="application/ld+json"]');
    if (ld) {
      try {
        var data = JSON.parse(ld.textContent);
        data.description = META[lang].desc;
        ld.textContent = JSON.stringify(data, null, 2);
      } catch (e) {}
    }
  }

  function applyMeta() {
    var m = META[lang] || META.kr;
    document.documentElement.setAttribute("lang", m.lang);
    document.title = m.title;
    var d = document.querySelector('meta[name="description"]');
    if (d) d.setAttribute("content", m.desc);
    var ot = document.querySelector('meta[property="og:title"]');
    if (ot) ot.setAttribute("content", m.title);
    var od = document.querySelector('meta[property="og:description"]');
    if (od) od.setAttribute("content", m.desc);
    var ol = document.querySelector('meta[property="og:locale"]');
    if (ol) ol.setAttribute("content", lang === "kr" ? "ko_KR" : lang === "jp" ? "ja_JP" : "en_US");
    document.querySelectorAll(".lang button").forEach(function (b) {
      var on = b.getAttribute("data-lang") === lang;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  /* ---------- 5. 렌더 ---------- */
  function renderStats() {
    var wrap = $("statsGrid");
    if (!wrap || !CONTENT || !Array.isArray(CONTENT.stats)) return;
    wrap.innerHTML = "";
    CONTENT.stats.forEach(function (s) {
      var box = el("div", "stat reveal");
      box.appendChild(el("p", "stat__num", pick(s.num)));
      var label = el("p", "stat__label");
      label.innerHTML = pick(s.label);
      box.appendChild(label);
      wrap.appendChild(box);
    });
  }

  function renderWorks() {
    var list = $("workList");
    if (!list || !CONTENT || !CONTENT.menu || !Array.isArray(CONTENT.menu.items)) return;
    list.innerHTML = "";
    CONTENT.menu.items.forEach(function (item) {
      var li = el("li", "work reveal");
      li.appendChild(el("span", "work__no", item.no || ""));
      var body = el("div", "work__body");
      body.appendChild(el("p", "work__en", item.en || ""));
      body.appendChild(el("h3", "work__name", pick(item.name)));
      body.appendChild(el("p", "work__desc", pick(item.desc)));
      if (pick(item.meta)) body.appendChild(el("p", "work__meta", pick(item.meta)));
      li.appendChild(body);
      list.appendChild(li);
    });
  }

  function renderInfluencers() {
    var grid = $("infGrid");
    var sec = $("influencers");
    if (!grid || !CONTENT || !CONTENT.influencers) return;
    var on = !CONTENT.sections || CONTENT.sections.influencers !== false;
    if (sec) sec.hidden = !on;
    if (!on) return;

    var items = (CONTENT.influencers.items || []).filter(function (it) { return it.visible !== false; });
    grid.innerHTML = "";
    items.forEach(function (it) {
      var handle = String(it.handle || "").replace(/^@/, "").trim();
      if (!handle) return;
      var url = it.url || ("https://www.instagram.com/" + handle + "/");
      var li = el("li", "inf__cell reveal");
      var a = el("a", "inf__card");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener";
      a.setAttribute("aria-label", "@" + handle + " — 인스타그램에서 보기");
      a.setAttribute("data-handle", handle);

      var media = el("span", "inf__media");
      var img = el("img");
      img.src = it.image || "";
      img.alt = "@" + handle + (pick(it.name) ? " · " + pick(it.name) : "");
      img.loading = "lazy";
      img.width = 600; img.height = 750;
      media.appendChild(img);
      var ig = el("span", "inf__ig");
      ig.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + IG_PATH + '"/></svg>';
      media.appendChild(ig);
      if (pick(it.tag)) media.appendChild(el("span", "inf__tag", pick(it.tag)));

      var body = el("span", "inf__body");
      body.appendChild(el("span", "inf__handle", "@" + handle));
      var meta = el("span", "inf__meta");
      var name = pick(it.name);
      if (name) meta.appendChild(el("span", "inf__name", name));
      if (it.followers) meta.appendChild(el("span", "inf__followers", it.followers + (lang === "kr" ? " 팔로워" : lang === "jp" ? " フォロワー" : " followers")));
      body.appendChild(meta);
      var cta = el("span", "inf__cta", pick(getPath("ui.seeAccount")));
      body.appendChild(cta);

      a.appendChild(media);
      a.appendChild(body);
      li.appendChild(a);
      grid.appendChild(li);
    });
  }

  function renderGallery() {
    var grid = $("galGrid");
    var sec = $("gallery");
    if (!grid || !CONTENT || !CONTENT.gallery) return;
    var on = !CONTENT.sections || CONTENT.sections.gallery !== false;
    if (sec) sec.hidden = !on;
    if (!on) return;
    grid.innerHTML = "";
    (CONTENT.gallery.items || []).forEach(function (it, i) {
      var a = el("a", "gal__item reveal");
      a.href = it.url || URLS.instagram;
      a.target = "_blank"; a.rel = "noopener";
      a.setAttribute("aria-label", pick(it.cap) + " — 인스타그램에서 보기");
      var media = el("span", "gal__media");
      var img = el("img");
      img.src = it.image || "";
      img.alt = pick(it.alt) || pick(it.cap);
      img.loading = "lazy";
      img.width = 760; img.height = 760;
      media.appendChild(img);
      a.appendChild(media);
      var cap = el("span", "gal__cap");
      cap.appendChild(el("span", "gal__cap-t", pick(it.cap)));
      cap.appendChild(el("span", "gal__cap-i", "Instagram ↗"));
      a.appendChild(cap);
      if (i === 0) a.classList.add("gal__item--wide");
      grid.appendChild(a);
    });
  }

  function renderPillars() {
    var list = $("pillars");
    if (!list || !CONTENT || !CONTENT.about || !Array.isArray(CONTENT.about.pillars)) return;
    list.innerHTML = "";
    CONTENT.about.pillars.forEach(function (p, i) {
      var li = el("li");
      li.appendChild(el("span", null, (i + 1 < 10 ? "0" : "") + (i + 1)));
      var box = el("div");
      box.appendChild(el("h3", null, pick(p.title)));
      box.appendChild(el("p", null, pick(p.desc)));
      li.appendChild(box);
      list.appendChild(li);
    });
  }

  function renderPrice() {
    var list = $("priceList");
    if (!list || !CONTENT || !CONTENT.price || !Array.isArray(CONTENT.price.items)) return;
    list.innerHTML = "";
    CONTENT.price.items.forEach(function (it) {
      var li = el("li", "price__row reveal");
      li.appendChild(el("span", "price__name", pick(it.name)));
      li.appendChild(el("span", "price__meta", pick(it.meta)));
      list.appendChild(li);
    });
  }

  function renderSteps() {
    var list = $("steps");
    if (!list || !CONTENT || !CONTENT.reserve || !Array.isArray(CONTENT.reserve.steps)) return;
    list.innerHTML = "";
    CONTENT.reserve.steps.forEach(function (s, i) {
      var li = el("li", "reveal");
      li.appendChild(el("span", "steps__no", (i + 1 < 10 ? "0" : "") + (i + 1)));
      li.appendChild(el("h3", null, pick(s.title)));
      li.appendChild(el("p", null, pick(s.desc)));
      list.appendChild(li);
    });
  }

  function renderFaq() {
    var wrap = $("faqList");
    var sec = $("faq");
    if (!wrap || !CONTENT || !CONTENT.faq) return;
    var on = !CONTENT.sections || CONTENT.sections.faq !== false;
    if (sec) sec.hidden = !on;
    if (!on) return;
    wrap.innerHTML = "";
    (CONTENT.faq.items || []).forEach(function (item, i) {
      var d = el("details", "faq__item reveal");
      if (i === 0) d.open = true;
      var s = el("summary", "faq__q");
      s.appendChild(el("span", "faq__q-t", pick(item.q)));
      s.appendChild(el("span", "faq__plus", ""));
      d.appendChild(s);
      var a = el("div", "faq__a");
      a.innerHTML = "<p>" + pick(item.a) + "</p>";
      d.appendChild(a);
      wrap.appendChild(d);
    });
  }

  /* ---------- 6. 릴스 ---------- */
  function renderReels() {
    var track = $("reelTrack");
    var sec = $("reels");
    if (!track || !CONTENT || !CONTENT.showcase) return;
    var on = !CONTENT.sections || CONTENT.sections.reels !== false;
    if (sec) sec.hidden = !on;
    if (!on) return;
    var reels = CONTENT.showcase.reels || [];
    track.innerHTML = "";
    reels.forEach(function (r, i) {
      var li = el("li", "reels__slide");
      li.setAttribute("role", "listitem");
      var a = el("a", "reel");
      a.href = r.url || URLS.instagram;
      a.target = "_blank"; a.rel = "noopener";
      a.setAttribute("aria-label", pick(r.title) + " — 인스타그램에서 보기");

      var media = el("span", "reel__media");
      if (r.video) {
        var v = el("video", "reel__video");
        v.src = r.video;
        if (r.poster) v.poster = r.poster;
        v.width = 720; v.height = 1280;
        v.muted = true; v.loop = true; v.playsInline = true;
        v.preload = "metadata";
        v.setAttribute("muted", "");
        v.setAttribute("loop", "");
        v.setAttribute("playsinline", "");
        v.setAttribute("aria-hidden", "true");
        v.tabIndex = -1;
        media.appendChild(v);
      }
      media.appendChild(el("span", "reel__no", "REEL " + (i + 1 < 10 ? "0" : "") + (i + 1)));
      var ig = el("span", "reel__ig");
      ig.setAttribute("aria-hidden", "true");
      ig.innerHTML = '<svg viewBox="0 0 24 24"><path d="' + IG_PATH + '"/></svg>';
      media.appendChild(ig);

      var meta = el("span", "reel__meta");
      meta.appendChild(el("span", "reel__t", pick(r.title)));
      meta.appendChild(el("span", "reel__d", pick(r.desc)));
      meta.appendChild(el("span", "reel__cta", "→"));
      a.appendChild(media);
      a.appendChild(meta);
      li.appendChild(a);
      track.appendChild(li);
    });
  }

  function initReels() {
    var root = $("reelsBox");
    if (!root) return;
    var viewport = $("reelViewport");
    var track = $("reelTrack");
    if (!viewport || !track || !track.children.length) return;

    var slides = Array.prototype.slice.call(track.children);
    var videos = Array.prototype.slice.call(track.querySelectorAll("video"));
    var prevBtn = $("reelPrev"), nextBtn = $("reelNext"), toggleBtn = $("reelToggle"), dotsWrap = $("reelDots");
    var reduce = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    var interval = 6000;
    var index = 0, maxIndex = Math.max(0, slides.length - 1);
    var userPaused = !!(reduce && reduce.matches), hovering = false, inView = false;
    var timer = null, holdTimer = null, frame = null;

    var dots = slides.map(function (s, i) {
      var b = el("button", "reels__dot");
      b.type = "button";
      b.setAttribute("aria-label", (i + 1) + " / " + slides.length);
      b.setAttribute("aria-current", i === 0 ? "true" : "false");
      b.addEventListener("click", function () { goTo(i); restart(); });
      if (dotsWrap) dotsWrap.appendChild(b);
      return b;
    });

    function step() {
      if (slides.length < 2) return 0;
      return slides[1].offsetLeft - slides[0].offsetLeft;
    }
    function positions() {
      var s = step();
      if (!s) return;
      var per = Math.max(1, Math.round(viewport.clientWidth / s));
      maxIndex = Math.max(0, slides.length - per);
    }
    function goTo(i, instant) {
      index = Math.max(0, Math.min(maxIndex, i));
      var left = slides[index].offsetLeft - slides[0].offsetLeft;
      var smooth = !instant && !(reduce && reduce.matches);
      try { viewport.scrollTo({ left: left, behavior: smooth ? "smooth" : "auto" }); }
      catch (e) { viewport.scrollLeft = left; }
      paint();
    }
    function paint() {
      dots.forEach(function (d, i) { d.setAttribute("aria-current", i === index ? "true" : "false"); });
    }
    function isVisible(slide) {
      var start = slide.offsetLeft - slides[0].offsetLeft;
      var left = viewport.scrollLeft, right = left + viewport.clientWidth;
      return start + slide.offsetWidth > left + 36 && start < right - 36;
    }
    function safePlay(v) {
      if (!v.paused) return;
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    }
    function playVisible() {
      var run = inView && !userPaused && !document.hidden;
      videos.forEach(function (v) {
        var slide = v.closest ? v.closest(".reels__slide") : null;
        if (run && slide && isVisible(slide)) safePlay(v);
        else if (!v.paused && v.readyState >= 2) v.pause();
      });
    }
    function tick() {
      if (userPaused || hovering || !inView || document.hidden) return;
      goTo(index + 1 > maxIndex ? 0 : index + 1);
    }
    function restart() {
      if (timer) clearInterval(timer);
      timer = setInterval(tick, interval);
    }
    function setToggle() {
      if (!toggleBtn) return;
      toggleBtn.setAttribute("aria-pressed", userPaused ? "true" : "false");
      toggleBtn.setAttribute("aria-label", userPaused ? "자동 넘김 다시 시작" : "자동 넘김 멈춤");
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(index - 1 < 0 ? maxIndex : index - 1); restart(); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(index + 1 > maxIndex ? 0 : index + 1); restart(); });
    if (toggleBtn) toggleBtn.addEventListener("click", function () {
      userPaused = !userPaused; setToggle(); playVisible(); restart();
    });

    root.addEventListener("pointerenter", function () { hovering = true; });
    root.addEventListener("pointerleave", function () { hovering = false; });
    root.addEventListener("focusin", function () { hovering = true; });
    root.addEventListener("focusout", function (e) { if (!root.contains(e.relatedTarget)) hovering = false; });
    root.addEventListener("touchstart", function () {
      hovering = true;
      if (holdTimer) clearTimeout(holdTimer);
    }, { passive: true });
    root.addEventListener("touchend", function () {
      if (holdTimer) clearTimeout(holdTimer);
      holdTimer = setTimeout(function () { hovering = false; }, 6000);
    }, { passive: true });

    viewport.addEventListener("scroll", function () {
      if (frame) return;
      frame = requestAnimationFrame(function () {
        frame = null;
        var s = step();
        if (s) {
          index = Math.max(0, Math.min(maxIndex, Math.round(viewport.scrollLeft / s)));
          paint();
        }
        playVisible();
      });
    }, { passive: true });

    viewport.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); goTo(index - 1 < 0 ? maxIndex : index - 1); restart(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); goTo(index + 1 > maxIndex ? 0 : index + 1); restart(); }
    });

    document.addEventListener("visibilitychange", playVisible);

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { inView = en.isIntersecting; playVisible(); });
      }, { threshold: 0.12 }).observe(root);
    } else { inView = true; }

    var rt = null;
    window.addEventListener("resize", function () {
      if (rt) clearTimeout(rt);
      rt = setTimeout(function () { positions(); goTo(index, true); playVisible(); }, 180);
    });

    if (reduce && reduce.addEventListener) {
      reduce.addEventListener("change", function (e) { userPaused = e.matches; setToggle(); playVisible(); });
    }

    positions(); paint(); setToggle(); restart();
    videos.forEach(function (v) { v.muted = true; });
    playVisible();
    setTimeout(playVisible, 600);
  }

  /* ---------- 7. 헤더·메뉴 ---------- */
  var hdr = $("hdr"), burger = $("burger"), body = document.body;

  var footerVisible = false;
  function onScroll() {
    if (hdr) hdr.classList.toggle("is-scrolled", window.scrollY > 10);
    var fab = document.querySelector(".fab");
    if (fab) {
      fab.classList.toggle("is-on", window.scrollY > 520 && !footerVisible);
      fab.classList.toggle("is-off", footerVisible);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  if ("IntersectionObserver" in window) {
    var ft = document.querySelector(".ft");
    if (ft) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { footerVisible = en.isIntersecting; });
        onScroll();
      }, { threshold: 0.02 }).observe(ft);
    }
  }
  onScroll();

  if (burger) {
    burger.addEventListener("click", function () {
      var open = body.classList.toggle("nav-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    });
  }
  document.querySelectorAll("#nav a").forEach(function (a) {
    a.addEventListener("click", function () {
      body.classList.remove("nav-open");
      if (burger) burger.setAttribute("aria-expanded", "false");
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && body.classList.contains("nav-open")) {
      body.classList.remove("nav-open");
      if (burger) burger.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- 8. LINE 복사 ---------- */
  function copyLine() {
    var text = LINE_ID;
    function done() { toast(pick(getPath("ui.copyDone")) + " · LINE ID " + text); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else { fallback(); }
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); done(); } catch (e) { toast("LINE ID: " + text); }
      document.body.removeChild(ta);
    }
  }
  document.addEventListener("click", function (e) {
    var copyBtn = e.target.closest ? e.target.closest("[data-copy-line]") : null;
    if (copyBtn) { e.preventDefault(); copyLine(); return; }
    var primary = e.target.closest ? e.target.closest('[data-link="primary"]') : null;
    if (primary && lang !== "kr") {
      e.preventDefault();
      copyLine();
      var box = $("lineBox");
      if (box) box.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  /* ---------- 9. 스크롤 리빌 ---------- */
  var observer = null;
  if ("IntersectionObserver" in window) {
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          observer.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.05 });
  }
  function initReveal() {
    var list = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (observer) list.forEach(function (n) { observer.observe(n); });
    else list.forEach(function (n) { n.classList.add("is-in"); });
  }
  /* 안전장치: 스크롤 없이 화면이 길게 캡처되거나 관찰이 늦어도 내용이 보이도록 */
  setTimeout(function () {
    document.querySelectorAll(".reveal:not(.is-in)").forEach(function (n) {
      var r = n.getBoundingClientRect();
      if (r.top < window.innerHeight * 1.2) n.classList.add("is-in");
    });
  }, 1800);

  /* ---------- 10. 언어 ---------- */
  function setLang(next, save) {
    if (!META[next]) next = "kr";
    lang = next;
    applyMeta();
    applyText();
    applyPrimary();
    renderStats();
    renderWorks();
    renderInfluencers();
    renderGallery();
    renderPillars();
    renderPrice();
    renderSteps();
    renderFaq();
    renderReels();
    initReveal();
    if (save) { try { localStorage.setItem(LANG_KEY, lang); } catch (e) {} }
    var u = new URL(window.location.href);
    if (lang === "kr") u.searchParams.delete("lang"); else u.searchParams.set("lang", lang);
    try { history.replaceState(null, "", u.toString()); } catch (e) {}
  }

  document.querySelectorAll(".lang button").forEach(function (b) {
    b.addEventListener("click", function () {
      setLang(b.getAttribute("data-lang"), true);
      document.documentElement.classList.remove("nav-open");
    });
  });

  /* ---------- 11. content.json ---------- */
  function loadContent() {
    var bust = "";
    try {
      var v = localStorage.getItem(CONTENT_KEY);
      if (v) bust = "?v=" + encodeURIComponent(v);
    } catch (e) {}
    return fetch("data/content.json" + bust, { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        if (!data || typeof data !== "object") throw new Error("invalid");
        CONTENT = data;
        return CONTENT;
      })
      .catch(function () { CONTENT = null; return null; });
  }

  function initialLang() {
    var q = null;
    try { q = new URLSearchParams(window.location.search).get("lang"); } catch (e) {}
    if (q && META[q]) return q;
    try {
      var s = localStorage.getItem(LANG_KEY);
      if (s && META[s]) return s;
    } catch (e) {}
    return "kr";
  }

  /* ---------- 12. 시작 ---------- */
  lang = initialLang();
  applyChannels();
  applyMeta();

  loadContent().then(function () {
    if (CONTENT) {
      applyChannels();
      applyText();
      renderStats();
      renderWorks();
      renderInfluencers();
      renderGallery();
      renderPillars();
      renderPrice();
      renderSteps();
      renderFaq();
      renderReels();
    }
    applyPrimary();
    initReveal();
    initReels();
    onScroll();
  });
})();
