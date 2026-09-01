/**
 * Ashtakavarga Module - Jyotisha
 * Classical Parashara Ashtakavarga system:
 * - Bhinnashtakavarga (BAV) for the 7 classical planets (Sun..Saturn) across 12 Rashis.
 * - Sarvashtakavarga (SAV) aggregate matrix summing to exactly 337 bindus.
 * - House analysis and Gochar (transit) evaluation.
 */

import { normalizeDegrees } from './astrology.js';
import { RASHIS } from './jyotish.js';

// Parashari Benefic House Positions (1-indexed house offsets from reference graha/Lagna)
export const ASHTAKAVARGA_RULES = {
  Sun: {
    fromSun: [1, 2, 4, 7, 8, 9, 10, 11],
    fromMoon: [3, 6, 10, 11],
    fromMars: [1, 2, 4, 7, 8, 9, 10, 11],
    fromMercury: [3, 5, 6, 9, 10, 11, 12],
    fromJupiter: [5, 6, 9, 11],
    fromVenus: [6, 7, 12],
    fromSaturn: [1, 2, 4, 7, 8, 9, 10, 11],
    fromLagna: [3, 4, 6, 10, 11, 12]
  },
  Moon: {
    fromSun: [3, 6, 7, 8, 10, 11],
    fromMoon: [1, 3, 6, 7, 10, 11],
    fromMars: [2, 3, 5, 6, 9, 10, 11],
    fromMercury: [1, 3, 4, 5, 7, 8, 10, 11],
    fromJupiter: [1, 4, 7, 8, 10, 11, 12],
    fromVenus: [3, 4, 5, 7, 9, 10, 11],
    fromSaturn: [3, 5, 6, 11],
    fromLagna: [3, 6, 10, 11]
  },
  Mars: {
    fromSun: [3, 5, 6, 10, 11],
    fromMoon: [3, 6, 11],
    fromMars: [1, 2, 4, 7, 8, 10, 11],
    fromMercury: [3, 5, 6, 11],
    fromJupiter: [6, 10, 11, 12],
    fromVenus: [6, 8, 11, 12],
    fromSaturn: [1, 4, 7, 8, 9, 10, 11],
    fromLagna: [1, 3, 6, 10, 11]
  },
  Mercury: {
    fromSun: [5, 6, 9, 11, 12],
    fromMoon: [2, 4, 6, 8, 10, 11],
    fromMars: [1, 2, 4, 7, 8, 9, 10, 11],
    fromMercury: [1, 3, 5, 6, 9, 10, 11, 12],
    fromJupiter: [6, 8, 11, 12],
    fromVenus: [1, 2, 3, 4, 5, 8, 9, 11],
    fromSaturn: [1, 2, 4, 7, 8, 9, 10, 11],
    fromLagna: [1, 2, 4, 6, 8, 10, 11]
  },
  Jupiter: {
    fromSun: [1, 2, 3, 4, 7, 8, 9, 10, 11],
    fromMoon: [2, 5, 7, 9, 11],
    fromMars: [1, 2, 4, 7, 8, 10, 11],
    fromMercury: [1, 2, 4, 5, 6, 9, 10, 11],
    fromJupiter: [1, 2, 3, 4, 7, 8, 10, 11],
    fromVenus: [2, 5, 6, 9, 10, 11],
    fromSaturn: [3, 5, 6, 12],
    fromLagna: [1, 2, 4, 5, 6, 7, 9, 10, 11]
  },
  Venus: {
    fromSun: [8, 11, 12],
    fromMoon: [1, 2, 3, 4, 5, 8, 9, 11, 12],
    fromMars: [3, 5, 6, 9, 11, 12],
    fromMercury: [3, 5, 6, 9, 11],
    fromJupiter: [5, 8, 9, 10, 11],
    fromVenus: [1, 2, 3, 4, 5, 8, 9, 10, 11],
    fromSaturn: [3, 4, 5, 8, 9, 10, 11],
    fromLagna: [1, 2, 3, 4, 5, 8, 9, 11]
  },
  Saturn: {
    fromSun: [1, 2, 4, 7, 8, 10, 11],
    fromMoon: [3, 6, 11],
    fromMars: [3, 5, 6, 10, 11, 12],
    fromMercury: [6, 8, 9, 10, 11, 12],
    fromJupiter: [5, 6, 11, 12],
    fromVenus: [6, 11, 12],
    fromSaturn: [3, 5, 6, 11],
    fromLagna: [1, 3, 4, 6, 10, 11]
  }
};

const GRAHA_KEYS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

/**
 * Calculates Bhinnashtakavarga (BAV) for all 7 planets and Sarvashtakavarga (SAV).
 *
 * @param {Object} positions - Sidereal longitudes keyed by graha
 * @param {number} lagnaSid  - Sidereal Lagna longitude
 * @returns {Object} { bav: { Sun: [12], ... }, sav: [12], houseScores: [12], totalBindus: 337 }
 */
export function calculateAshtakavarga(positions, lagnaSid) {
  const rashiOf = (lon) => Math.floor(normalizeDegrees(lon) / 30);
  const r = {};
  GRAHA_KEYS.forEach(g => { r[g] = rashiOf(positions[g]); });
  const lagnaRashi = rashiOf(lagnaSid);

  // References: Sun..Saturn + Lagna
  const refRashis = {
    fromSun: r.Sun,
    fromMoon: r.Moon,
    fromMars: r.Mars,
    fromMercury: r.Mercury,
    fromJupiter: r.Jupiter,
    fromVenus: r.Venus,
    fromSaturn: r.Saturn,
    fromLagna: lagnaRashi
  };

  const bav = {};
  const sav = new Array(12).fill(0);

  GRAHA_KEYS.forEach(targetGraha => {
    const rules = ASHTAKAVARGA_RULES[targetGraha];
    const binduArray = new Array(12).fill(0);

    Object.keys(rules).forEach(refKey => {
      const startRashi = refRashis[refKey];
      const houses = rules[refKey];
      houses.forEach(h => {
        const destRashi = (startRashi + (h - 1)) % 12;
        binduArray[destRashi] += 1;
      });
    });

    bav[targetGraha] = binduArray;
    for (let i = 0; i < 12; i++) {
      sav[i] += binduArray[i];
    }
  });

  // Calculate scores per house (House 1 = Lagna Rashi)
  const houseScores = [];
  for (let h = 1; h <= 12; h++) {
    const rIdx = (lagnaRashi + (h - 1)) % 12;
    const bindus = sav[rIdx];
    let evaluation = 'Moderate';
    if (bindus >= 32) evaluation = 'Very Strong';
    else if (bindus >= 28) evaluation = 'Favourable';
    else if (bindus <= 23) evaluation = 'Challenging / Weak';

    houseScores.push({
      house: h,
      rashiIndex: rIdx,
      rashiName: RASHIS[rIdx].name,
      bindus,
      evaluation
    });
  }

  const totalBindus = sav.reduce((a, b) => a + b, 0);

  return {
    bav,
    sav,
    houseScores,
    totalBindus,
    lagnaRashi
  };
}
