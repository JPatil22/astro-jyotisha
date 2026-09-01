import assert from 'node:assert/strict';
import { 
  calculatePanchang, 
  calculateSunRiseSet, 
  calculateMuhurtas, 
  calculateChoghadiya,
  calculateHoras,
  CHOGHADIYA_TYPES
} from '../modules/jyotish-panchang.js';

console.log('Running Panchang & Muhurta Comprehensive tests...');

// Test 1: Sunrise & Sunset for Delhi (28.6139° N, 77.2090° E, UTC+5.5) on Autumn Equinox
const date = new Date(2026, 8, 23); // Sept 23, 2026
const sunTimes = calculateSunRiseSet(date, 28.6139, 77.2090, 5.5);

assert.ok(sunTimes.sunrise, 'Sunrise must be defined');
assert.ok(sunTimes.sunset, 'Sunset must be defined');
assert.ok(sunTimes.sunriseHour >= 5.5 && sunTimes.sunriseHour <= 6.5, `Sunrise in Delhi should be ~06:00, got ${sunTimes.sunriseStr}`);
assert.ok(sunTimes.sunsetHour >= 18.0 && sunTimes.sunsetHour <= 19.0, `Sunset in Delhi should be ~18:15, got ${sunTimes.sunsetStr}`);
assert.ok(sunTimes.dayLengthHours > 11.5 && sunTimes.dayLengthHours < 12.5, 'Equinox day length should be ~12 hours');

// Test 2: Muhurtas (Rahu Kaal, Yamaganda, Gulika, Abhijit)
const muhurtas = calculateMuhurtas(sunTimes.sunriseHour, sunTimes.sunsetHour, 2); // Tuesday (Mangalavara)
assert.ok(muhurtas.rahuKaal, 'Rahu Kaal must exist');
assert.ok(muhurtas.yamaganda, 'Yamaganda must exist');
assert.ok(muhurtas.gulika, 'Gulika must exist');
assert.ok(muhurtas.abhijit, 'Abhijit Muhurta must exist');

// Tuesday Rahu Kaal is traditionally the 7th part (~15:00 - 16:30)
assert.ok(muhurtas.rahuKaal.startHour >= 14.5 && muhurtas.rahuKaal.endHour <= 17.0, `Tuesday Rahu Kaal should be around 15:00-16:30, got ${muhurtas.rahuKaal.startStr} - ${muhurtas.rahuKaal.endStr}`);

// Test 3: Day & Night Choghadiya
const choghadiya = calculateChoghadiya(sunTimes.sunriseHour, sunTimes.sunsetHour, 2); // Tuesday
assert.equal(choghadiya.day.length, 8, 'Day Choghadiya must have 8 slots');
assert.equal(choghadiya.night.length, 8, 'Night Choghadiya must have 8 slots');
assert.equal(choghadiya.day[0].name, 'Rog', 'Tuesday 1st Day Choghadiya should be Rog (Mars)');
assert.equal(choghadiya.day[3].name, 'Labh', 'Tuesday 4th Day Choghadiya should be Labh (Mercury)');

// Test 4: 24 Horas
const horas = calculateHoras(sunTimes.sunriseHour, sunTimes.sunsetHour, 2); // Tuesday
assert.equal(horas.length, 24, 'Must produce exactly 24 planetary horas');
assert.equal(horas[0].lord, 'Mars', '1st hora on Tuesday must be Mars');

console.log('All Panchang & Muhurta tests passed successfully.');
