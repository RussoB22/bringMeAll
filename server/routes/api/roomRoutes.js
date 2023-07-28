const router = require('express').Router();
const {
  getRooms,
  getSingleRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  invitePlayer,
  banPlayer,
  joinRoom,
  leaveRoom,
} = require('../../controllers/roomsController');

// /api/rooms
router
  .route('/')
  .get(getRooms)
  .post(createRoom);

// /api/rooms/:roomId
router
  .route('/:roomId')
  .get(getSingleRoom)
  .put(updateRoom)
  .delete(deleteRoom);

// /api/rooms/:roomId/invite/:playerId
router
  .route('/:roomId/invite/:playerId')
  .post(invitePlayer);

// /api/rooms/:roomId/ban/:playerId
router
  .route('/:roomId/ban/:playerId')
  .post(banPlayer);

router
  .route('/join-room/:roomId')
  .post(joinRoom);

  router
  .route('/leave-room/:roomId')
  .post(leaveRoom);

module.exports = router;
