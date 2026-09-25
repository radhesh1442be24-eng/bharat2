import { calculateTyreSpecs } from '../lib/tyreCalculator.js';
import { getCandidateTyres } from '../lib/standardTyres.js';

console.log('=============== TESTING CORRECTED RESULT ORDERING (GREEN -> YELLOW -> RED) ===============');

const specs = calculateTyreSpecs({ width: 215, aspectRatio: 60, rimDiameter: 16 });
const candidates = getCandidateTyres(specs);

console.log(`Test Size: ${specs.sizeString}`);
console.log(`Total Candidates: ${candidates.allCandidates.length}`);

// Priority map: 1. GREEN, 2. YELLOW, 3. RED
const priorityMap = { GREEN: 1, YELLOW: 2, RED: 3 };

let orderValid = true;
let prevAbsDiff = -1;
let currentGroup = 1;

candidates.allCandidates.forEach((item, i) => {
  const p = priorityMap[item.statusColor];
  if (p < currentGroup) {
    console.error(`[ERROR] Ordering violation at row ${i}: ${item.sizeString} color ${item.statusColor} appeared after group ${currentGroup}`);
    orderValid = false;
  }
  if (p > currentGroup) {
    currentGroup = p;
    prevAbsDiff = -1; // reset within group
  }
  if (item.absDiffPct < prevAbsDiff - 0.0001) {
    console.error(`[ERROR] Within-group sorting violation at row ${i}: ${item.sizeString} absDiff ${item.absDiffPct}% < prev ${prevAbsDiff}%`);
    orderValid = false;
  }
  prevAbsDiff = item.absDiffPct;
});

if (orderValid) {
  console.log('[PASS] Result ordering is 100% compliant with priority (GREEN -> YELLOW -> RED) & ascending absolute difference!');
}

console.log('\nFirst 20 Candidates Output Sample:');
candidates.allCandidates.slice(0, 20).forEach((c, idx) => {
  console.log(`${idx + 1}. Size: ${c.sizeString.padEnd(12)} | Color: ${c.statusColor.padEnd(7)} | Diff: ${c.differencePct > 0 ? '+' : ''}${c.differencePct.toFixed(1)}% (abs: ${c.absDiffPct.toFixed(1)}%)`);
});
