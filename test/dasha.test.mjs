/**
 * Vimshottari Dasha regression test.
 * Checks the sequence, the 120-year cycle, balance-of-dasha, sub-period sums,
 * and current-period selection. Run: node test/dasha.test.mjs
 */

import { calculateVimshottariDasha, DASHA_SEQUENCE, DASHA_YEARS } from '../modules/jyotish-dasha.js';

let failures = 0;
const check = (cond, label) => { if (!cond) { failures++; console.error(`FAIL: ${label}`); } };
const approx = (a, b, tol, label) => check(Math.abs(a - b) <= tol, `${label} (got ${a}, exp ${b})`);

// The nine lords total 120 years.
check(DASHA_SEQUENCE.length === 9, 'nine dasha lords');
check(Object.values(DASHA_YEARS).reduce((s, y) => s + y, 0) === 120, 'dasha years sum to 120');

const YEAR = 365.25 * 86400000;
const birth = new Date('1990-06-15T06:30:00Z');

// Case: Moon at exactly the start of a Nakshatra ruled by Rahu (Ardra begins at 6*13.333 sidereal).
// degreesInto = 0 -> the full birth Mahadasha runs (balance == full length).
const atStart = calculateVimshottariDasha(6 * (360 / 27), birth);
approx(atStart.balanceYears, DASHA_YEARS[atStart.birthLord], 1e-6, 'balance == full length at nakshatra start');

// One full cycle of Mahadashas spans 120 years from birth.
const span = (atStart.mahadashas[8].end - atStart.mahadashas[0].start) / YEAR;
approx(span, 120, 0.01, 'Mahadasha cycle spans 120 years');

// Mahadasha sequence follows DASHA_SEQUENCE from the birth lord.
const startIdx = DASHA_SEQUENCE.indexOf(atStart.birthLord);
check(atStart.mahadashas.every((m, i) => m.lord === DASHA_SEQUENCE[(startIdx + i) % 9]), 'Mahadasha order matches sequence');

// Antardashas of the running Mahadasha sum to that Mahadasha's full length.
const known = calculateVimshottariDasha(318.38, birth, new Date('2026-08-29'));
check(known.currentMaha.lord === 'Saturn', 'Mumbai-1990 current Mahadasha is Saturn in 2026');
check(known.currentAntar && known.currentAntar.lord === 'Jupiter', 'current Antardasha is Jupiter');
const antarSum = calculateVimshottariDasha(318.38, birth, new Date('2010-01-01')).antardashas
  .reduce((s, a) => s + a.years, 0);
approx(antarSum, DASHA_YEARS['Saturn'], 0.01, 'Saturn antardashas sum to 19 years');

// The current Mahadasha actually contains the asOf date.
check(known.currentMaha.start <= new Date('2026-08-29') && new Date('2026-08-29') < known.currentMaha.end,
  'asOf falls within current Mahadasha');

if (failures > 0) {
  console.error(`\n${failures} Dasha check(s) failed.`);
  process.exit(1);
}
console.log('All Vimshottari Dasha checks passed.');
