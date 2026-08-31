/**
 * Jyotish (Vedic) regression test.
 *
 * The sidereal chart is validated by composition: tropical positions are checked
 * against JPL Horizons in ephemeris.test.mjs, and here we pin (a) the Lahiri
 * ayanamsa against published reference values, (b) the mean lunar node against
 * its textbook J2000 value, and (c) the deterministic Nakshatra/Rashi arithmetic.
 *
 * Run: node test/jyotish.test.mjs
 */

import { getJulianDate } from '../modules/astrology.js';
import { getAyanamsa, getLunarNodes, getNakshatra, getRashi, toSidereal } from '../modules/jyotish.js';

let failures = 0;
const approx = (got, exp, tol, label) => {
  const ok = Math.abs(got - exp) <= tol;
  if (!ok) { failures++; console.error(`FAIL ${label}: got ${got}, expected ${exp} ±${tol}`); }
  return ok;
};
const eq = (got, exp, label) => {
  const ok = got === exp;
  if (!ok) { failures++; console.error(`FAIL ${label}: got ${got}, expected ${exp}`); }
  return ok;
};

// (a) Lahiri ayanamsa vs published references (Drik Panchang / Swiss Ephemeris).
approx(getAyanamsa(getJulianDate(2000, 1, 1, 0, 0)), 23.851, 0.05, 'ayanamsa 2000');
approx(getAyanamsa(getJulianDate(2020, 1, 1, 0, 0)), 24.111, 0.05, 'ayanamsa 2020');
approx(getAyanamsa(getJulianDate(2024, 1, 1, 0, 0)), 24.183, 0.05, 'ayanamsa 2024');

// (b) Mean lunar node (Rahu) at J2000.0 = 125.0445 deg (Meeus); Ketu opposite.
const nodes = getLunarNodes(0);
approx(nodes.Rahu, 125.0445, 0.001, 'Rahu mean node @ J2000');
approx(nodes.Ketu, 305.0445, 0.001, 'Ketu mean node @ J2000');

// (c) Nakshatra & Rashi arithmetic (deterministic boundaries).
eq(getNakshatra(0).name, 'Ashwini', 'nakshatra @ 0deg');
eq(getNakshatra(0).pada, 1, 'pada @ 0deg');
eq(getNakshatra(13.34).name, 'Bharani', 'nakshatra @ 13.34deg');
eq(getNakshatra(318.38).name, 'Shatabhisha', 'nakshatra @ 318.38deg');
eq(getNakshatra(318.38).pada, 4, 'pada @ 318.38deg');
eq(getRashi(60.33).name, 'Mithuna', 'rashi @ 60.33deg');
eq(getRashi(0).name, 'Mesha', 'rashi @ 0deg');
eq(getRashi(285).name, 'Makara', 'rashi @ 285deg');
eq(getRashi(300).name, 'Kumbha', 'rashi @ 300deg');

// (d) Sidereal composition sanity: tropical minus ayanamsa, normalized.
const jd = getJulianDate(1990, 6, 15, 0, 0) + (12 - 5.5) / 24; // Mumbai noon IST
approx(toSidereal(84.05, jd), 60.33, 0.02, 'sidereal Sun (Mumbai)');
approx(toSidereal(342.10, jd), 318.38, 0.02, 'sidereal Moon (Mumbai)');

if (failures > 0) {
  console.error(`\n${failures} Jyotish check(s) failed.`);
  process.exit(1);
}
console.log('All Jyotish checks passed (ayanamsa, nodes, nakshatra, rashi, sidereal).');
