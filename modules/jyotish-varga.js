/**
 * Shodashvarga (Divisional Charts) Module - Jyotisha
 * Mathematical calculation of all classical Vedic sub-divisional charts:
 * D1, D2, D3, D4, D7, D9, D10, D12, D16, D20, D24, D27, D30, D60.
 */

import { normalizeDegrees } from './astrology.js';

export const VARGA_DEFINITIONS = [
  { code: 'D1', name: 'Rashi', description: 'Root natal chart: physical body, life overview, and general destiny.' },
  { code: 'D2', name: 'Hora', description: 'Wealth, finances, prosperity, and lunar/solar energy polarity.' },
  { code: 'D3', name: 'Drekkana', description: 'Siblings, courage, vitality, energy, and karmic initiatives.' },
  { code: 'D4', name: 'Chaturthamsha', description: 'Fixed assets, real estate, vehicles, fortune, and inner contentment.' },
  { code: 'D7', name: 'Saptamsha', description: 'Children, progeny, creative lineage, and grand achievements.' },
  { code: 'D9', name: 'Navamsa', description: 'Spouse, marriage, dharma, inner soul qualities, and second half of life.' },
  { code: 'D10', name: 'Dashamsha', description: 'Career, professional status, public fame, authority, and karma.' },
  { code: 'D12', name: 'Dwadashamsha', description: 'Parents, ancestral heritage, past-life karma, and lineage blessings.' },
  { code: 'D16', name: 'Shodashamsha', description: 'Vehicles, luxury, conveyances, and general happiness/comfort.' },
  { code: 'D20', name: 'Vimsamsha', description: 'Spiritual progress, meditation, devotion (Upasana), and occult potential.' },
  { code: 'D24', name: 'Chaturvimsamsha', description: 'Higher learning, academic success, intellect, skill, and wisdom.' },
  { code: 'D27', name: 'Saptavimsamsha', description: 'Inherent strengths, physical resilience, vulnerabilities, and stamina.' },
  { code: 'D30', name: 'Trimsamsha', description: 'Afflictions, misfortunes, diseases, karmic debts, and moral character.' },
  { code: 'D60', name: 'Shashtiamsha', description: 'Root past-life karma (the most crucial chart in classical Parashara).' }
];

/**
 * Given a sidereal longitude (0-360), computes the Rashi sign index (0-11)
 * for the requested divisional chart code.
 */
