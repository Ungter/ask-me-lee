const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('How to use /ask'),

    async execute(interaction) {
        await interaction.reply("You can input both message IDs and the message itself.\n\n" +
                                "But you **cannot** input both at the same time:bangbang:\n\n" +
                                "If you request have more than 2000 characters, please put it into a *.txt* :newspaper: file and upload it to Discord, then input the message ID.\n\n" + 
                                "To get the ID of a message, enable developer mode in discord, the right click on the message and click \"Copy ID\".\n\n")
    }
}