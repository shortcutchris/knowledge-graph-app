import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import * as d3 from 'd3';
import { ZoomIn, ZoomOut, Move } from 'lucide-react';
import type { Node, Link, ProposedElement, TooltipState } from '../../types';
import { Tooltip } from '../common/Tooltip';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ForceGraphProps {
  nodes: Node[];
  links: Link[];
  proposedElements: ProposedElement[];
  width: number;
  height: number;
  onNodeClick?: (node: Node | null) => void;
  selectedNodeId?: string | null;
  enableZoomControls?: boolean;
  graphId?: string;
}

export interface ForceGraphHandle {
  fitToViewport: () => void;
}

export const ForceGraph = forwardRef<ForceGraphHandle, ForceGraphProps>(({ 
  nodes, 
  links, 
  proposedElements, 
  width, 
  height, 
  onNodeClick, 
  selectedNodeId = null,
  enableZoomControls = false, 
  graphId = 'main' 
}, ref) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<Node, Link> | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const onNodeClickRef = useRef(onNodeClick);
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, content: '' });
  
  // Keep onNodeClick ref updated
  useEffect(() => {
    onNodeClickRef.current = onNodeClick;
  }, [onNodeClick]);

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
  
  // Expose fitGraphToViewport to parent components
  useImperativeHandle(ref, () => ({
    fitToViewport: fitGraphToViewport
  }));

  useEffect(() => {
    if (!nodes.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Add a background rect for zoom/pan interactions
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "transparent")
      .attr("class", "zoom-area");

    // Create container for zoom
    const g = svg.append("g");

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .filter((event) => {
        // Only allow zoom on wheel events or when dragging on empty space
        if (event.type === 'wheel') return true;
        if (event.type === 'mousedown' || event.type === 'touchstart') {
          // Check if clicking on empty space (not on a node)
          const target = event.target as Element;
          return target.tagName === 'svg' || target.classList.contains('zoom-area');
        }
        return true;
      })
      .on("zoom", (event) => {
        // Smooth zoom transition
        if (event.sourceEvent && event.sourceEvent.type === 'wheel') {
          g.transition()
            .duration(50)
            .attr("transform", event.transform);
        } else {
          g.attr("transform", event.transform);
        }
      });

    svg.call(zoom);
    zoomRef.current = zoom;

    // Click on background to deselect
    svg.on("click", () => {
      if (onNodeClickRef.current) {
        onNodeClickRef.current(null);
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
      }).strength(0.8))
      .force("charge", d3.forceManyBody().strength(d => {
        if (d.nodeType === 'question' || d.nodeType === 'answer') return -150;
        if (d.id === 'herr_wagner') return -600;
        return -300;
      }))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(d => {
        if (d.nodeType === 'question' || d.nodeType === 'answer') return 50;
        if (d.id === 'herr_wagner') return 90;
        return 70;
      }))
      .force("y", d3.forceY().strength(0.08).y(d => {
        if (d.id === 'herr_wagner') return height * 0.3;
        if (d.id === 'anlage' || d.id === 'kunde' || d.id === 'fehler' || d.id === 'kontakt') return height * 0.5;
        if (d.parent === 'anlage' || d.parent === 'kunde' || d.parent === 'fehler' || d.parent === 'kontakt') return height * 0.7;
        return height * 0.5;
      }))
      .alpha(1)
      .alphaDecay(0.05)
      .velocityDecay(0.4);

    simulationRef.current = simulation;
    
    // Stop simulation when it's stabilized
    let tickCount = 0;
    simulation.on("tick.stabilize", () => {
      tickCount++;
      // Stop after a reasonable number of ticks or when alpha is very low
      if (tickCount > 300 || simulation.alpha() < 0.01) {
        simulation.stop();
      }
    });

    // Create defs for markers and filters
    const defs = svg.append("defs");
    
    // Create arrow markers
    defs.selectAll("marker")
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
    
    // Create drop shadow filter for selected nodes
    const filter = defs.append("filter")
      .attr("id", "drop-shadow")
      .attr("height", "130%");
    
    filter.append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 3)
      .attr("result", "blur");
    
    filter.append("feOffset")
      .attr("in", "blur")
      .attr("dx", 0)
      .attr("dy", 2)
      .attr("result", "offsetBlur");
    
    filter.append("feFlood")
      .attr("in", "offsetBlur")
      .attr("flood-color", "#ff4444")
      .attr("flood-opacity", "0.3");
    
    filter.append("feComposite")
      .attr("in2", "offsetBlur")
      .attr("operator", "in");
    
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode");
    feMerge.append("feMergeNode")
      .attr("in", "SourceGraphic");

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
      })
      .attr("opacity", 1);

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
        event.preventDefault();
        if (onNodeClickRef.current) {
          setTimeout(() => onNodeClickRef.current(d), 0);
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
          .duration(400)
          .ease(d3.easeCubicOut)
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
          .duration(400)
          .ease(d3.easeCubicOut)
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
          .attr("font-size", "18px")
          .attr("fill", "#7b1fa2")
          .attr("pointer-events", "none")
          .text(d.label || "?");
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
          .attr("font-size", "18px")
          .attr("fill", "#388e3c")
          .attr("pointer-events", "none")
          .text(d.label || "A");
      } else if (d.nodeType === 'person') {
        // Special styling for Herr Wagner
        nodeGroup.append("circle")
          .attr("r", 45)
          .attr("fill", "#e3f2fd")
          .attr("stroke", "#1976d2")
          .attr("stroke-width", 3)
          .attr("class", "node-shape");
        
        // Add person icon
        nodeGroup.append("text")
          .attr("text-anchor", "middle")
          .attr("y", -5)
          .attr("font-size", "24px")
          .attr("pointer-events", "none")
          .text("👨‍🔧");
          
        nodeGroup.append("text")
          .attr("text-anchor", "middle")
          .attr("y", 20)
          .attr("font-size", "14px")
          .attr("font-weight", "bold")
          .attr("fill", "#1976d2")
          .attr("pointer-events", "none")
          .text(d.label);
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
            // Special color for contact instances
            const links = allLinks as any[];
            const isContactInstance = links.some(link => 
              (link.source === d.id || link.source.id === d.id) && 
              (link.target === 'kontakt' || link.target.id === 'kontakt') && 
              link.type === 'instance_of'
            );
            if (isContactInstance) return "#f3e5f5";
            if (d.type === 'instance') return "#e3f2fd";
            return "#f8f9fa";
          })
          .attr("stroke", d => {
            if (d.isProposed) return "#ffc107";
            if (d.isNew) return "#28a745";
            if (d.id === 'entity') return "#5c6bc0";
            // Special color for contact instances
            const links = allLinks as any[];
            const isContactInstance = links.some(link => 
              (link.source === d.id || link.source.id === d.id) && 
              (link.target === 'kontakt' || link.target.id === 'kontakt') && 
              link.type === 'instance_of'
            );
            if (isContactInstance) return "#9c27b0";
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
          .text(d => {
            // Check if this is a contact instance
            const links = allLinks as any[];
            const isContactInstance = links.some(link => 
              (link.source === d.id || link.source.id === d.id) && 
              (link.target === 'kontakt' || link.target.id === 'kontakt') && 
              link.type === 'instance_of'
            );
            return isContactInstance ? `👤 ${d.label}` : d.label;
          });

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
      // Only restart if simulation is not already running
      if (!event.active && simulation.alpha() < 0.01) {
        simulation.alphaTarget(0.1).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, Node, Node>, d: Node) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, Node, Node>, d: Node) {
      if (!event.active) simulation.alphaTarget(0);
      // Keep position fixed for a moment to prevent bouncing
      setTimeout(() => {
        d.fx = null;
        d.fy = null;
      }, 100);
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
  }, [nodes, links, proposedElements, width, height, graphId]); // onNodeClick removed from dependencies

  // Update visual selection feedback when selectedNodeId changes
  useEffect(() => {
    if (!svgRef.current) return;
    
    // Small delay to ensure nodes are created
    const timeoutId = setTimeout(() => {
      const svg = d3.select(svgRef.current);
      const g = svg.select('g');
      
      if (g.empty()) return;
    
    // Update link opacity based on selection
    g.selectAll('line')
      .transition()
      .duration(300)
      .ease(d3.easeCubicInOut)
      .attr('opacity', function(d: any) {
        if (!selectedNodeId) return 1;
        const sourceId = typeof d.source === 'object' ? d.source.id : d.source;
        const targetId = typeof d.target === 'object' ? d.target.id : d.target;
        return (sourceId === selectedNodeId || targetId === selectedNodeId) ? 1 : 0.3;
      });
    
    // Update node opacity and styling
    g.selectAll('g').each(function(d: any) {
      if (!d || !d.id) return; // Skip if no data
      
      const nodeGroup = d3.select(this);
      const isSelected = d.id === selectedNodeId;
      const isConnected = selectedNodeId ? links.some(link => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        return (sourceId === selectedNodeId && targetId === d.id) || 
               (targetId === selectedNodeId && sourceId === d.id);
      }) : false;
      
      nodeGroup
        .transition()
        .duration(300)
        .ease(d3.easeCubicInOut)
        .attr('opacity', () => {
          if (!selectedNodeId) return 1;
          if (isSelected || isConnected) return 1;
          return 0.3;
        });
      
      // Update stroke for selected node
      const shapeSelection = nodeGroup.select('.node-shape');
      if (!shapeSelection.empty()) {
        shapeSelection
          .transition()
          .duration(300)
          .ease(d3.easeCubicInOut)
          .attr('stroke', () => {
            if (isSelected) return '#ff4444';
            // Return to original stroke color
            if (d.nodeType === 'question') return d.isProposed ? '#9c27b0' : '#7b1fa2';
            if (d.nodeType === 'answer') return d.isProposed ? '#4caf50' : '#388e3c';
            if (d.nodeType === 'person') return '#1976d2';
            if (d.isProposed) return '#ffc107';
            if (d.isNew) return '#28a745';
            if (d.id === 'entity') return '#5c6bc0';
            if (d.type === 'instance') return '#2196f3';
            return '#dee2e6';
          })
          .attr('stroke-width', () => {
            if (isSelected) return 4;
            return d.isProposed ? 3 : 2;
          })
          .attr('filter', isSelected ? 'url(#drop-shadow)' : null);
      }
    });
    }, 100); // 100ms delay
    
    return () => clearTimeout(timeoutId);
  }, [selectedNodeId, links]);

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
    <div className="relative">
      <svg ref={svgRef} width={width} height={height} className="cursor-grab" />
      <Tooltip {...tooltip} />
      
      {/* Zoom Controls */}
      {enableZoomControls && (
        <Card className="absolute top-3 left-3 shadow-lg p-0">
          <CardContent className="p-1.5">
            <div className="text-[10px] font-semibold text-gray-600 mb-1 text-center select-none">
              Zoom
            </div>
            <div className="flex flex-col gap-0.5">
              <Button
                onClick={handleZoomIn}
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                title="Vergrößern"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </Button>
              <Button
                onClick={handleZoomOut}
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                title="Verkleinern"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </Button>
              <Button
                onClick={handleResetZoom}
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                title="Ansicht zurücksetzen"
              >
                <Move className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
});

ForceGraph.displayName = 'ForceGraph';