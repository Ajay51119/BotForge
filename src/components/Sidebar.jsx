import React, { useState, useEffect, useRef } from 'react';
import {
  FaRoute,
  FaKey,
  FaCogs,
  FaEnvelope,
  FaTachometerAlt,
  FaSearch,
  FaQuestion,
  FaPaperPlane,
  FaExclamationTriangle,
  FaClock,
  FaFont,
  FaRobot,
  FaCodeBranch,
  FaSyncAlt,
} from 'react-icons/fa';
import '../index.css';

const Sidebar = ({ onDragStart }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const hoverTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const DraggableItem = ({ type, label, icon, color, dragData, description }) => (
    <div
      className="flex flex-col p-3 border border-gray-700 bg-gray-800 rounded-lg cursor-grab transition-colors duration-200 ease-in-out hover:bg-gray-700"
      onDragStart={(event) => onDragStart(event, type, dragData)}
      draggable
      onMouseEnter={() => {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
        }
        hoverTimeoutRef.current = setTimeout(() => {
          setHoveredItem(type);
        }, 1000);
      }}
      onMouseLeave={() => {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
        }
        setHoveredItem(null);
      }}
    >
      <div className="flex items-center space-x-3">
        <div
          className={`w-9 h-9 rounded-full flex-shrink-0 ${color} flex items-center justify-center text-white text-base`}
        >
          {icon}
        </div>
        <span className="text-gray-200 font-medium text-sm">{label}</span>
      </div>
      {hoveredItem === type && (
        <p className="mt-2 text-xs text-gray-400 opacity-100 transition-opacity duration-300">
          {description}
        </p>
      )}
    </div>
  );

  const telegramBotBoilerplate = `import os
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

  return (
    <aside className="custom-scrollbar bg-gray-900 p-4 w-64 h-full flex-shrink-0 overflow-y-auto">
      <h3 className="text-xl font-bold text-white mb-4">Components</h3>
      <div className="grid grid-cols-1 gap-3">
        <DraggableItem
          type="startNode"
          label="Start Bot"
          icon={<FaRobot />}
          color="bg-purple-600"
          dragData={{
            label: 'Start Bot',
            description: 'Initializes a Telegram bot using Flask.',
            token: 'YOUR_TOKEN_HERE',
            code: telegramBotBoilerplate,
          }}
          description="Initializes a Telegram bot using a Flask webhook."
        />

        <DraggableItem
          type="routerNode"
          label="API Route"
          icon={<FaRoute />}
          color="bg-emerald-500"
          dragData={{
            label: 'API Route',
            routeName: '/new-route',
            method: 'GET',
            description: 'Defines a new API endpoint for your application.',
          }}
          description="Defines a new API endpoint for your application."
        />

        <DraggableItem
          type="variableNode"
          label="Variable"
          icon={<FaKey />}
          color="bg-yellow-500"
          dragData={{
            label: 'Variable',
            name: 'my_variable',
            value: '',
            description: 'Creates a variable to store and use data in your workflow.',
          }}
          description="Creates a variable to store and use data in your workflow."
        />

        <DraggableItem
          type="functionNode"
          label="Function"
          icon={<FaCogs />}
          color="bg-blue-500"
          dragData={{
            label: 'Function',
            name: 'myFunction',
            parameters: [],
            description: 'Defines a reusable block of logic.',
          }}
          description="Defines a reusable block of logic with custom parameters."
        />

        <DraggableItem
          type="textNode"
          label="Text"
          icon={<FaFont />}
          color="bg-gray-500"
          dragData={{
            label: 'Text',
            text: 'This is a text block.',
            description: 'Displays a block of text on the canvas.',
          }}
          description="Displays a block of text on the canvas."
        />

        <DraggableItem
          type="messageHandler"
          label="Message Handler"
          icon={<FaEnvelope />}
          color="bg-lime-500"
          dragData={{
            label: 'Message Handler',
            reply_prefix: 'Echo: ',
            description: 'Processes incoming messages from a user.',
          }}
          description="Processes incoming messages from a user."
        />

        <DraggableItem
          type="rateLimiter"
          label="Rate Limiter"
          icon={<FaTachometerAlt />}
          color="bg-sky-500"
          dragData={{
            label: 'Rate Limiter',
            limit: 5,
            interval: 60,
            description: 'Limits the number of requests in a given time period.',
          }}
          description="Limits the number of requests in a given time period."
        />

        <DraggableItem
          type="apiCall"
          label="API Call"
          icon={<FaCogs />}
          color="bg-red-500"
          dragData={{
            label: 'API Call',
            method: 'GET',
            url: 'https://api.example.com/data',
            headers: '{}',
            body: '',
            store_response_as: 'api_result',
            description: 'Makes an HTTP request to an external API endpoint.',
          }}
          description="Makes an HTTP request to an external API endpoint."
        />

        <DraggableItem
          type="logger"
          label="Logger"
          icon={<FaSearch />}
          color="bg-fuchsia-500"
          dragData={{
            label: 'Logger',
            message: 'Received user input: {message.text}',
            description: 'Logs a message to the console for debugging.',
          }}
          description="Logs a message to the console for debugging."
        />

        <DraggableItem
          type="ifCondition"
          label="If Condition"
          icon={<FaQuestion />}
          color="bg-orange-500"
          dragData={{
            label: 'If Condition',
            condition: 'message.text == "hello"',
            description: 'Evaluates a condition and branches the workflow.',
          }}
          description="Evaluates a condition and branches the workflow."
        />

        <DraggableItem
          type="sendMessage"
          label="Send Message"
          icon={<FaPaperPlane />}
          color="bg-pink-500"
          dragData={{
            label: 'Send Message',
            message: 'Thank you!',
            description: 'Sends a message to the user.',
          }}
          description="Sends a message to the user."
        />

        <DraggableItem
          type="errorHandler"
          label="Error Handler"
          icon={<FaExclamationTriangle />}
          color="bg-stone-500"
          dragData={{
            label: 'Error Handler',
            fallback_message: 'Oops, failed.',
            description: 'Handles errors that occur in the workflow.',
          }}
          description="Handles errors that occur in the workflow."
        />

        <DraggableItem
          type="functionCall"
          label="Function Call"
          icon={<FaCogs />}
          color="bg-teal-500"
          dragData={{
            label: 'Function Call',
            function_name: 'handle_user_data',
            description: 'Calls an external function.',
          }}
          description="Calls an external function."
        />

        <DraggableItem
          type="delay"
          label="Delay"
          icon={<FaClock />}
          color="bg-amber-500"
          dragData={{
            label: 'Delay',
            seconds: 2,
            description: 'Pauses the workflow for a specified duration.',
          }}
          description="Pauses the workflow for a specified duration."
        />

        <DraggableItem
          type="registerHandlerNode"
          label="Register Handler"
          icon={<FaCodeBranch />}
          color="bg-purple-700"
          dragData={{
            label: 'Register Handler',
            handler_type: 'command',
            trigger: 'mycommand',
            function_name: 'my_async_method',
            description: 'Registers a Telegram handler (command or message) to an async method.',
          }}
          description="Registers a Telegram handler (command or message) to an async method."
        />

        <DraggableItem
          type="asyncMethodNode"
          label="Async Method"
          icon={<FaSyncAlt />}
          color="bg-orange-600"
          dragData={{
            label: 'Async Method',
            method_name: 'my_async_method',
            message: 'This is an async method.',
            description: 'Defines an asynchronous method for Telegram bot logic.',
          }}
          description="Defines an asynchronous method for Telegram bot logic."
        />
      </div>
    </aside>
  );
};

export default Sidebar;