import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

// Initialize Mermaid with safe configurations
mermaid.initialize({
  startOnLoad: false,
  theme: 'neutral',
  securityLevel: 'loose',
  fontFamily: 'Inter, system-ui, sans-serif',
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: 'basis',
  },
});

interface MermaidRendererProps {
  definition: string;
  nodeIds?: string[];
  onNodeClick?: (nodeId: string) => void;
}

export const MermaidRenderer: React.FC<MermaidRendererProps> = ({ 
  definition,
  nodeIds = [],
  onNodeClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!definition || !containerRef.current) return;

    let isMounted = true;
    const uniqueId = `mermaid-svg-${Math.floor(Math.random() * 1000000)}`;

    const renderDiagram = async () => {
      try {
        setError(null);
        // Clear previous render
        const { svg } = await mermaid.render(uniqueId, definition);
        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err: any) {
        console.error('Mermaid render error:', err);
        // Clean up bad mermaid tags/elements created globally
        const badEl = document.getElementById(uniqueId);
        if (badEl) badEl.remove();
        
        if (isMounted) {
          setError(err.message || 'Error rendering Mermaid diagram');
        }
      }
    };

    renderDiagram();

    return () => {
      isMounted = false;
    };
  }, [definition]);

  const handleSvgClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onNodeClick || nodeIds.length === 0) return;
    
    let target = e.target as HTMLElement | null;
    while (target && target !== containerRef.current) {
      const idAttr = target.getAttribute('id') || '';
      const classList = Array.from(target.classList);
      
      // Look for a node match in the class or ID attribute
      const matchedNodeId = nodeIds.find(id => {
        return (
          idAttr === id ||
          idAttr.startsWith(`flowchart-${id}-`) ||
          idAttr.includes(`-${id}-`) ||
          classList.includes(id) ||
          target?.innerHTML.includes(`id="${id}"`)
        );
      });

      if (matchedNodeId) {
        onNodeClick(matchedNodeId);
        break;
      }
      target = target.parentElement;
    }
  };

  return (
    <div className="relative w-full overflow-auto bg-slate-950 rounded-xl p-4 border border-slate-800 shadow-2xl min-h-[350px] flex items-center justify-center">
      {/* Inject custom pointer and hover styles for rendered SVG nodes */}
      <style>{`
        .node, .flowchart-node, .mermaid .node {
          cursor: pointer !important;
          transition: transform 0.2s ease, filter 0.2s ease;
        }
        .node:hover, .flowchart-node:hover {
          filter: brightness(1.2) contrast(1.1);
        }
      `}</style>

      {error ? (
        <div className="text-center p-6 bg-red-950/40 border border-red-900 rounded-lg max-w-md mx-auto">
          <p className="text-red-400 font-medium mb-2">Diagram Rendering Paused</p>
          <pre className="text-xs text-red-300 font-mono text-left max-h-[150px] overflow-auto whitespace-pre-wrap p-2 bg-red-950/80 rounded">
            {error}
          </pre>
          <p className="text-xs text-slate-400 mt-2">Diagram syntax will auto-correct when node definitions are completed.</p>
        </div>
      ) : (
        <div 
          ref={containerRef} 
          onClick={handleSvgClick}
          className="w-full flex justify-center text-slate-100"
          dangerouslySetInnerHTML={{ __html: svgContent }} 
        />
      )}
    </div>
  );
};
