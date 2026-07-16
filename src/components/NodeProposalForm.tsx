import React, { useState } from 'react';
import { GraphNode, NodeType } from '../types';
import { Sparkles, Loader2, Check, ArrowRight } from 'lucide-react';

interface NodeProposalFormProps {
  problemStatement: string;
  currentNodes: GraphNode[];
  currentEdges: any[];
  onAddNode: (node: GraphNode) => void;
}

export const NodeProposalForm: React.FC<NodeProposalFormProps> = ({
  problemStatement,
  currentNodes,
  currentEdges,
  onAddNode,
}) => {
  const [layer, setLayer] = useState<'GOV' | 'MM' | 'OP' | 'SYS'>('MM');
  const [nodeType, setNodeType] = useState<NodeType>('MM_NODE');
  const [userPrompt, setUserPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Proposed node state (editable before adding)
  const [proposedNode, setProposedNode] = useState<Partial<GraphNode> | null>(null);

  // Change nodeType automatically when layer changes to make user experience logical
  const handleLayerChange = (newLayer: 'GOV' | 'MM' | 'OP' | 'SYS') => {
    setLayer(newLayer);
    if (newLayer === 'GOV') {
      setNodeType('GOV_NODE');
    } else if (newLayer === 'MM') {
      setNodeType('MM_NODE');
    } else if (newLayer === 'OP') {
      setNodeType('OP_NODE');
    } else if (newLayer === 'SYS') {
      setNodeType('SYS_NODE');
    }
  };

  const handleFetchProposal = async () => {
    if (!problemStatement) {
      setError("Please define the primary GOV_NODE (Problem Statement) first!");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/generate-node', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemStatement,
          currentNodes,
          currentEdges,
          layer,
          nodeType,
          userPrompt,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      
      setProposedNode({
        id: data.id,
        type: nodeType,
        label: data.label,
        description: data.description,
        layer: layer,
        dataType: data.dataType,
        priority: data.priority || 'P1',
        dataPlaceholder: data.dataPlaceholder,
        isCompleted: false,
        metadata: data.metadata || {},
      });
    } catch (err: any) {
      setError(err.message || 'Failed to generate proposal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualCreate = () => {
    const defaultId = `${layer}_${Math.floor(Math.random() * 1000)}`;
    setProposedNode({
      id: defaultId,
      type: nodeType,
      label: 'New Core Entity',
      description: 'Write the hypothesis or functional objective here...',
      layer: layer,
      dataType: 'Text',
      priority: 'P1',
      isCompleted: false,
      metadata: {
        threshold: '',
        sla: '',
        metrics: '',
      },
    });
  };

  const handleSaveNode = () => {
    if (!proposedNode || !proposedNode.id || !proposedNode.label) return;
    
    // Ensure unique ID
    const exists = currentNodes.some(n => n.id === proposedNode.id);
    const finalId = exists ? `${proposedNode.id}_NEW` : proposedNode.id;

    onAddNode({
      id: finalId,
      type: proposedNode.type || nodeType,
      label: proposedNode.label,
      description: proposedNode.description || '',
      layer: proposedNode.layer || layer,
      dataType: proposedNode.dataType,
      priority: proposedNode.priority as any || 'P1',
      dataPlaceholder: proposedNode.dataPlaceholder,
      isCompleted: false,
      metadata: proposedNode.metadata || {},
      compliance: {
        gdprEnabled: false,
        gdprDescription: "User has explicit double opt-in consent. Subject to Right to Be Forgotten and full portability.",
        cookiePolicyEnabled: false,
        cookiePolicyDescription: "Tracks essential session identifier cookies. Consents via footer banners before analytical tracking.",
        termsOfServiceEnabled: false,
        termsOfServiceDescription: "User agrees to fair-use policy, API limits, and platform content sharing guidelines.",
        privacyPolicyEnabled: false,
        privacyPolicyDescription: "Standard platform privacy policy stating data encryption at rest and strict non-sharing with third-party brokers.",
        copyrightEnabled: false,
        copyrightDescription: "Generated assets remain the joint copyright intellectual property of the author and platform."
      }
    });

    setProposedNode(null);
    setUserPrompt('');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-medium text-slate-100 flex items-center gap-2 mb-4 font-sans">
        <Sparkles className="w-5 h-5 text-indigo-400" />
        Design Next Graph Node
      </h3>

      {!proposedNode ? (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Target Layer</label>
            <div className="grid grid-cols-4 gap-2">
              {(['GOV', 'MM', 'OP', 'SYS'] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => handleLayerChange(l)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                    layer === l
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {l}_ Layer
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Node Type</label>
              <select
                value={nodeType}
                onChange={(e) => setNodeType(e.target.value as NodeType)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-indigo-500"
              >
                {layer === 'GOV' && <option value="GOV_NODE">GOV_NODE (Governing Input)</option>}
                {layer === 'MM' && (
                  <>
                    <option value="MM_NODE">MM_NODE (Mind Map Hypothesis)</option>
                    <option value="HITL_GATE">HITL_GATE (Omar's Manual Validation)</option>
                  </>
                )}
                {layer === 'OP' && (
                  <>
                    <option value="OP_NODE">OP_NODE (Operational Trigger)</option>
                    <option value="A_TRG">A_TRG (Automation Trigger)</option>
                    <option value="HITL_GATE">HITL_GATE (Human Gate)</option>
                  </>
                )}
                {layer === 'SYS' && (
                  <>
                    <option value="SYS_NODE">SYS_NODE (Technical Architecture)</option>
                    <option value="A_TRG">A_TRG (Decision Engine)</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Modality/Data Type</label>
              <select
                value={layer === 'SYS' ? 'Scalar' : 'Text'}
                disabled
                className="w-full bg-slate-950 border border-slate-800 text-slate-500 rounded-lg py-2 px-3 text-sm cursor-not-allowed"
              >
                <option value="Text">Standard (Plain text description)</option>
                <option value="Scalar">Scalar (Numerical constraints)</option>
                <option value="JSON">Multimodal Structure (JSON)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
              Context Prompt (Instruct Gemini to shape this node)
            </label>
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="e.g., An ML model assessing customer churn probability with P1 priority and a 0.85 F1 threshold."
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500 font-sans"
            />
          </div>

          {error && <p className="text-xs text-red-400 bg-red-950/20 p-2 rounded border border-red-900">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleFetchProposal}
              disabled={isLoading || !problemStatement}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Smart Proposal...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Request Proposal (Gemini API)
                </>
              )}
            </button>
            <button
              onClick={handleManualCreate}
              disabled={!problemStatement}
              className="px-4 bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
            >
              Manual Draft
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-slate-950 border border-indigo-900/30 rounded-lg p-4 mb-4">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono font-medium bg-indigo-950 text-indigo-400 mb-2 border border-indigo-900">
              PROPOSED NODE ({proposedNode.layer}_{proposedNode.type})
            </span>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1">Unique ID</label>
                <input
                  type="text"
                  value={proposedNode.id || ''}
                  onChange={(e) => setProposedNode({ ...proposedNode, id: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 font-mono rounded p-2 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1">Title (Label)</label>
                <input
                  type="text"
                  value={proposedNode.label || ''}
                  onChange={(e) => setProposedNode({ ...proposedNode, label: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded p-2 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1">Functional Description / Hypothesis</label>
                <textarea
                  value={proposedNode.description || ''}
                  onChange={(e) => setProposedNode({ ...proposedNode, description: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded p-2 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-500 mb-1">Priority</label>
                  <select
                    value={proposedNode.priority || 'P1'}
                    onChange={(e) => setProposedNode({ ...proposedNode, priority: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded p-2 text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="P1">P1 (Critical)</option>
                    <option value="P2">P2 (Moderate)</option>
                    <option value="P3">P3 (Secondary)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 mb-1">Data Placeholder</label>
                  <input
                    type="text"
                    value={proposedNode.dataPlaceholder || ''}
                    placeholder="e.g. [INPUT: Customer_Docs]"
                    onChange={(e) => setProposedNode({ ...proposedNode, dataPlaceholder: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 font-mono rounded p-2 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="block text-xs font-mono font-medium text-slate-400 mb-2">METADATA ENCAPSULATION</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase">Threshold</label>
                    <input
                      type="text"
                      value={proposedNode.metadata?.threshold || ''}
                      onChange={(e) =>
                        setProposedNode({
                          ...proposedNode,
                          metadata: { ...proposedNode.metadata, threshold: e.target.value },
                        })
                      }
                      placeholder="e.g. > 0.85"
                      className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded p-1.5 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase">SLA</label>
                    <input
                      type="text"
                      value={proposedNode.metadata?.sla || ''}
                      onChange={(e) =>
                        setProposedNode({
                          ...proposedNode,
                          metadata: { ...proposedNode.metadata, sla: e.target.value },
                        })
                      }
                      placeholder="e.g. <200ms"
                      className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded p-1.5 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase">Metrics</label>
                    <input
                      type="text"
                      value={proposedNode.metadata?.metrics || ''}
                      onChange={(e) =>
                        setProposedNode({
                          ...proposedNode,
                          metadata: { ...proposedNode.metadata, metrics: e.target.value },
                        })
                      }
                      placeholder="e.g. f1-score"
                      className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded p-1.5 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSaveNode}
              className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 shadow"
            >
              <Check className="w-4 h-4" />
              Accept Node (Deploy Draft)
            </button>
            <button
              onClick={() => setProposedNode(null)}
              className="px-4 bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 py-2 rounded-lg text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
