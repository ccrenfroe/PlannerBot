// Modules
const Discord = require('discord.js')

module.exports = {
	name: 'plan',
    description: 'Create an embed for a newly planned event.\nFor event, choose \`game\` or \`other\`. For \`game\`, enter the full title of the game. For \`other\`, enter the chosen event name.\nNext enter a description.\nFinally, enter the time the event will take place.',
    args:true, // CHANGE TO TRUE AFTER DONE
    cooldown: 10,
    usage: '[Event] [Title] [Description] [Time]',
	cooldown: 1,
    // The command operations go here.
    execute(message, args) 
    {
        // Will ask the user a series of questions to build up the embed fields.
        // Will follow similar methodology to the Apollo bot, with an additional quick event creation option
        // Will query a game api to get info about the game event and a picture of it.
		const eventEmbed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setTitle()
        .setAuthor(message.author.username)
        .setDescription("help")
        .setImage();
        message.channel.send(eventEmbed);
	},
};