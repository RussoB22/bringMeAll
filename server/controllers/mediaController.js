const { Types: { ObjectId } } = require('mongoose');
const User = require('../models/User');

module.exports = {
  // Fetch a file
  async fetchFile(req, res) {
    const { gfs } = req;
    try {
      if (!gfs) {
        return res.status(500).send("GridFSBucket is not available");
      }

      const file = await gfs.find({ _id: new ObjectId(req.params.id) }).toArray();
      if (!file || file.length === 0) {
        return res.status(404).send("File not found");
      }

      const readStream = gfs.openDownloadStream(file[0]._id);
      readStream.pipe(res);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },

  // Delete a file
  async deleteFile(req, res) {
    const { gfs } = req;
    try {
      if (!gfs) {
        return res.status(500).send("GridFSBucket is not available");
      }

      const file = await gfs.find({ _id: new ObjectId(req.params.id) }).toArray();
      if (!file || file.length === 0) {
        return res.status(404).send("File not found");
      }

      // Remove the file id from the user's photos
      await User.findOneAndUpdate(
        { photos: new ObjectId(req.params.id) },
        { $pull: { photos: new ObjectId(req.params.id) } },
        { new: true, useFindAndModify: false }
      );

      await gfs.delete(new ObjectId(file[0]._id));
      res.send("Success");
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
}
