const vision = require('@google-cloud/vision');
const axios = require('axios');
require("dotenv").config();
const Photos = require('../models/Photos');
const Answers = require('../models/Answers');
const Room = require('../models/Rooms');
const Players = require('../models/Players');
const hostServer = process.env.HOSTSERVER;

const credentials = {
  "type": process.env.TYPE,
  "project_id": process.env.PROJECT_ID,
  "private_key_id": process.env.PRIVATE_KEY_ID,
  "private_key": process.env.PRIVATE_KEY,
  "client_email": process.env.CLIENT_EMAIL,
  "client_id": process.env.CLIENT_ID,
  "auth_uri": process.env.AUTH_URI,
  "token_uri": process.env.TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_X509_CERT_URL,
  "client_x509_cert_url": process.env.CLIENT_X509_CERT_URL
};

function convertQuotes(credentials) {
  let newCredentials = {};
  for (let key in credentials) {
    if (typeof credentials[key] === 'string') {
      newCredentials[key] = credentials[key].replace(/'/g, '\"');
    } else {
      newCredentials[key] = credentials[key];
    }
  }
  return newCredentials;
}

const newCredentials = convertQuotes(credentials);
console.log('Start:', newCredentials, 'end')

// Create a new ImageAnnotatorClient
const client = new vision.ImageAnnotatorClient({ newCredentials });
console.log('Start2:', newCredentials2, 'end2')


// Middleware for Google Cloud Vision
const gvision = async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  try {
    let photo = `${hostServer}/api/media/${req.file.id}`
    const response = await axios.get(photo, { responseType: 'arraybuffer' });
    const image = Buffer.from(response.data, 'binary').toString('base64');
    // console.log('This is the Client', client, 'Client Ends Here');
    const [result] = await client.labelDetection({
      image: {
        content: image,
      }
    });
    const labels = result.labelAnnotations;
    // Collect labels' descriptions
    const labelsDescription = labels.map(label => label.description);

    // Create new photo document
    const photoDoc = new Photos({
      riddle: req.body.riddle,
      answersfound: labelsDescription.join(', '),
      photodata: req.file.id
    });

    // Save photo document
    await photoDoc.save();

    // Fetch existing answers
    let answersDoc = await Answers.findOne();

    // If no existing answers document, create one
    if (!answersDoc) {
      answersDoc = new Answers({
        answers: labelsDescription
      });
      await answersDoc.save();
    } else {
      // Add only unique answers
      labelsDescription.forEach(label => {
        if (!answersDoc.answers.includes(label)) {
          answersDoc.answers.push(label);
        }
      });
      // Save updated answers
      await answersDoc.save();
    }
    // Check if the user's room has the current answer in the labels
    // Assuming req.body.playerId contains the current player's ID
    const playerId = req.body.playerId;
    const player = await Players.findById(playerId);

    // Assuming req.body.roomId contains the current room's ID
    const roomId = req.body.roomId;
    const room = await Room.findById(roomId);
    let lastRiddleId = room.riddles[room.riddles.length - 1];

    // Check if the player has already submitted to this riddle
    if (player && room && player.lastRiddle.includes(lastRiddleId)) {
      // Return or throw an error
      return res.status(400).json({ error: 'You have already submitted an answer for this riddle.' });
    }
    if (room && labelsDescription.includes(room.currentAnswer)) {
      if (player) {
        player.score += 1;

        // Save the currentRiddle to player.lastRiddle
        player.lastRiddle.push(lastRiddleId);

        await player.save();

        // Save result to req object
        req.result = 'Correct';
      }
    } else {
      // If the answer was not correct, also save this information
      req.result = 'Incorrect';
    }

    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};


module.exports = gvision;
