import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import OpenAI from 'openai';
import ziibotReply from './api/ziibot-reply';

const app = express();

app.use(cors());
app.use(bodyParser.json());

// ✅ Now safe to mount
app.use('/api', ziibotReply);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ... any other config
app.listen(process.env.PORT || 3001, () => {
  console.log(`ZiiOZ backend running on port ${process.env.PORT || 3001}`);
});
