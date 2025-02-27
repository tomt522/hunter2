const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports = {
	config: {
		name: "info",
		aliases: ["info"],
		author: "ArYan 🤡",
		role: 0,
		shortDescription: "info and my owner the cmd",
		longDescription: "",
		category: "info",
		guide: "{pn}"
	},

	onStart: async function ({ api, event }) {
		try {
			const ArYanInfo = {
				name: '𝑺 𝑨 𝑰 𝑭_🌷✨',
				gender: 'Male',
				age: '15+',
				Class: '9',
				Relationship: 'Single',
				religion: 'Islam',
				facebook: 'https://m.me/ewrsaif570'
			};

			const ArYan = 'https://i.imgur.com/hA4K3it.jpeg';
			const tmpFolderPath = path.join(__dirname, 'tmp');

			if (!fs.existsSync(tmpFolderPath)) {
				fs.mkdirSync(tmpFolderPath);
			}

			const imgResponse = await axios.get(ArYan, { responseType: 'arraybuffer' });
			const imgPath = path.join(tmpFolderPath, 'owner_img.jpeg');

			fs.writeFileSync(imgPath, Buffer.from(imgResponse.data, 'binary'));

			const response = `╭─────❁\n│  𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢  \n│
│𝑵𝒂𝒎𝒆 : ${ArYanInfo.name}
│𝑮𝒆𝒏𝒅𝒆𝒓 : ${ArYanInfo.gender}
│𝑹𝒆𝒍𝒂𝒕𝒊𝒐𝒏𝒔𝒉𝒊𝒑 : ${ArYanInfo.Relationship}
│𝑨𝒈𝒆 : ${ArYanInfo.age}
│𝑹𝒆𝒍𝒊𝒈𝒊𝒐𝒏 : ${ArYanInfo.religion}
│𝑪𝒍𝒂𝒔𝒔 : ${ArYanInfo.Class}
│𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 : ${ArYanInfo.facebook}\n╰────────────❁`;

			await api.sendMessage({
				body: response,
				attachment: fs.createReadStream(imgPath)
			}, event.threadID, event.messageID);

			fs.unlinkSync(imgPath);

			api.setMessageReaction('🐔', event.messageID, (err) => {}, true);
		} catch (error) {
			console.error('Error in ArYaninfo command:', error);
			return api.sendMessage('An error occurred while processing the command.', event.threadID);
		}
	}
};
