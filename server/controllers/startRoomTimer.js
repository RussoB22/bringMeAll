const cron = require('node-cron');
const Rooms = require('../models/Rooms');

const updateRoomTimeLeft = async (roomId, timeLeft) => {
    return await Rooms.updateOne({ _id: roomId }, { $set: { timeLeft: timeLeft } });
  };

const startRoomTimer = async (roomId) => {
  let timeLeft = 60;

  const task = cron.schedule('* * * * * *', async () => {
    // This will run every second
    timeLeft--;
    
    // Update the database with the new timeLeft
    try {
      await updateRoomTimeLeft(roomId, timeLeft);
    } catch (error) {
      console.error(`Error updating timeLeft for room ${roomId}:`, error);
    }

    // If timeLeft reached 0, reset to 60
    if (timeLeft === 0) {
      timeLeft = 60;
    }
  });

  task.start();
};

module.exports = startRoomTimer;