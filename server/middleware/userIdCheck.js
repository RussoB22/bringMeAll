const { User } = require('../models');
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    try {
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        const userId = decoded.user._id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove the password field
        const userResponse = user.toObject();
        delete userResponse.password;

        req.user = userResponse;

        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
