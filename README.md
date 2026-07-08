# InvestIQ – AI Investment Research Agent

An AI-powered investment research platform that automatically gathers financial data, company information, and latest news, then leverages LangChain and Gemini AI to generate a comprehensive investment report (SWOT analysis, risk assessment, and Buy/Hold/Pass recommendations).

## Features
- **Company Search:** Instantly analyze any public company.
- **Dynamic Loading Screen:** View the AI reasoning steps in real-time.
- **Premium Results Dashboard:** Beautiful dark-mode interface utilizing glassmorphism and Tailwind CSS.
- **Comprehensive Analysis:** Financial data, News sentiment, SWOT analysis, and Risk assessment.
- **Export to PDF:** Download the final report as a PDF document.

## Technology Stack
- **Frontend:** React.js, Tailwind CSS, Vite, Axios, html2canvas, jsPDF.
- **Backend:** Node.js, Express.js.
- **AI/LLM:** LangChain.js, Google Gemini Pro.
- **External APIs:** Yahoo Finance (`yahoo-finance2`), Tavily Search API.

## System Architecture
The user enters a company name in the React frontend, which sends a POST request to the Express backend. The backend triggers a LangChain workflow:
1. **Parallel Data Gathering:** Fetch financials via Yahoo Finance, and company info + news via Tavily.
2. **AI Processing:** Send the structured context to Gemini 1.5 Pro using LangChain prompts.
3. **Structured Output:** Gemini returns a strictly formatted JSON report.
4. **Display:** The React dashboard renders the report with dynamic gauges, badges, and export options.

## Installation Steps

1. **Clone the repository (or navigate to the directory).**

2. **Backend Setup:**
   \`\`\`bash
   cd server
   npm install
   \`\`\`
   - Create a `.env` file in the `server` directory.
   - Add your API keys:
     \`\`\`env
     GOOGLE_API_KEY=your_gemini_api_key_here
     TAVILY_API_KEY=your_tavily_api_key_here
     PORT=5000
     \`\`\`
   - Start the server:
     \`\`\`bash
     npm run dev
     \`\`\`
   *(Note: If API keys are missing, the backend will return a rich mock data report so you can still test the UI).*

3. **Frontend Setup:**
   \`\`\`bash
   cd client
   npm install
   npm run dev
   \`\`\`

4. **Open in Browser:** Navigate to `http://localhost:3000`.

## Trade-offs & Future Improvements
- **Trade-offs:** We omitted a database to keep the architecture stateless and simple, which means every search costs API credits and takes a few seconds. We also opted to bundle the UI in a single page structure using state instead of React Router to provide a linear, App-like flow.
- **Future Improvements:** 
  - Add Redis caching to save identical company reports for 24 hours.
  - Integrate user authentication (Clerk/Firebase) and MongoDB to save user history.
  - Compare two companies side-by-side.

## Deployment Instructions
- **Backend (Render):** Push the `server` folder to GitHub. Create a new Web Service on Render, set the Root Directory to `server`, build command to `npm install`, and start command to `npm start`. Add your Environment Variables.
- **Frontend (Vercel):** Push the `client` folder to GitHub. Import the project in Vercel, set the Root Directory to `client`, Framework Preset to Vite, and update the `API_URL` in `src/services/api.js` to point to your live Render backend URL before deploying.
