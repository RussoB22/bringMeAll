const { connect, connection } = require('mongoose');
require("dotenv").config();

connect(`${process.env.MONGODB}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB database');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

module.exports = connection;