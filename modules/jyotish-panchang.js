/**
 * Panchang & Muhurta Almanac - Jyotisha
 * Five limbs (Tithi, Vara, Nakshatra, Yoga, Karana), Chandra Gochar,
 * Precise Solar Sunrise / Sunset Times, Inauspicious Periods (Rahu Kaal, Yamaganda, Gulika),
 * Auspicious Windows (Abhijit Muhurta, Amrit/Shubh Choghadiya), and 24-Hour Planetary Horas.
 */

import { normalizeDegrees } from './astrology.js';
import { getNakshatra } from './jyotish.js';

// Vara — weekday (JS getDay(): 0 = Sunday), with its ruling graha.
export const VARAS = [
  { name: 'Ravivara', english: 'Sunday', lord: 'Sun', color: '#ffd700' },
  { name: 'Somavara', english: 'Monday', lord: 'Moon', color: '#87ceeb' },
  { name: 'Mangalavara', english: 'Tuesday', lord: 'Mars', color: '#ff4500' },
  { name: 'Budhavara', english: 'Wednesday', lord: 'Mercury', color: '#32cd32' },
  { name: 'Guruvara', english: 'Thursday', lord: 'Jupiter', color: '#da70d6' },
  { name: 'Shukravara', english: 'Friday', lord: 'Venus', color: '#ff69b4' },
  { name: 'Shanivara', english: 'Saturday', lord: 'Saturn', color: '#ffa500' }
];

// The 15 tithi names within a paksha
const TITHI_NAMES = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami',
  'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi'
];

const YOGA_NAMES = [
  'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarma',
  'Dhriti', 'Shula', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
  'Siddhi', 'Vyatipata', 'Variyana', 'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha',
  'Shukla', 'Brahma', 'Indra', 'Vaidhriti'
];

const KARANA_MOVABLE = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti'];

// Tithi from Moon-Sun elongation
export function getTithi(moonLongitude, sunLongitude) {
  const elong = normalizeDegrees(moonLongitude - sunLongitude);
  const index = Math.floor(elong / 12); // 0-29
  const paksha = index < 15 ? 'Shukla' : 'Krishna';
  const within = index % 15;
  let name;
  if (within === 14) name = paksha === 'Shukla' ? 'Purnima' : 'Amavasya';
  else name = TITHI_NAMES[within];
  return { index, paksha, name, label: `${paksha} ${name}` };
}

// Yoga from sum of sidereal Sun + Moon longitudes
export function getYoga(sunSidereal, moonSidereal) {
  const sum = normalizeDegrees(sunSidereal + moonSidereal);
  const index = Math.floor(sum / (360 / 27));
  return { index, name: YOGA_NAMES[index] };
}

// Karana — half a tithi
export function getKarana(moonLongitude, sunLongitude) {
  const elong = normalizeDegrees(moonLongitude - sunLongitude);
  const n = Math.floor(elong / 6); // 0-59
  let name;
  if (n === 0) name = 'Kimstughna';
  else if (n >= 1 && n <= 56) name = KARANA_MOVABLE[(n - 1) % 7];
  else name = ['Shakuni', 'Chatushpada', 'Naga'][n - 57];
  return { index: n, name };
}

// --------------------------------------------------------------------------
// PRECISE SUNRISE, SUNSET, DAY/NIGHT DURATION
// --------------------------------------------------------------------------
function formatDecimalHours(hours) {
  if (hours === undefined || isNaN(hours)) return '06:00:00';
  let h = normalizeDegrees(hours * 15) / 15; // wrap 0-24
  const hh = Math.floor(h);
  const mm = Math.floor((h - hh) * 60);
  const ss = Math.floor((((h - hh) * 60) - mm) * 60);
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
}

