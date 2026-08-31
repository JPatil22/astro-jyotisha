/**
 * Vedic Numerology (Ank Jyotish) Module - Jyotisha
 * Mulank (root/psychic number), Bhagyank (destiny number), Naamank (Chaldean name number),
 * ruling planets (Navagraha), and friend/neutral/enemy number relationships.
 *
 * Note: this is a distinct system from the Western Pythagorean numerology in numerology.js.
 * Mulank/Bhagyank always reduce to a single digit 1-9 (no master numbers), and the name
 * number uses the Chaldean table (no letter maps to 9), not the Pythagorean one.
 */

// Reduce any positive integer to a single digit 1-9 (no master-number preservation).
export function reduceToSingleDigit(num) {
  let n = Math.abs(num);
  while (n > 9) {
    n = String(n).split('').reduce((sum, d) => sum + Number(d), 0);
  }
  return n;
}

// Chaldean letter values (1-8; 9 is never assigned to a letter in the Chaldean system).
const CHALDEAN_VALUES = {
  a: 1, i: 1, j: 1, q: 1, y: 1,
  b: 2, k: 2, r: 2,
  c: 3, g: 3, l: 3, s: 3,
  d: 4, m: 4, t: 4,
  e: 5, h: 5, n: 5, x: 5,
  u: 6, v: 6, w: 6,
  o: 7, z: 7,
  f: 8, p: 8
};

// Mulank (मूलांक) — Root / Psychic number, from the DAY of birth only.
export function calculateMulank(dobString) {
  if (!dobString) return null;
  const parts = dobString.split('-');
  if (parts.length !== 3) return null;
  const day = parseInt(parts[2], 10);
  const value = reduceToSingleDigit(day);
  return {
    value,
    breakdown: `Birth day ${day} → ${String(day).split('').join(' + ')} = ${value}`
  };
}

// Bhagyank (भाग्यांक) — Destiny / Fortune number, from the FULL date of birth.
export function calculateBhagyank(dobString) {
  if (!dobString) return null;
  const digits = dobString.replace(/[^0-9]/g, '');
  if (!digits) return null;
  const sum = digits.split('').reduce((s, d) => s + Number(d), 0);
  const value = reduceToSingleDigit(sum);
  return {
    value,
    breakdown: `All digits of ${dobString} (${digits.split('').join('+')}) = ${sum} → ${value}`
  };
}

// Naamank (नामांक) — Name number using the Chaldean table.
export function calculateNaamank(fullName) {
  if (!fullName) return null;
  const sanitized = fullName.toLowerCase().replace(/[^a-z]/g, '');
  if (!sanitized) return null;

  let sum = 0;
  const letters = [];
  for (const ch of sanitized) {
    const val = CHALDEAN_VALUES[ch] || 0;
    sum += val;
    letters.push({ char: ch.toUpperCase(), val });
  }
  const value = reduceToSingleDigit(sum);
  return {
    value,
    compound: sum, // the pre-reduction total; Chaldean readers often note this too
    breakdown: `Chaldean sum ${sum} → ${value}`,
    letters
  };
}

// Per-number ruling planet (Navagraha) and core traits.
export const VEDIC_NUMBER_INFO = {
  1: { planet: 'Sun', sanskrit: 'Surya', title: 'The Leader', traits: 'Independent, authoritative, ambitious, and creative. A natural pioneer with strong willpower and a desire to lead. Must guard against ego and domination.' },
  2: { planet: 'Moon', sanskrit: 'Chandra', title: 'The Nurturer', traits: 'Emotional, intuitive, gentle, and cooperative. Deeply sensitive and diplomatic, thriving on harmony and partnership. Can be moody or over-dependent.' },
  3: { planet: 'Jupiter', sanskrit: 'Guru', title: 'The Sage', traits: 'Wise, optimistic, disciplined, and expressive. Drawn to knowledge, teaching, and spirituality. Generous and principled, but can be preachy or over-extended.' },
  4: { planet: 'Rahu', sanskrit: 'Rahu', title: 'The Rebel', traits: 'Unconventional, hard-working, and revolutionary. Sees the world differently and challenges norms. Prone to sudden ups and downs and inner restlessness.' },
  5: { planet: 'Mercury', sanskrit: 'Budh', title: 'The Communicator', traits: 'Quick, adaptable, clever, and social. A born networker and trader who loves variety and travel. Must avoid restlessness and scattering energy.' },
  6: { planet: 'Venus', sanskrit: 'Shukra', title: 'The Lover', traits: 'Charming, artistic, luxurious, and affectionate. Values beauty, comfort, and relationships. Magnetic and caring, but can over-indulge or seek approval.' },
  7: { planet: 'Ketu', sanskrit: 'Ketu', title: 'The Mystic', traits: 'Spiritual, introspective, and analytical. A seeker drawn to the unseen, research, and solitude. Intuitive and detached, sometimes withdrawn or restless.' },
  8: { planet: 'Saturn', sanskrit: 'Shani', title: 'The Achiever', traits: 'Disciplined, patient, and materially driven. Builds slowly and endures hardship to gain lasting power. Karmic lessons around responsibility and delay.' },
  9: { planet: 'Mars', sanskrit: 'Mangal', title: 'The Warrior', traits: 'Courageous, energetic, and determined. A fighter with strong drive and leadership in action. Passionate and protective, but must temper anger and impatience.' }
};

// Friend / neutral / enemy numbers, derived from classical Navagraha (planetary) friendships.
// Rahu is treated like Saturn and Ketu like Mars, per common Ank Jyotish convention.
// Symmetric (mutual) relationships: when the two planets disagree (one sees friend,
// the other enemy), the pair is treated as neutral. Every pair below is mutual.
export const NUMBER_RELATIONS = {
  1: { friends: [2, 3, 5, 7, 9], neutral: [], enemies: [4, 6, 8] },
  2: { friends: [1, 3, 9], neutral: [5, 7], enemies: [4, 6, 8] },
  3: { friends: [1, 2, 7, 9], neutral: [4, 8], enemies: [5, 6] },
  4: { friends: [5, 6, 8], neutral: [3, 7], enemies: [1, 2, 9] },
  5: { friends: [1, 4, 6, 8], neutral: [2], enemies: [3, 7, 9] },
  6: { friends: [4, 5, 8], neutral: [7, 9], enemies: [1, 2, 3] },
  7: { friends: [1, 3, 9], neutral: [2, 4, 6], enemies: [5, 8] },
  8: { friends: [4, 5, 6], neutral: [3], enemies: [1, 2, 7, 9] },
  9: { friends: [1, 2, 3, 7], neutral: [6], enemies: [4, 5, 8] }
};

// Classify the relationship of number `other` from the perspective of number `base`.
export function getNumberRelation(base, other) {
  const rel = NUMBER_RELATIONS[base];
  if (!rel) return 'unknown';
  if (base === other) return 'self';
  if (rel.friends.includes(other)) return 'friend';
  if (rel.enemies.includes(other)) return 'enemy';
  if (rel.neutral.includes(other)) return 'neutral';
  return 'neutral';
}

// Convenience: full Ank Jyotish profile for a name + date of birth.
export function calculateVedicProfile(fullName, dobString) {
  const mulank = calculateMulank(dobString);
  const bhagyank = calculateBhagyank(dobString);
  const naamank = calculateNaamank(fullName);

  let harmony = null;
  if (mulank && bhagyank) {
    harmony = getNumberRelation(mulank.value, bhagyank.value);
  }

  return { mulank, bhagyank, naamank, harmony };
}
