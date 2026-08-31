/**
 * Astrology Module - Jyotisha
 * Precise Keplerian Orbital Elements Engine (Sun, Moon, and Planets)
 * Local Sidereal Time & Geocentric coordinate calculations
 */

// ZODIAC DATA
export const ZODIAC_SIGNS = [
  { name: "Aries", symbol: "♈", element: "Fire", modality: "Cardinal", planet: "Mars", startMonth: 3, startDay: 21, endMonth: 4, endDay: 19, desc: "Aries is energetic, pioneer-minded, courageous, and direct. You are a natural-born leader who meets challenges head-on with passion." },
  { name: "Taurus", symbol: "♉", element: "Earth", modality: "Fixed", planet: "Venus", startMonth: 4, startDay: 20, endMonth: 5, endDay: 20, desc: "Taurus is patient, reliable, warm-hearted, and determined. You value physical security, beauty, comfort, and steady progress." },
  { name: "Gemini", symbol: "♊", element: "Air", modality: "Mutable", planet: "Mercury", startMonth: 5, startDay: 21, endMonth: 6, endDay: 20, desc: "Gemini is adaptable, intellectual, talkative, and curious. You love gathering information, sharing ideas, and exploring options." },
  { name: "Cancer", symbol: "♋", element: "Water", modality: "Cardinal", planet: "Moon", startMonth: 6, startDay: 21, endMonth: 7, endDay: 22, desc: "Cancer is intuitive, emotional, protective, and sympathetic. You have a deep connection to home, family, and emotional roots." },
  { name: "Leo", symbol: "♌", element: "Fire", modality: "Fixed", planet: "Sun", startMonth: 7, startDay: 23, endMonth: 8, endDay: 22, desc: "Leo is generous, warm, creative, and enthusiastic. You shine in the spotlight and lead others with a noble, loyal heart." },
  { name: "Virgo", symbol: "♍", element: "Earth", modality: "Mutable", planet: "Mercury", startMonth: 8, startDay: 23, endMonth: 9, endDay: 22, desc: "Virgo is analytical, meticulous, practical, and helpful. You seek order, self-improvement, and dedicated service to others." },
  { name: "Libra", symbol: "♎", element: "Air", modality: "Cardinal", planet: "Venus", startMonth: 9, startDay: 23, endMonth: 10, endDay: 22, desc: "Libra is diplomatic, artistic, easygoing, and fair. You seek harmony, balance, and beautiful relationships in all areas of life." },
  { name: "Scorpio", symbol: "♏", element: "Water", modality: "Fixed", planet: "Pluto & Mars", startMonth: 10, startDay: 23, endMonth: 11, endDay: 21, desc: "Scorpio is passionate, intense, magnetic, and highly intuitive. You are drawn to secrets, psychological depth, and personal transformation." },
  { name: "Sagittarius", symbol: "♐", element: "Fire", modality: "Mutable", planet: "Jupiter", startMonth: 11, startDay: 22, endMonth: 12, endDay: 21, desc: "Sagittarius is optimistic, freedom-loving, philosophical, and honest. You are an explorer seeking truth, meaning, and adventure." },
  { name: "Capricorn", symbol: "♑", element: "Earth", modality: "Cardinal", planet: "Saturn", startMonth: 12, startDay: 22, endMonth: 1, endDay: 19, desc: "Capricorn is ambitious, disciplined, prudent, and patient. You scale mountains of challenges with dedication and practical wisdom." },
  { name: "Aquarius", symbol: "♒", element: "Air", modality: "Fixed", planet: "Uranus & Saturn", startMonth: 1, startDay: 20, endMonth: 2, endDay: 18, desc: "Aquarius is humanitarian, independent, original, and intellectual. You think outside the box to build a progressive future." },
  { name: "Pisces", symbol: "♓", element: "Water", modality: "Mutable", planet: "Neptune & Jupiter", startMonth: 2, startDay: 19, endMonth: 3, endDay: 20, desc: "Pisces is imaginative, sensitive, compassionate, and spiritual. You merge with the collective flow and possess deep artistic instincts." }
];

