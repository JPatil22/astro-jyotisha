/**
 * Vimshottari Dasha Engine (Levels 1 to 4) - Jyotisha
 * Computes:
 * - Level 1: Mahadasha (Major period)
 * - Level 2: Antardasha (Sub-period)
 * - Level 3: Pratyantardasha (Sub-sub-period)
 * - Level 4: Sookshma Dasha (Sub-sub-sub-period)
 * Calculated from the Moon's birth Nakshatra longitude and birth instant.
 */

import { getNakshatra, NAKSHATRAS } from './jyotish.js';

// Fixed dasha sequence and each lord's period length (years). Sum = 120.
export const DASHA_SEQUENCE = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
export const DASHA_YEARS = { Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17 };

const YEAR_DAYS = 365.25;
const DAY_MS = 86400000;
const addYears = (date, yrs) => new Date(date.getTime() + yrs * YEAR_DAYS * DAY_MS);

/**
 * Compute Level 2 (Antardashas) for a Mahadasha.
 */
export function computeAntardashas(mahaLord, virtualStart, mahaFullYears) {
  const idx = DASHA_SEQUENCE.indexOf(mahaLord);
  const out = [];
  let cursor = new Date(virtualStart);
  for (let j = 0; j < 9; j++) {
    const subLord = DASHA_SEQUENCE[(idx + j) % 9];
    const subYears = (mahaFullYears * DASHA_YEARS[subLord]) / 120;
    const start = new Date(cursor);
    const end = addYears(start, subYears);
    out.push({
      mahaLord,
      antarLord: subLord,
      lord: subLord,
      start,
      end,
      years: subYears
    });
    cursor = end;
  }
  return out;
}

/**
 * Compute Level 3 (Pratyantardashas) for an Antardasha.
 */
export function computePratyantardashas(mahaLord, antarLord, antarStart, antarYears) {
  const idx = DASHA_SEQUENCE.indexOf(antarLord);
  const out = [];
  let cursor = new Date(antarStart);
  for (let k = 0; k < 9; k++) {
    const subLord = DASHA_SEQUENCE[(idx + k) % 9];
    const subYears = (antarYears * DASHA_YEARS[subLord]) / 120;
    const start = new Date(cursor);
    const end = addYears(start, subYears);
    out.push({
      mahaLord,
      antarLord,
      pratyantarLord: subLord,
      lord: subLord,
      start,
      end,
      years: subYears,
      days: subYears * YEAR_DAYS
    });
    cursor = end;
  }
  return out;
}

/**
 * Compute Level 4 (Sookshma Dashas) for a Pratyantardasha.
 */
export function computeSookshmaDashas(mahaLord, antarLord, pratyantarLord, pratyantarStart, pratyantarYears) {
  const idx = DASHA_SEQUENCE.indexOf(pratyantarLord);
  const out = [];
  let cursor = new Date(pratyantarStart);
  for (let m = 0; m < 9; m++) {
    const subLord = DASHA_SEQUENCE[(idx + m) % 9];
    const subYears = (pratyantarYears * DASHA_YEARS[subLord]) / 120;
    const start = new Date(cursor);
    const end = addYears(start, subYears);
    out.push({
      mahaLord,
      antarLord,
      pratyantarLord,
      sookshmaLord: subLord,
      lord: subLord,
      start,
      end,
      years: subYears,
      days: subYears * YEAR_DAYS,
      hours: subYears * YEAR_DAYS * 24
    });
    cursor = end;
  }
  return out;
}

/**
 * Comprehensive Vimshottari Dasha calculation across all 4 levels.
 * @param {number} moonSiderealLongitude - sidereal longitude of natal Moon (deg)
 * @param {Date}   birthDate             - birth instant
 * @param {Date}   [asOf]                - current moment (defaults to now)
 */
export function calculateVimshottariDasha(moonSiderealLongitude, birthDate, asOf = new Date()) {
  const nak = getNakshatra(moonSiderealLongitude);
  const nakSpan = 360 / 27;
  const fractionElapsed = nak.degreesInto / nakSpan;

  const birthLord = NAKSHATRAS[nak.index].lord;
  const startIdx = DASHA_SEQUENCE.indexOf(birthLord);
  const firstFull = DASHA_YEARS[birthLord];
  const balance = firstFull * (1 - fractionElapsed);
  const elapsed = firstFull - balance;

  // 120-year cycle of Mahadashas
  const mahadashas = [];
  let cursor = new Date(birthDate);
  for (let i = 0; i < 9; i++) {
    const lord = DASHA_SEQUENCE[(startIdx + i) % 9];
    const fullYears = DASHA_YEARS[lord];
    const isFirst = i === 0;
    const start = new Date(cursor);
    const runYears = isFirst ? balance : fullYears;
    const end = addYears(start, runYears);
    const virtualStart = isFirst ? addYears(birthDate, -elapsed) : start;
    mahadashas.push({ lord, fullYears, start, end, virtualStart, isFirst });
    cursor = end;
  }

  // Find running Mahadasha
  const currentMaha = mahadashas.find(m => asOf >= m.start && asOf < m.end) || mahadashas[0];

  // Antardashas of running Mahadasha
  const allAntar = computeAntardashas(currentMaha.lord, currentMaha.virtualStart, currentMaha.fullYears);
  const antardashas = allAntar.filter(a => a.end > currentMaha.start);
  const currentAntar = allAntar.find(a => asOf >= a.start && asOf < a.end) || antardashas[0];

  // Pratyantardashas of running Antardasha
  let pratyantardashas = [];
  let currentPratyantar = null;
  if (currentAntar) {
    pratyantardashas = computePratyantardashas(currentMaha.lord, currentAntar.lord, currentAntar.start, currentAntar.years);
    currentPratyantar = pratyantardashas.find(p => asOf >= p.start && asOf < p.end) || pratyantardashas[0];
  }

  // Sookshma Dashas of running Pratyantardasha
  let sookshmaDashas = [];
  let currentSookshma = null;
  if (currentPratyantar) {
    sookshmaDashas = computeSookshmaDashas(currentMaha.lord, currentAntar.lord, currentPratyantar.lord, currentPratyantar.start, currentPratyantar.years);
    currentSookshma = sookshmaDashas.find(s => asOf >= s.start && asOf < s.end) || sookshmaDashas[0];
  }

  return {
    birthLord,
    balanceYears: balance,
    nakshatra: nak.name,
    mahadashas,
    currentMaha,
    currentAntar,
    antardashas,
    currentPratyantar,
    pratyantardashas,
    currentSookshma,
    sookshmaDashas
  };
}
