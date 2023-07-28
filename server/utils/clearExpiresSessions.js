const User = require('../models/User');

const clearExpiredSessions = async () => {
  const now = new Date();
  await User.updateMany(
    { session_expires_at: { $lt: now } },
    { 
      $set: { session_id: null, session_expires_at: null }
    }
  );
};

// Run clearExpiredSessions immediately when the server starts, and then every 1 minute thereafter
clearExpiredSessions();
setInterval(clearExpiredSessions, 60000);

module.exports = {
  clearExpiredSessions
};
