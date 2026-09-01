/**
 * Parashari Graha Drishti (Planetary Aspects) Engine - Jyotisha
 * Computes special Parashari aspects for all 9 Grahas,
 * determines aspected houses and aspected planets, and generates an aspect matrix.
 */

import { normalizeDegrees } from './astrology.js';
import { RASHIS } from './jyotish.js';

// Special Parashari full aspects (1-indexed house count from planet's occupied sign)
export const SPECIAL_ASPECTS = {
  Sun: [7],
  Moon: [7],
  Mars: [4, 7, 8],
  Mercury: [7],
  Jupiter: [5, 7, 9],
  Venus: [7],
  Saturn: [3, 7, 10],
  Rahu: [5, 7, 9],
  Ketu: [5, 7, 9]
};

const rashiOf = (lon) => Math.floor(normalizeDegrees(lon) / 30);

/**
 * Calculates all planetary aspects given sidereal positions and Lagna.
 * @param {Object} positions - { Sun: lon, Moon: lon, ... }
 * @param {number} lagnaSid  - Lagna sidereal longitude
 */
export function calculateGrahaDrishti(positions, lagnaSid) {
  const lagnaRashi = rashiOf(lagnaSid);
  const planetRashis = {};
  const planetsByRashi = Array.from({ length: 12 }, () => []);

  Object.keys(positions).forEach(graha => {
    const r = rashiOf(positions[graha]);
    planetRashis[graha] = r;
    planetsByRashi[r].push(graha);
  });

  const aspectList = [];
  const matrix = {}; // matrix[fromGraha][toGraha] = [aspectNumbers]

  Object.keys(positions).forEach(fromGraha => {
    matrix[fromGraha] = {};
    const fromRashi = planetRashis[fromGraha];
    const fromHouse = ((fromRashi - lagnaRashi + 12) % 12) + 1;
    const aspectOffsets = SPECIAL_ASPECTS[fromGraha] || [7];

    const aspectedHouses = [];
    const aspectedGrahas = [];

    aspectOffsets.forEach(hOffset => {
      const targetRashi = (fromRashi + (hOffset - 1)) % 12;
      const targetHouse = ((targetRashi - lagnaRashi + 12) % 12) + 1;
      const targetGrahasInRashi = planetsByRashi[targetRashi];

      aspectedHouses.push({
        houseNumber: targetHouse,
        rashiName: RASHIS[targetRashi].name,
        aspectOrdinal: hOffset
      });

      targetGrahasInRashi.forEach(toGraha => {
        if (toGraha !== fromGraha) {
          aspectedGrahas.push({
            graha: toGraha,
            houseNumber: targetHouse,
            aspectOrdinal: hOffset
          });
          if (!matrix[fromGraha][toGraha]) matrix[fromGraha][toGraha] = [];
          matrix[fromGraha][toGraha].push(hOffset);
        }
      });
    });

    aspectList.push({
      graha: fromGraha,
      occupiedHouse: fromHouse,
      occupiedRashi: RASHIS[fromRashi].name,
      aspectOffsets,
      aspectedHouses,
      aspectedGrahas
    });
  });

  // Find mutual aspects (where A aspects B and B aspects A)
  const mutualAspects = [];
  const checkedPairs = new Set();
  Object.keys(positions).forEach(g1 => {
    Object.keys(positions).forEach(g2 => {
      if (g1 === g2) return;
      const pairKey = [g1, g2].sort().join('-');
      if (checkedPairs.has(pairKey)) return;

      if (matrix[g1] && matrix[g1][g2] && matrix[g2] && matrix[g2][g1]) {
        checkedPairs.add(pairKey);
        mutualAspects.push({
          graha1: g1,
          graha2: g2,
          aspect1to2: matrix[g1][g2],
          aspect2to1: matrix[g2][g1],
          detail: `${g1} (${matrix[g1][g2].join(',')}th aspect) ↔ ${g2} (${matrix[g2][g1].join(',')}th aspect)`
        });
      }
    });
  });

  return {
    aspectList,
    matrix,
    mutualAspects
  };
}
