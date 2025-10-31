require("dotenv").config();
const server = process.env.SERVER_ID
const areCommandsDifferent = require("../../utils/areCommandsDifferent")
const getApplicationCommands = require("../../utils/getApplicationCommands")
const getLocalCommands = require("../../utils/getLocalCommands")

module.exports = async (client) => {
    try {
        const localCommands = getLocalCommands()
        const applicationCommands = await getApplicationCommands(client, server)

        const localCommandNames = new Set(localCommands.map(cmd => cmd.name));

        for (const existingCommand of applicationCommands.cache.values()) {
            if (!localCommandNames.has(existingCommand.name)) {
                await applicationCommands.delete(existingCommand.id);
                console.log(`🗑️  | Deleted command ${existingCommand.name}`);
            }
        }

        for (const localCommand of localCommands) {
            const { name, description, options } = localCommand;

            const existingCommand = applicationCommands.cache.find((cmd) => cmd.name === name)

            if (existingCommand) {
                if (areCommandsDifferent(existingCommand, localCommand)) {
                    await applicationCommands.edit(existingCommand.id, {
                        description,
                        options: options || []
                    });

                    console.log(`🔀  | Edited command ${name}`);
                }
            } else {
                await applicationCommands.create({
                    name,
                    description,
                    options
                });

                console.log(`👍  | Registered command ${name}`);
            }
        }
    } catch (error) {
        console.log(`⚠️  | An error occurred while registering commands: ${error}`);
    }
};