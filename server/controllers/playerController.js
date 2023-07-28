const { User, Players } = require('../models');

module.exports = {
  // Get all players
  async getAllPlayers(req, res) {
    try {
      const players = await Players.find();
      res.json(players);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Get a single player by ID
  async getPlayerById(req, res) {
    try {
      const player = await Players.findOne({ _id: req.params.playerId });

      if (!player) {
        return res.status(404).json({ message: 'No player with this ID' });
      }

      res.json(player);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Create a new player
  async createPlayer(req, res) {
    try {
      const userId = req.body.userId;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (user.players.length > 0) {
        return res.status(400).json({ message: 'User already has a player' });
      }
  
      const player = await Players.create(req.body);
      user.players.push(player._id);
      await user.save();
  
      res.json(player);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  

  // Update a player
  async updatePlayer(req, res) {
    try {
      const player = await Players.findOneAndUpdate(
        { _id: req.params.playerId },
        req.body,
        { new: true, runValidators: true }
      );

      if (!player) {
        return res.status(404).json({ message: 'No player with this ID' });
      }

      res.json(player);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete a player
  async deletePlayer(req, res) {
    try {
      const player = await Players.findOneAndDelete({ _id: req.params.playerId });

      if (!player) {
        return res.status(404).json({ message: 'No player with this ID' });
      }

      // After deleting the player, also update the user's players array
      await User.updateOne(
        { players: req.params.playerId },
        { $pull: { players: req.params.playerId } }
      );

      res.json({ message: 'Player deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
