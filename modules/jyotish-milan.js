/**
 * Ashtakoot Guna Milan - Jyotisha
 * The 8-factor, 36-point Vedic marriage-compatibility system, computed from each
 * partner's Moon Nakshatra and Rashi.
 *
 * Kootas and max points:
 *   1 Varna (1)  2 Vashya (2)  3 Tara/Dina (3)  4 Yoni (4)
 *   5 Graha Maitri (5)  6 Gana (6)  7 Bhakoot (7)  8 Nadi (8)   => 36 total
 *
 * Nakshatra and Rashi are 0-indexed to match modules/jyotish.js (NAKSHATRAS, RASHIS).
 */

// --------------------------------------------------------------------------
// Per-nakshatra attributes: Yoni (animal + gender), Gana, Nadi. 0-indexed.
// --------------------------------------------------------------------------
const NAK_ATTR = [
  /* 0  Ashwini        */ { yoni: 'Horse', gender: 'M', gana: 'Deva', nadi: 'Aadi' },
  /* 1  Bharani        */ { yoni: 'Elephant', gender: 'M', gana: 'Manushya', nadi: 'Madhya' },
  /* 2  Krittika       */ { yoni: 'Sheep', gender: 'F', gana: 'Rakshasa', nadi: 'Antya' },
  /* 3  Rohini         */ { yoni: 'Serpent', gender: 'M', gana: 'Manushya', nadi: 'Antya' },
  /* 4  Mrigashira     */ { yoni: 'Serpent', gender: 'F', gana: 'Deva', nadi: 'Madhya' },
  /* 5  Ardra          */ { yoni: 'Dog', gender: 'F', gana: 'Manushya', nadi: 'Aadi' },
  /* 6  Punarvasu      */ { yoni: 'Cat', gender: 'F', gana: 'Deva', nadi: 'Aadi' },
  /* 7  Pushya         */ { yoni: 'Sheep', gender: 'M', gana: 'Deva', nadi: 'Madhya' },
  /* 8  Ashlesha       */ { yoni: 'Cat', gender: 'M', gana: 'Rakshasa', nadi: 'Antya' },
  /* 9  Magha          */ { yoni: 'Rat', gender: 'M', gana: 'Rakshasa', nadi: 'Antya' },
  /* 10 Purva Phalguni */ { yoni: 'Rat', gender: 'F', gana: 'Manushya', nadi: 'Madhya' },
  /* 11 Uttara Phalguni*/ { yoni: 'Cow', gender: 'M', gana: 'Manushya', nadi: 'Aadi' },
  /* 12 Hasta          */ { yoni: 'Buffalo', gender: 'F', gana: 'Deva', nadi: 'Aadi' },
  /* 13 Chitra         */ { yoni: 'Tiger', gender: 'F', gana: 'Rakshasa', nadi: 'Madhya' },
  /* 14 Swati          */ { yoni: 'Buffalo', gender: 'M', gana: 'Deva', nadi: 'Antya' },
  /* 15 Vishakha       */ { yoni: 'Tiger', gender: 'M', gana: 'Rakshasa', nadi: 'Antya' },
  /* 16 Anuradha       */ { yoni: 'Deer', gender: 'F', gana: 'Deva', nadi: 'Madhya' },
  /* 17 Jyeshtha       */ { yoni: 'Deer', gender: 'M', gana: 'Rakshasa', nadi: 'Aadi' },
  /* 18 Mula           */ { yoni: 'Dog', gender: 'M', gana: 'Rakshasa', nadi: 'Aadi' },
  /* 19 Purva Ashadha  */ { yoni: 'Monkey', gender: 'M', gana: 'Manushya', nadi: 'Madhya' },
  /* 20 Uttara Ashadha */ { yoni: 'Mongoose', gender: 'F', gana: 'Manushya', nadi: 'Antya' },
  /* 21 Shravana       */ { yoni: 'Monkey', gender: 'F', gana: 'Deva', nadi: 'Antya' },
  /* 22 Dhanishta      */ { yoni: 'Lion', gender: 'F', gana: 'Rakshasa', nadi: 'Madhya' },
  /* 23 Shatabhisha    */ { yoni: 'Horse', gender: 'F', gana: 'Rakshasa', nadi: 'Aadi' },
  /* 24 Purva Bhadra   */ { yoni: 'Lion', gender: 'M', gana: 'Manushya', nadi: 'Aadi' },
  /* 25 Uttara Bhadra  */ { yoni: 'Cow', gender: 'F', gana: 'Manushya', nadi: 'Madhya' },
  /* 26 Revati         */ { yoni: 'Elephant', gender: 'F', gana: 'Deva', nadi: 'Antya' }
];

