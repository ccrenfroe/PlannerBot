// Modules
const fs = require('fs');
const Discord = require('discord.js');
require('dotenv').config();
const { prefix } = require('./config.json');

// client instance
const client = new Discord.Client();

// "Importing" in the commands
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
// Loop through each file in commandFiles and load it in . . .
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// then set a new item in the Collection
	// with the key as the command name and the value as the exported module.
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.once('ready', () => { console.log("System online! { * = * }"); });
client.on('message', message => {
	// Error checking. Checking if the wrong prefix is used or if the message was sent by another bot.
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).trim().split(/ +/); // Takes off the prefix, returns array of args. Regex to get rid of repeated spaces.
	const commandName = args.shift().toLowerCase(); // Takes out the command(the first arg) from the array and returns it to commandName variable.

	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName)); // Looks for the command or the alias.
	if (!command) return; // Stops if it could not be found.

	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	if (command.args && !args.length) // If args flag is true and the length does not exist, then the command was run improperly without args.
	{
		let reply =`You didn't provide any arguments, ${message.author}!`;

		if (command.usage)
		{
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}
		return message.channel.send(reply);
	}

	// Cooldown code
	if (!cooldowns.has(command.name)) { // Add the command to the collection if it is not already there.
		cooldowns.set(command.name, new Discord.Collection());
	}
	
	const now = Date.now(); // Current time timestamp.
	const timestamps = cooldowns.get(command.name); // Gets the timestamps for the command.
	const cooldownAmount = (command.cooldown || 3) * 1000; // Gets the cooldown time, defaults to 3 if no cooldown exist in the commands file.
	
	// If the user is in the timestamp collection . . .
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount; // Find the timestamp for when the cooldown expires.
	
		if (now < expirationTime) { // If the cooldown has not expired . . .
			const timeLeft = (expirationTime - now) / 1000; // . . . get the time left and tell the user.
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}
	else // the user does not have a cooldown, so add the new timestamp for the user before the command is executed.
	{
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.login(process.env.BOT_TOKEN);