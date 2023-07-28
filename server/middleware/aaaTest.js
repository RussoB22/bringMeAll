const { generateRiddle } = require('./riddleGenerator'); // Replace with the correct path to your module

require('dotenv').config();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const mongoose = require('mongoose');
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB...', err));
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const testGenerateRiddle = async () => {
  try {
    const riddle = await generateRiddle();
    console.log('Generated riddle:', riddle);
  } catch (err) {
    console.error('Failed to generate riddle:', err);
  }
};

testGenerateRiddle();
