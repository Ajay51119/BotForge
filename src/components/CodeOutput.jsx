import React, { useState, useEffect, useCallback } from 'react';
import { FaCopy, FaTimes, FaSyncAlt } from 'react-icons/fa';

/**
 * The CodeOutput component is responsible for generating and displaying
 * Python code based on the nodes and edges in the React Flow canvas.
 * It dynamically constructs the code by traversing the connected nodes
 * starting from the 'Start Bot' node.
 */
const CodeOutput = ({ nodes, edges, togglePanel, onRefresh, refreshKey }) => {
  const [generatedCode, setGeneratedCode] = useState('');

  /**
   * Handles copying the generated code to the clipboard.
   * Uses `document.execCommand` for compatibility within the Canvas environment.
   */
  const handleCopyCode = useCallback(() => {
    try {
      const codeElement = document.getElementById('generated-code-block');
      if (codeElement) {
        const textToCopy = codeElement.innerText;
        // Use document.execCommand('copy') for broader compatibility
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        console.log('Code copied to clipboard!');
      }
    } catch (err) {
      console.error('Copy failed:', err);
    }
  }, []);

  /**
   * Finds the value of a connected node.
   * This is used to determine the value of a variable, a message, or a condition.
   * @param {string} targetNodeId The ID of the node to find the value for.
   * @param {string} targetHandleId The handle ID of the target node.
   * @returns {string|null} The generated code string for the value.
   */
  const findConnectedValue = useCallback((targetNodeId, targetHandleId) => {
    const incomingEdge = edges.find(edge => edge.target === targetNodeId && edge.targetHandle === targetHandleId);
    if (!incomingEdge) return null;

    const sourceNode = nodes.find(node => node.id === incomingEdge.source);
    if (!sourceNode) return null;

    switch (sourceNode.type) {
      case 'variableNode':
        // Returns the variable name.
        return sourceNode.data.name; 
      case 'textNode':
        // Returns the text content as a string literal.
        return `'${sourceNode.data.text}'`; 
      case 'functionCall':
        // Returns a function call string with placeholder for parameters.
        const paramsValue = findConnectedValue(sourceNode.id, 'params');
        return `${sourceNode.data.function_name}(${paramsValue || ''})`;
      default:
        return `''`; // Default empty string for unknown value types
    }
  }, [nodes, edges]);

  /**
   * Generates a code block for a given node and its children.
   * This is a recursive function that builds the body of handlers or functions.
   * @param {string} nodeId The ID of the starting node for traversal.
   * @param {number} indentLevel The current indentation level.
   * @param {Set<string>} visited A set to track visited nodes to prevent infinite loops.
   * @returns {string} The generated code block.
   */
  const generateCodeBlock = useCallback((nodeId, indentLevel, visited) => {
    let code = '';
    const indent = ' '.repeat(4 * indentLevel);
    
    // Find the current node
    const currentNode = nodes.find(n => n.id === nodeId);
    if (!currentNode || visited.has(currentNode.id)) {
      return '';
    }
    visited.add(currentNode.id);

    switch (currentNode.type) {
      case 'variableNode': {
        const value = findConnectedValue(currentNode.id, 'value') || `''`;
        code += `${indent}${currentNode.data.name} = ${value}\n`;
        break;
      }
      case 'sendMessage': {
        const messageValue = findConnectedValue(currentNode.id, 'message') || `''`;
        code += `${indent}await update.message.reply_text(${messageValue})\n`;
        break;
      }
      case 'functionCall': {
        const paramsValue = findConnectedValue(currentNode.id, 'params') || '';
        code += `${indent}await ${currentNode.data.function_name}(${paramsValue})\n`;
        break;
      }
      case 'ifCondition': {
        const condition = findConnectedValue(currentNode.id, 'condition') || 'True';
        code += `${indent}if ${condition}:\n`;
        
        // Find the node connected to the 'true' handle
        const trueEdge = edges.find(e => e.source === currentNode.id && e.sourceHandle === 'true');
        if (trueEdge) {
          code += generateCodeBlock(trueEdge.target, indentLevel + 1, new Set(visited));
        } else {
          code += `${indent}    pass # No logic for true branch\n`;
        }

        // Find the node connected to the 'false' handle (optional)
        const falseEdge = edges.find(e => e.source === currentNode.id && e.sourceHandle === 'false');
        if (falseEdge) {
          code += `${indent}else:\n`;
          code += generateCodeBlock(falseEdge.target, indentLevel + 1, new Set(visited));
        }
        break;
      }
      case 'delay': {
        const seconds = currentNode.data.seconds || 1;
        code += `${indent}await asyncio.sleep(${seconds})\n`;
        break;
      }
      case 'logger': {
        const logValue = findConnectedValue(currentNode.id, 'message') || `''`;
        code += `${indent}logger.info(f"Generated Log: {${logValue}}")\n`;
        break;
      }
      case 'apiCall': {
        const url = findConnectedValue(currentNode.id, 'url') || `''`; // Assuming 'url' handle for dynamic URL
        const method = currentNode.data.method || 'GET';
        const headers = currentNode.data.headers ? `, headers=${currentNode.data.headers}` : '';
        const body = currentNode.data.body ? `, json=${currentNode.data.body}` : ''; // Assuming JSON body
        const storeResponseAs = currentNode.data.store_response_as || 'api_response';

        code += `${indent}try:\n`;
        code += `${indent}    response = await requests.request(method='${method}', url=${url}${headers}${body})\n`;
        code += `${indent}    response.raise_for_status()\n`;
        code += `${indent}    ${storeResponseAs} = response.json()\n`;
        code += `${indent}except Exception as e:\n`;
        code += `${indent}    logger.error(f"API call failed: {e}")\n`;
        break;
      }
      case 'errorHandler': {
        const fallbackMessage = findConnectedValue(currentNode.id, 'fallback_message') || '"An error occurred."';
        code += `${indent}try:\n`;
        
        const tryBlockNode = edges.find(e => e.source === currentNode.id && e.sourceHandle === 'try');
        if (tryBlockNode) {
          code += generateCodeBlock(tryBlockNode.target, indentLevel + 1, new Set(visited));
        } else {
          code += `${indent}    pass # No logic in try block\n`;
        }
        
        code += `${indent}except Exception as e:\n`;
        code += `${indent}    logger.error(f"Error in a block: {e}")\n`;
        code += `${indent}    await update.message.reply_text(${fallbackMessage})\n`;
        break;
      }
      case 'photoUploadHandler': {
        code += `${indent}if update.message.photo:\n`;
        code += `${indent}    file_id = update.message.photo[-1].file_id\n`;
        code += `${indent}    logger.info(f"Received photo with file_id: {file_id}")\n`;
        const successMessage = findConnectedValue(currentNode.id, 'success_message') || `"${currentNode.data.success_message}"`;
        code += `${indent}    await update.message.reply_text(${successMessage})\n`;
        if (currentNode.data.variable_to_set) {
          code += `${indent}    ${currentNode.data.variable_to_set} = True\n`;
        }
        break;
      }
      case 'textNode':
        // TextNode's primary purpose is to provide a string value to other nodes.
        // It doesn't generate executable code on its own in the main flow.
        // Its value is retrieved via findConnectedValue.
        break;
      default:
        // For any other nodes that might be connected in the flow but don't generate specific code blocks
        code += `${indent}# Node type '${currentNode.type}' at ID ${currentNode.id} not explicitly handled in code generation block.\n`;
        break;
    }

    // Traverse to the next node in the main flow.
    const nextEdge = edges.find(e => e.source === currentNode.id && e.sourceHandle === 'output');
    if (nextEdge) {
      code += generateCodeBlock(nextEdge.target, indentLevel, visited);
    }

    return code;
  }, [nodes, edges, findConnectedValue]);

  /**
   * The main function to generate the Python code.
   * It finds all handler-type nodes and generates their respective code blocks.
   */
  useEffect(() => {
    const generateCode = () => {
      const startNode = nodes.find(n => n.type === 'startNode');
      if (!startNode) {
        setGeneratedCode('# Please add the "Start Bot" node to begin.');
        return;
      }
      
      let baseBoilerplate = startNode.data.code;
      baseBoilerplate = baseBoilerplate.replace('TOKEN = os.getenv("BOT_TOKEN")', `TOKEN = "${startNode.data.token}"`);
      if (startNode.data.webhook_url) {
        baseBoilerplate = baseBoilerplate.replace('WEBHOOK_URL = os.getenv("WEBHOOK_URL")', `WEBHOOK_URL = "${startNode.data.webhook_url}"`);
      }

      const asyncMethodDefinitions = [];
      const handlerRegistrations = [];
      const customFlaskRoutes = [];
      const visitedNodes = new Set();
      
      // Collect all async methods and their bodies
      nodes.filter(n => n.type === 'asyncMethodNode').forEach(node => {
        const methodName = node.data.method_name || 'my_async_method';
        const initialMessage = node.data.message ? `await update.message.reply_text("${node.data.message}")` : '';
        let methodBody = '';

        const nextEdge = edges.find(e => e.source === node.id && e.sourceHandle === 'output');
        if (nextEdge) {
          methodBody = generateCodeBlock(nextEdge.target, 2, visitedNodes); // Indent by 2 for method body
        }

        asyncMethodDefinitions.push(`
async def ${methodName}(update: Update, context: CallbackContext):
    chat_id = update.effective_chat.id
    logger.info(f"Handling method: ${methodName} for chat: {chat_id}")
    ${initialMessage ? initialMessage + '\n    ' : ''}${methodBody || 'pass'}
`);
      });

      // Collect all handler registrations
      nodes.filter(n => n.type === 'registerHandlerNode').forEach(node => {
        const handlerType = node.data.handler_type;
        const trigger = node.data.trigger;
        const functionName = node.data.function_name;

        if (handlerType === 'command') {
          handlerRegistrations.push(`telegram_app.add_handler(CommandHandler("${trigger}", ${functionName}))`);
        } else if (handlerType === 'message') {
          // Assuming 'text' for general messages, 'photo' for photos
          const filter = trigger === 'photo' ? 'filters.PHOTO' : 'filters.TEXT & ~filters.COMMAND';
          handlerRegistrations.push(`telegram_app.add_handler(MessageHandler(${filter}, ${functionName}))`);
        }
      });

      // Collect all custom Flask routes
      nodes.filter(n => n.type === 'routerNode').forEach(node => {
        const routeName = node.data.routeName || '/custom';
        const method = node.data.method || 'GET';
        let routeCodeBody = node.data.code || 'return "OK", 200'; // Default or manual code

        // If there are connected nodes to the router, generate code from them
        const nextEdge = edges.find(e => e.source === node.id && e.sourceHandle === 'output');
        if (nextEdge) {
          // Flask routes are synchronous, so remove 'await' from generated async code
          routeCodeBody = generateCodeBlock(nextEdge.target, 1, visitedNodes).replace(/await /g, '');
          if (!routeCodeBody.includes('return')) { // Ensure there's a return statement
            routeCodeBody += `    return "OK", 200\n`;
          }
        } else {
          // Ensure manual code is indented correctly
          routeCodeBody = routeCodeBody.split('\n').map(line => `    ${line}`).join('\n');
        }

        customFlaskRoutes.push(`
@app.route("${routeName}", methods=["${method}"])
def custom_route_${node.id.replace('-', '_')}(): # Unique function name
${routeCodeBody}
`);
      });

      // Inject generated code into the boilerplate
      let finalCode = baseBoilerplate;

      // Inject Async Method Definitions
      const commandsSectionStart = finalCode.indexOf('# --- Commands ---');
      if (commandsSectionStart !== -1) {
        finalCode = finalCode.slice(0, commandsSectionStart) + 
                    asyncMethodDefinitions.join('\n') + '\n\n' +
                    finalCode.slice(commandsSectionStart);
      }

      // Inject Handler Registrations
      const handlersSectionStart = finalCode.indexOf('# --- Handlers ---');
      if (handlersSectionStart !== -1) {
        // Find the end of the existing handlers to append
        const handlersSectionEnd = finalCode.indexOf('\n# --- Flask routes ---', handlersSectionStart);
        if (handlersSectionEnd !== -1) {
          const existingHandlers = finalCode.substring(handlersSectionStart, handlersSectionEnd);
          const newHandlers = handlerRegistrations.filter(reg => !existingHandlers.includes(reg)).join('\n');
          finalCode = finalCode.slice(0, handlersSectionEnd) + 
                      (newHandlers ? '\n' + newHandlers : '') + 
                      finalCode.slice(handlersSectionEnd);
        }
      }

      // Inject Custom Flask Routes
      const flaskRoutesSectionStart = finalCode.indexOf('# --- Flask routes ---');
      if (flaskRoutesSectionStart !== -1) {
        const entryPointStart = finalCode.indexOf('# --- Set webhook ---', flaskRoutesSectionStart);
        if (entryPointStart !== -1) {
          finalCode = finalCode.slice(0, entryPointStart) + 
                      customFlaskRoutes.join('\n') + '\n' +
                      finalCode.slice(entryPointStart);
        }
      }

      setGeneratedCode(finalCode);
    };

    generateCode();
  }, [nodes, edges, refreshKey, generateCodeBlock, findConnectedValue]);

  return (
    <div className="border-l border-gray-800 dark:border-gray-700 bg-gray-900 p-4 w-96 h-full flex-shrink-0 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">Generated Code</h3>
        <div className="flex space-x-2">
          <button
            onClick={handleCopyCode}
            className="text-gray-500 hover:text-white p-1 rounded-md bg-gray-800"
            title="Copy Code"
          >
            <FaCopy />
          </button>
          <button
            onClick={onRefresh}
            className="text-gray-500 hover:text-white p-1 rounded-md bg-gray-800"
            title="Refresh Code"
          >
            <FaSyncAlt />
          </button>
          <button
            onClick={togglePanel}
            className="text-gray-500 hover:text-white p-1 rounded-md bg-gray-800"
            title="Hide Panel"
          >
            <FaTimes />
          </button>
        </div>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm text-green-400 font-mono flex-grow">
        <pre id="generated-code-block">{generatedCode}</pre>
      </div>
    </div>
  );
};

export default CodeOutput;
