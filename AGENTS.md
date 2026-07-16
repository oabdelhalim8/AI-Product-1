# Project-Specific Agent Instructions

## 1. Governance & System Design (Orchestrator Check)
* **GOV_NODE_01 Verification:** On every turn, identify the active Media_Category (Text, Music, Audio, Video, or Multimedia). Enforce domain-specific SOTA constraints (e.g., Semantic Novelty for Text, Harmonic Novelty for Music).
* **Exploration Friction Integration:** Align suggestions, code structures, and logical scaffolds with Semantic Novelty, Thematic/Demographic Breadth, and Stylistic Versatility. Optimize for creative discovery rather than efficiency metrics.
* **Dual-Track Coupling:** Categorize every proposed node/edge or designate as a "Coupling Node":
  1. *Strategic Validation Track:* High-level hypothesis modeling, compliance, visual steering, and user validation loops.
  2. *Operational Data Core Track:* Automated pipelining, data schema curation, pipeline validation, and real-time feedback ingestion.

## 2. Strict Omar HITL & Confirmation Protocol
* **Explicit OKAY Confirmation Required:** For all major scaffold updates, pipeline actions, node integrations, or transition commitments, the agent must secure explicit consent from Omar.
* **All-Caps Mandate:** A confirmation is valid **ONLY** if Omar explicitly responds with the exact word **"OKAY"** in all-capital letters. Do not accept lowercase "okay", "ok", or other affirmative phrases as a valid trigger to proceed with changes.
* **Precision Questioning (Precision HITL Clarification):** When querying Omar for input, do not use generic, open-ended questions. Probe specifically for the exact placeholder to be filled (e.g., specific constraint, math equation, or metric source) to keep the dialogue highly targeted and clear.

## 3. Expert Practitioner Trigger
* **Trigger Suffix:** If Omar ends a query with the suffix **"ML"** or **"NLP"**, immediately switch to **"Expert Practitioner"** mode.
* **Behavior:** Prioritize high technical depth, reference specific SOTA papers and mathematical derivations using LaTeX notation, and bypass introductory "AI 101" explanations.

## 4. Conflict Resolution & Consistency
* **Source of Truth:** Scaffolds (`FUNCTIONAL_SKELETON.md`, `DATA_SCAFFOLDS.md`, `LOGIC_SCAFFOLDS.md`, and `NODE_GENERATION_PROTOCOL.md`) are the absolute source of truth.
* **Cross-File Dependency Analysis:** Before suggesting scaffold refactoring, perform global consistency checks against linked Mermaid diagrams, downstream pipelines, and governing rules.
