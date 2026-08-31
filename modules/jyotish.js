/**
 * Jyotish (Vedic Astrology) Module - Jyotisha
 * Sidereal conversion (Lahiri Ayanamsa), the 9 grahas incl. Rahu/Ketu,
 * Nakshatras (27 lunar mansions) and Rashis (sidereal signs).
 *
 * Vedic astrology uses the SIDEREAL zodiac (fixed to the stars), not the tropical
 * zodiac of Western astrology. Sidereal longitude = tropical longitude - ayanamsa.
 * It also uses 9 grahas: Sun..Saturn plus Rahu & Ketu (the lunar nodes), and does
 * not use Uranus, Neptune, or Pluto.
 */

import { normalizeDegrees } from './astrology.js';

// The 9 Vedic grahas, in traditional order.
export const VEDIC_GRAHAS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

// Graha glyphs / colours for the chart (Rahu/Ketu added to the Western set elsewhere).
// Colours chosen to read well on BOTH the warm light cards and the parchment chart.
export const GRAHA_DEFAULTS = {
  Sun: { symbol: '☉', sanskrit: 'Surya', color: '#d68a00' },
  Moon: { symbol: '☽', sanskrit: 'Chandra', color: '#5b6bb0' },
  Mars: { symbol: '♂', sanskrit: 'Mangala', color: '#cf3a2e' },
  Mercury: { symbol: '☿', sanskrit: 'Budha', color: '#2e8b57' },
  Jupiter: { symbol: '♃', sanskrit: 'Guru', color: '#c47a00' },
  Venus: { symbol: '♀', sanskrit: 'Shukra', color: '#c13b82' },
  Saturn: { symbol: '♄', sanskrit: 'Shani', color: '#3a5bbf' },
  Rahu: { symbol: '☊', sanskrit: 'Rahu', color: '#6d3fb0' },
  Ketu: { symbol: '☋', sanskrit: 'Ketu', color: '#8a5a2b' }
};

// --------------------------------------------------------------------------
// Lahiri (Chitrapaksha) Ayanamsa — the offset between tropical and sidereal zodiacs.
// Anchored to 23.8506 deg at J2000.0 and advancing with precession (~50.2564"/yr).
// Validated against published Lahiri values (see test/jyotish.test.mjs).
// --------------------------------------------------------------------------
export function getAyanamsa(jd) {
  const years = (jd - 2451545.0) / 365.25;
  return 23.8506 + years * (50.2564 / 3600);
}

// Convert a tropical ecliptic longitude to sidereal for the given instant.
export function toSidereal(tropicalLongitude, jd) {
  return normalizeDegrees(tropicalLongitude - getAyanamsa(jd));
}

// --------------------------------------------------------------------------
// Rahu & Ketu — the Moon's mean lunar nodes (tropical longitude). Rahu is the
// ascending (north) node; Ketu is exactly opposite. Vedic astrology conventionally
// uses the MEAN node. Convert with toSidereal() for the sidereal position.
// --------------------------------------------------------------------------
export function getLunarNodes(T) {
  // Mean longitude of the ascending node (Meeus): retrograde, hence the negative rate.
  const omega = normalizeDegrees(125.04452 - 1934.136261 * T + 0.0020708 * T * T);
  return {
    Rahu: omega,
    Ketu: normalizeDegrees(omega + 180)
  };
}

// --------------------------------------------------------------------------
// Nakshatras — 27 lunar mansions of 13 deg 20' (13.3333 deg) each, with their
// Vimshottari dasha lords (needed later for the Dasha timeline) and padas.
// --------------------------------------------------------------------------
export const NAKSHATRAS = [
  { name: 'Ashwini', lord: 'Ketu', deity: 'Ashwini Kumaras' },
  { name: 'Bharani', lord: 'Venus', deity: 'Yama' },
  { name: 'Krittika', lord: 'Sun', deity: 'Agni' },
  { name: 'Rohini', lord: 'Moon', deity: 'Brahma' },
  { name: 'Mrigashira', lord: 'Mars', deity: 'Soma' },
  { name: 'Ardra', lord: 'Rahu', deity: 'Rudra' },
  { name: 'Punarvasu', lord: 'Jupiter', deity: 'Aditi' },
  { name: 'Pushya', lord: 'Saturn', deity: 'Brihaspati' },
  { name: 'Ashlesha', lord: 'Mercury', deity: 'Nagas' },
  { name: 'Magha', lord: 'Ketu', deity: 'Pitris' },
  { name: 'Purva Phalguni', lord: 'Venus', deity: 'Bhaga' },
  { name: 'Uttara Phalguni', lord: 'Sun', deity: 'Aryaman' },
  { name: 'Hasta', lord: 'Moon', deity: 'Savitar' },
  { name: 'Chitra', lord: 'Mars', deity: 'Tvashtar' },
  { name: 'Swati', lord: 'Rahu', deity: 'Vayu' },
  { name: 'Vishakha', lord: 'Jupiter', deity: 'Indra-Agni' },
  { name: 'Anuradha', lord: 'Saturn', deity: 'Mitra' },
  { name: 'Jyeshtha', lord: 'Mercury', deity: 'Indra' },
  { name: 'Mula', lord: 'Ketu', deity: 'Nirriti' },
  { name: 'Purva Ashadha', lord: 'Venus', deity: 'Apas' },
  { name: 'Uttara Ashadha', lord: 'Sun', deity: 'Vishvedevas' },
  { name: 'Shravana', lord: 'Moon', deity: 'Vishnu' },
  { name: 'Dhanishta', lord: 'Mars', deity: 'Vasus' },
  { name: 'Shatabhisha', lord: 'Rahu', deity: 'Varuna' },
  { name: 'Purva Bhadrapada', lord: 'Jupiter', deity: 'Aja Ekapada' },
  { name: 'Uttara Bhadrapada', lord: 'Saturn', deity: 'Ahir Budhnya' },
  { name: 'Revati', lord: 'Mercury', deity: 'Pushan' }
];

