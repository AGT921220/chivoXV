/**
 * Invitación digital — XV años
 * ================================
 * EDITAR AQUÍ: fechas, enlaces de Maps, rutas en images/, audio en music/.
 */

const CONFIG = {
  /**
   * Fecha y hora objetivo de la cuenta regresiva (hora local del dispositivo).
   * Formato: año, mes (0 = enero), día, hora, minuto, segundo
   */
  COUNTDOWN_TARGET: new Date(2026, 5, 13, 16, 0, 0),

  /** Enlace Google Maps — Misa */
  MAPS_MISA_URL:
    "https://www.google.com/maps/search/?api=1&query=Iglesia+del+Se%C3%B1or+de+los+Guerreros+Calle+Guadalupe+Victoria+y+12+1012+Villa+Ju%C3%A1rez",

  /** Enlace Google Maps — Recepción */
  MAPS_RECEPCION_URL:
    "https://www.google.com/maps/search/?api=1&query=Sal%C3%B3n+Royal+Titanic+Calle+Guadalupe+Victoria+y+9a+711+Villa+Ju%C3%A1rez",

  /** Archivo de música. Se reproduce desde 0:00 al abrir el cierre de invitación. */
  AUDIO_SRC: "music/no_crezcas_mas.mp3",

  /**
   * Imágenes en images/: 1.jpeg … 7.jpeg
   * HERO: 6 | RETRATO: 1 | GALERIA: 2,3,4,5,7
   */
  FOTOS: {
    HERO: "images/6.jpeg",
    RETRATO: "images/1.jpeg",
    GALERIA: [
      "images/2.jpeg",
      "images/3.jpeg",
      "images/4.jpeg",
      "images/5.jpeg",
      "images/7.jpeg",
    ],
  },
};

/* ---------- Audio: cierre de invitación (sobre) + música desde 0:00 (gesto del usuario) ---------- */
function initPuertaAudio() {
  const audio = document.getElementById("musica-fondo");
  const btn = document.getElementById("btn-musica");
  const gate = document.getElementById("audio-gate");
  const gateBtn = document.getElementById("audio-gate-accept");
  if (!audio || !btn) return;

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** Tiempo hasta revelar + play, alineado con la animación CSS del sobre */
  const OPEN_MS = reduceMotion ? 0 : 1900;

  const src = CONFIG.AUDIO_SRC;
  if (src) {
    const source = audio.querySelector("source");
    if (source) {
      source.src = src;
      audio.load();
    }
  }

  const syncBtn = () => {
    const playing = !audio.paused;
    btn.setAttribute("aria-pressed", playing ? "true" : "false");
    btn.classList.toggle("music-player__btn--playing", playing);
  };

  function playDesdeInicio() {
    try {
      audio.currentTime = 0;
    } catch {
      /* ignore */
    }
    return audio.play();
  }

  function cerrarPuerta() {
    if (!gate) return;
    gate.classList.remove("audio-gate--opening");
    gate.classList.remove("audio-gate--visible");
    gate.setAttribute("aria-hidden", "true");
    document.body.classList.remove("audio-gate-abierta");
    window.setTimeout(() => {
      gate.style.display = "none";
    }, 880);
  }

  function abrirExperiencia() {
    if (!gate || !gateBtn || gate.classList.contains("audio-gate--opening")) return;

    const finalizar = () => {
      playDesdeInicio()
        .then(() => {
          syncBtn();
          cerrarPuerta();
        })
        .catch(() => {
          gate.classList.remove("audio-gate--opening");
        });
    };

    if (reduceMotion) {
      finalizar();
      return;
    }

    gate.classList.add("audio-gate--opening");
    window.setTimeout(finalizar, OPEN_MS);
  }

  if (gate && gateBtn) {
    document.body.classList.add("audio-gate-abierta");
    gate.setAttribute("aria-hidden", "false");
    gateBtn.focus();

    const sobre = gate.querySelector(".audio-gate__sobre");
    const abrir = () => abrirExperiencia();
    if (sobre) sobre.addEventListener("click", abrir);
  }

  btn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().then(syncBtn).catch(() => {});
    } else {
      audio.pause();
      syncBtn();
    }
  });

  audio.addEventListener("play", syncBtn);
  audio.addEventListener("pause", syncBtn);
}

/* ---------- Rutas de fotos ---------- */
function initFotos() {
  const fotos = CONFIG.FOTOS;
  if (!fotos) return;

  const hero = document.getElementById("foto-hero");
  if (hero && fotos.HERO) hero.src = fotos.HERO;

  const retrato = document.getElementById("foto-retrato");
  if (retrato && fotos.RETRATO) retrato.src = fotos.RETRATO;

  document.querySelectorAll("img[data-gallery-index]").forEach((img) => {
    const idx = Number.parseInt(img.getAttribute("data-gallery-index"), 10);
    if (Number.isNaN(idx) || !fotos.GALERIA || fotos.GALERIA[idx] == null) return;
    img.src = fotos.GALERIA[idx];
  });
}

/** Galería: IntersectionObserver + escalonado al entrar en pantalla */
function initGaleriaObserver() {
  const section = document.getElementById("galeria-visual");
  const items = section ? section.querySelectorAll(".js-galeria-item") : [];
  if (!section || !items.length) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    items.forEach((el) => el.classList.add("gallery__cell--inview"));
    return;
  }

  let triggered = false;
  const activate = () => {
    if (triggered) return;
    triggered = true;
    items.forEach((el, i) => {
      window.setTimeout(() => {
        el.classList.add("gallery__cell--inview");
      }, i * 95);
    });
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activate();
          io.disconnect();
        }
      });
    },
    { root: null, threshold: 0.1, rootMargin: "0px 0px 8% 0px" }
  );

  io.observe(section);
}

/* ---------- Maps ---------- */
function initMapLinks() {
  const misa = document.querySelector(".js-map-misa");
  const recep = document.querySelector(".js-map-recepcion");
  if (misa) misa.href = CONFIG.MAPS_MISA_URL;
  if (recep) recep.href = CONFIG.MAPS_RECEPCION_URL;
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function updateCountdown() {
  const root = document.getElementById("countdown");
  if (!root) return;

  const now = Date.now();
  const end = CONFIG.COUNTDOWN_TARGET.getTime();
  let diff = Math.max(0, end - now);

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(diff / day);
  diff -= days * day;
  const hours = Math.floor(diff / hour);
  diff -= hours * hour;
  const minutes = Math.floor(diff / minute);
  diff -= minutes * minute;
  const seconds = Math.floor(diff / second);

  const set = (unit, value) => {
    const el = root.querySelector(`[data-unit="${unit}"]`);
    if (el) el.textContent = pad2(value);
  };

  set("days", days);
  set("hours", hours);
  set("minutes", minutes);
  set("seconds", seconds);
}

/** Scroll reveal con retardo escalonado por sección */
function initReveal() {
  const blocks = document.querySelectorAll(".reveal");
  if (!blocks.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    blocks.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  blocks.forEach((el, index) => {
    el.style.setProperty("--reveal-order", String(Math.min(index, 12)));
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { root: null, threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
  );

  blocks.forEach((el) => observer.observe(el));
}

function init() {
  initFotos();
  initPuertaAudio();
  initMapLinks();
  initGaleriaObserver();
  initReveal();
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
