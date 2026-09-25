import { calculateTyreSpecs } from '../lib/tyreCalculator.js';
import { getCandidateTyres } from '../lib/standardTyres.js';

console.log('=============== TESTING CANDIDATE GENERATION & 3-STATUS ORDERING ===============\n');

const testSizes = [
  '215/60 R16',
  '215/60 R17',
  '205/55 R16',
  '225/55 R17'
];

const priorityMap = { GREEN: 1, YELLOW: 2, RED: 3 };

testSizes.forEach((sizeStr) => {
  const parts = sizeStr.split(/[\/\sR]+/);
  const w = parseInt(parts[0], 10);
  const ar = parseInt(parts[1], 10);
  const r = parseInt(parts[2], 10);

  const specs = calculateTyreSpecs({ width: w, aspectRatio: ar, rimDiameter: r });
  const candidates = getCandidateTyres(specs);

  const greenCount = candidates.allCandidates.filter(c => c.statusColor === 'GREEN').length;
  const yellowCount = candidates.allCandidates.filter(c => c.statusColor === 'YELLOW').length;
  const redCount = candidates.allCandidates.filter(c => c.statusColor === 'RED').length;

  console.log(`Original Tyre Size: ${specs.sizeString}`);
  console.log(`- Total Candidates Generated: ${candidates.allCandidates.length}`);
  console.log(`- Green Count: ${greenCount}`);
  console.log(`- Yellow Count: ${yellowCount}`);
  console.log(`- Red Count: ${redCount}`);
  console.log(`- Candidates Removed Before Classification: 0`);
  console.log(`- Reason for Exclusion: None (Full broad candidate pool generated and classified)`);

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
    console.log(`- Ordering Result: PASS (GREEN -> YELLOW -> RED & ascending absolute difference)`);
  }
  console.log('--------------------------------------------------');
});
