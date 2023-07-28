const router = require('express').Router();
const {
    fetchFile,
    deleteFile
} = require('../../controllers/mediaController');

router
    .get("/:id", fetchFile);
router
    .delete("/:id", deleteFile);

module.exports = router;
