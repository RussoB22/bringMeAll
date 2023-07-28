const { Schema, model, Types } = require('mongoose');
const moment = require('moment');

const photoSchema = new Schema(
  {
    riddle: {
      type: Types.ObjectId,
      ref: 'Riddles'
    },
    answersfound: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY hh:mm a')
    },
    photodata: [
      {
        type: Schema.Types.ObjectId,
        ref: 'photos.files'
      }
    ]
  },
  {
    toJSON: {
      getters: true
    },
    id: false
  }
);

const Photos = model('Photos', photoSchema);

module.exports = Photos;
