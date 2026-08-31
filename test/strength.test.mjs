/**
 * Graha strength test (dignity, retrograde, combustion). Run: node test/strength.test.mjs
 */
import { getDignity, isRetrograde, isCombust } from '../modules/jyotish-strength.js';
import { getJulianDate } from '../modules/astrology.js';

let failures = 0;
const eq = (got, exp, label) => { if (got !== exp) { failures++; console.error(`FAIL ${label}: got ${got}, exp ${exp}`); } };
const S = (signIndex, deg = 5) => signIndex * 30 + deg;

// --- Dignity (hand-checkable) ---
eq(getDignity('Sun', S(0)).status, 'Exalted', 'Sun in Mesha = Exalted');
eq(getDignity('Sun', S(6)).status, 'Debilitated', 'Sun in Tula = Debilitated');
eq(getDignity('Saturn', S(6)).status, 'Exalted', 'Saturn in Tula = Exalted');
eq(getDignity('Jupiter', S(3)).status, 'Exalted', 'Jupiter in Karka = Exalted');
eq(getDignity('Moon', S(1)).status, 'Exalted', 'Moon in Vrishabha = Exalted');
eq(getDignity('Mars', S(3)).status, 'Debilitated', 'Mars in Karka = Debilitated');
eq(getDignity('Venus', S(11)).status, 'Exalted', 'Venus in Meena = Exalted');
eq(getDignity('Mercury', S(2)).status, 'Own sign', 'Mercury in Mithuna = Own');
eq(getDignity('Sun', S(4)).status, 'Moolatrikona / Own', 'Sun in Simha = MT/Own');
eq(getDignity('Sun', S(8)).status, 'Friendly sign', 'Sun in Dhanu (Jupiter) = Friendly');
eq(getDignity('Sun', S(9)).status, 'Enemy sign', 'Sun in Makara (Saturn) = Enemy');
eq(getDignity('Rahu', S(0)).status, '—', 'Rahu has no sign dignity');

// --- Retrograde ---
eq(isRetrograde('Sun', 0), false, 'Sun never retrograde');
eq(isRetrograde('Moon', 0), false, 'Moon never retrograde');
eq(isRetrograde('Rahu', 0), true, 'Rahu always retrograde');
// Mercury was retrograde 13 Dec 2023 – 1 Jan 2024; check 20 Dec 2023.
const Tmerc = (getJulianDate(2023, 12, 20, 0, 0) - 2451545.0) / 36525.0;
eq(isRetrograde('Mercury', Tmerc), true, 'Mercury retrograde on 2023-12-20');
// Mars was direct in mid-2024; check 15 Jun 2024.
const Tmars = (getJulianDate(2024, 6, 15, 0, 0) - 2451545.0) / 36525.0;
eq(isRetrograde('Mars', Tmars), false, 'Mars direct on 2024-06-15');

// --- Combustion ---
eq(isCombust('Mercury', 105, 100), true, 'Mercury 5° from Sun = combust');
eq(isCombust('Mercury', 130, 100), false, 'Mercury 30° from Sun = not combust');
eq(isCombust('Sun', 100, 100), false, 'Sun is not combust');
eq(isCombust('Rahu', 103, 100), false, 'Rahu is not combust');

if (failures > 0) { console.error(`\n${failures} strength check(s) failed.`); process.exit(1); }
console.log('All graha-strength checks passed.');
