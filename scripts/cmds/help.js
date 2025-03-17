const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;

// Ensure GoatBot exists
if (!global.GoatBot) global.GoatBot = { commands: new Map(), aliases: new Map() };
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "1.17",
    author: "NTKhang", // original author Kshitiz
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "View command usage",
    },
    longDescription: {
      en: "View command usage and list all commands directly",
    },
    category: "info",
    guide: {
      en: "{pn} / help cmdName",
    },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    try {
      const { threadID } = event;
      const threadData = await threadsData.get(threadID);
      const prefix = getPrefix(threadID);

      if (args.length === 0) {
        const categories = {};
        let msg = "";

        msg += `╔════════════╗\n Yₒᵤᵣ𝐓𝐎𝐌♕︎ \n╚════════════╝\n`;

        for (const [name, value] of commands) {
          if (value.config.role > 1 && role < value.config.role) continue;
          const category = value.config.category || "Uncategorized";
          if (!categories[category]) categories[category] = { commands: [] };
          categories[category].commands.push(name);
        }

        Object.keys(categories).forEach((category) => {
          if (category !== "info") {
            msg += `\n╭────────────⭓\n│『 ${category.toUpperCase()} 』`;
            const names = categories[category].commands.sort();
            names.forEach((item) => {
              msg += `\n│${item}`;
            });
            msg += `\n╰────────⭓`;
          }
        });

        const totalCommands = commands.size;
        msg += `\nYₒᵤᵣ𝐓𝐎𝐌 𝘁𝗼𝘁𝗮𝗹 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀 : ${totalCommands} \n`;
        msg += `𝗔𝗱𝗺𝗶𝗻_𝐑𝐈𝐅𝐀𝐓`;

        // Fixed: Set a valid image URL
        const helpListImages = [
          "https://example.com/help-image1.jpg", // Replace with real URLs
          "https://example.com/help-image2.jpg"
        ];
        const helpListImage = helpListImages[Math.floor(Math.random() * helpListImages.length)];

        let attachment = null;
        try {
          attachment = await global.utils.getStreamFromURL(helpListImage);
        } catch (error) {
          console.error("Image fetch error:", error);
        }

        await message.reply({
          body: msg,
          attachment: attachment,
        });
      } else {
        const commandName = args[0].toLowerCase();
        const command = commands.get(commandName) || commands.get(aliases.get(commandName));

        if (!command) {
          return message.reply(`Command "${commandName}" not found.`);
        }

        const configCommand = command.config;
        const roleText = roleTextToString(configCommand.role);
        const author = configCommand.author || "Unknown";
        const longDescription = configCommand.longDescription?.en || "No description";
        const guideBody = configCommand.guide?.en || "No guide available.";
        const usage = guideBody.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name);

        const response = `╭── NAME ────⭓\n` +
          `│ ${configCommand.name}\n` +
          `├── INFO\n` +
          `│ Description: ${longDescription}\n` +
          `│ Other names: ${configCommand.aliases ? configCommand.aliases.join(", ") : "None"}\n` +
          `│ Version: ${configCommand.version || "1.0"}\n` +
          `│ Role: ${roleText}\n` +
          `│ Time per command: ${configCommand.countDown || 1}s\n` +
          `│ Author: ${author}\n` +
          `├── Usage\n` +
          `│ ${usage}\n` +
          `├── Notes\n` +
          `│ The content inside <XXXXX> can be changed\n` +
          `│ The content inside [a|b|c] is a or b or c\n` +
          `╰━━━━━━━❖`;

        await message.reply(response);
      }
    } catch (error) {
      console.error("Help command error:", error);
      await message.reply("An error occurred while fetching the help menu.");
    }
  },
};

function roleTextToString(roleText) {
  const roles = {
    0: "0 (All users)",
    1: "1 (Group administrators)",
    2: "2 (Admin bot)"
  };
  return roles[roleText] || `Unknown role (${roleText})`;
              }
