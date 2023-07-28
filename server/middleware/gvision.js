const vision = require('@google-cloud/vision');
const axios = require('axios');
require("dotenv").config();
const Photos = require('../models/Photos');
const Answers = require('../models/Answers');
const Room = require('../models/Rooms');
const Players = require('../models/Players');
const hostServer = process.env.HOSTSERVER;

// const credentials = {
//   "type": process.env.TYPE,
//   "project_id": process.env.PROJECT_ID,
//   "private_key_id": process.env.PRIVATE_KEY_ID,
//   "private_key": process.env.PRIVATE_KEY,
//   "client_email": process.env.CLIENT_EMAIL,
//   "client_id": process.env.CLIENT_ID,
//   "auth_uri": process.env.AUTH_URI,
//   "token_uri": process.env.TOKEN_URI,
//   "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_X509_CERT_URL,
//   "client_x509_cert_url": process.env.CLIENT_X509_CERT_URL
// };

// const credentials = process.env.CREDENTIALS

const credentials = {
  "TYPE": "service_account",
  "PROJECT_ID": "gvisiontesting-393506",
  "PRIVATE_KEY_ID": "fbc677bfb80600bcef8d9e545fb9c0b6dc62c8f7",
  "PRIVATE_KEY": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC8QBPTPSNMgH42\n3cvfFpkmh/N+a5NOSgohiAU/pA92cG0sdIsH/wIEqj+8dawJr8Ykm6ysjSSLleRU\nt0S+SV8gfYNHWyl3LvQoss0S6B+N+NKaqGU/KuYZLRby2oPFYTQoq5BgmSP2EYPf\nPvitOvWSQVK/HXrpwQwSuz26j/3zDIq2CZcnsCC7ibZ/MpyHz0plkEcUhKQz8RLD\n3UqB7v8Xf2+bb9uJpvSoHLw+X5IsQva6ojiBXa2xxP2fX+PG9sM4ueAUntT2pCJF\n7YwNqDYRINHHo8yQRn6uahC0XsjsTE4+8HoA2G0rUuw6yJrINXYfC1ifuqWBy/Vu\nX9OARtLtAgMBAAECggEAAdMgLhG/ZBgxwP/k4EB0kxRJxq2tw5pBn2IVZPDG6pe7\n4yytBVKSNy/cRswgMwbWZZfxtEl483ZsPGr7WlnVN3gn+9rVG8/jc3qKNNb1qVdi\nWTftJU/Z46AVgxydnt3qlsNU9q69U78HN3SBjhJOe5CxB+O2A4qIvqy8dDC9niu6\nbapaEHyrygmsiYKqvlW6jNLFau4XCc54wt4sOL7KTahQghy2zaxwep1JTnS3PhTW\nkiQLat3TaYwV6LxloFP+9TISklDP4Gd+cm2v01rDpHKBEWfaGHbwhQaGJ8eEw/rA\n9rgw9vvM8LrIHRGkUVpSVUhlfL8fBFFj6lKX5uZH+QKBgQDv+Ktu/fDmccN61mp+\nIoSR76ZcEF9ywZ31Y/idekDV828svSKqjtWoarkvLOW45Wol1jbYug4TKK8HEvhu\nxfbuMc+QBFR6nwI4Uw6Zc6rYqO3Rje3NBa9ONDDgPCtxkCA8i+PpiyPrJBCLrV1Y\nVxth6OvHvIGcpgL5Rqbo7oTX+QKBgQDI0wQygRnj3PtMAcKtQVYM94wgIUIe2ZZJ\nQ7XkkzYMwEaZI1MrYhY/n+n6/LaFCFnP/ndwvXC88Q7tp2HFG7+9+rZrtqwAL8ne\nsjzXyTRGDI97LIuVOcbZcguUFme2Q+JYO81SOlvHogTiLJklOiNfoSApkEOBx8YR\n7n5+KuvXlQKBgEzcahR307QL1h+/E4bpCWswxikQuXGpIC3b4mKWKLQeb4p13eeh\nLj/uRvgcOkwZdwE9dn2+QgnS6xSp99aLI8cxPxkSufg4e96Mg82UpbEVkm6fNf6I\nBplW0BzSSNvr3Ndnuw0vmsaS25XRZmeIJuYaU4K7FwyUg7lR7t4Gn5gJAoGBAL+a\nlSaahlkhPaIHC/bBn5g/lzIQiUVl1D2SnLi4u5ju2mzBh1ic/R03NcaB1qKWlRod\nb1fhZu7eD6AvUtj84LQhwGqEnxaOgcw3wlUfYwBye3LJzWNS/KX6aZGgztLXcd09\nMWiCxY5yxrYEVxltntJeqJD/U2k/cXsqUQWPbfUBAoGBAIYSdz+DVIfZCkSx9vaj\nUyvgVjKSaYq3Gu92U3Y3in35kT8eA4KCUyLYgSLkND2ysrynJ4wJvqdlk0+Y9jvJ\n9iC8MNQ3T0LpYMljShoYwUjDdUssdCR8UycqZpl7bh6E2UcdaIVQxJg1cQ57FO0h\nSeY2wWN5S75BZ2I5h/W1O+Xd\n-----END PRIVATE KEY-----\n",
  "CLIENT_EMAIL": "bring-me-service@gvisiontesting-393506.iam.gserviceaccount.com",
  "CLIENT_ID": "111565035409900884913",
  "AUTH_URI": "https://accounts.google.com/o/oauth2/auth",
  "TOKEN_URI":"https://oauth2.googleapis.com/token",
  "AUTH_PROVIDER_X509_CERT_URL": "https://www.googleapis.com/oauth2/v1/certs",
  "CLIENT_X509_CERT_URL": "https://www.googleapis.com/robot/v1/metadata/x509/bring-me-service%40gvisiontesting-393506.iam.gserviceaccount.com"
  };




// Create a new ImageAnnotatorClient
const client = new vision.ImageAnnotatorClient({ credentials });


// Middleware for Google Cloud Vision
const gvision = async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  try {
    let photo = `${hostServer}/api/media/${req.file.id}`

    // Download the image and convert it to base64
    const response = await axios.get(photo, { responseType: 'arraybuffer' });
    const image = Buffer.from(response.data).toString('base64');
    console.log('This is the host', hostServer);
    console.log('This is the Client', client, 'Client Ends Here');
    const [result] = await client.labelDetection({
      image: {
        content: image,
      }
    });
    console.log('This is the result', result, 'result end here');
    const labels = result.labelAnnotations;
    console.log('This is the Labels', labels, 'Labels end here');
    // Collect labels' descriptions
    const labelsDescription = labels.map(label => label.description);
    console.log('This is the LabelsDesc', labelsDescription, 'Labelsdesc end here');

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
