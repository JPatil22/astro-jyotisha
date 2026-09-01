import assert from 'node:assert/strict';
import { getJulianDate, calculateGeocentricLongitude, getPreciseAscendant } from '../modules/astrology.js';
import { 
  VEDIC_GRAHAS,
  toSidereal, 
  getAyanamsa, 
  getLunarNodes, 
  getNakshatra, 
  getRashi,
  calculateVargaChart 
} from '../modules/jyotish.js';
import { calculateAshtakavarga } from '../modules/jyotish-ashtakavarga.js';
import { calculateBhavaChalit } from '../modules/jyotish-bhavas.js';
import { calculateGrahaDrishti } from '../modules/jyotish-drishti.js';
import { calculateVimshottariDasha } from '../modules/jyotish-dasha.js';
import { detectDoshas } from '../modules/jyotish-dosha.js';
import { calculatePanchang } from '../modules/jyotish-panchang.js';

console.log('Running Relentless Worldwide Stress & Edge-Case Test Suite...');

const TEST_LOCATIONS = [
  // Southern Hemisphere
  { name: 'Sydney, Australia', lat: -33.8688, lon: 151.2093, tz: 10.0, date: '1988-07-15', time: '04:30' },
  { name: 'Buenos Aires, Argentina', lat: -34.6037, lon: -58.3816, tz: -3.0, date: '1992-11-03', time: '18:15' },
  { name: 'Cape Town, South Africa', lat: -33.9249, lon: 18.4241, tz: 2.0, date: '2001-01-20', time: '12:00' },
  { name: 'Auckland, New Zealand', lat: -36.8485, lon: 174.7633, tz: 12.0, date: '1975-09-10', time: '23:45' },

  // Fractional Timezones
  { name: 'Kathmandu, Nepal (UTC+5:45)', lat: 27.7172, lon: 85.3240, tz: 5.75, date: '1999-04-14', time: '08:20' },
  { name: 'New Delhi, India (UTC+5:30)', lat: 28.6139, lon: 77.2090, tz: 5.5, date: '1947-08-15', time: '00:00' },
  { name: 'Tehran, Iran (UTC+3:30)', lat: 35.6892, lon: 51.3890, tz: 3.5, date: '1980-03-21', time: '15:10' },
  { name: "St. John's, Canada (UTC-3:30)", lat: 47.5615, lon: -52.7126, tz: -3.5, date: '1995-12-05', time: '10:00' },
  { name: 'Chatham Islands, NZ (UTC+12:45)', lat: -43.9535, lon: -176.5597, tz: 12.75, date: '2010-06-21', time: '06:00' },

  // Sub-polar & High Latitudes
  { name: 'Reykjavik, Iceland (64.1° N)', lat: 64.1466, lon: -21.9426, tz: 0.0, date: '2000-06-21', time: '00:01' },
  { name: 'Anchorage, Alaska (61.2° N)', lat: 61.2181, lon: -149.9003, tz: -9.0, date: '1985-12-21', time: '12:00' },

  // Leap Years & Year Transitions
  { name: 'Leap Year Century (Feb 29, 2000)', lat: 51.5074, lon: -0.1278, tz: 0.0, date: '2000-02-29', time: '23:59' },
  { name: 'Millennium Eve (Dec 31, 1999)', lat: 40.7128, lon: -74.0060, tz: -5.0, date: '1999-12-31', time: '23:59' },
  { name: 'Historical India Independence (1947)', lat: 28.6139, lon: 77.2090, tz: 5.5, date: '1947-08-15', time: '00:00' },
  { name: 'Modern Epoch (2026)', lat: 37.7749, lon: -122.4194, tz: -8.0, date: '2026-09-01', time: '12:00' }
];

let totalChartsTested = 0;

for (const loc of TEST_LOCATIONS) {
  const [hour, minute] = loc.time.split(':').map(Number);
  const [year, month, day] = loc.date.split('-').map(Number);
  const utFraction = ((hour + minute / 60) - loc.tz) / 24;
  const jd = getJulianDate(year, month, day, 0, 0) + utFraction;
  const T = (jd - 2451545.0) / 36525.0;

  // 1. Planetary coordinates
  const nodes = getLunarNodes(T);
  const positions = {};
  VEDIC_GRAHAS.forEach(g => {
    let trop;
    if (g === 'Rahu') trop = nodes.Rahu;
    else if (g === 'Ketu') trop = nodes.Ketu;
    else trop = calculateGeocentricLongitude(g, T);
    positions[g] = toSidereal(trop, jd);
  });

  // 2. Ascendant (Lagna)
  const ascTrop = getPreciseAscendant(jd, loc.lon, loc.lat);
  const ascSid = toSidereal(ascTrop, jd);
  assert.ok(!isNaN(ascSid), `Ascendant must be a valid number for ${loc.name}`);
  assert.ok(ascSid >= 0 && ascSid < 360, `Ascendant must be in [0, 360) for ${loc.name}`);

  // 3. Shodashvarga
  const d9 = calculateVargaChart(positions, ascSid, 'D9');
  assert.ok(d9.positions.Sun >= 0 && d9.positions.Sun < 360, 'D9 Sun position valid');
  const d10 = calculateVargaChart(positions, ascSid, 'D10');
  assert.ok(d10.positions.Jupiter >= 0, 'D10 Jupiter position valid');
  const d60 = calculateVargaChart(positions, ascSid, 'D60');
  assert.ok(d60.positions.Saturn >= 0, 'D60 Saturn position valid');

  // 4. Ashtakavarga (337 bindus check)
  const av = calculateAshtakavarga(positions, ascSid);
  assert.equal(av.totalBindus, 337, `SAV must strictly sum to 337 for ${loc.name}`);
  assert.equal(av.houseScores.length, 12, 'Must have 12 house scores');

  // 5. Bhava Chalit Sripati Cusps
  const chalit = calculateBhavaChalit(positions, ascSid);
  assert.equal(chalit.cusps.length, 12, 'Must have 12 Bhava cusps');

  // 6. Graha Drishti
  const drishti = calculateGrahaDrishti(positions, ascSid);
  assert.equal(drishti.aspectList.length, 9, 'Must calculate aspects for all 9 grahas');

  // 7. Vimshottari Dasha
  const birthDate = new Date((jd - 2440587.5) * 86400000);
  const dasha = calculateVimshottariDasha(positions.Moon, birthDate);
  assert.ok(dasha.currentMaha, 'Must determine current Mahadasha');
  assert.ok(dasha.mahadashas.length >= 9, 'Must have at least 9 Mahadashas');

  // 8. Doshas
  const doshas = detectDoshas(positions, ascSid);
  assert.ok(Array.isArray(doshas), 'Doshas must be an array');

  // 9. Panchang & Muhurtas
  const panchang = calculatePanchang(birthDate, positions.Sun, positions.Moon, positions.Sun + getAyanamsa(jd), positions.Moon + getAyanamsa(jd), loc.lat, loc.lon, loc.tz);
  assert.ok(panchang.tithi, 'Panchang tithi valid');
  assert.ok(panchang.sunTimes.sunrise, 'Sunrise valid');
  assert.ok(panchang.muhurtas.rahuKaal, 'Rahu Kaal valid');
  assert.equal(panchang.choghadiya.day.length, 8, 'Day Choghadiya has 8 parts');

  totalChartsTested++;
}

console.log(`Stress Test Success: All ${totalChartsTested} worldwide locations across Southern Hemisphere, Polar zones, and Fractional Timezones passed with ZERO errors.`);
