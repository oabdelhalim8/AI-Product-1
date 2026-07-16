export type NodeType = 'GOV_NODE' | 'MM_NODE' | 'OP_NODE' | 'SYS_NODE' | 'HITL_GATE' | 'A_TRG' | 'Master_Hypothesis_Selector';

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

export interface GraphNode {
  id: string;
  type: NodeType;
  label: string;
  description: string;
  layer: 'GOV' | 'MM' | 'OP' | 'SYS';
  dataType?: string; // e.g. "Text", "Scalar", "JSON"
  priority?: 'P1' | 'P2' | 'P3';
  isCompleted: boolean;
  dataPlaceholder?: string; // e.g. "[INPUT: Doc_Type]"
  template?: string;
  branchingPaths?: string[];
  governingConstraints?: string[];
  references?: string[];
  activeBranch?: string;
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

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  label?: string; // e.g., "[C: Threshold > 0.85]"
  type: 'STANDARD' | 'C_EDGE' | 'FEEDBACK'; // FEEDBACK translates to -.-> in Mermaid
}

export interface ProductGraph {
  id: string;
  name: string;
  problemStatement?: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  createdAt: string;
}
