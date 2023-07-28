const router = require('express').Router();
const {
  login,
  logout,
  loginStep2,
  generate2faSecret,
  verifyOtp,
  disable2fa,
} = require('../../controllers/authController');

// const checkSession = require('../../middleware/checkSession');

// Routes for user authentication
router.post('/login', login); // Route for user login
router.post('/logout', logout); // Route for user logout
router.post('/loginStep2', loginStep2); // Route for second step of login with 2FA verification
router.post('/generate2faSecret', generate2faSecret); // Route to generate 2FA secret for a user
router.post('/verifyOtp', verifyOtp); // Route to verify 2FA OTP token
router.put('/disable2fa', disable2fa); // Route to disable 2FA for a user


module.exports = router;
