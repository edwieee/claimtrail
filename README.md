ClaimTrail
Evidence-grounded security questionnaire review for B2B software teams.

Open the live prototype

ClaimTrail is a prototype designed to help software companies answer customer security questionnaires more efficiently and with better traceability. Instead of relying on manually assembled answers or unsupported claims, ClaimTrail connects questionnaire responses to available evidence, checks selected security requirements, highlights possible policy-versus-implementation discrepancies, and gives reviewers a place to verify answers before they are exported.
Project context: Built as a prototype for AIBoomi Startup Weekend. The hosted application is intended to demonstrate the product concept and workflow; it should not be treated as a production security assessment or a guarantee of compliance.

Table of contents
- The problem
- Our idea
- How ClaimTrail works
- Key capabilities
- What makes the approach useful
- Technology stack and tools
- Product demo
- Typical user workflow
- Responsible use and limitations
- Current prototype status
- Running the project locally
- Team and project details
The problem
B2B software companies are frequently asked to complete security questionnaires before a customer will approve a product or vendor. These questionnaires can contain dozens or hundreds of questions about encryption, access control, authentication, logging, data retention, backups, incident response, and other security practices.

Preparing reliable answers is difficult because the supporting information is often spread across different places:
- Security policies and internal documentation
- Application code and configuration files
- Existing security reviews and questionnaire spreadsheets
- Engineering or security-team knowledge that may not be documented consistently
This creates several problems. Teams spend time searching for evidence and rewriting similar answers; reviewers may struggle to establish whether a statement is supported; policy documents may describe a control that is not reflected in the implementation; and confident-sounding answers can be submitted without enough proof.

The challenge is not just to write an answer quickly. It is to understand what evidence supports the answer, where that evidence came from, and what still needs a human decision.
Our idea
ClaimTrail aims to make the security questionnaire process more traceable and reviewable. It brings questionnaire questions and available evidence into one workflow, uses deterministic checks for selected security conditions, and can use AI to draft responses grounded in the evidence provided to it.

The central idea is an evidence trail:

Question → Evidence → Check → Draft Answer → Human Review

Each step should make it easier for a reviewer to understand why an answer was suggested and whether it is safe to approve. If evidence is missing, ambiguous, or inconsistent, the system should make that limitation visible instead of inventing a confident answer.
How ClaimTrail works
1. Import a questionnaire
A user starts with a customer security questionnaire, typically supplied as an Excel (.xlsx) workbook. ClaimTrail parses the questions and organizes them for review.
2. Connect evidence sources
The workflow is designed to work with evidence such as:
- Security policies: PDF documents containing written policies and control descriptions.
- Code repositories: Public GitHub repositories and relevant code or configuration files that may help show how a control is implemented.
- Questionnaire files: The original workbook, which remains the target for the final export.
The usefulness of any conclusion depends on the quality, recency, and scope of the evidence provided.
3. Map questions to relevant evidence
ClaimTrail retrieves potentially relevant passages or code/configuration snippets for questionnaire questions. A useful evidence record should include a source identifier and enough location information—such as a document page, file path, or line range—to help a reviewer check it.

The goal is not merely to find similar wording. It is to give the reviewer a clear path back to the source and distinguish supporting evidence from conflicting or insufficient evidence.
4. Run deterministic checks
For supported controls, explicit rules can evaluate evidence against a defined condition. Examples of areas that may be checked include encryption configuration, tenant isolation, audit logging, data retention, backup and recovery practices, and restrictions on AI tools or permissions.

A check result is an indicator for review, not proof that a whole company or product is secure. Repository evidence may not reflect the deployed production environment, and a rule can only evaluate the facts it has access to.
5. Draft evidence-grounded answers
AI can help turn the supplied evidence into a clear questionnaire response. The intended approach is to constrain drafting to the evidence and return source references alongside the proposed answer.

When supporting evidence is absent or conflicting, the safer result is to flag the question for review or request more information—not to manufacture facts. Drafts should remain distinguishable from answers that have been approved by a human reviewer.
6. Identify discrepancies and review findings
ClaimTrail brings attention to possible mismatches between written policy, implementation evidence, checks, and drafted answers. For example, a policy may state that a control is required while available configuration evidence suggests that the control may not be enabled.

Reviewers can investigate the source material, record a decision, and identify items that need additional evidence. A discrepancy is a signal to investigate; it is not automatically proof of a production vulnerability.
7. Review and export
The intended final stage is a human review workflow for editing, approving, rejecting, or resolving proposed answers. Where supported, the answers can be exported back into the questionnaire workbook while preserving the original structure and formatting as far as possible.

Only responses that have been explicitly approved should be treated as ready for submission. Exported results should be checked before they are sent to a customer.
Key capabilities
Capability	Purpose
Questionnaire import	Bring security questions into a structured review workflow.
Evidence source management	Organize relevant policy documents and repository material.
Evidence mapping	Link questions to source material that reviewers can inspect.
Deterministic security checks	Evaluate selected controls using explicit rules rather than relying only on generated text.
AI-assisted answer drafting	Produce editable response drafts grounded in the supplied evidence.
Policy-versus-implementation review	Flag possible inconsistencies that need investigation.
Human review workflow	Keep people responsible for final decisions and approvals.
Questionnaire export	Prepare reviewed answers for return to the original workbook, where supported.


