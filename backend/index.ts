import express from 'express';
import cors from 'cors';

import ziibotReplyRoute from './api/ziibot-reply';
import aiPostEnhanceRoute from './api/ai-post-enhance';
import commentsRoute from './api/comments';

const app = express(); // ✅ declare first

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ✅ mount routes AFTER declaring app
app.use('/api', ziibotReplyRoute);
app.use('/api', aiPostEnhanceRoute);
app.use('/api', commentsRoute);

app.get('/', (_req, res) => {
  res.send('ZiiOZ Backend is Live');
});

app.listen(PORT, () => {
  console.log('[ZiiBot] OpenAI Key Loaded:', Boolean(process.env.OPENAI_API_KEY));
  console.log(`ZiiOZ backend running on port ${PORT}`);
});
