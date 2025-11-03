import React from 'react';
import { FaTimes } from 'react-icons/fa';

const SettingsPanel = ({ selectedNode, updateNodeData, onDeleteNode, togglePanel }) => {
  // If no node is selected, display a message
  if (!selectedNode) {
    return (
      <div className="border-l border-gray-800 dark:border-gray-700 bg-gray-900 p-4 w-64 h-full flex-shrink-0 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Node Settings</h3>
          <button onClick={togglePanel} className="text-gray-500 hover:text-white transition-colors">
            <FaTimes />
          </button>
        </div>
        <p className="text-gray-500">Select a node to edit its settings.</p>
      </div>
    );
  }

  // Handle input changes and update the node data
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = value;

    if (name === 'parameters') {
      newValue = value.split(',').map(param => param.trim());
    } else if (type === 'number') {
      newValue = parseFloat(value);
    } else if (type === 'checkbox') {
      newValue = checked;
    }

    updateNodeData(selectedNode.id, { [name]: newValue });
  };

  const renderFields = (data) => {
    switch (selectedNode.type) { // Use selectedNode.type for consistency with nodeTypes definition
      case 'startNode':
        return (
          <>
            <label className="block mb-2 text-sm font-medium text-white">
              Telegram Bot Token:
              <input
                type="text"
                name="token"
                value={data.token}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-700 text-white"
              />
            </label>
            <label className="block mb-2 text-sm font-medium text-white">
              Bot Name:
              <input
                type="text"
                name="botName"
                value={data.botName || ''} // Provide default empty string for new nodes
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-700 text-white"
              />
            </label>
            <label className="block mb-2 text-sm font-medium text-white">
              Bot Logo URL:
              <input
                type="text"
                name="botLogo"
                value={data.botLogo || ''} // Provide default empty string
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-700 text-white"
              />
            </label>
            <label className="block mb-2 text-sm font-medium text-white">
              Webhook URL:
              <input
                type="text"
                name="webhook_url"
                value={data.webhook_url || ''} // Provide default empty string
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-700 text-white"
              />
            </label>
          </>
        );
      case 'routerNode':
        return (
          <>
            <label className="block mb-2 text-sm font-medium text-white">
              Route Name:
              <input
                type="text"
                name="routeName"
                value={data.routeName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-700 text-white"
              />
            </label>
            <label className="block mb-2 text-sm font-medium text-white">
              Method:
              <select
                name="method"
                value={data.method}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-700 text-white"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </label>
            <label className="block mb-2 text-sm font-medium text-white">
              Custom Code (optional):
              <textarea
                name="code"
                value={data.code || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-700 text-white"
                rows="5"
              />
            </label>
          </>
        );
      case 'variableNode':
        return (
          <>
            <label className="block mb-2 text-sm font-medium text-white">
              Name:
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-700 text-white"
              />
            </label>
            <label className="block mb-2 text-sm font-medium text-white">
              Value:
              <input
                type="text"
                name="value"
                value={data.value}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-700 text-white"
              />
            </label>
          </>
        );
      case 'functionNode':
        return (
          <>
            <label className="block mb-2 text-sm font-medium text-white">
              Function Name:
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-700 text-white"
              />
            </label>
            <label className="block mb-2 text-sm font-medium text-white">
              Parameters (comma-separated):
              <input
                type="text"
                name="parameters"
                value={Array.isArray(data.parameters) ? data.parameters.join(', ') : data.parameters}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-700 text-white"
              />
            </label>
            <label className="block mb-2 text-sm font-medium text-white">
              Response (for command functions):
              <textarea
                name="response"
                value={data.response || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-700 text-white"
                rows="3"
              />
            </label>
          </>
        );
      case 'textNode':
        return (
          <>
            <label className="block mb-2 text-sm font-medium text-white">
              Text Content:
              <textarea
                name="text"
                value={data.text}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-700 text-white"
                rows="5"
              />
            </label>
          </>
        );
      case 'messageHandler':
        return (
          <>
            <label className="block mb-2 text-sm font-medium text-white">
              Reply Prefix:
              <input
                type="text"
                name="reply_prefix"
                value={data.reply_prefix}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-700 text-white"
              />
            </label>
            <label className="block mb-2 text-sm font-medium text-white">
              Fallback Message:
              <textarea
                name="fallback_message"
                value={data.fallback_message || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-700 text-white"
                rows="3"
              />
            </label>
          </>
        );
      case 'rateLimiter':
        return (
          <>
            <label className="block mb-2 text-sm font-medium text-white">
              Limit (requests):
              <input
                type="number"
                name="limit"
                value={data.limit}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-700 text-white"
              />
            </label>
            <label className="block mb-2 text-sm font-medium text-white">
              Interval (seconds):
              <input
                type="number"
                name="interval"
                value={data.interval}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-700 text-white"
              />
            </label>
          </>
        );
      case 'apiCall':
        return (
          <>
            <label className="block mb-2 text-sm font-medium text-white">
              Method:
              <select
                name="method"
                value={data.method}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-700 text-white"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </label>
            <label className="block mb-2 text-sm font-medium text-white">
              URL:
              <input
                type="text"
                name="url"
                value={data.url}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-700 text-white"
              />
            </label>
            <label className="block mb-2 text-sm font-medium text-white">
              Headers (JSON string):
              <textarea
                name="headers"
                value={data.headers || '{}'}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-700 text-white"
                rows="3"
              />
            </label>
            <label className="block mb-2 text-sm font-medium text-white">
              Body (JSON string, for POST/PUT):
              <textarea
                name="body"
                value={data.body || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-700 text-white"
                rows="3"
              />
            </label>
            <label className="block mb-2 text-sm font-medium text-white">
              Store Response As:
              <input
                type="text"
                name="store_response_as"
                value={data.store_response_as || 'api_response'}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-700 text-white"
              />
            </label>
          </>
        );
      case 'logger':
        return (
          <>
            <label className="block mb-2 text-sm font-medium text-white">
              Message:
              <textarea
                name="message"
                value={data.message}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-700 text-white"
                rows="3"
              />
            </label>
          </>
        );
      case 'ifCondition':
        return (
          <>
            <label className="block mb-2 text-sm font-medium text-white">
              Condition:
              <input
                type="text"
                name="condition"
                value={data.condition}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-700 text-white"
              />
            </label>
          </>
        );
      case 'sendMessage':
        return (
          <>
            <label className="block mb-2 text-sm font-medium text-white">
              Message:
              <textarea
                name="message"
                value={data.message}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-700 text-white"
                rows="3"
              />
            </label>
          </>
        );
      case 'errorHandler':
        return (
          <>
            <label className="block mb-2 text-sm font-medium text-white">
              Fallback Message:
              <textarea
                name="fallback_message"
                value={data.fallback_message}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-700 text-white"
                rows="3"
              />
            </label>
          </>
        );
      case 'functionCall':
        return (
          <>
            <label className="block mb-2 text-sm font-medium text-white">
              Function Name:
              <input
                type="text"
                name="function_name"
                value={data.function_name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-700 text-white"
              />
            </label>
          </>
        );
      case 'delay':
        return (
          <>
            <label className="block mb-2 text-sm font-medium text-white">
              Seconds:
              <input
                type="number"
                name="seconds"
                value={data.seconds}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-700 text-white"
              />
            </label>
          </>
        );
      case 'registerHandlerNode':
        return (
          <>
            <label className="block mb-2 text-sm font-medium text-white">
              Handler Type:
              <select
                name="handler_type"
                value={data.handler_type}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-700 text-white"
              >
                <option value="command">Command</option>
                <option value="message">Message</option>
                <option value="photo">Photo</option>
              </select>
            </label>
            <label className="block mb-2 text-sm font-medium text-white">
              Trigger (e.g., "start" for command, "text" for message):
              <input
                type="text"
                name="trigger"
                value={data.trigger}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-700 text-white"
              />
            </label>
            <label className="block mb-2 text-sm font-medium text-white">
              Function Name to Call:
              <input
                type="text"
                name="function_name"
                value={data.function_name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-700 text-white"
              />
            </label>
          </>
        );
      case 'asyncMethodNode':
        return (
          <>
            <label className="block mb-2 text-sm font-medium text-white">
              Method Name:
              <input
                type="text"
                name="method_name"
                value={data.method_name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-700 text-white"
              />
            </label>
            <label className="block mb-2 text-sm font-medium text-white">
              Initial Message (optional):
              <textarea
                name="message"
                value={data.message || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-700 text-white"
                rows="3"
              />
            </label>
          </>
        );
      case 'photoUploadHandler':
        return (
          <>
            <label className="block mb-2 text-sm font-medium text-white">
              Success Message:
              <textarea
                name="success_message"
                value={data.success_message || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-700 text-white"
                rows="3"
              />
            </label>
            <label className="block mb-2 text-sm font-medium text-white">
              Variable to Set (optional):
              <input
                type="text"
                name="variable_to_set"
                value={data.variable_to_set || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-700 text-white"
              />
            </label>
          </>
        );
      default:
        return <p className="text-gray-500">No editable fields for this node type.</p>;
    }
  };

  return (
    <div className="border-l border-gray-800 bg-gray-900 p-4 w-64 h-full flex-shrink-0 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">Node Settings</h3>
        <button onClick={togglePanel} className="text-gray-500 hover:text-white transition-colors">
          <FaTimes />
        </button>
      </div>
      <div className="p-4 bg-gray-800 rounded-lg">
        <p className="text-gray-300 font-bold mb-2">{selectedNode.data.label}</p>
        <p className="text-gray-500 text-sm mb-4">{selectedNode.data.description}</p>
        {renderFields(selectedNode.data)}
        <button
          onClick={() => onDeleteNode(selectedNode.id)}
          className="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Delete Node
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;
