import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 🧪 Health Check
app.get("/", (_req, res) => {
  res.send("ZiiOZ Backend API is live 🎉");
});

// 🤖 AI-Generated Reply (Placeholder for OpenAI integration)
app.post("/ai-reply", (req, res) => {
  const { text } = req.body;
  // TODO: Integrate OpenAI or Anthropic response here
  res.json({ message: `AI reply to: "${text}" (coming soon)` });
});

// 🚀 Boost Comment
app.post("/boost-comment", (req, res) => {
  const { commentId } = req.body;
  // TODO: Connect to Supabase or internal system
  res.json({ message: `Comment ${commentId} boosted successfully.` });
});

// 💾 Save Post
app.post("/save-post", (req, res) => {
  const { content, userId } = req.body;
  // TODO: Save to Supabase or database
  res.json({ message: "Post saved successfully.", content, userId });
});

// Start server
app.listen(port, () => {
  console.log(`✅ ZiiOZ Backend running on port ${port}`);
});
