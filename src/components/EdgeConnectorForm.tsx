import React, { useState, useEffect } from 'react';
import { GraphNode, GraphEdge } from '../types';
import { Link2, Sparkles, Loader2, Plus, AlertCircle } from 'lucide-react';

interface EdgeConnectorFormProps {
  problemStatement: string;
  currentNodes: GraphNode[];
  onAddEdge: (edge: GraphEdge) => void;
}

export const EdgeConnectorForm: React.FC<EdgeConnectorFormProps> = ({
  problemStatement,
  currentNodes,
  onAddEdge,
}) => {
  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [edgeLabel, setEdgeLabel] = useState('');
  const [edgeType, setEdgeType] = useState<'STANDARD' | 'C_EDGE' | 'FEEDBACK'>('STANDARD');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  // Set default values when nodes update
  useEffect(() => {
    if (currentNodes.length >= 2) {
      setSourceId(currentNodes[currentNodes.length - 2].id);
      setTargetId(currentNodes[currentNodes.length - 1].id);
    } else if (currentNodes.length === 1) {
      setSourceId(currentNodes[0].id);
    }
  }, [currentNodes]);

  const handleFetchSuggestion = async () => {
    if (!sourceId || !targetId) {
      setError("Please select both source and target nodes to connect!");
      return;
    }
    setIsLoading(true);
    setError(null);
    setAiSuggestion(null);

    const sourceNode = currentNodes.find(n => n.id === sourceId);
    const targetNode = currentNodes.find(n => n.id === targetId);

    try {
      const res = await fetch('/api/suggest-edge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemStatement,
          sourceNode,
          targetNode,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      
      setEdgeLabel(data.label || '');
      setEdgeType(data.edgeType || 'STANDARD');
      setAiSuggestion(data.reasoning || '');
    } catch (err: any) {
      setError(err.message || 'Failed to generate edge suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEdge = () => {
    if (!sourceId || !targetId) return;
    if (sourceId === targetId) {
      setError("Self-referential loops should utilize 'FEEDBACK' type and must connect distinct logic checkpoints.");
      return;
    }

    onAddEdge({
      id: `edge_${sourceId}_${targetId}_${Math.floor(Math.random() * 1000)}`,
      from: sourceId,
      to: targetId,
      label: edgeLabel || undefined,
      type: edgeType,
    });

    setEdgeLabel('');
    setAiSuggestion(null);
  };

  if (currentNodes.length < 2) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center text-slate-500">
        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-600" />
        <p className="text-sm">Connective Edge Engine requires at least two nodes to orchestrate relations.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-medium text-slate-100 flex items-center gap-2 mb-4 font-sans">
        <Link2 className="w-5 h-5 text-indigo-400" />
        Form Connective Edges & Constraints
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Source Node (A)</label>
            <select
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-indigo-500 font-mono"
            >
              {currentNodes.map((n) => (
                <option key={n.id} value={n.id}>
                  [{n.layer}] {n.id} - {n.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Target Node (B)</label>
            <select
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-indigo-500 font-mono"
            >
              {currentNodes.map((n) => (
                <option key={n.id} value={n.id}>
                  [{n.layer}] {n.id} - {n.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Edge Type</label>
          <div className="grid grid-cols-3 gap-2">
            {(['STANDARD', 'C_EDGE', 'FEEDBACK'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setEdgeType(t)}
                className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                  edgeType === t
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {t === 'STANDARD' && 'Standard Execution (-->)'}
                {t === 'C_EDGE' && 'Constraint Rules (-->)'}
                {t === 'FEEDBACK' && 'Feedback Loop (-.->)'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
            Constraint / Trigger Condition Label
          </label>
          <input
            type="text"
            value={edgeLabel}
            onChange={(e) => setEdgeLabel(e.target.value)}
            placeholder="e.g., [C: F1-score > 0.85] or [INPUT: Customer_CSV]"
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        {error && <p className="text-xs text-red-400 bg-red-950/20 p-2 rounded border border-red-900">{error}</p>}

        {aiSuggestion && (
          <div className="bg-indigo-950/30 border border-indigo-900/50 rounded-lg p-3.5">
            <span className="block text-xs font-mono font-medium text-indigo-400 mb-1">LEAD ARCHITECT RATIONALE:</span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{aiSuggestion}</p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleFetchSuggestion}
            disabled={isLoading || !sourceId || !targetId}
            className="flex-1 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 py-2 px-4 rounded-lg font-medium text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Calculating Edge Logic...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Deduce Constraint (AI)
              </>
            )}
          </button>

          <button
            onClick={handleAddEdge}
            disabled={!sourceId || !targetId}
            className="bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-5 rounded-lg font-medium text-xs flex items-center justify-center gap-1.5 shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            Establish Edge Connection
          </button>
        </div>
      </div>
    </div>
  );
};
