const mongoose = require('mongoose');
const { authenticator } = require('otplib');
const { Schema } = mongoose;
const bcryptjs = require('bcryptjs');

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  gamesPlayed: {
    type: Number,
    default: 0
  },
  totalScore: {
    type: Number,
    default: 0
  },
  currentScore: {
    type: Number,
    default: 0
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Must match an email address!'],
  },
  password: {
    type: String,
    required: true,
    minlength: 5
  },

  players: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Players'
    }
  ],

  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],

  photos: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Photos'
    }
  ],

  twofaEnabled: {
    type: Boolean,
    default: false,
  },
  
  twofaSecret: {
    type: String,
    default: "",
  },

  session_id: {
    type: String,
    default: ""
  },
  session_expires_at: { 
    type: Date, 
    default: null
  },
});

// Set up pre-save middleware to create password and generate 2FA secret key
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    // Hash the password using bcrypt before saving
    const saltRounds = 10;
    this.password = await bcryptjs.hash(this.password, saltRounds);
  }

  if (this.isNew || this.isModified('twofaEnabled')) {
    if (this.twofaEnabled) {
      // Generate and store the 2FA secret key
      this.twofaSecret = authenticator.generateSecret();
    } else {
      // Clear the 2FA secret key
      this.twofaSecret = '';
    }
  }

  next();
});

// compare the incoming password with the hashed password
userSchema.methods.isCorrectPassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