export function getVargaRashiIndex(siderealLon, vargaCode = 'D1') {
  const lon = normalizeDegrees(siderealLon);
  const rashi = Math.floor(lon / 30); // 0 = Mesha (Aries), 11 = Meena (Pisces)
  const deg = lon % 30; // 0 to 29.9999... degrees within sign
  const isOdd = rashi % 2 === 0; // 0 (Aries) is odd in 1-indexed counting (1st sign)

  switch (vargaCode.toUpperCase()) {
    case 'D1':
      return rashi;

    case 'D2': { // Hora: 15°
      if (isOdd) {
        return deg < 15 ? 4 : 3; // Sun (Leo=4), Moon (Cancer=3)
      } else {
        return deg < 15 ? 3 : 4; // Moon (Cancer=3), Sun (Leo=4)
      }
    }

    case 'D3': { // Drekkana: 10°
      const part = Math.floor(deg / 10); // 0, 1, 2
      if (part === 0) return rashi;
      if (part === 1) return (rashi + 4) % 12; // 5th from sign
      return (rashi + 8) % 12; // 9th from sign
    }

    case 'D4': { // Chaturthamsha: 7°30'
      const part = Math.floor(deg / 7.5); // 0, 1, 2, 3
      return (rashi + part * 3) % 12;
    }

    case 'D7': { // Saptamsha: 30° / 7 ≈ 4.2857°
      const part = Math.floor(deg / (30 / 7));
      if (isOdd) {
        return (rashi + part) % 12;
      } else {
        return (rashi + 6 + part) % 12; // 7th sign from it
      }
    }

    case 'D9': { // Navamsa: 3°20'
      return Math.floor(lon / (30 / 9)) % 12;
    }

    case 'D10': { // Dashamsha: 3°
      const part = Math.floor(deg / 3);
      if (isOdd) {
        return (rashi + part) % 12;
      } else {
        return (rashi + 8 + part) % 12; // 9th sign from it
      }
    }

    case 'D12': { // Dwadashamsha: 2°30'
      const part = Math.floor(deg / 2.5);
      return (rashi + part) % 12;
    }

    case 'D16': { // Shodashamsha: 1°52'30" (1.875°)
      const part = Math.floor(deg / 1.875);
      // Movable (0, 3, 6, 9) starts Aries (0); Fixed (1, 4, 7, 10) starts Leo (4); Dual (2, 5, 8, 11) starts Sag (8)
      const modality = rashi % 3;
      const start = modality === 0 ? 0 : modality === 1 ? 4 : 8;
      return (start + part) % 12;
    }

    case 'D20': { // Vimsamsha: 1°30' (1.5°)
      const part = Math.floor(deg / 1.5);
      const modality = rashi % 3;
      const start = modality === 0 ? 0 : modality === 1 ? 8 : 4;
      return (start + part) % 12;
    }

    case 'D24': { // Chaturvimsamsha: 1°15' (1.25°)
      const part = Math.floor(deg / 1.25);
      const start = isOdd ? 4 : 3; // Odd: Leo (4), Even: Cancer (3)
      return (start + part) % 12;
    }

    case 'D27': { // Saptavimsamsha: 30° / 27 ≈ 1.1111°
      const part = Math.floor(deg / (30 / 27));
      const element = rashi % 4; // 0=Fire(Aries), 1=Earth(Cancer), 2=Air(Libra), 3=Water(Cap)
      const start = element === 0 ? 0 : element === 1 ? 3 : element === 2 ? 6 : 9;
      return (start + part) % 12;
    }

    case 'D30': { // Trimsamsha: Unequal planetary portions
      if (isOdd) {
        if (deg < 5) return 0;       // Mars (Aries)
        if (deg < 10) return 10;     // Saturn (Aquarius)
        if (deg < 18) return 8;      // Jupiter (Sagittarius)
        if (deg < 25) return 2;      // Mercury (Gemini)
        return 6;                    // Venus (Libra)
      } else {
        if (deg < 5) return 1;       // Venus (Taurus)
        if (deg < 12) return 5;      // Mercury (Virgo)
        if (deg < 20) return 11;     // Jupiter (Pisces)
        if (deg < 25) return 9;      // Saturn (Capricorn)
        return 7;                    // Mars (Scorpio)
      }
    }

    case 'D60': { // Shashtiamsha: 0°30' (0.5°)
      const part = Math.floor(deg / 0.5);
      return (rashi + part) % 12;
    }

    default:
      return rashi;
  }
}

/**
 * Returns a synthetic longitude at the center of the Varga's Rashi (rashi * 30 + 15),
 * enabling standard Kundli canvas renderers to draw any divisional chart seamlessly.
 */
export function getVargaSyntheticLongitude(siderealLon, vargaCode = 'D1') {
  return getVargaRashiIndex(siderealLon, vargaCode) * 30 + 15;
}

/**
 * Calculate all planetary and Lagna positions for a given Varga chart.
 */
export function calculateVargaChart(positions, lagnaSidereal, vargaCode = 'D1') {
  const vargaPositions = {};
  Object.keys(positions).forEach(graha => {
    vargaPositions[graha] = getVargaSyntheticLongitude(positions[graha], vargaCode);
  });
  const vargaLagna = getVargaSyntheticLongitude(lagnaSidereal, vargaCode);
  return {
    code: vargaCode,
    positions: vargaPositions,
    lagna: vargaLagna,
    lagnaRashiIndex: getVargaRashiIndex(lagnaSidereal, vargaCode)
  };
}
