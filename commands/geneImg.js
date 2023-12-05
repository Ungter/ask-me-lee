const { SlashCommandBuilder } = require('discord.js');
const { OpenAI } = require("openai");
const openai = new OpenAI({
    apiKey: "ENTER YOUR OPENAI API KEY HERE",
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('imagine')
        .setDescription("Generate a image based")
        .addStringOption(option =>
            option
            .setName("prompt")
            .setDescription("what would you like to see")
                .setRequired(true)),

    async execute(interaction) {
        const msg = interaction.options.getString('prompt')

        console.log("prompt: " + msg)

        await interaction.reply("imagining: " + msg)

        try {
            const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: msg + ". I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS:",
            n: 1,
            size: "1024x1024"
        })
            console.log(response)
            image_url1 = response.data[0].url

            const responseImg = {
                embeds: [
                    {
                        title: "Imagined:",
                        description: msg,
                        image: {
                            url: image_url1
                        },
                    }
                ],
                color: "#dc143c"

            }

            await interaction.editReply(responseImg)

        } catch(e) {
            console.log(e)
            await interaction.editReply("something went wrong (ususally because OpenAI doesn't allow it)")
        }
    },
}
