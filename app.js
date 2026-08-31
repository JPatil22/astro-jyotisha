/**
 * Main Application Script - Jyotisha
 * Integrates Routing, Geolocation, Canvas Events, Sobel Edge Filters, and Astronomy Equations.
 */

import { 
  getJulianDate, 
  calculateGeocentricLongitude, 
  getZodiacSignFromLongitude, 
  getPreciseAscendant, 
  calculateCompatibility, 
  drawBirthChart, 
  ZODIAC_SIGNS,
  PLANET_DEFAULTS
} from './modules/astrology.js';

import { 
  DEFAULT_PALM_POINTS, 
  HAND_SHAPES, 
  PALM_MOUNTS, 
  drawDefaultHandOutline, 
  analyzePalmLines,
  runSobelCreaseDetection,
  snapPointToNearestEdge
} from './modules/palmistry.js';

import {
  calculateVedicProfile,
  VEDIC_NUMBER_INFO,
  NUMBER_RELATIONS
} from './modules/vedic-numerology.js';

import {
  VEDIC_GRAHAS,
  GRAHA_DEFAULTS,
  getAyanamsa,
  toSidereal,
  getLunarNodes,
  getNakshatra,
  getRashi,
  NAKSHATRAS,
  RASHIS,
  drawNorthIndianKundli,
  getHouseFromLagna,
  isManglikHouse,
  getNavamsaLongitude
} from './modules/jyotish.js';

import { calculateGunaMilan } from './modules/jyotish-milan.js';

import { calculateVimshottariDasha } from './modules/jyotish-dasha.js';

import { calculatePanchang, getChandraGochar } from './modules/jyotish-panchang.js';

import { detectDoshas } from './modules/jyotish-dosha.js';

import { drawCards } from './modules/tarot.js';

// ==========================================================================
// APP STATE & CONSTANTS
// ==========================================================================
const state = {
  user: {
    name: '',
    dob: '',
    time: '12:00',
    tz: '0',
    lat: 51.5074,
    lon: -0.1278
  },
  palmPoints: JSON.parse(JSON.stringify(DEFAULT_PALM_POINTS)),
  palmImage: null, // Image object for uploaded photo
  edgeMap: null,   // Calculated Sobel binary edge map
  draggedPoint: null, // { lineKey, index }
  tarotDrawn: []
};

// DOM Elements Cache
const dom = {
  // Navigation & starfields
  views: document.querySelectorAll('.view-section'),
  navLinks: document.querySelectorAll('.nav-menu a'),
  sidebar: document.getElementById('sidebar-nav'),
  menuToggle: document.getElementById('menu-toggle'),
  cosmicClock: document.getElementById('cosmic-clock'),
  starfield: document.getElementById('starfield'),
  
  // Dashboard
  quickName: document.getElementById('quick-name'),
  quickDob: document.getElementById('quick-dob'),
  quickSaveBtn: document.getElementById('quick-save-btn'),
  dashStatusPlaceholder: document.getElementById('dashboard-status-placeholder'),
  dashStatusContent: document.getElementById('dashboard-status-content'),
  dashSunSign: document.getElementById('dash-sun-sign'),
  dashLifePath: document.getElementById('dash-life-path'),
  dashElement: document.getElementById('dash-element'),
  dashDailyScope: document.getElementById('dash-daily-scope'),
  quickZodiacBadge: document.getElementById('quick-zodiac-badge'),
  
  // Astrology
  astroForm: document.getElementById('astrology-form'),
  astroName: document.getElementById('astro-name'),
  astroDob: document.getElementById('astro-dob'),
  astroTime: document.getElementById('astro-time'),
  astroTz: document.getElementById('astro-tz'),
  astroLat: document.getElementById('astro-lat'),
  astroLon: document.getElementById('astro-lon'),
  btnDetectGeo: document.getElementById('btn-detect-geo'),
  astroOutput: document.getElementById('astro-output'),
  astroPlacementsContainer: document.getElementById('astro-placements-container'),
  birthChartCanvas: document.getElementById('birth-chart-canvas'),
  compatSign1: document.getElementById('compat-sign1'),
  compatSign2: document.getElementById('compat-sign2'),
  calculateCompatBtn: document.getElementById('calculate-compat-btn'),
  compatOutput: document.getElementById('compat-output'),
  ringFillValue: document.getElementById('ring-fill-value'),
  compatScorePercent: document.getElementById('compat-score-percent'),
  compatCategory: document.getElementById('compat-category'),
  compatExplanation: document.getElementById('compat-explanation'),
  
  // Palmistry
  palmCanvas: document.getElementById('palm-canvas'),
  palmUpload: document.getElementById('palm-upload'),
  resetPalmPoints: document.getElementById('reset-palm-points'),
  snapPalmPoints: document.getElementById('snap-palm-points'),
  overlayToggleContainer: document.getElementById('overlay-toggle-container'),
  toggleCreaseOverlay: document.getElementById('toggle-crease-overlay'),
  handShapeSelect: document.getElementById('hand-shape-select'),
  handShapeTitle: document.getElementById('hand-shape-title'),
  handShapeTraits: document.getElementById('hand-shape-traits'),
  mountSelect: document.getElementById('mount-select'),
  mountInfo: document.getElementById('mount-info'),
  mountTitle: document.getElementById('mount-title'),
  mountTraits: document.getElementById('mount-traits'),
  btnGeneratePalm: document.getElementById('btn-generate-palm'),
  btnRePalm: document.getElementById('btn-re-palm'),
  palmReadingPlaceholder: document.getElementById('palm-reading-placeholder'),
  palmReadingResults: document.getElementById('palm-reading-results'),
  palmHeartType: document.getElementById('palm-heart-type'),
  palmHeartDesc: document.getElementById('palm-heart-desc'),
  palmHeadType: document.getElementById('palm-head-type'),
  palmHeadDesc: document.getElementById('palm-head-desc'),
  palmLifeType: document.getElementById('palm-life-type'),
  palmLifeDesc: document.getElementById('palm-life-desc'),
  palmFateType: document.getElementById('palm-fate-type'),
  palmFateDesc: document.getElementById('palm-fate-desc'),
  
  // Numerology
  numForm: document.getElementById('numerology-form'),
  numName: document.getElementById('num-name'),
  numDob: document.getElementById('num-dob'),
  numResults: document.getElementById('numerology-results'),
  valLifepath: document.getElementById('val-lifepath'),
  mathLifepath: document.getElementById('math-lifepath'),
  valDestiny: document.getElementById('val-destiny'),
  mathDestiny: document.getElementById('math-destiny'),
  valSoulurge: document.getElementById('val-soulurge'),
  mathSoulurge: document.getElementById('math-soulurge'),
  valPersonality: document.getElementById('val-personality'),
  mathPersonality: document.getElementById('math-personality'),
  numReadingTitle: document.getElementById('num-reading-title'),
  numReadingSummary: document.getElementById('num-reading-summary'),
  numReadingDesc: document.getElementById('num-reading-desc'),
  numReadingExtras: document.getElementById('num-reading-extras'),
  numReadingCareers: document.getElementById('num-reading-careers'),
  numReadingLove: document.getElementById('num-reading-love'),
  pythagoreanGrid: document.getElementById('pythagorean-grid'),
  
  // Tarot
  tarotSpreadSelect: document.getElementById('tarot-spread-select'),
  tarotShuffleBtn: document.getElementById('tarot-shuffle-btn'),
  tarotDrawBtn: document.getElementById('tarot-draw-btn'),
  deckPile: document.getElementById('deck-pile'),
  drawSlots: document.getElementById('draw-slots'),
  deckStatus: document.getElementById('deck-status'),
  tarotInstruction: document.getElementById('tarot-instruction'),
  tarotReadingPlaceholder: document.getElementById('tarot-reading-placeholder'),
  tarotReadingResults: document.getElementById('tarot-reading-results')
};

