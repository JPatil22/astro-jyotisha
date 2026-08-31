/**
 * Dosha detection regression test. Run: node test/dosha.test.mjs
 * Uses crafted sidereal positions (degrees) to trigger each dosha deterministically.
 */

import { detectDoshas } from '../modules/jyotish-dosha.js';

let failures = 0;
const check = (cond, label) => { if (!cond) { failures++; console.error(`FAIL: ${label}`); } };
const get = (list, name) => list.find(d => d.name.startsWith(name));

// Base: spread grahas so no dosha triggers by accident.
const base = () => ({
  Sun: 10, Moon: 45, Mars: 200, Mercury: 130, Jupiter: 250, Venus: 300, Saturn: 95, Rahu: 20, Ketu: 200
});

// Kaal Sarp PRESENT: all 7 grahas between Rahu(0) and Ketu(180).
let p = { Sun: 10, Moon: 40, Mars: 60, Mercury: 80, Jupiter: 100, Venus: 120, Saturn: 150, Rahu: 0, Ketu: 180 };
check(get(detectDoshas(p, 0, 300), 'Kaal Sarp').present === true, 'Kaal Sarp present when all grahas hemmed');

// Kaal Sarp ABSENT: Saturn crosses beyond Ketu.
p = { Sun: 10, Moon: 40, Mars: 60, Mercury: 80, Jupiter: 100, Venus: 120, Saturn: 200, Rahu: 0, Ketu: 180 };
check(get(detectDoshas(p, 0, 300), 'Kaal Sarp').present === false, 'Kaal Sarp absent when a graha is on the other side');

// Manglik: Mars in house 7 from Lagna (Lagna Aries=0, Mars in Libra ~190 -> 7th).
p = base(); p.Mars = 190;
check(get(detectDoshas(p, 0, 300), 'Manglik').present === true, 'Manglik when Mars in 7th from Lagna');
p.Mars = 70; // Gemini -> 3rd house, not Manglik
check(get(detectDoshas(p, 0, 300), 'Manglik').present === false, 'no Manglik when Mars in 3rd');

// Guru Chandal: Jupiter with Rahu (same Rashi).
p = base(); p.Jupiter = 25; p.Rahu = 20; // both Aries
check(get(detectDoshas(p, 0, 300), 'Guru Chandal').present === true, 'Guru Chandal when Jupiter with Rahu');

// Grahan: Moon with Ketu (same Rashi).
p = base(); p.Moon = 205; p.Ketu = 200; // both Libra
check(get(detectDoshas(p, 0, 300), 'Grahan').present === true, 'Grahan when Moon with a node');

// Angarak: Mars with Rahu (same Rashi).
p = base(); p.Mars = 22; p.Rahu = 20;
check(get(detectDoshas(p, 0, 300), 'Angarak').present === true, 'Angarak when Mars with Rahu');

// Kemadruma: Moon isolated (no planet in 2nd/12th/same as Moon).
p = { Sun: 10, Moon: 45, Mars: 200, Mercury: 205, Jupiter: 210, Venus: 215, Saturn: 220, Rahu: 300, Ketu: 120 };
// Moon in Taurus(1); 2nd=Gemini(2, 60-90), 12th=Aries(0, 0-30); none of Mars.. are there -> Kemadruma
check(get(detectDoshas(p, 0, 300), 'Kemadruma').present === true, 'Kemadruma when Moon has no neighbours');
p.Mercury = 65; // now a planet in Gemini (2nd from Moon)
check(get(detectDoshas(p, 0, 300), 'Kemadruma').present === false, 'no Kemadruma when a planet flanks the Moon');

// Sade Sati: transiting Saturn in 1st from natal Moon.
p = base(); p.Moon = 45; // Taurus (rashi 1)
check(get(detectDoshas(p, 0, 40), 'Sade Sati').present === true, 'Sade Sati when Saturn transits natal Moon sign');
check(get(detectDoshas(p, 0, 190), 'Sade Sati').present === false, 'no Sade Sati when Saturn far from Moon');

// Shrapit: Saturn with Rahu.
p = base(); p.Saturn = 25; p.Rahu = 20;
check(get(detectDoshas(p, 0, 300), 'Shrapit').present === true, 'Shrapit when Saturn with Rahu');

// Chandra-Mangal: Moon with Mars.
p = base(); p.Moon = 45; p.Mars = 50;
check(get(detectDoshas(p, 0, 300), 'Chandra-Mangal').present === true, 'Chandra-Mangal when Moon with Mars');

// Vish: Moon with Saturn.
p = base(); p.Moon = 45; p.Saturn = 50;
check(get(detectDoshas(p, 0, 300), 'Vish').present === true, 'Vish when Moon with Saturn');

// Pitra: a node in the 9th house (Lagna Aries -> 9th is Sagittarius 240-270).
p = base(); p.Rahu = 250;
check(get(detectDoshas(p, 0, 300), 'Pitra').present === true, 'Pitra when a node is in the 9th');

// Daridra: 11th lord (Lagna Aries -> 11th Aquarius, lord Saturn) in a dusthana (Saturn in 6th).
p = base(); p.Saturn = 160; // Virgo -> 6th from Aries
check(get(detectDoshas(p, 0, 300), 'Daridra').present === true, 'Daridra when 11th lord in dusthana');
p.Saturn = 45; // Taurus -> 2nd, not dusthana
check(get(detectDoshas(p, 0, 300), 'Daridra').present === false, 'no Daridra when 11th lord out of dusthana');

if (failures > 0) { console.error(`\n${failures} dosha check(s) failed.`); process.exit(1); }
console.log('All dosha checks passed.');
