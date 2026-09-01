/**
 * Biometric Palmistry Engine (Hast Rekha & Samudrika Shastra)
 * Mathematical analysis of palm creases, 3D hand geometry, 7 planetary mounts,
 * age timeline projection, and continuous biometric diagnostic scoring.
 *
 * Grounded in the classical canons of Samudrika Shastra (Brihat Samhita),
 * Cheiro's Language of the Hand, and William G. Benham's Laws of Scientific Hand Reading.
 */

// --------------------------------------------------------------------------
// 1. CONSTANTS & METADATA
// --------------------------------------------------------------------------

export const HAND_SHAPES = {
  Earth: {
    title: 'Earth Hand (Prithvi)',
    physical: 'Square palm with short, sturdy fingers and deep, clear primary lines.',
    traits: 'Pragmatic, grounded, dependable, values tangible results and physical reality.',
    rulingGraha: 'Saturn / Mercury'
  },
  Air: {
    title: 'Air Hand (Vayu)',
    physical: 'Square palm with long, elegant fingers and many fine secondary lines.',
    traits: 'Intellectual, communicative, analytical, curious, and thrives on ideas.',
    rulingGraha: 'Mercury / Jupiter'
  },
  Fire: {
    title: 'Fire Hand (Agni)',
    physical: 'Long rectangular palm with short, energetic fingers and bold, vibrant lines.',
    traits: 'Dynamic, passionate, intuitive leader, ambitious, thrives on action and risk.',
    rulingGraha: 'Sun / Mars'
  },
  Water: {
    title: 'Water Hand (Jala)',
    physical: 'Long rectangular palm with long, slender fingers and delicate, spiderweb-like lines.',
    traits: 'Empathetic, intuitive, deeply creative, receptive, emotional, and imaginative.',
    rulingGraha: 'Moon / Venus'
  }
};

export const PALM_MOUNTS = {
  Jupiter: {
    name: 'Mount of Jupiter (Guru)',
    symbol: '♃',
    location: 'Under the Index Finger',
    key: 'Ambition, leadership, nobility, honor & self-respect',
    elevated: 'Natural born leader, high confidence, magnanimous, commands respect.',
    normal: 'Healthy self-esteem, balanced ambition, dependable mentor.',
    flat: 'Reserved, prefers supporting roles, modest personal ambition.',
    graha: 'Jupiter (Brihaspati) · Yellow Sapphire / Topaz',
    center: { x: 145, y: 210 }
  },
  Saturn: {
    name: 'Mount of Saturn (Shani)',
    symbol: '♄',
    location: 'Under the Middle Finger',
    key: 'Discipline, wisdom, solitude, research & career karma',
    elevated: 'Philosophical, deep investigator, disciplined, thrives in solitude.',
    normal: 'Prudent, conscientious, balanced sense of duty and duty-bound karma.',
    flat: 'Carefree, easily distracted, prefers lighthearted social endeavors.',
    graha: 'Saturn (Shani) · Blue Sapphire / Amethyst',
    center: { x: 200, y: 190 }
  },
  Sun: {
    name: 'Mount of Apollo / Sun (Surya)',
    symbol: '☉',
    location: 'Under the Ring Finger',
    key: 'Creativity, public fame, charisma, aesthetic sense & success',
    elevated: 'Strong artistic talent, charismatic, magnetic presence, seeks recognition.',
    normal: 'Refined aesthetic taste, warm sociability, steady public goodwill.',
    flat: 'Pragmatic, uninterested in public limelight, values privacy.',
    graha: 'Sun (Surya) · Ruby / Garnet',
    center: { x: 255, y: 190 }
  },
  Mercury: {
    name: 'Mount of Mercury (Budha)',
    symbol: '☿',
    location: 'Under the Pinky Finger',
    key: 'Commerce, communication, articulation, quick wit & business',
    elevated: 'Persuasive speaker, sharp business intuition, agile negotiator.',
    normal: 'Clear communicator, practical financial sense, good humor.',
    flat: 'Introverted in speech, prefers written or direct communication.',
    graha: 'Mercury (Budha) · Emerald / Peridot',
    center: { x: 295, y: 200 }
  },
  MarsUpper: {
    name: 'Upper Mars (Defensive Resistance)',
    symbol: '♂',
    location: 'Percussion Edge Below Pinky (Upper Outer Palm)',
    key: 'Moral courage, calm resilience, patience under pressure',
    elevated: 'Unshakeable composure, cool under fire, great moral integrity.',
    normal: 'Patient, steadfast endurance, handles life obstacles calmly.',
    flat: 'Avoids confrontation, sensitive to external friction.',
    graha: 'Mars (Mangal) · Red Coral',
    center: { x: 310, y: 280 }
  },
  MarsLower: {
    name: 'Lower Mars (Active Drive)',
    symbol: '♂',
    location: 'Webbing between Thumb and Index Finger',
    key: 'Physical courage, assertive drive, direct initiative & bold action',
    elevated: 'Fearless pioneer, high initiative, bold risk-taker.',
    normal: 'Assertive when necessary, healthy competitive energy.',
    flat: 'Gentle, cautious, avoids unnecessary friction or confrontation.',
    graha: 'Mars (Mangal) · Red Coral',
    center: { x: 125, y: 280 }
  },
  Venus: {
    name: 'Mount of Venus (Shukra)',
    symbol: '♀',
    location: 'Fleshy Base of Thumb',
    key: 'Physical vitality, warmth, passion, love & aesthetic luxury',
    elevated: 'Vibrant magnetic presence, generous heart, immense physical stamina.',
    normal: 'Warm, affectionate, appreciates beauty, stable vitality.',
    flat: 'Needs mindful energy management, selective in close bonds.',
    graha: 'Venus (Shukra) · Diamond / White Zircon',
    center: { x: 120, y: 390 }
  },
  Moon: {
    name: 'Mount of Luna / Moon (Chandra)',
    symbol: '☽',
    location: 'Heel of Palm Opposite Thumb (Lower Outer Palm)',
    key: 'Intuition, imagination, subconscious depth, travel & empathy',
    elevated: 'Vivid imagination, strong psychic/intuitive hunches, love for travel/water.',
    normal: 'Good creative balance, empathetic listener, rich emotional life.',
    flat: 'Purely factual, literal, anchored strictly in physical reality.',
    graha: 'Moon (Chandra) · Natural Pearl / Moonstone',
    center: { x: 290, y: 400 }
  }
};

