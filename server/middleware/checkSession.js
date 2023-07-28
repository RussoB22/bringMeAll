const jwt = require('jsonwebtoken');
const User = require('../models/User');


const checkSession = async (req, res, next) => {
    try {
      // Extract the token from the headers
      const authHeader = req.headers.authorization;
      console.log(authHeader);
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Invalid session. Please log in again.' });
      }
      
      const token = authHeader.split(' ')[1];
  
      // Decode the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Fetch the user from the database
      const user = await User.findById(decoded.user._id);
  
      // Check that the session_id in the token matches the session_id in the database
      if (user.session_id !== decoded.user.session_id) {
        // If they don't match, reject the request
        return res.status(401).json({ message: 'Invalid session. Please log in again.' });
      }
  
      // If they do match, allow the request to proceed
      next();
  
    } catch (err) {
      return res.status(500).json({ message: 'Server Error' });
    }
  };
  

module.exports = checkSession;