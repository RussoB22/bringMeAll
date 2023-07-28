const router = require('express').Router();

const {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer
} = require('../../controllers/playerController');

// /api/players
router
  .route('/')
  .get(getAllPlayers)
  .post(createPlayer);

// /api/players/:playerId
router
  .route('/:playerId')
  .get(getPlayerById)
  .put(updatePlayer)
  .delete(deletePlayer);

module.exports = router;