// --------------------------------------------------------------------------
// Per-rashi attributes: Varna, Vashya category, ruling graha. 0-indexed.
// --------------------------------------------------------------------------
const RASHI_ATTR = [
  /* 0  Mesha      */ { varna: 'Kshatriya', vashya: 'Chatushpada', lord: 'Mars' },
  /* 1  Vrishabha  */ { varna: 'Vaishya', vashya: 'Chatushpada', lord: 'Venus' },
  /* 2  Mithuna    */ { varna: 'Shudra', vashya: 'Dwipada', lord: 'Mercury' },
  /* 3  Karka      */ { varna: 'Brahmin', vashya: 'Jalachar', lord: 'Moon' },
  /* 4  Simha      */ { varna: 'Kshatriya', vashya: 'Vanachar', lord: 'Sun' },
  /* 5  Kanya      */ { varna: 'Vaishya', vashya: 'Dwipada', lord: 'Mercury' },
  /* 6  Tula       */ { varna: 'Shudra', vashya: 'Dwipada', lord: 'Venus' },
  /* 7  Vrischika  */ { varna: 'Brahmin', vashya: 'Keeta', lord: 'Mars' },
  /* 8  Dhanu      */ { varna: 'Kshatriya', vashya: 'Dwipada', lord: 'Jupiter' },
  /* 9  Makara     */ { varna: 'Vaishya', vashya: 'Jalachar', lord: 'Saturn' },
  /* 10 Kumbha     */ { varna: 'Shudra', vashya: 'Dwipada', lord: 'Saturn' },
  /* 11 Meena      */ { varna: 'Brahmin', vashya: 'Jalachar', lord: 'Jupiter' }
];

const VARNA_RANK = { Brahmin: 4, Kshatriya: 3, Vaishya: 2, Shudra: 1 };

// Planetary (Naisargika) friendships for the 7 rashi lords, used by Graha Maitri.
const GRAHA_FRIENDS = {
  Sun: { friends: ['Moon', 'Mars', 'Jupiter'], enemies: ['Venus', 'Saturn'] },
  Moon: { friends: ['Sun', 'Mercury'], enemies: [] },
  Mars: { friends: ['Sun', 'Moon', 'Jupiter'], enemies: ['Mercury'] },
  Mercury: { friends: ['Sun', 'Venus'], enemies: ['Moon'] },
  Jupiter: { friends: ['Sun', 'Moon', 'Mars'], enemies: ['Mercury', 'Venus'] },
  Venus: { friends: ['Mercury', 'Saturn'], enemies: ['Sun', 'Moon'] },
  Saturn: { friends: ['Mercury', 'Venus'], enemies: ['Sun', 'Moon', 'Mars'] }
};

function grahaRelation(a, b) {
  if (a === b) return 'same';
  const r = GRAHA_FRIENDS[a];
  if (r.friends.includes(b)) return 'friend';
  if (r.enemies.includes(b)) return 'enemy';
  return 'neutral';
}

// Yoni animals that are sworn enemies (score 0). Other different animals score as neutral.
const YONI_ENEMIES = [
  ['Cow', 'Tiger'], ['Horse', 'Buffalo'], ['Elephant', 'Lion'],
  ['Sheep', 'Monkey'], ['Serpent', 'Mongoose'], ['Dog', 'Deer'], ['Cat', 'Rat']
];

// Vashya score matrix. Categories: Chatushpada, Dwipada, Jalachar, Vanachar, Keeta.
// Row = groom category, Col = bride category.
const VASHYA_CATS = ['Chatushpada', 'Dwipada', 'Jalachar', 'Vanachar', 'Keeta'];
const VASHYA_MATRIX = [
  //          Chat  Dwip  Jala  Vana  Keet
  /* Chat */ [2, 1, 1, 0, 1],
  /* Dwip */ [1, 2, 1, 0.5, 1],
  /* Jala */ [1, 1, 2, 0, 1],
  /* Vana */ [0, 1, 1, 2, 0],
  /* Keet */ [1, 1, 1, 0, 2]
];

// Gana score matrix. Row = groom gana, Col = bride gana.
const GANA_ORDER = ['Deva', 'Manushya', 'Rakshasa'];
const GANA_MATRIX = [
  //          Deva Manu Raksha
  /* Deva  */ [6, 6, 1],
  /* Manu  */ [5, 6, 0],
  /* Raksha*/ [1, 0, 6]
];

