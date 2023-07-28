const { User, Photos } = require('../models');

module.exports = {
  // Get all photos
  async getAllPhotos(req, res) {
    try {
      const photos = await Photos.find();
      res.json(photos);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Get a single photo by ID
  async getPhotoById(req, res) {
    try {
      const photo = await Photos.findOne({ _id: req.params.photoId });

      if (!photo) {
        return res.status(404).json({ message: 'No photo with this ID' });
      }

      res.json(photo);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Create a new photo
  async createPhoto(req, res) {
    try {
      const photo = await Photos.create(req.body);
      await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { photos: photo._id } },
        { new: true }
      );
      res.json(photo);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Update a photo
  async updatePhoto(req, res) {
    try {
      const photo = await Photos.findOneAndUpdate(
        { _id: req.params.photoId },
        req.body,
        { new: true, runValidators: true }
      );

      if (!photo) {
        return res.status(404).json({ message: 'No photo with this ID' });
      }

      res.json(photo);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete a photo
  async deletePhoto(req, res) {
    try {
      const photo = await Photos.findOneAndDelete({ _id: req.params.photoId });

      if (!photo) {
        return res.status(404).json({ message: 'No photo with this ID' });
      }

      // After deleting the photo, also update the user's photos array
      await User.updateOne(
        { photos: req.params.photoId },
        { $pull: { photos: req.params.photoId } }
      );

      res.json({ message: 'Photo deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
