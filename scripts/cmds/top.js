module.exports = {
  config: {
    name: "top",
    version: "1.0",
    author: "Loufi",
    role: 0,
    shortDescription: {
      en: "Top 15 Rich Users"
    },
    longDescription: {
      en: ""
    },
    category: "group",
    guide: {
      en: "{pn}"
    }
  },
  onStart: async function ({ api, args, message, event, usersData }) {
    const allUsers = await usersData.getAll();

    const topUsers = allUsers.sort((a, b) => b.money - a.money).slice(0, 15);

    const topUsersList = topUsers.map((user, index) => {
      const moneyFormatted = `$${user.money.toLocaleString()}`;

      // Add special icons for the top 3 on the same line
      if (index === 0) {
        return `🥇 ${user.name} - ${moneyFormatted}`;
      } else if (index === 1) {
        return `🥈 ${user.name} - ${moneyFormatted}`;
      } else if (index === 2) {
        return `🥉 ${user.name} - ${moneyFormatted}`;
      } else {
        return `${index + 1}. ${user.name} - ${moneyFormatted}`;
      }
    });

    // Add the horizontal line (━━━━━━━━━━━━━━━━━) after the Top 15 title
    const messageText = `👑 𝗧𝗢𝗣 15 𝗥𝗜𝗖𝗛𝗘𝗦𝗧 𝗨𝗦𝗘𝗥𝗦 👑:\n━━━━━━━━━━━━━━━━━\n\n${topUsersList.join('\n\n')}\n\n`;

    message.reply(messageText);
  }
};
