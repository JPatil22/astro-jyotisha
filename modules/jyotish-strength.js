/**
 * Graha Strength - Jyotisha
 * Dignity (exalted / debilitated / own / moolatrikona / friend-neutral-enemy sign),
 * retrograde (Vakri), and combustion (Astangata). All from the sidereal chart.
 */

import { normalizeDegrees, calculateGeocentricLongitude } from './astrology.js';
import { RASHIS } from './jyotish.js';

// Dignity tables (sign indices 0=Mesha … 11=Meena). Nodes have no sign ownership.
const DIGNITY = {
  Sun:     { exalt: 0,  debil: 6,  own: [4],    moola: 4 },
  Moon:    { exalt: 1,  debil: 7,  own: [3],    moola: 1 },
  Mars:    { exalt: 9,  debil: 3,  own: [0, 7], moola: 0 },
  Mercury: { exalt: 5,  debil: 11, own: [2, 5], moola: 5 },
  Jupiter: { exalt: 3,  debil: 9,  own: [8, 11],moola: 8 },
  Venus:   { exalt: 11, debil: 5,  own: [1, 6], moola: 6 },
  Saturn:  { exalt: 6,  debil: 0,  own: [9, 10],moola: 10 }
};

// Natural (Naisargika) friendships between grahas — used to classify a sign as
// friendly / neutral / enemy via the sign's lord.
const NAT_FRIENDS = {
  Sun:     { friends: ['Moon', 'Mars', 'Jupiter'], enemies: ['Venus', 'Saturn'] },
  Moon:    { friends: ['Sun', 'Mercury'], enemies: [] },
  Mars:    { friends: ['Sun', 'Moon', 'Jupiter'], enemies: ['Mercury'] },
  Mercury: { friends: ['Sun', 'Venus'], enemies: ['Moon'] },
  Jupiter: { friends: ['Sun', 'Moon', 'Mars'], enemies: ['Mercury', 'Venus'] },
  Venus:   { friends: ['Mercury', 'Saturn'], enemies: ['Sun', 'Moon'] },
  Saturn:  { friends: ['Mercury', 'Venus'], enemies: ['Sun', 'Moon', 'Mars'] }
};

// Combustion orbs (degrees from the Sun) per graha.
const COMBUST_ORB = { Moon: 12, Mars: 17, Mercury: 14, Jupiter: 11, Venus: 10, Saturn: 15 };

function angularDiff(a, b) {
  let d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

// Dignity of a graha given its sidereal longitude.
export function getDignity(graha, siderealLon) {
  if (graha === 'Rahu' || graha === 'Ketu') return { status: '—', short: '' };
  const sign = Math.floor(normalizeDegrees(siderealLon) / 30);
  const d = DIGNITY[graha];
  if (sign === d.exalt) return { status: 'Exalted', short: 'Uccha' };
  if (sign === d.debil) return { status: 'Debilitated', short: 'Neecha' };
  const deg = normalizeDegrees(siderealLon) % 30;
  if (sign === d.moola && d.own.includes(sign)) {
    // Moolatrikona occupies part of the own sign; own beyond it.
    return { status: 'Moolatrikona / Own', short: 'Moolatrikona' };
  }
  if (d.own.includes(sign)) return { status: 'Own sign', short: 'Swakshetra' };
  // Otherwise classify by the sign lord's relationship to the graha.
  const lord = RASHIS[sign].lord;
  const rel = NAT_FRIENDS[graha];
  if (lord === graha) return { status: 'Own sign', short: 'Swakshetra' };
  if (rel.friends.includes(lord)) return { status: 'Friendly sign', short: 'Mitra' };
  if (rel.enemies.includes(lord)) return { status: 'Enemy sign', short: 'Shatru' };
  return { status: 'Neutral sign', short: 'Sama' };
}

// Retrograde (Vakri). Sun & Moon never retrograde; the mean nodes always are.
export function isRetrograde(graha, T) {
  if (graha === 'Sun' || graha === 'Moon') return false;
  if (graha === 'Rahu' || graha === 'Ketu') return true;
  const dt = 2 / 36525; // 2 days in Julian centuries
  const l1 = calculateGeocentricLongitude(graha, T);
  const l2 = calculateGeocentricLongitude(graha, T + dt);
  const motion = ((l2 - l1 + 540) % 360) - 180; // signed shortest step
  return motion < 0;
}

// Combustion (Astangata): graha too close to the Sun. Not applicable to Sun/nodes.
export function isCombust(graha, grahaSid, sunSid) {
  if (!(graha in COMBUST_ORB)) return false;
  return angularDiff(grahaSid, sunSid) < COMBUST_ORB[graha];
}

// Convenience: full strength summary for one graha.
export function analyzeGraha(graha, siderealLon, sunSidereal, T) {
  return {
    dignity: getDignity(graha, siderealLon),
    retrograde: isRetrograde(graha, T),
    combust: isCombust(graha, siderealLon, sunSidereal)
  };
}
