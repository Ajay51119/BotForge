import React from 'react';
import { Handle, Position } from 'reactflow';
import { 
  FaPlay, FaCube, FaCode, FaComment, FaPaperPlane, FaArrowRight, FaClock, FaBug, 
  FaCloud, FaSitemap, FaExclamationTriangle, FaCamera, FaCodeBranch, FaSyncAlt, 
  FaFont, FaRobot, FaRoute, FaKey, FaTachometerAlt, FaSearch, FaQuestion, FaEnvelope
} from 'react-icons/fa';

/**
 * A generic node template with handles and a customizable icon and color.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The content to display inside the node.
 * @param {string} props.label - The label for the node.
 * @param {string} props.color - The Tailwind CSS color class for the node.
 * @param {React.ReactNode} props.icon - The icon for the node.
 * @param {boolean} props.isConnectable - Whether handles can be connected.
 * @param {boolean} props.hasInput - Whether the node has an input handle.
 * @param {boolean} props.hasOutput - Whether the node has an output handle.
 */
const NodeWrapper = ({ children, label, color, icon, isConnectable, hasInput = true, hasOutput = true }) => {
  return (
    <div className={`p-4 rounded-xl shadow-xl border-2 ${color} min-w-[200px] text-white flex flex-col`}>
      {hasInput && <Handle type="target" position={Position.Left} id="input" isConnectable={isConnectable} className="!bg-gray-300 !w-3 !h-3 !-left-1.5" />}
      <div className="flex items-center mb-2">
        <div className="p-2 rounded-full bg-gray-900 text-white shadow-md">
          {icon}
        </div>
        <div className="ml-3 font-bold text-lg">{label}</div>
      </div>
      <div className="text-gray-300 text-sm mt-1">
        {children}
      </div>
      {hasOutput && <Handle type="source" position={Position.Right} id="output" isConnectable={isConnectable} className="!bg-gray-300 !w-3 !h-3 !-right-1.5" />}
    </div>
  );
};

/**
 * Custom node component that renders different UI based on the node type.
 * @param {object} props - The node props provided by React Flow.
 */
