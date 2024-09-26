// backend/index.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { Configuration, OpenAIApi } = require('openai');
const OpenAI  = require('openai');
const Mood = require('./models/Mood.js'); 


dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Sync database
Mood.sync()
  .then(() => console.log('Mood table created successfully'))
  .catch(err => console.error('Error creating Mood table:', err));



// backend/index.js (continued)

app.post('/api/mood', async (req, res) => {
  const { userId, mood } = req.body;

  try {
    const newMood = await Mood.create({ userId, mood });
    res.json({ message: 'Mood tracked successfully!', mood: newMood });
  } catch (error) {
    console.error('Error saving mood:', error);
    res.status(500).json({ error: 'Failed to save mood' });
  }
});


// backend/index.js (continued)

app.get('/api/mood/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const moods = await Mood.findAll({ where: { userId } });
    res.json({ moods });
  } catch (error) {
    console.error('Error fetching moods:', error);
    res.status(500).json({ error: 'Failed to fetch mood data' });
  }
});


// Initialize OpenAI API
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

// Route to handle chat messages
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      prompt: `You are a virtual therapist. Respond empathetically to the following: ${message}`,
      temperature: 0.7,
      max_tokens: 150,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });

    res.json({ reply: response.choices[0].text.trim() });
  } catch (error) {
    console.error("Error communicating with OpenAI:", error);
    res.status(500).json({ error: 'Failed to communicate with the AI' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