The precise availability of individual capabilities can change as the prototype evolves. The hosted demo is the best place to inspect the current interface.
What makes the approach useful
ClaimTrail focuses on traceability and review, not just automated text generation. Its intended value comes from combining several steps in one process:
- Evidence first: responses should be grounded in available source material.
- Visible uncertainty: missing or contradictory evidence should be surfaced rather than hidden.
- Checks alongside AI: deterministic rules can provide repeatable signals for selected requirements, while AI helps with wording and summarization.
- Human approval: people remain responsible for interpreting evidence and approving customer-facing statements.
- Reviewable source trail: reviewers should be able to navigate from a question to the evidence that informed a proposed response.
Security-questionnaire automation is an existing product category, so ClaimTrail does not claim that AI-generated answers alone are unique. The project’s intended differentiation is making evidence, checks, discrepancies, and approval decisions easier to inspect together.
Technology stack and tools
The project uses a web-application approach. The following technologies are part of the project’s implementation plan/current stack; confirm the repository’s dependency files before treating this list as a complete inventory.
Technology / tool	Intended role
Next.js	Web application framework and application routes.
React	Component-based user interface.
TypeScript	Type-safe application code and data models.
Tailwind CSS	Styling and responsive interface layout.
ExcelJS	Reading and writing Excel questionnaire workbooks.
PDF text extraction	Extracting text from policy documents so it can be indexed and reviewed.
GitHub REST API / Octokit	Accessing permitted repository content for code and configuration evidence.
OpenAI API	AI-assisted answer drafting or explanation when configured.
Vercel	Hosting the live prototype.
Git and GitHub	Version control and source-code collaboration.


Why use both deterministic checks and AI?
Deterministic checks are useful when a requirement can be represented as a specific, repeatable condition. AI is useful for drafting readable responses from relevant evidence and explaining relationships between sources. Combining them can reduce repetitive work while keeping the reasoning and limitations available for human review.

Neither approach can independently verify every real-world security practice. Results still depend on source quality, coverage, configuration, and reviewer judgment.
Product demo
- Live hosted prototype: https://claimtraill.vercel.app/
- Demo video: Add a public video link here if one is available.
- Pitch deck / presentation: Add a presentation link here if one is available.
The live prototype presents an assessment dashboard with areas for questionnaire review, evidence sources, findings, and exports. Some visible names, counts, assessment details, or records may be illustrative demo data rather than measurements from a real customer environment. Do not treat displayed example data as independent proof that a security control is operating in production.
Typical user workflow
1. Open ClaimTrail and start or load an assessment.
2. Import the customer’s questionnaire workbook.
3. Add the available policies and repository evidence.
4. Review which sources were parsed and which questions have relevant evidence.
5. Inspect deterministic check results and any flagged discrepancies.
6. Review AI-generated drafts, follow their source references, and edit as needed.
7. Mark unresolved questions for additional evidence or manual decision.
8. Approve only the answers that are adequately supported.
9. Export the reviewed workbook, then verify it before sending it to the customer.
Responsible use and limitations
ClaimTrail is an assistance and review tool. It is not a security certification, legal opinion, audit report, or guarantee of compliance.
- Evidence is not exhaustive: a missing source does not prove that a control is absent.
- Policy is not implementation: written policy may describe an intended control rather than its actual operation.
- Repository code is not production proof: code and configuration files do not necessarily show the deployed environment or operational processes.
- AI can be wrong: generated drafts may omit context, misinterpret evidence, or produce mistakes. Review source references and wording before approval.
- Human review is required: do not submit customer-facing security claims without checking that they are accurate and appropriately scoped.
- Sensitive data needs care: use only data you are authorized to process. Do not upload secrets, credentials, customer data, or confidential material unless the deployment and data-handling arrangements have been reviewed and approved for that use.
- Credentials must stay server-side: API keys should be stored in environment variables, never committed to source control or exposed in client-side code.
Current prototype status
ClaimTrail is being developed as a startup-weekend prototype. Its aim is to demonstrate a more traceable approach to security questionnaire work. Before using it for real customer assessments, the team should verify end-to-end behavior, data persistence, authentication and authorization, input validation, error handling, API-key handling, export correctness, and the security of any connected services.

A feature shown in the interface should not automatically be interpreted as production-ready or as proof that the underlying workflow has passed comprehensive testing.
Running the project locally
These are general steps for a Next.js application. Confirm that they match the current repository before relying on them.
Prerequisites
- Node.js and npm, using versions supported by the repository.
- Access to the project source code.
- An OpenAI API key if AI-powered drafting is enabled in the local build.
Setup
# 1. Clone the repository
# Replace <repository-url> with the actual GitHub repository URL
git clone <repository-url>
cd <repository-folder>

# 2. Install dependencies
npm install

# 3. Create a local environment file named .env.local
If the application uses OpenAI-powered drafting, add the key to .env.local on your local machine:
OPENAI_API_KEY=your_actual_api_key_here
Keep .env.local private. Do not commit it to Git, paste the key into frontend code, or expose it through a NEXT_PUBLIC_ environment variable. API usage may require separate billing and account configuration.

Start the development server using the script configured in package.json, commonly:
npm run dev
Then open the local URL printed by Next.js, commonly http://localhost:3000.
Team and project details
- Event: AIBoomi Startup Weekend
- Project: ClaimTrail
- Live demo: https://claimtraill.vercel.app/
- Team members: Add names and roles here.
- Repository: Add the GitHub repository URL here.
- Demo video: Add the video URL here, if available.
- Presentation: Add the pitch deck URL here, if available.
Built as a prototype exploring how evidence traceability, repeatable checks, AI-assisted drafting, and human review can work together to improve the security-questionnaire process.