// Planets symbols and colors database
export const PLANET_DEFAULTS = {
  Sun: { symbol: "☉", color: "#ffd700" },
  Moon: { symbol: "☽", color: "#87ceeb" },
  Mercury: { symbol: "☿", color: "#32cd32" },
  Venus: { symbol: "♀", color: "#ff69b4" },
  Mars: { symbol: "♂", color: "#ff4500" },
  Jupiter: { symbol: "♃", color: "#da70d6" },
  Saturn: { symbol: "♄", color: "#ffa500" },
  Uranus: { symbol: "♅", color: "#40e0d0" },
  Neptune: { symbol: "♆", color: "#1e90ff" },
  Pluto: { symbol: "♇", color: "#ba55d3" },
  Rahu: { symbol: "☊", color: "#8a2be2" },
  Ketu: { symbol: "☋", color: "#a0522d" }
};

// ==========================================================================
// ASTRONOMICAL COMPUTATIONS ENGINE
// ==========================================================================

// Normalize any angle into the [0, 360) range. JavaScript's % operator keeps the
// sign of the dividend, so a plain `x % 360` on a negative angle (which happens for
// dates before J2000, where the Julian-century term T is negative) stays negative.
// This helper guarantees a valid longitude for every date.
export function normalizeDegrees(angle) {
  return ((angle % 360) + 360) % 360;
}

// Calendar Date to Julian Date (UTC time)
export function getJulianDate(year, month, day, hour = 12, minute = 0) {
  let Y = year;
  let M = month;
  const D = day + (hour + minute / 60) / 24;

  if (M <= 2) {
    Y -= 1;
    M += 12;
  }

  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);

  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + D + B - 1524.5;
}

// Keplerian orbital elements at J2000.0 (reference: NASA JPL)
// Values: a (semi-major axis, AU), e (eccentricity), I (inclination, deg),
// L (mean longitude, deg), w (longitude of perihelion, deg), node (long. of ascending node, deg)
// and their rates of change per century (T)
const PLANETARY_ELEMENTS = {
  Mercury: {
    a: [0.38709893, 0.0],
    e: [0.20563069, 0.00002040],
    I: [7.00487, -0.00594],
    L: [252.25084, 149472.67411],
    w: [77.45645, 0.15901],
    node: [48.33167, -0.12526]
  },
  Venus: {
    a: [0.72333199, 0.0],
    e: [0.00677323, -0.00004776],
    I: [3.39471, -0.00079],
    L: [181.97973, 58517.81538],
    w: [131.53298, 0.00043],
    node: [76.68069, -0.27769]
  },
  Earth: { // Sun (Earth heliocentric + 180 degrees)
    a: [1.00000011, 0.0],
    e: [0.01671022, -0.00003804],
    I: [0.00005, -0.01300],
    L: [100.46435, 35999.37288],
    w: [102.94719, 0.31795],
    node: [-11.26064, -0.41221]
  },
  Mars: {
    a: [1.52366231, 0.0],
    e: [0.09341233, 0.00011902],
    I: [1.85061, -0.00724],
    L: [355.45332, 19140.30268],
    w: [336.04084, 0.44388],
    node: [49.57854, -0.29498]
  },
  Jupiter: {
    a: [5.20336301, 0.00060737],
    e: [0.04839266, -0.00012880],
    I: [1.30530, -0.00415],
    L: [34.40438, 3034.74612],
    w: [14.75385, 0.19190],
    node: [100.55615, 0.20399]
  },
  Saturn: {
    a: [9.53707032, -0.00301530],
    e: [0.05415060, -0.00036762],
    I: [2.48446, 0.00193],
    L: [49.94432, 1222.11379],
    w: [92.43194, -0.41897],
    node: [113.71504, -0.37244]
  },
  Uranus: {
    a: [19.19126393, 0.00152042],
    e: [0.04716771, -0.00019150],
    I: [0.76986, -0.00246],
    L: [313.23218, 428.48202],
    w: [170.96424, 0.40805],
    node: [74.22988, 0.07431]
  },
  Neptune: {
    a: [30.06896348, -0.00125196],
    e: [0.00858587, 0.00002514],
    I: [1.76917, -0.00353],
    L: [304.88003, 218.45945],
    w: [44.97135, -0.32241],
    node: [131.72169, -0.00599]
  },
  Pluto: {
    a: [39.48168677, -0.00076912],
    e: [0.24880766, 0.00006465],
    I: [17.14175, 0.00307],
    L: [238.92881, 145.20780],
    w: [224.06676, -0.04063],
    node: [110.30347, -0.00845]
  }
};

