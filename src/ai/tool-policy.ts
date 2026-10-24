/**
 * Application-level allowlist for tools that an AI assistant may request.
 * This demo does not execute any tools.
 */

export const APPROVED_TOOL_NAMES = [
  "search_knowledge_base",
  "draft_questionnaire_answer",
  "retrieve_evidence_snippet",
] as const;

export type ApprovedToolName = (typeof APPROVED_TOOL_NAMES)[number];

export function isApprovedToolName(name: string): name is ApprovedToolName {
  return (APPROVED_TOOL_NAMES as readonly string[]).includes(name);
}

export function authorizeToolRequest(name: string): {
  allowed: boolean;
  reason: "allowlisted" | "not_allowlisted";
} {
  if (isApprovedToolName(name)) {
    return { allowed: true, reason: "allowlisted" };
  }

  return { allowed: false, reason: "not_allowlisted" };
}
