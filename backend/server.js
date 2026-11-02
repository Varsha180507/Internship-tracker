const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Application = require('./models/Application');
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection failed:', err.message));
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello World v2!');
});
app.post('/applications', async (req, res) => {
  try {
    const saved = await Application.create(req.body);
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.get('/applications', async (req, res) => {
  try {
    const all = await Application.find().sort({ dateApplied: -1 });
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete('/applications/:id', async (req, res) => {
  try {
    const deleted = await Application.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json({ message: 'Deleted', id: req.params.id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.put('/applications/:id', async (req, res) => {
  try {
    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.listen(3000, () => {
  console.log('Server running on port 3000');
});