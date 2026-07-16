# NODE GENERATION PROTOCOL: SOTA DUAL-TRACK NODE EXPANSION
**SYSTEM-WIDE COMPLIANCE NOTICE: EXPLICITLY GOVERNED BY GOV_NODE_01**
*This protocol defines the step-by-step automated workflow to anchor, structure, visualize, and validate newly proposed nodes and edges against our active constraints and SOTA literature.*

---

## 1. PRE-FLIGHT (Orchestrator Check)
Before initiating any node or edge generation, the system must execute the following state-verification checks:

1. **Verify Active Branch:** Query `graph_state.json` (or active memory state) to identify the `activeBranch` and its corresponding `Media_Category` (Text, Music, Audio, Video, or Multimedia).
2. **Determine Dual-Track Coupling Class:** Categorize the new node/edge into one of the three SOTA operational zones:
   * **Strategic Validation Track (STRAT_):** High-level hypothesis modeling, compliance, visual steering, and user validation loops.
   * **Operational Data Core Track (DATA_):** Automated pipelining, data schema curation, pipeline validation, and real-time feedback ingestion.
   * **Coupling Node (COUPLE_):** Explicit node or edge bridging both tracks (e.g., translating strategic inputs into mathematical operational anchors).
3. **Activate Exploration-First Constraints:** Lock the governor to prevent optimizations for Latency, Cost, or Conversion Metrics. Force optimization of creative parameters:
   * *Semantic Novelty Threshold* ($\ge 0.85$)
   * *Thematic/Demographic Breadth*
   * *Stylistic Versatility Bounds*

---

## 2. NODE INITIALIZATION SCHEMA
Every generated node must be initialized with the **12 Common Data Attributes** mapped as programmatic ML placeholders:

```json
{
  "nodeId": "STRAT_CONCEPT_01",
  "track": "Strategic Validation",
  "mediaCategory": "Text",
  "attributes": {
    "inputDataType": "Markdown",
    "outputDataType": "JSON",
    "temporalUpdateFrequency": "0 0 * * *",
    "dataLifecycleState": "Draft",
    "dataOriginSource": "User HITL",
    "structuralComplexity": "Medium",
    "semanticNoveltyAnchor": 0.85,
    "demographicVectorDimensions": ["Tech Enthusiasts", "NLP Practitioners"],
    "styleVarianceBounds": [0.1, 0.5],
    "validationThreshold": 0.70,
    "automationStatus": "Pending",
    "downstreamImpactCoefficient": 1.0
  }
}
```

---

## 3. STEP-BY-STEP GENERATION PROCEDURE

### Step 3.1: Contextual Anchoring
* Connect the new node directly to its governing parent `GOV_NODE_01` and define the structural hierarchy.
* Map the node's purpose back to the **Agnostic JTBD Formula**:
  > *"Users in the [Media_Category] domain need to [Action_Type] [Output_Type] to maximize [Growth_Metric] which inherently validates [Value_Metric]."*

### Step 3.2: Structural Pattern Application
* **Visual DSL Pattern:** Construct a localized Mermaid flowchart showing the dependency branch from `GOV_NODE_01` to the new node.
* **SOTA Framework Integration:** Ground the internal logic of the node in an industry-proven framework (e.g., JTBD, MoSCoW, EM, SCAMPER).
* **Execution Paradigm (Prompt-to-ML):** Standardize initial execution of intelligent decision-making, text generation, or embedding classification using structured **Prompt Engineering** with LLM backends (e.g., Gemini). This avoids integration bottlenecks.
* **Transition Target Mapping:** Define the target offline ML model or fine-tuning strategy that will eventually inherit the node's functional logic, preserving input/output signatures to prevent downstream disintegration.

### Step 3.3: Automated Feedback Steering & Validation
* Run automated validation on the generated output against the **Semantic Novelty** requirement.
* If semantic novelty falls below the defined validation threshold (e.g., $0.85$ or $0.70$), immediately halt the generation process and flag for an [[Expert Alignment Meeting]] or prompt for user realignment.

### Step 3.4: Mandatory Omar HITL Intervention
* Every newly generated node is marked as `Pending` under `automationStatus`.
* Render a dedicated **Omar HITL Gate** in the user interface.
* The node remains inactive until **Omar (and only Omar)** manually approves or adjusts the content constraints, schedules, and parameters.

### Step 3.5: Pragmatic Synthetic Bootstrapping (Missing Data Fallback)
* **Pre-flight Check:** If a node requires live input (user entry, feedback, API stream) that is currently empty or unavailable, the system MUST NOT fail or freeze.
* **Synthetic Generation:** Automatically generate near-real, programmatic synthetic data matching the node's schema. This data must draw context parameters from our 20 SOTA reference materials.
* **Transient Marker & Active Alert:** Mark the node's attribute `dataOriginSource` as `"Synthetic (Temporary Bridge)"`. The system will fire a periodic reminder on the interface warning that this node is running on synthetic data and requires manual/automated substitution within a transition grace period.


---

## 4. STATE SYSTEM UPDATE
Once Omar approves a node, the system will:
1. Append the new node and its attributes to `graph_state.json`.
2. Update the `changeHistory` array with the timestamp, operator (`Omar`), node ID, and branch context.
3. Propagate changes downstream using the `downstreamImpactCoefficient` to trigger dependent node updates if required.

---

## 5. PRAGMATIC-TO-SOTA MATHEMATICAL UPLEVEL MECHANISM
To ensure that we can iteratively build up from simple math to SOTA algorithms without breaking the pipeline:
1. **Bootstrap with High Readability:** During initial node generation, the formulas used (e.g. for anomaly detection, clustering, or scoring) must be implemented with extremely clear, simple code (basic averages, linear functions).
2. **Uplevel Trigger:** Once the node is verified functional in the UI, the agent will present the mathematical options menu.
3. **SOTA Formulation:** The proposed upgrade options must include:
   - Specific named mathematical algorithms (e.g., Mahalanobis distance instead of Euclidean distance to account for correlation).
   - Core mathematical derivations presented in LaTeX format.
   - The trade-offs of each option (accuracy, computation cost, interpretability).
4. **Validation-Safe Migration:** Upon user selection, the node is updated without disrupting the surrounding dependency connections.

---

## 6. SOTA REFERENCES AUDITING & MANDATORY GROUNDING
Every new element in the Agnostic Product Graph must align with the SOTA reference protocol:
1. **20-Reference Minimum Bound:** Every single generated node and edge **MUST** include an array containing references to at least **20 active SOTA sources** from our reference database. This array grounds the operational parameters (such as thresholds, novelty constraints, and metrics) in established literature.
2. **Scheduled 7-Day Audit Cycle:** The system monitors the freshness of the reference database. To ensure the reference links do not stagnate, a weekly chron/interval check is initiated.
3. **Omar Discussion & Consent Gate:** When the audit cycle triggers (every 7 days), the system generates an active UI notification requesting Omar's permission to run an updated audit, discuss context deviations, and integrate new practical workflows into the 20 active slots. No automated references are modified without consent.




