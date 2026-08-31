/**
 * Panchang & Gochar - Jyotisha
 * The five limbs of the Hindu almanac (Tithi, Vara, Nakshatra, Yoga, Karana) plus
 * Chandra Gochar (the transiting Moon's house from a natal Rashi) for a daily Rashifal.
 */

import { normalizeDegrees } from './astrology.js';
import { getNakshatra } from './jyotish.js';

// Vara — weekday (JS getDay(): 0 = Sunday), with its ruling graha.
export const VARAS = [
  { name: 'Ravivara', english: 'Sunday', lord: 'Sun' },
  { name: 'Somavara', english: 'Monday', lord: 'Moon' },
  { name: 'Mangalavara', english: 'Tuesday', lord: 'Mars' },
  { name: 'Budhavara', english: 'Wednesday', lord: 'Mercury' },
  { name: 'Guruvara', english: 'Thursday', lord: 'Jupiter' },
  { name: 'Shukravara', english: 'Friday', lord: 'Venus' },
  { name: 'Shanivara', english: 'Saturday', lord: 'Saturn' }
];

// The 15 tithi names within a paksha (the 15th is Purnima in Shukla, Amavasya in Krishna).
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

// Tithi from the Moon-Sun elongation (ayanamsa cancels, so tropical or sidereal agree).
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

// Yoga from the sum of sidereal Sun + Moon longitudes.
export function getYoga(sunSidereal, moonSidereal) {
  const sum = normalizeDegrees(sunSidereal + moonSidereal);
  const index = Math.floor(sum / (360 / 27));
  return { index, name: YOGA_NAMES[index] };
}

// Karana — half a tithi; 60 half-tithis per lunar month over 11 karanas.
export function getKarana(moonLongitude, sunLongitude) {
  const elong = normalizeDegrees(moonLongitude - sunLongitude);
  const n = Math.floor(elong / 6); // 0-59
  let name;
  if (n === 0) name = 'Kimstughna';
  else if (n >= 1 && n <= 56) name = KARANA_MOVABLE[(n - 1) % 7];
  else name = ['Shakuni', 'Chatushpada', 'Naga'][n - 57];
  return { index: n, name };
}

/**
 * Full Panchang for an instant.
 * @param {Date}   date        - the day/time
 * @param {number} sunSidereal
 * @param {number} moonSidereal
 * @param {number} sunTropical
 * @param {number} moonTropical
 */
export function calculatePanchang(date, sunSidereal, moonSidereal, sunTropical, moonTropical) {
  return {
    vara: VARAS[date.getDay()],
    tithi: getTithi(moonTropical, sunTropical),
    nakshatra: getNakshatra(moonSidereal),
    yoga: getYoga(sunSidereal, moonSidereal),
    karana: getKarana(moonTropical, sunTropical)
  };
}

// --------------------------------------------------------------------------
// Chandra Gochar — the transiting Moon's house counted from a natal Rashi.
// This is the basis of a daily Moon-sign Rashifal.
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

// natalRashiIndex, transitRashiIndex: 0-11. Returns the house (1-12) and its meaning.
export function getChandraGochar(natalRashiIndex, transitRashiIndex) {
  const house = ((transitRashiIndex - natalRashiIndex + 12) % 12) + 1;
  return { house, ...GOCHAR_HOUSE_MEANING[house] };
}
