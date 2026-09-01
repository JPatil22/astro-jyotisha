import assert from 'node:assert/strict';
import { calculateGrahaDrishti } from '../modules/jyotish-drishti.js';

console.log('Running Graha Drishti (Aspects) tests...');

// Mars in Aries (0), Saturn in Cancer (3), Jupiter in Leo (4)
const mockPositions = {
  Mars: 15.0,    // Aries (House 1 from Lagna Aries)
  Saturn: 105.0, // Cancer (House 4 from Lagna Aries)
  Jupiter: 135.0 // Leo (House 5 from Lagna Aries)
};
const lagnaSid = 10.0; // Aries

const drishti = calculateGrahaDrishti(mockPositions, lagnaSid);

// Mars aspects 4th (Cancer), 7th (Libra), 8th (Scorpio)
const marsData = drishti.aspectList.find(a => a.graha === 'Mars');
assert.deepEqual(marsData.aspectOffsets, [4, 7, 8]);
assert.ok(marsData.aspectedGrahas.some(g => g.graha === 'Saturn' && g.aspectOrdinal === 4), 'Mars 4th aspect must hit Saturn in Cancer');

// Saturn aspects 3rd (Virgo), 7th (Capricorn), 10th (Aries)
const satData = drishti.aspectList.find(a => a.graha === 'Saturn');
assert.deepEqual(satData.aspectOffsets, [3, 7, 10]);
assert.ok(satData.aspectedGrahas.some(g => g.graha === 'Mars' && g.aspectOrdinal === 10), 'Saturn 10th aspect must hit Mars in Aries');

// Mutual aspect check: Mars and Saturn aspect each other!
assert.ok(drishti.mutualAspects.length > 0, 'Mars and Saturn must be in mutual aspect');
assert.equal(drishti.mutualAspects[0].graha1, 'Mars');
assert.equal(drishti.mutualAspects[0].graha2, 'Saturn');

console.log('All Graha Drishti tests passed.');
