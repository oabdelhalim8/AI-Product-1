# CODE SCAFFOLDS: STRUCTURAL GUIDELINES, COMPONENT SCHEMAS & CODING CONTRACTS

**SYSTEM-WIDE ARCHITECTURAL STANDARDIZATION — AUTHORED FOR THE OPERATIONS LAYER**

This document serves as the absolute, definitive code reference, architectural guideline collection, and component design contract for the **Agnostic Product Management Graph** web application. All current and future React, TypeScript, and state components must adhere strictly to the protocols detailed herein.

---

## 1. TECHNICAL STACK & ARCHITECTURAL INTEGRITY
The application operates on a modern, high-performance, single-view architecture with expandable layers.

*   **Runtime & Language:** TypeScript (strict typing mode enabled) built on Vite.
*   **Core UI Framework:** React 18+ (utilizing purely functional components and modern hooks).
*   **Styling Engine:** Tailwind CSS utilizing direct class definitions and utility prefixes (e.g., responsive `sm:`, `md:`, `lg:`; active/hover feedback states).
*   **Animation System:** `motion` (imported from `motion/react`) for spatial transitions, bento-grid card entries, and collapsible portal animations.
*   **Icon Library:** `lucide-react` (all icons MUST be imported directly as named imports; custom SVG paths are strictly prohibited).
*   **State Persistence:** Durable local state synchronized Reactively with client-side `localStorage` state clusters (`localStorage.setItem('agnostic_product_graph', ...)`).

---

## 2. STRUCTURAL DIRECTORY LAYOUT
The project maintains a strict, clean separation of concerns. Do not clutter the root with arbitrary files:

```text
/
├── .env.example                # Blueprint for required environment variables
├── package.json                # Project dependencies and script endpoints
├── vite.config.ts              # Vite asset pipelines and compilation config
├── tsconfig.json               # TypeScript strict compilation configurations
├── index.html                  # Core HTML single page shell
├── AGENTS.md                   # Custom project-specific instruction manual
├── DATA_SCAFFOLDS.md           # Physical data structures and attribute schemas
├── FUNCTIONAL_SKELETON.md      # Multi-layer relationships and thresholds
├── LOGIC_SCAFFOLDS.md          # Logical rules, constraints, and dependencies
├── UX_UI_SCAFFOLDS.md          # UI design philosophies, layouts, and panels
├── CODE_SCAFFOLDS.md           # THIS FILE - Structural code and patterns reference
├── SEMANTIC_HASH_CODE_VECTOR.md# Math, schema, and workflow specs for SHCV
└── src/
    ├── main.tsx                # Client boot entry point
    ├── index.css               # Global CSS imports (@import "tailwindcss";)
    ├── App.tsx                 # Main application dashboard orchestrator
    ├── types.ts                # Master TypeScript interface and type declarations
    ├── referencesData.ts       # Core SOTA citation indices (R1 to R20 references)
    └── components/             # Reusable UI component modules
        ├── MermaidRenderer.tsx     # Handles real-time dynamic DSL compilation
        ├── ExpandingPortalCard.tsx # Frame for collapsible/expandable bento panels
        ├── NodeProposalForm.tsx    # Controlled inputs for constructing nodes
        ├── EdgeConnectorForm.tsx   # Controls for configuring transitions
        └── DataScaffoldTracker.tsx # Operational validation panel for raw attributes
```

---

## 3. MASTER TYPE DEF CONTRACT (`src/types.ts`)
The entire application operates on a strict, strongly-typed domain model. Any state update or API contract must compile flawlessly against this schema:

```typescript
// NodeType dictates the operational mode and behavior of individual nodes
export type NodeType = 
  | 'GOV_NODE' 
  | 'MM_NODE' 
  | 'OP_NODE' 
  | 'SYS_NODE' 
  | 'HITL_GATE' 
  | 'A_TRG' 
  | 'Master_Hypothesis_Selector';

// ComplianceData encapsulates standard regulatory policies associated with nodes
export interface ComplianceData {
  gdprEnabled: boolean;
  gdprDescription: string;
  cookiePolicyEnabled: boolean;
  cookiePolicyDescription: string;
  termsOfServiceEnabled: boolean;
  termsOfServiceDescription: string;
  privacyPolicyEnabled: boolean;
  privacyPolicyDescription: string;
  copyrightEnabled: boolean;
  copyrightDescription: string;
}

// GraphNode defines the structure of each node in the Product Management Graph
export interface GraphNode {
  id: string;
  type: NodeType;
  label: string;
  description: string;
  layer: 'GOV' | 'MM' | 'OP' | 'SYS';
  dataType?: string;             // e.g. "Text", "Scalar", "JSON", "Markdown"
  priority?: 'P1' | 'P2' | 'P3';
  isCompleted: boolean;
  dataPlaceholder?: string;      // e.g. "[INPUT: Subscriber_Registration]"
  template?: string;             // Used by Master Hypothesis Selectors
  branchingPaths?: string[];
  governingConstraints?: string[];
  references?: string[];         // Links to referencesData (e.g. ["R1", "R2"])
  activeBranch?: string;         // Current active strategic direction
  jtbdInputs?: {
    mediaCategory?: string;
    actionType?: string;
    outputType?: string;
    growthMetric?: string;
    valueMetric?: string;
  };
  metadata?: {
    threshold?: string;
    sla?: string;
    metrics?: string;
    [key: string]: any;
  };
  compliance?: ComplianceData;
}

// GraphEdge represents logical transitions, constraints, and triggers in the graph
export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  label?: string;               // e.g., "[C: Threshold > 0.85]"
  type: 'STANDARD' | 'C_EDGE' | 'FEEDBACK'; // FEEDBACK maps to dashed lines (-.->)
}

// ProductGraph is the root container managed by localStorage and the React view
export interface ProductGraph {
  id: string;
  name: string;
  problemStatement?: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  createdAt: string;
}
```

