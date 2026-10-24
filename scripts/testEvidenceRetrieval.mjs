import assert from 'node:assert/strict';
import { retrieveEvidenceForClaim } from '../lib/evidenceRetriever.ts';

const claim = {
  id: 'claim-encryption',
  code: 'ENC-101',
  category: 'Encryption',
  question: 'Are production database storage volumes encrypted at rest with customer-managed keys?',
};

const sources = [
  {
    id: 'policy-1',
    name: 'policies/security-policy.md',
    type: 'pdf',
    extractedChunks: [
      {
        id: 'policy-chunk-1',
        pageOrFile: 'Page 7',
        section: 'Section 4: Encryption at Rest',
        text: 'Production database storage volumes must be encrypted at rest with customer-managed keys.',
        confidence: 99,
      },
      {
        id: 'policy-chunk-duplicate',
        pageOrFile: 'Page 7',
        section: 'Section 4: Encryption at Rest',
        text: 'Production database storage volumes must be encrypted at rest with customer-managed keys.',
        confidence: 99,
      },
    ],
  },
  {
    id: 'repo-1',
    name: 'github.com/claimtrail/demo',
    type: 'repo',
    repoMetadata: {
      canonicalUrl: 'https://github.com/claimtrail/demo',
      branch: 'main',
      commitSha: 'abcdef1234567890',
    },
    extractedChunks: [
      {
        id: 'repo-chunk-1',
        pageOrFile: 'infra/terraform/database.tf',
        section: 'Terraform database configuration',
        text: 'storage_encrypted = false',
        confidence: 96,
        lineRange: { start: 18, end: 18 },
      },
    ],
  },
];

const mapping = retrieveEvidenceForClaim(claim, sources, { limit: 6 });
assert.equal(mapping.retrievalState, 'mixed');
assert.equal(mapping.evidence.length, 2, 'duplicate policy passages should be removed');
assert.equal(mapping.evidence.some((item) => item.pageNumber === 7), true);
assert.equal(mapping.evidence.some((item) => item.filePath === 'infra/terraform/database.tf'), true);
assert.equal(mapping.evidence.some((item) => item.lineRange?.start === 18), true);
assert.equal(mapping.evidence.some((item) => item.commitSha === 'abcdef1234567890'), true);
assert.equal(mapping.limitations.some((item) => item.includes('not proof')), true);

const missing = retrieveEvidenceForClaim(
  { ...claim, id: 'claim-missing', code: 'MISSING-1', category: 'Facilities', question: 'Is physical visitor escorting documented for all facilities?' },
  sources,
);
assert.equal(missing.retrievalState, 'insufficient');
assert.equal(missing.evidence.length, 0);

console.log('Evidence retrieval tests passed.');