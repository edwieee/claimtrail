import { describe, expect, it } from 'vitest';
import ExcelJS from 'exceljs';
import { createEmptyState } from '../lib/store';
import { parseXlsxQuestionnaire } from '../lib/xlsxParser';

describe('empty workspace and real questionnaire import', () => {
  it('starts without fabricated assessment records', () => {
    const state = createEmptyState();
    expect(state.assessmentId).toBe('');
    expect(state.assessmentName).toBe('');
    expect(state.claims).toEqual([]);
    expect(state.sources).toEqual([]);
    expect(state.conflicts).toEqual([]);
    expect(state.findings).toEqual([]);
    expect(state.exportHistory).toEqual([]);
  });

  it('imports workbook questions without inventing answers or approvals', async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Questionnaire');
    sheet.addRow(['ID', 'Category', 'Question', 'Answer']);
    sheet.addRow(['Q-1', 'Access Control', 'Is multi-factor authentication required for administrators?', '']);
    sheet.addRow(['Q-2', 'Encryption', 'Is customer data encrypted at rest?', 'Existing vendor response']);
    const buffer = Buffer.from(await workbook.xlsx.writeBuffer());

    const result = await parseXlsxQuestionnaire(buffer, 'customer-questionnaire.xlsx');
    expect(result.totalQuestions).toBe(2);
    expect(result.claims[0].vendorDraftAnswer).toBe('');
    expect(result.claims[0].reviewStatus).toBe('draft');
    expect(result.claims[0].status).toBe('amber');
    expect(result.claims[1].vendorDraftAnswer).toBe('Existing vendor response');
    expect(result.claims[1].reviewStatus).toBe('draft');
    expect(result.claims[1].status).toBe('amber');
    expect(result.claims.every((claim) => !claim.approval && claim.signalsCount.supporting === 0)).toBe(true);
  });
});
