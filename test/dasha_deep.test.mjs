import assert from 'node:assert/strict';
import { 
  calculateVimshottariDasha, 
  computeAntardashas, 
  computePratyantardashas, 
  computeSookshmaDashas 
} from '../modules/jyotish-dasha.js';

console.log('Running Deep Multi-Level Dasha (Levels 1 to 4) tests...');

const birthDate = new Date('1990-05-15T06:30:00Z');
const moonSidereal = 45.0; // Rohini (Moon lord)

const dasha = calculateVimshottariDasha(moonSidereal, birthDate, new Date('2024-01-01'));

// Level 1 (Maha) & Level 2 (Antar)
assert.ok(dasha.currentMaha, 'Must have active Mahadasha');
assert.ok(dasha.currentAntar, 'Must have active Antardasha');

// Level 3 (Pratyantar)
assert.ok(dasha.pratyantardashas.length === 9, 'Must calculate 9 Pratyantardashas');
assert.ok(dasha.currentPratyantar, 'Must have active Pratyantardasha');

// Level 4 (Sookshma)
assert.ok(dasha.sookshmaDashas.length === 9, 'Must calculate 9 Sookshma Dashas');
assert.ok(dasha.currentSookshma, 'Must have active Sookshma Dasha');

// Mathematical consistency: Sum of 9 Pratyantar spans must equal Antardasha duration
const antarYears = dasha.currentAntar.years;
const pratyantarSumYears = dasha.pratyantardashas.reduce((s, p) => s + p.years, 0);
assert.ok(Math.abs(antarYears - pratyantarSumYears) < 0.0001, 'Pratyantardashas must sum to Antardasha duration');

// Mathematical consistency: Sum of 9 Sookshma spans must equal Pratyantar duration
const pratyantarYears = dasha.currentPratyantar.years;
const sookshmaSumYears = dasha.sookshmaDashas.reduce((s, sk) => s + sk.years, 0);
assert.ok(Math.abs(pratyantarYears - sookshmaSumYears) < 0.0001, 'Sookshma Dashas must sum to Pratyantardasha duration');

console.log('All Deep Multi-Level Dasha tests passed.');
