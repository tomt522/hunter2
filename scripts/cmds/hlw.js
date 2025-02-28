const axios = require("axios");

const makeBold = (text) => {
  const boldAlphabet = {
    a: '𝗮', b: '𝗯', c: '𝗰', d: '𝗱', e: '𝗲', f: '𝗳', g: '𝗴', 
    h: '𝗵', i: '𝗶', j: '𝗷', k: '𝗸', l: '𝗹', m: '𝗺', n: '𝗻', 
    o: '𝗼', p: '𝗽', q: '𝗾', r: '𝗿', s: '𝘀', t: '𝘁', u: '𝘂', 
    v: '𝘃', w: '𝘄', x: '𝘅', y: '𝘆', z: '𝘇',
    A: '𝗔', B: '𝗕', C: '𝗖', D: '𝗗', E: '𝗘', F: '𝗙', G: '𝗚', 
    H: '𝗛', I: '𝗜', J: '𝗝', K: '𝗞', L: '𝗟', M: '𝗠', N: '𝗡', 
    O: '𝗢', P: '𝗣', Q: '𝗤', R: '𝗥', S: '𝗦', T: '𝗧', U: '𝗨', 
    V: '𝗩', W: '𝗪', X: '𝗫', Y: '𝗬', Z: '𝗭', 
    0: '𝟬', 1: '𝟭', 2: '𝟮', 3: '𝟯', 4: '𝟰', 5: '𝟱', 6: '𝟲', 
    7: '𝟳', 8: '𝟴', 9: '𝟵'
  };

  return text.split('').map(char => boldAlphabet[char] || char).join('');
};

const getAPIBase = async () => {
  const { data } = await axios.get(
    "https://raw.githubusercontent.com/nazrul4x/Noobs/main/Apis.json"
  );
  return data.bs;
};

const sendMessage = (api, threadID, message, messageID) => 
  api.sendMessage(message, threadID, messageID);

const cError = (api, threadID, messageID) => 
  sendMessage(api, threadID, "error🦆💨", messageID);