// ---- Individual koota calculators (groom = person a, bride = person b) ----

function scoreVarna(a, b) {
  const g = VARNA_RANK[RASHI_ATTR[a.rashi].varna];
  const br = VARNA_RANK[RASHI_ATTR[b.rashi].varna];
  return { points: g >= br ? 1 : 0, max: 1,
    detail: `${RASHI_ATTR[a.rashi].varna} (groom) vs ${RASHI_ATTR[b.rashi].varna} (bride)` };
}

function scoreVashya(a, b) {
  const gi = VASHYA_CATS.indexOf(RASHI_ATTR[a.rashi].vashya);
  const bi = VASHYA_CATS.indexOf(RASHI_ATTR[b.rashi].vashya);
  return { points: VASHYA_MATRIX[gi][bi], max: 2,
    detail: `${RASHI_ATTR[a.rashi].vashya} vs ${RASHI_ATTR[b.rashi].vashya}` };
}

// Tara/Dina: count from one nakshatra to the other, take remainder mod 9;
// remainders 3, 5, 7 are inauspicious.
function taraAuspicious(from, to) {
  const count = ((to - from + 27) % 27) + 1;
  const rem = count % 9;
  return !(rem === 3 || rem === 5 || rem === 7);
}
function scoreTara(a, b) {
  const okA = taraAuspicious(a.nak, b.nak);
  const okB = taraAuspicious(b.nak, a.nak);
  const points = (okA ? 1.5 : 0) + (okB ? 1.5 : 0);
  return { points, max: 3, detail: `groom→bride ${okA ? 'ok' : 'dosha'}, bride→groom ${okB ? 'ok' : 'dosha'}` };
}

function scoreYoni(a, b) {
  const ya = NAK_ATTR[a.nak].yoni, yb = NAK_ATTR[b.nak].yoni;
  let points;
  if (ya === yb) points = 4;
  else if (YONI_ENEMIES.some(([x, y]) => (x === ya && y === yb) || (x === yb && y === ya))) points = 0;
  else points = 2; // neutral
  return { points, max: 4, detail: `${ya} (groom) & ${yb} (bride)` };
}

function scoreGrahaMaitri(a, b) {
  const la = RASHI_ATTR[a.rashi].lord, lb = RASHI_ATTR[b.rashi].lord;
  const r1 = grahaRelation(la, lb), r2 = grahaRelation(lb, la);
  let points;
  if (la === lb) points = 5;
  else {
    const set = [r1, r2];
    const has = (x) => set.includes(x);
    if (r1 === 'friend' && r2 === 'friend') points = 5;
    else if (has('friend') && has('neutral')) points = 4;
    else if (r1 === 'neutral' && r2 === 'neutral') points = 3;
    else if (has('friend') && has('enemy')) points = 1;
    else if (has('neutral') && has('enemy')) points = 0.5;
    else points = 0; // enemy + enemy
  }
  return { points, max: 5, detail: `${la} & ${lb}` };
}

function scoreGana(a, b) {
  const gi = GANA_ORDER.indexOf(NAK_ATTR[a.nak].gana);
  const bi = GANA_ORDER.indexOf(NAK_ATTR[b.nak].gana);
  return { points: GANA_MATRIX[gi][bi], max: 6,
    detail: `${NAK_ATTR[a.nak].gana} (groom) vs ${NAK_ATTR[b.nak].gana} (bride)` };
}

// Bhakoot: the 2-12, 5-9, 6-8 rashi relationships are doshas (0 points), else 7.
function scoreBhakoot(a, b) {
  const c1 = ((b.rashi - a.rashi + 12) % 12) + 1;
  const c2 = ((a.rashi - b.rashi + 12) % 12) + 1;
  const pair = [c1, c2].sort((x, y) => x - y).join('-');
  const dosha = pair === '2-12' || pair === '5-9' || pair === '6-8';
  return { points: dosha ? 0 : 7, max: 7, detail: dosha ? `Bhakoot dosha (${pair})` : 'harmonious' };
}

// Nadi: same nadi = 0 (Nadi dosha), different = 8.
function scoreNadi(a, b) {
  const na = NAK_ATTR[a.nak].nadi, nb = NAK_ATTR[b.nak].nadi;
  return { points: na === nb ? 0 : 8, max: 8, detail: na === nb ? `Nadi dosha (both ${na})` : `${na} & ${nb}` };
}

// ---- Extra checks beyond the 36 gunas ----

