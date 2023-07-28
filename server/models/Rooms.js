const { Schema, model, Types } = require('mongoose');
const moment = require('moment');


const roomSchema = new Schema({
  roomName: {
    type: String,
    required: true,
    trim: true
  },
  private: {
    type: Boolean,
    required: true,
  },
  solo: {
    type: Boolean,
    default: false,
  },
  currentRiddle: {
    type: String,
    default: '',
  },
  currentAnswer: {
    type: String,
    default: '',
  },
  timeLeft: {
    type: Number,
    default: '',
  },
  roomkey: {
    type: String,
    unique: true
  },
  host: {
    type: Types.ObjectId,
    ref: 'User'
  },
  playerlimit: {
    type: Number,
    default: 999,
    validate: {
      validator: Number.isInteger,
      message: 'Player limit must be an integer.'
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY hh:mm a')
  },
  lastSubmit: {
    type: Date,
    default: Date.now,
    get: (lastSubmitVal) => moment(lastSubmitVal).format('MMM DD, YYYY hh:mm a')
  },
  players: [{
    type: Types.ObjectId,
    ref: 'Players'
  }],
  riddles: [{
    type: Types.ObjectId,
    ref: 'Riddles'
  }],
},
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  },
  { versionKey: false });

roomSchema.virtual('playerCount').get(function () {
  return this.players.length;
});

const Room = model('Room', roomSchema);

module.exports = Room;
