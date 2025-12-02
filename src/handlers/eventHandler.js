const path = require("path");
const getAllFiles = require("../utils/getAllFiles");

module.exports = (client) => {
  const eventFolders = getAllFiles(path.join(__dirname, "..", "events"), true);

  let eventCount = 0;

  eventFolders.forEach((eventFolder) => {
    const eventFiles = getAllFiles(eventFolder);
    const eventName = path.basename(eventFolder); 

    eventCount += eventFiles.length;

    client.on(eventName, async (...args) => {
      for (const eventFile of eventFiles) {
        const eventFunction = require(eventFile);
        await eventFunction(client, ...args);
      }
    });
  });

  client.eventCount = eventCount; 
};
