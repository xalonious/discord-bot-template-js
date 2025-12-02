const { ActivityType } = require("discord.js");
const mongoose = require("mongoose");
require("dotenv").config();
const getLocalCommands = require("../../utils/getLocalCommands");
const { brand, ok, dim, banner } = require("../../utils/logger");

module.exports = async (client) => {
  const localCommands = getLocalCommands();

  banner([
    `${brand("🤖 Bot Online")}`,
    `${ok("User:")} ${client.user.tag}`,
    `${ok("Events:")} ${client.eventCount} registered`,
    `${ok("Commands:")} ${localCommands.length} loaded`, 
    `${dim(new Date().toLocaleString())}`,
  ]);

  client.user.setActivity({
    name: "The server",
    type: ActivityType.Watching,
  });

  try {
    await mongoose.connect(process.env.MONGOURL);
    console.log(ok("✅ Connected to DB"));
  } catch (e) {
    console.log(`❌ DB connection failed: ${e.message}`);
  }
};
