import React, { useState, useEffect } from 'react';
import { GraphNode, GraphEdge, ProductGraph } from './types';
import { MermaidRenderer } from './components/MermaidRenderer';
import { NodeProposalForm } from './components/NodeProposalForm';
import { EdgeConnectorForm } from './components/EdgeConnectorForm';
import { DataScaffoldTracker } from './components/DataScaffoldTracker';
import { ExpandingPortalCard } from './components/ExpandingPortalCard';
import { REFERENCES_DATABASE } from './referencesData';
import { 
  GitBranch, 
  Sparkles, 
  Trash2, 
  Download, 
  FileText, 
  History, 
  Database,
  ArrowRight,
  BookOpen,
  ExternalLink,
  Shield,
  CheckCircle2,
  Filter,
  Send,
  Paperclip,
  User,
  Cpu,
  Lock,
  Eye,
  PlusCircle,
  Undo2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'omar' | 'agent';
  text: string;
  timestamp: string;
  attachments?: { name: string; size: string; type: string }[];
}

const INITIAL_GRAPH: ProductGraph = {
  id: 'agnostic-product-graph',
  name: 'Agnostic Product Management Graph',
  problemStatement: "Users in the [Text] domain need to [Generate] [Technical Blog Posts] to maximize [Subscriber Engagement] which inherently validates [Direct Subscription Revenue].",
  nodes: [
    {
      id: "GOV_NODE_01",
      type: "Master_Hypothesis_Selector",
      label: "GOV_NODE_01: Master Hypothesis Selector",
      description: "Governing input for product hypothesis validation.",
      layer: "GOV",
      priority: "P1",
      isCompleted: true,
      template: "Users in the [Media_Category] domain need to [Generate/Create/Manipulate] [Output_Type] to maximize [Growth_Metric/Visibility] which inherently validates [Value_Metric/Monetization].",
      branchingPaths: ["Text", "Music", "Audio", "Video", "Multimedia"],
      governingConstraints: ["Semantic Novelty", "Thematic/Demographic Breadth", "Stylistic Versatility"],
      references: ["R1", "R2", "R5", "R19", "R20"],
      activeBranch: "Text",
      jtbdInputs: {
        mediaCategory: "Text",
        actionType: "Generate",
        outputType: "Technical Blog Posts",
        growthMetric: "Subscriber Engagement",
        valueMetric: "Direct Subscription Revenue"
      },
      compliance: {
        gdprEnabled: false,
        gdprDescription: "User has explicit double opt-in consent. Subject to Right to Be Forgotten and full portability.",
        cookiePolicyEnabled: false,
        cookiePolicyDescription: "Tracks essential session identifier cookies. Consents via footer banners before analytical tracking.",
        termsOfServiceEnabled: true,
        termsOfServiceDescription: "User agrees to fair-use policy, API limits, and platform content sharing guidelines.",
        privacyPolicyEnabled: true,
        privacyPolicyDescription: "Standard platform privacy policy stating data encryption at rest and strict non-sharing with third-party brokers.",
        copyrightEnabled: false,
        copyrightDescription: "Generated assets remain the joint copyright intellectual property of the author and platform."
      }
    },
    {
      id: "OP_NODE_01",
      type: "HITL_GATE",
      label: "OP_NODE_01: User Sign-Up & Consent Gate",
      description: "Captures subscriber information at the ingest point. Requires strict user privacy approvals.",
      layer: "OP",
      priority: "P1",
      isCompleted: true,
      dataType: "JSON",
      dataPlaceholder: "[INPUT: Subscriber_Registration]",
      compliance: {
        gdprEnabled: true,
        gdprDescription: "Explicit, positive double opt-in consent collected. Features full Right-to-Erasure (forgotten) workflow.",
        cookiePolicyEnabled: true,
        cookiePolicyDescription: "Uses cookie policy banner matching GDPR standards. Block analytics before consent.",
        termsOfServiceEnabled: false,
        termsOfServiceDescription: "User agrees to fair-use policy, API limits, and platform content sharing guidelines.",
        privacyPolicyEnabled: true,
        privacyPolicyDescription: "User profiles are secured locally and never shared with third-party data brokers.",
        copyrightEnabled: false,
        copyrightDescription: "Generated assets remain the joint copyright intellectual property of the author and platform."
      }
    },
    {
      id: "SYS_NODE_01",
      type: "SYS_NODE",
      label: "SYS_NODE_01: LLM Content Synthesis Engine",
      description: "Orchestrates text generation model to synthesize posts while respecting creative constraints and copyright rules.",
      layer: "SYS",
      priority: "P1",
      isCompleted: true,
      dataType: "Markdown",
      dataPlaceholder: "[OUTPUT: Synthesized_Blog_Post]",
      compliance: {
        gdprEnabled: false,
        gdprDescription: "User has explicit double opt-in consent. Subject to Right to Be Forgotten and full portability.",
        cookiePolicyEnabled: false,
        cookiePolicyDescription: "Tracks essential session identifier cookies. Consents via footer banners before analytical tracking.",
        termsOfServiceEnabled: true,
        termsOfServiceDescription: "Automated synthesis processes adhere to licensing and fair API usage quotas.",
        privacyPolicyEnabled: false,
        privacyPolicyDescription: "Standard platform privacy policy stating data encryption at rest and strict non-sharing with third-party brokers.",
        copyrightEnabled: true,
        copyrightDescription: "Guarantees copyright and commercial distribution rights are retained by the final publishing user."
      }
    }
  ],
  edges: [
    {
      id: "edge-gov-to-op",
      from: "GOV_NODE_01",
      to: "OP_NODE_01",
      type: "STANDARD",
      label: "Regulatory Mandate"
    },
    {
      id: "edge-op-to-sys",
      from: "OP_NODE_01",
      to: "SYS_NODE_01",
      type: "STANDARD",
      label: "Consent Passed"
    }
  ],
  createdAt: "2026-07-12T16:52:00.111Z",
};