// Initialize app when DOM is fully ready
document.addEventListener('DOMContentLoaded', () => {
  initStarfield();
  initRouting();
  initClock();
  loadUserProfile();
  initAstrologySetup();
  initPalmistrySetup();
  initNumerologySetup();
  initTarotSetup();
  initDashboardExtras();

  // Mobile Navigation toggle
  dom.menuToggle.addEventListener('click', () => {
    dom.sidebar.classList.toggle('mobile-open');
  });
});

// ==========================================================================
// STARDUST BACKGROUNDS & CLOCKS
// ==========================================================================
function initStarfield() {
  const count = 120;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.style.position = 'absolute';
    star.style.width = Math.random() > 0.85 ? '2px' : '1px';
    star.style.height = star.style.width;
    star.style.background = '#ffffff';
    star.style.top = Math.random() * 100 + '%';
    star.style.left = Math.random() * 100 + '%';
    star.style.opacity = Math.random();
    star.style.animation = `twinkle ${2 + Math.random() * 5}s infinite ease-in-out`;
    star.style.animationDelay = Math.random() * 5 + 's';
    
    dom.starfield.appendChild(star);
  }
}

function initClock() {
  const zodiacSigns = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
  setInterval(() => {
    const now = new Date();
    const utcStr = now.toISOString().replace('T', ' ').substring(0, 19);
    
    // Simulate sidereal clock ticker
    const j2000 = new Date(2000, 0, 1);
    const diff = (now - j2000) / (1000 * 60 * 60 * 24);
    const siderealTime = ((diff * 0.985647 + 280.46) % 360) / 15;
    const h = Math.floor(siderealTime);
    const m = Math.floor((siderealTime - h) * 60);
    const s = Math.floor(((siderealTime - h) * 60 - m) * 60);
    
    const zodiacIcon = zodiacSigns[Math.floor((now.getMinutes() / 5)) % 12];
    dom.cosmicClock.innerHTML = `${zodiacIcon} UTC: ${utcStr} | LST: ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }, 1000);
}

// ==========================================================================
// ROUTING SYSTEM
// ==========================================================================
function initRouting() {
  const handleRoute = () => {
    let hash = window.location.hash || '#dashboard';
    dom.sidebar.classList.remove('mobile-open');

    dom.views.forEach(section => {
      if (`#${section.id.replace('-view', '')}` === hash) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });

    dom.navLinks.forEach(link => {
      if (link.getAttribute('href') === hash) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
    
    if (hash === '#palmistry') {
      setTimeout(redrawPalmCanvas, 50);
    }
  };

  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

// ==========================================================================
// STATE MANAGEMENT & LOCAL STORAGE
// ==========================================================================
function loadUserProfile() {
  const saved = localStorage.getItem('cosmic_user_profile');
  if (saved) {
    try {
      state.user = JSON.parse(saved);
      populateSavedForms();
      updateDashboardStatus();
    } catch (e) {
      console.error(e);
    }
  } else {
    // Autodetect browser timezone offset as default
    const offsetHours = -new Date().getTimezoneOffset() / 60;
    // Set matching option in timezone dropdown
    const select = dom.astroTz;
    for (let i = 0; i < select.options.length; i++) {
      if (parseFloat(select.options[i].value) === offsetHours) {
        select.selectedIndex = i;
        break;
      }
    }
  }

  dom.quickSaveBtn.addEventListener('click', () => {
    const name = dom.quickName.value.trim();
    const dob = dom.quickDob.value;
    if (!name || !dob) {
      alert("Name and Date of Birth required.");
      return;
    }
    state.user.name = name;
    state.user.dob = dob;
    
    localStorage.setItem('cosmic_user_profile', JSON.stringify(state.user));
    populateSavedForms();
    updateDashboardStatus();
  });
}

function populateSavedForms() {
  const { name, dob, tz, lat, lon } = state.user;
  dom.quickName.value = name || '';
  dom.quickDob.value = dob || '';
  
  dom.astroName.value = name || '';
  dom.astroDob.value = dob || '';
  if (tz !== undefined) dom.astroTz.value = tz;
  if (lat !== undefined) dom.astroLat.value = lat;
  if (lon !== undefined) dom.astroLon.value = lon;
  
  dom.numName.value = name || '';
  dom.numDob.value = dob || '';
}

function updateDashboardStatus() {
  const { name, dob, tz, lat, lon } = state.user;
  if (!name || !dob) return;

  dom.dashStatusPlaceholder.classList.add('hidden');
  dom.dashStatusContent.classList.remove('hidden');

  // Sidereal Surya Rashi (Sun sign) — needs only the date, so the dashboard can show it
  // from name + DOB alone. Moon sign, Nakshatra, Lagna and Dasha need birth time + place
  // and live in the Kundli tab.
  const dateObj = new Date(dob + 'T12:00:00Z');
  const jd = getJulianDate(dateObj.getUTCFullYear(), dateObj.getUTCMonth() + 1, dateObj.getUTCDate(), 12, 0);
  const T = (jd - 2451545.0) / 36525.0;

  const sunSidereal = toSidereal(calculateGeocentricLongitude('Sun', T), jd);
  const suryaRashi = getRashi(sunSidereal);

  const vedic = calculateVedicProfile(name, dob);
  const mulank = vedic.mulank ? vedic.mulank.value : '-';
  const bhagyank = vedic.bhagyank ? vedic.bhagyank.value : '-';

  dom.dashSunSign.innerText = suryaRashi.name;
  dom.dashLifePath.innerText = mulank;
  dom.dashElement.innerText = bhagyank;

  dom.dashDailyScope.innerText = `Namaste, ${name}. Your Surya Rashi is ${suryaRashi.name} (${suryaRashi.positionStr}). Add your birth time and place in the Kundli tab for your Moon sign, Nakshatra, Lagna, and Dasha.`;

  const info = VEDIC_NUMBER_INFO[mulank];
  dom.quickZodiacBadge.innerText = info ? `Mulank ${mulank} · ${info.planet}` : suryaRashi.name;
  dom.quickZodiacBadge.classList.remove('hidden');
}

// Current geocentric Sun/Moon (tropical + sidereal) for Panchang and Gochar.
function computeTodaySky() {
  const now = new Date();
  const jd = getJulianDate(now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes());
  const T = (jd - 2451545.0) / 36525.0;
  const sunTrop = calculateGeocentricLongitude('Sun', T);
  const moonTrop = calculateGeocentricLongitude('Moon', T);
  return { now, jd, sunTrop, moonTrop, sunSid: toSidereal(sunTrop, jd), moonSid: toSidereal(moonTrop, jd) };
}

// Today's Panchang (computed for the current instant).
function renderPanchang() {
  const sky = computeTodaySky();
  const p = calculatePanchang(sky.now, sky.sunSid, sky.moonSid, sky.sunTrop, sky.moonTrop);
  const set = (id, t) => { const e = document.getElementById(id); if (e) e.innerText = t; };
  set('panchang-vara', `${p.vara.name} · ${p.vara.english}`);
  set('panchang-tithi', p.tithi.label);
  set('panchang-nakshatra', `${p.nakshatra.name} · pada ${p.nakshatra.pada}`);
  set('panchang-yoga', p.yoga.name);
  set('panchang-karana', p.karana.name);
}

// Chandra Gochar (today's Moon transit) from a natal Rashi, written into a set of
// elements sharing `prefix` (e.g. 'rashifal' or 'kundli-gochar').
function renderGochar(natalRashiIndex, prefix) {
  const sky = computeTodaySky();
  const transitIdx = Math.floor(sky.moonSid / 30);
  const g = getChandraGochar(natalRashiIndex, transitIdx);
  const set = (id, t) => { const e = document.getElementById(id); if (e) e.innerText = t; };
  set(`${prefix}-transit`, `Moon transiting ${RASHIS[transitIdx].name} — house ${g.house} (${g.key}) from your Rashi`);
  set(`${prefix}-text`, g.text);
  const box = document.getElementById(`${prefix}-box`);
  if (box) {
    box.classList.remove('hidden', 'tone-good', 'tone-mixed', 'tone-challenging');
    box.classList.add(`tone-${g.tone}`);
  }
  const card = document.getElementById(`${prefix}-card`);
  if (card) { card.classList.remove('hidden'); card.style.display = ''; }
}

// Dosha analysis panel for the natal chart (Sade Sati uses today's transiting Saturn).
function renderDoshas(positions, lagnaSid) {
  const now = new Date();
  const jd = getJulianDate(now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes());
  const T = (jd - 2451545.0) / 36525.0;
  const saturnTransit = toSidereal(calculateGeocentricLongitude('Saturn', T), jd);

  const doshas = detectDoshas(positions, lagnaSid, saturnTransit);
  const list = document.getElementById('dosha-list');
  if (!list) return;
  list.innerHTML = '';
  doshas.forEach(d => {
    const row = document.createElement('div');
    row.className = 'dosha-item ' + (d.present ? 'is-present' : 'is-clear');
    row.innerHTML = `
      <div class="dosha-head">
        <span class="dosha-name">${d.name}</span>
        <span class="${d.present ? 'tag-dosha' : 'tag-clear'}">${d.present ? 'Present' : 'Clear'}</span>
      </div>
      <p class="dosha-detail">${d.detail}</p>`;
    list.appendChild(row);
  });
  const card = document.getElementById('dosha-card');
  if (card) card.classList.remove('hidden');
}

// Dashboard Panchang + Rashifal (Rashi picker) setup.
function initDashboardExtras() {
  renderPanchang();

  const sel = document.getElementById('rashifal-select');
  if (sel) {
    RASHIS.forEach((r, i) => {
      const opt = document.createElement('option');
      opt.value = i;
      opt.innerText = `${r.name} (${r.english})`;
      sel.appendChild(opt);
    });
    const update = () => renderGochar(parseInt(sel.value, 10), 'rashifal');
    sel.addEventListener('change', update);
    update();
  }
}

// ==========================================================================
// KUNDLI (VEDIC ASTROLOGY)
// ==========================================================================
function initAstrologySetup() {
  // Bind GPS geolocation lookup
  dom.btnDetectGeo.addEventListener('click', () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    const geoLabel = document.getElementById('geo-btn-label');
    const setLabel = (t) => { if (geoLabel) geoLabel.innerText = t; };
    setLabel("Locating...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        dom.astroLat.value = pos.coords.latitude.toFixed(4);
        dom.astroLon.value = pos.coords.longitude.toFixed(4);
        setLabel("Detected");
        setTimeout(() => setLabel("GPS Detect"), 2000);
      },
      (err) => {
        alert("GPS detection failed: " + err.message);
        setLabel("GPS Detect");
      }
    );
  });

  // Populate Guna Milan (Kundli matching) dropdowns: Nakshatra + Rashi for each partner.
  const milanNakSelects = ['milan-groom-nak', 'milan-bride-nak'];
  const milanRashiSelects = ['milan-groom-rashi', 'milan-bride-rashi'];
  milanNakSelects.forEach(id => {
    const sel = document.getElementById(id);
    NAKSHATRAS.forEach((nak, i) => {
      const opt = document.createElement('option');
      opt.value = i;
      opt.innerText = `${i + 1}. ${nak.name}`;
      sel.appendChild(opt);
    });
  });
  milanRashiSelects.forEach(id => {
    const sel = document.getElementById(id);
    RASHIS.forEach((rashi, i) => {
      const opt = document.createElement('option');
      opt.value = i;
      opt.innerText = `${rashi.symbol} ${rashi.name} (${rashi.english})`;
      sel.appendChild(opt);
    });
  });

  dom.astroForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = dom.astroName.value.trim();
    const dob = dom.astroDob.value;
    const time = dom.astroTime.value;
    const tz = parseFloat(dom.astroTz.value);
    const lat = parseFloat(dom.astroLat.value);
    const lon = parseFloat(dom.astroLon.value);

    // Save profile state
    state.user = { name, dob, time, tz, lat, lon };
    localStorage.setItem('cosmic_user_profile', JSON.stringify(state.user));
    updateDashboardStatus();

    // 1. Julian Date conversion (UT corrected)
    // The user enters a LOCAL birth time plus a timezone offset (hours east of UTC,
    // e.g. tz = 5.5 means UTC+05:30). Universal Time = local time - offset. Because
    // Julian Date is continuous, we take the JD at 00:00 UT of the birth date and add
    // the (local hour - offset) as a fraction of a day; this handles day rollover on
    // its own, so no Date parsing (which would silently use the browser's own zone).
    const [hour, minute] = time.split(':').map(Number);
    const [birthYear, birthMonth, birthDay] = dob.split('-').map(Number);
    const utDayFraction = ((hour + minute / 60) - tz) / 24;

    const jd = getJulianDate(birthYear, birthMonth, birthDay, 0, 0) + utDayFraction;
    const T = (jd - 2451545.0) / 36525.0;

    // 2. Compute exact longitude coordinates for all planets
    // VEDIC (sidereal) chart: 9 grahas incl. Rahu/Ketu, positions in the sidereal zodiac.
    const nodes = getLunarNodes(T);
    const ayanamsa = getAyanamsa(jd);
    const positions = {}; // sidereal longitudes, keyed by graha

    dom.astroPlacementsContainer.innerHTML = '';

    // Compute the Lagna (Ascendant) first so we can show the Janma summary at the top.
    const ascendantLon = getPreciseAscendant(jd, lon, lat);
    const ascSidereal = toSidereal(ascendantLon, jd);
    const lagnaRashi = getRashi(ascSidereal);
    const moonSidereal = toSidereal(calculateGeocentricLongitude('Moon', T), jd);
    const moonRashi = getRashi(moonSidereal);
    const moonNak = getNakshatra(moonSidereal);

    // Janma (birth) summary — the core Vedic identity.
    const summary = document.createElement('div');
    summary.className = 'vedic-janma-summary';
    summary.innerHTML = `
      <div class="janma-item"><span class="janma-lbl">Lagna (Ascendant)</span><strong>${lagnaRashi.name}</strong></div>
      <div class="janma-item"><span class="janma-lbl">Janma Rashi (Moon)</span><strong>${moonRashi.name}</strong></div>
      <div class="janma-item"><span class="janma-lbl">Janma Nakshatra</span><strong>${moonNak.name} <small>pada ${moonNak.pada}</small></strong></div>
      <div class="janma-item"><span class="janma-lbl">Ayanamsa (Lahiri)</span><strong>${ayanamsa.toFixed(3)}°</strong></div>
    `;
    dom.astroPlacementsContainer.appendChild(summary);

    // Lagna row
    const ascRow = document.createElement('div');
    ascRow.className = 'placement-item';
    ascRow.innerHTML = `
      <div class="pl-badge asc">Lg</div>
      <div class="pl-info">
        <strong>Lagna (Ascendant): ${lagnaRashi.positionStr}</strong>
        <p class="tagline">Rashi lord: ${lagnaRashi.lord} | Nakshatra: ${getNakshatra(ascSidereal).name} (pada ${getNakshatra(ascSidereal).pada})</p>
        <p class="details-desc">The Lagna is the sidereal sign rising on the eastern horizon — the first house of the Kundli.</p>
      </div>
    `;
    dom.astroPlacementsContainer.appendChild(ascRow);

    // The 9 grahas in sidereal positions
    VEDIC_GRAHAS.forEach((graha) => {
      let tropical;
      if (graha === 'Rahu') tropical = nodes.Rahu;
      else if (graha === 'Ketu') tropical = nodes.Ketu;
      else tropical = calculateGeocentricLongitude(graha, T);

      const sidereal = toSidereal(tropical, jd);
      positions[graha] = sidereal;

      const rashi = getRashi(sidereal);
      const nak = getNakshatra(sidereal);
      const d = GRAHA_DEFAULTS[graha];

      const row = document.createElement('div');
      row.className = 'placement-item';
      row.innerHTML = `
        <div class="pl-badge" style="border-color: ${d.color}; color: ${d.color}; background: rgba(255,255,255,0.02)">
          ${d.symbol}
        </div>
        <div class="pl-info">
          <strong>${graha} <small>(${d.sanskrit})</small>: ${rashi.positionStr}</strong>
          <p class="tagline" style="color: ${d.color}">Nakshatra ${nak.name} · pada ${nak.pada} · Rashi lord ${rashi.lord}</p>
        </div>
      `;
      dom.astroPlacementsContainer.appendChild(row);
    });

    // Show output box
    dom.astroOutput.classList.remove('hidden');

    // Draw the North-Indian square Kundli (D1 — positions are already sidereal)
    drawNorthIndianKundli(dom.birthChartCanvas, positions, ascSidereal);

    // Draw the Navamsa (D9) chart from each graha's navamsa position
    const navamsaPositions = {};
    Object.keys(positions).forEach(g => { navamsaPositions[g] = getNavamsaLongitude(positions[g]); });
    drawNorthIndianKundli(document.getElementById('navamsa-canvas'), navamsaPositions, getNavamsaLongitude(ascSidereal));

    // Dosha analysis (Manglik, Kaal Sarp, Sade Sati, Kemadruma, Guru Chandal, Grahan, Angarak)
    renderDoshas(positions, ascSidereal);

    // Chandra Gochar (today's Moon transit from this chart's Janma Rashi)
    renderGochar(moonRashi.index, 'kundli-gochar');

    // Prefill the Guna Milan "groom" fields from this chart's Moon (Janma Rashi/Nakshatra)
    const groomNakSel = document.getElementById('milan-groom-nak');
    const groomRashiSel = document.getElementById('milan-groom-rashi');
    if (groomNakSel) groomNakSel.value = moonNak.index;
    if (groomRashiSel) groomRashiSel.value = moonRashi.index;

    // Vimshottari Dasha — from the natal Moon and birth instant (derived from the Julian Date)
    const birthDate = new Date((jd - 2440587.5) * 86400000);
    renderDasha(moonSidereal, birthDate);
  });

  // Draw an empty labelled Kundli on boot
  drawNorthIndianKundli(dom.birthChartCanvas, {}, 120);

  // Guna Milan (Kundli matching) handler
  const milanBtn = document.getElementById('calculate-milan-btn');
  if (milanBtn) {
    milanBtn.addEventListener('click', () => {
      const groom = {
        nak: parseInt(document.getElementById('milan-groom-nak').value, 10),
        rashi: parseInt(document.getElementById('milan-groom-rashi').value, 10)
      };
      const bride = {
        nak: parseInt(document.getElementById('milan-bride-nak').value, 10),
        rashi: parseInt(document.getElementById('milan-bride-rashi').value, 10)
      };
      const result = calculateGunaMilan(groom, bride);

      document.getElementById('milan-total-val').innerText = result.total;
      document.getElementById('milan-verdict').innerText = result.verdict;
      document.getElementById('milan-note').innerText = result.note;

      const doshas = [];
      if (result.nadiDosha) doshas.push('Nadi Dosha');
      if (result.bhakootDosha) doshas.push('Bhakoot Dosha');
      document.getElementById('milan-dosha').innerHTML = doshas.length
        ? `<svg class="ico"><use href="#i-alert"/></svg> ${doshas.join(' + ')} present — traditionally reviewed carefully.` : '';

      const list = document.getElementById('milan-koota-list');
      list.innerHTML = '';
      result.kootas.forEach(k => {
        const pct = (k.points / k.max) * 100;
        const row = document.createElement('div');
        row.className = 'koota-row';
        row.innerHTML = `
          <div class="koota-head">
            <span class="koota-name">${k.name}</span>
            <span class="koota-pts">${k.points}/${k.max}</span>
          </div>
          <div class="koota-bar"><div class="koota-fill" style="width:${pct}%"></div></div>
          <div class="koota-detail">${k.area} — ${k.detail}</div>
        `;
        list.appendChild(row);
      });

      document.getElementById('milan-output').classList.remove('hidden');
    });
  }
}

