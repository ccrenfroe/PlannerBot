/**
 * @TODO - Change to collect messages from the user only through dms, and then output the reulting embed to the channel the command was called in.
 */

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

/**
 * Collect the user input.
 * @param  {Discord.Message}    message     
 * @param  {Number}             limit       Max amount of characters allowed.
 * @return {String}                         The collected user input.
 */
async function collector(message,limit, none=false) 
{
    return message.author.dmChannel.awaitMessages(response => response.author.id === message.author.id, 
        {
            max: 1,
            time: 60000,
            errors:['time'],
        })
        .then((collected) => {
            if (none === true && collected.first().content.toLowerCase() == "none")
            {
                return null;
            }
            else if (collected.first().content.length < limit)
            {
                //console.log(`I collected the message : ${collected.first().content}`); // Debugging line
                return collected.first().content;
            }

            else
            {
                message.author.send("Invalid input. Please try again. (Must be below 200 characters)");
                return collector(message,200);
            }

        })
        .catch(() => {
            message.author.send("No message collected after 1 minute. Cancelling plan.")
        })
}

/**
 * Collect the user input.
 * @param  {Discord.Message}        message          
 * @return {Discord.MessageEmbed}               The built up embed.
 */
async function embedBuilder(message)
{
    await message.author.send("Lets get to work!\nPlease enter the title of your event. (Must be shorter than 200 characters)");
    const title = await collector(message,200);
    message.author.send("Please enter a short description of your event. (Must be shorter than 2000 characters)\nEnter \"None\" if no. ");
    const description = await collector(message,2000,true);
    if (description != null) // Build embed with description
    {
        var eventEmbed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setTitle(title)
        .setAuthor(message.author.username)
        .setDescription(description)
        .addField("Participants", "None")
        .setImage();
    }
    else // Build embed without description
    {
        var eventEmbed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setTitle(title)
        .setAuthor(message.author.username)
        .addField("Participants", "None")
        .setImage();
    }
    message.author.send("Event successfully created!");
    

    var reactions = ['👍','👎','🤔' ]; // Valid reactions for filter
    var participants = []; // People attending the event
    // Sending the embed back and then . . .
    message.channel.send(eventEmbed)
    .then(embedMessage => {
        // Adding the reactions after the embed has been created
        embedMessage.react("👍");
        embedMessage.react("👎");
        embedMessage.react("🤔");
        //console.log(eventEmbed);
        // Reaction Collector to gather the users attending the event.
        const filter = (reaction, user) => {
            return !user.bot && reactions.includes(reaction.emoji.name);
        };
         
        rc = new Discord.ReactionCollector(embedMessage, filter);

        rc.on('collect', (reaction, user) => {
            //console.log(user + " reacted with a " + reaction);
            // console.log(reaction.emoji);
            if(reaction.emoji.name === "👍")
            {
                /// @TODO : IMPLEMENT LOOPING OVER THE ARRAY TO CHECK FOR USER. WILL TAKE USER OUT USING SPLICE
                let new_user = true;
                // Check if they are already on the list
                for (let participant in participants)
                {
                    if (user.id === participants[participant].id) // If user is found in the list, remove them and update.
                    {
                        console.log(participant);
                        console.log(participants);
                        participants.splice(user,1); // Remove user from the list
                        reaction.users.remove(user); // Reset reaction count back to 1
                        // Update the embed
                        eventEmbed.fields.find(f => f.name === "Participants").value = participants; // Updating participants
                        embedMessage.edit(eventEmbed);
                        new_user = false;
                        break;
                    }
                    else // continue to loop through the whole list
                    {
                        continue;
                    }
                }
                if(new_user) // If user not in list, add them and update.
                {
                    participants.push(user); // Add new user the participants list
                    console.log("PARTICIPANTS HERE");
                    console.log(participants); // Debugging
                    reaction.users.remove(user); // Reset reaction count back to 1
                    // Update the embed
                    eventEmbed.fields.find(f => f.name === "Participants").value = participants; // Updating participants
                    embedMessage.edit(eventEmbed);
                }
            }
        });
    })
    .catch(console.error);
}