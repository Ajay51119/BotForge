🤖 BotForge – Drag-and-Drop Bot Builder (Telegram / Instagram)

This project provides a React + Vite setup for building a no-code, drag-and-drop tool that lets users create, design, and deploy chatbots for Telegram, Instagram, and WhatsApp — all through an intuitive visual interface.

BotForge enables users to create automated conversational flows without coding knowledge, making bot creation faster, smarter, and more accessible.

🧩 Features

⚙️ Drag-and-Drop Flow Builder – Visually design bot logic and conversation flows.

💬 Multi-Platform Integration – Deploy bots on Telegram, Instagram, or WhatsApp.

🧠 No-Code Automation – Create intelligent bots without writing a single line of code.

🔗 Custom API / Webhook Integration – Connect external APIs and services easily.

🔍 Real-Time Preview – Test your bot directly in the editor before deploying.

☁️ Instant Deployment – Deploy bots to your chosen platform in one click.

🛠️ Tech Stack

Frontend: React + Vite + Tailwind CSS + React Flow

Backend: Node.js / Express

Database: MongoDB / Firebase

Bot APIs: Telegram Bot API, Meta Graph API (Instagram), Twilio (WhatsApp)

Auth: Firebase Auth / JWT

Hosting: Vercel / Render / Netlify

🚀 Getting Started
1️⃣ Clone the repository
git clone https://github.com/Ajay51119/BotForge.git
cd BotForge

2️⃣ Install dependencies
npm install

3️⃣ Run the development server
npm run dev


Then open your browser and visit:
👉 http://localhost:5173

🔧 Integrations Setup
🟢 Telegram

Create a bot using BotFather

Copy your Bot Token

Add it to the Integration Settings panel in BotForge

🟣 Instagram

Create an app via Meta for Developers

Obtain Access Token and App ID

Connect your Instagram Business Account

🟡 WhatsApp

Use Twilio or Meta Cloud API

Paste credentials in your integration section

🧠 Project Structure
BotForge/
│
├── frontend/              # React + Vite app (drag-and-drop builder)
│   ├── components/
│   ├── pages/
│   ├── utils/
│   └── App.jsx
│
├── backend/               # Express server for APIs & bot logic
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── index.js
│
└── README.md

🧪 Available Scripts
Command	Description
npm run dev	Start development server
npm run build	Build the production app
npm run preview	Preview the production build locally
npm run lint	Run ESLint for code quality
🧰 Expanding the ESLint Configuration

If you’re developing a production application, we recommend integrating TypeScript with type-aware lint rules.
You can check out the React + TypeScript template
 for details on adding TypeScript and typescript-eslint
 to your project.

🌐 Demo

🎥 Live Demo: Coming Soon
📦 GitHub Repo: Ajay51119/BotForge

👨‍💻 Author

Ajay Kumar
📧 ajayk390635@gmail.com

🌐 GitHub – Ajay51119
