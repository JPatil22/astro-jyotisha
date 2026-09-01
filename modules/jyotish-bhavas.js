/**
 * Bhava Chalit & House Cusps Module - Jyotisha
 * Sripati House System & Bhava Chalit calculation.
 * Computes Bhava Madhya (house midpoints), Bhava Sandhi (house boundaries),
 * and maps planets to their true operational house (Bhava).
 */

import { normalizeDegrees } from './astrology.js';
import { RASHIS } from './jyotish.js';

function shortestArc(from, to) {
  return normalizeDegrees(to - from);
}

/**
 * Calculates Sripati house cusps (midpoints and sandhis).
 * @param {number} lagnaSid - Sidereal Lagna (Ascendant) longitude
 * @param {number} mcSid    - Sidereal MC (10th house cusp) longitude
 */
export function calculateSripatiBhavas(lagnaSid, mcSid) {
  const midpoints = new Array(12);
  const sandhis = new Array(12);

  // House 1 midpoint = Lagna
  midpoints[0] = normalizeDegrees(lagnaSid);
  // House 7 midpoint = Lagna + 180°
  midpoints[6] = normalizeDegrees(lagnaSid + 180);
  // House 10 midpoint = MC
  midpoints[9] = normalizeDegrees(mcSid);
  // House 4 midpoint = MC + 180°
  midpoints[3] = normalizeDegrees(mcSid + 180);

  // Quadrant 1: House 10 to House 1 (Arc across houses 10, 11, 12, 1)
  const arc10_1 = shortestArc(midpoints[9], midpoints[0]);
  const step10_1 = arc10_1 / 3;
  midpoints[10] = normalizeDegrees(midpoints[9] + step10_1);     // House 11
  midpoints[11] = normalizeDegrees(midpoints[9] + step10_1 * 2); // House 12

  // Quadrant 2: House 1 to House 4 (Houses 1, 2, 3, 4)
  const arc1_4 = shortestArc(midpoints[0], midpoints[3]);
  const step1_4 = arc1_4 / 3;
  midpoints[1] = normalizeDegrees(midpoints[0] + step1_4);       // House 2
  midpoints[2] = normalizeDegrees(midpoints[0] + step1_4 * 2);   // House 3

  // Quadrant 3: House 4 to House 7 (Houses 4, 5, 6, 7)
  const arc4_7 = shortestArc(midpoints[3], midpoints[6]);
  const step4_7 = arc4_7 / 3;
  midpoints[4] = normalizeDegrees(midpoints[3] + step4_7);       // House 5
  midpoints[5] = normalizeDegrees(midpoints[3] + step4_7 * 2);   // House 6

  // Quadrant 4: House 7 to House 10 (Houses 7, 8, 9, 10)
  const arc7_10 = shortestArc(midpoints[6], midpoints[9]);
  const step7_10 = arc7_10 / 3;
  midpoints[7] = normalizeDegrees(midpoints[6] + step7_10);      // House 8
  midpoints[8] = normalizeDegrees(midpoints[6] + step7_10 * 2);  // House 9

  // Sandhis (junction boundaries) are exact midpoints between consecutive Bhava Madhyas
  for (let i = 0; i < 12; i++) {
    const next = (i + 1) % 12;
    const arc = shortestArc(midpoints[i], midpoints[next]);
    sandhis[i] = normalizeDegrees(midpoints[i] + arc / 2);
  }

  return { midpoints, sandhis };
}

/**
 * Maps a sidereal longitude into its Sripati Bhava (1-12).
 */
export function getBhavaNumber(siderealLon, sandhis) {
  const lon = normalizeDegrees(siderealLon);
  for (let i = 0; i < 12; i++) {
    const startSandhi = sandhis[(i + 11) % 12]; // start of house (i+1)
    const endSandhi = sandhis[i];               // end of house (i+1)

    const span = shortestArc(startSandhi, endSandhi);
    const dist = shortestArc(startSandhi, lon);
    if (dist >= 0 && dist < span) {
      return i + 1;
    }
  }
  return 1;
}

/**
 * Generates the full Bhava Chalit placements and comparison with D1 Rashi chart.
 */
export function calculateBhavaChalit(positions, lagnaSid) {
  // Approximate MC as 10th sign midpoint (Lagna + 270) if not directly passed
  const mcSid = normalizeDegrees(lagnaSid + 270);
  const { midpoints, sandhis } = calculateSripatiBhavas(lagnaSid, mcSid);

  const chalitPlacements = {};
  const shifts = [];

  Object.keys(positions).forEach(graha => {
    const lon = positions[graha];
    const rashiHouse = Math.floor(normalizeDegrees(lon - lagnaSid + 360) / 30) + 1;
    const bhavaHouse = getBhavaNumber(lon, sandhis);

    chalitPlacements[graha] = {
      longitude: lon,
      rashiHouse,
      bhavaHouse,
      isShifted: rashiHouse !== bhavaHouse
    };

    if (rashiHouse !== bhavaHouse) {
      shifts.push({
        graha,
        fromHouse: rashiHouse,
        toHouse: bhavaHouse,
        note: `${graha} sits in House ${rashiHouse} by Rashi, but acts in House ${bhavaHouse} in Bhava Chalit.`
      });
    }
  });

  return {
    midpoints,
    cusps: midpoints,
    sandhis,
    chalitPlacements,
    shifts
  };
}
