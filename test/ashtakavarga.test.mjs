import assert from 'node:assert/strict';
import { calculateAshtakavarga, ASHTAKAVARGA_RULES } from '../modules/jyotish-ashtakavarga.js';

console.log('Running Ashtakavarga tests...');

// Test 1: Verify Parashari rule bindu counts
assert.equal(
  Object.values(ASHTAKAVARGA_RULES.Sun).reduce((s, arr) => s + arr.length, 0),
  48,
  'Sun BAV rules must sum to 48'
);
assert.equal(
  Object.values(ASHTAKAVARGA_RULES.Moon).reduce((s, arr) => s + arr.length, 0),
  49,
  'Moon BAV rules must sum to 49'
);
assert.equal(
  Object.values(ASHTAKAVARGA_RULES.Mars).reduce((s, arr) => s + arr.length, 0),
  39,
  'Mars BAV rules must sum to 39'
);
assert.equal(
  Object.values(ASHTAKAVARGA_RULES.Mercury).reduce((s, arr) => s + arr.length, 0),
  54,
  'Mercury BAV rules must sum to 54'
);
assert.equal(
  Object.values(ASHTAKAVARGA_RULES.Jupiter).reduce((s, arr) => s + arr.length, 0),
  56,
  'Jupiter BAV rules must sum to 56'
);
assert.equal(
  Object.values(ASHTAKAVARGA_RULES.Venus).reduce((s, arr) => s + arr.length, 0),
  52,
  'Venus BAV rules must sum to 52'
);
assert.equal(
  Object.values(ASHTAKAVARGA_RULES.Saturn).reduce((s, arr) => s + arr.length, 0),
  39,
  'Saturn BAV rules must sum to 39'
);

// Test 2: Calculate Ashtakavarga for an actual chart
const mockPositions = {
  Sun: 24.5,     // Aries (0)
  Moon: 142.1,   // Leo (4)
  Mars: 75.3,    // Gemini (2)
  Mercury: 10.2, // Aries (0)
  Jupiter: 215.8,// Scorpio (7)
  Venus: 350.1,  // Pisces (11)
  Saturn: 310.4  // Aquarius (10)
};
const lagnaSid = 15.0; // Aries (0)

const av = calculateAshtakavarga(mockPositions, lagnaSid);

// Total bindus in SAV MUST be exactly 337
assert.equal(av.totalBindus, 337, `SAV total must be exactly 337 (got ${av.totalBindus})`);
assert.equal(av.sav.length, 12, 'SAV must have 12 signs');
assert.equal(av.houseScores.length, 12, 'Must have 12 house scores');

// Each planet BAV must sum to its classical total
assert.equal(av.bav.Sun.reduce((a, b) => a + b, 0), 48);
assert.equal(av.bav.Moon.reduce((a, b) => a + b, 0), 49);
assert.equal(av.bav.Mars.reduce((a, b) => a + b, 0), 39);
assert.equal(av.bav.Mercury.reduce((a, b) => a + b, 0), 54);
assert.equal(av.bav.Jupiter.reduce((a, b) => a + b, 0), 56);
assert.equal(av.bav.Venus.reduce((a, b) => a + b, 0), 52);
assert.equal(av.bav.Saturn.reduce((a, b) => a + b, 0), 39);

console.log('All Ashtakavarga tests passed (Total 337 bindus verified).');