const CustomNode = ({ data, isConnectable }) => {
  switch (data.type) {
    case 'startNode':
      return (
        <NodeWrapper label="Start Bot" color="bg-blue-600 border-blue-400" icon={<FaRobot />} isConnectable={isConnectable} hasInput={false}>
          <p>Initializes the bot and server.</p>
          <p>Token: {data.token}</p>
          {data.webhook_url && <p>Webhook URL: {data.webhook_url}</p>}
        </NodeWrapper>
      );
    case 'routerNode':
      return (
        <NodeWrapper label="API Route" color="bg-teal-600 border-teal-400" icon={<FaRoute />} isConnectable={isConnectable}>
          <p>Route: {data.routeName}</p>
          <p>Method: {data.method}</p>
        </NodeWrapper>
      );
    case 'variableNode':
      return (
        <NodeWrapper label="Variable" color="bg-purple-600 border-purple-400" icon={<FaKey />} isConnectable={isConnectable}>
          <p>Name: {data.name}</p>
          <p>Value: {data.value}</p>
          <Handle type="source" position={Position.Right} id="value" isConnectable={isConnectable} className="!bg-purple-300 !w-3 !h-3 !-right-1.5" />
        </NodeWrapper>
      );
    case 'functionNode': // Repurposed for async methods in boilerplate
      return (
        <NodeWrapper label="Function" color="bg-cyan-600 border-cyan-400" icon={<FaCode />} isConnectable={isConnectable}>
          <p>Name: {data.name}</p>
          {data.response && <p>Response: {data.response}</p>}
        </NodeWrapper>
      );
    case 'textNode':
      return (
        <NodeWrapper label="Text" color="bg-gray-600 border-gray-400" icon={<FaFont />} isConnectable={isConnectable}>
          <p>Text: {data.text}</p>
          <Handle type="source" position={Position.Right} id="string" isConnectable={isConnectable} className="!bg-gray-300 !w-3 !h-3 !-right-1.5" />
        </NodeWrapper>
      );
    case 'messageHandler':
      return (
        <NodeWrapper label="Message Handler" color="bg-green-500 border-green-300" icon={<FaEnvelope />} isConnectable={isConnectable}>
          <p>Reply Prefix: {data.reply_prefix}</p>
          {data.fallback_message && <p>Fallback: {data.fallback_message}</p>}
        </NodeWrapper>
      );
    case 'rateLimiter':
      return (
        <NodeWrapper label="Rate Limiter" color="bg-indigo-500 border-indigo-300" icon={<FaTachometerAlt />} isConnectable={isConnectable}>
          <p>Limit: {data.limit}</p>
          <p>Interval: {data.interval}s</p>
        </NodeWrapper>
      );
    case 'apiCall':
      return (
        <NodeWrapper label="API Call" color="bg-red-500 border-red-300" icon={<FaCloud />} isConnectable={isConnectable}>
          <p>Method: {data.method}</p>
          <p>URL: {data.url}</p>
          {data.store_response_as && <p>Store as: {data.store_response_as}</p>}
        </NodeWrapper>
      );
    case 'logger':
      return (
        <NodeWrapper label="Logger" color="bg-purple-500 border-purple-300" icon={<FaSearch />} isConnectable={isConnectable}>
          <p>Message: {data.message}</p>
        </NodeWrapper>
      );
    case 'ifCondition':
      return (
        <NodeWrapper label="If Condition" color="bg-orange-500 border-orange-300" icon={<FaQuestion />} isConnectable={isConnectable}>
          <p>Condition: {data.condition}</p>
          <Handle type="source" position={Position.Right} id="true" style={{ top: '25%' }} isConnectable={isConnectable} className="!bg-green-300 !w-3 !h-3 !-right-1.5" />
          <Handle type="source" position={Position.Right} id="false" style={{ top: '75%' }} isConnectable={isConnectable} className="!bg-red-300 !w-3 !h-3 !-right-1.5" />
          <Handle type="target" position={Position.Left} id="condition" isConnectable={isConnectable} className="!bg-orange-300 !w-3 !h-3 !-left-1.5" />
        </NodeWrapper>
      );
    case 'sendMessage':
      return (
        <NodeWrapper label="Send Message" color="bg-pink-500 border-pink-300" icon={<FaPaperPlane />} isConnectable={isConnectable}>
          <p>Message: {data.message}</p>
          <Handle type="target" position={Position.Left} id="message" isConnectable={isConnectable} className="!bg-pink-300 !w-3 !h-3 !-left-1.5" />
        </NodeWrapper>
      );
    case 'errorHandler':
      return (
        <NodeWrapper label="Error Handler" color="bg-gray-500 border-gray-300" icon={<FaExclamationTriangle />} isConnectable={isConnectable}>
          <p>Fallback: {data.fallback_message}</p>
          <Handle type="target" position={Position.Left} id="try" style={{ top: '25%' }} isConnectable={isConnectable} className="!bg-green-300 !w-3 !h-3 !-left-1.5" />
        </NodeWrapper>
      );
    case 'functionCall':
      return (
        <NodeWrapper label="Function Call" color="bg-cyan-500 border-cyan-300" icon={<FaCode />} isConnectable={isConnectable}>
          <p>Function: {data.function_name}</p>
        </NodeWrapper>
      );
    case 'delay':
      return (
        <NodeWrapper label="Delay" color="bg-yellow-500 border-yellow-300" icon={<FaClock />} isConnectable={isConnectable}>
          <p>Seconds: {data.seconds}</p>
        </NodeWrapper>
      );
    case 'registerHandlerNode':
      return (
        <NodeWrapper label="Register Handler" color="bg-purple-700 border-purple-500" icon={<FaCodeBranch />} isConnectable={isConnectable}>
          <p>Type: {data.handler_type}</p>
          <p>Trigger: {data.trigger}</p>
          <p>Function: {data.function_name}</p>
        </NodeWrapper>
      );
    case 'asyncMethodNode':
      return (
        <NodeWrapper label="Async Method" color="bg-orange-600 border-orange-400" icon={<FaSyncAlt />} isConnectable={isConnectable}>
          <p>Name: {data.method_name}</p>
          <p>Message: {data.message}</p>
        </NodeWrapper>
      );
    case 'photoUploadHandler':
      return (
        <NodeWrapper label="Photo Upload Handler" color="bg-orange-500 border-orange-300" icon={<FaCamera />} isConnectable={isConnectable}>
          <p>Success Message: {data.success_message}</p>
        </NodeWrapper>
      );
    default:
      return (
        <NodeWrapper label={data.label || 'Unknown Node'} color="bg-gray-600 border-gray-400" icon={<FaCube />} isConnectable={isConnectable}>
          <p>Node type: {data.type}</p>
        </NodeWrapper>
      );
  }
};

export default CustomNode;
