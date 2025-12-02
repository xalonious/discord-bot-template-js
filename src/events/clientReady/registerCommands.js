require("dotenv").config();
const server = process.env.SERVER_ID;
const areCommandsDifferent = require("../../utils/areCommandsDifferent");
const getApplicationCommands = require("../../utils/getApplicationCommands");
const getLocalCommands = require("../../utils/getLocalCommands");
const { ok, warn } = require("../../utils/logger"); 

module.exports = async (client) => {
  try {
    const localCommands = getLocalCommands();
    const applicationCommands = await getApplicationCommands(client, server);

    let created = 0;
    let edited = 0;
    let deleted = 0;

    for (const existingCommand of applicationCommands.cache.values()) {
      const localMatch = localCommands.find(
        (cmd) => cmd.name === existingCommand.name
      );

      if (!localMatch || localMatch.deleted) {
        await applicationCommands.delete(existingCommand.id);
        deleted++;
        console.log(`🗑️  | Deleted command ${existingCommand.name}`);
      }
    }

    for (const localCommand of localCommands) {
      if (localCommand.deleted) continue;

      const { name, description, options } = localCommand;

      const existingCommand = applicationCommands.cache.find(
        (cmd) => cmd.name === name
      );

      if (existingCommand) {
        if (areCommandsDifferent(existingCommand, localCommand)) {
          await applicationCommands.edit(existingCommand.id, {
            description,
            options: options || [],
          });

          edited++;
          console.log(`🔀  | Edited command ${name}`);
        }
      } else {
        await applicationCommands.create({
          name,
          description,
          options,
        });

        created++;
        console.log(`👍  | Registered command ${name}`);
      }
    }

    await applicationCommands.fetch();
    const registered = applicationCommands.cache.size;

    console.log(
      ok
        ? ok(`✅ Commands registered: ${registered} (${created} new, ${edited} updated, ${deleted} removed)`)
        : `✅  | Commands registered: ${registered} (${created} new, ${edited} updated, ${deleted} removed)`
    );

  } catch (error) {
    console.log(
      warn
        ? warn(`⚠️  | An error occurred while registering commands: ${error}`)
        : `⚠️  | An error occurred while registering commands: ${error}`
    );
  }
};
