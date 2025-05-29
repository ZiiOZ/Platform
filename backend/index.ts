import express from 'express';
import cors from 'cors';
import ziibotReplyRoute from './api/ziibot-reply';
import aiPostEnhanceRoute from './api/ai-post-enhance'; // ✅ import here

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ✅ Mount all API routes under /api
app.use('/api', ziibotReplyRoute);
app.use('/api', aiPostEnhanceRoute);

app.get('/', (_req, res) => {
  res.send('ZiiOZ Backend is Live');
});

app.listen(PORT, () => {
  console.log('[ZiiBot] OpenAI Key Loaded:', Boolean(process.env.OPENAI_API_KEY));
  console.log(`ZiiOZ backend running on port ${PORT}`);
});