// Solve Kepler's Equation: E - e sin E = M
function solveKepler(M_rad, e) {
  let E = M_rad;
  for (let i = 0; i < 5; i++) {
    E = M_rad + e * Math.sin(E);
  }
  return E;
}

// Calculate Heliocentric Coordinates (3D vector)
function getHeliocentricVector(planetName, T) {
  const elem = PLANETARY_ELEMENTS[planetName];
  if (!elem) return { x: 0, y: 0, z: 0 };

  const degToRad = Math.PI / 180;

  // Compute elements at century T
  const a = elem.a[0] + elem.a[1] * T;
  const e = elem.e[0] + elem.e[1] * T;
  const I = (elem.I[0] + elem.I[1] * T) * degToRad;
  const L = (elem.L[0] + elem.L[1] * T) % 360 * degToRad;
  const w = (elem.w[0] + elem.w[1] * T) * degToRad;
  const node = (elem.node[0] + elem.node[1] * T) * degToRad;

  // Mean anomaly M
  const M = L - w;
  const E = solveKepler(M, e);

  // Position in orbital plane
  const x_plane = a * (Math.cos(E) - e);
  const y_plane = a * Math.sqrt(1 - e * e) * Math.sin(E);

  // Rotate to 3D ecliptic coordinates
  const cosNode = Math.cos(node);
  const sinNode = Math.sin(node);
  const cosW = Math.cos(w - node);
  const sinW = Math.sin(w - node);
  const cosI = Math.cos(I);
  const sinI = Math.sin(I);

  // Ecliptic coordinates
  const x = x_plane * (cosW * cosNode - sinW * sinNode * cosI) - y_plane * (sinW * cosNode + cosW * sinNode * cosI);
  const y = x_plane * (cosW * sinNode + sinW * cosNode * cosI) - y_plane * (sinW * sinNode - cosW * cosNode * cosI);
  const z = x_plane * (sinW * sinI) + y_plane * (cosW * sinI);

  return { x, y, z };
}

// Calculate precise Geocentric Ecliptic Longitude for a planet
export function calculateGeocentricLongitude(planetName, T) {
  if (planetName === 'Sun') {
    // Sun's geocentric coordinate is Earth heliocentric coordinate + 180 degrees
    const posE = getHeliocentricVector('Earth', T);
    const lonRad = Math.atan2(-posE.y, -posE.x);
    const lonDeg = lonRad * 180 / Math.PI;
    return normalizeDegrees(lonDeg);
  }
  
  if (planetName === 'Moon') {
    // Moon coordinates using simplified Brown perturbation terms
    const degToRad = Math.PI / 180;
    // Mean longitude L'
    const L_prime = normalizeDegrees(218.316 + 481267.881 * T);
    // Mean elongation of Moon D
    const D = normalizeDegrees(297.85 + 445267.111 * T);
    // Mean anomaly of Sun M
    const M = normalizeDegrees(357.529 + 35999.05 * T);
    // Mean anomaly of Moon M'
    const M_prime = normalizeDegrees(134.963 + 477198.868 * T);
    // Mean latitude of Moon F
    const F = normalizeDegrees(93.272 + 483202.018 * T);

    let lon = L_prime
      + 6.289 * Math.sin(M_prime * degToRad)
      - 1.274 * Math.sin((M_prime - 2 * D) * degToRad)
      + 0.658 * Math.sin(2 * D * degToRad)
      + 0.214 * Math.sin(2 * M_prime * degToRad)
      - 0.186 * Math.sin(M * degToRad)
      - 0.114 * Math.sin(2 * F * degToRad)
      - 0.057 * Math.sin((M_prime + 2 * D) * degToRad);

    return normalizeDegrees(lon);
  }

  // General Planet geocentric translation
  const posP = getHeliocentricVector(planetName, T);
  const posE = getHeliocentricVector('Earth', T);

  // Vector from Earth to Planet
  const gx = posP.x - posE.x;
  const gy = posP.y - posE.y;

  const lonRad = Math.atan2(gy, gx);
  const lonDeg = lonRad * 180 / Math.PI;
  return normalizeDegrees(lonDeg);
}

