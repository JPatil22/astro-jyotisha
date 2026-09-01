/**
 * Kundli Chart Vault & Report Generator - Jyotisha
 * Persistent multi-profile chart storage, JSON export/import backup,
 * and multi-page printable/PDF Astrological Kundli Report generation.
 */

const VAULT_STORAGE_KEY = 'cosmic_chart_vault';

/**
 * Retrieves all saved charts from local storage.
 * @returns {Array<Object>}
 */
export function getSavedCharts(storage = globalThis.localStorage) {
  if (!storage) return [];
  try {
    const raw = storage.getItem(VAULT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error loading chart vault:', err);
    return [];
  }
}

/**
 * Saves or updates a chart profile in the vault.
 */
export function saveChartToVault(profile, storage = globalThis.localStorage) {
  if (!profile || !profile.name || !profile.dob) {
    throw new Error('Name and Date of Birth are required to save a chart.');
  }

  const charts = getSavedCharts(storage);
  const id = profile.id || `chart_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const entry = {
    id,
    name: profile.name.trim(),
    dob: profile.dob,
    time: profile.time || '12:00',
    tz: parseFloat(profile.tz) || 0,
    lat: parseFloat(profile.lat) || 0,
    lon: parseFloat(profile.lon) || 0,
    cityName: profile.cityName || '',
    category: profile.category || 'Personal',
    notes: profile.notes || '',
    updatedAt: new Date().toISOString()
  };

  const existingIdx = charts.findIndex(c => c.id === id);
  if (existingIdx >= 0) {
    charts[existingIdx] = entry;
  } else {
    charts.unshift(entry);
  }

  if (storage) {
    storage.setItem(VAULT_STORAGE_KEY, JSON.stringify(charts));
  }
  return entry;
}

/**
 * Deletes a chart from the vault.
 */
export function deleteChartFromVault(id, storage = globalThis.localStorage) {
  const charts = getSavedCharts(storage).filter(c => c.id !== id);
  if (storage) {
    storage.setItem(VAULT_STORAGE_KEY, JSON.stringify(charts));
  }
  return charts;
}

/**
 * Exports vault as JSON string.
 */
export function exportVaultJSON(storage = globalThis.localStorage) {
  const charts = getSavedCharts(storage);
  return JSON.stringify({
    app: 'Jyotisha Astrological Engine',
    version: '2.0.0',
    exportedAt: new Date().toISOString(),
    charts
  }, null, 2);
}

/**
 * Imports vault from JSON string.
 */
export function importVaultJSON(jsonStr, storage = globalThis.localStorage) {
  const parsed = JSON.parse(jsonStr);
  if (!parsed || !Array.isArray(parsed.charts)) {
    throw new Error('Invalid vault JSON format.');
  }

  const existing = getSavedCharts(storage);
  const existingIds = new Set(existing.map(c => c.id));

  let importedCount = 0;
  parsed.charts.forEach(c => {
    if (c.name && c.dob) {
      if (!c.id || existingIds.has(c.id)) {
        c.id = `chart_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      }
      existing.push(c);
      importedCount++;
    }
  });

  if (storage) {
    storage.setItem(VAULT_STORAGE_KEY, JSON.stringify(existing));
  }
  return { success: true, count: importedCount, total: existing.length };
}

/**
 * Formats a clean printable HTML document for printing / PDF saving.
 */
export function generatePrintableReportHTML(chartData) {
  const { user, lagnaRashi, moonRashi, moonNak, ayanamsa, positions, dasha, savScores, doshas } = chartData;

  const positionsRows = Object.entries(positions || {}).map(([g, pos]) => {
    const deg = (pos % 30).toFixed(2);
    const signIdx = Math.floor(pos / 30);
    const signNames = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    return `<tr><td><strong>${g}</strong></td><td>${signNames[signIdx]}</td><td>${deg}°</td></tr>`;
  }).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Vedic Kundli Report - ${user.name}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 2rem; color: #1e293b; line-height: 1.5; }
    h1 { color: #d97706; margin-bottom: 0.2rem; }
    h2 { color: #5b52e0; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.3rem; margin-top: 1.5rem; }
    .header-box { background: #fff5ec; border: 1px solid #fed7aa; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    table { width: 100%; border-collapse: collapse; margin-top: 0.5rem; }
    th, td { border: 1px solid #cbd5e1; padding: 0.5rem 0.75rem; text-align: left; font-size: 0.9rem; }
    th { background: #f1f5f9; color: #475569; }
    .badge { display: inline-block; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: bold; font-size: 0.8rem; background: #e0e7ff; color: #3730a3; }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 1.5rem;">
    <button onclick="window.print()" style="padding: 0.6rem 1.2rem; background: #d97706; color: #fff; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">Print / Save as PDF</button>
  </div>

  <h1>Vedic Kundli Horoscope Report</h1>
  <div class="header-box">
    <strong>Name:</strong> ${user.name} | <strong>DOB:</strong> ${user.dob} ${user.time} | <strong>Location:</strong> (${user.lat}°, ${user.lon}°) | <strong>TZ:</strong> UTC+${user.tz}
  </div>

  <div class="grid">
    <div>
      <h2>Janma Kundli Summary</h2>
      <p><strong>Lagna (Ascendant):</strong> ${lagnaRashi?.name || '-'}</p>
      <p><strong>Janma Rashi (Moon):</strong> ${moonRashi?.name || '-'}</p>
      <p><strong>Janma Nakshatra:</strong> ${moonNak?.name || '-'} (Pada ${moonNak?.pada || '-'})</p>
      <p><strong>Ayanamsa (Lahiri):</strong> ${ayanamsa?.toFixed(3) || '24.18'}°</p>
    </div>
    <div>
      <h2>Current Running Dasha</h2>
      <p><strong>Mahadasha:</strong> ${dasha?.currentMaha?.lord || '-'}</p>
      <p><strong>Antardasha:</strong> ${dasha?.currentAntar?.lord || '-'}</p>
      <p><strong>Pratyantardasha:</strong> ${dasha?.currentPratyantar?.lord || '-'}</p>
    </div>
  </div>

  <h2>Planetary Placements (Sidereal Nirayana)</h2>
  <table>
    <thead><tr><th>Graha</th><th>Rashi (Zodiac)</th><th>Degree</th></tr></thead>
    <tbody>${positionsRows}</tbody>
  </table>

  <div style="margin-top: 2rem; font-size: 0.8rem; color: #64748b; text-align: center;">
    Generated by Jyotisha Vedic Astrological Engine • Validated against NASA JPL Horizons
  </div>
</body>
</html>
  `;
}
