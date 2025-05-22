import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Sample route
app.get("/", (_req, res) => {
  res.send("ZiiOZ Backend API is live 🎉");
});

app.listen(port, () => {
  console.log(`✅ ZiiOZ Backend running on port ${port}`);
});
