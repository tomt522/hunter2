const axios = require("axios");

const gApi = async () => {
  const base = await axios.get(
    "https://raw.githubusercontent.com/nazrul4x/Noobs/main/Apis.json"
  );
  return base.data.api;
};

module.exports.config = {
  name: "imagine",
  aliases: ["img", "c"],
  version: "1.6.9",
  author: "Nazrul",
  role: 0,
  description: "Generate unique images",
  category: "image",
  countDown: 3,
  guide: {
    en: "{pn} write a prompt",
  },
};

module.exports.onStart = async ({ api, event, args }) => {
  const { threadID, messageID } = event;
  const prompt = args.join(" ");
  
  if (!prompt) {
    return api.sendMessage("⚠️ Please provide a prompt!", threadID, messageID);
  }

  try {
    const apiUrl = await gApi();
    const res = await axios.get(`${apiUrl}/nazrul/imagine?prompt=${encodeURIComponent(prompt)}`);
    const { images } = res.data;

    const attachments = [];
    for (const image of images) {
      if (image.imgUrl) {
        const imageStream = await axios.get(image.imgUrl, { responseType: "stream" });
        attachments.push(imageStream.data);
      }
    }

    api.sendMessage(
      {
        body: `🛠️ Here's your Generated Images \n\n🔖 Prompt: "${prompt}"`,
        attachment: attachments,
      },
      threadID,
      messageID
    );
  } catch (error) {
    await api.sendMessage(
      `❌ Oops! An error occurred while generating the image:\n${error.message}`,
      threadID,
      messageID
    );
  }
};
