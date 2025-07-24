// metrics-server.js
const express = require('express');
const client = require('prom-client');

const app = express();
const register = new client.Registry();

// Enable default metrics (CPU, memory, etc.)
client.collectDefaultMetrics({ register });

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

const PORT = 9100;
app.listen(PORT, () => {
  console.log(`📊 Metrics server running at http://localhost:${PORT}/metrics`);
});
