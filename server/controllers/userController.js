const { User } = require('../models');
const jwt = require('jsonwebtoken');


module.exports = {
  // Get all users
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Get a single user
  async getSingleUser(req, res) {
    try {
      const token = req.cookies.token;
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.user._id;
      const user = await User.findOne({ _id: userId})
        .select(
          '-password'
        );

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Update a user by ID
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate({ _id: req.params.userId }, req.body, { new: true, runValidators: true })
        .select('-__v');

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete a user and associated Thought
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      await Application.deleteMany({ _id: { $in: user.thoughts } });
      res.json({ message: 'User and Thoughts deleted!' })
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Add a friend to a user's friend list
  async addFriend(req, res) {
    try {
      const user = await User.findById(req.params.userId);
      const friend = await User.findById(req.params.friendId);

      if (!user || !friend) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      await User.updateOne(
        { _id: req.params.userId },
        { $addToSet: { friends: friend._id } },
        { new: true, runValidators: true }
      );

      await User.updateOne(
        { _id: req.params.friendId },
        { $addToSet: { friends: user._id } },
        { new: true, runValidators: true }
      );

      res.json({ message: `Users ${user.username} and ${friend.username} are now friends` });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Remove a friend from a user's friend list
  async removeFriend(req, res) {
    try {
      const user = await User.findById(req.params.userId);
      const friend = await User.findById(req.params.friendId);

      if (!user || !friend) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      await User.updateOne(
        { _id: req.params.userId },
        { $pull: { friends: friend._id } },
        { new: true, runValidators: true }
      );

      await User.updateOne(
        { _id: req.params.friendId },
        { $pull: { friends: user._id } },
        { new: true, runValidators: true }
      );

      res.json({ message: `Users ${user.username} and ${friend.username} are no longer friends` });
    } catch (err) {
      res.status(500).json(err);
    }
  }
};