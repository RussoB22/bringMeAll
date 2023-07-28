const jwt = require('jsonwebtoken');
const User = require('../models/User'); // path to your User model

// This middleware updates the user's session_id and session_expires_at in the database
const updateSessionMiddleware = async (req, res, next) => {
    try {
        // assuming the decoded JWT is stored in req.user
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        const userId = decoded.user._id;
        // create a new session id
        const newSessionId = Date.now();

        // calculate the new session expiration time
        const sessionExpiresAt = new Date(new Date().getTime() + parseInt(process.env.JWT_EXPIRES_IN_SMOL) * 60 * 1000);

        // update the user in the database
        await User.updateOne(
            { _id: userId },
            {
                $set: {
                    session_id: newSessionId,
                    session_expires_at: sessionExpiresAt
                }
            }
        );

        next();
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'An error occurred while updating the session.' });
    }
};

module.exports = updateSessionMiddleware;