export function calculateSunRiseSet(date, latitude, longitude, timezoneOffset) {
  const Y = date.getFullYear();
  const M = date.getMonth() + 1;
  const D = date.getDate();

  // Day of year calculation
  const N1 = Math.floor(275 * M / 9);
  const N2 = Math.floor((M + 9) / 12);
  const N3 = (1 + Math.floor((Y - 4 * Math.floor(Y / 4) + 2) / 3));
  const N = N1 - (N2 * N3) + D - 30;

  // Approximate solar longitude
  const lngHour = longitude / 15;
  const t_rise = N + ((6 - lngHour) / 24);
  const t_set = N + ((18 - lngHour) / 24);

  const getSunParams = (t) => {
    const M_sun = (0.9856 * t) - 3.289;
    const L = normalizeDegrees(M_sun + (1.916 * Math.sin(M_sun * Math.PI / 180)) + (0.020 * Math.sin(2 * M_sun * Math.PI / 180)) + 282.634);
    
    // Sun Right Ascension (RA)
    let RA = normalizeDegrees(Math.atan(0.91764 * Math.tan(L * Math.PI / 180)) * 180 / Math.PI);
    const Lquadrant = Math.floor(L / 90) * 90;
    const RAquadrant = Math.floor(RA / 90) * 90;
    RA = (RA + (Lquadrant - RAquadrant)) / 15; // in hours

    // Sun Declination
    const sinDec = 0.39782 * Math.sin(L * Math.PI / 180);
    const cosDec = Math.cos(Math.asin(sinDec));
    return { L, RA, sinDec, cosDec };
  };

  const pRise = getSunParams(t_rise);
  const pSet = getSunParams(t_set);

  const latRad = latitude * Math.PI / 180;
  const cosZenith = Math.cos(90.8333 * Math.PI / 180); // official horizon zenith 90°50'

  // Hour Angle for sunrise
  const cosH_rise = (cosZenith - (pRise.sinDec * Math.sin(latRad))) / (pRise.cosDec * Math.cos(latRad));
  const cosH_set = (cosZenith - (pSet.sinDec * Math.sin(latRad))) / (pSet.cosDec * Math.cos(latRad));

  // Clamp for polar days/nights
  const H_rise = Math.acos(Math.max(-1, Math.min(1, cosH_rise))) * 180 / Math.PI / 15;
  const H_set = Math.acos(Math.max(-1, Math.min(1, cosH_set))) * 180 / Math.PI / 15;

  // Local mean time of sunrise and sunset
  const T_rise = (360 - (H_rise * 15)) / 15 + pRise.RA - (0.06571 * t_rise) - 6.622;
  const T_set = (H_set * 15) / 15 + pSet.RA - (0.06571 * t_set) - 6.622;

  // Convert to local civil time with timezone offset
  const UT_rise = (T_rise - lngHour + 24) % 24;
  const UT_set = (T_set - lngHour + 24) % 24;

  const sunriseHour = (UT_rise + timezoneOffset + 24) % 24;
  let sunsetHour = (UT_set + timezoneOffset + 24) % 24;
  if (sunsetHour < sunriseHour) sunsetHour += 24;

  const dayLengthHours = sunsetHour - sunriseHour;
  const nightLengthHours = 24 - dayLengthHours;

  const sunriseStr = formatDecimalHours(sunriseHour);
  const sunsetStr = formatDecimalHours(sunsetHour % 24);

  return {
    sunriseHour,
    sunsetHour: sunsetHour % 24,
    sunrise: sunriseStr,
    sunset: sunsetStr,
    sunriseStr,
    sunsetStr,
    dayLengthHours,
    nightLengthHours,
    dayLengthStr: `${Math.floor(dayLengthHours)}h ${Math.round((dayLengthHours % 1) * 60)}m`
  };
}

// --------------------------------------------------------------------------
// MUHURTA CALCULATIONS: RAHU KAAL, YAMAGANDA, GULIKA, ABHIJIT
// --------------------------------------------------------------------------
export function calculateMuhurtas(sunriseHour, sunsetHour, varaIndex) {
  let sSet = sunsetHour;
  if (sSet < sunriseHour) sSet += 24;
  const dayDuration = sSet - sunriseHour;
  const part = dayDuration / 8;

  // 1-indexed parts of daytime (1 to 8)
  // Sunday (0) to Saturday (6)
  const rahuParts = [8, 2, 7, 5, 6, 4, 3];
  const yamaParts = [5, 4, 3, 2, 1, 7, 6];
  const guliParts = [7, 6, 5, 4, 3, 2, 1];

  const getSlot = (partNum, label) => {
    const s = (sunriseHour + (partNum - 1) * part) % 24;
    const e = (sunriseHour + partNum * part) % 24;
    return {
      name: label,
      startHour: s,
      endHour: e,
      startStr: formatDecimalHours(s),
      endStr: formatDecimalHours(e)
    };
  };

  // Abhijit Muhurta: 8th Muhurta of 15 daytime muhurtas (centered on solar noon)
  // Not auspicious on Wednesday (varaIndex === 3)
  const muhurtaLen = dayDuration / 15;
  const abhijitStart = (sunriseHour + 7 * muhurtaLen) % 24;
  const abhijitEnd = (sunriseHour + 8 * muhurtaLen) % 24;

  return {
    rahuKaal: getSlot(rahuParts[varaIndex], 'Rahu Kaalam (Inauspicious)'),
    yamaganda: getSlot(yamaParts[varaIndex], 'Yamaganda Kaalam (Inauspicious)'),
    gulika: getSlot(guliParts[varaIndex], 'Gulika Kaalam (Neutral/Action)'),
    abhijit: {
      name: 'Abhijit Muhurta (Highly Auspicious)',
      isAuspicious: varaIndex !== 3,
      startHour: abhijitStart,
      endHour: abhijitEnd,
      startStr: formatDecimalHours(abhijitStart),
      endStr: formatDecimalHours(abhijitEnd),
      note: varaIndex === 3 ? 'Inauspicious on Wednesdays' : 'Universal Auspicious Window'
    }
  };
}

