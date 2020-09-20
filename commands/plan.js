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
        var title = collector(message,20);
        message.author.send("Please enter a short description of your event. (Must be shorter than 2000 characters)");        
        var description = collector(message, 2000);

        const eventEmbed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setTitle(title)
        .setAuthor(message.author.username)
        .setDescription(description)
        .setImage();
        message.channel.send(eventEmbed);
    },
};

//TO-DO : Add a flag for a none option?
function collector(message,limit) 
{
    message.channel.awaitMessages(response => response.author.id === message.author.id, 
        {
            max: 1,
            time: 10000,
            errors:['time'],
        })
        .then((collected) => {
            if (collected.first().content.length < limit)
            {
                message.author.send(`I collected the message : ${collected.first().content}`);
                return collected.first().content;
            }
            //else
            collector(limit);
        })
        .catch(() => {
            message.author.send("No message collected after 10 seconds.")
        })
}