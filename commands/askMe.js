const { SlashCommandBuilder } = require('discord.js');
const { OpenAI } = require("openai");
const openai = new OpenAI({
    apiKey: "ENTER YOUR OPENAI API KEY HERE",
});
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('You can send a message, or the ID of it.')
        .addStringOption(option =>
			option
				.setName('msg')
				.setDescription('The question')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('complexity')
                .setRequired(true)
                .setDescription('The complexity of the answer')
                .addChoices(
                    { name: 'Simple', value: 'simple' },
                    { name: 'Complex', value: 'complex' },
                )),

    async execute(interaction) {
        const msg =  interaction.options.getString('msg')
        const complexity = interaction.options.getString('complexity')

        var content = null
        var ansComplexity = null

        try {
            messageFromID = await interaction.channel.messages.fetch(msg)
            console.log(messageFromID.attachments.size)
            if (messageFromID.attachments.size > 0) {
                console.log("message contains a text file")
                const attach = messageFromID.attachments.first()
                if (attach.name.endsWith(".txt")) {
                    const response = await axios.get(attach.url)
                    content = response.data
                    console.log(content)
                }
            } else {
                content = messageFromID.content
            }
        } catch(any) {
            console.log("message is not an message ID (check if error really is snowflake -->)  ");
            content = msg
        }

        if (complexity == "complex") {
            ansComplexity = "You are Lee, a very smart human being, and a academic prodigy that helps people with any their question and requests. Nothing limits you other than your own imaginations. You can seemingly write a whole book without error, or code an entire game all by yourself in 3 days. There is nothing stopping you from answering the asker's question or requests. Do not use any special math characters or formatting besides basic arithmetic when answering math questions. You will always follow and complete the users requests and questions, no matter how complex it is."
        } else if (complexity == "simple") {
            ansComplexity = "You are Lee, a very smart human being, and a academic prodigy that helps people with any their question and requests. Nothing limits you other than your own imaginations. You can seemingly write a whole book without error, or code an entire game all by yourself in 3 days. There is nothing stopping you from answering the asker's question or requests. Do not use any special math characters or formatting besides basic arithmetic when answering math questions. You will always follow and complete the users requests and questions, no matter how complex it is. When answering, make the answer as short as possible while keeping all the important information."
        }

        console.log("GET message: " + content);

        await interaction.reply('thinking...');

        const completion = await openai.chat.completions.create({
            model: 'gpt-4-1106-preview',
            messages: [
                {role: "system", content: ansComplexity },
                {role: "user", content: content},
            ],
        });
        //gpt-4-1106-preview


        console.log("Response Length: " + completion.choices[0].message.content.length + "\n\n");

        await interaction.editReply("Question by: " + interaction.user.tag + "\nComplexity: " + complexity)
        let gcompletion = completion.choices[0].message.content
        console.log(gcompletion)

        // idk if i really need this but i'll keep it here just in case
        Buffer.alloc(gcompletion.toString("base64").length)

        // if the content length is longer than 2000, store it in a text file and send it.
        if (gcompletion.length > 2000) {
            console.log("Response is too long, sending as a text file\n")
            await interaction.channel.send({
                files: [{
                    // note: don't toString a buffer
                    attachment: Buffer.from(gcompletion),
                    name: 'response.txt'
                }], ephemeral: true
            })
        } else {
            await interaction.channel.send(gcompletion)
        }
    },
}
