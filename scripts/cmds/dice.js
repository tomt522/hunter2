module.exports = {
  config: {
    name: "dice",
    aliases: [],
    version: "1.3",
    author: "kshitiz (enhanced by SAIF 🐣)",
    countDown: 5,
    role: 0,
    shortDescription: "🎲 Dice Game - Roll & Win!",
    longDescription: {
      en: "Bet on a dice number and test your luck. Win double if you're right!",
    },
    category: "game",
    guide: {
      en: "{p}dice <number 1-6> <bet amount>\n\nExample: {p}dice 3 1000",
    },
  },

  onStart: async function ({ api, event, args, usersData, message }) {
    const { getPrefix } = global.utils;
    const p = getPrefix(event.threadID);
    const user = event.senderID;
    const userData = await usersData.get(user);

    // User Input Validation
    const dice = parseInt(args[0]);
    const betAmount = parseInt(args[1]);

    if (isNaN(dice) || dice < 1 || dice > 6) {
      return message.reply(
        `╭─────────────✧\n` +
        `│ ❌ Invalid Choice!\n` +
        `│ 🎲 Pick a number between 1-6\n` +
        `│ 📝 Usage: ${p}dice <num> <bet>\n` +
        `│ 🔹 Example: ${p}dice 3 1000\n` +
        `╰─────────────✧`
      );
    }
    if (isNaN(betAmount) || betAmount <= 0) {
      return message.reply(
        `╭─────────────✧\n` +
        `│ ❌ Invalid Bet Amount!\n` +
        `│ 💰 Enter a valid number\n` +
        `│ 📝 Usage: ${p}dice <num> <bet>\n` +
        `│ 🔹 Example: ${p}dice 3 1000\n` +
        `╰─────────────✧`
      );
    }

    // Check if user has enough balance
    if (userData.money < betAmount) {
      return message.reply(
        `╭─────────────✧\n` +
        `│ 🥲 Insufficient Balance!\n` +
        `│ 💰 Your Balance: ${userData.money}\n` +
        `╰─────────────✧`
      );
    }

    // Roll the dice (1 to 6)
    const rolledNumber = Math.floor(Math.random() * 6) + 1;
    let replyMessage = `╭─────────────✧\n` +
                       `│ 🎲 Dice Rolled: ${rolledNumber}\n`;

    if (rolledNumber === dice) {
      const winAmount = betAmount * 2;
      userData.money += winAmount;
      replyMessage += `│ 😻 You Won! +${winAmount} Coins\n`;
    } else {
      userData.money -= betAmount;
      replyMessage += `│ 😿 You Lost -${betAmount} Coins\n`;
    }

    replyMessage += `│ 💹 Now Balance: ${userData.money}\n` +
                    `╰─────────────✧`;

    // Update user balance
    await usersData.set(user, userData);

    // Send final message
    message.reply(replyMessage);
  }
};
