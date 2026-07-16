import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { GraphNode, GraphEdge } from '../types';
import { REFERENCES_DATABASE } from '../referencesData';
import { 
  X, 
  Settings, 
  Activity, 
  BookOpen, 
  Check, 
  Trash2, 
  Sparkles, 
  ShieldCheck, 
  Cpu,
  ArrowRight,
  Lock,
  GitCommit,
  Eye
} from 'lucide-react';

interface ExpandingPortalCardProps {
  node: GraphNode;
  onClose: () => void;
  onSaveNode: (updatedNode: GraphNode, commitMsg: string) => void;
  onDeleteNode: (nodeId: string) => void;
  isReadOnly?: boolean;
  allEdges?: GraphEdge[];
  allNodes?: GraphNode[];
  onJumpToNode?: (nodeId: string) => void;
}

export const ExpandingPortalCard: React.FC<ExpandingPortalCardProps> = ({
  node,
  onClose,
  onSaveNode,
  onDeleteNode,
  isReadOnly = false,
  allEdges = [],
  allNodes = [],
  onJumpToNode,
}) => {
  const [activeTab, setActiveTab] = useState<'attributes' | 'math' | 'references' | 'compliance'>('attributes');
  
  // Local editable state for attributes
  const [label, setLabel] = useState(node.label);
  const [description, setDescription] = useState(node.description);
  const [dataType, setDataType] = useState(node.dataType || 'JSON');
  const [priority, setPriority] = useState<'P1' | 'P2' | 'P3'>(node.priority || 'P2');
  const [dataOrigin, setDataOrigin] = useState(node.metadata?.dataOrigin || 'User HITL');
  const [complexity, setComplexity] = useState(node.metadata?.complexity || 'Medium');
  const [noveltyAnchor, setNoveltyAnchor] = useState<number>(Number(node.metadata?.noveltyAnchor || 0.85));
  const [validationThreshold, setValidationThreshold] = useState<number>(Number(node.metadata?.validationThreshold || 0.70));
  const [cronFrequency, setCronFrequency] = useState(node.metadata?.cronFrequency || '0 0 * * *');
  const [demographics, setDemographics] = useState<string>(node.metadata?.demographics ? node.metadata.demographics.join(', ') : 'Tech Enthusiasts');
  const [downstreamImpact, setDownstreamImpact] = useState<number>(Number(node.metadata?.downstreamImpact || 1.0));
  const [isCompleted, setIsCompleted] = useState(node.isCompleted);

  // Compliance Layer State variables
  const [gdprEnabled, setGdprEnabled] = useState<boolean>(node.compliance?.gdprEnabled ?? false);
  const [gdprDescription, setGdprDescription] = useState<string>(node.compliance?.gdprDescription ?? "User has explicit double opt-in consent. Subject to Right to Be Forgotten and full portability.");
  const [cookiePolicyEnabled, setCookiePolicyEnabled] = useState<boolean>(node.compliance?.cookiePolicyEnabled ?? false);
  const [cookiePolicyDescription, setCookiePolicyDescription] = useState<string>(node.compliance?.cookiePolicyDescription ?? "Tracks essential session identifier cookies. Consents via footer banners before analytical tracking.");
  const [termsOfServiceEnabled, setTermsOfServiceEnabled] = useState<boolean>(node.compliance?.termsOfServiceEnabled ?? false);
  const [termsOfServiceDescription, setTermsOfServiceDescription] = useState<string>(node.compliance?.termsOfServiceDescription ?? "User agrees to fair-use policy, API limits, and platform content sharing guidelines.");
  const [privacyPolicyEnabled, setPrivacyPolicyEnabled] = useState<boolean>(node.compliance?.privacyPolicyEnabled ?? false);
  const [privacyPolicyDescription, setPrivacyPolicyDescription] = useState<string>(node.compliance?.privacyPolicyDescription ?? "Standard platform privacy policy stating data encryption at rest and strict non-sharing with third-party brokers.");
  const [copyrightEnabled, setCopyrightEnabled] = useState<boolean>(node.compliance?.copyrightEnabled ?? false);
  const [copyrightDescription, setCopyrightDescription] = useState<string>(node.compliance?.copyrightDescription ?? "Generated assets remain the joint copyright intellectual property of the author and platform.");

  // Math Upgrade State (Pragmatic-to-SOTA)
  const [activeMathUpgrade, setActiveMathUpgrade] = useState<string>(node.metadata?.activeMathUpgrade || 'Baseline');

  // Grounded SOTA References State
  const [linkedRefs, setLinkedRefs] = useState<string[]>(node.references || []);

  // Synchronize local states when the selected node changes (supports relational traversing)
  useEffect(() => {
    setLabel(node.label);
    setDescription(node.description);
    setDataType(node.dataType || 'JSON');
    setPriority(node.priority || 'P2');
    setDataOrigin(node.metadata?.dataOrigin || 'User HITL');
    setComplexity(node.metadata?.complexity || 'Medium');
    setNoveltyAnchor(Number(node.metadata?.noveltyAnchor || 0.85));
    setValidationThreshold(Number(node.metadata?.validationThreshold || 0.70));
    setCronFrequency(node.metadata?.cronFrequency || '0 0 * * *');
    setDemographics(node.metadata?.demographics ? node.metadata.demographics.join(', ') : 'Tech Enthusiasts');
    setDownstreamImpact(Number(node.metadata?.downstreamImpact || 1.0));
    setIsCompleted(node.isCompleted);
    
    setGdprEnabled(node.compliance?.gdprEnabled ?? false);
    setGdprDescription(node.compliance?.gdprDescription ?? "User has explicit double opt-in consent. Subject to Right to Be Forgotten and full portability.");
    setCookiePolicyEnabled(node.compliance?.cookiePolicyEnabled ?? false);
    setCookiePolicyDescription(node.compliance?.cookiePolicyDescription ?? "Tracks essential session identifier cookies. Consents via footer banners before analytical tracking.");
    setTermsOfServiceEnabled(node.compliance?.termsOfServiceEnabled ?? false);
    setTermsOfServiceDescription(node.compliance?.termsOfServiceDescription ?? "User agrees to fair-use policy, API limits, and platform content sharing guidelines.");
    setPrivacyPolicyEnabled(node.compliance?.privacyPolicyEnabled ?? false);
    setPrivacyPolicyDescription(node.compliance?.privacyPolicyDescription ?? "Standard platform privacy policy stating data encryption at rest and strict non-sharing with third-party brokers.");
    setCopyrightEnabled(node.compliance?.copyrightEnabled ?? false);
    setCopyrightDescription(node.compliance?.copyrightDescription ?? "Generated assets remain the joint copyright intellectual property of the author and platform.");

    setActiveMathUpgrade(node.metadata?.activeMathUpgrade || 'Baseline');
    setLinkedRefs(node.references || []);
  }, [node]);

  const handleToggleRef = (refId: string) => {
    if (isReadOnly) return;
    setLinkedRefs(prev => 
      prev.includes(refId) ? prev.filter(r => r !== refId) : [...prev, refId]
    );
  };

  const handleSave = () => {
    if (isReadOnly) return;
    const updatedNode: GraphNode = {
      ...node,
      label,
      description,
      dataType,
      priority,
      isCompleted,
      references: linkedRefs,
      metadata: {
        ...node.metadata,
        dataOrigin,
        complexity,
        noveltyAnchor: String(noveltyAnchor),
        validationThreshold: String(validationThreshold),
        cronFrequency,
        demographics: demographics.split(',').map(s => s.trim()).filter(Boolean),
        downstreamImpact: String(downstreamImpact),
        activeMathUpgrade,
      },
      compliance: {
        gdprEnabled,
        gdprDescription,
        cookiePolicyEnabled,
        cookiePolicyDescription,
        termsOfServiceEnabled,
        termsOfServiceDescription,
        privacyPolicyEnabled,
        privacyPolicyDescription,
        copyrightEnabled,
        copyrightDescription,
      }
    };

    const commitMsg = `COMMIT_NODE: Saved changes to node "${node.id}". Attributes updated, Math Upgrade set to "${activeMathUpgrade}", References grounded: [${linkedRefs.join(', ')}]. Compliance documents: [${[
      gdprEnabled && 'GDPR',
      cookiePolicyEnabled && 'Cookies',
      termsOfServiceEnabled && 'ToS',
      privacyPolicyEnabled && 'Privacy',
      copyrightEnabled && 'Copyright'
    ].filter(Boolean).join(', ') || 'None'}].`;
    onSaveNode(updatedNode, commitMsg);
  };

  const getLayerColorClass = () => {
    switch (node.layer) {
      case 'GOV': return 'border-indigo-500/50 text-indigo-400 bg-indigo-950/20';
      case 'MM': return 'border-blue-500/50 text-blue-400 bg-blue-950/20';
      case 'OP': return 'border-emerald-500/50 text-emerald-400 bg-emerald-950/20';
      case 'SYS': return 'border-purple-500/50 text-purple-400 bg-purple-950/20';
      default: return 'border-slate-500/50 text-slate-400 bg-slate-950/20';
    }
  };

  const isStrategic = node.layer === 'GOV' || node.layer === 'MM';

  // Compute relational context
  const incomingEdges = allEdges.filter(e => e.to === node.id);
  const outgoingEdges = allEdges.filter(e => e.from === node.id);

  return (
    <div id={`portal-card-${node.id}`} className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="bg-slate-900 border border-slate-800 rounded-xl max-w-3xl w-full shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="border-b border-slate-800 p-5 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 text-xs font-mono font-bold border rounded-full ${getLayerColorClass()}`}>
              {node.id}
            </span>
            <div>
              <h3 className="text-md font-semibold text-slate-100 font-sans tracking-tight">
                {label || 'Unnamed Node'}
              </h3>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mt-0.5 flex items-center gap-1.5">
                <span>{isStrategic ? 'Strategic Validation Track' : 'Operational Data Core Track'}</span>
                {node.type === 'Master_Hypothesis_Selector' && <span className="text-indigo-400">• Master Coupling Node</span>}
                {isReadOnly && (
                  <span className="flex items-center gap-1 text-amber-500 bg-amber-950/40 px-1.5 py-0.2 rounded border border-amber-900/30">
                    <Lock className="w-2.5 h-2.5" /> OBSERVER_MODE (READ-ONLY)
                  </span>
                )}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Read-only Alert banner if applicable */}
        {isReadOnly && (
          <div className="bg-amber-950/20 border-b border-amber-900/30 px-5 py-2 text-[11px] text-amber-400 font-mono flex items-center gap-2">
            <Eye className="w-3.5 h-3.5" />
            <span>Observer Mode is Active (User_Guest_Status = True). Read-only access to all attributes. Shift access control to OMAR in the workspace to make edits.</span>
          </div>
        )}

        {/* Dynamic Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/20 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('attributes')}
            className={`flex-1 py-3 px-2 text-center text-xs font-mono font-medium border-b-2 flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'attributes'
                ? 'border-indigo-500 text-slate-100 bg-slate-900/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            1. DATA ATTRIBUTES
          </button>
          <button
            onClick={() => setActiveTab('math')}
            className={`flex-1 py-3 px-2 text-center text-xs font-mono font-medium border-b-2 flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'math'
                ? 'border-indigo-500 text-slate-100 bg-slate-900/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            2. MATH UPGRADES
          </button>
          <button
            onClick={() => setActiveTab('references')}
            className={`flex-1 py-3 px-2 text-center text-xs font-mono font-medium border-b-2 flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'references'
                ? 'border-indigo-500 text-slate-100 bg-slate-900/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            3. SOTA REFERENCES ({linkedRefs.length})
          </button>
          <button
            onClick={() => setActiveTab('compliance')}
            className={`flex-1 py-3 px-2 text-center text-xs font-mono font-medium border-b-2 flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'compliance'
                ? 'border-indigo-500 text-slate-100 bg-slate-900/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            4. COMPLIANCE & PRIVACY
          </button>
        </div>

        {/* Scrollable Tab Panel Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-900/40">
          
          {/* Layer 1: Common Data Attributes Form */}
          {activeTab === 'attributes' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-4"
            >
              {/* Form fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Node Title Label</label>
                  <input
                    type="text"
                    value={label}
                    disabled={isReadOnly}
                    onChange={(e) => setLabel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Input/Output Data Type</label>
                  <select
                    value={dataType}
                    disabled={isReadOnly}
                    onChange={(e) => setDataType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                  >
                    <option value="JSON">JSON Schema</option>
                    <option value="Scalar">Scalar Number</option>
                    <option value="Vector">Vector Embedding</option>
                    <option value="Markdown">Markdown Text</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Strategic & Operational Goal Description</label>
                <textarea
                  value={description}
                  disabled={isReadOnly}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                  placeholder="Describe the functional hypothesis or data-generation purpose..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Priority Rank</label>
                  <select
                    value={priority}
                    disabled={isReadOnly}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                  >
                    <option value="P1">P1 - SOTA Critical</option>
                    <option value="P2">P2 - Standard Pipeline</option>
                    <option value="P3">P3 - Auxiliary/Logging</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Data Origin / Source</label>
                  <select
                    value={dataOrigin}
                    disabled={isReadOnly}
                    onChange={(e) => setDataOrigin(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                  >
                    <option value="User HITL">User HITL</option>
                    <option value="External API">External API</option>
                    <option value="Synthetic (Temporary Bridge)">Synthetic (Bridge)</option>
                    <option value="Scraping">Web Scraping</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Structural Complexity</label>
                  <select
                    value={complexity}
                    disabled={isReadOnly}
                    onChange={(e) => setComplexity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                  >
                    <option value="Low">Low (Linear Map)</option>
                    <option value="Medium">Medium (DAG Stage)</option>
                    <option value="High">High (Feedback Loop)</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-slate-800/60 my-2 pt-4"></div>

              <div className="grid grid-cols-2 gap-6">
                {/* Sliders with direct real-time metric visual render */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-400 uppercase tracking-wider">Semantic Novelty Anchor</span>
                    <span className="text-indigo-400 font-bold">{noveltyAnchor.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    disabled={isReadOnly}
                    value={noveltyAnchor}
                    onChange={(e) => setNoveltyAnchor(Number(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 disabled:opacity-40"
                  />
                  
                  {/* REAL-TIME VISUAL METRIC GAUGE */}
                  <div className="pt-1.5 flex items-center gap-2">
                    <div className="flex-1 bg-slate-950 h-2 rounded overflow-hidden border border-slate-800">
                      <div 
                        className="bg-indigo-500 h-full transition-all duration-150" 
                        style={{ width: `${noveltyAnchor * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-indigo-400 font-mono font-bold w-6 text-right">{(noveltyAnchor * 100).toFixed(0)}%</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-sans leading-none">Embedding distance threshold constraint to prevent generic clichés.</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-400 uppercase tracking-wider">Validation Threshold</span>
                    <span className="text-indigo-400 font-bold">{validationThreshold.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    disabled={isReadOnly}
                    value={validationThreshold}
                    onChange={(e) => setValidationThreshold(Number(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 disabled:opacity-40"
                  />

                  {/* REAL-TIME VISUAL METRIC GAUGE */}
                  <div className="pt-1.5 flex items-center gap-2">
                    <div className="flex-1 bg-slate-950 h-2 rounded overflow-hidden border border-slate-800">
                      <div 
                        className="bg-emerald-500 h-full transition-all duration-150" 
                        style={{ width: `${validationThreshold * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold w-6 text-right">{(validationThreshold * 100).toFixed(0)}%</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-sans leading-none">Minimum analytical score trigger before initiating manual Omar HITL intervention.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Temporal Frequency (Cron/Trigger)</label>
                  <input
                    type="text"
                    value={cronFrequency}
                    disabled={isReadOnly}
                    onChange={(e) => setCronFrequency(e.target.value)}
                    placeholder="e.g. 0 0 * * * (Daily)"
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-indigo-500 font-mono disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Demographics Targeting (CSV)</label>
                  <input
                    type="text"
                    value={demographics}
                    disabled={isReadOnly}
                    onChange={(e) => setDemographics(e.target.value)}
                    placeholder="e.g. Tech Enthusiasts, Musicians"
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Node completion checkbox */}
              <div className="flex items-center gap-3 bg-slate-950 border border-slate-800/60 p-3 rounded-lg mt-2">
                <input
                  type="checkbox"
                  id="isCompletedCheck"
                  checked={isCompleted}
                  disabled={isReadOnly}
                  onChange={(e) => setIsCompleted(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-slate-800 rounded focus:ring-indigo-500 focus:ring-2 bg-slate-950 cursor-pointer disabled:opacity-40"
                />
                <label htmlFor="isCompletedCheck" className="text-xs font-medium text-slate-300 font-sans cursor-pointer select-none">
                  <strong>Acknowledge & Validate Operational Completeness:</strong> Confirm that this node's logic conforms to constraints.
                </label>
              </div>

              {/* RELATIONAL CONTEXT INTERACTIVE CONNECTIONS */}
              <div className="border-t border-slate-800/60 my-2 pt-4 space-y-2">
                <span className="block text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Relational Context: Connected Topology Nodes
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1.5">
                  {/* Incoming Nodes */}
                  <div className="bg-slate-950 rounded-lg p-3 border border-slate-850/80">
                    <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                      ⬅️ Incoming Connections ({incomingEdges.length})
                    </span>
                    {incomingEdges.length === 0 ? (
                      <span className="text-[11px] text-slate-500 font-sans italic block">No incoming connectors (Root Node)</span>
                    ) : (
                      <div className="space-y-1.5">
                        {incomingEdges.map(edge => {
                          const srcNode = allNodes.find(n => n.id === edge.from);
                          const isLoop = edge.type === 'FEEDBACK';
                          return (
                            <button
                              key={edge.id}
                              onClick={() => onJumpToNode && onJumpToNode(edge.from)}
                              className="w-full text-left bg-slate-900 hover:bg-slate-850 border border-slate-800/60 rounded p-1.5 flex items-center justify-between text-xs transition-all cursor-pointer"
                            >
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="font-mono text-[10px] bg-slate-800 text-slate-300 px-1 py-0.2 rounded shrink-0">{edge.from}</span>
                                <span className="truncate text-slate-200 font-sans">{srcNode ? srcNode.label.replace(`${edge.from}: `, '') : 'Linked Node'}</span>
                              </div>
                              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase shrink-0 ${
                                isLoop ? 'bg-amber-950 text-amber-400' : 'bg-slate-800 text-slate-400'
                              }`}>
                                {isLoop ? 'Loop transition' : 'Static data'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Outgoing Nodes */}
                  <div className="bg-slate-950 rounded-lg p-3 border border-slate-850/80">
                    <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                      ➡️ Outgoing Connections ({outgoingEdges.length})
                    </span>
                    {outgoingEdges.length === 0 ? (
                      <span className="text-[11px] text-slate-500 font-sans italic block">No outgoing connectors (Terminal Node)</span>
                    ) : (
                      <div className="space-y-1.5">
                        {outgoingEdges.map(edge => {
                          const tgtNode = allNodes.find(n => n.id === edge.to);
                          const isLoop = edge.type === 'FEEDBACK';
                          return (
                            <button
                              key={edge.id}
                              onClick={() => onJumpToNode && onJumpToNode(edge.to)}
                              className="w-full text-left bg-slate-900 hover:bg-slate-850 border border-slate-800/60 rounded p-1.5 flex items-center justify-between text-xs transition-all cursor-pointer"
                            >
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="font-mono text-[10px] bg-slate-800 text-slate-300 px-1 py-0.2 rounded shrink-0">{edge.to}</span>
                                <span className="truncate text-slate-200 font-sans">{tgtNode ? tgtNode.label.replace(`${edge.to}: `, '') : 'Linked Node'}</span>
                              </div>
                              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase shrink-0 ${
                                isLoop ? 'bg-amber-950 text-amber-400' : 'bg-slate-800 text-slate-400'
                              }`}>
                                {isLoop ? 'Loop transition' : 'Static data'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Layer 2: Mathematical Progression Upgrades */}
          {activeTab === 'math' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-4"
            >
              <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex items-start gap-3">
                <Cpu className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200">Pragmatic-to-SOTA Math Protocol</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-1 font-sans">
                    Nodes begin using intuitive Baseline formulas (e.g., standard arithmetic averages). You can upgrade the statistical sophistication on demand using the hot-swappable math selectors below.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">Select active mathematical curve formula:</label>
                
                {/* Option 1: Baseline */}
                <div 
                  onClick={() => !isReadOnly && setActiveMathUpgrade('Baseline')}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    activeMathUpgrade === 'Baseline'
                      ? 'bg-slate-950 border-indigo-500/60 shadow-md'
                      : 'bg-slate-950/40 border-slate-850 hover:border-slate-800'
                  } ${isReadOnly ? 'cursor-not-allowed opacity-80' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-200 font-mono">Baseline Arithmetic average</span>
                    {activeMathUpgrade === 'Baseline' && <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono uppercase">Active Baseline</span>}
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed mb-2">
                    Standard numeric average calculated across raw attributes. High transparency, easy tracking.
                  </p>
                  <div className="bg-slate-900/60 p-2 rounded text-[10px] font-mono text-indigo-400">
                    {"Formula: S = \\frac{1}{N} \\sum_{i=1}^{N} w_i \\cdot x_i"}
                  </div>
                </div>

                {/* Option 2: Cosine Similarity */}
                <div 
                  onClick={() => !isReadOnly && setActiveMathUpgrade('CosineSimilarity')}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    activeMathUpgrade === 'CosineSimilarity'
                      ? 'bg-indigo-950/15 border-indigo-500/60 shadow-md'
                      : 'bg-slate-950/40 border-slate-850 hover:border-slate-800'
                  } ${isReadOnly ? 'cursor-not-allowed opacity-80' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-indigo-300 font-mono">Option A: Latent Cosine Similarity</span>
                    {activeMathUpgrade === 'CosineSimilarity' && <span className="text-[10px] bg-indigo-900 text-indigo-200 px-1.5 py-0.5 rounded font-mono uppercase">SOTA Upgraded</span>}
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed mb-2">
                    Computes high-dimensional embedding distance in semantic latent space to verify Novelty constraints.
                  </p>
                  <div className="bg-slate-900/60 p-2 rounded text-[10px] font-mono text-indigo-400">
                    {"Formula: Similarity(a, b) = (a . b) / (||a|| ||b||)"}
                  </div>
                </div>

                {/* Option 3: Wasserstein Distance */}
                <div 
                  onClick={() => !isReadOnly && setActiveMathUpgrade('WassersteinDistance')}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    activeMathUpgrade === 'WassersteinDistance'
                      ? 'bg-indigo-950/15 border-indigo-500/60 shadow-md'
                      : 'bg-slate-950/40 border-slate-850 hover:border-slate-800'
                  } ${isReadOnly ? 'cursor-not-allowed opacity-80' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-indigo-300 font-mono">Option B: Earth Mover's (Wasserstein) Distance</span>
                    {activeMathUpgrade === 'WassersteinDistance' && <span className="text-[10px] bg-indigo-900 text-indigo-200 px-1.5 py-0.5 rounded font-mono uppercase">SOTA Upgraded</span>}
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed mb-2">
                    Evaluates spatial-temporal feedback drift between target demographics and generated output distributions.
                  </p>
                  <div className="bg-slate-900/60 p-2 rounded text-[10px] font-mono text-indigo-400">
                    {"Formula: W(Pr, Pg) = inf E[||x - y||] over joint distributions"}
                  </div>
                </div>

                {/* Option 4: Bayesian Recursive Estimator */}
                <div 
                  onClick={() => !isReadOnly && setActiveMathUpgrade('BayesianEstimation')}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    activeMathUpgrade === 'BayesianEstimation'
                      ? 'bg-indigo-950/15 border-indigo-500/60 shadow-md'
                      : 'bg-slate-950/40 border-slate-850 hover:border-slate-800'
                  } ${isReadOnly ? 'cursor-not-allowed opacity-80' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-indigo-300 font-mono">Option C: Bayesian Recursive Estimator</span>
                    {activeMathUpgrade === 'BayesianEstimation' && <span className="text-[10px] bg-indigo-900 text-indigo-200 px-1.5 py-0.5 rounded font-mono uppercase">SOTA Upgraded</span>}
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed mb-2">
                    Performs continuous probability updates as incoming audience metrics are ingested by the pipeline.
                  </p>
                  <div className="bg-slate-900/60 p-2 rounded text-[10px] font-mono text-indigo-400">
                    {"Formula: P(H_t | D_1:t) \u221d P(D_t | H_t) . P(H_t-1 | D_1:t-1)"}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Layer 3: Grounded Reference Mapping */}
          {activeTab === 'references' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-4"
            >
              <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 flex items-center gap-1.5 mb-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  SOTA Grounding Mandate
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  The 20-SOTA Reference Clause prevents ungrounded development. Toggle references in our seed database to link research validation anchors directly to this node's logical flow.
                </p>
              </div>

              <div className="space-y-2">
                <span className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Foundational Reference Seed Databases:</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
                  {REFERENCES_DATABASE.map((ref) => {
                    const isChecked = linkedRefs.includes(ref.id);
                    return (
                      <div
                        key={ref.id}
                        onClick={() => handleToggleRef(ref.id)}
                        className={`p-3 rounded-lg border flex items-start gap-2 transition-all ${
                          isChecked
                            ? 'bg-indigo-950/20 border-indigo-500/50'
                            : 'bg-slate-950 border-slate-850/70 hover:border-slate-800'
                        } ${isReadOnly ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-all ${
                          isChecked ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-800'
                        }`}>
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[9px] font-mono font-bold bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                              {ref.id}
                            </span>
                            <span className="text-[9px] text-slate-500 font-mono uppercase truncate">{ref.mediaCategory}</span>
                          </div>
                          <h5 className="text-xs font-semibold text-slate-200 leading-snug mt-1 truncate font-sans">{ref.title}</h5>
                          <p className="text-[10px] text-slate-500 truncate font-sans mt-0.5">Focus: {ref.focusArea}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Layer 4: Compliance & Privacy Guardrails */}
          {activeTab === 'compliance' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-5"
            >
              <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  Regulatory Compliance & Privacy Guardrails
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Configure real-time compliance documents and attributes. This binds operational and legal guardrails directly to the node data-generation or input interface.
                </p>
              </div>

              <div className="space-y-4">
                {/* 1. GDPR Consent Policy */}
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-850/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="gdprEnabledCheck"
                        checked={gdprEnabled}
                        disabled={isReadOnly}
                        onChange={(e) => setGdprEnabled(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-slate-800 rounded focus:ring-indigo-500 bg-slate-950 cursor-pointer disabled:opacity-40"
                      />
                      <label htmlFor="gdprEnabledCheck" className="text-xs font-bold text-slate-200 font-mono cursor-pointer select-none">
                        GDPR Consent & Portability
                      </label>
                    </div>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      gdprEnabled ? 'bg-indigo-950 text-indigo-400 border border-indigo-900/40' : 'bg-slate-900 text-slate-500'
                    }`}>
                      {gdprEnabled ? 'ENFORCED' : 'DISABLED'}
                    </span>
                  </div>
                  {gdprEnabled && (
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono text-slate-500 uppercase">GDPR Policy Details</label>
                      <textarea
                        value={gdprDescription}
                        disabled={isReadOnly}
                        onChange={(e) => setGdprDescription(e.target.value)}
                        rows={2}
                        className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-2 text-xs focus:outline-none focus:border-indigo-500 font-sans disabled:opacity-50"
                        placeholder="Define how data erasure and portability rights are satisfied..."
                      />
                    </div>
                  )}
                </div>

                {/* 2. Cookie Consent Policy */}
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-850/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="cookiePolicyEnabledCheck"
                        checked={cookiePolicyEnabled}
                        disabled={isReadOnly}
                        onChange={(e) => setCookiePolicyEnabled(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-slate-800 rounded focus:ring-indigo-500 bg-slate-950 cursor-pointer disabled:opacity-40"
                      />
                      <label htmlFor="cookiePolicyEnabledCheck" className="text-xs font-bold text-slate-200 font-mono cursor-pointer select-none">
                        Cookie Policy & Tracking
                      </label>
                    </div>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      cookiePolicyEnabled ? 'bg-indigo-950 text-indigo-400 border border-indigo-900/40' : 'bg-slate-900 text-slate-500'
                    }`}>
                      {cookiePolicyEnabled ? 'ENFORCED' : 'DISABLED'}
                    </span>
                  </div>
                  {cookiePolicyEnabled && (
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono text-slate-500 uppercase">Cookie Requirements</label>
                      <textarea
                        value={cookiePolicyDescription}
                        disabled={isReadOnly}
                        onChange={(e) => setCookiePolicyDescription(e.target.value)}
                        rows={2}
                        className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-2 text-xs focus:outline-none focus:border-indigo-500 font-sans disabled:opacity-50"
                        placeholder="Define cookie list and pre-consent blocking mechanisms..."
                      />
                    </div>
                  )}
                </div>

                {/* 3. Terms of Service */}
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-850/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="termsOfServiceEnabledCheck"
                        checked={termsOfServiceEnabled}
                        disabled={isReadOnly}
                        onChange={(e) => setTermsOfServiceEnabled(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-slate-800 rounded focus:ring-indigo-500 bg-slate-950 cursor-pointer disabled:opacity-40"
                      />
                      <label htmlFor="termsOfServiceEnabledCheck" className="text-xs font-bold text-slate-200 font-mono cursor-pointer select-none">
                        Terms of Service (ToS)
                      </label>
                    </div>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      termsOfServiceEnabled ? 'bg-indigo-950 text-indigo-400 border border-indigo-900/40' : 'bg-slate-900 text-slate-500'
                    }`}>
                      {termsOfServiceEnabled ? 'ENFORCED' : 'DISABLED'}
                    </span>
                  </div>
                  {termsOfServiceEnabled && (
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono text-slate-500 uppercase">ToS Guidelines</label>
                      <textarea
                        value={termsOfServiceDescription}
                        disabled={isReadOnly}
                        onChange={(e) => setTermsOfServiceDescription(e.target.value)}
                        rows={2}
                        className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-2 text-xs focus:outline-none focus:border-indigo-500 font-sans disabled:opacity-50"
                        placeholder="Define user behavior limits, API fair-use quotas, and liabilities..."
                      />
                    </div>
                  )}
                </div>

                {/* 4. Privacy Policy */}
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-850/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="privacyPolicyEnabledCheck"
                        checked={privacyPolicyEnabled}
                        disabled={isReadOnly}
                        onChange={(e) => setPrivacyPolicyEnabled(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-slate-800 rounded focus:ring-indigo-500 bg-slate-950 cursor-pointer disabled:opacity-40"
                      />
                      <label htmlFor="privacyPolicyEnabledCheck" className="text-xs font-bold text-slate-200 font-mono cursor-pointer select-none">
                        Privacy Policy & Encryption
                      </label>
                    </div>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      privacyPolicyEnabled ? 'bg-indigo-950 text-indigo-400 border border-indigo-900/40' : 'bg-slate-900 text-slate-500'
                    }`}>
                      {privacyPolicyEnabled ? 'ENFORCED' : 'DISABLED'}
                    </span>
                  </div>
                  {privacyPolicyEnabled && (
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono text-slate-500 uppercase">Privacy & Data Sovereignty Details</label>
                      <textarea
                        value={privacyPolicyDescription}
                        disabled={isReadOnly}
                        onChange={(e) => setPrivacyPolicyDescription(e.target.value)}
                        rows={2}
                        className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-2 text-xs focus:outline-none focus:border-indigo-500 font-sans disabled:opacity-50"
                        placeholder="Specify encryption standards and secure hosting boundaries..."
                      />
                    </div>
                  )}
                </div>

                {/* 5. Copyright Safeguards */}
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-850/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="copyrightEnabledCheck"
                        checked={copyrightEnabled}
                        disabled={isReadOnly}
                        onChange={(e) => setCopyrightEnabled(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-slate-800 rounded focus:ring-indigo-500 bg-slate-950 cursor-pointer disabled:opacity-40"
                      />
                      <label htmlFor="copyrightEnabledCheck" className="text-xs font-bold text-slate-200 font-mono cursor-pointer select-none">
                        Copyright & Intellectual Property
                      </label>
                    </div>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      copyrightEnabled ? 'bg-indigo-950 text-indigo-400 border border-indigo-900/40' : 'bg-slate-900 text-slate-500'
                    }`}>
                      {copyrightEnabled ? 'ENFORCED' : 'DISABLED'}
                    </span>
                  </div>
                  {copyrightEnabled && (
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono text-slate-500 uppercase">IP & License Attribution</label>
                      <textarea
                        value={copyrightDescription}
                        disabled={isReadOnly}
                        onChange={(e) => setCopyrightDescription(e.target.value)}
                        rows={2}
                        className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-2 text-xs focus:outline-none focus:border-indigo-500 font-sans disabled:opacity-50"
                        placeholder="Define creator retention rights or commercial licenses..."
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 p-5 bg-slate-950/40 flex items-center justify-between shrink-0">
          <button
            onClick={() => {
              if (isReadOnly) return;
              if (confirm('Delete Node: Are you absolutely sure? This will break adjacent connectors in the topology.')) {
                onDeleteNode(node.id);
              }
            }}
            disabled={node.id === 'GOV_NODE_01' || isReadOnly}
            className="flex items-center gap-1.5 text-xs text-red-400 bg-red-950/20 hover:bg-red-950/45 border border-red-900/30 py-2 px-3 rounded-lg transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Node
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 py-2 px-4 rounded-lg text-xs font-mono transition-all cursor-pointer"
            >
              Close Portal
            </button>
            {!isReadOnly && (
              <button
                onClick={handleSave}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-sans py-2 px-5 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Save State Commit
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
