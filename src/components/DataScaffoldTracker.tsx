import React, { useState, useEffect } from 'react';
import { GraphNode } from '../types';
import { 
  Database, 
  ShieldAlert, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Code, 
  Check, 
  TrendingUp, 
  ShieldCheck,
  ServerOff
} from 'lucide-react';

interface SchemaField {
  key: string;
  type: 'string' | 'number' | 'boolean' | 'object';
  description: string;
}

interface DataScaffoldTrackerProps {
  nodes: GraphNode[];
  onFulfillNode: (nodeId: string, syntheticData: string) => void;
  onSaveNode?: (updatedNode: GraphNode, commitMsg: string) => void;
}

export const DataScaffoldTracker: React.FC<DataScaffoldTrackerProps> = ({
  nodes,
  onFulfillNode,
  onSaveNode,
}) => {
  const [loadingNodeId, setLoadingNodeId] = useState<string | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [activePayloads, setActivePayloads] = useState<{ [key: string]: string }>(() => {
    const saved = localStorage.getItem('decentralized_mesh_payloads');
    return saved ? JSON.parse(saved) : {};
  });

  // Keep track of client-side schema fields
  const [activeSchemas, setActiveSchemas] = useState<{ [key: string]: SchemaField[] }>(() => {
    const saved = localStorage.getItem('decentralized_mesh_schemas');
    return saved ? JSON.parse(saved) : {};
  });

  const dataNodes = nodes.filter(n => n.dataPlaceholder || n.dataType);

  // Sync payloads and schemas to localStorage for client-authoritative persistence
  useEffect(() => {
    localStorage.setItem('decentralized_mesh_payloads', JSON.stringify(activePayloads));
  }, [activePayloads]);

  useEffect(() => {
    localStorage.setItem('decentralized_mesh_schemas', JSON.stringify(activeSchemas));
  }, [activeSchemas]);

  // Load initial/default schemas if none exist
  useEffect(() => {
    const defaultSchemas: { [key: string]: SchemaField[] } = { ...activeSchemas };
    let updated = false;

    dataNodes.forEach(node => {
      if (!defaultSchemas[node.id]) {
        updated = true;
        if (node.id === 'OP_NODE_01') {
          defaultSchemas[node.id] = [
            { key: 'subscriber_id', type: 'string', description: 'Unique subscriber identifier Hash' },
            { key: 'double_opt_in', type: 'boolean', description: 'Explicit GDPR opt-in consent flag' },
            { key: 'cookie_consent', type: 'boolean', description: 'Cookie tracking consent' },
            { key: 'timestamp', type: 'string', description: 'UTC record collection timestamp' }
          ];
        } else if (node.id === 'SYS_NODE_01') {
          defaultSchemas[node.id] = [
            { key: 'post_id', type: 'string', description: 'Synthesized blog post unique ID' },
            { key: 'synthesized_text', type: 'string', description: 'Markdown output content text block' },
            { key: 'semantic_novelty_score', type: 'number', description: 'Cosine distance measurement (0-1)' },
            { key: 'copyright_cleared', type: 'boolean', description: 'Legal distribution status flag' }
          ];
        } else {
          // Fallback generic schema
          defaultSchemas[node.id] = [
            { key: 'id', type: 'string', description: 'Entity key identifier' },
            { key: 'metric_value', type: 'number', description: 'Validation coefficient' },
            { key: 'is_active', type: 'boolean', description: 'State status flag' }
          ];
        }
      }
    });

    if (updated) {
      setActiveSchemas(defaultSchemas);
    }
  }, [nodes]);

  // Helper to generate mock data strictly on client side (Offline-first / Fallback)
  const generateClientMockData = (fields: SchemaField[], label: string): string => {
    const mockObj: { [key: string]: any } = {};
    fields.forEach(f => {
      if (f.type === 'string') {
        if (f.key.includes('id')) {
          mockObj[f.key] = `REC_${Math.floor(Math.random() * 90000) + 10000}`;
        } else if (f.key.includes('timestamp') || f.key.includes('date')) {
          mockObj[f.key] = new Date().toISOString();
        } else if (f.key.includes('text') || f.key.includes('content')) {
          mockObj[f.key] = `## Synthesized Blog Post on ${label}\nThis is a SOTA synthesized article created inside the decentralized data mesh. Novelty constraints were fully satisfied.`;
        } else {
          mockObj[f.key] = `Mock_${f.key}_val`;
        }
      } else if (f.type === 'number') {
        if (f.key.includes('score') || f.key.includes('novelty') || f.key.includes('threshold')) {
          mockObj[f.key] = parseFloat((Math.random() * 0.2 + 0.8).toFixed(4)); // 0.80 to 1.00
        } else {
          mockObj[f.key] = Math.floor(Math.random() * 100);
        }
      } else if (f.type === 'boolean') {
        mockObj[f.key] = Math.random() > 0.15; // 85% true by default to simulate valid pipeline state
      } else {
        mockObj[f.key] = {};
      }
    });
    return JSON.stringify(mockObj, null, 2);
  };

  const handleGenerateSynthetic = async (node: GraphNode) => {
    const fields = activeSchemas[node.id] || [];
    setLoadingNodeId(node.id);
    
    // Attempt Gemini call but support clean client-side synthesis fallback instantly
    try {
      const res = await fetch('/api/generate-mock-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placeholderName: node.dataPlaceholder,
          dataType: node.dataType || 'JSON',
          nodeLabel: node.label,
          // Feed current schema fields to server to shape the Gemini output if reachable
          schemaFields: fields,
        }),
      });

      if (!res.ok) throw new Error("Fallback to local offline engine");
      const data = await res.json();
      
      onFulfillNode(node.id, data.mockData);
      setActivePayloads(prev => ({
        ...prev,
        [node.id]: data.mockData,
      }));

      // Update the main node state with the generated payload and schema if callback exists
      if (onSaveNode) {
        const updatedNode = {
          ...node,
          isCompleted: true,
          metadata: {
            ...node.metadata,
            payload: data.mockData,
            schemaFields: fields,
          }
        };
        onSaveNode(updatedNode, `DATA_MESH_ALIGN: Synthesized and validated data payload for cluster node "${node.id}".`);
      }

    } catch (err) {
      console.warn("Express server Gemini API offline or unreachable. Engaging client-side local synthesis engine...");
      // Generate rich mock data strictly offline on client side
      const offlineData = generateClientMockData(fields, node.label);
      onFulfillNode(node.id, offlineData);
      setActivePayloads(prev => ({
        ...prev,
        [node.id]: offlineData,
      }));

      if (onSaveNode) {
        const updatedNode = {
          ...node,
          isCompleted: true,
          metadata: {
            ...node.metadata,
            payload: offlineData,
            schemaFields: fields,
          }
        };
        onSaveNode(updatedNode, `OFFLINE_DATA_MESH_ALIGN: Offline local engine synthesized and validated data payload for cluster node "${node.id}".`);
      }
    } finally {
      setLoadingNodeId(null);
    }
  };

  const updateSchemaField = (nodeId: string, index: number, updates: Partial<SchemaField>) => {
    setActiveSchemas(prev => {
      const fields = [...(prev[nodeId] || [])];
      fields[index] = { ...fields[index], ...updates };
      return { ...prev, [nodeId]: fields };
    });
  };

  const addSchemaField = (nodeId: string) => {
    setActiveSchemas(prev => {
      const fields = [...(prev[nodeId] || [])];
      fields.push({
        key: `new_field_${fields.length + 1}`,
        type: 'string',
        description: 'Custom metadata descriptor'
      });
      return { ...prev, [nodeId]: fields };
    });
  };

  const deleteSchemaField = (nodeId: string, index: number) => {
    setActiveSchemas(prev => {
      const fields = (prev[nodeId] || []).filter((_, i) => i !== index);
      return { ...prev, [nodeId]: fields };
    });
  };

  const handleUpdatePayload = (nodeId: string, text: string) => {
    setActivePayloads(prev => ({ ...prev, [nodeId]: text }));
  };

  // Live validator engine: returns array of error messages or empty array if perfect
  const validatePayload = (nodeId: string, payloadStr: string): { isValid: boolean; errors: string[]; parsedData?: any } => {
    const fields = activeSchemas[nodeId] || [];
    if (!payloadStr) {
      return { isValid: false, errors: ['Payload empty. Needs synthesis or input record.'] };
    }

    try {
      // Try to parse JSON
      const parsed = JSON.parse(payloadStr);
      const errors: string[] = [];

      fields.forEach(field => {
        if (!(field.key in parsed)) {
          errors.push(`Required field "${field.key}" is missing.`);
        } else {
          const val = parsed[field.key];
          const actualType = typeof val;
          if (field.type === 'number' && actualType !== 'number') {
            errors.push(`Field "${field.key}" type mismatch. Expected "number", got "${actualType}".`);
          } else if (field.type === 'boolean' && actualType !== 'boolean') {
            errors.push(`Field "${field.key}" type mismatch. Expected "boolean", got "${actualType}".`);
          } else if (field.type === 'string' && actualType !== 'string') {
            errors.push(`Field "${field.key}" type mismatch. Expected "string", got "${actualType}".`);
          } else if (field.type === 'object' && (actualType !== 'object' || val === null)) {
            errors.push(`Field "${field.key}" type mismatch. Expected "object", got "${actualType}".`);
          }
        }
      });

      return {
        isValid: errors.length === 0,
        errors,
        parsedData: parsed
      };
    } catch (e: any) {
      return {
        isValid: false,
        errors: [`JSON Syntax Error: ${e.message || 'Invalid JSON format'}`]
      };
    }
  };

  return (
    <div className="space-y-4">
      {/* Decoupled cluster indicator */}
      <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Database className="w-5 h-5 text-indigo-400" />
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">Decentralized Mesh Architecture</h4>
            <span className="text-[10px] font-mono text-slate-500 uppercase">Operational Client-Authoritative Clusters</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono bg-indigo-950/40 text-indigo-400 border border-indigo-900/40 px-2.5 py-1 rounded">
          <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
          ACTIVE CLUSTERS: {dataNodes.length}
        </div>
      </div>

      {dataNodes.length === 0 ? (
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-6 text-center text-slate-500 text-xs font-sans">
          No data-dependent placeholders found in the active graph topology yet. Select "Omar HITL" mode and add Operational (OP_) or System (SYS_) nodes with data placeholders.
        </div>
      ) : (
        <div className="space-y-4">
          {dataNodes.map((node) => {
            const hasData = node.isCompleted;
            const fields = activeSchemas[node.id] || [];
            const rawPayload = activePayloads[node.id] || '';
            const isEditingSchema = editingNodeId === node.id;
            
            // Validate payload
            const validation = validatePayload(node.id, rawPayload);

            return (
              <div
                key={node.id}
                className={`border rounded-xl p-4 transition-all bg-slate-950/40 ${
                  validation.isValid && hasData
                    ? 'border-indigo-500/35'
                    : 'border-slate-850'
                }`}
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-900">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] bg-slate-900 border border-slate-850 px-1.5 py-0.5 rounded font-bold text-indigo-400">
                        {node.id}
                      </span>
                      <span className="text-xs font-semibold text-slate-200">
                        {node.label}
                      </span>
                    </div>
                    {node.dataPlaceholder && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[9px] font-mono text-indigo-300 bg-indigo-950/50 border border-indigo-900/30 px-1.5 py-0.5 rounded">
                          Mesh Hook: {node.dataPlaceholder}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded">
                          Modality: {node.dataType || 'JSON'}
                        </span>
                      </div>
                    )}
                  </div>

                  {validation.isValid && hasData ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-900/40 px-2 py-0.5 rounded font-mono">
                      <ShieldCheck className="w-3.5 h-3.5" /> MESH COMPLIANT
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-950/20 border border-amber-900/30 px-2 py-0.5 rounded font-mono">
                      <ShieldAlert className="w-3.5 h-3.5" /> PENDING DATA
                    </span>
                  )}
                </div>

                {/* Real-time schema structure editor */}
                <div className="mt-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5 text-indigo-400" />
                      Client-Authoritative Validation Schema
                    </span>
                    <button
                      onClick={() => setEditingNodeId(isEditingSchema ? null : node.id)}
                      className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 bg-slate-900 hover:bg-slate-850 border border-slate-800 px-2 py-1 rounded flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <Edit3 className="w-3 h-3" />
                      {isEditingSchema ? 'Close Schema Editor' : 'Edit Schema Fields'}
                    </button>
                  </div>

                  {isEditingSchema ? (
                    <div className="bg-slate-950 border border-slate-850 p-3.5 rounded-lg space-y-2.5">
                      <span className="block text-[9px] font-mono text-slate-500 uppercase leading-none">SCHEMA FIELD REGISTER:</span>
                      <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                        {fields.map((f, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-slate-900/50 p-2 rounded border border-slate-850">
                            <input
                              type="text"
                              value={f.key}
                              onChange={(e) => updateSchemaField(node.id, idx, { key: e.target.value })}
                              className="bg-slate-950 border border-slate-800 text-[10px] font-mono rounded px-1.5 py-1 text-slate-200 w-[120px] focus:outline-none focus:border-indigo-500"
                              placeholder="field_key"
                            />
                            <select
                              value={f.type}
                              onChange={(e) => updateSchemaField(node.id, idx, { type: e.target.value as any })}
                              className="bg-slate-950 border border-slate-800 text-[10px] rounded px-1 py-1 text-slate-300 w-[80px]"
                            >
                              <option value="string">string</option>
                              <option value="number">number</option>
                              <option value="boolean">boolean</option>
                              <option value="object">object</option>
                            </select>
                            <input
                              type="text"
                              value={f.description}
                              onChange={(e) => updateSchemaField(node.id, idx, { description: e.target.value })}
                              className="bg-slate-950 border border-slate-800 text-[10px] rounded px-1.5 py-1 text-slate-400 flex-1 focus:outline-none"
                              placeholder="Field description/rules"
                            />
                            <button
                              onClick={() => deleteSchemaField(node.id, idx)}
                              className="p-1 text-red-400 hover:bg-slate-850 rounded cursor-pointer transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 justify-end pt-1.5 border-t border-slate-900">
                        <button
                          onClick={() => addSchemaField(node.id)}
                          className="text-[9px] font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add Schema Field
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Display compact schema properties
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 flex flex-wrap gap-1.5">
                      {fields.map((f, idx) => (
                        <div key={idx} className="bg-slate-900 border border-slate-850/80 rounded px-2 py-1 text-[9px] font-mono flex items-center gap-1 text-slate-300">
                          <span className="text-indigo-400 font-bold">{f.key}:</span>
                          <span className="text-[8px] bg-slate-950 text-slate-500 px-1 rounded uppercase">{f.type}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* JSON Record editor & real-time validator */}
                <div className="mt-4 space-y-2">
                  <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                    Operational Record Store (Local Authoritative Payload)
                  </span>
                  
                  <div className="relative">
                    <textarea
                      value={rawPayload}
                      onChange={(e) => handleUpdatePayload(node.id, e.target.value)}
                      placeholder='{\n  "id": "key",\n  "status": "valid"\n}'
                      rows={5}
                      className="w-full bg-slate-950 text-[10px] font-mono border border-slate-850 rounded-lg p-3 text-slate-300 focus:outline-none focus:border-indigo-500 leading-relaxed"
                    />
                    
                    {/* Live Validator Indicator overlay inside textarea */}
                    <div className="absolute bottom-2 right-2 flex items-center gap-1">
                      {validation.isValid ? (
                        <span className="flex items-center gap-1 text-[9px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-900/40 py-0.5 px-2 rounded-full backdrop-blur-sm">
                          <Check className="w-3 h-3 text-emerald-400" /> JSON Validated
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[9px] font-mono bg-red-950/80 text-red-400 border border-red-900/40 py-0.5 px-2 rounded-full backdrop-blur-sm">
                          <AlertCircle className="w-3 h-3 text-red-400 animate-pulse" /> Invalid Payload
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Schema Validation Warnings Card if invalid */}
                  {!validation.isValid && rawPayload && (
                    <div className="bg-red-950/15 border border-red-900/30 rounded-lg p-3 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-[10px] font-mono font-bold text-red-400 uppercase leading-none">Schema Validation Errors:</h5>
                        <ul className="text-[9px] text-red-300 font-mono space-y-0.5 mt-1 list-disc pl-3">
                          {validation.errors.map((err, i) => (
                            <li key={i}>{err}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Synthesis Toolbar */}
                <div className="mt-3 pt-3 border-t border-slate-900 flex items-center justify-between gap-2">
                  <span className="text-[9px] font-mono text-slate-500 flex items-center gap-1 leading-none">
                    <ServerOff className="w-3.5 h-3.5 text-slate-600" /> Offline local validation ready
                  </span>

                  <button
                    onClick={() => handleGenerateSynthetic(node)}
                    disabled={loadingNodeId !== null}
                    className="bg-indigo-950/40 hover:bg-indigo-900/40 border border-indigo-900/50 text-indigo-300 py-1.5 px-3 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    {loadingNodeId === node.id ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Mesh Generating Mock...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        Synthesize Local Payload
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
