const router = require('express').Router();
const playerRoutes = require('./playerRoutes');
const userRoutes = require('./userRoutes');
const uploadRoutes = require('./uploadRoutes');
const mediaRoutes = require('./mediaRoutes');
const authRoutes = require('./authRoutes');
const roomRoutes = require('./roomRoutes')


router.use('/players', playerRoutes);
router.use('/users', userRoutes);
router.use('/upload', uploadRoutes);
router.use('/media', mediaRoutes);
router.use('/auth', authRoutes);
router.use('/rooms', roomRoutes);

module.exports = router;
