const { Schema, model } = require('mongoose');


const answerSchema = new Schema(
  {
    answers: { 
      type: [String], 
      required: true, 
      default: [] 
    }
  },
  {
    toJSON: {
      getters: true
    },
    id: false
  }
);

const Answers = model('Answers', answerSchema);

module.exports = Answers;
