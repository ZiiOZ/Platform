import express from 'express';
import cors from 'cors';
import ziibotRouter from './api/ziibot-reply'; // ✅ import the router

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ✅ Prefix the route correctly
app.use('/api', ziibotRouter);

app.get('/', (req, res) => {
  res.send('ZiiOZ Backend is Live');
});

app.listen(PORT, () => {
  console.log(`ZiiOZ backend running on port ${PORT}`);
});
