import assert from 'node:assert/strict';
import { 
  DEFAULT_PALM_POINTS, 
  HAND_PRESETS, 
  HAND_SHAPES, 
  PALM_MOUNTS, 
  analyzePalmLines, 
  estimateLifeLineAge, 
  getFateLineMilestones,
  LINE_METADATA 
} from '../modules/palmistry.js';

console.log('Running Palmistry Engine tests...');

// Test 1: Default Palm Coordinates
assert.ok(DEFAULT_PALM_POINTS.heart.length === 3, 'Heart line must have 3 points');
assert.ok(DEFAULT_PALM_POINTS.head.length === 3, 'Head line must have 3 points');
assert.ok(DEFAULT_PALM_POINTS.life.length === 3, 'Life line must have 3 points');
assert.ok(DEFAULT_PALM_POINTS.fate.length === 3, 'Fate line must have 3 points');
assert.ok(DEFAULT_PALM_POINTS.sun.length === 2, 'Sun line must have 2 points');
assert.ok(DEFAULT_PALM_POINTS.mercury.length === 2, 'Mercury line must have 2 points');
assert.ok(DEFAULT_PALM_POINTS.marriage.length === 2, 'Marriage line must have 2 points');

// Test 2: Line Analysis & Metrics
const analysis = analyzePalmLines(DEFAULT_PALM_POINTS);
assert.ok(analysis.readings.heart, 'Must generate heart reading');
assert.ok(analysis.readings.head, 'Must generate head reading');
assert.ok(analysis.readings.life, 'Must generate life reading');
assert.ok(analysis.readings.fate, 'Must generate fate reading');
assert.ok(analysis.metrics.vitalityScore > 0, 'Vitality score must be positive');
assert.ok(analysis.metrics.intellectScore > 0, 'Intellect score must be positive');
assert.ok(analysis.metrics.emotionalScore > 0, 'Emotional score must be positive');
assert.ok(analysis.metrics.destinyDriveScore > 0, 'Destiny score must be positive');

// Test 3: Life Line Age Milestones
const age40 = estimateLifeLineAge(DEFAULT_PALM_POINTS.life, 40);
assert.ok(age40 && age40.age === 40, 'Must estimate age 40 coordinate');
assert.ok(typeof age40.x === 'number' && typeof age40.y === 'number', 'Age coordinates must be valid numbers');

// Test 4: Fate Line Milestones
const milestones = getFateLineMilestones(DEFAULT_PALM_POINTS.fate);
assert.equal(milestones.length, 5, 'Must calculate 5 key career milestones');
assert.equal(milestones[0].age, 21);
assert.equal(milestones[2].age, 35);

// Test 5: Hand Presets
assert.ok(HAND_PRESETS.Earth, 'Earth preset must exist');
assert.ok(HAND_PRESETS.Water, 'Water preset must exist');
assert.ok(HAND_PRESETS.Fire, 'Fire preset must exist');
assert.ok(HAND_PRESETS.Air, 'Air preset must exist');

const earthAnalysis = analyzePalmLines(HAND_PRESETS.Earth.points);
assert.ok(earthAnalysis.readings.head, 'Earth preset analysis must succeed');

// Test 6: Line Metadata
assert.equal(Object.keys(LINE_METADATA).length, 9, 'Must have metadata for 9 lines');

// Test 7: MediaPipe AI 21-Landmark Projection & Element Classification
import { classifyHandElementFromLandmarks, projectPalmLinesFromLandmarks } from '../modules/palmistry.js';

// Create a realistic synthetic 21-landmark hand array normalized [0,1]
const syntheticLandmarks = [
  { x: 0.5, y: 0.9, z: 0 },   // 0: Wrist
  { x: 0.35, y: 0.75, z: 0 }, // 1: Thumb CMC
  { x: 0.28, y: 0.65, z: 0 }, // 2: Thumb MCP
  { x: 0.22, y: 0.55, z: 0 }, // 3: Thumb IP
  { x: 0.18, y: 0.48, z: 0 }, // 4: Thumb TIP
  { x: 0.38, y: 0.42, z: 0 }, // 5: Index MCP
  { x: 0.36, y: 0.30, z: 0 }, // 6: Index PIP
  { x: 0.35, y: 0.22, z: 0 }, // 7: Index DIP
  { x: 0.34, y: 0.15, z: 0 }, // 8: Index TIP
  { x: 0.50, y: 0.40, z: 0 }, // 9: Middle MCP
  { x: 0.50, y: 0.26, z: 0 }, // 10: Middle PIP
  { x: 0.50, y: 0.17, z: 0 }, // 11: Middle DIP
  { x: 0.50, y: 0.08, z: 0 }, // 12: Middle TIP
  { x: 0.62, y: 0.42, z: 0 }, // 13: Ring MCP
  { x: 0.63, y: 0.29, z: 0 }, // 14: Ring PIP
  { x: 0.64, y: 0.20, z: 0 }, // 15: Ring DIP
  { x: 0.65, y: 0.12, z: 0 }, // 16: Ring TIP
  { x: 0.74, y: 0.48, z: 0 }, // 17: Pinky MCP
  { x: 0.76, y: 0.38, z: 0 }, // 18: Pinky PIP
  { x: 0.77, y: 0.30, z: 0 }, // 19: Pinky DIP
  { x: 0.78, y: 0.24, z: 0 }  // 20: Pinky TIP
];

// Test 8: Pose & Image Quality Validation Guard
import { validatePalmImageAndPose } from '../modules/palmistry.js';

const validCheck = validatePalmImageAndPose(syntheticLandmarks);
assert.equal(validCheck.isValid, true, 'Upright synthetic hand must be valid');

// Synthetic upside-down hand (fingers at bottom, wrist at top)
const upsideDownLandmarks = syntheticLandmarks.map(lm => ({ x: lm.x, y: 1 - lm.y, z: lm.z }));
const upsideDownCheck = validatePalmImageAndPose(upsideDownLandmarks);
assert.equal(upsideDownCheck.isValid, false, 'Upside-down hand must fail validation');
assert.equal(upsideDownCheck.code, 'UPSIDE_DOWN', 'Must identify upside down code');
assert.equal(upsideDownCheck.canAutoRotate, true, 'Must allow auto-rotation');

// Synthetic closed fist (fingers retracted towards MCP)
const fistLandmarks = syntheticLandmarks.map((lm, idx) => {
  if (idx === 12) return { x: lm.x, y: 0.42, z: lm.z }; // Middle tip retracted to MCP
  return lm;
});
const fistCheck = validatePalmImageAndPose(fistLandmarks);
assert.equal(fistCheck.isValid, false, 'Closed fist must fail validation');
assert.equal(fistCheck.code, 'CLOSED_FIST', 'Must identify closed fist code');

console.log('All Palmistry & MediaPipe AI tests passed.');
