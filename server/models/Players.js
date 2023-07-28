const { Schema, model, Types } = require('mongoose');
const moment = require('moment');

const playerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    joined: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY hh:mm a')
    },
    score: {
        type: Number,
        default: 0
    },
    currentRoom: [{
        type: Types.ObjectId,
        ref: 'Room'
    }],
    lastRiddle: [{
        type: Types.ObjectId,
        ref: 'Riddles'
    }],
    invitedRooms: [{
        type: Types.ObjectId,
        ref: 'Room'
    }],
    bannedRooms: [{
        type: Types.ObjectId,
        ref: 'Room'
    }]
},
    {
        toJSON: {
            getters: true
        },
        id: false
    },
    { versionKey: false });

const Players = model('Players', playerSchema);

module.exports = Players;
