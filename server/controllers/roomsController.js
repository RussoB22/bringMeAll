const { Rooms } = require('../models');
const { Players } = require('../models');
const { User } = require('../models');
const jwt = require('jsonwebtoken');


module.exports = {
  async getRooms(req, res) {
    try {
      const rooms = await Rooms.find();
      res.json(rooms);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async getSingleRoom(req, res) {
    try {
      const room = await Rooms.findById(req.params.roomId);
      if (!room) {
        return res.status(404).json({ message: 'No room with that ID' });
      }
      res.json(room);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  async createRoom(req, res) {
    try {
      const room = await Rooms.create(req.body);
      res.json(room);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async updateRoom(req, res) {
    try {
      const room = await Rooms.findOneAndUpdate({ _id: req.params.roomId }, req.body, { new: true, runValidators: true })
        .select('-__v');

      if (!room) {
        return res.status(404).json({ message: 'No room with that ID' });
      }

      res.json(room);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async deleteRoom(req, res) {
    try {
      const room = await Rooms.findOneAndDelete({ _id: req.params.roomId });

      if (!room) {
        return res.status(404).json({ message: 'No room with that ID' });
      }

      res.json({ message: 'Room deleted!' })
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async invitePlayer(req, res) {
    try {
      const room = await Rooms.findById(req.params.roomId);

      if (!room) {
        return res.status(404).json({ message: 'No room with that ID' });
      }

      await Players.updateOne(
        { _id: req.params.playerId },
        { $addToSet: { invitedRooms: room._id } },
        { new: true, runValidators: true }
      );

      res.json({ message: `Player invited to the room` });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async banPlayer(req, res) {
    try {
      const room = await Rooms.findById(req.params.roomId);

      if (!room) {
        return res.status(404).json({ message: 'No room with that ID' });
      }

      const player = await Players.findById(req.params.playerId);
      if (!player) {
        return res.status(404).json({ message: 'No player with that ID' });
      }

      // Ban the player from the room
      await Players.updateOne(
        { _id: req.params.playerId },
        {
          $addToSet: { bannedRooms: room._id },
          $set: { currentRoom: null }
        },
        { new: true, runValidators: true }
      );

      // Remove the player from the room's players array
      room.players.pull(player._id);
      await room.save();

      res.json({ message: `Player banned from the room` });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async joinRoom(req, res) {
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const username = decodedToken.user.username;
    const userId = decodedToken.user._id;
    const roomId = req.params.roomId;
  
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
  
    // Find the room
    const room = await Rooms.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
  
    // Find the current player of the user
    const player = await Players.findOne({ _id: { $in: user.players } });
  
    // Check if the player is banned
    if (player && player.bannedRooms.includes(roomId)) {
      return res.status(403).json({ error: "Player is banned from the room" });
    }
  
    if (player) {
      // If the player is already in the room, just return a message
      if (player.currentRoom && player.currentRoom.toString() === roomId) {
        return res.status(200).json({ message: "Already in the room" });
      }
  
      // Remove the player from the user's players array
      user.players.pull(player._id);
      await user.save();
  
      // Delete the player
      await Players.findByIdAndDelete(player._id);
    }
  
    // Create a new player for the user in the room
    const newPlayer = new Players({
      name: username,
      user: userId,
      currentRoom: roomId,
    });
  
    await newPlayer.save();
  
    // Add the new player to the user's players array
    user.players.push(newPlayer._id);
    await user.save();
  
    // Add the new player to the room
    room.players.push(newPlayer._id);
    await room.save();
  
    res.status(200).json({ message: "Successfully joined the room", player: newPlayer });
  },

  async leaveRoom(req, res) {
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.user._id;
    const roomId = req.params.roomId;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Find the room
    const room = await Rooms.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Find the player of the user
    const player = await Players.findOne({ _id: { $in: user.players } });
    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }

    // Remove the player from the room's players array
    room.players.pull(player._id);
    await room.save();

    // Update the user's score and games played
    user.totalScore += player.score;
    user.currentScore += player.score;
    user.gamesPlayed++;
    await user.save();

    // Remove the player from the user's players array
    user.players.pull(player._id);
    await user.save();

    // Delete the player
    await Players.findByIdAndDelete(player._id);

    res.status(200).json({ message: "Successfully left the room" });
  },

  
};
