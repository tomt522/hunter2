const cooldowns = new Map();

module.exports = {
  config: {
    name: "slot",
    version: "1.8",
    author: "OtinXSandip", //modify SAIF 
    shortDescription: {
      en: "Unique styled slot game with cooldown & balanced win rate",
    },
    longDescription: {
      en: "Slot game where you must wait 10 seconds before playing again, with a 20% win rate and tougher difficulty.",
    },
    category: "game",
  },
  langs: {
    en: {
      invalid_amount: "🚫 Enter a valid and positive amount to have a chance to win!",
      not_enough_money: "💰 Check your balance if you have that amount.",
      cooldown_message: "⏳ Wait %1 seconds before playing again!",
      final_result: "🐣 SLOTS START ✨\n┌───────────────┐\n│ %1 | %2 | %3 │\n└───────────────┘\n\n%4",
      win_message: "🐔 Congratulations! You won $%1! 🤑",
      lose_message: "😿 Oops, you lost $%1.",
      jackpot_message: "💎 MEGA JACKPOT! You won $%1 with three %2 symbols! 💰💵",
    },
  },
  onStart: async function ({ args, message, event, usersData, getLang }) {
    const { senderID } = event;
    const userData = await usersData.get(senderID);
    const amount = parseInt(args[0]);

    // Cooldown system
    const lastPlayed = cooldowns.get(senderID);
    const now = Date.now();
    const cooldownTime = 10 * 1000; // 10 seconds

    if (lastPlayed && now - lastPlayed < cooldownTime) {
      const remainingTime = Math.ceil((cooldownTime - (now - lastPlayed)) / 1000);
      return message.reply(getLang("cooldown_message", remainingTime));
    }

    cooldowns.set(senderID, now); // Set cooldown

    if (isNaN(amount) || amount <= 0) {
      return message.reply(getLang("invalid_amount"));
    }

    if (amount > userData.money) {
      return message.reply(getLang("not_enough_money"));
    }

    const slots = ["💚", "💛", "💙", "🍀", "⭐", "🎲"];
    
    // Win/Lose Logic (20% win, 80% lose)
    let slot1, slot2, slot3;
    const winChance = Math.random() < 0.2; // 20% chance to win

    if (winChance) {
      slot1 = slot2 = slot3 = slots[Math.floor(Math.random() * slots.length)];
    } else {
      slot1 = slots[Math.floor(Math.random() * slots.length)];
      slot2 = slots[Math.floor(Math.random() * slots.length)];
      slot3 = slots[Math.floor(Math.random() * slots.length)];
      
      // Ensure it's not a win if losing
      if (slot1 === slot2 && slot2 === slot3) {
        slot3 = slots.find(s => s !== slot1);
      }
    }

    const winnings = calculateWinnings(slot1, slot2, slot3, amount);

    await usersData.set(senderID, {
      money: userData.money + winnings,
      data: userData.data,
    });

    // Final Result
    const messageText = getSpinResultMessage(slot1, slot2, slot3, winnings, getLang);
    return message.reply(messageText);
  },
};

function calculateWinnings(slot1, slot2, slot3, betAmount) {
  if (slot1 === "💚" && slot2 === "💚" && slot3 === "💚") {
    return betAmount * 5; // Reduced from 7
  } else if (slot1 === "💛" && slot2 === "💛" && slot3 === "💛") {
    return betAmount * 3; // Reduced from 4
  } else if (slot1 === slot2 && slot2 === slot3) {
    return betAmount * 1.5; // Reduced from 2
  } else if (slot1 === slot2 || slot1 === slot3 || slot2 === slot3) {
    return betAmount * 1; // Small win
  } else {
    return -betAmount * 1.5; // Increased loss
  }
}

function getSpinResultMessage(slot1, slot2, slot3, winnings, getLang) {
  let resultMessage;
  if (winnings > 0) {
    if (slot1 === "⭐" && slot2 === "⭐" && slot3 === "⭐") {
      resultMessage = getLang("jackpot_message", winnings, "⭐");
    } else {
      resultMessage = getLang("win_message", winnings);
    }
  } else {
    resultMessage = getLang("lose_message", -winnings);
  }
  return getLang("final_result", slot1, slot2, slot3, resultMessage);
                                      }
