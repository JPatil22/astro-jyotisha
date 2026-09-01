import assert from 'node:assert/strict';
import { 
  getSavedCharts, 
  saveChartToVault, 
  deleteChartFromVault, 
  exportVaultJSON, 
  importVaultJSON,
  generatePrintableReportHTML
} from '../modules/vault.js';

console.log('Running Chart Vault & Report tests...');

// Mock localStorage
const mockStorage = {
  store: {},
  getItem(k) { return this.store[k] || null; },
  setItem(k, v) { this.store[k] = String(v); },
  removeItem(k) { delete this.store[k]; }
};

// Test 1: Save Chart to Vault
const chart1 = saveChartToVault({
  name: 'Test Profile',
  dob: '1995-05-15',
  time: '14:30',
  tz: 5.5,
  lat: 28.6139,
  lon: 77.2090
}, mockStorage);

assert.ok(chart1.id, 'Chart must receive an ID');
assert.equal(chart1.name, 'Test Profile');

const charts = getSavedCharts(mockStorage);
assert.equal(charts.length, 1, 'Must have 1 saved chart');

// Test 2: Export & Import Vault
const exported = exportVaultJSON(mockStorage);
assert.ok(exported.includes('Test Profile'), 'Exported JSON must contain chart name');

const result = importVaultJSON(exported, mockStorage);
assert.ok(result.success, 'Import must succeed');
assert.equal(result.count, 1);

// Test 3: Generate Printable HTML Report
const html = generatePrintableReportHTML({
  user: chart1,
  lagnaRashi: { name: 'Leo' },
  moonRashi: { name: 'Taurus' },
  moonNak: { name: 'Rohini', pada: 2 },
  ayanamsa: 23.85,
  positions: { Sun: 30.5, Moon: 45.2 },
  dasha: { currentMaha: { lord: 'Sun' } }
});
assert.ok(html.includes('Vedic Kundli Horoscope Report'), 'HTML report must contain title');
assert.ok(html.includes('Rohini'), 'HTML report must contain Nakshatra name');

// Test 4: Delete Chart
const afterDelete = deleteChartFromVault(chart1.id, mockStorage);
assert.equal(afterDelete.length, 1, 'Should have 1 chart left after deleting the duplicate');

console.log('All Chart Vault tests passed successfully.');
