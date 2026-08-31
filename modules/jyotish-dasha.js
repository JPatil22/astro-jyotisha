/**
 * Vimshottari Dasha - Jyotisha
 * The 120-year planetary-period system of Vedic astrology, computed from the Moon's
 * birth Nakshatra. Returns the Mahadasha (major period) timeline plus the Antardasha
 * (sub-period) breakdown of the currently running Mahadasha.
 */

import { getNakshatra, NAKSHATRAS } from './jyotish.js';

// Fixed dasha sequence and each lord's period length (years). Sum = 120.
export const DASHA_SEQUENCE = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
export const DASHA_YEARS = { Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17 };

const YEAR_DAYS = 365.25;
const DAY_MS = 86400000;
const addYears = (date, yrs) => new Date(date.getTime() + yrs * YEAR_DAYS * DAY_MS);

// Compute the Antardashas (sub-periods) of a Mahadasha, starting from `virtualStart`
// (the point the Mahadasha would begin if run in full — equals the actual start for
// every period except the partial birth Mahadasha).
function computeAntardashas(mahaLord, virtualStart, mahaFullYears) {
  const idx = DASHA_SEQUENCE.indexOf(mahaLord);
  const out = [];
  let cursor = new Date(virtualStart);
  for (let j = 0; j < 9; j++) {
    const subLord = DASHA_SEQUENCE[(idx + j) % 9];
    const subYears = (mahaFullYears * DASHA_YEARS[subLord]) / 120;
    const start = new Date(cursor);
    const end = addYears(start, subYears);
    out.push({ lord: subLord, start, end, years: subYears });
    cursor = end;
  }
  return out;
}

/**
 * @param {number} moonSiderealLongitude - sidereal longitude of the natal Moon (deg)
 * @param {Date}   birthDate             - birth instant
 * @param {Date}   [asOf]                - "current" moment (defaults to now)
 */
export function calculateVimshottariDasha(moonSiderealLongitude, birthDate, asOf = new Date()) {
  const nak = getNakshatra(moonSiderealLongitude);
  const nakSpan = 360 / 27;
  const fractionElapsed = nak.degreesInto / nakSpan;

  const birthLord = NAKSHATRAS[nak.index].lord;
  const startIdx = DASHA_SEQUENCE.indexOf(birthLord);
  const firstFull = DASHA_YEARS[birthLord];
  const balance = firstFull * (1 - fractionElapsed);   // remaining years of the birth Mahadasha
  const elapsed = firstFull - balance;                  // portion already run before birth

  // Build one full 120-year cycle of Mahadashas from the birth lord.
  const mahadashas = [];
  let cursor = new Date(birthDate);
  for (let i = 0; i < 9; i++) {
    const lord = DASHA_SEQUENCE[(startIdx + i) % 9];
    const fullYears = DASHA_YEARS[lord];
    // The birth (first) Mahadasha is partial: it runs only `balance` years, and its
    // antardashas are reckoned from a virtual start `elapsed` years before birth.
    const isFirst = i === 0;
    const start = new Date(cursor);
    const runYears = isFirst ? balance : fullYears;
    const end = addYears(start, runYears);
    const virtualStart = isFirst ? addYears(birthDate, -elapsed) : start;
    mahadashas.push({ lord, fullYears, start, end, virtualStart, isFirst });
    cursor = end;
  }

  const currentMaha = mahadashas.find(m => asOf >= m.start && asOf < m.end) || mahadashas[0];

  // Antardashas of the running Mahadasha (hide any that end before birth for the partial first).
  const allAntar = computeAntardashas(currentMaha.lord, currentMaha.virtualStart, currentMaha.fullYears);
  const antardashas = allAntar.filter(a => a.end > currentMaha.start);
  const currentAntar = allAntar.find(a => asOf >= a.start && asOf < a.end) || null;

  return {
    birthLord,
    balanceYears: balance,
    nakshatra: nak.name,
    mahadashas,
    currentMaha,
    currentAntar,
    antardashas
  };
}
