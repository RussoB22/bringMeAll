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
  "bruh", "yeet", "mood", "af", "troll",
  "lol", "rofl", "meme", "ship", "hype",
  "dank", "cursed", "wholesome", "cringe", "thicc"
]


const weirdPersonas = [
  "Yandere",
  "Kuudere",
  "Tsundere",
  "Dandere",
  "Himedere",
  "Deredere",
  "Tsunshun",
  "Kamidere",
  "Yangire",
  "Utsudere",
  "Bodere",
  "Hinedere",
  "Nekodere",
  "Shundere",
  "Sadodere",
  "Mayadere",
  "Coodere",
  "Genki Girl",
  "Chuunibyou",
  "Bishounen",
  "Bishoujo",
  "Moe",
  "Tomboy",
  "Ojou-sama",
  "Megane",
  "Chibi",
  "Dojikko",
  "Kuromimi",
  "Shota",
  "Loli",
  "Otokonoko",
  "Gyaru",
  "Mahou Shoujo",
  "Ninja",
  "Senpai",
  "Kouhai",
  "Sensei",
  "Ijimekko",
  "Tsukkomi and Boke (Manzai duo)"
]

const animeCharacters = [
  "Light Yagami (Death Note)",
  "L (Death Note)",
  "Edward Elric (Fullmetal Alchemist: Brotherhood)",
  "Alphonse Elric (Fullmetal Alchemist: Brotherhood)",
  "Spike Spiegel (Cowboy Bebop)",
  "Goku (Dragon Ball Z)",
  "Vegeta (Dragon Ball Z)",
  "Naruto Uzumaki (Naruto)",
  "Sasuke Uchiha (Naruto)",
  "Luffy (One Piece)",
  "Sanji (One Piece)",
  "Mikasa Ackerman (Attack on Titan)",
  "Eren Yeager (Attack on Titan)",
  "Asuka Langley Soryu (Neon Genesis Evangelion)",
  "Shinji Ikari (Neon Genesis Evangelion)",
  "Vash the Stampede (Trigun)",
  "Rintarou Okabe (Steins;Gate)",
  "Homura Akemi (Madoka Magica)",
  "Ichigo Kurosaki (Bleach)",
  "Levi Ackerman (Attack on Titan)",
  "Monkey D. Luffy (One Piece)",
  "Tony Tony Chopper (One Piece)",
  "Roronoa Zoro (One Piece)",
  "Totoro (My Neighbor Totoro)",
  "Kusuo Saiki (The Disastrous Life of Saiki K.)",
  "Saitama (One Punch Man)",
  "Inuyasha (Inuyasha)",
  "Kagome Higurashi (Inuyasha)",
  "Rukia Kuchiki (Bleach)",
  "Orihime Inoue (Bleach)",
  "Yoruichi Shihoin (Bleach)",
  "Uryū Ishida (Bleach)",
  "Rikka Takanashi (Chuunibyo & Other Delusions)",
  "Yūta Togashi (Chuunibyo & Other Delusions)",
  "Sanae Dekomori (Chuunibyo & Other Delusions)",
  "Gintoki Sakata (Gintama)",
  "Shinpachi Shimura (Gintama)",
  "Kagura (Gintama)",
  "Toshiro Hijikata (Gintama)"
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
  const animeCharacter = animeCharacters[Math.floor(Math.random() * animeCharacters.length)];
  const answer = await getRandomAnswer();
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0613",
      messages: [
        { role: 'system', content: `ChatGPT will pretend to be a ${ageGroup} ${animeCharacter}.` },
        { role: 'user', content: `Tell me riddle where the answer is ${answer}.` },
        { role: 'assistant', content: `ChatGPT will say the riddle in ${memeLanguage} ${weirdPersona} without saying ${answer}` }
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

    let newRiddle = null;
    
    if (Math.random() <= 0.85) {
      const riddlesInDb = await Riddles.find({});
      if (riddlesInDb.length > 0) {
        newRiddle = riddlesInDb[Math.floor(Math.random() * riddlesInDb.length)];
      }
    }

    if (!newRiddle) {
      newRiddle = await generateRiddle();
    }

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