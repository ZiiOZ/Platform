import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Configuration, OpenAIApi } from 'openai';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

// Tag generation endpoint
app.post('/generate-tags', async (req, res) => {
  const { input } = req.body;

  if (!input) return res.status(400).json({ error: 'Missing input' });

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that generates short, relevant video tags.',
        },
        {
          role: 'user',
          content: `Generate 5 short, comma-separated tags for this video title: "${input}". Only return tags.`,
        },
      ],
      temperature: 0.7,
    });

    const rawTags = response.data.choices[0].message?.content || '';
    const tags = rawTags
      .split(',')
      .map(tag => tag.trim().replace(/^#/, ''))
      .filter(tag => tag.length > 0);

    res.json({ tags });
  } catch (error) {
    console.error('AI tag generation error:', error);
    res.status(500).json({ error: 'Failed to generate tags' });
  }
});

app.get('/', (req, res) => {
  res.send('ZiiOZ Backend API is live 🚀');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`ZiiOZ backend running on ${PORT}`);
});
