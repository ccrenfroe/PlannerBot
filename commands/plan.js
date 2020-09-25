// Modules
const Discord = require('discord.js')

module.exports = {
	name: 'plan',
    description: 'Create an embed for a newly planned event.\nFor event, choose \`game\` or \`other\`. For \`game\`, enter the full title of the game. For \`other\`, enter the chosen event name.\nNext enter a description.\nFinally, enter the time the event will take place.',
    args:false,
    cooldown: 10,
    usage: '[Event] [Title] [Description] [Time]',
	cooldown: 1,
    // The command operations go here.
    execute(message, args) 
    {
        embedBuilder(message);
    },
};

async function collector(message,limit) 
{
    return message.channel.awaitMessages(response => response.author.id === message.author.id, 
        {
            max: 1,
            time: 60000,
            errors:['time'],
        })
        .then((collected) => {
            if (collected.first().content.length < limit)
            {
                message.author.send(`I collected the message : ${collected.first().content}`);
                return collected.first().content;
            }
            //else
            message.author.send("Invalid input. Please try again. (Must be below 200 characters)");
            return collector(message,200);
        })
        .catch(() => {
            message.author.send("No message collected after 1 minute. Cancelling plan.")
        })
}

async function embedBuilder(message)
{
    message.author.send("Lets get to work!\nPlease enter the title of your event. (Must be shorter than 200 characters)");
    const title = await collector(message,200);
    message.author.send("Please enter a short description of your event. (Must be shorter than 2000 characters)");
    const description = await collector(message,2000);
    const eventEmbed = new Discord.MessageEmbed()
    .setColor('RANDOM')
    .setTitle(title)
    .setAuthor(message.author.username)
    .setDescription(description)
    .setImage();
    message.channel.send(eventEmbed);
}