// --------------------------------------------------------------------------
// CHOGHADIYA TABLES (DAY & NIGHT 8-PERIODS)
// --------------------------------------------------------------------------
export const CHOGHADIYA_TYPES = {
  Amrit: { name: 'Amrit', quality: 'Best', tone: 'good', lord: 'Moon', desc: 'Nectar — highly auspicious for all undertakings' },
  Shubh: { name: 'Shubh', quality: 'Good', tone: 'good', lord: 'Jupiter', desc: 'Auspicious — excellent for religious and marriage ceremonies' },
  Labh: { name: 'Labh', quality: 'Gain', tone: 'good', lord: 'Mercury', desc: 'Profitable — ideal for business and education' },
  Char: { name: 'Char', quality: 'Movable', tone: 'neutral', lord: 'Venus', desc: 'Neutral — suitable for travel and dynamic actions' },
  Udveg: { name: 'Udveg', quality: 'Anxiety', tone: 'bad', lord: 'Sun', desc: 'Inauspicious — causes worry and obstacles' },
  Kaal: { name: 'Kaal', quality: 'Loss', tone: 'bad', lord: 'Saturn', desc: 'Inauspicious — ruled by Saturn, avoid new initiatives' },
  Rog: { name: 'Rog', quality: 'Illness', tone: 'bad', lord: 'Mars', desc: 'Inauspicious — ruled by Mars, avoid disputes and surgery' }
};

const DAY_CHOGHADIYA_ORDER = [
  ['Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg'], // Sun
  ['Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit'], // Mon
  ['Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog'],   // Tue
  ['Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh'], // Wed
  ['Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh'], // Thu
  ['Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char'],  // Fri
  ['Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal']   // Sat
];

const NIGHT_CHOGHADIYA_ORDER = [
  ['Shubh', 'Amrit', 'Char', 'Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh'], // Sun
  ['Char', 'Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit', 'Char'],  // Mon
  ['Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit', 'Char', 'Rog', 'Kaal'],  // Tue
  ['Udveg', 'Shubh', 'Amrit', 'Char', 'Rog', 'Kaal', 'Labh', 'Udveg'], // Wed
  ['Amrit', 'Char', 'Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit'], // Thu
  ['Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit', 'Char', 'Rog'],   // Fri
  ['Labh', 'Udveg', 'Shubh', 'Amrit', 'Char', 'Rog', 'Kaal', 'Labh']   // Sat
];

export function calculateChoghadiya(sunriseHour, sunsetHour, varaIndex) {
  let sSet = sunsetHour;
  if (sSet < sunriseHour) sSet += 24;
  const dayDuration = sSet - sunriseHour;
  const nightDuration = 24 - dayDuration;

  const daySlot = dayDuration / 8;
  const nightSlot = nightDuration / 8;

  const day = DAY_CHOGHADIYA_ORDER[varaIndex].map((name, i) => {
    const s = (sunriseHour + i * daySlot) % 24;
    const e = (sunriseHour + (i + 1) * daySlot) % 24;
    return {
      index: i + 1,
      name,
      ...CHOGHADIYA_TYPES[name],
      startHour: s,
      endHour: e,
      startStr: formatDecimalHours(s),
      endStr: formatDecimalHours(e)
    };
  });

  const night = NIGHT_CHOGHADIYA_ORDER[varaIndex].map((name, i) => {
    const s = (sunsetHour + i * nightSlot) % 24;
    const e = (sunsetHour + (i + 1) * nightSlot) % 24;
    return {
      index: i + 1,
      name,
      ...CHOGHADIYA_TYPES[name],
      startHour: s,
      endHour: e,
      startStr: formatDecimalHours(s),
      endStr: formatDecimalHours(e)
    };
  });

  return { day, night };
}

// --------------------------------------------------------------------------
// 24 PLANETARY HORAS
// --------------------------------------------------------------------------
const CHALDEAN_HORA_ORDER = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'];
const VARA_LORD_TO_HORA_START = {
  Sun: 'Sun',
  Moon: 'Moon',
  Mars: 'Mars',
  Mercury: 'Mercury',
  Jupiter: 'Jupiter',
  Venus: 'Venus',
  Saturn: 'Saturn'
};

