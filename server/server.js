require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const routes = require('./routes');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const PORT = process.env.PORT || 8080;
const app = express();
const db = require('./config/connection');
const { startGlobalRoom } = require('./utils/globalRoomStart');
app.use(cookieParser());
const path = require('path');

// const cors = require('cors')
// app.use(cors({
//   origin: `${process.env.ORIGINSITE}`,
//   credentials: true
// }));

app.use(express.static('build'))

app.use(flash());

// app.use('/google-cloud', googleCloudMiddleware);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({ secret: process.env.JWT_SECRET, resave: false, saveUninitialized: false }));

const setupPassportStrategies = require('./utils/passportSetup');
app.use(passport.initialize());
app.use(passport.session());
setupPassportStrategies(passport);

let gfs, gfsFiles;
let gfsReadyPromise = new Promise(resolve => {
  db.on('open', () => {
    const dbObj = db.db;
    gfs = new mongoose.mongo.GridFSBucket(dbObj, {
      bucketName: "photos"
    });
    gfsFiles = dbObj.collection("photos.files");
    resolve();
  });
});

app.use((req, res, next) => {
  req.gfs = gfs;
  req.gfsFiles = gfsFiles;
  req.gfsReady = gfsReadyPromise;
  next();
});

const { clearExpiredSessions } = require('./utils/clearExpiresSessions');
clearExpiredSessions();

app.use(routes);
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  startGlobalRoom().then(() => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}.`);
    });
  }).catch(err => {
    console.error(`Error while starting the global room: ${err.message}`);
  });
});