// Modules
const Discord = require('discord.js')

module.exports = {
	name: 'plan',
    description: 'Create an embed for a newly planned event.\nFor event, choose \`game\` or \`other\`. For \`game\`, enter the full title of the game. For \`other\`, enter the chosen event name.\nNext enter a description.\nFinally, enter the time the event will take place.',
    args:false, // CHANGE TO TRUE AFTER DONE
    cooldown: 10,
    usage: '[Event] [Title] [Description] [Time]',
	cooldown: 1,
    // The command operations go here.
    execute(message, args) 
    {
        message.author.send("Lets get to work!\nPlease enter the title of your event. (Must be shorter than 200 characters)");
        message.channel.awaitMessages(response => response.author.id === message.author.id && response.content.length < 10, 
        {
            max: 1,
            time: 10000,
            errors:['time'],
        })
        .then((collected) => {
            message.author.send(`I collected the message : ${collected.first().content}`);
            let title = collected.first().content;
        })
        .catch(() => {
            message.author.send("No message collected after 10 seconds.")
        })

        const eventEmbed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setTitle(title)
        .setAuthor(message.author.username)
        .setDescription("help")
        .setImage();
        message.channel.send(eventEmbed);
	},
};