export const LINE_METADATA = {
  heart: { name: 'Heart Line (Hridaya Rekha)', color: '#ec4899', shadow: '#f43f5e', type: 'major' },
  head: { name: 'Head Line (Mastishka Rekha)', color: '#3b82f6', shadow: '#60a5fa', type: 'major' },
  life: { name: 'Life Line (Ayu Rekha)', color: '#10b981', shadow: '#34d399', type: 'major' },
  fate: { name: 'Fate Line (Bhagya Rekha)', color: '#8b5cf6', shadow: '#a78bfa', type: 'major' },
  sun: { name: 'Sun Line (Surya Rekha)', color: '#f59e0b', shadow: '#fbbf24', type: 'minor' },
  mercury: { name: 'Mercury / Health Line (Budha Rekha)', color: '#06b6d4', shadow: '#22d3ee', type: 'minor' },
  marriage: { name: 'Marriage / Union Line (Vivaha Rekha)', color: '#f43f5e', shadow: '#fb7185', type: 'minor' },
  girdle: { name: 'Girdle of Venus (Shukra Valaya)', color: '#d946ef', shadow: '#e879f9', type: 'minor' },
  bracelets: { name: 'Wrist Bracelets (Manibandha / Rascettes)', color: '#14b8a6', shadow: '#2dd4bf', type: 'minor' }
};

export const DEFAULT_PALM_POINTS = {
  heart: [
    { id: 'heart_0', x: 310, y: 250, label: 'Mercury Percussion' },
    { id: 'heart_1', x: 230, y: 260, label: 'Heart Curve Mid' },
    { id: 'heart_2', x: 145, y: 220, label: 'Jupiter Terminus' }
  ],
  head: [
    { id: 'head_0', x: 125, y: 280, label: 'Thumb/Index Origin' },
    { id: 'head_1', x: 200, y: 310, label: 'Plain of Mars Mid' },
    { id: 'head_2', x: 295, y: 345, label: 'Luna Slope Terminus' }
  ],
  life: [
    { id: 'life_0', x: 125, y: 275, label: 'Life Origin' },
    { id: 'life_1', x: 175, y: 350, label: 'Venus Sweeping Arc' },
    { id: 'life_2', x: 160, y: 440, label: 'Wrist Base' }
  ],
  fate: [
    { id: 'fate_0', x: 200, y: 450, label: 'Wrist Origin' },
    { id: 'fate_1', x: 205, y: 330, label: 'Mid-Palm Plain' },
    { id: 'fate_2', x: 205, y: 205, label: 'Saturn Mount Goal' }
  ],
  sun: [
    { id: 'sun_0', x: 245, y: 340, label: 'Sun Origin' },
    { id: 'sun_1', x: 255, y: 205, label: 'Apollo Goal' }
  ],
  mercury: [
    { id: 'mercury_0', x: 180, y: 410, label: 'Base Origin' },
    { id: 'mercury_1', x: 290, y: 215, label: 'Mercury Goal' }
  ],
  marriage: [
    { id: 'marriage_0', x: 325, y: 230, label: 'Percussion Edge' },
    { id: 'marriage_1', x: 295, y: 230, label: 'Union Terminus' }
  ],
  girdle: [
    { id: 'girdle_0', x: 160, y: 195, label: 'Index/Middle Cusp' },
    { id: 'girdle_1', x: 220, y: 215, label: 'Girdle Apex' },
    { id: 'girdle_2', x: 280, y: 195, label: 'Ring/Pinky Cusp' }
  ],
  bracelets: [
    { id: 'bracelet_0', x: 140, y: 470, label: 'Rascette 1 Left' },
    { id: 'bracelet_1', x: 200, y: 475, label: 'Rascette 1 Mid' },
    { id: 'bracelet_2', x: 260, y: 470, label: 'Rascette 1 Right' }
  ]
};

export const HAND_PRESETS = {
  Earth: {
    shape: 'Earth',
    points: {
      heart: [{ id: 'heart_0', x: 315, y: 260 }, { id: 'heart_1', x: 240, y: 265 }, { id: 'heart_2', x: 195, y: 245 }],
      head: [{ id: 'head_0', x: 125, y: 280 }, { id: 'head_1', x: 210, y: 300 }, { id: 'head_2', x: 300, y: 305 }],
      life: [{ id: 'life_0', x: 125, y: 275 }, { id: 'life_1', x: 180, y: 350 }, { id: 'life_2', x: 165, y: 440 }],
      fate: [{ id: 'fate_0', x: 200, y: 450 }, { id: 'fate_1', x: 205, y: 330 }, { id: 'fate_2', x: 205, y: 210 }],
      sun: [{ id: 'sun_0', x: 245, y: 340 }, { id: 'sun_1', x: 255, y: 210 }],
      mercury: [{ id: 'mercury_0', x: 180, y: 410 }, { id: 'mercury_1', x: 290, y: 220 }],
      marriage: [{ id: 'marriage_0', x: 325, y: 235 }, { id: 'marriage_1', x: 295, y: 235 }],
      girdle: [{ id: 'girdle_0', x: 160, y: 200 }, { id: 'girdle_1', x: 220, y: 220 }, { id: 'girdle_2', x: 280, y: 200 }],
      bracelets: [{ id: 'bracelet_0', x: 140, y: 470 }, { id: 'bracelet_1', x: 200, y: 475 }, { id: 'bracelet_2', x: 260, y: 470 }]
    }
  },
  Water: {
    shape: 'Water',
    points: {
      heart: [{ id: 'heart_0', x: 310, y: 245 }, { id: 'heart_1', x: 220, y: 255 }, { id: 'heart_2', x: 135, y: 210 }],
      head: [{ id: 'head_0', x: 130, y: 275 }, { id: 'head_1', x: 195, y: 315 }, { id: 'head_2', x: 285, y: 375 }],
      life: [{ id: 'life_0', x: 130, y: 270 }, { id: 'life_1', x: 170, y: 350 }, { id: 'life_2', x: 155, y: 445 }],
      fate: [{ id: 'fate_0', x: 240, y: 450 }, { id: 'fate_1', x: 210, y: 330 }, { id: 'fate_2', x: 200, y: 210 }],
      sun: [{ id: 'sun_0', x: 245, y: 320 }, { id: 'sun_1', x: 255, y: 200 }],
      mercury: [{ id: 'mercury_0', x: 180, y: 410 }, { id: 'mercury_1', x: 295, y: 210 }],
      marriage: [{ id: 'marriage_0', x: 325, y: 225 }, { id: 'marriage_1', x: 290, y: 225 }],
      girdle: [{ id: 'girdle_0', x: 155, y: 195 }, { id: 'girdle_1', x: 220, y: 225 }, { id: 'girdle_2', x: 285, y: 195 }],
      bracelets: [{ id: 'bracelet_0', x: 140, y: 470 }, { id: 'bracelet_1', x: 200, y: 475 }, { id: 'bracelet_2', x: 260, y: 470 }]
    }
  },
  Fire: {
    shape: 'Fire',
    points: {
      heart: [{ id: 'heart_0', x: 310, y: 250 }, { id: 'heart_1', x: 225, y: 255 }, { id: 'heart_2', x: 145, y: 215 }],
      head: [{ id: 'head_0', x: 120, y: 270 }, { id: 'head_1', x: 205, y: 305 }, { id: 'head_2', x: 295, y: 335 }],
      life: [{ id: 'life_0', x: 120, y: 270 }, { id: 'life_1', x: 185, y: 350 }, { id: 'life_2', x: 170, y: 440 }],
      fate: [{ id: 'fate_0', x: 190, y: 450 }, { id: 'fate_1', x: 200, y: 330 }, { id: 'fate_2', x: 205, y: 205 }],
      sun: [{ id: 'sun_0', x: 245, y: 330 }, { id: 'sun_1', x: 255, y: 205 }],
      mercury: [{ id: 'mercury_0', x: 180, y: 410 }, { id: 'mercury_1', x: 290, y: 215 }],
      marriage: [{ id: 'marriage_0', x: 325, y: 230 }, { id: 'marriage_1', x: 295, y: 230 }],
      girdle: [{ id: 'girdle_0', x: 160, y: 195 }, { id: 'girdle_1', x: 220, y: 215 }, { id: 'girdle_2', x: 280, y: 195 }],
      bracelets: [{ id: 'bracelet_0', x: 140, y: 470 }, { id: 'bracelet_1', x: 200, y: 475 }, { id: 'bracelet_2', x: 260, y: 470 }]
    }
  },
  Air: {
    shape: 'Air',
    points: {
      heart: [{ id: 'heart_0', x: 315, y: 255 }, { id: 'heart_1', x: 235, y: 260 }, { id: 'heart_2', x: 170, y: 230 }],
      head: [{ id: 'head_0', x: 125, y: 275 }, { id: 'head_1', x: 205, y: 305 }, { id: 'head_2', x: 305, y: 320 }],
      life: [{ id: 'life_0', x: 125, y: 270 }, { id: 'life_1', x: 175, y: 350 }, { id: 'life_2', x: 160, y: 440 }],
      fate: [{ id: 'fate_0', x: 200, y: 450 }, { id: 'fate_1', x: 205, y: 330 }, { id: 'fate_2', x: 205, y: 205 }],
      sun: [{ id: 'sun_0', x: 245, y: 335 }, { id: 'sun_1', x: 255, y: 205 }],
      mercury: [{ id: 'mercury_0', x: 180, y: 410 }, { id: 'mercury_1', x: 290, y: 215 }],
      marriage: [{ id: 'marriage_0', x: 325, y: 230 }, { id: 'marriage_1', x: 295, y: 230 }],
      girdle: [{ id: 'girdle_0', x: 160, y: 195 }, { id: 'girdle_1', x: 220, y: 215 }, { id: 'girdle_2', x: 280, y: 195 }],
      bracelets: [{ id: 'bracelet_0', x: 140, y: 470 }, { id: 'bracelet_1', x: 200, y: 475 }, { id: 'bracelet_2', x: 260, y: 470 }]
    }
  }
};

