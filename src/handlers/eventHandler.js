const path = require("path");
const getAllFiles = require("../utils/getAllFiles");

module.exports = (client) => {
    const eventFolders = getAllFiles(path.join(__dirname, "..", "events"), true);

    eventFolders.forEach((eventFolder) => {
        const eventFiles = getAllFiles(eventFolder);

        const eventName = path.basename(eventFolder);

        client.on(eventName, async (...args) => {
            for (const eventFile of eventFiles) {
                const eventFunction = require(eventFile);
                await eventFunction(client, ...args);
            }
        });
    });
};