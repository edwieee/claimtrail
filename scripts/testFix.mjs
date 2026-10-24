import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

// Inspect what happens when loading .data/uploads/1792814426658_ClaimTrail_Sample_Security_Questionnaire.xlsx
async function test() {
  const filePath = path.join(process.cwd(), '.data', 'uploads', '1792814426658_ClaimTrail_Sample_Security_Questionnaire.xlsx');
  const buffer = fs.readFileSync(filePath);

  console.log('Testing raw ExcelJS load...');
  try {
    const wbRaw = new ExcelJS.Workbook();
    await wbRaw.xlsx.load(buffer);
    console.log('Raw load succeeded!');
  } catch (err) {
    console.log('Raw load failed as expected:', err.message);
  }
}

test();