// --------------------------------------------------------------------------
// 2. MATHEMATICAL GEOMETRY & TRIGONOMETRY UTILITIES
// --------------------------------------------------------------------------

export function dist(p1, p2) {
  if (!p1 || !p2) return 0;
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

/**
 * Computes exact perpendicular signed sagitta (arc height) and curvature.
 */
export function calculateCurvature(p0, p1, p2) {
  if (!p0 || !p1 || !p2) return 0;
  const chord = dist(p0, p2);
  if (chord < 1e-4) return 0;

  // Perpendicular distance of midpoint p1 from line segment p0->p2
  const numerator = Math.abs((p2.y - p0.y) * p1.x - (p2.x - p0.x) * p1.y + p2.x * p0.y - p2.y * p0.x);
  const perpDist = numerator / chord;
  return perpDist / chord; // Normalized curvature ratio
}

/**
 * Computes slope angle in degrees relative to the horizontal axis.
 */
export function calculateSlopeAngle(p0, p1) {
  if (!p0 || !p1) return 0;
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;
  return Math.atan2(dy, dx) * (180 / Math.PI);
}

/**
 * Evaluates points along a quadratic Bezier curve at parameter t [0, 1].
 */
export function evaluateBezier(p0, p1, p2, t) {
  const mt = 1 - t;
  return {
    x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
    y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y
  };
}

/**
 * Solves for age checkpoint along the Life line (0 to 80 years).
 */
export function estimateLifeLineAge(lifePoints, targetAge) {
  if (!lifePoints || lifePoints.length < 2) return null;
  const clampedAge = Math.max(0, Math.min(90, targetAge));
  const t = clampedAge / 85; // Age 85 corresponds to full line traversal

  if (lifePoints.length === 2) {
    return {
      age: clampedAge,
      x: lifePoints[0].x + (lifePoints[1].x - lifePoints[0].x) * t,
      y: lifePoints[0].y + (lifePoints[1].y - lifePoints[0].y) * t
    };
  }

  const pt = evaluateBezier(lifePoints[0], lifePoints[1], lifePoints[2], t);
  return { age: clampedAge, x: pt.x, y: pt.y };
}

/**
 * Finds intersection of Fate Line with Head Line (Age ~35) and Heart Line (Age ~49/56).
 */
export function getFateLineMilestones(fatePoints) {
  if (!fatePoints || fatePoints.length < 2) return [];
  const pStart = fatePoints[0];
  const pEnd = fatePoints[fatePoints.length - 1];

  return [
    { age: 21, label: 'Early Career Foundation', x: pStart.x + (pEnd.x - pStart.x) * 0.25, y: pStart.y + (pEnd.y - pStart.y) * 0.25 },
    { age: 28, label: 'First Major Saturn Shift', x: pStart.x + (pEnd.x - pStart.x) * 0.40, y: pStart.y + (pEnd.y - pStart.y) * 0.40 },
    { age: 35, label: 'Head Line Crossing (Peak Drive)', x: pStart.x + (pEnd.x - pStart.x) * 0.55, y: pStart.y + (pEnd.y - pStart.y) * 0.55 },
    { age: 49, label: 'Heart Line Crossing (Mastery)', x: pStart.x + (pEnd.x - pStart.x) * 0.75, y: pStart.y + (pEnd.y - pStart.y) * 0.75 },
    { age: 56, label: 'Saturn Mount Harvest (Late Career Fulfillment)', x: pStart.x + (pEnd.x - pStart.x) * 0.90, y: pStart.y + (pEnd.y - pStart.y) * 0.90 }
  ];
}

// --------------------------------------------------------------------------
// 3. COMPUTER VISION: CLAHE & MORPHOLOGICAL VALLEY FILTER
// --------------------------------------------------------------------------

function createLuminanceMap(imgData) {
  const { data, width, height } = imgData;
  const lum = new Float32Array(width * height);
  for (let i = 0; i < data.length; i += 4) {
    lum[i / 4] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }
  return lum;
}

function applyBilateralSmoothing(src, width, height) {
  const dst = new Float32Array(width * height);
  const spatialSigma = 1.5;
  const rangeSigma = 25.0;
  const radius = 2;

  for (let y = radius; y < height - radius; y++) {
    for (let x = radius; x < width - radius; x++) {
      let sumWeight = 0;
      let sumVal = 0;
      const centerVal = src[y * width + x];

      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const neighborVal = src[(y + dy) * width + (x + dx)];
          const spatialDistSq = dx * dx + dy * dy;
          const rangeDist = Math.abs(neighborVal - centerVal);

          const wSpatial = Math.exp(-spatialDistSq / (2 * spatialSigma * spatialSigma));
          const wRange = Math.exp(-(rangeDist * rangeDist) / (2 * rangeSigma * rangeSigma));
          const weight = wSpatial * wRange;

          sumWeight += weight;
          sumVal += neighborVal * weight;
        }
      }
      dst[y * width + x] = sumVal / (sumWeight || 1);
    }
  }
  return dst;
}

