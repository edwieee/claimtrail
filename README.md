# ClaimTrail

**Evidence-Grounded Security Questionnaire Review for B2B Software Teams**

🔗 **Live Demo:** https://claimtraill.vercel.app/

## 1. Project Overview

ClaimTrail is an AI-assisted security questionnaire review platform designed to help B2B software companies answer customer security questionnaires more efficiently and accurately.

When a business wants to sell its software to another company, customers often ask detailed questions about security practices, including encryption, authentication, access control, data retention, audit logging, backups, and incident response.

Answering these questionnaires manually takes time, requires searching through multiple documents and code repositories, and can lead to unsupported or inaccurate security claims.

**ClaimTrail addresses this problem by connecting questionnaire answers to relevant evidence, checking selected security requirements, identifying possible inconsistencies, and helping teams review answers before submitting them.**

Instead of treating AI-generated text as automatically correct, ClaimTrail focuses on making the evidence behind each proposed answer easier to inspect.

## 2. The Problem We Are Solving

Security questionnaires are an important part of the B2B sales process. However, completing them can be challenging for startups and software teams.

Common problems include:

- **Time-consuming work:** Teams repeatedly answer similar security questions for different customers.
- **Scattered evidence:** Relevant information is spread across security policies, PDF documents, code repositories, and configuration files.
- **Unsupported claims:** Teams may provide confident answers without sufficient evidence.
- **Policy and implementation gaps:** A written security policy may describe a control that is not clearly reflected in the available implementation evidence.
- **Difficult reviews:** Security reviewers need to verify where an answer came from and whether it accurately represents the available evidence.

The challenge is not simply to generate answers faster. It is to help teams understand **what supports an answer, where the evidence came from, and what still needs verification**.

## 3. Our Idea and Approach

ClaimTrail brings the key stages of security questionnaire review into one workflow.

Its central concept is:

**Question → Evidence → Security Check → Draft Answer → Human Review**

For each questionnaire question, the system aims to find relevant source material, evaluate supported requirements using explicit rules, generate a cautious answer draft when AI is available, and highlight possible issues for human investigation.

When the evidence is missing, incomplete, or contradictory, the system should flag the uncertainty rather than inventing information.

### What makes the approach useful?

- **Evidence-first answering:** Proposed answers should be grounded in available source material.
- **Traceability:** Reviewers should be able to inspect the sources behind a suggested answer.
- **Deterministic checks:** Explicit rules can evaluate selected security conditions consistently.
- **Discrepancy detection:** Potential differences between written policies and implementation evidence can be highlighted.
- **Human approval:** Final responsibility for customer-facing security claims stays with the reviewer.

Security questionnaire automation is already an existing product category. ClaimTrail's intended differentiation is to bring evidence, rule-based checks, discrepancy review, and answer approval together in a transparent workflow.

## 4. How ClaimTrail Works

### Step 1: Import a Security Questionnaire

Users start with a customer security questionnaire, typically provided as an Excel (`.xlsx`) workbook.

The application parses the questionnaire and organizes its questions for assessment and review.

### Step 2: Collect Evidence

The intended evidence sources include:

- **Security policies:** PDF documents describing security practices and requirements.
- **GitHub repositories:** Relevant source code and configuration files that can provide implementation evidence.
- **Questionnaire workbooks:** The original Excel file used for the final response.

The usefulness of any assessment depends on the completeness, quality, and relevance of the supplied evidence.

### Step 3: Map Questions to Evidence

ClaimTrail retrieves potentially relevant passages, code snippets, and configuration details for individual questionnaire questions.

Evidence should include source information, such as a document page, repository file path, or line range, where available.

This allows reviewers to investigate the source instead of relying only on an automatically generated answer.

### Step 4: Run Deterministic Security Checks

For selected security requirements, explicit rules evaluate available evidence against defined conditions.

Example areas include:

- Encryption at rest
- Authentication and SAML replay protection
- Tenant isolation
- Audit logging
- Data retention and deletion
- Backup and recovery
- AI tool permissions

These checks provide review signals. They do not independently prove that a company or its deployed production environment is secure.

### Step 5: Generate AI-Assisted Answer Drafts

When the OpenAI API is configured, AI can help transform relevant evidence into readable questionnaire answer drafts.

The intended approach is to ground each draft in the evidence supplied to the model and retain references to the supporting sources.

If evidence is missing or conflicting, the system should indicate the limitation and request review instead of fabricating a security claim.

### Step 6: Identify Possible Discrepancies

ClaimTrail helps reviewers investigate possible mismatches between written policies, implementation evidence, security-check results, and drafted answers.

For example, a policy may state that encryption is required while an available configuration file suggests encryption may be disabled.

This is a reason to investigate the configuration and its scope, not automatic proof of a production vulnerability.

### Step 7: Review and Export Answers

The intended review workflow allows users to inspect and edit proposed answers, resolve findings, and approve responses where supported.

The final stage is to export reviewed answers back into the questionnaire workbook while preserving the original workbook's structure and formatting as far as the implementation allows.

Exported answers should be checked before they are submitted to a customer.

## 5. Key Features

| Feature | Purpose |
|---|---|
| Questionnaire import | Organizes customer security questions from Excel workbooks. |
| Evidence source management | Makes relevant policy documents and repository material available for review. |
| Evidence mapping | Connects questions to potentially relevant source material. |
| Deterministic security checks | Evaluates selected requirements through explicit rules. |
| AI-assisted answer drafting | Helps prepare readable responses grounded in available evidence. |
| Policy-versus-implementation analysis | Highlights possible inconsistencies that need investigation. |
| Human review workflow | Keeps people involved in editing, decision-making, and approval. |
| Excel export | Helps prepare reviewed responses for the original questionnaire, where supported. |

The live application should be used to verify which features are currently available in the hosted prototype.

## 6. Technology Stack and Tools

ClaimTrail uses a modern web-application approach. The table below describes the project's intended/current technology stack; the exact implementation should be verified against the repository's dependency files.

| Technology or Tool | Purpose |
|---|---|
| Next.js | Web application framework and routing. |
| React | Component-based user interface. |
| TypeScript | Type-safe application logic and data models. |
| Tailwind CSS | Responsive interface styling. |
| ExcelJS | Reading and writing Excel questionnaire workbooks. |
| PDF text extraction | Extracting text from policy documents for review and retrieval. |
| GitHub REST API / Octokit | Accessing permitted GitHub repository content. |
| OpenAI API | AI-assisted answer drafting and explanations when configured. |
| Vercel | Hosting the live prototype. |
| Git and GitHub | Version control and source-code collaboration. |

### Why Combine Rule-Based Checks with AI?

Rule-based checks are useful for conditions that