const NAKSHATRA_SPAN = 360 / 27;      // 13.3333... degrees
const PADA_SPAN = NAKSHATRA_SPAN / 4; // 3.3333... degrees

// Nakshatra (and pada 1-4) from a SIDEREAL longitude.
export function getNakshatra(siderealLongitude) {
  const lon = normalizeDegrees(siderealLongitude);
  const index = Math.floor(lon / NAKSHATRA_SPAN);
  const within = lon - index * NAKSHATRA_SPAN;
  const pada = Math.floor(within / PADA_SPAN) + 1;
  const nak = NAKSHATRAS[index];
  return {
    index,
    name: nak.name,
    lord: nak.lord,
    deity: nak.deity,
    pada,
    degreesInto: within
  };
}

// --------------------------------------------------------------------------
// Rashis — the 12 sidereal signs, with Sanskrit names and ruling grahas.
// --------------------------------------------------------------------------
export const RASHIS = [
  { name: 'Mesha', english: 'Aries', symbol: '♈', lord: 'Mars' },
  { name: 'Vrishabha', english: 'Taurus', symbol: '♉', lord: 'Venus' },
  { name: 'Mithuna', english: 'Gemini', symbol: '♊', lord: 'Mercury' },
  { name: 'Karka', english: 'Cancer', symbol: '♋', lord: 'Moon' },
  { name: 'Simha', english: 'Leo', symbol: '♌', lord: 'Sun' },
  { name: 'Kanya', english: 'Virgo', symbol: '♍', lord: 'Mercury' },
  { name: 'Tula', english: 'Libra', symbol: '♎', lord: 'Venus' },
  { name: 'Vrischika', english: 'Scorpio', symbol: '♏', lord: 'Mars' },
  { name: 'Dhanu', english: 'Sagittarius', symbol: '♐', lord: 'Jupiter' },
  { name: 'Makara', english: 'Capricorn', symbol: '♑', lord: 'Saturn' },
  { name: 'Kumbha', english: 'Aquarius', symbol: '♒', lord: 'Saturn' },
  { name: 'Meena', english: 'Pisces', symbol: '♓', lord: 'Jupiter' }
];

// --------------------------------------------------------------------------
// North-Indian style square Kundli (D1 Rashi chart).
// Houses are FIXED in position (House 1 top-centre, counter-clockwise); the Lagna
// rashi number sits in House 1 and increases by house. Grahas are placed by rashi.
// --------------------------------------------------------------------------
const GRAHA_ABBR = { Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me', Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke' };

