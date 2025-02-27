module.exports = {
  config: {
    name: "slot",
    version: "1.0",
    author: "OtinXSandip",
    countDown: 15,
    shortDescription: {
      en: "Slot game",
    },
    longDescription: {
      en: "Slot game.",
    },
    category: "game",
  },
  langs: {
    en: {
      invalid_amount: "Enter a valid and positive amount to have a chance to win double!",
      not_enough_money: "Check your balance if you have that amount.",
      spin_message: "Spinning...",
      win_message: "✨ You won $%1, buddy! ",
      lose_message: "😿 You lost $%1, buddy.",
      jackpot_message: "😻🎀 JACKPOT! You won $%1 with three %2 symbols, buddy! 🏆",
    },
  },
  onStart: async function ({ args, message, event, envCommands, usersData, commandName, getLang }) {
    const { senderID } = event;
    const userData = await usersData.get(senderID);
    const amount = parseInt(args[0]);

    if (isNaN(amount) || amount <= 0) {
      return message.reply(getLang("invalid_amount"));
    }

    if (amount > userData.money) {
      return message.reply(getLang("not_enough_money"));
    }

    const slots = ["💚", "💛", "💙", "💜", "💖", "💜", "💚", "💛", "💙"];
    const slot1 = slots[Math.floor(Math.random() * slots.length)];
    const slot2 = slots[Math.floor(Math.random() * slots.length)];
    const slot3 = slots[Math.floor(Math.random() * slots.length)];

    const winnings = calculateWinnings(slot1, slot2, slot3, amount);

    await usersData.set(senderID, {
      money: userData.money + winnings,
      data: userData.data,
    });

    const messageText = getSpinResultMessage(slot1, slot2, slot3, winnings, getLang);

    return message.reply(messageText);
  },
};

function calculateWinnings(slot1, slot2, slot3, betAmount) {
  if (slot1 === slot2 && slot2 === slot3) {
    return betAmount * 5;
  } else if (slot1 === slot2 || slot1 === slot3 || slot2 === slot3) {
    return betAmount * 2;
  } else {
    return -betAmount;
  }
}

function getSpinResultMessage(slot1, slot2, slot3, winnings, getLang) {
  const resultText = `〚 ${slot1} | ${slot2} | ${slot3} 〛`;

  const asciiArt = `
      (\_/)
     (o.o)  
     />${resultText}`;

  if (winnings > 0) {
    return getLang("win_message", winnings) + `\n${asciiArt}`;
  } else {
    return getLang("lose_message", -winnings) + `\n${asciiArt}`;
  }
      }
