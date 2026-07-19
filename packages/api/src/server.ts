import app from './app.js';

// server.ts is the ONLY place the server actually starts listening.
// app.ts creates and configures Express — keeping them separate means
// integration tests can import app without starting a real server.

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
