const { Events,  Collection, REST, Routes, Client, GatewayIntentBits} = require('discord.js');
const TOKEN = "ENTER YOUR DISCORD BOT TOKEN HERE"
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const fs = require('node:fs');
const path = require('node:path');

// Need these in another file
global.userUsedChatTimesMap = new Map()
global.userUsedImagineTimesMap = new Map()
global.userUsedChatDollars = new Map()
global.userUsedImagineDollars = new Map()

const commands = [];
// Grab all the command files from the commands directory you created earlier
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
    console.log(`Loading command ${file}`);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(TOKEN);
  
// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// Convert the commands Collection to an array for the body
        let commandsArray = Array.from(client.commands.values()).map(c => c.data);
        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
	        Routes.applicationCommands('1109499646851698741'),
	        { body: commandsArray },
        );

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	var user = interaction.user.tag

	try {
		await command.execute(interaction);

		// Update how much the user has used
		if (interaction.commandName == "ask") {
			if (userUsedChatTimesMap.has(user)) {
				userUsedChatTimesMap.set(user, (userUsedChatTimesMap.get(user) + 1))
				userUsedDollars.set(user, (userUsedChatDollars.get(user) + global.chatTotalPrice))
			} else {
				userUsedChatTimesMap.set(user, 1)
				userUsedChatDollars.set(user, global.chatTotalPrice)
			}
			await interaction.channel.send("*This request by " + interaction.user.tag + " costed $" + global.chatTotalPrice + "*")
			console.log(user + " has used the command *ask* " + userUsedChatTimesMap.get(user) + " times and $" +
						userUsedChatDollars.get(user) + " dollars in total for this command.\n\n")
		
		} else if (interaction.commandName == "imagine") {
			if (userUsedImagineTimesMap.has(user)) {
				userUsedImagineTimesMap.set(user, (userUsedImagineTimesMap.get(user) + 1))
				userUsedImagineTimesMap.set(user, (userUsedImagineDollars.get(user) + 0.04))
			} else {
				userUsedImagineTimesMap.set(user, 1)
				userUsedImagineDollars.set(user, 0.04)
			}
			console.log(user + " has used the command *imagine* " + userUsedImagineTimesMap.get(user) + " times and $" +
						userUsedImagineDollars.get(user) + " dollars in total for this command..\n\n")
		}

		
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

client.login(TOKEN);
