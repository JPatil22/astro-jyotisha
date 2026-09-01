/**
 * Multi-Style Vedic Kundli Canvas Renderers - Jyotisha
 * Supports:
 * 1. North Indian (Diamond chart: Fixed houses, rotating signs)
 * 2. South Indian (Box chart: Fixed signs, rotating Lagna marker)
 * 3. East Indian (Bengali / Odia chart: Fixed signs layout with diagonals)
 */

import { normalizeDegrees } from './astrology.js';
import { RASHIS, GRAHA_DEFAULTS } from './jyotish.js';

const GRAHA_ABBR = {
  Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me',
  Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke'
};

// --------------------------------------------------------------------------
// 1. NORTH INDIAN DIAMOND CHART
// --------------------------------------------------------------------------
export function drawNorthIndianKundli(canvas, siderealPositions = {}, lagnaSidereal = 0, options = {}) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  // Clean parchment / white background
  ctx.fillStyle = options.bg || '#ffffff';
  ctx.fillRect(0, 0, W, H);

  const pad = 8;
  const x0 = pad, y0 = pad, x1 = W - pad, y1 = H - pad;
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;

  // Frame, diagonals, and inner diamond
  ctx.strokeStyle = options.borderColor || 'rgba(18, 23, 42, 0.55)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);

  ctx.strokeStyle = options.lineColor || 'rgba(18, 23, 42, 0.32)';
  ctx.beginPath();
  ctx.moveTo(x0, y0); ctx.lineTo(x1, y1);
  ctx.moveTo(x1, y0); ctx.lineTo(x0, y1);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(mx, y0); ctx.lineTo(x1, my); ctx.lineTo(mx, y1); ctx.lineTo(x0, my); ctx.closePath();
  ctx.stroke();

  // House label anchors (fractional coordinates)
  const A = (fx, fy) => ({ x: x0 + (x1 - x0) * fx, y: y0 + (y1 - y0) * fy });
  const anchors = {
    1: A(0.50, 0.25), 2: A(0.26, 0.10), 3: A(0.10, 0.26), 4: A(0.25, 0.50),
    5: A(0.10, 0.74), 6: A(0.26, 0.90), 7: A(0.50, 0.75), 8: A(0.74, 0.90),
    9: A(0.90, 0.74), 10: A(0.75, 0.50), 11: A(0.90, 0.26), 12: A(0.74, 0.10)
  };

  const lagnaIdx = Math.floor(normalizeDegrees(lagnaSidereal) / 30);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Rashi numbers in houses
  ctx.font = '10px "Courier New", monospace';
  for (let h = 1; h <= 12; h++) {
    const rashiIdx = (lagnaIdx + (h - 1)) % 12;
    const a = anchors[h];
    ctx.fillStyle = 'rgba(18, 23, 42, 0.45)';
    ctx.fillText(String(rashiIdx + 1), a.x, a.y - 9);
  }

  // Group grahas by house
  const byHouse = {};
  Object.keys(siderealPositions).forEach(g => {
    if (!(g in GRAHA_ABBR)) return;
    const rIdx = Math.floor(normalizeDegrees(siderealPositions[g]) / 30);
    const h = ((rIdx - lagnaIdx + 12) % 12) + 1;
    (byHouse[h] = byHouse[h] || []).push(g);
  });

  // Render items
  ctx.font = 'bold 11px "Courier New", monospace';
  for (let h = 1; h <= 12; h++) {
    const list = byHouse[h] || [];
    const a = anchors[h];
    const items = [];
    if (h === 1) items.push({ txt: 'La', color: '#f97316' });
    list.forEach(g => items.push({ txt: GRAHA_ABBR[g], color: (GRAHA_DEFAULTS[g] || {}).color || '#1e293b' }));

    const perRow = 3;
    items.forEach((it, i) => {
      const row = Math.floor(i / perRow);
      const inRow = Math.min(perRow, items.length - row * perRow);
      const col = i % perRow;
      const spacing = 18;
      const rowX = a.x + (col - (inRow - 1) / 2) * spacing;
      const rowY = a.y + 4 + row * 11;
      ctx.fillStyle = it.color;
      ctx.fillText(it.txt, rowX, rowY);
    });
  }

  if (options.title) {
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText(options.title, mx, my);
  }
}