// Convert longitude to Zodiac Sign Details
export function getZodiacSignFromLongitude(longitude) {
  longitude = normalizeDegrees(longitude); // guard against negatives and the 360 -> index 12 edge
  const idx = Math.floor(longitude / 30);
  const sign = ZODIAC_SIGNS[idx];
  const deg = Math.floor(longitude % 30);
  const min = Math.floor(((longitude % 30) - deg) * 60);

  return {
    index: idx,
    name: sign.name,
    symbol: sign.symbol,
    element: sign.element,
    modality: sign.modality,
    planet: sign.planet,
    desc: sign.desc,
    positionStr: `${deg}° ${sign.name} ${String(min).padStart(2, '0')}'`
  };
}

// Precise Sidereal Time and Ascendant Calculation
export function getPreciseAscendant(jd, longitude, latitude) {
  const T = (jd - 2451545.0) / 36525.0;
  const degToRad = Math.PI / 180;
  const radToDeg = 180 / Math.PI;

  // 1. Greenwich Mean Sidereal Time (GMST), in degrees.
  // NOTE: the earlier version used the "GMST at 0h UT" coefficient (2400.05.../century)
  // but multiplied it by the FULL-day T and dropped the ~1.00274 * UT-hours Earth-rotation
  // term. That left the Ascendant correct only when the birth's UT hour happened to be 0,
  // and up to ~130 deg off otherwise. This single-expression form carries the full rotation
  // rate (360.98564736629 deg/day) and is correct for any instant.
  const D = jd - 2451545.0;
  const gmstDeg = 280.46061837 + 360.98564736629 * D + 0.000387933 * T * T;

  // Right Ascension of the Midheaven = Local Sidereal Time in degrees (longitude east-positive)
  const RAMC = normalizeDegrees(gmstDeg + longitude);
  const RAMC_rad = RAMC * degToRad;

  // 2. Obliquity of the Ecliptic (ε)
  const eps = (23.4392911 - 0.013004167 * T) * degToRad;
  const phi = latitude * degToRad;

  // 3. Ascendant formula
  // tan(Asc) = cos(RAMC) / (-sin(RAMC)*cos(eps) - tan(phi)*sin(eps))
  const num = Math.cos(RAMC_rad);
  const den = -Math.sin(RAMC_rad) * Math.cos(eps) - Math.tan(phi) * Math.sin(eps);
  
  const ascRad = Math.atan2(num, den);
  const ascDeg = ascRad * radToDeg;

  return normalizeDegrees(ascDeg);
}