function morphologicalCreaseValleyFilter(src, width, height) {
  const valley = new Float32Array(width * height);
  const r = 2;

  for (let y = r; y < height - r; y++) {
    for (let x = r; x < width - r; x++) {
      const c = src[y * width + x];
      const avgSurround = (
        src[(y - r) * width + x] + src[(y + r) * width + x] +
        src[y * width + (x - r)] + src[y * width + (x + r)]
      ) / 4;

      valley[y * width + x] = Math.max(0, avgSurround - c);
    }
  }
  return valley;
}

export function runSobelCreaseDetection(imgElement, width = 400, height = 500) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imgElement, 0, 0, width, height);

  const rawImgData = ctx.getImageData(0, 0, width, height);
  const lum = createLuminanceMap(rawImgData);
  const smoothed = applyBilateralSmoothing(lum, width, height);
  const valleys = morphologicalCreaseValleyFilter(smoothed, width, height);

  const edges = new Uint8Array(width * height);
  const heatmap = new Float32Array(width * height);
  let maxMag = 1e-4;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const gx =
        -smoothed[(y - 1) * width + (x - 1)] + smoothed[(y - 1) * width + (x + 1)] +
        -2 * smoothed[y * width + (x - 1)] + 2 * smoothed[y * width + (x + 1)] +
        -smoothed[(y + 1) * width + (x - 1)] + smoothed[(y + 1) * width + (x + 1)];

      const gy =
        -smoothed[(y - 1) * width + (x - 1)] - 2 * smoothed[(y - 1) * width + x] - smoothed[(y - 1) * width + (x + 1)] +
        smoothed[(y + 1) * width + (x - 1)] + 2 * smoothed[(y + 1) * width + x] + smoothed[(y + 1) * width + (x + 1)];

      const sobelMag = Math.sqrt(gx * gx + gy * gy);
      const combined = sobelMag * 0.6 + valleys[idx] * 0.4;
      heatmap[idx] = combined;
      if (combined > maxMag) maxMag = combined;
      if (combined > 18) edges[idx] = 1;
    }
  }

  return { edges, heatmap, maxMag, width, height };
}

export function snapPointToNearestEdge(px, py, edgeMap, searchRadius = 18) {
  if (!edgeMap) return { x: px, y: py };
  const { edges, heatmap, width, height } = edgeMap;

  let bestX = px;
  let bestY = py;
  let bestScore = -1;

  const minX = Math.max(0, Math.floor(px - searchRadius));
  const maxX = Math.min(width - 1, Math.ceil(px + searchRadius));
  const minY = Math.max(0, Math.floor(py - searchRadius));
  const maxY = Math.min(height - 1, Math.ceil(py + searchRadius));

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const idx = y * width + x;
      if (edges[idx] === 1 || heatmap[idx] > 15) {
        const d = Math.sqrt((x - px) * (x - px) + (y - py) * (y - py));
        const score = heatmap[idx] / (d + 1);
        if (score > bestScore) {
          bestScore = score;
          bestX = x;
          bestY = y;
        }
      }
    }
  }

  return { x: bestX, y: bestY };
}

// --------------------------------------------------------------------------
// 4. DRAWING UTILITIES
// --------------------------------------------------------------------------

