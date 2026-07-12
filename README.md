# InvestIQ – AI Investment Research Agent

🚀 **Live Demo:** [https://invest-iq-peach.vercel.app](https://invest-iq-peach.vercel.app)
*(Backend deployed on Render: `https://investiq-6q87.onrender.com`)*

An AI-powered investment research platform that automatically gathers financial data, company information, and the latest news, then leverages LangChain and Google Gemini to generate a comprehensive investment report (SWOT analysis, risk assessment, and Buy/Hold/Pass recommendations).

## Features
- **Company Search:** Instantly analyze any public company.
- **Dynamic Loading Screen:** View the AI reasoning steps and data gathering in real-time.
- **Premium Results Dashboard:** Beautiful dark-mode interface utilizing glassmorphism, animated particle backgrounds, and Tailwind CSS.
- **Comprehensive Analysis:** Financial data, News sentiment, SWOT analysis, and Risk assessment.
- **Company Comparison:** Compare the financials and AI analysis of two different companies side-by-side.
- **Interactive AI Chat:** Ask follow-up questions about the generated report using the built-in AI assistant.
- **Export to PDF:** Download the final report as a PDF document.

## Technology Stack
- **Frontend:** React.js, Tailwind CSS, Vite, Axios, html2canvas, jsPDF, Framer Motion.
- **Backend:** Node.js, Express.js.
- **AI/LLM:** LangChain.js, Google Gemini (`gemini-1.5-flash`).
- **External APIs:** Yahoo Finance (`yahoo-finance2`), Tavily Search API.

## System Architecture
The user enters a company name in the React frontend, which sends a POST request to the Express backend. The backend triggers a LangChain workflow:
1. **Parallel Data Gathering:** Fetch financials via Yahoo Finance, and company info + news via Tavily.
2. **AI Processing:** Send the structured context to Gemini 1.5 Flash using LangChain prompts.
3. **Structured Output:** Gemini returns a strictly formatted JSON report.
4. **Display:** The React dashboard renders the report with dynamic gauges, badges, chat functionality, and export options.

## Installation Steps

1. **Clone the repository (or navigate to the directory).**

2. **Backend Setup:**
   ```bash
   cd server
   npm install
   ```
   - Create a `.env` file in the `server` directory.
   - Add your API keys:
     ```env
     GOOGLE_API_KEY=your_gemini_api_key_here
     TAVILY_API_KEY=your_tavily_api_key_here
     PORT=5000
     ```
   - Start the server:
     ```bash
     npm run dev
     ```
   *(Note: If API keys are missing or hit limits, the backend will gracefully return a rich mock data report so you can still test the UI).*

3. **Frontend Setup:**
   ```bash
   cd client
   npm install
   ```
   - Create a `.env` file in the `client` directory (optional for local dev):
     ```env
     VITE_API_URL=http://localhost:5000/api
     ```
   - Start the frontend:
     ```bash
     npm run dev
     ```

4. **Open in Browser:** Navigate to `http://localhost:5173` (or the port Vite provides).

## Deployment Instructions

- **Backend (Render):** 
  Create a new Web Service on Render from your GitHub repo.
  - **Root Directory:** `server`
  - **Build Command:** `npm install`
  - **Start Command:** `npm start` (or `node server.js`)
  - **Environment Variables:** Add `GOOGLE_API_KEY` and `TAVILY_API_KEY`.

- **Frontend (Vercel):** 
  Import the project in Vercel from your GitHub repo.
  - **Root Directory:** `client`
  - **Framework Preset:** Vite
  - **Environment Variables:** Add `VITE_API_URL` and set it to your live Render backend URL (e.g., `https://investiq-6q87.onrender.com/api`).
