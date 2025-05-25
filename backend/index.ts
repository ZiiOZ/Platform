import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('✅ Backend is alive!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`ZiiOZ Backend running on ${PORT}`);
});
