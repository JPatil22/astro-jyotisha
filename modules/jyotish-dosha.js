/**
 * Dosha Analysis - Jyotisha
 * Detects the common natal doshas from a computed sidereal chart:
 * Manglik (Kuja), Kaal Sarp, Sade Sati, Kemadruma, Guru Chandal, Grahan, Angarak.
 *
 * All checks use whole-sign (same-Rashi) conjunction — the common simplification.
 */

import { normalizeDegrees } from './astrology.js';
import { getHouseFromLagna, isManglikHouse, RASHIS } from './jyotish.js';

const rashiOf = (lon) => Math.floor(normalizeDegrees(lon) / 30);

/**
 * @param {Object} positions  - sidereal longitudes keyed by graha (incl. Rahu, Ketu)
 * @param {number} lagnaSid    - sidereal Lagna longitude
 * @param {number} saturnTransitSid - today's sidereal Saturn longitude (for Sade Sati)
 * @returns {Array} list of { name, present, severity, detail }
 */
export function detectDoshas(positions, lagnaSid, saturnTransitSid = positions?.Saturn ?? 0) {
  if (typeof saturnTransitSid !== 'number' || isNaN(saturnTransitSid)) {
    saturnTransitSid = positions?.Saturn ?? 0;
  }
  const doshas = [];
  const r = {};
  ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']
    .forEach(g => { r[g] = rashiOf(positions[g] ?? 0); });
  const moonR = r.Moon;

  // --- Manglik (Kuja) Dosha: Mars in 1/2/4/7/8/12 from Lagna ---
  const marsHouse = getHouseFromLagna(positions.Mars, lagnaSid);
  doshas.push({
    name: 'Manglik (Kuja) Dosha',
    present: isManglikHouse(marsHouse),
    detail: isManglikHouse(marsHouse)
      ? `Mars is in house ${marsHouse} from the Lagna — a Mangal Dosha house.`
      : `Mars is in house ${marsHouse} from the Lagna — no Mangal Dosha.`
  });

  // --- Kaal Sarp Dosha: all 7 grahas hemmed on one side of the Rahu–Ketu axis ---
  const seven = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const fromRahu = seven.map(g => normalizeDegrees(positions[g] - positions.Rahu));
  const side1 = fromRahu.every(d => d > 0 && d < 180);
  const side2 = fromRahu.every(d => d > 180 && d < 360);
  const kaalSarp = side1 || side2;
  doshas.push({
    name: 'Kaal Sarp Dosha',
    present: kaalSarp,
    detail: kaalSarp
      ? 'All seven grahas fall on one side of the Rahu–Ketu axis.'
      : 'Grahas fall on both sides of the Rahu–Ketu axis — no Kaal Sarp.'
  });

  // --- Sade Sati: transiting Saturn in the 12th, 1st or 2nd Rashi from natal Moon ---
  const satR = rashiOf(saturnTransitSid);
  const houseFromMoon = ((satR - moonR + 12) % 12) + 1;
  let sadeSati = false, sadeDetail;
  if ([12, 1, 2].includes(houseFromMoon)) {
    sadeSati = true;
    const phase = houseFromMoon === 12 ? 'Rising (first) phase'
      : houseFromMoon === 1 ? 'Peak (second) phase' : 'Setting (third) phase';
    sadeDetail = `Saturn transits ${RASHIS[satR].name} — the ${houseFromMoon === 12 ? '12th' : houseFromMoon === 1 ? '1st' : '2nd'} from your Moon. ${phase} of Sade Sati.`;
  } else if ([4, 8].includes(houseFromMoon)) {
    sadeDetail = `Saturn transits the ${houseFromMoon}th from your Moon — Dhaiya (Kantaka Shani), not Sade Sati.`;
  } else {
    sadeDetail = `Saturn transits ${RASHIS[satR].name} — the ${houseFromMoon}th from your Moon. No Sade Sati at present.`;
  }
  doshas.push({ name: 'Sade Sati (Saturn)', present: sadeSati, detail: sadeDetail });

  // --- Kemadruma Dosha: no graha (excl. Sun, Moon, nodes) in the 2nd or 12th from Moon ---
  const second = (moonR + 1) % 12, twelfth = (moonR + 11) % 12;
  const neighbours = ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']
    .some(g => r[g] === second || r[g] === twelfth || r[g] === moonR);
  doshas.push({
    name: 'Kemadruma Dosha',
    present: !neighbours,
    detail: !neighbours
      ? 'No planet sits beside the Moon (2nd/12th) — the Moon is isolated.'
      : 'Planets flank the Moon — no Kemadruma.'
  });

  // --- Guru Chandal Dosha: Jupiter with Rahu or Ketu ---
  const guruChandal = r.Jupiter === r.Rahu || r.Jupiter === r.Ketu;
  doshas.push({
    name: 'Guru Chandal Dosha',
    present: guruChandal,
    detail: guruChandal
      ? `Jupiter is with ${r.Jupiter === r.Rahu ? 'Rahu' : 'Ketu'} in ${RASHIS[r.Jupiter].name}.`
      : 'Jupiter is not conjunct Rahu or Ketu.'
  });

  // --- Grahan Dosha: Sun or Moon with Rahu/Ketu ---
  const suryaGrahan = r.Sun === r.Rahu || r.Sun === r.Ketu;
  const chandraGrahan = r.Moon === r.Rahu || r.Moon === r.Ketu;
  const grahan = suryaGrahan || chandraGrahan;
  doshas.push({
    name: 'Grahan Dosha',
    present: grahan,
    detail: grahan
      ? `${suryaGrahan ? 'Sun' : 'Moon'} is with a node (${suryaGrahan ? (r.Sun === r.Rahu ? 'Rahu' : 'Ketu') : (r.Moon === r.Rahu ? 'Rahu' : 'Ketu')}).`
      : 'Neither luminary is conjunct a node.'
  });

  // --- Angarak Dosha: Mars with Rahu ---
  const angarak = r.Mars === r.Rahu;
  doshas.push({
    name: 'Angarak Dosha',
    present: angarak,
    detail: angarak ? `Mars is with Rahu in ${RASHIS[r.Mars].name}.` : 'Mars is not conjunct Rahu.'
  });

  // --- Pitra Dosha: a node in the 9th house, or the Sun afflicted by Rahu/Ketu/Saturn ---
  const nodeIn9th = getHouseFromLagna(positions.Rahu, lagnaSid) === 9 || getHouseFromLagna(positions.Ketu, lagnaSid) === 9;
  const sunAfflicted = r.Sun === r.Rahu || r.Sun === r.Ketu || r.Sun === r.Saturn;
  doshas.push({
    name: 'Pitra Dosha',
    present: nodeIn9th || sunAfflicted,
    detail: (nodeIn9th || sunAfflicted)
      ? (nodeIn9th ? 'A node (Rahu/Ketu) occupies the 9th house of ancestors.' : 'The Sun is afflicted by Rahu, Ketu or Saturn.')
      : 'The Sun and the 9th house are free of node/Saturn affliction.'
  });

  // --- Shrapit Dosha: Saturn with Rahu ---
  const shrapit = r.Saturn === r.Rahu;
  doshas.push({
    name: 'Shrapit Dosha',
    present: shrapit,
    detail: shrapit ? `Saturn is with Rahu in ${RASHIS[r.Saturn].name}.` : 'Saturn is not conjunct Rahu.'
  });

  // --- Chandra-Mangal Yoga: Moon with Mars (wealth drive; read as a dosha for volatility) ---
  const chandraMangal = r.Moon === r.Mars;
  doshas.push({
    name: 'Chandra-Mangal Yoga',
    present: chandraMangal,
    detail: chandraMangal
      ? `Moon with Mars in ${RASHIS[r.Moon].name} — strong wealth drive, but emotional intensity to temper.`
      : 'Moon is not conjunct Mars.'
  });

  // --- Vish Yoga: Moon with Saturn ---
  const vish = r.Moon === r.Saturn;
  doshas.push({
    name: 'Vish Yoga (Chandra-Shani)',
    present: vish,
    detail: vish ? `Moon with Saturn in ${RASHIS[r.Moon].name} — heaviness of mind; growth through discipline.` : 'Moon is not conjunct Saturn.'
  });

  // --- Daridra Dosha: the 11th (gains) lord placed in a dusthana (6th/8th/12th) ---
  const lagnaR = rashiOf(lagnaSid);
  const eleventhLord = RASHIS[(lagnaR + 10) % 12].lord;
  const lordHouse = getHouseFromLagna(positions[eleventhLord], lagnaSid);
  const daridra = [6, 8, 12].includes(lordHouse);
  doshas.push({
    name: 'Daridra Dosha',
    present: daridra,
    detail: daridra
      ? `The 11th lord (${eleventhLord}) sits in the ${lordHouse}th house (dusthana) — a poverty indication.`
      : `The 11th lord (${eleventhLord}) is in the ${lordHouse}th house — no Daridra Dosha.`
  });

  return doshas;
}