// --------------------------------------------------------------------------
// 2. SOUTH INDIAN BOX CHART (Fixed Signs Clockwise)
// --------------------------------------------------------------------------
// Layout on a 4x4 grid:
// Row 0: Pisces(11), Aries(0),   Taurus(1),     Gemini(2)
// Row 1: Aquar(10),  [CENTER],   [CENTER],      Cancer(3)
// Row 2: Capr(9),    [CENTER],   [CENTER],      Leo(4)
// Row 3: Sagit(8),   Scorpio(7), Libra(6),      Virgo(5)
const SOUTH_SIGN_GRID = [
  { rashi: 11, col: 0, row: 0, name: 'Pisces' },
  { rashi: 0,  col: 1, row: 0, name: 'Aries' },
  { rashi: 1,  col: 2, row: 0, name: 'Taurus' },
  { rashi: 2,  col: 3, row: 0, name: 'Gemini' },
  { rashi: 3,  col: 3, row: 1, name: 'Cancer' },
  { rashi: 4,  col: 3, row: 2, name: 'Leo' },
  { rashi: 5,  col: 3, row: 3, name: 'Virgo' },
  { rashi: 6,  col: 2, row: 3, name: 'Libra' },
  { rashi: 7,  col: 1, row: 3, name: 'Scorpio' },
  { rashi: 8,  col: 0, row: 3, name: 'Sagittarius' },
  { rashi: 9,  col: 0, row: 2, name: 'Capricorn' },
  { rashi: 10, col: 0, row: 1, name: 'Aquarius' }
];

export function drawSouthIndianKundli(canvas, siderealPositions = {}, lagnaSidereal = 0, options = {}) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  ctx.fillStyle = options.bg || '#ffffff';
  ctx.fillRect(0, 0, W, H);

  const pad = 8;
  const gridW = (W - 2 * pad) / 4;
  const gridH = (H - 2 * pad) / 4;

  ctx.strokeStyle = options.borderColor || 'rgba(18, 23, 42, 0.55)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(pad, pad, W - 2 * pad, H - 2 * pad);

  ctx.strokeStyle = options.lineColor || 'rgba(18, 23, 42, 0.32)';
  // Draw inner perimeter grid lines for the 12 boxes
  for (let i = 1; i < 4; i++) {
    const x = pad + i * gridW;
    ctx.beginPath();
    ctx.moveTo(x, pad); ctx.lineTo(x, pad + gridH);
    ctx.moveTo(x, pad + 3 * gridH); ctx.lineTo(x, H - pad);
    ctx.stroke();

    const y = pad + i * gridH;
    ctx.beginPath();
    ctx.moveTo(pad, y); ctx.lineTo(pad + gridW, y);
    ctx.moveTo(pad + 3 * gridW, y); ctx.lineTo(W - pad, y);
    ctx.stroke();
  }

  // Group grahas by Rashi index (0-11)
  const byRashi = {};
  Object.keys(siderealPositions).forEach(g => {
    if (!(g in GRAHA_ABBR)) return;
    const rIdx = Math.floor(normalizeDegrees(siderealPositions[g]) / 30);
    (byRashi[rIdx] = byRashi[rIdx] || []).push(g);
  });

  const lagnaIdx = Math.floor(normalizeDegrees(lagnaSidereal) / 30);

  // Render each of the 12 sign boxes
  SOUTH_SIGN_GRID.forEach(box => {
    const bx = pad + box.col * gridW;
    const by = pad + box.row * gridH;

    // Sign symbol label in top-left of box
    ctx.fillStyle = 'rgba(18, 23, 42, 0.38)';
    ctx.font = '9px "Courier New", monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`${RASHIS[box.rashi].symbol} ${box.rashi + 1}`, bx + 4, by + 4);

    // If this box holds the Lagna, draw diagonal slash
    if (box.rashi === lagnaIdx) {
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.5)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(bx + gridW, by + gridH);
      ctx.stroke();

      ctx.fillStyle = '#f97316';
      ctx.font = 'bold 10px "Courier New", monospace';
      ctx.fillText('ASC', bx + gridW - 24, by + 4);
    }

    // Grahas in this Rashi
    const list = byRashi[box.rashi] || [];
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 11px "Courier New", monospace';

    const cx = bx + gridW / 2;
    const cy = by + gridH / 2 + 2;

    list.forEach((g, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const gx = cx + (col === 0 ? -10 : 10);
      const gy = cy + (row === 0 ? -6 : 8);
      ctx.fillStyle = (GRAHA_DEFAULTS[g] || {}).color || '#1e293b';
      ctx.fillText(GRAHA_ABBR[g], gx, gy);
    });
  });

  // Center area text
  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(options.title || 'South Indian Chart', W / 2, H / 2);
}

