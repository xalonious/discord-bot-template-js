require("dotenv").config()
const dev = process.env.DEV_ID;
const getLocalCommands = require("../../utils/getLocalCommands");

module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;


    const testmode = false;
    if(testmode && interaction.user.id !== dev) return interaction.reply("The bot is currently in test mode, pls try again later")

    const localCommands = getLocalCommands();
    const commandObject = localCommands.find((cmd) => cmd.name === interaction.commandName);

    if (!commandObject) return;

    if (commandObject.devOnly && !devs.includes(interaction.member.id)) {
        return interaction.reply("Only the developer is able to use this command.");
    }

    if (commandObject.permissionsRequired?.every((permission) => !interaction.member.permissions.has(permission))) {
        return interaction.reply("You do not have permission to run that command!");
    }


    try {
        await commandObject.run(client, interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            interaction.followUp(`There was an error while running this command. ${error}`);
        } else interaction.reply(`There was an error while running this command. ${error}`);
    }
};