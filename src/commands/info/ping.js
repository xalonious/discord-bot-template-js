const { EmbedBuilder } = require("discord.js")
module.exports = {
    name: "ping",
    description: "Returns bot latency",

    run: async(client, interaction) => {
        await interaction.deferReply();

        const pinging = await interaction.editReply({ content: "🏓 Pinging..."})

        const wsPing = client.ws.ping;
        const apiPing = Date.now() - pinging.createdTimestamp;

        let days = Math.floor(client.uptime / 86400000);
        let hours = Math.floor(client.uptime / 3600000) % 24;
        let minutes = Math.floor(client.uptime / 60000) % 60;
        let seconds = Math.floor(client.uptime / 1000) % 60;

        const pingEmbed = new EmbedBuilder()
        .setTitle("🏓 | Pong!")
        .setDescription(`**Websocket:** \`${wsPing}ms\`\n**API:** \`${apiPing}ms\`\n**Uptime:** \`${days}d ${hours}h ${minutes}m ${seconds}s\``)
        .setColor("Blurple")
        .setFooter({text: `${client.user.username}`, iconURL: client.user.displayAvatarURL()})
        await interaction.editReply({ content: "", embeds: [pingEmbed]})
    }
}