// Calculate Compatibility between two zodiac signs
export function calculateCompatibility(sign1Name, sign2Name) {
  const s1 = ZODIAC_SIGNS.find(s => s.name === sign1Name);
  const s2 = ZODIAC_SIGNS.find(s => s.name === sign2Name);
  
  if (!s1 || !s2) return { score: 50, category: "Neutral", description: "Incomplete cosmic data." };

  let score = 50;
  let category = "Neutral";
  let explanation = "";

  const elements = [s1.element, s2.element];
  
  if (s1.name === s2.name) {
    score = 85;
    category = "Cosmic Mirrors";
    explanation = `As two ${s1.name}s, you share the exact same celestial energy, values, and outlook. You understand each other's strengths and flaws instantly, but must watch out for compounding each other's weaknesses.`;
  } else if (s1.element === s2.element) {
    score = 90;
    category = "Elemental Harmony";
    explanation = `Both belonging to the element of ${s1.element}, your connection flows naturally. You share fundamental ways of processing emotions and energy. You comfort each other and share intuitive alignment.`;
  } else if (
    (elements.includes("Fire") && elements.includes("Air")) ||
    (elements.includes("Earth") && elements.includes("Water"))
  ) {
    score = 80;
    category = "Nourishing Synergy";
    explanation = elements.includes("Fire") 
      ? "Fire needs Air to burn, and Air gets warmed by Fire. This connection is dynamic, highly communicative, inspiring, and filled with creative sparks."
      : "Earth holds and shapes Water, while Water nourishes and softens Earth. This is a highly stable, emotional, and fertile connection, perfect for long-term growth.";
  } else if (
    (elements.includes("Fire") && elements.includes("Water")) ||
    (elements.includes("Earth") && elements.includes("Air"))
  ) {
    score = 45;
    category = "Dynamic Friction";
    explanation = elements.includes("Fire")
      ? "Water can extinguish Fire, and Fire can boil Water away. You operate on different frequencies (emotion vs. action). While intensely magnetic, it requires deep patience to avoid steam or burnout."
      : "Air lives in thoughts and theories, while Earth demands physical facts and structure. You may feel like you are speaking different languages, though you can balance each other beautifully with work.";
  } else {
    score = 60;
    category = "Growth Opportunities";
    explanation = elements.includes("Fire")
      ? "Fire can scorch Earth, while Earth can smother Fire. However, Earth can provide a stable launchpad for Fire's ambitions, making this a great practical partnership if managed well."
      : "Water lives in feeling, and Air lives in thought. You may struggle to understand each other's reactions, but you can build a rich, creative bridge between mind and soul.";
  }

  if (s1.modality === s2.modality && s1.name !== s2.name) {
    score -= 10;
    if (s1.modality === "Fixed") {
      explanation += " Both of you possess Fixed modalities, meaning you are stubborn and resistant to compromise. Learning to yield is your cosmic lesson.";
    } else if (s1.modality === "Cardinal") {
      explanation += " As Cardinal signs, both of you want to lead and initiate. You must establish equal leadership to prevent constant power struggles.";
    } else {
      explanation += " Both being Mutable signs, your connection is flexible but may lack grounding and stability. You'll need to work on commitment and direction.";
    }
  }

  return { score, category, explanation };
}