export function drawNorthIndianKundli(canvas, siderealPositions, lagnaSidereal) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  // Background — clean white
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);

  const pad = 8;
  const x0 = pad, y0 = pad, x1 = W - pad, y1 = H - pad;
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;

  // Frame, diagonals, and inner diamond
  ctx.strokeStyle = 'rgba(18, 23, 42, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
  ctx.strokeStyle = 'rgba(18, 23, 42, 0.28)';
  ctx.beginPath();
  ctx.moveTo(x0, y0); ctx.lineTo(x1, y1);
  ctx.moveTo(x1, y0); ctx.lineTo(x0, y1);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(mx, y0); ctx.lineTo(x1, my); ctx.lineTo(mx, y1); ctx.lineTo(x0, my); ctx.closePath();
  ctx.stroke();

  // House label anchors (fractional positions inside the square)
  const A = (fx, fy) => ({ x: x0 + (x1 - x0) * fx, y: y0 + (y1 - y0) * fy });
  const anchors = {
    1: A(0.50, 0.25), 2: A(0.26, 0.10), 3: A(0.10, 0.26), 4: A(0.25, 0.50),
    5: A(0.10, 0.74), 6: A(0.26, 0.90), 7: A(0.50, 0.75), 8: A(0.74, 0.90),
    9: A(0.90, 0.74), 10: A(0.75, 0.50), 11: A(0.90, 0.26), 12: A(0.74, 0.10)
  };

  const lagnaIdx = Math.floor(normalizeDegrees(lagnaSidereal) / 30); // 0-11

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Rashi number in each house
  ctx.font = '10px "Courier New", monospace';
  for (let h = 1; h <= 12; h++) {
    const rashiIdx = (lagnaIdx + (h - 1)) % 12;
    const a = anchors[h];
    ctx.fillStyle = 'rgba(18, 23, 42, 0.45)';
    ctx.fillText(String(rashiIdx + 1), a.x, a.y - 9);
  }

  // Group grahas by house
  const byHouse = {};
  Object.keys(siderealPositions).forEach(g => {
    if (!(g in GRAHA_ABBR)) return;
    const rIdx = Math.floor(normalizeDegrees(siderealPositions[g]) / 30);
    const h = ((rIdx - lagnaIdx + 12) % 12) + 1;
    (byHouse[h] = byHouse[h] || []).push(g);
  });

  // Place grahas (and the Lagna marker in house 1)
  ctx.font = 'bold 11px "Courier New", monospace';
  for (let h = 1; h <= 12; h++) {
    const list = byHouse[h] || [];
    const a = anchors[h];
    const items = [];
    if (h === 1) items.push({ txt: 'La', color: '#f97316' });
    list.forEach(g => items.push({ txt: GRAHA_ABBR[g], color: GRAHA_DEFAULTS[g].color }));

    // Lay out items in rows of up to 3, centred under the rashi number
    const perRow = 3;
    items.forEach((it, i) => {
      const row = Math.floor(i / perRow);
      const inRow = Math.min(perRow, items.length - row * perRow);
      const col = i % perRow;
      const spacing = 20;
      const rowX = a.x + (col - (inRow - 1) / 2) * spacing;
      const rowY = a.y + 4 + row * 12;
      ctx.fillStyle = it.color;
      ctx.fillText(it.txt, rowX, rowY);
    });
  }
}

// Rashi (sidereal sign) from a SIDEREAL longitude, with degree/minute within the sign.
export function getRashi(siderealLongitude) {
  const lon = normalizeDegrees(siderealLongitude);
  const index = Math.floor(lon / 30);
  const rashi = RASHIS[index];
  const deg = Math.floor(lon % 30);
  const min = Math.floor(((lon % 30) - deg) * 60);
  return {
    index,
    name: rashi.name,
    english: rashi.english,
    symbol: rashi.symbol,
    lord: rashi.lord,
    positionStr: `${deg}° ${rashi.name} ${String(min).padStart(2, '0')}'`
  };
}

// House (bhava) number 1-12 of a sidereal longitude, counted from the Lagna.
export function getHouseFromLagna(siderealLongitude, lagnaSidereal) {
  const r = Math.floor(normalizeDegrees(siderealLongitude) / 30);
  const l = Math.floor(normalizeDegrees(lagnaSidereal) / 30);
  return ((r - l + 12) % 12) + 1;
}

// --------------------------------------------------------------------------
// Navamsa (D9) — each 30° Rashi is split into nine 3°20' parts. The continuous
// division (longitude / 3.3333°, mod 12) reproduces the classical rule where
// movable signs start from themselves, fixed from the 9th, and dual from the 5th.
// --------------------------------------------------------------------------
const NAVAMSA_SPAN = 30 / 9; // 3.3333... degrees
export function getNavamsaRashiIndex(siderealLongitude) {
  return Math.floor(normalizeDegrees(siderealLongitude) / NAVAMSA_SPAN) % 12;
}
// A synthetic longitude at the middle of the navamsa Rashi, so the same
// drawNorthIndianKundli() can render the D9 chart from navamsa positions.
export function getNavamsaLongitude(siderealLongitude) {
  return getNavamsaRashiIndex(siderealLongitude) * 30 + 15;
}

// --------------------------------------------------------------------------
// Manglik (Mangal / Kuja) Dosha — Mars in houses 1, 2, 4, 7, 8 or 12 from a
// reference (Lagna, Moon, or Venus) is considered Manglik.
// --------------------------------------------------------------------------
export const MANGLIK_HOUSES = [1, 2, 4, 7, 8, 12];
export function isManglikHouse(house) {
  return MANGLIK_HOUSES.includes(house);
}
