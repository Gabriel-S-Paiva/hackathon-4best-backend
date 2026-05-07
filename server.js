import express from 'express';

const app = express();
const port = process.env.PORT ?? 3000;

// Middleware
app.use(express.json());


// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});