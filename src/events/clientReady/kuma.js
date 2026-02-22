const axios = require("axios");
require("dotenv").config();

module.exports = async (client) => {
  const KUMA_PUSH_URL = process.env.KUMA_PUSH_URL;

  async function sendHeartbeat(status = "up", message = "OK") {
    const discordPing = Math.max(0, Math.round(client.ws?.ping ?? 0));

    try {
      await axios.get(KUMA_PUSH_URL, {
        params: { status, msg: message, ping: discordPing },
        timeout: 5000,
      });
    } catch (err) {
      console.error("Kuma heartbeat failed:", err?.message || err);
    }
  }

  await sendHeartbeat("up", "Bot online");

  setInterval(() => {
    sendHeartbeat("up", "Bot alive");
  }, 60_000);
};