import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  Panel,
} from 'reactflow';
import { FaTrash } from 'react-icons/fa';

import Sidebar from './components/Sidebar';
import SettingsPanel from './components/SettingsPanel';
import CodeOutput from './components/CodeOutput';
import Navbar from './components/Navbar';
import CustomNode from './components/CustomNodes';
import LiveViewModal from './components/LiveViewModal'; // Import the new LiveViewModal component

import 'reactflow/dist/style.css';

// ... (your nodeTypes and boilerplate code remain the same) ...
const nodeTypes = {
  startNode: CustomNode,
  routerNode: CustomNode,
  variableNode: CustomNode,
  functionNode: CustomNode,
  textNode: CustomNode,
  ifCondition: CustomNode,
  sendMessage: CustomNode,
  logger: CustomNode,
  apiCall: CustomNode,
  rateLimiter: CustomNode,
  delay: CustomNode,
  errorHandler: CustomNode,
  functionCall: CustomNode,
  messageHandler: CustomNode,
  registerHandlerNode: CustomNode,
  asyncMethodNode: CustomNode,
  photoUploadHandler: CustomNode,
};

const newBoilerplate = `import os
import asyncio
import threading
import logging
import requests
import time
import traceback
from flask import Flask, request
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, CallbackContext
from dotenv import load_dotenv

# --- Load env vars ---
load_dotenv()
TOKEN = os.getenv("BOT_TOKEN")
WEBHOOK_URL = os.getenv("WEBHOOK_URL")

if not TOKEN:
  raise ValueError("BOT_TOKEN is missing.")

# --- Logger ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# --- Flask app ---
app = Flask(__name__)

# --- Async loop ---
def start_loop(loop):
  asyncio.set_event_loop(loop)
  loop.run_forever()

loop = asyncio.new_event_loop()
app.config["MAIN_LOOP"] = loop
threading.Thread(target=start_loop, args=(loop,), daemon=True).start()

# --- Telegram bot ---
telegram_app = Application.builder().token(TOKEN).build()

async def init_bot():
  if not telegram_app._initialized:
      await telegram_app.initialize()

asyncio.run_coroutine_threadsafe(init_bot(), loop).result(timeout=10)

# --- Commands ---
async def start(update: Update, context: CallbackContext):
  await update.message.reply_text("Welcome to the bot! Type /help for options.")

# --- Handlers ---
telegram_app.add_handler(CommandHandler("start", start))

# --- Flask routes ---
@app.route("/")
def home():
  return "Bot is running!"

@app.route("/webhook", methods=["POST"])
def webhook():
  update_json = request.get_json()
  update = Update.de_json(update_json, telegram_app.bot)
  asyncio.run_coroutine_threadsafe(telegram_app.process_update(update), loop)
  return "OK"

# --- Set webhook ---
async def set_webhook():
  await telegram_app.bot.set_webhook(WEBHOOK_URL)

# --- Optional: keep-alive ping ---
def keep_alive():
  while True:
      try:
          requests.get(WEBHOOK_URL.replace("/webhook", ""))
          logger.info("✅ Keep-alive ping sent.")
      except Exception as e:
          logger.error(f"⚠️ Ping failed: {e}")
      time.sleep(300)

# --- Entry Point ---
if __name__ == "__main__":
  loop.run_until_complete(set_webhook())
  threading.Thread(target=keep_alive, daemon=True).start()
  from waitress import serve
  serve(app, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
`;

const initialNodes = [
  {
    id: '1',
    type: 'startNode',
    data: {
      label: 'Start Bot',
      description: 'Initializes a Telegram bot using Flask.',
      token: 'YOUR_TOKEN_HERE',
      botName: 'MyAwesomeBot',
      botLogo: 'https://placehold.co/100x100/png',
      code: newBoilerplate,
    },
    position: { x: 250, y: 50 },
  },
];

const initialEdges = [];

let id = 0;
const getId = () => `dndnode_${id++}`;

