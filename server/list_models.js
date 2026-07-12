import dotenv from "dotenv";
dotenv.config();

async function listModels() {
  try {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + process.env.GOOGLE_API_KEY);
    const data = await res.json();
    if (data.models) {
      console.log("AVAILABLE MODELS:");
      console.log(data.models.map(m => m.name).join("\n"));
    } else {
      console.log("Error or no models found:", data);
    }
  } catch (err) {
    console.error("Failed to fetch models:", err);
  }
}

listModels();
