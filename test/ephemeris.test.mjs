/**
 * Ephemeris regression test for the astrology engine.
 *
 * Ground truth = NASA JPL Horizons (geocentric apparent ecliptic longitude,
 * QUANTITIES=31, CENTER=500@399), pulled for five representative UTC instants.
 * These reference values are frozen below so the test runs offline. If you
 * intentionally change the engine's accuracy, regenerate them from Horizons.
 *
 * Positions come from the vendored astronomy-engine (arc-second accurate). The
 * engine now matches Horizons to a few arc-seconds across all five eras, so the
 * tolerance is a tight 0.05 deg everywhere — a regression that reintroduced the
 * old two-body drift would fail immediately.
 *
 * Run: npm test
 */

import { getJulianDate, calculateGeocentricLongitude, getPreciseAscendant } from '../modules/astrology.js';

const PLANETS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

// Each case: a UTC instant + the Horizons reference longitude (deg) per body.
const CASES = [
  {
    label: '2000-01-01T00:00Z', y: 2000, mo: 1, d: 1, h: 0, tolDeg: 0.05,
    ref: { Sun: 279.8592049, Moon: 217.2933209, Mercury: 271.1117994, Venus: 240.9614017, Mars: 327.5754592, Jupiter: 25.2331086, Saturn: 40.4058374, Uranus: 314.7840519, Neptune: 303.1752432, Pluto: 251.43715 }
  },
  {
    label: '1990-06-15T00:00Z', y: 1990, mo: 6, d: 15, h: 0, tolDeg: 0.05,
    ref: { Sun: 83.6519789, Moon: 338.7208841, Mercury: 64.8384556, Venus: 48.1897066, Mars: 10.6816835, Jupiter: 105.7812272, Saturn: 294.0611222, Uranus: 278.1846298, Neptune: 283.7295508, Pluto: 225.4116162 }
  },
  {
    label: '2023-03-21T00:00Z', y: 2023, mo: 3, d: 21, h: 0, tolDeg: 0.05,
    ref: { Sun: 0.1073743, Moon: 350.226818, Mercury: 3.6266668, Venus: 34.8849535, Mars: 87.8563292, Jupiter: 16.492139, Saturn: 331.5416721, Uranus: 46.2835945, Neptune: 355.3063814, Pluto: 299.9530752 }
  },
  {
    label: '1970-07-20T00:00Z', y: 1970, mo: 7, d: 20, h: 0, tolDeg: 0.05,
    ref: { Sun: 116.8740441, Moon: 313.3540333, Mercury: 131.0003309, Venus: 158.5184744, Mars: 121.1075355, Jupiter: 207.1053385, Saturn: 50.7710476, Uranus: 185.2704031, Neptune: 238.2384882, Pluto: 175.2034037 }
  },
  {
    // Historical instant — astronomy-engine stays arc-second accurate here too.
    label: '1815-12-10T00:00Z', y: 1815, mo: 12, d: 10, h: 0, tolDeg: 0.05,
    ref: { Sun: 257.1199059, Moon: 359.1095343, Mercury: 239.7550538, Venus: 211.0529093, Mars: 20.2501795, Jupiter: 212.1456997, Saturn: 308.5295541, Uranus: 247.7670435, Neptune: 259.5511737, Pluto: 350.8834047 }
  }
];

// Smallest angular separation between two longitudes, accounting for the 0/360 wrap.
function angularDiff(a, b) {
  let d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

let failures = 0;
let checks = 0;
const errors = [];

for (const c of CASES) {
  const jd = getJulianDate(c.y, c.mo, c.d, c.h, 0);
  const T = (jd - 2451545.0) / 36525.0;
  for (const p of PLANETS) {
    checks++;
    const got = calculateGeocentricLongitude(p, T);
    const err = angularDiff(got, c.ref[p]);
    errors.push(err);
    if (!(err <= c.tolDeg)) {
      failures++;
      console.error(
        `FAIL  ${c.label}  ${p.padEnd(8)} got ${got.toFixed(3)}°  ref ${c.ref[p].toFixed(3)}°  ` +
        `err ${err.toFixed(3)}° > tol ${c.tolDeg}°`
      );
    }
  }
}

const mean = (errors.reduce((a, b) => a + b, 0) / errors.length);
const max = Math.max(...errors);

console.log(`\nEphemeris check: ${checks - failures}/${checks} within tolerance`);
console.log(`Mean error ${mean.toFixed(3)}°, max error ${max.toFixed(3)}° (vs JPL Horizons)`);

// --------------------------------------------------------------------------
// Ascendant (Rising sign) regression.
// Reference longitudes below were cross-validated three ways: an independent
// sidereal-time implementation, and (for Mumbai) the astro-seek calculator,
// which reported Virgo 14 deg 33' = 164.55 deg. These guard against the GMST
// bug that once left the Ascendant correct only for births at 0h UT.
// Each case: local birth time + timezone offset (east of UTC), lat, lon.
// --------------------------------------------------------------------------
const ASC_CASES = [
  { label: 'Mumbai 1990-06-15 12:00 +5.5', y: 1990, mo: 6, d: 15, hour: 12, tz: 5.5, lat: 19.0760, lon: 72.8777, refAsc: 164.551 },
  { label: 'Tokyo 1985-03-10 09:00 +9', y: 1985, mo: 3, d: 10, hour: 9, tz: 9, lat: 35.6762, lon: 139.6503, refAsc: 53.715 },
  { label: 'New York 1990-01-15 06:00 -5', y: 1990, mo: 1, d: 15, hour: 6, tz: -5, lat: 40.7128, lon: -74.0060, refAsc: 273.461 },
  { label: 'Sydney 1990-07-20 15:00 +10', y: 1990, mo: 7, d: 20, hour: 15, tz: 10, lat: -33.8688, lon: 151.2093, refAsc: 270.775 },
  { label: 'Nairobi 1990-06-15 08:00 +3', y: 1990, mo: 6, d: 15, hour: 8, tz: 3, lat: -1.2921, lon: 36.8219, refAsc: 103.348 }
];
const ASC_TOL = 0.1;

for (const c of ASC_CASES) {
  checks++;
  const jd = getJulianDate(c.y, c.mo, c.d, 0, 0) + (c.hour - c.tz) / 24;
  const got = getPreciseAscendant(jd, c.lon, c.lat);
  const err = angularDiff(got, c.refAsc);
  if (!(err <= ASC_TOL)) {
    failures++;
    console.error(`FAIL  ASC ${c.label}  got ${got.toFixed(3)}°  ref ${c.refAsc.toFixed(3)}°  err ${err.toFixed(3)}° > tol ${ASC_TOL}°`);
  }
}
console.log(`Ascendant check: ${ASC_CASES.length - ASC_CASES.filter(c => { const jd = getJulianDate(c.y, c.mo, c.d, 0, 0) + (c.hour - c.tz) / 24; return angularDiff(getPreciseAscendant(jd, c.lon, c.lat), c.refAsc) > ASC_TOL; }).length}/${ASC_CASES.length} within ${ASC_TOL}° of reference`);

if (failures > 0) {
  console.error(`\n${failures} check(s) failed.`);
  process.exit(1);
}
console.log('All ephemeris + Ascendant checks passed.\n');
