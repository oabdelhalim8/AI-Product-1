# FUNCTIONAL SKELETON: MERMAID ARCHITECTURAL PROTOCOL
**VIBE CODING AGENT NOTICE: MERMAID CAPABILITY - HIGH**
*This protocol is domain and product agnostic. Mermaid syntax is used to define nodes, edges, and logic for any product management lifecycle.*

---

## 1. DUAL-TRACK ARCHITECTURAL COUPLING
Every single node and edge in the Agnostic Product Graph must be categorized under one of the two main operational tracks, or designated as a bridging Coupling Node:

1. **Strategic Validation Track:** Centered on high-level hypothesis modeling, compliance, visual steering, and user validation loops. These nodes govern the direction of the creative content.
2. **Operational Data Core Track:** Focuses on automated pipelining, data schema curation, pipeline validation, and real-time feedback ingestion. These nodes operationalize strategy into programmatic data streams.
3. **Coupling Nodes / Edges:** Explicit nodes or edges that bridge both tracks, serving as the interface where strategic hypotheses directly map to operational data structures.

---

## 2. LAYERED VIEW CONVENTIONS
To preserve logical separation of concerns, the graph is organized into visual layers:
* **GOV_ (Governance):** Core product hypotheses, constraints, and master switches (e.g., `GOV_NODE_01`).
* **MM_ (Mind Map):** Strategic alignment, conceptual mapping, user research, and market landscapes.
* **OP_ (Operational):** Pipelines, data task execution, content schedules, and automated tooling inputs.
* **SYS_ (System):** Under-the-hood technical mechanics, database integrations, ML models, and API boundaries.

---

## 3. COMMON DATA ATTRIBUTES (Programmatic ML Anchors)
To establish a rigid mathematical interface between text-based product concepts and downstream automation models, every node and edge supports a standardized metadata schema of **Common Data Attributes**. These act as programmatic placeholders for downstream ML modeling and automated execution:

| Attribute Name | SOTA ML Description | Default Value / Range |
| :--- | :--- | :--- |
| **Input Data Type** | Format of input incoming payload (Scalar, Vector, Markdown, JSON). | `JSON` |
| **Output Data Type** | Format of output returned payload (Scalar, Vector, Markdown, JSON). | `JSON` |
| **Temporal Update Frequency** | Cron schedule or event-based trigger interval driving automation. | `0 0 * * *` (Daily) |
| **Data Lifecycle State** | The active state in the pipeline (Draft, Validated, Deployed, Deprecated). | `Draft` |
| **Data Origin / Source** | Origin of the data stream (User HITL, External API, Synthetic, Scraping). | `User HITL` |
| **Structural Complexity** | Dimensionality or depth scale of the data payload. | `Medium` |
| **Semantic Novelty Anchor** | High-dimensional embedding distance constraint from standard tropes. | `0.85` |
| **Demographic Vector Dimensions** | Segment identifiers targeting specific audience niches. | `["Tech Enthusiasts"]` |
| **Style Variance Bounds** | Permissible deviation limits from style templates. | `[0.1, 0.5]` |
| **Validation Threshold** | The numeric threshold trigger that fires a manual Omar HITL intervention. | `0.70` |
| **Automation Status** | Operational state of the node's background processor. | `Pending` |
| **Downstream Impact Co-efficient**| Weight factor determining the magnitude of change on downstream nodes. | `1.0` |

---

## 4. AUTOMATION & HUMAN-IN-THE-LOOP (HITL) PROTOCOL
* **A_TRG (Automation Trigger):** Visualized as a diamond shape `id{Trigger}` representing scheduled, chronological, or event-driven automation (e.g., timely content scheduling).
* **HITL_GATE (Human-in-the-Loop Gate):** Visualized as a sub-process node `id[[Human Validation]]`. No content or configuration can transition to production without explicit manual validation by **Omar (the sole administrator)**.
* **SOTA Feedback-Driven Steering:** Specialized ML models ingest audience metrics (analytics/feedback) and dynamically adjust the "Exploration Friction" parameters in the Strategy layer.
* **Lean Startup Validation Loop:** If performance or novelty drops below the `Validation Threshold`, the system halts automation and triggers an **[[Expert Alignment Meeting]]** for pivot/persevere actions.

---

## 5. AGNOSTIC ORCHESTRATION PROTOCOL
* **GOV_NODE_01 (Master Hypothesis Selector):** The root anchor of all graphs.
  1. **Function:** Serves as the master switch controlling the operational cycle.
  2. **Branching Logic:** Dynamically pivots the active track across 5 parallel media category workflows: **{Text, Music, Audio, Video, Multimedia}**.
  3. **Domain Constraints:** Pivoting the branch automatically triggers domain-specific constraints (e.g., *Semantic Novelty* for Text, *Harmonic Novelty* for Music) and updates the associated reference literature.
