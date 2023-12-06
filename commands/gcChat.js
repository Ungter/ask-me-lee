const { SlashCommandBuilder } = require('discord.js');
const { OpenAI } = require("openai");
const openai = new OpenAI({
    apiKey: "ENTER YOUR OPENAI API KEY HERE",
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('askthegc')
        .setDescription('Since 2019')
        .addStringOption(option =>
			option
				.setName('msg')
				.setDescription('The question')
                .setRequired(true)),

    async execute(interaction) {
        const msg =  interaction.options.getString('msg')
        console.log("asked:" + msg)

        await interaction.reply("Message: " + msg)

        const completion = await openai.chat.completions.create({
            model: 'this was just for my own custom model, you can add yours here if you want',
            messages: [
                {role: "system", content: "respond to the text in a coherent sentence"},
                {role: "user", content: msg},
            ],
            frequency_penalty: 1.5,
            temperature: 1,
        });

        console.log("ans: " + completion.choices[0].message.content + "\n\n")
        await interaction.editReply("\"" + msg + "\" - " + interaction.user.tag + "\n\n" + completion.choices[0].message.content)
    }
}
