/**
 * Ashtakoot Guna Milan regression test.
 *
 * Guna Milan is a rule-based scoring system (not a physical quantity with one
 * ground truth) — calculators differ by +/-1-2 points on the Yoni/Vashya
 * conventions. These checks pin OUR implementation's deterministic behaviour:
 * correct maxima, dosha triggers, and known koota outcomes.
 *
 * Run: node test/milan.test.mjs
 */

import { calculateGunaMilan } from '../modules/jyotish-milan.js';

let failures = 0;
const check = (cond, label) => { if (!cond) { failures++; console.error(`FAIL: ${label}`); } };

// Max total is always 36.
const p1 = calculateGunaMilan({ nak: 0, rashi: 0 }, { nak: 1, rashi: 0 });
check(p1.max === 36, 'max is 36');
check(p1.kootas.length === 8, 'eight kootas');
check(p1.kootas.reduce((s, k) => s + k.max, 0) === 36, 'koota maxima sum to 36');

// Identical charts -> guaranteed Nadi dosha (same nadi) and Yoni = 4 (same animal).
const same = calculateGunaMilan({ nak: 3, rashi: 1 }, { nak: 3, rashi: 1 });
check(same.nadiDosha === true, 'identical charts trigger Nadi dosha');
check(same.kootas.find(k => k.name === 'Nadi').points === 0, 'Nadi = 0 on same nadi');
check(same.kootas.find(k => k.name === 'Yoni').points === 4, 'Yoni = 4 on same animal');

// Vrishabha(1) -> Kanya(5) is a 5-9 relationship -> Bhakoot dosha.
const bhak = calculateGunaMilan({ nak: 3, rashi: 1 }, { nak: 12, rashi: 5 });
check(bhak.bhakootDosha === true, 'Vrishabha-Kanya triggers Bhakoot dosha (5-9)');
check(bhak.kootas.find(k => k.name === 'Bhakoot').points === 0, 'Bhakoot = 0 on dosha');

// Same rashi lord -> Graha Maitri = 5.
check(p1.kootas.find(k => k.name === 'Graha Maitri').points === 5, 'same lord -> Graha Maitri 5');

// Every koota's points never exceed its max, and total equals the sum.
for (const pair of [p1, same, bhak]) {
  const sum = pair.kootas.reduce((s, k) => s + k.points, 0);
  check(Math.abs(sum - pair.total) < 1e-9, 'total equals koota sum');
  check(pair.kootas.every(k => k.points <= k.max && k.points >= 0), 'points within [0, max]');
  check(pair.total >= 0 && pair.total <= 36, 'total within [0, 36]');
}

// --- Rajju dosha: nakshatras in the same limb (nak 0 and nak 9 share Pada) ---
check(calculateGunaMilan({ nak: 0, rashi: 0 }, { nak: 9, rashi: 0 }).rajjuDosha === true, 'Rajju dosha when same limb');
check(calculateGunaMilan({ nak: 0, rashi: 0 }, { nak: 1, rashi: 0 }).rajjuDosha === false, 'no Rajju when different limbs');

// --- Vedha dosha: Ashwini (0) & Jyeshtha (17) are a vedha pair ---
check(calculateGunaMilan({ nak: 0, rashi: 0 }, { nak: 17, rashi: 0 }).vedhaDosha === true, 'Vedha dosha for a vedha pair');
check(calculateGunaMilan({ nak: 0, rashi: 0 }, { nak: 5, rashi: 0 }).vedhaDosha === false, 'no Vedha for a non-pair');

// --- Bhakoot cancellation: Vrishabha(Venus) x Kanya(Mercury) is 5-9 dosha, lords are friends ---
const bc = calculateGunaMilan({ nak: 3, rashi: 1 }, { nak: 12, rashi: 5 });
check(bc.bhakootDosha === true, 'Bhakoot dosha present (5-9)');
check(bc.alerts.some(a => a.name === 'Bhakoot Dosha cancelled'), 'Bhakoot dosha flagged cancelled (friendly lords)');

// --- Nadi cancellation: identical charts share the Rashi lord ---
const nc = calculateGunaMilan({ nak: 3, rashi: 1 }, { nak: 3, rashi: 1 });
check(nc.nadiDosha === true, 'Nadi dosha present (same nadi)');
check(nc.alerts.some(a => a.name === 'Nadi Dosha cancelled'), 'Nadi dosha flagged cancelled (same lord)');

if (failures > 0) {
  console.error(`\n${failures} Guna Milan check(s) failed.`);
  process.exit(1);
}
console.log('All Guna Milan checks passed (kootas, doshas, maxima, totals, Rajju/Vedha, cancellations).');
