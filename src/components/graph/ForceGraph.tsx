import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { ZoomIn, ZoomOut, Move } from 'lucide-react';
import type { Node, Link, ProposedElement, TooltipState } from '../../types';
import { Tooltip } from '../common/Tooltip';

interface ForceGraphProps {
  nodes: Node[];
  links: Link[];
  proposedElements: ProposedElement[];
  width: number;
  height: number;
  onNodeClick?: (node: Node | null) => void;
  enableZoomControls?: boolean;
  graphId?: string;
}

export const ForceGraph: React.FC<ForceGraphProps> = ({ 
  nodes, 
  links, 
  proposedElements, 
  width, 
  height, 
  onNodeClick, 
  enableZoomControls = false, 
  graphId = 'main' 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<Node, Link> | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, content: '' });

  // Function to fit graph to viewport
  const fitGraphToViewport = () => {
    const svg = d3.select(svgRef.current);
    const g = svg.select('g');
    if (!g.node()) return;

    const bounds = (g.node() as SVGGElement).getBBox();
    const fullWidth = width;
    const fullHeight = height;
    const midX = bounds.x + bounds.width / 2;
    const midY = bounds.y + bounds.height / 2;
    const scale = 0.8 / Math.max(bounds.width / fullWidth, bounds.height / fullHeight);
    const translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];

    if (zoomRef.current) {
      svg.transition()
        .duration(750)
        .call(zoomRef.current.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
    }
  };

  useEffect(() => {
    if (!nodes.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Create container for zoom
    const g = svg.append("g");

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);
    zoomRef.current = zoom;

    // Click on background to deselect
    svg.on("click", () => {
      if (onNodeClick) {
        onNodeClick(null);
      }
    });

    // Combine regular nodes with proposed nodes
    const nodeIds = new Set(nodes.map(n => n.id));
    const allNodes = [...nodes];
    const allLinks = [...links];

    // Add proposed elements
    proposedElements.forEach(element => {
      if (element.type === 'class' || element.type === 'instance' || element.type === 'question' || element.type === 'answer') {
        if (!nodeIds.has(element.id!)) {
          allNodes.push({
            ...element,
            id: element.id!,
            label: element.label!,
            isProposed: true
          } as Node);
          nodeIds.add(element.id!);
        }
      } else if (element.type === 'edge') {
        allLinks.push({
          source: element.from!,
          target: element.to!,
          type: element.label!,
          isProposed: true,
          attributes: element.attributes
        });
      }
    });

    // Filter out invalid links
    const validLinks = allLinks.filter(link => {
      const sourceNode = allNodes.find(n => n.id === (typeof link.source === 'string' ? link.source : link.source.id));
      const targetNode = allNodes.find(n => n.id === (typeof link.target === 'string' ? link.target : link.target.id));
      return sourceNode && targetNode;
    });

    // Create force simulation
    const simulation = d3.forceSimulation(allNodes)
      .force("link", d3.forceLink<Node, Link>(validLinks).id(d => d.id).distance(d => {
        if (d.type === 'is_relevant_for') return 80;
        if (d.type !== 'is_a' && d.type !== 'instance_of' && d.type !== 'is_relevant_for') return 100;
        return 120;
      }).strength(1))
      .force("charge", d3.forceManyBody().strength(d => {
        if (d.nodeType === 'question' || d.nodeType === 'answer') return -200;
        if (d.id === 'entity') return -600;
        return -400;
      }))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(d => {
        if (d.nodeType === 'question' || d.nodeType === 'answer') return 50;
        if (d.id === 'entity') return 80;
        return 70;
      }))
      .force("y", d3.forceY().strength(0.1).y(d => {
        if (d.id === 'entity') return height * 0.2;
        if (d.id === 'anlage' || d.id === 'kunde' || d.id === 'fehler') return height * 0.4;
        if (d.parent === 'anlage' || d.parent === 'kunde' || d.parent === 'fehler') return height * 0.6;
        return height * 0.5;
      }))
      .alpha(1)
      .alphaDecay(0.02);

    simulationRef.current = simulation;

    // Create arrow markers
    svg.append("defs").selectAll("marker")
      .data(["arrow", "arrow-proposed", "arrow-qa", "arrow-selected", "arrow-component"])
      .enter().append("marker")
      .attr("id", d => d)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", d => d === "arrow-qa" ? 20 : 25)
      .attr("refY", 0)
      .attr("markerWidth", 8)
      .attr("markerHeight", 8)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", d => {
        if (d === "arrow-proposed") return "#ffc107";
        if (d === "arrow-qa") return "#9c27b0";
        if (d === "arrow-selected") return "#dc3545";
        if (d === "arrow-component") return "#ff6b6b";
        return "#999";
      });

    // Create links
    const link = g.append("g")
      .selectAll("line")
      .data(validLinks)
      .enter().append("line")
      .attr("stroke", d => {
        if (d.type === 'is_relevant_for') return "#9c27b0";
        if (d.type !== 'is_a' && d.type !== 'instance_of' && d.type !== 'is_relevant_for') return "#ff6b6b";
        if (d.isProposed) return "#ffc107";
        return "#999";
      })
      .attr("stroke-width", d => {
        if (d.type === 'is_relevant_for') return 2;
        if (d.type !== 'is_a' && d.type !== 'instance_of' && d.type !== 'is_relevant_for') return 2.5;
        if (d.isProposed) return 3;
        return 2;
      })
      .attr("stroke-dasharray", d => d.isProposed ? "5,5" : "none")
      .attr("marker-end", d => {
        if (d.type === 'is_relevant_for') return "url(#arrow-qa)";
        if (d.type !== 'is_a' && d.type !== 'instance_of' && d.type !== 'is_relevant_for' && !d.isProposed) return "url(#arrow-component)";
        if (d.isProposed) return "url(#arrow-proposed)";
        return "url(#arrow)";
      });

    // Create link labels
    const linkLabelGroup = g.append("g")
      .selectAll("g")
      .data(validLinks)
      .enter().append("g");

    linkLabelGroup.append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#666")
      .attr("dy", "-5")
      .text(d => d.type);

    linkLabelGroup.append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("fill", "#999")
      .attr("dy", "10")
      .text(d => d.attributes ? `[${Object.entries(d.attributes).map(([k,v]) => `${k}: ${v}`).join(', ')}]` : '');

    // Create node groups
    const node = g.append("g")
      .selectAll("g")
      .data(allNodes)
      .enter().append("g")
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        event.stopPropagation();
        if (onNodeClick) {
          onNodeClick(d);
        }
      })
      .on("mouseenter", function(event, d) {
        const [x, y] = d3.pointer(event, svg.node());
        const tooltipContent = d.nodeType === 'question' || d.nodeType === 'answer' 
          ? d.content || d.label 
          : `${d.label} (${d.nodeType || d.type})`;
        
        setTooltip({
          visible: true,
          x: x,
          y: y,
          content: tooltipContent
        });
        
        d3.select(this).select(".node-shape")
          .transition()
          .duration(200)
          .attr("filter", "brightness(1.1)")
          .attr("stroke-width", d.isProposed ? 4 : 3);
          
        link.style("opacity", l => {
          const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
          const targetId = typeof l.target === 'object' ? l.target.id : l.target;
          return (sourceId === d.id || targetId === d.id) ? 1 : 0.3;
        });
      })
      .on("mousemove", function(event) {
        const [x, y] = d3.pointer(event, svg.node());
        setTooltip(prev => ({ ...prev, x, y }));
      })
      .on("mouseleave", function(event, d) {
        setTooltip({ visible: false, x: 0, y: 0, content: '' });
        
        d3.select(this).select(".node-shape")
          .transition()
          .duration(200)
          .attr("filter", null)
          .attr("stroke-width", d.isProposed ? 3 : 2);
          
        link.style("opacity", 1);
      })
      .call(d3.drag<SVGGElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Draw different shapes for different node types
    node.each(function(d) {
      const nodeGroup = d3.select(this);
      
      if (d.nodeType === 'question') {
        nodeGroup.append("circle")
          .attr("r", 30)
          .attr("fill", d.isProposed ? "#f3e5f5" : "#e1bee7")
          .attr("stroke", d.isProposed ? "#9c27b0" : "#7b1fa2")
          .attr("stroke-width", d.isProposed ? 3 : 2)
          .attr("stroke-dasharray", d.isProposed ? "5,5" : "none")
          .attr("class", "node-shape");
        
        nodeGroup.append("text")
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .attr("font-size", "20px")
          .attr("fill", "#7b1fa2")
          .attr("pointer-events", "none")
          .text("?");
      } else if (d.nodeType === 'answer') {
        nodeGroup.append("circle")
          .attr("r", 30)
          .attr("fill", d.isProposed ? "#e8f5e9" : "#c8e6c9")
          .attr("stroke", d.isProposed ? "#4caf50" : "#388e3c")
          .attr("stroke-width", d.isProposed ? 3 : 2)
          .attr("stroke-dasharray", d.isProposed ? "5,5" : "none")
          .attr("class", "node-shape");
        
        nodeGroup.append("text")
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .attr("font-size", "20px")
          .attr("fill", "#388e3c")
          .attr("pointer-events", "none")
          .text("A");
      } else {
        nodeGroup.append("rect")
          .attr("width", d.id === 'entity' ? 140 : 120)
          .attr("height", d.id === 'entity' ? 60 : 50)
          .attr("x", d.id === 'entity' ? -70 : -60)
          .attr("y", d.id === 'entity' ? -30 : -25)
          .attr("rx", 8)
          .attr("fill", d => {
            if (d.isProposed) return "#fff3cd";
            if (d.isNew) return "#d4edda";
            if (d.id === 'entity') return "#e8eaf6";
            if (d.type === 'instance') return "#e3f2fd";
            return "#f8f9fa";
          })
          .attr("stroke", d => {
            if (d.isProposed) return "#ffc107";
            if (d.isNew) return "#28a745";
            if (d.id === 'entity') return "#5c6bc0";
            if (d.type === 'instance') return "#2196f3";
            return "#dee2e6";
          })
          .attr("stroke-width", d.isProposed ? 3 : 2)
          .attr("stroke-dasharray", d.isProposed ? "5,5" : "none")
          .attr("class", "node-shape");

        nodeGroup.append("text")
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .attr("font-size", d.id === 'entity' ? "16px" : "14px")
          .attr("font-weight", "bold")
          .attr("fill", d => {
            if (d.isProposed) return "#856404";
            if (d.id === 'entity') return "#5c6bc0";
            return "#333";
          })
          .attr("pointer-events", "none")
          .text(d.label);

        nodeGroup.append("text")
          .attr("text-anchor", "middle")
          .attr("y", 15)
          .attr("font-size", "11px")
          .attr("fill", d.isProposed ? "#856404" : "#666")
          .attr("pointer-events", "none")
          .text(d => {
            if (d.isProposed) return "(proposed)";
            if (d.type === 'instance') return "(instance)";
            return "";
          });
      }
    });

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as Node).x!)
        .attr("y1", d => (d.source as Node).y!)
        .attr("x2", d => (d.target as Node).x!)
        .attr("y2", d => (d.target as Node).y!);

      linkLabelGroup
        .attr("transform", d => `translate(${((d.source as Node).x! + (d.target as Node).x!) / 2}, ${((d.source as Node).y! + (d.target as Node).y!) / 2})`);

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: d3.D3DragEvent<SVGGElement, Node, Node>, d: Node) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, Node, Node>, d: Node) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, Node, Node>, d: Node) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Initial zoom to fit
    setTimeout(() => {
      fitGraphToViewport();
    }, graphId === 'fullscreen' ? 100 : 500);

    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
        simulationRef.current = null;
      }
      svg.selectAll("*").remove();
      setTooltip({ visible: false, x: 0, y: 0, content: '' });
    };
  }, [nodes, links, proposedElements, width, height, graphId, onNodeClick]);

  // Re-center graph when dimensions change
  useEffect(() => {
    if (width && height && nodes.length > 0) {
      setTimeout(() => {
        fitGraphToViewport();
      }, 100);
    }
  }, [width, height, nodes.length]);

  // Zoom control functions
  const handleZoomIn = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().duration(300).call(zoomRef.current!.scaleBy, 1.3);
  };

  const handleZoomOut = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().duration(300).call(zoomRef.current!.scaleBy, 0.7);
  };

  const handleResetZoom = () => {
    fitGraphToViewport();
  };

  return (
    <div style={{ position: 'relative' }}>
      <svg ref={svgRef} width={width} height={height} style={{ cursor: 'grab' }} />
      <Tooltip {...tooltip} />
      
      {/* Zoom Controls */}
      {enableZoomControls && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0',
          userSelect: 'none'
        }}>
          <div style={{
            fontSize: '11px',
            color: '#666',
            marginBottom: '5px',
            textAlign: 'center',
            fontWeight: 'bold',
            userSelect: 'none'
          }}>
            Zoom
          </div>
          <button
            onClick={handleZoomIn}
            style={{
              width: '36px',
              height: '36px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: '#f5f5f5',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e0e0e0'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f5f5f5'}
            title="Vergrößern"
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={handleZoomOut}
            style={{
              width: '36px',
              height: '36px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: '#f5f5f5',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e0e0e0'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f5f5f5'}
            title="Verkleinern"
          >
            <ZoomOut size={18} />
          </button>
          <button
            onClick={handleResetZoom}
            style={{
              width: '36px',
              height: '36px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: '#f5f5f5',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e0e0e0'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f5f5f5'}
            title="Ansicht zurücksetzen"
          >
            <Move size={18} />
          </button>
        </div>
      )}
    </div>
  );
};