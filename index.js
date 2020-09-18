// Imports
const Discord = require('discord.js');
require('dotenv').config();
const { prefix } = require('./config.json');

const client = new Discord.Client();

client.once('ready', () => { console.log("System online! { * = * }"); });

client.on('message', message => {
	// Error checking. Checking if the wrong prefix is used or if the message was sent by another bot.
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).trim().split(/ +/); // Takes off the prefix, returns array of args. Regex to get rid of repeated spaces.
	const command = args.shift().toLowerCase(); // Takes out the command(the first arg) from the array and returns it to command variable

	// Sends back 'Pong!' if a message in the channel is '!ping'
	if (command === "ping")
	{
		message.channel.send('Pong!');
	}
	// Just for referencing and learning
	// else if (message.content === `${prefix}server`) {
	// 	message.channel.send(`This server's name is: ${message.guild.name}`);
	// }
	// else if (message.content === `${prefix}user-info`) {
	// 	message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
	// }
});

client.login(process.env.BOT_TOKEN);