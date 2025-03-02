const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "monitor",
    aliases: ["run"],
    version: "1.2",
    author: "SAIF",
    role: 0,
    shortDescription: { 
      en: "Check bot's uptime & ping with a cool design!" 
    },
    longDescription: { 
      en: "Get details about how long the bot has been active along with its response time, presented in a stylish format."
    },
    category: "owner",
    guide: { 
      en: "Use {p}monitor to check bot uptime and ping with a cool design!" 
    }
  },

  onStart: async function ({ api, event }) {
    try {
      const startTime = Date.now(); 

      // 🌟 Random anime characters for image search
      const characters = ["Zoro", "Madara", "Obito", "Luffy", "Naruto", "Itachi", "Sung Jin-Woo"];
      const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
      const imageURL = `https://pin-two.vercel.app/pin?search=${encodeURIComponent(randomCharacter)}`;

      const imageResponse = await axios.get(imageURL);
      const imageList = imageResponse.data.result;
      const randomImage = imageList[Math.floor(Math.random() * imageList.length)];

      const imageBuffer = await axios.get(randomImage, { responseType: 'arraybuffer' });
      const imagePath = path.join(__dirname, 'cache', `monitor_image.jpg`);
      await fs.outputFile(imagePath, imageBuffer.data);

      // ⏳ Uptime Calculation
      const uptime = process.uptime();
      const days = Math.floor(uptime / 86400);
      const hours = Math.floor((uptime % 86400) / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);

      let uptimeFormatted = `⏳ ${days}d ${hours}h ${minutes}m ${seconds}s`;
      if (days === 0) uptimeFormatted = `⏳ ${hours}h ${minutes}m ${seconds}s`;
      if (hours === 0) uptimeFormatted = `⏳ ${minutes}m ${seconds}s`;
      if (minutes === 0) uptimeFormatted = `⏳ ${seconds}s`;

      // 🏓 Ping Calculation
      const ping = Date.now() - startTime;

      // 🎨 Stylish Message
      const message = `
┏━━━━━━━━━━━━━━━━━━━┓
┃ 🌈 𝗕𝗢𝗧 𝗦𝗧𝗔𝗧𝗨𝗦 ┃
┗━━━━━━━━━━━━━━━━━━━┛

${uptimeFormatted}

🏖️ 𝗣𝗶𝗻𝗴: ${ping}ms

🪐 𝗜𝗺𝗮𝗴𝗲 𝗧𝗵𝗲𝗺𝗲: ${randomCharacter}

👑 𝗢𝘄𝗻𝗲𝗿: 𝗦𝗔𝗜𝗙 🐼🎀
`;

      // 📤 Sending Message with Image
      const imageStream = fs.createReadStream(imagePath);
      await api.sendMessage({
        body: message,
        attachment: imageStream
      }, event.threadID, event.messageID);

      await fs.unlink(imagePath);
    } catch (error) {
      console.error(error);
      return api.sendMessage(`❌ An error occurred!`, event.threadID, event.messageID);
    }
  }
};
