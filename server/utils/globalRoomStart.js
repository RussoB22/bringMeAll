const { createRoom } = require('../controllers/roomsController');
const Rooms = require('../models/Rooms');
const { getRiddleForRoom } = require('../middleware/riddleGenerator');
require('dotenv').config();
const startRoomTimer = require('../controllers/startRoomTimer')

const startGlobalRoom = async () => {
  try {
    // Find an existing room with name 'Global' and delete it
    let globalRoom = await Rooms.findOne({ roomName: 'Global' });
    if (globalRoom) {
      await Rooms.deleteOne({ _id: globalRoom._id });
    }

    // Create a new 'Global' room
    const newGlobalRoom = {
      roomName: 'Global',
      private: false,
      solo: false,
    };

    // Manually create req and res objects
    const req = { body: newGlobalRoom, params: {} };
    let createdRoom = null;
    const res = {
      json: (data) => {
        createdRoom = data;
      },
      status: function (statusCode) {
        return {
          json: (data) => {
            if (statusCode >= 400) console.error('Global room creation failed: ', data);
          },
        };
      }
    };

    // Now we can use req and res with createRoom and getRiddleForRoom
    await createRoom(req, res);
    if (createdRoom && createdRoom._id) {
      req.params.roomId = createdRoom._id;
      startRoomTimer(createdRoom._id);
      setInterval(async () => {
        await getRiddleForRoom(req, res, () => { });
      }, 60 * 1000);
    } else {
      console.error('Failed to create room');
    }
  } catch (err) {
    console.error(err);
  }

};

module.exports = { startGlobalRoom };