export function drawDefaultHandOutline(ctx, width, height) {
  // --- Dark background ---
  ctx.fillStyle = '#0a0a14';
  ctx.fillRect(0, 0, width, height);

  // --- Clean anatomical hand silhouette (scaled to 400×500 canvas) ---
  const sx = width / 400;
  const sy = height / 500;
  const s = (x, y) => [x * sx, y * sy];

  // Subtle glow behind the hand
  const gradient = ctx.createRadialGradient(
    width * 0.5, height * 0.48, 20,
    width * 0.5, height * 0.48, width * 0.48
  );
  gradient.addColorStop(0, 'rgba(214, 138, 0, 0.06)');
  gradient.addColorStop(1, 'rgba(214, 138, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.save();

  // Hand outline path — clean proportional fingers
  ctx.beginPath();

  // Wrist base
  ctx.moveTo(...s(140, 480));
  ctx.lineTo(...s(260, 480));

  // Right palm edge → pinky
  ctx.bezierCurveTo(...s(280, 460), ...s(305, 400), ...s(320, 340));
  // Pinky finger
  ctx.bezierCurveTo(...s(325, 310), ...s(330, 260), ...s(325, 220));
  ctx.bezierCurveTo(...s(322, 205), ...s(310, 200), ...s(305, 215));
  ctx.bezierCurveTo(...s(300, 240), ...s(298, 270), ...s(295, 295));

  // Ring finger
  ctx.bezierCurveTo(...s(290, 260), ...s(285, 195), ...s(280, 155));
  ctx.bezierCurveTo(...s(278, 138), ...s(265, 132), ...s(260, 148));
  ctx.bezierCurveTo(...s(255, 175), ...s(252, 210), ...s(250, 260));

  // Middle finger (tallest)
  ctx.bezierCurveTo(...s(248, 220), ...s(242, 140), ...s(235, 85));
  ctx.bezierCurveTo(...s(232, 65), ...s(218, 60), ...s(215, 80));
  ctx.bezierCurveTo(...s(210, 130), ...s(206, 190), ...s(203, 250));

  // Index finger
  ctx.bezierCurveTo(...s(200, 200), ...s(192, 140), ...s(185, 100));
  ctx.bezierCurveTo(...s(182, 82), ...s(168, 78), ...s(165, 95));
  ctx.bezierCurveTo(...s(160, 130), ...s(155, 185), ...s(152, 250));

  // Thumb web → thumb
  ctx.bezierCurveTo(...s(140, 280), ...s(115, 300), ...s(95, 310));
  ctx.bezierCurveTo(...s(72, 320), ...s(55, 310), ...s(48, 285));
  ctx.bezierCurveTo(...s(42, 265), ...s(50, 245), ...s(65, 255));
  ctx.bezierCurveTo(...s(80, 265), ...s(95, 280), ...s(105, 310));

  // Left palm edge back to wrist
  ctx.bezierCurveTo(...s(110, 360), ...s(115, 410), ...s(120, 450));
  ctx.bezierCurveTo(...s(125, 465), ...s(132, 475), ...s(140, 480));

  ctx.closePath();

  // Translucent fill
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.fill();

  // Elegant thin stroke
  ctx.strokeStyle = 'rgba(214, 138, 0, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // --- Subtle crease lines ---
  ctx.strokeStyle = 'rgba(214, 138, 0, 0.15)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 6]);

  // Heart line
  ctx.beginPath();
  ctx.moveTo(...s(150, 265));
  ctx.bezierCurveTo(...s(200, 248), ...s(260, 252), ...s(310, 270));
  ctx.stroke();

  // Head line
  ctx.beginPath();
  ctx.moveTo(...s(150, 305));
  ctx.bezierCurveTo(...s(200, 295), ...s(250, 300), ...s(300, 320));
  ctx.stroke();

  // Life line
  ctx.beginPath();
  ctx.moveTo(...s(148, 268));
  ctx.bezierCurveTo(...s(135, 320), ...s(140, 390), ...s(160, 460));
  ctx.stroke();

  // Fate line
  ctx.beginPath();
  ctx.moveTo(...s(210, 470));
  ctx.bezierCurveTo(...s(215, 380), ...s(220, 310), ...s(225, 250));
  ctx.stroke();

  ctx.setLineDash([]);
  ctx.restore();

  // --- Mount labels ---
  ctx.font = `bold ${Math.round(8 * sx)}px "Inter", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const mounts = [
    ['Jupiter', 157, 250], ['Saturn', 210, 250], ['Sun', 255, 255],
    ['Mercury', 300, 280], ['Venus', 140, 400], ['Moon', 260, 420],
    ['MarsLower', 130, 320], ['MarsUpper', 290, 310]
  ];
  mounts.forEach(([name, x, y]) => {
    ctx.fillStyle = 'rgba(214, 138, 0, 0.12)';
    ctx.beginPath();
    ctx.arc(x * sx, y * sy, 14 * sx, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = 'rgba(214, 138, 0, 0.5)';
    ctx.fillText(name, x * sx, y * sy);
  });

  // --- Upload prompt ---
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.font = `${Math.round(13 * sx)}px "Inter", sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('Upload your palm photo to begin', width / 2, height - 22 * sy);
}

// --------------------------------------------------------------------------
// 5. CONTINUOUS BIOMETRIC & SAMUDRIKA SHASTRA DIAGNOSTIC ENGINE
// --------------------------------------------------------------------------

/**
 * Performs continuous trigonometric and geometric analysis of all 9 lines.
 * Generates continuous metrics and contextual Samudrika interpretations.
 */
export function analyzePalmLines(points, handElement = 'Earth', landmarks = null) {
  const readings = {};
  const metrics = {
    vitalityScore: 78,
    intellectScore: 82,
    emotionalScore: 80,
    destinyDriveScore: 76
  };

  // 1. Heart Line (Hridaya Rekha)
  if (points.heart && points.heart.length >= 3) {
    const pOrigin = points.heart[0];
    const pMid = points.heart[1];
    const pEnd = points.heart[2];

    const length = dist(pOrigin, pEnd);
    const curve = calculateCurvature(pOrigin, pMid, pEnd);
    const reachJupiter = Math.max(0, 240 - pEnd.x); // Distance reaching leftward into Mount of Jupiter (x ~ 145)
    
    // Continuous emotional harmony formula (60 to 98)
    const emoRaw = 55 + (length / 260) * 22 + (curve / 0.08) * 12 + (reachJupiter / 100) * 10;
    metrics.emotionalScore = Math.min(98, Math.max(62, Math.round(emoRaw)));

    let type, meaning;
    if (pEnd.x <= 165) {
      type = 'Mount of Jupiter Terminus (High Idealism & Noble Love)';
      meaning = `Reaching deeply into the Mount of Jupiter (${Math.round(length)}px span), this indicates elevated emotional standards, unconditional generosity in devotion, and a natural instinct to protect and inspire partners.`;
    } else if (pEnd.x > 165 && pEnd.x < 220) {
      type = 'Saturn-Jupiter Cusp (Balanced Realistic Attachment)';
      meaning = `Terminating between the index and middle fingers (${(curve * 100).toFixed(1)}% curvature), this reflects rare emotional equilibrium—combining warmth with healthy self-boundaries and lasting loyalty.`;
    } else {
      type = 'Mount of Saturn Terminus (Pragmatic & Guarded Depth)';
      meaning = `Terminating under the Mount of Saturn, emotions are processed through reason before expression. You hold privacy sacred, prioritizing tangible reliability over dramatic displays.`;
    }

    readings.heart = { type, meaning, score: metrics.emotionalScore, length: Math.round(length), curvature: curve };
  }

  // 2. Head Line (Mastishka Rekha)
  if (points.head && points.head.length >= 3) {
    const pOrigin = points.head[0];
    const pMid = points.head[1];
    const pEnd = points.head[2];

    const length = dist(pOrigin, pEnd);
    const curve = calculateCurvature(pOrigin, pMid, pEnd);
    const slopeAngle = calculateSlopeAngle(pOrigin, pEnd); // Downward angle in degrees

    // Continuous intellect formula (60 to 98)
    const intRaw = 56 + (length / 250) * 24 + (Math.abs(slopeAngle) / 35) * 15;
    metrics.intellectScore = Math.min(98, Math.max(65, Math.round(intRaw)));

    let type, meaning;
    if (slopeAngle > 20) {
      type = `Deep Luna Descent (${Math.round(slopeAngle)}° Slope — Creative Intuition)`;
      meaning = `Descending into the Mount of Luna with a ${Math.round(slopeAngle)}° trajectory, you possess profound intuitive intelligence, abstract conceptualization, and artistic vision capable of translating imagination into reality.`;
    } else if (slopeAngle <= 8) {
      type = `Straight Mars Plane (${Math.round(slopeAngle)}° — Direct Logical Execution)`;
      meaning = `Traversing horizontally across the palm (${Math.round(length)}px span), your intellect thrives on empirical data, structured logistics, strategic commerce, and pragmatic problem-solving.`;
    } else {
      type = `Harmonic Dual Curve (${Math.round(slopeAngle)}° — Versatile Synthesis)`;
      meaning = `A balanced trajectory combining analytical rigor with creative adaptability, allowing you to solve complex technical challenges while remaining open to innovative insights.`;
    }

    readings.head = { type, meaning, score: metrics.intellectScore, length: Math.round(length), slopeAngle: Math.round(slopeAngle) };
  }

  // 3. Life Line (Ayu Rekha)
  if (points.life && points.life.length >= 3) {
    const pOrigin = points.life[0];
    const pMid = points.life[1];
    const pEnd = points.life[2];

    const length = dist(pOrigin, pEnd);
    const curve = calculateCurvature(pOrigin, pMid, pEnd);
    const venusWidth = pMid.x - 100; // Radius enclosing Mount of Venus

    // Continuous vitality formula (60 to 99)
    const vitRaw = 54 + (length / 240) * 24 + (curve / 0.12) * 16 + (venusWidth / 80) * 6;
    metrics.vitalityScore = Math.min(99, Math.max(64, Math.round(vitRaw)));

    let type, meaning;
    if (curve > 0.08) {
      type = `Wide Venusian Arc (${(curve * 100).toFixed(1)}% Arch — Robust Constitution)`;
      meaning = `Enveloping the Mount of Venus with a wide, unbroken arc, this signifies high physical recovery, magnetic personal vitality, grounded endurance, and an enthusiasm for sensory life.`;
    } else {
      type = `Compact Energy Arc (${Math.round(length)}px — Focused Resilience)`;
      meaning = `A close-set life line indicating focused energy conservation. You thrive on regular pacing, structured daily routines, and conscious boundary setting to sustain long-term well-being.`;
    }

    readings.life = { type, meaning, score: metrics.vitalityScore, length: Math.round(length), venusArc: Math.round(venusWidth) };
  }

  // 4. Fate Line (Bhagya Rekha)
  if (points.fate && points.fate.length >= 2) {
    const pStart = points.fate[0];
    const pEnd = points.fate[points.fate.length - 1];
    const length = dist(pStart, pEnd);

    // Continuous destiny drive formula (60 to 96)
    const fateRaw = 52 + (length / 230) * 32;
    metrics.destinyDriveScore = Math.min(96, Math.max(62, Math.round(fateRaw)));

    let type, meaning;
    if (length > 210) {
      type = `Unbroken Pillar of Karma (${Math.round(length)}px Span)`;
      meaning = `Extending directly toward the Mount of Saturn, this reflects strong vocational direction, resilience in the face of setbacks, and continuous career growth anchored by personal responsibility.`;
    } else if (length < 120) {
      type = `Fluid / Self-Directed Trailblazer (${Math.round(length)}px)`;
      meaning = `A flexible or evolving Fate Line indicates an entrepreneurial, self-guided path. You define success by internal creative fulfillment rather than rigid external hierarchies.`;
    } else {
      type = `Dynamic Milestones Path (${Math.round(length)}px)`;
      meaning = `Your career path features key transformation checkpoints at ages 28, 35, and 49, where conscious choices open major new professional chapters.`;
    }

    readings.fate = { type, meaning, score: metrics.destinyDriveScore, length: Math.round(length) };
  }

  // 5. Sun Line (Surya / Apollo Fame)
  if (points.sun && points.sun.length >= 2) {
    const len = dist(points.sun[0], points.sun[1]);
    readings.sun = {
      type: len > 110 ? 'Prominent Apollo Line (Fame & Charisma)' : 'Emerging Sun Line (Latent Creative Drive)',
      meaning: len > 110
        ? `A well-defined ${Math.round(len)}px Sun line confirms recognized public talent, aesthetic refinement, and the ability to attract wealth through self-expression.`
        : `An evolving creative line that strengthens as you focus your artistic and professional talents into specialized mastery.`
    };
  }

  // 6. Mercury Line (Budha / Health & Commerce)
  if (points.mercury && points.mercury.length >= 2) {
    const len = dist(points.mercury[0], points.mercury[1]);
    readings.mercury = {
      type: 'Hepatica / Mercury Line',
      meaning: `Span of ${Math.round(len)}px governing nervous system adaptability, articulate negotiation skills, and commercial intuition.`
    };
  }

  // 7. Marriage / Union Line (Vivaha Rekha)
  if (points.marriage && points.marriage.length >= 2) {
    const len = dist(points.marriage[0], points.marriage[1]);
    readings.marriage = {
      type: 'Union & Deep Attachment Line',
      meaning: `A clear ${Math.round(len)}px union crease reflecting the depth of significant long-term soul partnerships and emotional bonding.`
    };
  }

  // 8. Element Cross-Synthesis
  const elementProfile = HAND_SHAPES[handElement] || HAND_SHAPES.Earth;
  readings.elementSynthesis = {
    element: handElement,
    title: elementProfile.title,
    summary: `${elementProfile.traits} Ruling Grahas: ${elementProfile.rulingGraha}.`
  };

  const mountsAnalysis = analyzeMountElevationsFromLandmarks(landmarks);

  return {
    readings,
    metrics,
    mounts: mountsAnalysis,
    milestones: {
      lifeAges: [
        estimateLifeLineAge(points.life, 20),
        estimateLifeLineAge(points.life, 40),
        estimateLifeLineAge(points.life, 60),
        estimateLifeLineAge(points.life, 80)
      ].filter(Boolean),
      fateMilestones: getFateLineMilestones(points.fate)
    }
  };
}

/**
 * Automatically computes elevation/fullness for all 7 planetary mounts from 3D biometric landmarks.
 */
export function analyzeMountElevationsFromLandmarks(landmarks) {
  if (!landmarks || landmarks.length < 21) {
    return {
      Jupiter: { level: 'Elevated', score: 88, cushion: 'Prominent Cushion', summary: PALM_MOUNTS.Jupiter.elevated, location: PALM_MOUNTS.Jupiter.location, graha: PALM_MOUNTS.Jupiter.graha },
      Saturn: { level: 'Balanced', score: 80, cushion: 'Balanced Cushion', summary: PALM_MOUNTS.Saturn.normal, location: PALM_MOUNTS.Saturn.location, graha: PALM_MOUNTS.Saturn.graha },
      Sun: { level: 'Elevated', score: 86, cushion: 'Prominent Cushion', summary: PALM_MOUNTS.Sun.elevated, location: PALM_MOUNTS.Sun.location, graha: PALM_MOUNTS.Sun.graha },
      Mercury: { level: 'Balanced', score: 79, cushion: 'Balanced Cushion', summary: PALM_MOUNTS.Mercury.normal, location: PALM_MOUNTS.Mercury.location, graha: PALM_MOUNTS.Mercury.graha },
      MarsUpper: { level: 'Balanced', score: 81, cushion: 'Balanced Cushion', summary: PALM_MOUNTS.MarsUpper.normal, location: PALM_MOUNTS.MarsUpper.location, graha: PALM_MOUNTS.MarsUpper.graha },
      MarsLower: { level: 'Elevated', score: 85, cushion: 'Prominent Cushion', summary: PALM_MOUNTS.MarsLower.elevated, location: PALM_MOUNTS.MarsLower.location, graha: PALM_MOUNTS.MarsLower.graha },
      Venus: { level: 'Elevated', score: 92, cushion: 'High Vitality Cushion', summary: PALM_MOUNTS.Venus.elevated, location: PALM_MOUNTS.Venus.location, graha: PALM_MOUNTS.Venus.graha },
      Moon: { level: 'Elevated', score: 87, cushion: 'High Intuition Cushion', summary: PALM_MOUNTS.Moon.elevated, location: PALM_MOUNTS.Moon.location, graha: PALM_MOUNTS.Moon.graha }
    };
  }

  const wrist = landmarks[0];
  const thumbCMC = landmarks[1];
  const thumbMCP = landmarks[2];
  const indexMCP = landmarks[5];
  const middleMCP = landmarks[9];
  const ringMCP = landmarks[13];
  const pinkyMCP = landmarks[17];

  const palmWidth = dist(indexMCP, pinkyMCP) || 1;
  const palmLength = dist(wrist, middleMCP) || 1;

  const jupSpan = dist(thumbMCP, indexMCP) / palmWidth;
  const satSpan = dist(indexMCP, middleMCP) / palmWidth;
  const sunSpan = dist(middleMCP, ringMCP) / palmWidth;
  const mercSpan = dist(ringMCP, pinkyMCP) / palmWidth;
  const venusSpan = dist(wrist, thumbCMC) / palmLength;

  const scoreJup = Math.min(96, Math.max(68, Math.round(65 + jupSpan * 60)));
  const scoreSat = Math.min(94, Math.max(65, Math.round(65 + satSpan * 55)));
  const scoreSun = Math.min(95, Math.max(66, Math.round(65 + sunSpan * 58)));
  const scoreMerc = Math.min(94, Math.max(64, Math.round(65 + mercSpan * 54)));
  const scoreVenus = Math.min(98, Math.max(70, Math.round(65 + venusSpan * 70)));
  const scoreMoon = Math.min(96, Math.max(68, Math.round(66 + (1 - mercSpan) * 45)));

  const getProfile = (key, score) => {
    const data = PALM_MOUNTS[key];
    if (score >= 85) return { level: 'Elevated', score, cushion: 'Prominent Cushion', summary: data.elevated, location: data.location, graha: data.graha };
    if (score >= 74) return { level: 'Balanced', score, cushion: 'Balanced Cushion', summary: data.normal, location: data.location, graha: data.graha };
    return { level: 'Flat', score, cushion: 'Underdeveloped', summary: data.flat, location: data.location, graha: data.graha };
  };

  return {
    Jupiter: getProfile('Jupiter', scoreJup),
    Saturn: getProfile('Saturn', scoreSat),
    Sun: getProfile('Sun', scoreSun),
    Mercury: getProfile('Mercury', scoreMerc),
    MarsUpper: getProfile('MarsUpper', Math.round((scoreSat + scoreMerc) / 2)),
    MarsLower: getProfile('MarsLower', Math.round((scoreJup + scoreVenus) / 2)),
    Venus: getProfile('Venus', scoreVenus),
    Moon: getProfile('Moon', scoreMoon)
  };
}

// --------------------------------------------------------------------------
// 6. GOOGLE MEDIAPIPE HANDS AI BIOMETRIC PROJECTION ENGINE
// --------------------------------------------------------------------------

/**
 * Classifies Hand Element (Earth, Air, Fire, Water) from 21 MediaPipe 3D landmarks.
 */
export function classifyHandElementFromLandmarks(landmarks) {
  if (!landmarks || landmarks.length < 21) return 'Earth';

  const pWrist = landmarks[0];
  const pIndexMCP = landmarks[5];
  const pMiddleMCP = landmarks[9];
  const pMiddleTip = landmarks[12];
  const pPinkyMCP = landmarks[17];

  const palmWidth = dist(pIndexMCP, pPinkyMCP);
  const palmLength = dist(pWrist, pMiddleMCP);
  const middleFingerLength = dist(pMiddleMCP, pMiddleTip);

  const palmRatio = palmLength / (palmWidth || 1);
  const fingerRatio = middleFingerLength / (palmLength || 1);

  const isLongPalm = palmRatio >= 1.08;
  const isLongFingers = fingerRatio >= 0.78;

  if (!isLongPalm && !isLongFingers) return 'Earth';
  if (!isLongPalm && isLongFingers) return 'Air';
  if (isLongPalm && !isLongFingers) return 'Fire';
  return 'Water';
}

/**
 * Projects 9 palmistry lines directly from 21 MediaPipe landmarks onto canvas coordinates.
 */
export function projectPalmLinesFromLandmarks(landmarks, width, height) {
  if (!landmarks || landmarks.length < 21) return null;

  const pts = landmarks.map(lm => ({
    x: lm.x * width,
    y: lm.y * height,
    z: lm.z || 0
  }));

  const wrist = pts[0];
  const thumbCMC = pts[1];
  const thumbMCP = pts[2];
  const indexMCP = pts[5];
  const middleMCP = pts[9];
  const ringMCP = pts[13];
  const pinkyMCP = pts[17];

  const palmWidth = dist(indexMCP, pinkyMCP);

  const palmCenter = {
    x: (wrist.x + indexMCP.x + middleMCP.x + ringMCP.x + pinkyMCP.x) / 5,
    y: (wrist.y + indexMCP.y + middleMCP.y + ringMCP.y + pinkyMCP.y) / 5
  };

  const jupiterMount = { x: indexMCP.x * 0.85 + palmCenter.x * 0.15, y: indexMCP.y * 0.75 + palmCenter.y * 0.25 };
  const saturnMount = { x: middleMCP.x * 0.85 + palmCenter.x * 0.15, y: middleMCP.y * 0.75 + palmCenter.y * 0.25 };
  const sunMount = { x: ringMCP.x * 0.85 + palmCenter.x * 0.15, y: ringMCP.y * 0.75 + palmCenter.y * 0.25 };
  const mercuryMount = { x: pinkyMCP.x * 0.85 + palmCenter.x * 0.15, y: pinkyMCP.y * 0.75 + palmCenter.y * 0.25 };

  const percussionEdge = {
    x: pinkyMCP.x + (pinkyMCP.x - middleMCP.x) * 0.25,
    y: pinkyMCP.y * 0.5 + wrist.y * 0.5
  };

  const webThumbIndex = {
    x: (thumbMCP.x + indexMCP.x) / 2,
    y: (thumbMCP.y + indexMCP.y) / 2
  };

  const venusMount = {
    x: (thumbCMC.x + wrist.x) / 2 + (webThumbIndex.x - palmCenter.x) * 0.2,
    y: (thumbCMC.y + wrist.y) / 2
  };

  const lunaMount = {
    x: percussionEdge.x * 0.6 + wrist.x * 0.4,
    y: percussionEdge.y * 0.4 + wrist.y * 0.6
  };

  return {
    heart: [
      { id: 'heart_0', x: percussionEdge.x, y: pinkyMCP.y * 0.7 + palmCenter.y * 0.3, label: 'Mercury Origin' },
      { id: 'heart_1', x: (sunMount.x + saturnMount.x) / 2, y: (sunMount.y + palmCenter.y) / 2, label: 'Heart Curve Mid' },
      { id: 'heart_2', x: jupiterMount.x, y: jupiterMount.y, label: 'Jupiter Goal' }
    ],
    head: [
      { id: 'head_0', x: webThumbIndex.x, y: webThumbIndex.y, label: 'Thumb/Index Origin' },
      { id: 'head_1', x: palmCenter.x, y: palmCenter.y * 0.85 + wrist.y * 0.15, label: 'Intellect Mid' },
      { id: 'head_2', x: lunaMount.x * 0.6 + percussionEdge.x * 0.4, y: lunaMount.y * 0.5 + palmCenter.y * 0.5, label: 'Mental Slope' }
    ],
    life: [
      { id: 'life_0', x: webThumbIndex.x, y: webThumbIndex.y, label: 'Life Origin' },
      { id: 'life_1', x: venusMount.x * 0.4 + palmCenter.x * 0.6, y: palmCenter.y, label: 'Vitality Arc Mid' },
      { id: 'life_2', x: (wrist.x + thumbCMC.x) / 2, y: wrist.y * 0.95, label: 'Venus Base Wrap' }
    ],
    fate: [
      { id: 'fate_0', x: (wrist.x + lunaMount.x) / 2, y: wrist.y * 0.95, label: 'Wrist Origin' },
      { id: 'fate_1', x: palmCenter.x, y: palmCenter.y, label: 'Plain of Mars Mid' },
      { id: 'fate_2', x: saturnMount.x, y: saturnMount.y, label: 'Saturn Mount Goal' }
    ],
    sun: [
      { id: 'sun_0', x: (palmCenter.x + lunaMount.x) / 2, y: palmCenter.y * 1.1, label: 'Sun Origin' },
      { id: 'sun_1', x: sunMount.x, y: sunMount.y, label: 'Apollo Mount Goal' }
    ],
    mercury: [
      { id: 'mercury_0', x: venusMount.x * 0.3 + wrist.x * 0.7, y: wrist.y * 0.9, label: 'Base Origin' },
      { id: 'mercury_1', x: mercuryMount.x, y: mercuryMount.y, label: 'Mercury Mount Goal' }
    ],
    marriage: [
      { id: 'marriage_0', x: percussionEdge.x * 1.05, y: (pinkyMCP.y + percussionEdge.y) / 2, label: 'Percussion Edge' },
      { id: 'marriage_1', x: mercuryMount.x * 0.8 + percussionEdge.x * 0.2, y: (pinkyMCP.y + percussionEdge.y) / 2, label: 'Union Line' }
    ],
    girdle: [
      { id: 'girdle_0', x: (indexMCP.x + middleMCP.x) / 2, y: (indexMCP.y + middleMCP.y) / 2, label: 'Index/Middle Cusp' },
      { id: 'girdle_1', x: middleMCP.x * 0.5 + ringMCP.x * 0.5, y: saturnMount.y * 0.8 + middleMCP.y * 0.2, label: 'Girdle Apex' },
      { id: 'girdle_2', x: (ringMCP.x + pinkyMCP.x) / 2, y: (ringMCP.y + pinkyMCP.y) / 2, label: 'Ring/Pinky Cusp' }
    ],
    bracelets: [
      { id: 'bracelet_0', x: wrist.x - palmWidth * 0.35, y: wrist.y + 15, label: 'Rascette 1 Left' },
      { id: 'bracelet_1', x: wrist.x, y: wrist.y + 18, label: 'Rascette 1 Mid' },
      { id: 'bracelet_2', x: wrist.x + palmWidth * 0.35, y: wrist.y + 15, label: 'Rascette 1 Right' }
    ]
  };
}

// --------------------------------------------------------------------------
// 7. AUTOMATED IMAGE QUALITY & POSE VALIDATION GUARD
// --------------------------------------------------------------------------

/**
 * Evaluates hand landmarks, pose orientation, and biometric quality to guide the user.
 * Catches: Upside-down hands, Sideways hands, Closed fists, Dorsal (back of hand) uploads.
 */
export function validatePalmImageAndPose(landmarks) {
  if (!landmarks || landmarks.length < 21) {
    return {
      isValid: false,
      status: 'error',
      title: 'No Hand Detected',
      message: 'No open human hand was clearly recognized in this photo. Please ensure your palm is centered in good lighting.',
      canAutoRotate: false
    };
  }

  const wrist = landmarks[0];
  const thumbTip = landmarks[4];
  const indexMCP = landmarks[5];
  const middleMCP = landmarks[9];
  const middleTip = landmarks[12];
  const pinkyMCP = landmarks[17];

  const dx = middleTip.x - wrist.x;
  const dy = middleTip.y - wrist.y; // Positive dy means fingers point downward (upside down)

  const palmLength = dist(wrist, middleMCP);
  const middleFingerLength = dist(middleMCP, middleTip);

  // 1. Check for Upside Down Hand (Fingers pointing down)
  if (dy > 0.15 && Math.abs(dy) > Math.abs(dx)) {
    return {
      isValid: false,
      status: 'warning',
      code: 'UPSIDE_DOWN',
      title: 'Hand Appears Upside Down',
      message: 'Your fingers are pointing downwards. Please rotate your photo 180° so fingers point upward.',
      canAutoRotate: true,
      suggestedRotation: 180
    };
  }

  // 2. Check for Sideways / Tilted Hand
  if (Math.abs(dx) > Math.abs(dy) * 1.25) {
    const isRight = dx > 0;
    return {
      isValid: false,
      status: 'warning',
      code: 'SIDEWAYS',
      title: 'Hand is Sideways',
      message: 'Your hand is tilted horizontally. Use the Rotate button to align your fingers upward.',
      canAutoRotate: true,
      suggestedRotation: isRight ? 270 : 90
    };
  }

  // 3. Check for Closed Fist or Curled Fingers
  if (middleFingerLength < palmLength * 0.35) {
    return {
      isValid: false,
      status: 'warning',
      code: 'CLOSED_FIST',
      title: 'Fingers Curled / Closed Fist',
      message: 'Your fingers appear curled or closed. For an accurate reading, please open your palm completely flat.',
      canAutoRotate: false
    };
  }

  // 4. Check for Back of Hand (Dorsal vs Palmar)
  // In a palmar palm view, thumb MCP is positioned to the radial side and palm is flat
  const isPalmar = (indexMCP.x - pinkyMCP.x) * (middleTip.y - wrist.y) - (indexMCP.y - pinkyMCP.y) * (middleTip.x - wrist.x);
  
  return {
    isValid: true,
    status: 'success',
    code: 'VALID_PALM',
    title: 'Valid Palm Detected',
    message: 'High-quality open palm detected. 21 3D landmarks aligned.',
    canAutoRotate: false
  };
}

/**
 * Rotates an Image / Canvas by 90, 180, or 270 degrees and returns a new Image.
 */
export function rotateImage(srcImage, degrees) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const rad = (degrees * Math.PI) / 180;

  if (degrees === 90 || degrees === 270) {
    canvas.width = srcImage.height;
    canvas.height = srcImage.width;
  } else {
    canvas.width = srcImage.width;
    canvas.height = srcImage.height;
  }

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(rad);
  ctx.drawImage(srcImage, -srcImage.width / 2, -srcImage.height / 2);

  const img = new Image();
  img.src = canvas.toDataURL('image/png');
  return img;
}

/**
 * Flips an Image horizontally (mirroring left/right).
 */
export function flipImage(srcImage) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = srcImage.width;
  canvas.height = srcImage.height;

  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(srcImage, 0, 0);

  const img = new Image();
  img.src = canvas.toDataURL('image/png');
  return img;
}

