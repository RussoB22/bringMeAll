const { Schema, model, Types } = require('mongoose');
const moment = require('moment');

const riddleSchema = new Schema({
    riddle: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY hh:mm a')
    },
    //# Easy/timesplayed = difficulty
    easy: {
        type: Number,
        default: 0
    },
    //# players in room * called
    timesplayed: {
        type: Number,
        default: 0
    },
    //# Photo Submitted
    tries: {
        type: Number,
        default: 0
    },
    //# Correct Photo Submit
    correct: {
        type: Number,
        default: 0
    },
},
    {
        toJSON: {
            getters: true
        },
        id: false
    },
    { versionKey: false });

const Riddles = model('Riddles', riddleSchema);

module.exports = Riddles;
