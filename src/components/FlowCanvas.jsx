import React from 'react';
import ReactFlow, {
  Controls,
  MiniMap,
  Background,
  Panel, // Ensure Panel is imported
} from 'reactflow';

import 'reactflow/dist/style.css';

const FlowCanvas = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onInit,
  onDrop,
  onDragOver,
  onNodeClick,
  reactFlowWrapper,
}) => {
  return (
    <div className="absolute inset-0 overflow-hidden" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        fitView
        // Ensure ReactFlow itself takes up full height and width of its container
        // Added a background color directly to ReactFlow to ensure no white shows through
        className="!h-full !w-full bg-gray-900" 
      >
        {/* Background Grid */}
        <Background color="#a3a3a3" gap={18} variant="lines" />

        {/* MiniMap wrapped in a Panel for explicit styling */}
        <Panel 
          position="bottom-right" 
          className="!w-[180px] !h-[120px] z-50 rounded-md border border-gray-600 bg-gray-800 p-0 overflow-hidden"
        >
          <MiniMap
            // Remove absolute positioning and fixed dimensions from MiniMap itself
            // as the parent Panel will now manage its size and position.
            // Ensure internal MiniMap colors match the dark theme.
            nodeColor={(node) => node.data?.color || '#6366F1'}
            nodeStrokeWidth={3}
            zoomable
            pannable
            maskColor="rgba(31, 41, 55, 0.7)" // Semi-transparent dark gray for the mask
            viewportColor="#1f2937" // Dark gray for the viewport background
            className="!w-full !h-full" // Make MiniMap fill its Panel container
          />
        </Panel>

        {/* Controls */}
        <Controls
          className="dark:bg-gray-700 dark:text-white dark:border dark:border-gray-600 rounded-lg shadow-md"
          showInteractive={false}
        />

        {/* Title Panel */}
        <Panel position="top-right" className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white p-3 rounded-xl shadow-lg backdrop-blur-md">
          <h2 className="font-bold text-lg">⚡ Workflow Builder</h2>
        </Panel>

        {/* Optional: Reset Button */}
        <Panel position="bottom-right" className="flex flex-col gap-2 p-3 text-white !right-[200px]"> {/* Adjusted right position to not overlap minimap */}
          <button
            className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-lg shadow transition"
            onClick={() => onInit && onInit()}
          >
            🔄 Reset View
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default FlowCanvas;
