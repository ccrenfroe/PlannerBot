const Discord = require('discord.js');
require('dotenv').config();

const client = new Discord.Client();

client.once('ready', () => {
	console.log("System online! { * = * }");
});

client.login(process.env.BOT_TOKEN);