* **Agnostic JTBD Formula:** Every campaign or product cycle is initialized with the standard formula:
  > *"Users in the [Media_Category] domain need to [Action_Type] [Output_Type] to maximize [Growth_Metric] which inherently validates [Value_Metric]."*

---

## 6. PRAGMATIC SYNTHETIC DATA BOOTSTRAPPING (Temporary Bootstrapping Bridge)
* **Bootstrap Trigger:** If required operational input, feedback, or automated streams are missing, the system MUST immediately bootstrap by generating near-real, high-fidelity synthetic data.
* **SOTA Grounding:** All synthetic data profiles, constraints, and parameters must be derived directly from the active SOTA references within the **20 Reference Library** to prevent architectural disconnects.
* **Temporal Progression (Transition Grace Period):** Synthetic data is strictly a *temporary operational bridge* to ensure end-to-end flow execution.
* **Active Reminder Signaling:** Nodes running on synthetic data must set `dataOriginSource` to `Synthetic (Temporary Bridge)` and generate a recurring reminder/alert on the dashboard. None of these nodes may be permanently left on synthetic data unless explicitly designed as a synthetic simulation node.

---

## 7. PROMPT-TO-ML GRADUAL TRANSITION PATHWAY (Anti-Bottleneck Protocol)
To ensure immediate functionality without waiting for complex model training or API setup:
* **Initial State (Prompt Engineering Bootstrapping):** All intelligent processing nodes, edge constraints, and coupling translators are initially powered by high-performance prompt engineering (using LLMs/Gemini). This keeps the system simple, pragmatic, and immediately runnable.
* **SOTA Alignment:** Prompt templates must align strictly with active reference frameworks (e.g., JTBD, SCAMPER, MoSCoW) to ensure high-quality, structured output formats.
* **Gradual Upgrades (Prompt-to-ML Transition):** Prompt-engineered nodes can be incrementally replaced with specialized, fine-tuned, or local Machine Learning models (e.g., classifier, embedding regressor) without disrupting adjacent nodes.
* **Coupling Safety:** Every transition must respect the standardized **Common Data Attributes** to act as a plug-and-play architectural coupling, preventing any system disintegration or processing bottlenecks during upgrade cycles.

---

## 8. MATHEMATICAL & STATISTICAL LEARNING CURVE PROTOCOL (Pragmatic-to-SOTA Progression)
To align with our operational feedback loop and support a continuous, hands-on learning curve:
* **Phase 1: Pragmatic Initialization (Baseline Math):** All analytical, statistical, and evaluation nodes begin with simple, intuitive, and highly functional mathematical formulas (e.g., raw arithmetic averages, basic standard deviations, Euclidean distances). This ensures immediate code execution and conceptual transparency.
* **Phase 2: Collaborative Upgrading (The SOTA Menu):** Once the baseline algorithm runs successfully, you (as the expert) can trigger a mathematical upleveling. The agent will formulate and suggest 2-3 advanced, state-of-the-art equations, algorithms, or statistical measures (e.g., Cosine Similarity in latent dimensions, Wasserstein/Earth Mover's Distance, Bayesian updating models) as options.
* **Phase 3: Hot-Swappable Implementation:** Upon your selection, the selected formula is compiled directly into the target node, upgrading the statistical sophistication while keeping the input/output boundaries completely stable.

---

## 9. REFERENCES RELEVANCY, AUDITING, & GROUNDING MANDATE (20-SOTA Reference Clause)
To ensure that all automated output remains tightly grounded in state-of-the-art methodology and real-world workflows:
* **Active Grounding Constraint:** Every single node and edge created or modified in the Agnostic Product Graph **MUST** be explicitly mapped to, and ground its logic in, at least **20 specific SOTA literature reference anchors** from our Reference Library. No element is allowed to drift into an ungrounded state.
* **Scheduled Reference Auditing (7-Day Renewal Cycle):** SOTA reference materials are not static. They must be updated regularly to incorporate new practical workflows, industry breakthroughs, and context adjustments.
* **Permission Gate & Omar Consent Reminder:** The system enforces a strict 7-day time limit on reference freshness. After 7 days, a prominent alert/reminder triggers on the main workspace UI, prompting Omar for explicit permission to initiate a collaborative review and update session for the Reference Library. No automatic overhauls occur without Omar's direct approval.





