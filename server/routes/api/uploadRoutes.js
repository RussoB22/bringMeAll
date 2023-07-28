const upload = require("../../middleware/upload");
const updateSessionMiddleware = require('../../middleware/updateSessionMiddleware');
const gvision = require('../../middleware/gvision');
const jwt = require("jsonwebtoken");
const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Player = require('../../models/Players');
const hostServer = process.env.HOSTSERVER;


router.post("/", updateSessionMiddleware, upload.single("file"), async (req, res, next) => {
  try {
    if (req.file === undefined) return res.send("You must select a file.");
    
    // Verify the token sent with the request
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    const userId = decoded.user._id;

    // Find the user with the id in the decoded token
    const user = await User.findOne({ _id: userId });

    // If user does not exist, return an error
    if (!user) {
      return res.status(401).json({
        message: "Authentication failed"
      });
    }

    // Add the file id to the user's photos
    user.photos.push(req.file.id);
    await user.save();

    // Get the player ID
    // Assuming the first player in the array is the current player
    const playerId = user.players[0];
    
    // Find the player and get the current room ID
    const player = await Player.findById(playerId);
    const roomId = player ? player.currentRoom : undefined;

    // Add roomId and playerId to the request body before calling gvision middleware
    req.body.playerId = playerId;
    req.body.roomId = roomId;

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.toString(),
    });
  }
}, gvision, async (req, res) => {
  try {
    const imgUrl = `${hostServer}/api/media/${req.file.id}`;
    console.log(`Uploaded to:${imgUrl}`);
    
    return res.json({
      message: "Upload successful",
      message: req.result,
      imgUrl: imgUrl
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.toString(),
    });
  }
});


module.exports = router;