// Rajju: the 27 nakshatras cycle through 5 limbs, up then down, over 9 (repeated 3x).
const RAJJU_LIMBS = ['Pada (feet)', 'Kati (waist)', 'Nabhi (navel)', 'Kantha (neck)', 'Sira (head)'];
const RAJJU_PATTERN = [0, 1, 2, 3, 4, 3, 2, 1, 0];
function rajjuOf(nak) {
  const idx = nak % 9;
  return {
    limb: RAJJU_PATTERN[idx],
    limbName: RAJJU_LIMBS[RAJJU_PATTERN[idx]],
    direction: idx < 4 ? 'ascending' : idx > 4 ? 'descending' : 'apex'
  };
}

// Vedha: mutually "piercing" nakshatra pairs (0-indexed). Chitra has no vedha partner.
const VEDHA_PAIRS = [
  [0, 17], [1, 16], [2, 15], [3, 14], [4, 22], [5, 21], [6, 20],
  [7, 19], [8, 18], [9, 26], [10, 25], [11, 24], [12, 23]
];
function isVedha(a, b) {
  return VEDHA_PAIRS.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
}

// ---- Aggregate ----

// Each person: { nak: 0-26, rashi: 0-11 }. `a` is the groom, `b` the bride.
export function calculateGunaMilan(a, b) {
  const kootas = [
    { name: 'Varna', area: 'Spiritual / ego', ...scoreVarna(a, b) },
    { name: 'Vashya', area: 'Mutual control', ...scoreVashya(a, b) },
    { name: 'Tara', area: 'Health / destiny', ...scoreTara(a, b) },
    { name: 'Yoni', area: 'Physical / intimacy', ...scoreYoni(a, b) },
    { name: 'Graha Maitri', area: 'Mental affinity', ...scoreGrahaMaitri(a, b) },
    { name: 'Gana', area: 'Temperament', ...scoreGana(a, b) },
    { name: 'Bhakoot', area: 'Love / family', ...scoreBhakoot(a, b) },
    { name: 'Nadi', area: 'Health / progeny', ...scoreNadi(a, b) }
  ];
  const total = kootas.reduce((s, k) => s + k.points, 0);

  let verdict, note;
  if (total >= 32) { verdict = 'Excellent'; note = 'An exceptionally harmonious match.'; }
  else if (total >= 25) { verdict = 'Very Good'; note = 'A strong and compatible match.'; }
  else if (total >= 18) { verdict = 'Acceptable'; note = 'A workable match; mind the weaker kootas.'; }
  else { verdict = 'Challenging'; note = 'Below the traditional threshold of 18 gunas.'; }

  // Traditional deal-breakers regardless of total.
  const nadiDosha = kootas[7].points === 0;
  const bhakootDosha = kootas[6].points === 0;

  // Extra veto checks the 36-point system omits, plus dosha cancellations.
  const rajA = rajjuOf(a.nak), rajB = rajjuOf(b.nak);
  const rajjuDosha = rajA.limb === rajB.limb;
  const vedhaDosha = isVedha(a.nak, b.nak);

  const lordA = RASHI_ATTR[a.rashi].lord, lordB = RASHI_ATTR[b.rashi].lord;
  const lordsFriendly = lordA === lordB ||
    (grahaRelation(lordA, lordB) === 'friend' && grahaRelation(lordB, lordA) === 'friend');
  const bhakootCancelled = bhakootDosha && lordsFriendly;
  const nadiCancelled = nadiDosha && lordA === lordB;

  const alerts = [];
  if (rajjuDosha) alerts.push({
    name: 'Rajju Dosha', severe: true,
    detail: `Both Moons share the ${rajA.limbName} rajju${rajA.direction === rajB.direction ? ' (same direction)' : ''} — a serious matching dosha traditionally treated as a veto.`
  });
  if (vedhaDosha) alerts.push({
    name: 'Vedha Dosha', severe: true,
    detail: 'The two birth-stars form a Vedha (mutually obstructing) pair — a serious matching dosha.'
  });
  if (bhakootCancelled) alerts.push({
    name: 'Bhakoot Dosha cancelled', severe: false,
    detail: 'Bhakoot dosha is present but nullified — the Rashi lords are the same or mutual friends.'
  });
  if (nadiCancelled) alerts.push({
    name: 'Nadi Dosha cancelled', severe: false,
    detail: 'Nadi dosha may be nullified — both share the same Rashi lord (pada-level cancellation not checked).'
  });

  return { kootas, total, max: 36, verdict, note, nadiDosha, bhakootDosha, rajjuDosha, vedhaDosha, alerts };
}
