const { EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder, ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const fs = require("fs");

module.exports = {
    name: "help",
    description: "Shows a list of all commands per category or view info for a specific command",
    usage: "<?command>",
    options: [
        {
            name: "command",
            description: "The command you want to view info for",
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],

    run: async (client, interaction) => {
        const commandFolders = fs.readdirSync("./src/commands").filter((folder) => !folder.endsWith("."));
        const commandByCategory = {};

        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter((file) => file.endsWith(".js"));
            const commands = [];

            for (const file of commandFiles) {
                const { default: command } = await import(`./../${folder}/${file}`);
                commands.push({ name: command.name, description: command.description, usage: command.usage, permissionsRequired: command.permissionsRequired});
            }

            commandByCategory[folder] = commands;
        }

        await interaction.deferReply();

        const commandName = interaction.options.getString("command");

        if (commandName) {
            let commandFound = null;

            for (const category in commandByCategory) {
                const command = commandByCategory[category].find(cmd => cmd.name === commandName);
                if (command) {
                    commandFound = command;
                    break;
                }
            }

            if (commandFound) {
                const permissions = commandFound.permissionsRequired
                    ? commandFound.permissionsRequired.map(perm => {
                        for (const [name, value] of Object.entries(PermissionFlagsBits)) {
                            if (value === perm) {
                                return name;
                            }
                        }
                        return null;
                    }).filter(perm => perm !== null).join(", ")
                    : "No permissions required";


                const roles = commandFound.rolesRequired
                    ? commandFound.rolesRequired.map(role => `<@&${role}>`).join(", ")
                    : "No roles required";

                const commandEmbed = new EmbedBuilder()
                    .setColor(0x0099ff)
                    .setTitle(`Command: ${commandFound.name}`)
                    .setDescription(`Details of the \`${commandFound.name}\` command`)
                    .addFields(
                        { name: "Description", value: commandFound.description || "No description provided" },
                        { name: "Usage", value: commandFound.usage ? `\`/${commandFound.name} ${commandFound.usage}\`` : `\`/${commandFound.name}\`` },
                        { name: "Permissions", value: permissions },
                        { name: "Roles Required", value: roles },
                    )
                    .setThumbnail(client.user.displayAvatarURL());

                return interaction.editReply({ embeds: [commandEmbed] });
            } else {
                return interaction.editReply(`No command found with the name \`${commandName}\`.`);
            }
        }

        const DropdownOptions = Object.keys(commandByCategory).map((folder) => ({
            label: folder,
            value: folder,
        }));

        const SelectMenu = new StringSelectMenuBuilder()
            .setCustomId("category-select")
            .setPlaceholder("Select a category")
            .addOptions(
                ...DropdownOptions.map((option) => ({
                    label: option.label.charAt(0).toUpperCase() + option.label.slice(1),
                    value: option.value.charAt(0).toUpperCase() + option.value.slice(1),
                }))
            );

        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle("Help menu")
            .setDescription("Select a category from the dropdown menu to view commands.")
            .setThumbnail(client.user.displayAvatarURL());

        const row = new ActionRowBuilder().addComponents(SelectMenu);
        const message = await interaction.editReply({
            embeds: [embed],
            components: [row],
        });

        const filter = (i) =>
            i.isStringSelectMenu() &&
            i.customId === "category-select" &&
            i.user.id === interaction.user.id;
        const collector = message.createMessageComponentCollector({ filter });

        collector.on("collect", async (i) => {
            const category = i.values[0];
            const categoryCommands = commandByCategory[i.values[0].charAt(0).toLowerCase() + i.values[0].slice(1)];

            const categoryEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(`${category.charAt(0).toUpperCase() + category.slice(1)} Commands`)
                .setDescription(`List of all the commands in this category`)
                .setThumbnail(client.user.displayAvatarURL())
                .setFooter({ iconURL: client.user.displayAvatarURL(), text: `${client.user.username}` });

            if (categoryCommands.length > 0) {
                categoryEmbed.addFields(
                    categoryCommands.map((command) => ({
                        name: command.name,
                        value: command.description,
                    }))
                );
            }

            await i.update({ embeds: [categoryEmbed] });
        });
    },
};
