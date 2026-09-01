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

// Re-export multi-style Kundli renderers
export { 
  drawNorthIndianKundli, 
  drawSouthIndianKundli, 
  drawEastIndianKundli, 
  drawKundliByStyle 
} from './jyotish-renderers.js';

// Re-export Shodashvarga helpers
export {
  VARGA_DEFINITIONS,
  getVargaRashiIndex,
  getVargaSyntheticLongitude,
  calculateVargaChart
} from './jyotish-varga.js';

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
// Navamsa (D9) — each 30° Rashi is split into nine 3°20' parts.
// --------------------------------------------------------------------------
const NAVAMSA_SPAN = 30 / 9; // 3.3333... degrees
export function getNavamsaRashiIndex(siderealLongitude) {
  return Math.floor(normalizeDegrees(siderealLongitude) / NAVAMSA_SPAN) % 12;
}
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

