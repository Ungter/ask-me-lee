const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spent')
        .setDescription('How much money you used'),

    async execute(interaction) {
        const user = interaction.user.tag
        let chatDollars = 0
        let imagineDollars = 0
        let chatTimes = 0
        let imagineTimes = 0

        if (global.userUsedChatTimesMap.has(user)) {
            chatDollars = global.userUsedChatDollars.get(user)
            chatTimes = global.userUsedChatTimesMap.get(user)
        }
        if (global.userUsedImagineTimesMap.has(user)) {
            imagineDollars = global.userUsedImagineDollars.get(user)
            imagineTimes = global.userUsedImagineTimesMap.get(user)
        }

        await interaction.reply("holdon")

        if (chatTimes != 0 || imagineTimes != 0) {
            await interaction.editReply("You have used the **ask** command **" + chatTimes + "** time(s) and it costed **$" +
                                    chatDollars + "** dollars.\nThe **imagine** command **" + imagineTimes + "** time(s) and it costed **$" +
                                    imagineDollars + "** dollars.\n" + "In total, you have \"spent\" **$" + (chatDollars + imagineDollars) + "**.")
        } else {
            await interaction.editReply("You haven't used any (expensive) commands :D" )
        }
    }
}