export function calculateHoras(sunriseHour, sunsetHour, varaIndex) {
  let sSet = sunsetHour;
  if (sSet < sunriseHour) sSet += 24;
  const dayDuration = sSet - sunriseHour;
  const nightDuration = 24 - dayDuration;

  const dayHoraLen = dayDuration / 12;
  const nightHoraLen = nightDuration / 12;

  const startLord = VARAS[varaIndex].lord;
  let currIdx = CHALDEAN_HORA_ORDER.indexOf(startLord);

  const horas = [];
  for (let i = 0; i < 24; i++) {
    const isDay = i < 12;
    const len = isDay ? dayHoraLen : nightHoraLen;
    const base = isDay ? sunriseHour : sunsetHour;
    const offset = isDay ? i * len : (i - 12) * len;

    const s = (base + offset) % 24;
    const e = (base + offset + len) % 24;
    const lord = CHALDEAN_HORA_ORDER[currIdx % 7];

    horas.push({
      horaNumber: i + 1,
      period: isDay ? 'Day' : 'Night',
      lord,
      startHour: s,
      endHour: e,
      startStr: formatDecimalHours(s),
      endStr: formatDecimalHours(e)
    });

    currIdx = (currIdx + 1) % 7;
  }

  return horas;
}

/**
 * Full Panchang & Muhurta Snapshot
 */
export function calculatePanchang(date, sunSidereal, moonSidereal, sunTropical, moonTropical, lat = 28.6139, lon = 77.2090, tz = 5.5) {
  const varaIndex = date.getDay();
  const sunTimes = calculateSunRiseSet(date, lat, lon, tz);
  const muhurtas = calculateMuhurtas(sunTimes.sunriseHour, sunTimes.sunsetHour, varaIndex);
  const choghadiya = calculateChoghadiya(sunTimes.sunriseHour, sunTimes.sunsetHour, varaIndex);
  const horas = calculateHoras(sunTimes.sunriseHour, sunTimes.sunsetHour, varaIndex);

  return {
    vara: VARAS[varaIndex],
    tithi: getTithi(moonTropical, sunTropical),
    nakshatra: getNakshatra(moonSidereal),
    yoga: getYoga(sunSidereal, moonSidereal),
    karana: getKarana(moonTropical, sunTropical),
    sunTimes,
    muhurtas,
    choghadiya,
    horas
  };
}

// --------------------------------------------------------------------------
// Chandra Gochar — the transiting Moon's house counted from a natal Rashi.
// --------------------------------------------------------------------------
const GOCHAR_HOUSE_MEANING = {
  1: { key: 'Janma', tone: 'mixed', text: 'The Moon is over your Rashi. Emotions run close to the surface — a day for self-care and rest rather than big decisions.' },
  2: { key: 'Dhana', tone: 'good', text: 'Focus turns to money, food, family and speech. Favourable for finances and warm conversations.' },
  3: { key: 'Parakrama', tone: 'good', text: 'Courage and initiative are high. A strong day for effort, communication, and short trips.' },
  4: { key: 'Sukha', tone: 'mixed', text: 'Attention moves home and inward. Comfort and family matter; avoid overexertion.' },
  5: { key: 'Putra', tone: 'good', text: 'Creativity, romance and children are highlighted. Good for learning and self-expression.' },
  6: { key: 'Ripu', tone: 'challenging', text: 'A testing transit — health, debts and conflicts need care. Stay disciplined and patient.' },
  7: { key: 'Kalatra', tone: 'good', text: 'Partnerships and relationships come forward. Favourable for meetings and agreements.' },
  8: { key: 'Ayu', tone: 'challenging', text: 'An inward, sensitive transit. Avoid risk and confrontation; guard your energy and secrets.' },
  9: { key: 'Bhagya', tone: 'good', text: 'Fortune and higher purpose are supported. Good for travel, teachers, and faith.' },
  10: { key: 'Karma', tone: 'good', text: 'Career and public standing are in focus. A productive day to act on ambitions.' },
  11: { key: 'Labha', tone: 'good', text: 'The most favourable Moon transit — gains, friends, and fulfilled desires.' },
  12: { key: 'Vyaya', tone: 'challenging', text: 'Energy dips and expenses rise. Rest, retreat, and release rather than push forward.' }
};

export function getChandraGochar(natalRashiIndex, transitRashiIndex) {
  const house = ((transitRashiIndex - natalRashiIndex + 12) % 12) + 1;
  return { house, ...GOCHAR_HOUSE_MEANING[house] };
}