const teachBot = async (api, threadID, messageID, senderID, teachText) => {
  const [ask, answers] = teachText.split(" - ").map((text) => text.trim());
  if (!ask || !answers) {
    return sendMessage(
      api,
      threadID,
      "Invalid format. Use: {pn} teach <ask> - <answer1, answer2, ...>",
      messageID
    );
  }

  const answerArray = answers
    .replace(/["]+/g, '')
    .split(",")
    .map((ans) => ans.trim())
    .filter((ans) => ans !== "");

  try {
    const res = await axios.get(
      `${await getAPIBase()}/bby/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(answerArray.join(","))}&uid=${senderID}`
    );
    const responseMsg =
      res.data?.message === "Teaching recorded successfully!"
        ? `Successfully taught the bot!\n📖 Teaching Details:\n- Question: ${res.data.ask}\n- Answers: ${answerArray.join(", ")}\n- Your Total Teachings: ${res.data.userStats.user.totalTeachings}`
        : res.data?.message || "Teaching failed.";
    return sendMessage(api, threadID, responseMsg, messageID);
  } catch {
    return cError(api, threadID, messageID);
  }
};

const talkWithBot = async (api, threadID, messageID, senderID, input) => {
  try {
    const res = await axios.get(
      `${await getAPIBase()}/bby?text=${encodeURIComponent(input)}&uid=${senderID}`
    );
    const reply = makeBold(res.data?.text || "Please teach me.\nExample: /sim teach <ask> - <answer>");
    const react = res.data.react;
    return api.sendMessage(reply+react, threadID, (error, info) => {
      if (error) return cError(api, threadID, messageID);
      global.GoatBot.onReply.set(info.messageID, {
        commandName: module.exports.config.name,
        type: "reply",
        messageID: info.messageID,
        author: senderID,
        msg: reply,
      });
    }, messageID);
  } catch {
    return cError(api, threadID, messageID);
  }
};

module.exports.config = {
  name: "bbu",
  aliases: ["bbz", "hey"],
  version: "1.6.9",
  author: "Nazrul",
  role: 0,
  description: "Talk with the bot or teach it new responses",
  category: "talk",
  countDown: 3,
  guide: {
    en: `{pn} <text> - Ask the bot something\n{pn} teach <ask> - <answer> - Teach the bot a new response\n\nExamples:\n1. {pn} Hello\n2. {pn} teach hi - hello`,
  },
};

module.exports.onStart = async ({ api, event, args }) => {
  const { threadID, messageID, senderID } = event;
  if (args.length === 0) {
    return sendMessage(api, threadID, "Please provide text or teach the bot!", messageID);
  }

  const input = args.join(" ").trim();
  const [command, ...rest] = input.split(" ");

  if (command.toLowerCase() === "teach") {
    return teachBot(api, threadID, messageID, senderID, rest.join(" ").trim());
  }
  return talkWithBot(api, threadID, messageID, senderID, input);
};

module.exports.onChat = async ({ api, event, usersData }) => {
  const { threadID, messageID, body, senderID } = event;
  const hasan = await usersData.getName(event.senderID);
  const baigan = `✨${hasan}🫰`;

  const cMessages = [
    "কি হয়ছে বেবি দাকস কেন 🙌🙂", 
    "হুম বল🐸", "Ami ekhane bby 🥹", 
    "Amake vhule jaw 😏", 
    "🐣🎀", 
    "ki hoiche ki koibi ?🐽", 
    "kireh dakos kn?😤💋", 
    "Ami sudhu saif er bbu🐱✌🏻", 
    "ummmmmmmaaaaaaah 😭💋", 
    "i love you🥺", 
    "i'm hare bby😗", 
    "kisse?😒🔪", 
    "shor enteh 🤜🙂", 
    "jalais na toh vaaag 😤", 
    "i love you বললে কথা বলব..!!👉👈", 
    " এতো bbu bbu না করে এমবি কিনে দেহ👅", 
    "👀✨", 
    "🐣🎀", 
    "টুকিইইইইইইইইই😍", 
    "তোর কথা তোহ তোর বাড়ির লোকে শুনে না আমি কেন সুনবো?😒", 
    "কি তোর কথা শুনে চোখে জল 😅 - কেমনে তোকে দেখলে হাসি থামেনা!", 
    "তুই আজকে মিষ্টি লুকাইলি - মনে হচ্ছিল তুই কোনো পিৎজা!", 
    "হ্যাঁ তোকে কিন্তু মিস করলাম - তারপর আবার রাগ হলো!", 
    "তুমি তো মোস্ট এলিজিবল ব্যাচেলর, তাই না? - হাহাহা, মজা করলাম!", 
    "পদ্মফুল তোকে দেখলে বোঝা যায় - আপনি তো একেবারে জাদুর রাজকুমারী!", 
    "আল্লাহ মিয়া, তুমি তো একটা পিক্সেল! - সবাই চায় তোর মতো পিক্সেল!", 
    "তোকে তো দেখলে আমার মনটা গলে যায় 😍 - এই মন কি তোমার জন্য?", 
    "তুই আমার ফেভারিট সুপারহিরো! - যেকোনো সময় এসে বাঁচিয়ে দিবি!", 
    "তুই যদি সেলিব্রিটি হইতো, আমি তোর ফ্যান ক্লাবের প্রেসিডেন্ট হতাম 😎!", 
    "প্লিজ তোকে আমি ফলো করতে চাই - কিন্তু তুই এত দ্রুত পালাই তো!", 
    "তুই তো একটা সোশ্যাল মিডিয়া সেলিব্রিটি হয়ে গেছিস - ফলোয়ারদের সংখ্যা তো বাড়েই যাচ্ছে!", 
    "তোমার গায়ের রঙটা তো সূর্যের মতো উজ্জ্বল 😁 - এতই কিউট!", 
    "তুই আজকে কি খাস? - মনে হচ্ছে তুই একটা আইসক্রিম খেয়ে এসেছিস!", 
    "তোর হাসি তো গা ধরা! - আর একটা হাসি দেখলে আমার হৃদপিণ্ড 'থাম' হয়ে যাবে!", 
    "তুই এমন কথা বলিস কেন যে, মনটা খুব নরম হয়ে যায়! 😅", 
    "অ্যা, তুমি তো একজন সুন্দরী মডেল! - আমি কিন্তু তোর স্টাইল অনুসরণ করছি।", 
    "ওহ, তুই তো সোজা এক্সট্রা শুটিংয়ে চলে গেলি! - কোথায় যাবি এবার?"
  ];
  const userInput = body.toLowerCase().trim();

  const keywords = ["bbu", "hey", "bbz", "বট", "robot"];

  if (keywords.some((keyword) => userInput.startsWith(keyword))) {
    const isQuestion = userInput.split(" ").length > 1;
    if (isQuestion) {
      const question = userInput.slice(userInput.indexOf(" ") + 1).trim();

      try {
        const res = await axios.get(
          `${await getAPIBase()}/bby?text=${encodeURIComponent(question)}&uid=${senderID}`
        );
        const replyMsg = makeBold(res.data?.text || "I couldn't understand that. Please teach me!");
        const react = res.data.react || "";

        return api.sendMessage(replyMsg + react, threadID, (error, info) => {
          if (!error) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: module.exports.config.name,
              type: "reply",
              author: senderID,
              replyMsg
            });
          }
        }, messageID);
      } catch (error) {
        return api.sendMessage("error🦆💨", threadID, messageID);
      }
    } else {
      const rMsg = `${baigan}\n\n${cMessages[Math.floor(Math.random() * cMessages.length)]}`;
      return api.sendMessage(rMsg, threadID,(error, info) => {
          if (!error) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: module.exports.config.name,
              type: "reply",
              author: senderID,
            });
          }
        }, messageID);
    }
  }
};

module.exports.onReply = async ({ api, event, Reply }) => {
  const { threadID, messageID, senderID, body } = event;
  return talkWithBot(api, threadID, messageID, senderID, body);
};
