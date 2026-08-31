/**
 * Panchang, Navamsa, Manglik and Gochar regression test.
 * Run: node test/panchang.test.mjs
 */

import { getNavamsaRashiIndex, getHouseFromLagna, isManglikHouse, RASHIS } from '../modules/jyotish.js';
import { getTithi, getYoga, getKarana, getChandraGochar, VARAS } from '../modules/jyotish-panchang.js';

let failures = 0;
const eq = (got, exp, label) => { if (got !== exp) { failures++; console.error(`FAIL ${label}: got ${got}, exp ${exp}`); } };

// --- Navamsa (D9): movable start self, fixed start 9th, dual start 5th ---
eq(RASHIS[getNavamsaRashiIndex(0)].name, 'Mesha', 'D9 of 0deg (Aries, movable) -> Mesha');
eq(RASHIS[getNavamsaRashiIndex(90)].name, 'Karka', 'D9 of 90deg (Cancer, movable) -> Karka');
eq(RASHIS[getNavamsaRashiIndex(30)].name, 'Makara', 'D9 of 30deg (Taurus, fixed) -> Makara (9th)');
eq(RASHIS[getNavamsaRashiIndex(120)].name, 'Mesha', 'D9 of 120deg (Leo, fixed) -> Mesha (9th)');
eq(RASHIS[getNavamsaRashiIndex(60)].name, 'Tula', 'D9 of 60deg (Gemini, dual) -> Tula (5th)');

// --- House from Lagna ---
eq(getHouseFromLagna(45, 45), 1, 'same sign -> house 1');
eq(getHouseFromLagna(75, 45), 2, 'next sign -> house 2');   // 45 Taurus, 75 Gemini
eq(getHouseFromLagna(15, 45), 12, 'previous sign -> house 12');

// --- Manglik houses ---
eq(isManglikHouse(7), true, 'house 7 is Manglik');
eq(isManglikHouse(8), true, 'house 8 is Manglik');
eq(isManglikHouse(3), false, 'house 3 is not Manglik');

// --- Tithi ---
eq(getTithi(0, 0).label, 'Shukla Pratipada', 'elongation 0 -> Shukla Pratipada');
eq(getTithi(175, 0).name, 'Purnima', 'elongation 175 (15th tithi) -> Purnima');
eq(getTithi(180, 0).label, 'Krishna Pratipada', 'elongation 180 -> Krishna Pratipada');
eq(getTithi(354, 0).name, 'Amavasya', 'elongation 354 -> Amavasya');

// --- Yoga (27 divisions of sun+moon) ---
eq(getYoga(0, 0).name, 'Vishkambha', 'sum 0 -> Vishkambha');
eq(getYoga(0, 14).index, 1, 'sum ~14 -> yoga index 1');

// --- Karana ---
eq(getKarana(0, 0).name, 'Kimstughna', 'first half-tithi -> Kimstughna');
eq(getKarana(6, 0).name, 'Bava', 'second half-tithi -> Bava');

// --- Chandra Gochar ---
eq(getChandraGochar(0, 0).house, 1, 'transit == natal -> house 1');
eq(getChandraGochar(0, 10).house, 11, 'natal Mesha, transit Kumbha -> house 11 (Labha)');
eq(getChandraGochar(0, 10).key, 'Labha', 'house 11 -> Labha');
eq(VARAS.length, 7, 'seven varas');

if (failures > 0) { console.error(`\n${failures} check(s) failed.`); process.exit(1); }
console.log('All Panchang / Navamsa / Manglik / Gochar checks passed.');
