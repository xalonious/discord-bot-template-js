const { ActivityType } = require("discord.js");
const mongoose = require("mongoose");
require("dotenv").config();

module.exports = async (client) => {
  console.log(`✅  | ${client.user.tag}`)

    client.user.setActivity({
        name: "The server",
        type: ActivityType.Watching
    })
    
  mongoose.connect(process.env.MONGOURL).then(console.log('✅  | Connected to DB'))

}