const App = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesState] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(true);
  const [showCodePanel, setShowCodePanel] = useState(true);
  const [showLiveView, setShowLiveView] = useState(false); // New state for live view modal
  const [refreshKey, setRefreshKey] = useState(0);
  const deleteAreaRef = useRef(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const nodeType = event.dataTransfer.getData('node-type');
      const nodeData = JSON.parse(event.dataTransfer.getData('node-data'));

      if (typeof nodeType === 'undefined' || !nodeType) {
        return;
      }

      const newNode = {
        id: getId(),
        type: nodeType,
        position,
        data: nodeData,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes],
  );

  const onDragStart = (event, nodeType, nodeData) => {
    event.dataTransfer.setData('node-type', nodeType);
    event.dataTransfer.setData('node-data', JSON.stringify(nodeData));
    event.dataTransfer.effectAllowed = 'move';
  };

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    setShowSettingsPanel(true);
  }, []);

  const updateNodeData = useCallback((nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      )
    );
    setSelectedNode(prev => ({
      ...prev,
      data: { ...prev.data, ...newData }
    }));
  }, [setNodes]);

  const onDeleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    setSelectedNode(null);
  }, [setNodes, setEdges]);

  const onNodeDragStop = useCallback((event, node) => {
    const deleteArea = deleteAreaRef.current.getBoundingClientRect();
    const nodePosition = {
      x: event.clientX,
      y: event.clientY,
    };
    if (
      nodePosition.x > deleteArea.left &&
      nodePosition.x < deleteArea.right &&
      nodePosition.y > deleteArea.top &&
      nodePosition.y < deleteArea.bottom
    ) {
      onDeleteNode(node.id);
    }
    setIsDeleting(false);
  }, [onDeleteNode]);

  const onNodeDrag = useCallback((event, node) => {
    const deleteArea = deleteAreaRef.current.getBoundingClientRect();
    const nodePosition = {
      x: event.clientX,
      y: event.clientY,
    };

    if (
      nodePosition.x > deleteArea.left &&
      nodePosition.x < deleteArea.right &&
      nodePosition.y > deleteArea.top &&
      nodePosition.y < deleteArea.bottom
    ) {
      setIsDeleting(true);
    } else {
      setIsDeleting(false);
    }
  }, []);

  const onRefreshCode = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };
  
  // New handler to toggle the Live View modal
  const toggleLiveView = () => {
    setShowLiveView(prev => !prev);
  };

  return (
    <div className="flex flex-col w-full h-screen bg-gray-900 font-inter antialiased">
      <Navbar
        toggleSettingsPanel={() => setShowSettingsPanel(prev => !prev)}
        toggleCodePanel={() => setShowCodePanel(prev => !prev)}
        toggleLiveView={toggleLiveView} // Pass the new handler
      />
      <div className="flex flex-grow w-full h-full">
        <ReactFlowProvider>
          <Sidebar onDragStart={onDragStart} />
          <div className="flex-grow h-full" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesState} // Changed to onEdgesState for correctness
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeClick={onNodeClick}
              onNodeDrag={onNodeDrag}
              onNodeDragStop={onNodeDragStop}
              nodeTypes={nodeTypes}
              fitView
              className="!bg-gray-900"
            >
              <Background color="#555" gap={16} />
              <Controls className="dark:bg-gray-900 dark:text-white dark:border-gray-700 rounded-lg" />
              <MiniMap className="!bg-gray-900 rounded-lg" nodeStrokeWidth={3} zoomable pannable />
              <Panel position="top-right" className="bg-gray-900 text-white p-2 rounded-lg shadow-md border border-gray-700">
                <span className="font-bold">Workflow Builder</span>
              </Panel>
              <Panel position="top-left" ref={deleteAreaRef}>
                <div
                  className={`p-4 rounded-lg transition-colors ${isDeleting ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-400'}`}
                  style={{ transition: 'background-color 0.3s' }}
                >
                  <FaTrash className="text-2xl" />
                </div>
              </Panel>
            </ReactFlow>
          </div>
          {showSettingsPanel && (
            <SettingsPanel
              selectedNode={selectedNode}
              updateNodeData={updateNodeData}
              onDeleteNode={onDeleteNode}
              togglePanel={() => setShowSettingsPanel(false)}
            />
          )}
          {showCodePanel && (
            <CodeOutput
              nodes={nodes}
              edges={edges}
              togglePanel={() => setShowCodePanel(false)}
              onRefresh={onRefreshCode}
              refreshKey={refreshKey}
            />
          )}
        </ReactFlowProvider>
      </div>
      {/* Conditionally render the new modal */}
      {showLiveView && <LiveViewModal onClose={toggleLiveView} />}
    </div>
  );
};

export default App;