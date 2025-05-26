import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import OpenAI from 'openai';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/generate-tags', async (req, res) => {
  const { input } = req.body;
  if (!input) return res.status(400).json({ error: 'Missing input' });

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'Generate 5 short, relevant, comma-separated tags for videos.' },
        { role: 'user', content: `Title: ${input}` },
      ],
      temperature: 0.7,
    });

    const raw = response.choices[0].message?.content ?? '';
    const tags = raw.split(',').map(tag => tag.trim().replace(/^#/, '')).filter(Boolean);
    res.json({ tags });
  } catch (err) {
    console.error('Tag generation error:', err);
    res.status(500).json({ error: 'Failed to generate tags' });
  }
});

app.get('/', (_, res) => {
  res.send('ZiiOZ Backend API is live 🚀');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`ZiiOZ backend running on port ${PORT}`);
});