export default function App() {
  const [graph, setGraph] = useState<ProductGraph>(() => {
    const saved = localStorage.getItem('agnostic_product_graph');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.nodes && !parsed.nodes.some((n: any) => n.id === 'GOV_NODE_01')) {
          parsed.nodes.unshift(INITIAL_GRAPH.nodes[0]);
        }
        return parsed;
      } catch (e) {
        return INITIAL_GRAPH;
      }
    }
    return INITIAL_GRAPH;
  });

  const [activeTab, setActiveTab] = useState<'design' | 'data'>('design');
  const [searchRef, setSearchRef] = useState('');
  const [refFilter, setRefFilter] = useState<string>('All');
  const [editingNode, setEditingNode] = useState<GraphNode | null>(null);

  // Access Control Layer State
  const [workspaceRole, setWorkspaceRole] = useState<'omar' | 'guest'>('omar');
  const omarHitlStatus = workspaceRole === 'omar';
  const userGuestStatus = workspaceRole === 'guest';

  // Chat Interface State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'agent',
      text: "Orchestration Pipeline fully active. Welcome back, Omar. The State_Visualization_Canvas has booted from 'graph_state.json' successfully.\n\nActive category: Text. SOTA Semantic Novelty constraints are enforced. Ready for strategic command.",
      timestamp: "14:52:10"
    },
    {
      id: 'msg-init-2',
      sender: 'omar',
      text: "Let's check active constraints for GOV_NODE_01.",
      timestamp: "14:52:45"
    },
    {
      id: 'msg-init-3',
      sender: 'agent',
      text: "Active SOTA Constraints validated under Text branch: \n1) Semantic Novelty: Prevents robotic cliches using cosine distance thresholds.\n2) Thematic/Demographic Breadth: Targets specialized niche content.\n\nEditing mode is currently set to Omar (Omar_HITL_Status = True). Send text command or drag and drop a file to query. You can type 'switch to guest' or 'switch to omar' to toggle permission layers directly.",
      timestamp: "14:53:01"
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; size: string; type: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const [changeHistory, setChangeHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('agnostic_graph_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      "PROTOCOL: Branching protocol enabled.",
      "REFRACTOR: Constraints updated to Exploration Friction dimensions (Novelty, Breadth, Versatility).",
      "DEFINE_NODE: GOV_NODE_01 locked with agnostic JTBD template.",
      "INITIALIZATION: Orchestration pipeline initialized."
    ];
  });

  // Save graph and history to LocalStorage
  useEffect(() => {
    localStorage.setItem('agnostic_product_graph', JSON.stringify(graph));
  }, [graph]);

  useEffect(() => {
    localStorage.setItem('agnostic_graph_history', JSON.stringify(changeHistory));
  }, [changeHistory]);

  const govNode = graph.nodes.find(n => n.id === 'GOV_NODE_01') || INITIAL_GRAPH.nodes[0];
  const activeBranch = govNode.activeBranch || 'Text';
  const jtbd = govNode.jtbdInputs || {
    mediaCategory: 'Text',
    actionType: 'Generate',
    outputType: 'Technical Blog Posts',
    growthMetric: 'Subscriber Engagement',
    valueMetric: 'Direct Subscription Revenue'
  };

  const updateJTBD = (updates: Partial<typeof jtbd>) => {
    const updatedInputs = { ...jtbd, ...updates };
    const statement = `Users in the [${updatedInputs.mediaCategory}] domain need to [${updatedInputs.actionType}] [${updatedInputs.outputType || 'Output'}] to maximize [${updatedInputs.growthMetric || 'Growth'}] which inherently validates [${updatedInputs.valueMetric || 'Value'}].`;
    
    // Determine default references for the active branch to keep sync
    let branchRefs = ["R1", "R2", "R5", "R19", "R20"];
    if (updatedInputs.mediaCategory === 'Text') branchRefs.push("R9", "R10");
    if (updatedInputs.mediaCategory === 'Music') branchRefs.push("R11", "R12");
    if (updatedInputs.mediaCategory === 'Audio') branchRefs.push("R13");
    if (updatedInputs.mediaCategory === 'Video') branchRefs.push("R15", "R16");
    if (updatedInputs.mediaCategory === 'Multimedia') branchRefs.push("R14", "R17", "R18");

    const updatedGovNode: GraphNode = {
      ...govNode,
      activeBranch: updatedInputs.mediaCategory,
      jtbdInputs: updatedInputs,
      label: `GOV_NODE_01: Master Hypothesis (${updatedInputs.mediaCategory})`,
      description: statement,
      references: branchRefs,
    };

    setGraph(prev => ({
      ...prev,
      problemStatement: statement,
      nodes: prev.nodes.map(n => n.id === 'GOV_NODE_01' ? updatedGovNode : n),
    }));

    setChangeHistory(prev => [
      `BRANCH_PIVOT: Master branching category shifted to "${updatedInputs.mediaCategory}". Statement re-synthesized.`,
      ...prev
    ]);
  };

  const handleAddNode = (node: GraphNode) => {
    if (!omarHitlStatus) return;
    setGraph(prev => {
      const exists = prev.nodes.some(n => n.id === node.id);
      const updatedNodes = exists
        ? prev.nodes.map(n => n.id === node.id ? node : n)
        : [...prev.nodes, node];
      return { ...prev, nodes: updatedNodes };
    });

    setChangeHistory(prev => [
      `NODE_ADDED: Core definition [${node.layer}_${node.type}] "${node.id}" successfully deployed to current graph topology.`,
      ...prev
    ]);
  };

  const handleAddEdge = (edge: GraphEdge) => {
    if (!omarHitlStatus) return;
    setGraph(prev => ({
      ...prev,
      edges: [...prev.edges, edge],
    }));

    setChangeHistory(prev => [
      `EDGE_ESTABLISHED: Logical connector derived: "${edge.from}" --${edge.label ? ` ${edge.label} ` : ''}--> "${edge.to}".`,
      ...prev
    ]);
  };

  const handleFulfillNode = (nodeId: string, syntheticData: string) => {
    if (!omarHitlStatus) return;
    setGraph(prev => ({
      ...prev,
      nodes: prev.nodes.map(n => n.id === nodeId ? { ...n, isCompleted: true } : n),
    }));

    setChangeHistory(prev => [
      `DATA_FULFILLED: Node "${nodeId}" data validation complete. Received valid synthetic scaffold schema payload.`,
      ...prev
    ]);
  };

  const handleSaveNodeCommit = (updatedNode: GraphNode, commitMsg: string) => {
    if (!omarHitlStatus) return;
    setGraph(prev => ({
      ...prev,
      nodes: prev.nodes.map(n => n.id === updatedNode.id ? updatedNode : n)
    }));

    setChangeHistory(prev => [commitMsg, ...prev]);
    setEditingNode(null);
  };

  const handleDeleteNodeCommit = (nodeId: string) => {
    if (!omarHitlStatus) return;
    setGraph(prev => ({
      ...prev,
      nodes: prev.nodes.filter(n => n.id !== nodeId),
      edges: prev.edges.filter(e => e.from !== nodeId && e.to !== nodeId)
    }));

    setChangeHistory(prev => [
      `DELETE_NODE: Node "${nodeId}" and all associated connectors successfully pruned from topology.`,
      ...prev
    ]);
    setEditingNode(null);
  };

  const handleReset = () => {
    if (!omarHitlStatus) {
      alert("Observer Mode is Active. Only Omar HITL Mode can perform reset operations.");
      return;
    }
    if (confirm('Are you sure you want to reset the current graph state? All nodes, edges, and logs will be flushed.')) {
      setGraph(INITIAL_GRAPH);
      setChangeHistory([
        "PROTOCOL: Branching protocol enabled.",
        "REFRACTOR: Constraints updated to Exploration Friction dimensions (Novelty, Breadth, Versatility).",
        "DEFINE_NODE: GOV_NODE_01 locked with agnostic JTBD template.",
        "INITIALIZATION: Orchestration pipeline initialized."
      ]);
      localStorage.removeItem('agnostic_product_graph');
      localStorage.removeItem('agnostic_graph_history');
    }
  };

  // Helper to generate Mermaid Graph representation
  const getMermaidCode = () => {
    let code = "graph TD\n";

    // Subgraphs for layer visual groupings
    const layers = {
      GOV: graph.nodes.filter(n => n.layer === 'GOV'),
      MM: graph.nodes.filter(n => n.layer === 'MM'),
      OP: graph.nodes.filter(n => n.layer === 'OP'),
      SYS: graph.nodes.filter(n => n.layer === 'SYS'),
    };

    // Render nodes with correct shape based on Functional Skeleton
    const renderNodeDefinition = (n: GraphNode) => {
      const hasMetadata = n.dataType || n.priority;
      const displayLabel = hasMetadata
        ? `"${n.id} <br/> <b>${n.label}</b> <br/> <small><i>${n.dataType || 'Text'} | ${n.priority || 'P1'}</i></small>"`
        : `"${n.id} <br/> <b>${n.label}</b>"`;

      if (n.type === 'Master_Hypothesis_Selector' || n.type === 'GOV_NODE') {
        return `  ${n.id}[(${displayLabel})]`;
      } else if (n.type === 'HITL_GATE') {
        return `  ${n.id}[[${displayLabel}]]`;
      } else if (n.type === 'A_TRG') {
        return `  ${n.id}{${displayLabel}}`;
      } else {
        return `  ${n.id}[${displayLabel}]`;
      }
    };

    // 1. Render GOV layer
    if (layers.GOV.length > 0) {
      code += "  subgraph GOV [Governance Layer]\n";
      layers.GOV.forEach(n => {
        code += `  ${renderNodeDefinition(n)}\n`;
      });
      code += "  end\n";
    }

    // 2. Render MM layer
    if (layers.MM.length > 0) {
      code += "  subgraph MM [Mind Map Layer]\n";
      layers.MM.forEach(n => {
        code += `  ${renderNodeDefinition(n)}\n`;
      });
      code += "  end\n";
    }

    // 3. Render OP layer
    if (layers.OP.length > 0) {
      code += "  subgraph OP [Operational Layer]\n";
      layers.OP.forEach(n => {
        code += `  ${renderNodeDefinition(n)}\n`;
      });
      code += "  end\n";
    }

    // 4. Render SYS layer
    if (layers.SYS.length > 0) {
      code += "  subgraph SYS [System Layer]\n";
      layers.SYS.forEach(n => {
        code += `  ${renderNodeDefinition(n)}\n`;
      });
      code += "  end\n";
    }

    // 5. Render Edges with Constraint representation (C_EDGE)
    graph.edges.forEach(e => {
      const labelStr = e.label ? `|"${e.label}"|` : "";
      if (e.type === 'FEEDBACK') {
        code += `  ${e.from} -.-> ${labelStr} ${e.to}\n`;
      } else {
        code += `  ${e.from} --> ${labelStr} ${e.to}\n`;
      }
    });

    // 6. Custom styling classes
    code += `
  classDef govClass fill:#1e1b4b,stroke:#6366f1,stroke-width:2.5px,color:#f8fafc;
  classDef mmClass fill:#0f172a,stroke:#3b82f6,stroke-width:1.5px,color:#f1f5f9;
  classDef opClass fill:#022c22,stroke:#10b981,stroke-width:1.5px,color:#ecfdf5;
  classDef sysClass fill:#2e1065,stroke:#8b5cf6,stroke-width:1.5px,color:#faf5ff;
  classDef pendingClass fill:#27272a,stroke:#f59e0b,stroke-width:2px,stroke-dasharray: 5 5,color:#f3f4f6;

  class GOV_NODE_01 govClass;
    `;

    // Apply styles to node classes
    graph.nodes.forEach(n => {
      if (n.id !== 'GOV_NODE_01') {
        if (!n.isCompleted && (n.dataPlaceholder || n.dataType === 'Scalar')) {
          code += `  class ${n.id} pendingClass;\n`;
        } else if (n.layer === 'MM') {
          code += `  class ${n.id} mmClass;\n`;
        } else if (n.layer === 'OP') {
          code += `  class ${n.id} opClass;\n`;
        } else if (n.layer === 'SYS') {
          code += `  class ${n.id} sysClass;\n`;
        }
      }
    });

    return code;
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ graph, changeHistory }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `product_graph_${graph.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setChangeHistory(prev => [
      `EXPORT_GRAPH: Graph definition payload exported. Written to local workspace as "product_graph_${graph.id}.json".`,
      ...prev
    ]);
  };

  // Determine active constraints based on category selected
  const getFrictionDimensions = (cat: string) => {
    switch (cat) {
      case 'Text':
        return [
          { name: 'Semantic Novelty', desc: 'Distance from standard training corpora patterns to avoid robotic cliches.' },
          { name: 'Thematic/Demographic Breadth', desc: 'Penetration of specific niche demographics and styles.' }
        ];
      case 'Music':
        return [
          { name: 'Stylistic Versatility', desc: 'Capacity to synthesize disparate harmonic and acoustic styles.' },
          { name: 'Harmonic Novelty', desc: 'Complex melodic scales deviating from standard pop chord structures.' }
        ];
      case 'Audio':
        return [
          { name: 'Thematic/Demographic Breadth', desc: 'Diversity of spoken voice dialects, accents, and pacing.' },
          { name: 'Synthesized Versatility', desc: 'Microtonal pacing adjustment and multi-speaker blending capability.' }
        ];
      case 'Video':
        return [
          { name: 'Semantic Novelty', desc: 'Structural narrative distance from existing video stock tropes.' },
          { name: 'Stylistic Versatility', desc: 'Multi-modal synchronization of visual style, lighting, and frame sequences.' }
        ];
      case 'Multimedia':
        return [
          { name: 'Semantic Novelty', desc: 'Cohesive thematic execution across all cross-modal channels.' },
          { name: 'Stylistic Versatility', desc: 'Smooth cross-modal blending without semantic friction or temporal drift.' }
        ];
      default:
        return [];
    }
  };

  const activeFriction = getFrictionDimensions(activeBranch);

  // Filter 20 references
  const filteredReferences = REFERENCES_DATABASE.filter(ref => {
    const matchesSearch = ref.title.toLowerCase().includes(searchRef.toLowerCase()) || 
                          ref.focusArea.toLowerCase().includes(searchRef.toLowerCase()) ||
                          ref.id.toLowerCase().includes(searchRef.toLowerCase());
    
    const matchesFilter = refFilter === 'All' || 
                          ref.mediaCategory === refFilter || 
                          (refFilter === 'General' && ref.mediaCategory === 'General');

    return matchesSearch && matchesFilter;
  });

  // Handle local chat sending & smart response routing
  const handleSendChatMessage = (textToSend = chatInput, filesToAttach = attachedFiles) => {
    if (!textToSend.trim() && filesToAttach.length === 0) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'omar',
      text: textToSend,
      timestamp,
      attachments: filesToAttach.length > 0 ? filesToAttach : undefined
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setAttachedFiles([]);
    setIsTyping(true);

    // Simulate reactive AI assistant response delay
    setTimeout(() => {
      let responseText = "Understood. I am processing your input inside the orchestration loop.";
      const query = textToSend.toLowerCase();

      // Category Switching triggers
      if (query.includes('switch to text') || query.includes('change to text') || (query.includes('text') && query.includes('branch'))) {
        updateJTBD({ mediaCategory: 'Text' });
        responseText = "Command detected. Pivoted active Media Branch to **Text**. Active constraints updated to Semantic Novelty and Thematic/Demographic Breadth. State_Visualization_Canvas updated.";
      } else if (query.includes('switch to music') || query.includes('change to music') || (query.includes('music') && query.includes('branch'))) {
        updateJTBD({ mediaCategory: 'Music' });
        responseText = "Command detected. Pivoted active Media Branch to **Music**. Active constraints updated to Stylistic Versatility and Harmonic Novelty. State_Visualization_Canvas updated.";
      } else if (query.includes('switch to audio') || query.includes('change to audio') || (query.includes('audio') && query.includes('branch'))) {
        updateJTBD({ mediaCategory: 'Audio' });
        responseText = "Command detected. Pivoted active Media Branch to **Audio**. Active constraints updated to Thematic/Demographic Breadth and Synthesized Versatility. State_Visualization_Canvas updated.";
      } else if (query.includes('switch to video') || query.includes('change to video') || (query.includes('video') && query.includes('branch'))) {
        updateJTBD({ mediaCategory: 'Video' });
        responseText = "Command detected. Pivoted active Media Branch to **Video**. Active constraints updated to Semantic Novelty and Stylistic Versatility. State_Visualization_Canvas updated.";
      } else if (query.includes('switch to multimedia') || query.includes('change to multimedia') || (query.includes('multimedia') && query.includes('branch'))) {
        updateJTBD({ mediaCategory: 'Multimedia' });
        responseText = "Command detected. Pivoted active Media Branch to **Multimedia**. Active constraints updated to Semantic Novelty and Stylistic Versatility. State_Visualization_Canvas updated.";
      }
      
      // Access role triggers
      else if (query.includes('switch to guest') || query.includes('observer mode') || query.includes('guest role')) {
        setWorkspaceRole('guest');
        responseText = "Permission Shift detected. Workspace Role changed to **GUEST / OBSERVER MODE** (User_Guest_Status = True). Editing privileges are suspended on the canvas.";
      } else if (query.includes('switch to omar') || query.includes('editing mode') || query.includes('omar hitl')) {
        setWorkspaceRole('omar');
        responseText = "Permission Shift detected. Workspace Role changed to **OMAR / HITL ACTIVE** (Omar_HITL_Status = True). Full read/write privileges are active on the canvas.";
      }
      
      // Design form triggers
      else if (query.includes('propose') || query.includes('add node') || query.includes('create node')) {
        setActiveTab('design');
        responseText = "Flow alignment active: Focused the **Node Proposal Form** in the right workspace drawer. Enter Node attributes to scaffold a new topology node.";
      } else if (query.includes('data scaffold') || query.includes('data tracker') || query.includes('scaffolds')) {
        setActiveTab('data');
        responseText = "Flow alignment active: Focused the **Data Scaffold Tracker** tab. You can fulfill pending node data structures with synthetic payload schemas.";
      }
      
      // Actions
      else if (query.includes('export') || query.includes('download')) {
        handleExportJSON();
        responseText = "Export Action processed. Compiled product graph state to `product_graph_agnostic.json` and triggered a browser download.";
      } else if (query.includes('reset')) {
        responseText = "Reset Prompt parsed. Please use the red 'RESET STATE' button in the workspace toolbar or the 'Reset State' trigger below to confirm flushing with safe validations.";
      }
      
      // Contextual questions
      else if (query.includes('reference') || query.includes('sota')) {
        responseText = "Grounding check: I see we have 20 reference literature documents in our seed base, currently filtered. You can also view SOTA mappings by clicking any node to reveal its grounded scientific anchors in the Contextual_AdHoc_Panel.";
      } else if (filesToAttach.length > 0) {
        responseText = `Ingested attachment: **${filesToAttach[0].name}** (${filesToAttach[0].size}). I am parsing this payload structure into the operational data pipeline. Proposing an alignment schema under active constraints shortly.`;
      } else {
        responseText = `Instruction processed. Active graph state is healthy. We have **${graph.nodes.length} nodes** and **${graph.edges.length} connectors** loaded. Editing Mode is active under Omar HITL. Let me know if you would like me to map other SOTA relationships or adjust active thresholds.`;
      }

      const agentMsg: ChatMessage = {
        id: `msg-agent-${Date.now()}`,
        sender: 'agent',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, agentMsg]);
      setIsTyping(false);
    }, 1200);
  };

  // Drag and drop attachment utilities
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const newFile = {
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: file.type || 'plain/text'
      };
      setAttachedFiles(prev => [...prev, newFile]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newFile = {
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: file.type || 'plain/text'
      };
      setAttachedFiles(prev => [...prev, newFile]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-indigo-500 selection:text-white font-sans">
      
      {/* Premium Cockpit Workspace Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/10 border border-indigo-500/20 rounded-lg">
            <GitBranch className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-md font-semibold tracking-tight text-slate-100 font-sans">The Lean Exploration Dashboard</h1>
            <p className="text-[10px] text-indigo-400 font-mono tracking-widest">LEAN ENGINE ARCHITECTURE | SOTA EXPLORATION WORKSPACE</p>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
            <span className="font-mono text-[10px] text-slate-400 uppercase">Access Layer:</span>
            <button
              onClick={() => setWorkspaceRole('omar')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                omarHitlStatus ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Omar HITL
            </button>
            <button
              onClick={() => setWorkspaceRole('guest')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                userGuestStatus ? 'bg-amber-600/20 text-amber-400 border border-amber-900/40 shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Guest Observer
            </button>
          </div>

          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 py-1.5 px-3 rounded-lg text-xs font-mono transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            EXPORT (JSON)
          </button>
          
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 text-red-400 py-1.5 px-3 rounded-lg text-xs font-mono transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            RESET STATE
          </button>
        </div>
      </header>

      {/* Main 1/5 : 4/5 Split Layout */}
      <div className="flex flex-col lg:flex-row max-w-[1800px] w-full mx-auto p-6 gap-6 flex-1 min-h-0 overflow-hidden">
        
        {/* LEFT COLUMN: 1/5 [Chat Interface] (Agent_Interaction_Gate) */}
        <section className="w-full lg:w-[22%] xl:w-[20%] flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden min-h-[450px] lg:h-[820px] shadow-xl shrink-0">
          
          {/* Gate Header */}
          <div className="border-b border-slate-800 bg-slate-950/40 p-4 shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <div>
                <h2 className="text-xs font-bold font-mono tracking-wider text-slate-200 uppercase">Agent_Interaction_Gate</h2>
                <span className="text-[9px] text-slate-500 font-mono uppercase">Command & Feedback loop</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${omarHitlStatus ? 'bg-indigo-400' : 'bg-amber-400'} animate-pulse`}></span>
              <span className="text-[9px] font-mono text-slate-500 font-semibold uppercase">
                {omarHitlStatus ? 'HITL_WRITE' : 'GUEST_READ'}
              </span>
            </div>
          </div>

          {/* Message Log Box */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin bg-slate-950/20">
            {chatMessages.map((msg) => {
              const isAgent = msg.sender === 'agent';
              return (
                <div key={msg.id} className={`flex items-start gap-2.5 ${isAgent ? 'justify-start' : 'justify-end'}`}>
                  {isAgent && (
                    <div className="p-1 bg-indigo-950 border border-indigo-900/60 rounded text-indigo-400 mt-0.5">
                      <Cpu className="w-3 h-3" />
                    </div>
                  )}
                  
                  <div className={`max-w-[85%] rounded-lg px-3 py-2 text-[11px] leading-relaxed relative ${
                    isAgent 
                      ? 'bg-slate-900 border border-slate-850 text-slate-300' 
                      : 'bg-indigo-600 text-white font-medium'
                  }`}>
                    {/* Timestamp inside bubbles */}
                    <span className={`block text-[8px] font-mono mb-1 ${isAgent ? 'text-slate-500' : 'text-indigo-200'}`}>
                      {isAgent ? 'LEAD AGENT' : 'OMAR (HITL)'} • {msg.timestamp}
                    </span>
                    
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Rendering message attachments if they exist */}
                    {msg.attachments && (
                      <div className="mt-2 space-y-1">
                        {msg.attachments.map((file, i) => (
                          <div key={i} className={`flex items-center gap-1.5 p-1.5 rounded text-[10px] ${
                            isAgent ? 'bg-slate-950 text-slate-400 border border-slate-800' : 'bg-indigo-700 text-indigo-100'
                          }`}>
                            <FileText className="w-3.5 h-3.5" />
                            <span className="truncate flex-1 font-mono">{file.name}</span>
                            <span className="text-[8px] opacity-60 font-mono shrink-0">{file.size}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {!isAgent && (
                    <div className="p-1 bg-indigo-600 rounded text-white mt-0.5">
                      <User className="w-3 h-3" />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono pl-2">
                <Cpu className="w-3 h-3 text-indigo-400 animate-spin" />
                <span>Agent is parsing current graph state...</span>
              </div>
            )}
          </div>

          {/* Drag and Drop Zone / File Upload Previews */}
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`p-3 border-t shrink-0 transition-all ${
              isDragging 
                ? 'bg-indigo-950/30 border-indigo-500/50' 
                : 'border-slate-800 bg-slate-950/10'
            }`}
          >
            {/* Attachment list previews before sending */}
            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {attachedFiles.map((file, i) => (
                  <div key={i} className="flex items-center gap-1 bg-slate-900 border border-slate-800 text-[9px] py-1 px-1.5 rounded text-slate-300 font-mono">
                    <FileText className="w-3 h-3 text-indigo-400" />
                    <span className="truncate max-w-[80px]">{file.name}</span>
                    <button 
                      onClick={() => removeAttachment(i)}
                      className="text-red-400 hover:text-red-300 ml-1 hover:bg-slate-800 rounded p-0.5"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input field and trigger buttons */}
            <div className="flex items-center gap-2">
              <label className="p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-all cursor-pointer shrink-0">
                <Paperclip className="w-3.5 h-3.5" />
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileSelect}
                />
              </label>

              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendChatMessage();
                }}
                placeholder={isDragging ? "Drop your schema here" : "Type command or drag file..."}
                className="flex-1 bg-slate-950 border border-slate-850 text-[11px] rounded-lg py-2 px-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
              />

              <button
                onClick={() => handleSendChatMessage()}
                className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all shrink-0 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <p className="text-[8px] text-slate-500 font-mono text-center mt-1.5 leading-none">
              Supports Drag-and-Drop files. Try typing <span className="text-indigo-400 font-bold">"switch to music"</span>.
            </p>
          </div>

        </section>

        {/* RIGHT COLUMN: 4/5 [Graph Workspace] (State_Visualization_Canvas) */}
        <section className="flex-1 flex flex-col lg:h-[820px] overflow-hidden min-w-0">
          
          {/* Main Workspace grid splitting visual canvas from sub-controls */}
          <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 min-h-0 overflow-hidden">
            
            {/* Visualizer Stage Container (Width: 7/12 inside 4/5th space) */}
            <div className="xl:col-span-8 flex flex-col bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg min-h-[500px] xl:h-full overflow-hidden">
              
              <div className="flex items-center justify-between mb-4 shrink-0">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">State_Visualization_Canvas</span>
                  <h2 className="text-md font-semibold text-slate-100 font-sans">Active Product Management Graph</h2>
                </div>

                <div className="flex items-center gap-2">
                  {userGuestStatus && (
                    <span className="flex items-center gap-1 text-[10px] font-mono bg-amber-950/40 text-amber-400 border border-amber-900/40 px-2 py-0.5 rounded">
                      <Lock className="w-3 h-3" /> User_Guest_Status = True
                    </span>
                  )}
                  {omarHitlStatus && (
                    <span className="flex items-center gap-1 text-[10px] font-mono bg-indigo-950 text-indigo-400 border border-indigo-900/40 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3 text-indigo-400" /> Omar_HITL_Status = True
                    </span>
                  )}
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono bg-slate-950 px-2.5 py-1 rounded border border-slate-850">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    ACTIVE FEEDBACK LOOP
                  </div>
                </div>
              </div>

              {/* Graphic Canvas Render Stage */}
              <div className="flex-1 bg-slate-950/30 rounded-xl border border-slate-850/60 p-3 flex flex-col justify-between overflow-hidden relative">
                
                {/* Visual Stage */}
                <div className="flex-1 flex flex-col justify-center min-h-[350px] overflow-auto">
                  <MermaidRenderer 
                    definition={getMermaidCode()} 
                    nodeIds={graph.nodes.map(n => n.id)}
                    onNodeClick={(nodeId) => {
                      const targetNode = graph.nodes.find(n => n.id === nodeId);
                      if (targetNode) {
                        setEditingNode(targetNode);
                      }
                    }}
                  />
                </div>

                {/* Interactive Node Index (Eye-Reduction Title-Only disclosure) */}
                <div className="mt-4 pt-4 border-t border-slate-850 shrink-0">
                  <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-2.5">
                    Interactive Node Index (Title-Only Disclosure Panel):
                  </span>
                  
                  <div className="flex flex-wrap gap-2">
                    {graph.nodes.map((n) => {
                      const isGovNode = n.id === 'GOV_NODE_01';
                      return (
                        <button
                          key={n.id}
                          onClick={() => setEditingNode(n)}
                          className={`text-[11px] font-mono font-medium py-1 px-3 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                            isGovNode
                              ? 'bg-indigo-950/40 hover:bg-indigo-900/40 border-indigo-500/35 text-indigo-300'
                              : n.layer === 'OP'
                              ? 'bg-emerald-950/20 hover:bg-emerald-900/25 border-emerald-900/40 text-emerald-400'
                              : n.layer === 'SYS'
                              ? 'bg-purple-950/20 hover:bg-purple-900/25 border-purple-900/40 text-purple-400'
                              : 'bg-slate-950 hover:bg-slate-900 border-slate-850 text-slate-300'
                          }`}
                        >
                          <span className="opacity-60">{n.id}:</span>
                          <span className="font-sans font-semibold truncate max-w-[130px]">{n.label.replace(`${n.id}: `, '')}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Temporal state governance log */}
              <div className="mt-4 shrink-0 bg-slate-950/40 border border-slate-850 rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <History className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Temporal State Governance Log (gitGraph audit trail)</span>
                </div>

                <div className="max-h-[100px] overflow-y-auto font-mono text-[10px] text-slate-400 space-y-1 pr-1.5 scrollbar-thin">
                  {changeHistory.map((log, index) => (
                    <div key={index} className="flex items-start gap-1.5 py-0.5 border-b border-slate-950 last:border-0">
                      <span className="text-indigo-400 font-bold shrink-0">➔</span>
                      <span className="leading-normal">{log}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Sidebar Controls & Forms (Width: 5/12 inside 4/5th space) */}
            <div className="xl:col-span-4 flex flex-col gap-6 xl:h-full overflow-hidden">
              
              {/* GOV_NODE_01 Dynamic Master Hypothesis Selector */}
              <div className="bg-slate-900 border border-indigo-900/20 rounded-xl p-5 shadow-md relative overflow-hidden shrink-0">
                <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-600/5 rounded-full blur-2xl"></div>
                
                <div className="flex items-center justify-between mb-2 relative z-10">
                  <span className="text-[10px] font-mono text-indigo-400 font-semibold tracking-wider flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" />
                    GOV_NODE_01: MASTER HYPOTHESIS
                  </span>
                  <span className="text-[9px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-900 px-2 py-0.5 rounded-full">
                    COUPLED GATEWAY
                  </span>
                </div>

                <div className="space-y-3 relative z-10">
                  {/* Media category branch switcher */}
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">1. Media category (Active branch)</label>
                    <div className="grid grid-cols-5 gap-1">
                      {govNode.branchingPaths?.map((path) => (
                        <button
                          key={path}
                          disabled={userGuestStatus}
                          onClick={() => updateJTBD({ mediaCategory: path })}
                          className={`py-1 rounded text-center text-[10px] font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                            activeBranch === path
                              ? 'bg-indigo-600 text-white shadow'
                              : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                          }`}
                        >
                          {path}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* JTBD outputs */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">2. Action</label>
                      <select
                        value={jtbd.actionType}
                        disabled={userGuestStatus}
                        onChange={(e) => updateJTBD({ actionType: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-850 text-slate-200 rounded-lg py-1 px-2 text-[11px] focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                      >
                        <option value="Generate">Generate</option>
                        <option value="Create">Create</option>
                        <option value="Synthesize">Synthesize</option>
                        <option value="Manipulate">Manipulate</option>
                        <option value="Transcribe">Transcribe</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">3. Output Type</label>
                      <input
                        type="text"
                        value={jtbd.outputType}
                        disabled={userGuestStatus}
                        onChange={(e) => updateJTBD({ outputType: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-850 text-slate-200 rounded-lg py-1 px-2 text-[11px] focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Governing loop rendering */}
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-850/80">
                    <span className="block text-[8px] font-mono text-indigo-400 font-bold uppercase mb-1">ACTIVE SYNTHESIZED LOOP STATEMENT:</span>
                    <p className="text-[10px] text-slate-300 font-sans italic leading-relaxed">
                      "Users in the <strong className="text-white">{activeBranch}</strong> domain need to <strong className="text-indigo-300">{jtbd.actionType}</strong> <strong className="text-white">{jtbd.outputType || '[Output]'}</strong> to maximize <strong className="text-emerald-400">{jtbd.growthMetric || '[Growth]'}</strong> which inherently validates <strong className="text-indigo-400">{jtbd.valueMetric || '[Value]'}</strong>."
                    </p>
                  </div>

                  {/* Active exploration constraints indicator */}
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-850/80">
                    <span className="block text-[8px] font-mono text-amber-500 font-bold uppercase mb-1.5">Active Exploration Friction Constraints:</span>
                    <div className="space-y-1.5">
                      {activeFriction.map((f, i) => (
                        <div key={i} className="flex gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-[10px] font-bold text-slate-200 leading-none">{f.name}</h4>
                            <p className="text-[9px] text-slate-500 mt-0.5 leading-normal">{f.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Builder Tabs (Design/Scafoold) Container */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md flex-1 flex flex-col min-h-[250px] overflow-hidden">
                
                <div className="flex border-b border-slate-850 mb-3 shrink-0">
                  <button
                    onClick={() => setActiveTab('design')}
                    className={`flex-1 py-1.5 text-center text-[10px] font-mono font-medium border-b-2 transition-all ${
                      activeTab === 'design'
                        ? 'border-indigo-500 text-slate-100'
                        : 'border-transparent text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    NODE / EDGE BUILDER
                  </button>
                  <button
                    onClick={() => setActiveTab('data')}
                    className={`flex-1 py-1.5 text-center text-[10px] font-mono font-medium border-b-2 transition-all ${
                      activeTab === 'data'
                        ? 'border-indigo-500 text-slate-100'
                        : 'border-transparent text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    DATA SCAFFOLDS ({graph.nodes.filter(n => n.dataPlaceholder || n.dataType).length})
                  </button>
                </div>

                {/* Tab content scrollable */}
                <div className="flex-1 overflow-y-auto scrollbar-thin space-y-4">
                  {userGuestStatus ? (
                    <div className="flex flex-col items-center justify-center text-center p-6 bg-slate-950/40 rounded-lg border border-slate-850 h-full">
                      <Lock className="w-8 h-8 text-amber-500 opacity-60 mb-2" />
                      <h4 className="text-xs font-mono font-bold text-slate-300">Observer Mode Active</h4>
                      <p className="text-[10px] text-slate-500 max-w-[200px] mt-1">
                        Editing forms are disabled. Shift access control to OMAR to add nodes or adjust data schemas.
                      </p>
                    </div>
                  ) : activeTab === 'design' ? (
                    <>
                      <NodeProposalForm
                        problemStatement={graph.problemStatement || ''}
                        currentNodes={graph.nodes}
                        currentEdges={graph.edges}
                        onAddNode={handleAddNode}
                      />

                      <EdgeConnectorForm
                        problemStatement={graph.problemStatement || ''}
                        currentNodes={graph.nodes}
                        onAddEdge={handleAddEdge}
                      />
                    </>
                  ) : (
                    <DataScaffoldTracker
                      nodes={graph.nodes}
                      onFulfillNode={handleFulfillNode}
                      onSaveNode={handleSaveNodeCommit}
                    />
                  )}
                </div>

              </div>

              {/* 20 References Library */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md h-[220px] shrink-0 flex flex-col overflow-hidden">
                
                <div className="flex items-center justify-between mb-2 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                    <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">20 Reference Library</h3>
                  </div>
                  
                  <select
                    value={refFilter}
                    onChange={(e) => setRefFilter(e.target.value)}
                    className="bg-slate-950 text-slate-400 font-mono text-[9px] border border-slate-850 rounded px-1 py-0.5 cursor-pointer focus:outline-none"
                  >
                    <option value="All">All Domains</option>
                    <option value="General">General</option>
                    <option value="Text">Text</option>
                    <option value="Music">Music</option>
                    <option value="Audio">Audio</option>
                    <option value="Video">Video</option>
                    <option value="Multimedia">Multimedia</option>
                  </select>
                </div>

                {/* References List Container */}
                <div className="flex-1 overflow-y-auto scrollbar-thin space-y-2 pr-1 text-[10px]">
                  {filteredReferences.map((ref) => {
                    const isLinked = govNode.references?.includes(ref.id);
                    return (
                      <div
                        key={ref.id}
                        className={`p-2 rounded border transition-all ${
                          isLinked 
                            ? 'bg-indigo-950/20 border-indigo-500/40 hover:bg-indigo-950/30' 
                            : 'bg-slate-950 border-slate-850 hover:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-0.5 font-mono text-[9px]">
                          <span className={`px-1 rounded font-bold ${isLinked ? 'bg-indigo-900 text-indigo-200' : 'bg-slate-850 text-slate-400'}`}>
                            {ref.id}
                          </span>
                          <span className="text-slate-500 uppercase">{ref.category}</span>
                        </div>
                        <h4 className="font-semibold text-slate-300 font-sans leading-tight">{ref.title}</h4>
                        <div className="mt-1 flex items-center justify-between text-[8px] text-slate-500">
                          <span>Focus: <strong className="text-slate-400">{ref.focusArea}</strong></span>
                          {ref.url && (
                            <a href={ref.url} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline flex items-center gap-0.5">
                              Source <ExternalLink className="w-2 h-2" />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

            </div>

          </div>

        </section>

      </div>

      {/* Overlaid Contextual Focus Portal */}
      {editingNode && (
        <ExpandingPortalCard
          node={editingNode}
          allNodes={graph.nodes}
          allEdges={graph.edges}
          isReadOnly={userGuestStatus}
          onClose={() => setEditingNode(null)}
          onSaveNode={handleSaveNodeCommit}
          onDeleteNode={handleDeleteNodeCommit}
          onJumpToNode={(nodeId) => {
            const nextNode = graph.nodes.find(n => n.id === nodeId);
            if (nextNode) {
              setEditingNode(nextNode);
            }
          }}
        />
      )}

    </div>
  );
}
