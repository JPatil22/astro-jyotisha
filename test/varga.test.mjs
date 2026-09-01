import assert from 'node:assert/strict';
import { getVargaRashiIndex, calculateVargaChart, VARGA_DEFINITIONS } from '../modules/jyotish-varga.js';

console.log('Running Shodashvarga (Divisional Charts) tests...');

// Test 1: D1 (Rashi)
assert.equal(getVargaRashiIndex(15, 'D1'), 0, '15 deg is Aries (0)');
assert.equal(getVargaRashiIndex(35, 'D1'), 1, '35 deg is Taurus (1)');

// Test 2: D2 (Hora) - 15 deg halves
// Odd sign (Aries=0): 0-15 = Leo (4), 15-30 = Cancer (3)
assert.equal(getVargaRashiIndex(10, 'D2'), 4, 'Aries 10 deg Hora is Leo');
assert.equal(getVargaRashiIndex(20, 'D2'), 3, 'Aries 20 deg Hora is Cancer');
// Even sign (Taurus=1): 0-15 = Cancer (3), 15-30 = Leo (4)
assert.equal(getVargaRashiIndex(35, 'D2'), 3, 'Taurus 5 deg Hora is Cancer');
assert.equal(getVargaRashiIndex(55, 'D2'), 4, 'Taurus 25 deg Hora is Leo');

// Test 3: D3 (Drekkana) - 10 deg decans
assert.equal(getVargaRashiIndex(5, 'D3'), 0, 'Aries 5 deg Drekkana is Aries (0)');
assert.equal(getVargaRashiIndex(15, 'D3'), 4, 'Aries 15 deg Drekkana is Leo (4)');
assert.equal(getVargaRashiIndex(25, 'D3'), 8, 'Aries 25 deg Drekkana is Sag (8)');

// Test 4: D9 (Navamsa)
assert.equal(getVargaRashiIndex(0, 'D9'), 0, '0 deg is Aries Navamsa (0)');
assert.equal(getVargaRashiIndex(3.4, 'D9'), 1, '3.4 deg is Taurus Navamsa (1)');
assert.equal(getVargaRashiIndex(30, 'D9'), 9, 'Taurus 0 deg is Cap Navamsa (9)');

// Test 5: D10 (Dashamsha - Career)
assert.equal(getVargaRashiIndex(2, 'D10'), 0, 'Aries 2 deg Dashamsha is Aries (0)');
assert.equal(getVargaRashiIndex(5, 'D10'), 1, 'Aries 5 deg Dashamsha is Taurus (1)');
// Even sign Taurus (1): starts from 9th sign (Capricorn = 9)
assert.equal(getVargaRashiIndex(32, 'D10'), 9, 'Taurus 2 deg Dashamsha is Capricorn (9)');

// Test 6: D30 (Trimsamsha)
assert.equal(getVargaRashiIndex(3, 'D30'), 0, 'Aries 3 deg Trimsamsha is Aries (Mars=0)');
assert.equal(getVargaRashiIndex(8, 'D30'), 10, 'Aries 8 deg Trimsamsha is Aquarius (Saturn=10)');

// Test 7: D60 (Shashtiamsha)
assert.equal(getVargaRashiIndex(0.4, 'D60'), 0, 'Aries 0.4 deg Shashtiamsha is Aries (0)');
assert.equal(getVargaRashiIndex(0.6, 'D60'), 1, 'Aries 0.6 deg Shashtiamsha is Taurus (1)');

// Test 8: Full Varga chart generation
const mockPositions = { Sun: 12.5, Moon: 45.2, Mars: 105.0 };
const vargaD9 = calculateVargaChart(mockPositions, 20.0, 'D9');
assert.equal(vargaD9.code, 'D9');
assert.equal(typeof vargaD9.positions.Sun, 'number');
assert.equal(typeof vargaD9.lagna, 'number');

console.log('All Shodashvarga tests passed.');
