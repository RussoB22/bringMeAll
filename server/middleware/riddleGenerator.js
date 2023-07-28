require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");
const Answers = require('../models/Answers');
const Riddles = require('../models/Riddles');
const Rooms = require('../models/Rooms');

const ageGroups = [
  "infant", "toddler", "child", "pre-teen", "teenager",
  "young adult", "adult", "middle-aged adult", "senior", "elderly"
];

const memeLanguages = [
  "uwu", "doggo", "doge", "nyan", "owo",
  "pog", "kek", "lul", "smol", "boop",
  "nom", "fleek", "teh", "pwned", "bae",
  "lit", "fam", "savage", "stan", "squad",
  "swag", "yolo", "noob", "gg", "ree",
  "bruh", "yeet", "mood", "af", "troll"
]

const weirdPersonas = [
  "obsessive significant other",
  "alien disguised as human",
  "time-traveling historian",
  "overly enthusiastic life coach",
  "paranoid conspiracy theorist",
  "amateur ghost hunter",
  "self-proclaimed vampire",
  "larping medieval knight",
  "obsessed celebrity fan",
  "delusional self-help guru",
  "wannabe superhero",
  "unemployed philosophy major",
  "overzealous PTA mom",
  "internet troll",
  "recluse billionaire",
  "compulsive liar",
  "obsessive doll collector",
  "struggling artist",
  "stressed out yoga teacher",
  "overly competitive gamer",
  "narcissistic social media influencer",
  "aspiring martian colonist",
  "convinced they're a werewolf",
  "reality show has-been",
  "eccentric pet whisperer",
  "retired superhero",
  "grumpy lighthouse keeper",
  "overconfident amateur chef",
  "mysterious treasure hunter",
  "washed-up child star",
  "secret double agent",
  "zombie apocalypse prepper",
  "novice witch",
  "overachieving scoutmaster",
  "disgruntled office worker",
  "frustrated mime",
  "pessimistic weather forecaster",
  "overworked elf",
  "self-absorbed rock star",
  "alien conspiracy theorist",
  "nervous stand-up comedian",
  "ambitious yet clueless inventor",
  "reckless test pilot",
  "clumsy acrobat",
  "overzealous fortune teller",
  "anxious astronaut",
  "daydreaming librarian",
  "overbearing food critic",
  "hopeless romantic",
  "underappreciated superhero sidekick",
  "extreme sports junkie",
  "adventurous archaeologist",
  "rookie pirate",
  "awkward ventriloquist",
  "perpetually lost explorer",
  "talking animal",
  "chronically bored immortal"
]



const getRandomAnswer = async () => {
  const randomAnswerDoc = await Answers.aggregate([{ $sample: { size: 1 } }]);
  if (randomAnswerDoc.length > 0) {
    const randomAnswer = randomAnswerDoc[0].answers[Math.floor(Math.random() * randomAnswerDoc[0].answers.length)];
    return randomAnswer;
  } else {
    console.log('No answers found in the database.');
    return null;
  }
};

const generateRiddle = async () => {
  const configuration = new Configuration({
    apiKey: process.env.CHATGPT_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const memeLanguage = memeLanguages[Math.floor(Math.random() * memeLanguages.length)];
  const ageGroup = ageGroups[Math.floor(Math.random() * ageGroups.length)];
  const weirdPersona = weirdPersonas[Math.floor(Math.random() * weirdPersonas.length)];
  const answer = await getRandomAnswer();
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0613",
      messages: [
        { role: 'system', content: `ChatGPT will pretend to be a ${ageGroup} ${weirdPersona}.` },
        { role: 'user', content: `Tell me riddle where the answer is ${answer}.` },
        { role: 'assistant', content: `ChatGPT will speak in ${memeLanguage} and respond with a riddle without saying ${answer}` }
      ]
    })
    ;

    const riddleText = completion.data.choices[0].message.content;
    const newRiddle = new Riddles({ riddle: riddleText, answer: answer });
    await newRiddle.save();

    console.log('New riddle saved to the database.');
    return newRiddle;
  } catch (error) {
    console.error('An error occurred: ', error);
    return null;
  }
};

const getRiddleForRoom = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const room = await Rooms.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: 'No room with that ID' });
    }

    const newRiddle = await generateRiddle();

    if (newRiddle) {
      room.currentRiddle = newRiddle.riddle;
      room.currentAnswer = newRiddle.answer;
      room.riddles.push(newRiddle._id);
      await room.save();
      res.json(newRiddle);
      console.log(newRiddle);
    } else {
      res.status(500).json({ message: 'Failed to generate new riddle.' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = { getRiddleForRoom };