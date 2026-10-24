import assert from 'node:assert/strict';
import { DraftingError, generateEvidenceGroundedDraft } from '../lib/aiDrafting.ts';

const claim = {
  id: 'claim-ai-1',
  code: 'ENC-1',
  category: 'Encryption',
  question: 'Are database volumes encrypted at rest?',
};

const evidence = {
  id: 'evidence-policy-1',
  sourceId: 'policy-1',
  sourceType: 'pdf',
  sourceName: 'security-policy.pdf',
  sourceUrlOrFilename: 'security-policy.pdf',
  pageNumber: 7,
  section: 'Encryption at Rest',
  snippet: 'Database volumes must be encrypted at rest.',
  score: 0.8,
  explanation: 'Matched terms: encrypt, database.',
  signal: 'supporting',
  limitations: ['Retrieval relevance is not proof of deployed security posture.'],
};

const mapping = {
  claimId: claim.id,
  claimCode: claim.code,
  question: claim.question,
  retrievalState: 'supporting',
  evidence: [evidence],
  limitations: [],
  retrievedAt: new Date().toISOString(),
};

function fakeClient(payload, capture) {
  return {
    chat: {
      completions: {
        async create(request) {
          capture.request = request;
          return { choices: [{ message: { content: JSON.stringify(payload) } }] };
        },
      },
    },
  };
}

const capture = {};
const supported = await generateEvidenceGroundedDraft(
  claim,
  mapping,
  [],
  {
    client: fakeClient({
      questionId: claim.id,
      draftAnswer: 'The policy requires database encryption at rest.',
      evidenceStatus: 'supported',
      reviewRequired: false,
      reasoningSummary: 'The supplied policy passage states the requirement.',
      limitations: [],
      citationIds: [evidence.id],
    }, capture),
  },
);
assert.equal(supported.evidenceStatus, 'supported');
assert.equal(supported.reviewRequired, true);
assert.equal(supported.evidenceCitations[0].evidenceId, evidence.id);
assert.equal(supported.evidenceCitations[0].pageNumber, 7);
assert.match(capture.request.messages[0].content, /untrusted data/i);

const conflicting = await generateEvidenceGroundedDraft(
  claim,
  { ...mapping, retrievalState: 'mixed' },
  [{
    id: 'finding-1', ruleId: 'CTL-ENCRYPTION-AT-REST', ruleName: 'Encryption conflict', relatedClaimIds: [claim.id], relatedQuestionCodes: [claim.code], category: 'Encryption', status: 'finding', findingType: 'policy_config_conflict', priority: 'high', title: 'Conflict', explanation: 'Policy and Terraform disagree.', trigger: 'Explicit false setting.', recommendedAction: 'Verify deployment.', evidence: [], checkedAt: new Date().toISOString(),
  }],
  {
    client: fakeClient({
      questionId: claim.id,
      draftAnswer: 'The available sources conflict and require review.',
      evidenceStatus: 'supported',
      reviewRequired: false,
      reasoningSummary: 'The model attempted a positive status.',
      limitations: [],
      citationIds: [evidence.id],
    }, {}),
  },
);
assert.equal(conflicting.evidenceStatus, 'conflicting_evidence');
assert.equal(conflicting.reviewRequired, true);

await assert.rejects(
  generateEvidenceGroundedDraft(
    claim,
    mapping,
    [],
    { client: fakeClient({ questionId: claim.id, draftAnswer: 'Unsupported', evidenceStatus: 'supported', reviewRequired: false, reasoningSummary: 'Bad citation', limitations: [], citationIds: ['fabricated-id'] }, {}) },
  ),
  (error) => error instanceof DraftingError && error.code === 'invalid_citation',
);

const previousKey = process.env.OPENAI_API_KEY;
delete process.env.OPENAI_API_KEY;
await assert.rejects(
  generateEvidenceGroundedDraft(claim, mapping, []),
  (error) => error instanceof DraftingError && error.code === 'missing_api_key' && !error.message.includes('sk-'),
);
if (previousKey === undefined) delete process.env.OPENAI_API_KEY;
else process.env.OPENAI_API_KEY = previousKey;

console.log('AI drafting tests passed.');
