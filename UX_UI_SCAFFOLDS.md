# UX/UI SCAFFOLDS: THE EXPANDING PORTAL CARD INTERFACE PROTOCOL

This document outlines the design language, interaction models, and visual patterns governing the Agnostic Product Graph. It centers on a single-view, distraction-free stage where complex metadata layers are revealed in a focused, non-disruptive manner.

---

## UI ARCHITECTURE: THE LEAN EXPLORATION DASHBOARD

### Layout (1/5 : 4/5 Split):
*   **1/5 [Chat Interface]:** The `Agent_Interaction_Gate`. Accepts text and files. Functions as the primary command-and-feedback loop for the system.
*   **4/5 [Graph Workspace]:** The `State_Visualization_Canvas`. A drag-and-drop, persistent workspace representing the product graph state (`graph_state.json`).

### Interaction Logic (Selection & Inspection):
*   **Entity Selection:** Clicking any Node or Edge triggers the `Contextual_AdHoc_Panel` (Overlay / Focus Panel).
*   **Ad-Hoc Panel Components:**
    *   *Content Description:* Current state definition.
    *   *Data Attributes:* Metadata from Data Scaffolds.
    *   *Visuals:* Real-time rendering of node/edge metrics (gauges).
    *   *Relational Context:* Visualization of connected nodes and their "Edge Role" (Loop transition vs. static data).

### Access Control Layer:
*   **Editing Mode:** `Omar_HITL_Status = True` (Read/Write access to all attributes).
*   **Observer Mode:** `User_Guest_Status = True` (Read-only access for future scaling).

---

## 1. THE VISUAL ESSENCE (Slate Cosmic Aesthetic)

Our interface is built on a high-contrast, premium, eye-safe workspace optimized for deep engineering and strategy workflows:
*   **Canvas Base:** Deep Charcoal/Slate (`bg-slate-950`) to minimize optical fatigue.
*   **Surfaces & Borders:** Subtle elevation using slate boundaries (`bg-slate-900 border-slate-800`).
*   **Active Accents:** Electric Indigo (`text-indigo-400` / `bg-indigo-600`) representing strategic hypotheses, and Emerald Green (`text-green-400`) representing validated operational flows.
*   **Typography Pairing:**
    *   *Display/Structural Headers:* **Space Grotesk** or premium sans-serif for clean, geometric structure (`tracking-tight text-slate-100`).
    *   *System Status & Metrics:* **JetBrains Mono** or high-legibility monospace for data values, tokens, and schemas (`text-xs text-slate-400`).

---

## 2. THE NODE-EYE REDUCTION PRINCIPLE (Anti-Clutter Clause)

To prevent visual fatigue and keep cognitive load at a minimum:
*   **Title-Only Baseline:** On the visual stage, nodes and edges must render with minimalist, human-readable titles only.
*   **Deferred Disclosure:** Extensive metadata—including data types, priority ranks, execution frequencies, and reference IDs—is strictly prohibited from cluttering the canvas.
*   **Interactive Revelation:** Detail-heavy layers are completely deferred until a node or edge is explicitly engaged by the user.

---

## 3. THE EXPANDING PORTAL CARD (Overlaid Focus Panel)

When a node or edge is clicked in the visualizer stage or selected from the sidebar index, the application opens a distraction-free, overlaid focus portal:

```
+--------------------------------------------------------+
|                      VISUAL STAGE                      |
|                                                        |
|     [Node 1] --------------> [Node 2] (Clicked)        |
|                                                        |
+--------------------------------------------------------+
|========================================================| [Expanding Portal Card]
|  [OP_NODE_03] - DATA PIPELINE STAGE          (X) Close | (Overlay / Focus Panel)
|--------------------------------------------------------|
|  [ Title & Quick Status: VAL_PENDING ]                 |
|                                                        |
|  [TABS]:                                               |
|  +--------------+--------------+--------------------+  |
|  | 1. Attributes| 2. Execution | 3. SOTA References |  |
|  +--------------+--------------+--------------------+  |
|                                                        |
|  [Tab 1 Content]:                                      |
|  - Data Source: User HITL                              |
|  - Complexity: High                                    |
|  - Semantic Novelty Anchor: 0.85                       |
|                                                        |
|  [Mathematical Curve Upgrade Selector]:                |
|  [ ] Standard Avg -> [X] Latent Cosine Similarity      |
|                                                        |
|                                [ APPROVE & DEPLOY ]    |
+========================================================+
```

### Portal Core Behaviors:
1.  **Overlaid Isolation:** Mounts as a sliding drawer or elegant overlay panel (using `motion/react` animations) that covers a portion of the screen, focusing all attention on the selected entity.
2.  **Modular Multi-Layer Reveal (Tabs):**
    *   **Layer 1: Common Data Attributes:** Edits and displays parameters like Input/Output types, Semantic Novelty Anchor, and Validation Thresholds.
    *   **Layer 2: Functional Execution & SOTA Curve Upgrades:** Allows toggling mathematical formulas between baseline arithmetic and advanced SOTA formulas (e.g. Cosine Similarity, Wasserstein Distance).
    *   **Layer 3: Grounded Reference Mapping:** Shows associated SOTA papers from our 20 Reference Library, validating that the node is strictly aligned with the operational theory.
3.  **Strict State Commitment:** Contains human-in-the-loop action controls (e.g., "Validate Node State", "Apply SOTA Equation") that must be explicitly saved, logging a structured commit in the gitGraph temporal timeline.

---

## 4. MICRO-ANIMATIONS & FLUID TRANSITIONS

Transitions must be purposeful and structural, enhancing spatial orientation without being gratuitous. We utilize `motion/react` with the following parameters:
*   **Portal Entrance (Slide-Fade Overlay):**
    ```typescript
    const overlayVariants = {
      hidden: { opacity: 0, x: 50 },
      visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
      exit: { opacity: 0, x: 50, transition: { duration: 0.2 } }
    };
    ```
*   **State Toggle/Tab Shifts:** Staggered fade effects to smooth the transition between the modular layers of attributes:
    ```typescript
    const tabContentVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.15 } }
    };
    ```

---

## 5. DUAL-TRACK ARCHITECTURAL SYNCHRONICITY

The portal directly maps the selected node to its governing track:
*   **Strategic Validation Card Decorators:** Navy-tinted focus rings, displaying high-level hypothesis formulas, demographic alignment matrices, and manual HITL approvals.
*   **Operational Data Core Card Decorators:** Emerald-tinted interfaces, displaying programmatic payload schemas, scheduled triggers, automation parameters, and active synthetic bridging status logs.