// Render the Vimshottari Dasha card: current Maha/Antar + timelines.
function renderDasha(moonSiderealLongitude, birthDate) {
  const dasha = calculateVimshottariDasha(moonSiderealLongitude, birthDate);
  const fmt = (d) => d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  const set = (id, text) => { const el = document.getElementById(id); if (el) el.innerText = text; };

  set('dasha-current-maha', dasha.currentMaha.lord);
  set('dasha-maha-range', `${fmt(dasha.currentMaha.start)} — ${fmt(dasha.currentMaha.end)}`);
  if (dasha.currentAntar) {
    set('dasha-current-antar', `${dasha.currentMaha.lord} → ${dasha.currentAntar.lord}`);
    set('dasha-antar-range', `${fmt(dasha.currentAntar.start)} — ${fmt(dasha.currentAntar.end)}`);
  }

  const mahaList = document.getElementById('dasha-maha-list');
  mahaList.innerHTML = '';
  dasha.mahadashas.forEach(m => {
    const row = document.createElement('div');
    row.className = 'dasha-row' + (m === dasha.currentMaha ? ' active' : '');
    row.innerHTML = `<span class="dasha-lord">${m.lord}</span><span class="dasha-dates">${fmt(m.start)} — ${fmt(m.end)}</span>`;
    mahaList.appendChild(row);
  });

  const antarList = document.getElementById('dasha-antar-list');
  antarList.innerHTML = '';
  dasha.antardashas.forEach(a => {
    const row = document.createElement('div');
    row.className = 'dasha-row' + (a === dasha.currentAntar ? ' active' : '');
    row.innerHTML = `<span class="dasha-lord">${dasha.currentMaha.lord} → ${a.lord}</span><span class="dasha-dates">${fmt(a.start)} — ${fmt(a.end)}</span>`;
    antarList.appendChild(row);
  });

  document.getElementById('dasha-output').classList.remove('hidden');
}