---

## 4. DESIGN PATTERNS FOR CORE UI COMPONENTS
To maintain a high-quality interface that avoids unrequested clutter or generic look-and-feels, we enforce three crucial component implementation patterns:

### 4.1 Collapsible "Portal" Layouts (`ExpandingPortalCard`)
*   **Intuition:** The interface must support extreme density without causing cognitive overload. Views are presented as structured grids where detailed information remains collapsed until activated.
*   **Coding Standard:** Use `motion.div` for animating height transitions. Avoid absolute height animations; rely on `animate={{ height: "auto" }}` paired with `transition={{ duration: 0.25, ease: "easeInOut" }}` to support dynamic inner content resizes.

```typescript
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface PortalCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export const ExpandingPortalCard: React.FC<PortalCardProps> = ({ title, icon, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-lg overflow-hidden transition-all duration-200 hover:border-[#3f3f46]">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left text-[#f4f4f5] focus:outline-none"
      >
        <div className="flex items-center space-x-3">
          <div className="text-blue-400">{icon}</div>
          <span className="font-sans font-medium tracking-tight">{title}</span>
        </div>
        <div>{isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}</div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="border-t border-[#27272a] bg-[#09090b]"
          >
            <div className="p-4 text-[#d4d4d8] font-sans text-sm">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
```

### 4.2 Dynamic Visual DSL (`MermaidRenderer`)
*   **Intuition:** The Mermaid graph visualization must reactively re-render whenever nodes are modified, added, or deleted.
*   **Coding Standard:** Due to Mermaid's initialization quirks, never re-run raw `mermaid.initialize` inside component render loops. Instead, render a clean target text block container and call `mermaid.run` with a unique ID inside a highly stabilized `useEffect` hook.

```typescript
import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

// Initialize mermaid once at the module level
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    background: '#09090b',
    primaryColor: '#1e293b',
    primaryTextColor: '#f4f4f5',
    lineColor: '#3b82f6',
    secondaryColor: '#27272a',
    tertiaryColor: '#09090b',
  },
  securityLevel: 'loose',
});

interface MermaidRendererProps {
  chartDefinition: string;
}

export const MermaidRenderer: React.FC<MermaidRendererProps> = ({ chartDefinition }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.removeAttribute('data-processed');
      try {
        mermaid.run({
          nodes: [containerRef.current],
        });
      } catch (error) {
        console.error('Mermaid render failure:', error);
      }
    }
  }, [chartDefinition]);

  return (
    <div className="w-full flex justify-center bg-[#09090b] p-4 rounded-lg border border-[#27272a] overflow-x-auto">
      <div ref={containerRef} className="mermaid w-full text-center">
        {chartDefinition}
      </div>
    </div>
  );
};
```

---

## 5. ROBUST STATE PERSISTENCE & RENDER SAFETY
To ensure flawless user experiences within React's render cycles and satisfy strict performance requirements:

*   **Prevent Infinite Re-renders:** Never trigger state setters inside the main body of React components. 
*   **Stabilize Hook Dependencies:** Standard arrays, object literals, or arrow functions must never be passed directly to dependency arrays in `useEffect`. If an object or function is required, declare it outside the component scope or wrap it in a strict `useMemo` or `useCallback` hook targeting primitive triggers (e.g., node strings or IDs).
*   **Safe JSON De-serialization:** When reading the graph from `localStorage`, always wrap the operations in a `try/catch` block to handle parsing failures gracefully, defaulting back to `INITIAL_GRAPH` to avoid breaking the application container.

---

## 6. SOTA ALGORITHMIC STANDARDS FOR CODE GENERATION
When writing code snippets, data generators, or validation pipelines, the AI agent must prioritize embedding industry-standard frameworks over naive boilerplate:

1.  **Job-To-Be-Done (JTBD):** Standardizes user motivation capture fields.
2.  **MoSCoW Prioritization:** Controls node prioritization (`priority: 'P1' | 'P2' | 'P3'`).
3.  **Hamming Distance Evaluation:** Used exclusively within semantic matching checks when updating the core `SEMANTIC_HASH_CODE_VECTOR`.
4.  **GDPR & Copyright Checks:** Formulates strict validation flags across operational gateways.

---
*Created and registered as a core operational file for the Omar Master Environment. Ready for implementation.*
