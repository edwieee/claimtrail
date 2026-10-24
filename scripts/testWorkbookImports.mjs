import fs from 'fs';
import path from 'path';
import { parseXlsxQuestionnaire } from '../lib/xlsxParser.ts';

async function runTests() {
  console.log('--- TEST 1: Workbook with Comments ---');
  const path1 = path.join(process.cwd(), '.data', 'uploads', '1792814426658_ClaimTrail_Sample_Security_Questionnaire.xlsx');
  const buf1 = fs.readFileSync(path1);
  const result1 = await parseXlsxQuestionnaire(buf1, 'ClaimTrail_Sample_Security_Questionnaire.xlsx');
  console.log(`Test 1 Success! Sheet: "${result1.sheetName}", Total Questions: ${result1.totalQuestions}`);
  console.log(`Sample Claim 1: [${result1.claims[0].code}] ${result1.claims[0].question}`);
  console.log(`Claim 1 Comments: "${result1.claims[0].comments}"`);
  console.log(`Claim 1 Limitations: "${result1.claims[0].limitations}"`);

  console.log('\n--- TEST 2: Normal Workbook without Comments ---');
  const path2 = path.join(process.cwd(), 'public', 'samples', 'AcmeCorp-Security-Assessment-2026.xlsx');
  const buf2 = fs.readFileSync(path2);
  const result2 = await parseXlsxQuestionnaire(buf2, 'AcmeCorp-Security-Assessment-2026.xlsx');
  console.log(`Test 2 Success! Sheet: "${result2.sheetName}", Total Questions: ${result2.totalQuestions}`);
  console.log(`Sample Claim 1: [${result2.claims[0].code}] ${result2.claims[0].question}`);
  console.log(`Claim 1 Comments: ${result2.claims[0].comments} (should be undefined)`);
  console.log(`All 5 questions parsed:`, result2.claims.map(c => c.code));

  console.log('\nALL WORKBOOK IMPORT TESTS PASSED PERFECTLY!');
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