// ==========================================================================
// PALMISTRY & CREASE SCANNER STUDIO
// ==========================================================================
function initPalmistrySetup() {
  Object.keys(PALM_MOUNTS).forEach(key => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.innerText = PALM_MOUNTS[key].name;
    dom.mountSelect.appendChild(opt);
  });

  dom.mountSelect.addEventListener('change', () => {
    const val = dom.mountSelect.value;
    if (!val) {
      dom.mountInfo.classList.add('hidden');
      return;
    }
    dom.mountTitle.innerText = PALM_MOUNTS[val].name;
    dom.mountTraits.innerText = `This area governs ${PALM_MOUNTS[val].key}. A prominent, fleshy mount here suggests strong abundance of these traits. A flat or hollow mount suggests areas where you must actively direct focus.`;
    dom.mountInfo.classList.remove('hidden');
  });

  const updateHandShapeTraits = () => {
    const shape = dom.handShapeSelect.value;
    dom.handShapeTitle.innerText = HAND_SHAPES[shape].title;
    dom.handShapeTraits.innerHTML = `<strong>Appearance:</strong> ${HAND_SHAPES[shape].physical}<br><br><strong>Character:</strong> ${HAND_SHAPES[shape].traits}`;
  };
  dom.handShapeSelect.addEventListener('change', updateHandShapeTraits);
  updateHandShapeTraits();

  dom.resetPalmPoints.addEventListener('click', () => {
    state.palmPoints = JSON.parse(JSON.stringify(DEFAULT_PALM_POINTS));
    redrawPalmCanvas();
    if (!dom.palmReadingResults.classList.contains('hidden')) {
      runPalmAnalysis();
    }
  });

  // Snap Points to Creases button
  dom.snapPalmPoints.addEventListener('click', () => {
    if (!state.edgeMap) return;
    
    for (const [lineKey, linePoints] of Object.entries(state.palmPoints)) {
      for (let i = 0; i < linePoints.length; i++) {
        const snapped = snapPointToNearestEdge(linePoints[i].x, linePoints[i].y, state.edgeMap);
        state.palmPoints[lineKey][i].x = snapped.x;
        state.palmPoints[lineKey][i].y = snapped.y;
      }
    }
    
    redrawPalmCanvas();
    if (!dom.palmReadingResults.classList.contains('hidden')) {
      runPalmAnalysis();
    }
  });

  // Toggle Crease view checkbox
  dom.toggleCreaseOverlay.addEventListener('change', redrawPalmCanvas);

  dom.btnGeneratePalm.addEventListener('click', () => {
    dom.palmReadingPlaceholder.classList.add('hidden');
    dom.palmReadingResults.classList.remove('hidden');
    runPalmAnalysis();
  });

  dom.btnRePalm.addEventListener('click', () => {
    dom.palmReadingPlaceholder.classList.remove('hidden');
    dom.palmReadingResults.classList.add('hidden');
  });

  // Photo Uploader
  dom.palmUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        state.palmImage = img;
        
        // Run Sobel edge detector on load
        state.edgeMap = runSobelCreaseDetection(img, dom.palmCanvas.width, dom.palmCanvas.height);
        
        // Show scanning overlays and toggle options
        dom.snapPalmPoints.classList.remove('hidden');
        dom.overlayToggleContainer.classList.remove('hidden');
        dom.toggleCreaseOverlay.checked = true; // default to show edges initially
        
        redrawPalmCanvas();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });

  // Drag and drop event listeners
  const canvas = dom.palmCanvas;
  
  const getMousePos = (evt) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
    const clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;
    
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const handleStart = (e) => {
    e.preventDefault();
    const pos = getMousePos(e);
    const dragThreshold = 12;
    
    for (const [lineKey, linePoints] of Object.entries(state.palmPoints)) {
      for (let i = 0; i < linePoints.length; i++) {
        const p = linePoints[i];
        const dist = Math.sqrt(Math.pow(pos.x - p.x, 2) + Math.pow(pos.y - p.y, 2));
        if (dist <= dragThreshold) {
          state.draggedPoint = { lineKey, index: i };
          return;
        }
      }
    }
  };

  const handleMove = (e) => {
    if (!state.draggedPoint) return;
    e.preventDefault();
    const pos = getMousePos(e);
    
    const x = Math.max(0, Math.min(canvas.width, pos.x));
    const y = Math.max(0, Math.min(canvas.height, pos.y));
    
    state.palmPoints[state.draggedPoint.lineKey][state.draggedPoint.index].x = x;
    state.palmPoints[state.draggedPoint.lineKey][state.draggedPoint.index].y = y;
    
    redrawPalmCanvas();
    if (!dom.palmReadingResults.classList.contains('hidden')) {
      runPalmAnalysis();
    }
  };

  const handleEnd = () => { state.draggedPoint = null; };

  canvas.addEventListener('mousedown', handleStart);
  canvas.addEventListener('mousemove', handleMove);
  canvas.addEventListener('mouseup', handleEnd);
  canvas.addEventListener('mouseleave', handleEnd);
  
  canvas.addEventListener('touchstart', handleStart);
  canvas.addEventListener('touchmove', handleMove);
  canvas.addEventListener('touchend', handleEnd);
}

