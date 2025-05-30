import express from 'express';
import cors from 'cors';

import ziibotReplyRoute from './api/ziibot-reply';
import aiPostEnhanceRoute from './api/ai-post-enhance';
import commentsRoute from './api/comments';
app.use('/api', commentsRoute);



const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', ziibotReplyRoute);      // ✅ existing
app.use('/api', aiPostEnhanceRoute);    // ✅ make sure this line is present

app.get('/', (_req, res) => {
  res.send('ZiiOZ Backend is Live');
});

app.listen(PORT, () => {
  console.log('[ZiiBot] OpenAI Key Loaded:', Boolean(process.env.OPENAI_API_KEY));
  console.log(`ZiiOZ backend running on port ${PORT}`);
});