// --------------------------------------------------------------------------
// 3. EAST INDIAN (BENGALI / ODIA) CHART
// --------------------------------------------------------------------------
// Layout: Big square with diamond, fixed signs starting from top Aries
export function drawEastIndianKundli(canvas, siderealPositions = {}, lagnaSidereal = 0, options = {}) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  ctx.fillStyle = options.bg || '#ffffff';
  ctx.fillRect(0, 0, W, H);

  const pad = 8;
  const x0 = pad, y0 = pad, x1 = W - pad, y1 = H - pad;
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;

  // Outer frame & diagonals
  ctx.strokeStyle = options.borderColor || 'rgba(18, 23, 42, 0.55)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);

  ctx.strokeStyle = options.lineColor || 'rgba(18, 23, 42, 0.32)';
  ctx.beginPath();
  ctx.moveTo(x0, y0); ctx.lineTo(x1, y1);
  ctx.moveTo(x1, y0); ctx.lineTo(x0, y1);
  ctx.moveTo(mx, y0); ctx.lineTo(mx, y1);
  ctx.moveTo(x0, my); ctx.lineTo(x1, my);
  ctx.stroke();

  // Anchors for the 12 fixed East Indian sign segments (Aries at top-left center)
  const A = (fx, fy) => ({ x: x0 + (x1 - x0) * fx, y: y0 + (y1 - y0) * fy });
  const eastAnchors = {
    0:  A(0.35, 0.15), // 1. Aries
    1:  A(0.15, 0.35), // 2. Taurus
    2:  A(0.15, 0.65), // 3. Gemini
    3:  A(0.35, 0.85), // 4. Cancer
    4:  A(0.65, 0.85), // 5. Leo
    5:  A(0.85, 0.65), // 6. Virgo
    6:  A(0.85, 0.35), // 7. Libra
    7:  A(0.65, 0.15), // 8. Scorpio
    8:  A(0.12, 0.12), // 9. Sagittarius (Top-left corner)
    9:  A(0.12, 0.88), // 10. Capricorn (Bottom-left corner)
    10: A(0.88, 0.88), // 11. Aquarius (Bottom-right corner)
    11: A(0.88, 0.12)  // 12. Pisces (Top-right corner)
  };

  const byRashi = {};
  Object.keys(siderealPositions).forEach(g => {
    if (!(g in GRAHA_ABBR)) return;
    const rIdx = Math.floor(normalizeDegrees(siderealPositions[g]) / 30);
    (byRashi[rIdx] = byRashi[rIdx] || []).push(g);
  });

  const lagnaIdx = Math.floor(normalizeDegrees(lagnaSidereal) / 30);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Render signs & grahas
  for (let r = 0; r < 12; r++) {
    const a = eastAnchors[r];
    ctx.font = '9px "Courier New", monospace';
    ctx.fillStyle = 'rgba(18, 23, 42, 0.45)';
    ctx.fillText(`${RASHIS[r].symbol} ${r + 1}`, a.x, a.y - 10);

    const list = byRashi[r] || [];
    const items = [];
    if (r === lagnaIdx) items.push({ txt: 'La', color: '#f97316' });
    list.forEach(g => items.push({ txt: GRAHA_ABBR[g], color: (GRAHA_DEFAULTS[g] || {}).color || '#1e293b' }));

    ctx.font = 'bold 10px "Courier New", monospace';
    items.forEach((it, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      ctx.fillStyle = it.color;
      ctx.fillText(it.txt, a.x + (col === 0 ? -7 : 7), a.y + 4 + row * 10);
    });
  }

  if (options.title) {
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText(options.title, mx, my);
  }
}

// --------------------------------------------------------------------------
// Master Dispatcher
// --------------------------------------------------------------------------
export function drawKundliByStyle(style = 'north', canvas, siderealPositions, lagnaSidereal, options = {}) {
  switch ((style || '').toLowerCase()) {
    case 'south':
      return drawSouthIndianKundli(canvas, siderealPositions, lagnaSidereal, options);
    case 'east':
      return drawEastIndianKundli(canvas, siderealPositions, lagnaSidereal, options);
    case 'north':
    default:
      return drawNorthIndianKundli(canvas, siderealPositions, lagnaSidereal, options);
  }
}