// Canvas Astrological Birth Chart Renderer - Plots Sun, Moon, and 8 planets precisely
export function drawBirthChart(canvas, planetaryPositions, ascendantLongitude) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 15;

  ctx.clearRect(0, 0, width, height);

  // Background
  ctx.fillStyle = '#070714';
  ctx.fillRect(0, 0, width, height);

  // Draw twinkling stars
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  for (let i = 0; i < 40; i++) {
    const starX = (Math.sin(i * 432) + 1) * centerX;
    const starY = (Math.cos(i * 789) + 1) * centerY;
    ctx.fillRect(starX, starY, 1, 1);
  }

  // Outer Gold Ring
  ctx.shadowColor = '#8a2be2';
  ctx.shadowBlur = 8;
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.shadowBlur = 0; // reset shadow

  // Inner tracks
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.35)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius - 25, 0, 2 * Math.PI);
  ctx.arc(centerX, centerY, radius - 55, 0, 2 * Math.PI);
  ctx.arc(centerX, centerY, radius - 105, 0, 2 * Math.PI);
  ctx.stroke();

  // Draw 12 House Boundaries starting from Ascendant
  // In standard charts, Ascendant is drawn on the left horizon (180 degrees or PI radians)
  // Let's offset our draw coordinates so that the calculated Ascendant index aligns to the left (180 deg)
  const angleOffset = Math.PI - (ascendantLongitude * Math.PI / 180);

  ctx.strokeStyle = 'rgba(138, 43, 226, 0.25)';
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30) * Math.PI / 180 + angleOffset;
    const xOuter = centerX + radius * Math.cos(angle);
    const yOuter = centerY + radius * Math.sin(angle);
    const xInner = centerX + (radius - 105) * Math.cos(angle);
    const yInner = centerY + (radius - 105) * Math.sin(angle);
    
    ctx.beginPath();
    ctx.moveTo(xInner, yInner);
    ctx.lineTo(xOuter, yOuter);
    ctx.stroke();
  }

  // Draw Constellation symbols in outer track
  ctx.font = '13px "Courier New", Courier, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  for (let i = 0; i < 12; i++) {
    const sign = ZODIAC_SIGNS[i];
    
    // Position text in middle of sector (15 deg offset)
    const angle = (i * 30 + 15) * Math.PI / 180 + angleOffset;
    const textRadius = radius - 12.5;
    const tx = centerX + textRadius * Math.cos(angle);
    const ty = centerY + textRadius * Math.sin(angle);
    
    ctx.fillStyle = '#ffd700';
    ctx.fillText(sign.symbol, tx, ty);
  }

  // Plot Planet Positions precisely
  Object.keys(planetaryPositions).forEach((planetName) => {
    const lon = planetaryPositions[planetName];
    const defaults = PLANET_DEFAULTS[planetName] || { symbol: "•", color: "#fff" };
    
    // Calculate canvas plot angle relative to Ascendant alignment
    const angle = (lon * Math.PI / 180) + angleOffset;
    const orbitRadius = radius - 40 - (planetName === 'Sun' || planetName === 'Moon' ? 0 : 12); // layer planets slightly
    
    const px = centerX + orbitRadius * Math.cos(angle);
    const py = centerY + orbitRadius * Math.sin(angle);

    // Draw dot
    ctx.fillStyle = defaults.color;
    ctx.beginPath();
    ctx.arc(px, py, 4.5, 0, 2 * Math.PI);
    ctx.fill();

    // Draw planetary symbol text label
    ctx.font = '11px "Courier New", monospace';
    ctx.fillText(defaults.symbol, px, py - 13);
  });

  // Plot Ascendant marker at Left Horizon
  ctx.fillStyle = '#c71585';
  ctx.font = '9px "Courier New", monospace';
  ctx.fillText('ASC', centerX - (radius - 15), centerY - 10);
  ctx.strokeStyle = '#c71585';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(centerX - radius, centerY);
  ctx.lineTo(centerX - (radius - 55), centerY);
  ctx.stroke();

  // Draw aspect connection chords in center core
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.12)';
  ctx.lineWidth = 0.8;
  const points = [];
  
  // Gather Sun, Moon, Mercury, Venus, Mars coordinates
  ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'].forEach((name) => {
    const lon = planetaryPositions[name];
    if (lon !== undefined) {
      const angle = (lon * Math.PI / 180) + angleOffset;
      const coreR = radius - 105;
      points.push({
        x: centerX + coreR * Math.cos(angle),
        y: centerY + coreR * Math.sin(angle)
      });
    }
  });

  // Connect chords
  ctx.beginPath();
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      ctx.moveTo(points[i].x, points[i].y);
      ctx.lineTo(points[j].x, points[j].y);
    }
  }
  ctx.stroke();

  // Center Core
  ctx.fillStyle = '#0B0B1E';
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 18, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  ctx.fillStyle = '#ffd700';
  ctx.font = '7px "Courier New"';
  ctx.fillText('NATAL', centerX, centerY);
}