function redrawPalmCanvas() {
  const canvas = dom.palmCanvas;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  // 1. Draw Image Background or Silhouette outline
  if (state.palmImage) {
    const img = state.palmImage;
    const scale = Math.max(w / img.width, h / img.height);
    const x = (w - img.width * scale) / 2;
    const y = (h - img.height * scale) / 2;
    
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    
    ctx.fillStyle = 'rgba(3, 3, 11, 0.4)';
    ctx.fillRect(0, 0, w, h);

    // 2. Draw Sobel edge detection overlay if checked
    if (state.edgeMap && dom.toggleCreaseOverlay.checked) {
      const edgeImgData = ctx.createImageData(w, h);
      const edges = state.edgeMap.edges;
      for (let i = 0; i < edges.length; i++) {
        if (edges[i] === 1) {
          const idx = i * 4;
          edgeImgData.data[idx] = 0;       // Red
          edgeImgData.data[idx + 1] = 230; // Green
          edgeImgData.data[idx + 2] = 255; // Blue (Cyan glow)
          edgeImgData.data[idx + 3] = 160; // Alpha transparency
        }
      }
      
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = w;
      tempCanvas.height = h;
      tempCanvas.getContext('2d').putImageData(edgeImgData, 0, 0);
      
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#00ffff';
      ctx.drawImage(tempCanvas, 0, 0);
      ctx.shadowBlur = 0;
    }
  } else {
    drawDefaultHandOutline(ctx, w, h);
  }

  // 3. Draw connecting lines
  const drawLineCurve = (pts, strokeColor, shadowColor) => {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowBlur = 8;
    ctx.shadowColor = shadowColor;

    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    if (pts.length === 2) {
      ctx.lineTo(pts[1].x, pts[1].y);
    } else if (pts.length === 3) {
      ctx.quadraticCurveTo(pts[1].x, pts[1].y, pts[2].x, pts[2].y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  };

  drawLineCurve(state.palmPoints.heart, '#e11d48', '#e11d48');
  drawLineCurve(state.palmPoints.head, '#5b52e0', '#5b52e0');
  drawLineCurve(state.palmPoints.life, '#0f766e', '#0f766e');
  drawLineCurve(state.palmPoints.fate, '#334155', '#334155');

  // 4. Draw draggable handles
  for (const [lineKey, linePoints] of Object.entries(state.palmPoints)) {
    linePoints.forEach(p => {
      ctx.fillStyle = 'rgba(249, 115, 22, 0.25)';
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.arc(p.x, p.y, 8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#141a2e';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, 2 * Math.PI);
      ctx.fill();
    });
  }
}

function runPalmAnalysis() {
  const readings = analyzePalmLines(state.palmPoints);
  
  dom.palmHeartType.innerText = readings.heart.type;
  dom.palmHeartDesc.innerText = readings.heart.meaning;

  dom.palmHeadType.innerText = readings.head.type;
  dom.palmHeadDesc.innerText = readings.head.meaning;

  dom.palmLifeType.innerText = readings.life.type;
  dom.palmLifeDesc.innerText = readings.life.meaning;

  dom.palmFateType.innerText = readings.fate.type;
  dom.palmFateDesc.innerText = readings.fate.meaning;
}

// ==========================================================================
// NUMEROLOGY CALCULATOR TEMPLE
// ==========================================================================
function initNumerologySetup() {
  dom.numForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = dom.numName.value.trim();
    const dob = dom.numDob.value;

    if (!name || !dob) return;

    state.user.name = name;
    state.user.dob = dob;
    localStorage.setItem('cosmic_user_profile', JSON.stringify(state.user));
    updateDashboardStatus();

    dom.numResults.classList.remove('hidden');
    renderVedicNumerology(name, dob);
  });
}

// Render the Vedic (Ank Jyotish) block: Mulank, Bhagyank, Naamank, planets, and relations.
function renderVedicNumerology(name, dob) {
  const profile = calculateVedicProfile(name, dob);
  const set = (id, text) => { const el = document.getElementById(id); if (el) el.innerText = text; };

  const mulank = profile.mulank ? profile.mulank.value : null;
  const bhagyank = profile.bhagyank ? profile.bhagyank.value : null;
  const naamank = profile.naamank ? profile.naamank.value : null;

  const planetLabel = (n) => {
    const info = VEDIC_NUMBER_INFO[n];
    return info ? `${info.planet} (${info.sanskrit})` : '-';
  };

  if (mulank) {
    set('val-mulank', mulank);
    set('math-mulank', profile.mulank.breakdown);
    set('vedic-mulank-planet', planetLabel(mulank));
  }
  if (bhagyank) {
    set('val-bhagyank', bhagyank);
    set('math-bhagyank', profile.bhagyank.breakdown);
    set('vedic-bhagyank-planet', planetLabel(bhagyank));
  }
  if (naamank) {
    set('val-naamank', naamank);
    set('math-naamank', profile.naamank.breakdown);
    set('vedic-naamank-planet', planetLabel(naamank));
  }

  // Mulank interpretation
  const info = VEDIC_NUMBER_INFO[mulank];
  if (info) {
    set('vedic-mulank-title', `Mulank ${mulank} — ${info.title}, ruled by ${info.planet} (${info.sanskrit})`);
    set('vedic-mulank-desc', info.traits);
  }

  // Mulank + Bhagyank harmony
  const harmonyText = {
    self: `Your Mulank and Bhagyank are both ${mulank}. A doubled vibration: your inner nature and your destiny pull in the same direction, intensifying this number's strengths and its lessons alike.`,
    friend: `Your Mulank (${mulank}) and Bhagyank (${bhagyank}) are friendly numbers. Your core personality and your life's destiny support one another, giving a natural sense of flow and ease.`,
    neutral: `Your Mulank (${mulank}) and Bhagyank (${bhagyank}) are neutral to each other. Neither helps nor hinders strongly — your path is balanced, shaped more by your own choices than by fixed fortune.`,
    enemy: `Your Mulank (${mulank}) and Bhagyank (${bhagyank}) are challenging to each other. Your instincts and your destiny can feel at odds, creating inner tension that, once understood, becomes a source of growth.`
  };
  set('vedic-harmony-desc', harmonyText[profile.harmony] || '');

  // Friendly / neutral / enemy numbers for the Mulank
  const rel = NUMBER_RELATIONS[mulank];
  set('vedic-rel-base', mulank || '-');
  const fill = (id, arr) => {
    const el = document.getElementById(id);
    if (el) el.innerText = arr && arr.length ? arr.join(', ') : '—';
  };
  fill('vedic-friends', rel ? rel.friends : []);
  fill('vedic-neutral', rel ? rel.neutral : []);
  fill('vedic-enemies', rel ? rel.enemies : []);
}

// ==========================================================================
// TAROT
// ==========================================================================
function initTarotSetup() {
  dom.tarotShuffleBtn.addEventListener('click', () => {
    dom.deckPile.classList.add('shuffle-animate');
    dom.deckStatus.innerText = "Shuffling the stars...";
    dom.tarotDrawBtn.disabled = true;
    
    setTimeout(() => {
      dom.deckPile.classList.remove('shuffle-animate');
      dom.deckStatus.innerText = "Full Rider-Waite deck (78 cards) is aligned.";
      dom.tarotDrawBtn.disabled = false;
    }, 600);
  });

  dom.tarotDrawBtn.addEventListener('click', () => {
    const spreadType = parseInt(dom.tarotSpreadSelect.value, 10);
    state.tarotDrawn = drawCards(spreadType);
    
    dom.deckPile.classList.add('hidden');
    dom.drawSlots.classList.remove('hidden');
    dom.drawSlots.innerHTML = '';
    
    dom.tarotReadingPlaceholder.classList.remove('hidden');
    dom.tarotReadingResults.classList.add('hidden');
    dom.tarotReadingResults.innerHTML = '';
    
    dom.tarotInstruction.innerText = "Click on the card backings to flip and inspect.";

    state.tarotDrawn.forEach((card, index) => {
      const cardContainer = document.createElement('div');
      cardContainer.className = `tarot-card-container ${card.isReversed ? 'reversed' : ''}`;
      cardContainer.setAttribute('data-card-index', index);
      
      const label = spreadType === 3 ? ['PAST', 'PRESENT', 'FUTURE'][index] : 'DAILY CARD';

      cardContainer.innerHTML = `
        <div class="tarot-spread-label text-center">${label}</div>
        <div class="tarot-card-inner">
          <div class="tarot-card-back card-back"></div>
          <div class="tarot-card-front">
            <span class="card-face-header">${index + 1}</span>
            <div class="card-art-container">
              <svg viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="10" width="180" height="280" fill="none" stroke="currentColor" stroke-width="1.5" rx="5"/>
                ${card.svgDesign}
              </svg>
            </div>
            <div class="card-face-title text-center">${card.name}</div>
          </div>
        </div>
      `;

      cardContainer.addEventListener('click', () => {
        if (!cardContainer.classList.contains('flipped')) {
          cardContainer.classList.add('flipped');
          revealCardInterpretation(index);
        }
      });

      dom.drawSlots.appendChild(cardContainer);
    });
  });
}

function revealCardInterpretation(index) {
  const cards = document.querySelectorAll('.tarot-card-container');
  const flippedCount = document.querySelectorAll('.tarot-card-container.flipped').length;
  
  dom.tarotReadingPlaceholder.classList.add('hidden');
  dom.tarotReadingResults.classList.remove('hidden');
  
  const cardData = state.tarotDrawn[index];
  const labelText = cards.length === 3 ? ['Past Guidance', 'Present Currents', 'Future Guidance'][index] : 'Daily Guidance';

  const cardResultBlock = document.createElement('div');
  cardResultBlock.className = 'reading-block border-gold mb-1';
  cardResultBlock.innerHTML = `
    <span class="tagline text-blue">${labelText}</span>
    <h4 class="text-glow">${cardData.currentTitle}</h4>
    <strong class="text-white">Keywords: ${cardData.keywords.join(', ')}</strong>
    <p class="mt-1">${cardData.meaning}</p>
  `;
  
  dom.tarotReadingResults.appendChild(cardResultBlock);
  dom.tarotReadingResults.scrollTop = dom.tarotReadingResults.scrollHeight;

  if (flippedCount === cards.length) {
    dom.tarotInstruction.innerText = "All cards flipped. Read your full divination report on the right.";
  }
}
