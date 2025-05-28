import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import OpenAI from 'openai';
import ziibotReply from './api/ziibot-reply';

const app = express();

app.use(cors());
app.use(bodyParser.json());

// ✅ ZiiBot API route
app.use('/api', ziibotReply);

// ✅ Health check for root URL
app.get('/', (req, res) => {
  res.send('ZiiOZ Backend is Live');
});

// ✅ OpenAI config
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Port listener for Render
app.listen(process.env.PORT || 3001, () => {
  console.log(`ZiiOZ backend running on port ${process.env.PORT || 3001}`);
});
