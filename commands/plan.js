// Modules
const Discord = require('discord.js');
const unirest = require('unirest');

module.exports = {
	name: 'plan',
    description: 'Create an embed for a newly planned game event.\nEnter the full title of the game.\nNext enter a description.\nFinally, enter the time the event will take place.',
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
                return collected.first().content;
            }

            else
            {
                message.author.send("Invalid input. Please try again. (Must be below " + limit + " characters)");
                return collector(message,limit);
            }

        })
        .catch(() => {
            message.author.send("No message collected after 1 minute. Cancelling plan.")
        })
}

/**
 * Collect user input to build an embed and manage interactions with it.
 * @param  {Discord.Message}        message          
 * @return {Discord.MessageEmbed}               The built up embed.
 */
async function embedBuilder(message)
{
    await message.author.send("Lets get to work!\nPlease enter the title of your event. (Must be shorter than 200 characters)");
    let title = await collector(message,200);

    message.author.send("Please enter the name of the game. (Must be shorter than 200 characters)\nEnter \"None\" if this event does not have a game. ");
    let game_title = await collector(message,200,true);

    message.author.send("Please enter a short description of your event. (Must be shorter than 2000 characters)\nEnter \"None\" if no. ");
    let description = await collector(message,2000,true);
    if (description == null){ description = "";}
    console.log(description);
    message.author.send("Building embed . . .");
    if (game_title != null)
    {
        var game = await queryRAWGDatabase(game_title);
        if (game === "0")
        {
            message.author.send("Game could not be found.");
            var game_image = null;
        }
        else
        {
            var game_image = game.background_image;
        }
    }
    else // No game given.
    {
        game_title = "None";
        var game_image = null;
    }
    var eventEmbed = new Discord.MessageEmbed()
    .setColor('RANDOM')
    .setTitle(title)
    .setAuthor(message.author.username)
    .setDescription(description)
    .addField("Participants", "None")
    .addField("Not Attending", "None")
    .addField("Tentative", "None")
    .addField("Game Title",game_title)
    .setImage(game_image)
    .setTimestamp()

    message.author.send("Event successfully created!");
    
    // Dictionary of reactions
    var reactions = {'👍' : {"embed_field":"Participants","people":[]},
                     '👎' : {"embed_field":"Not Attending","people":[]},
                     '🤔' : {"embed_field":"Tentative","people":[]},
                    }; // Valid reactions for filter
    // Sending the embed back and then . . .
    message.channel.send(eventEmbed)
    .then(embedMessage => {
        // Adding the reactions after the embed has been created
        embedMessage.react("👍");
        embedMessage.react("👎");
        embedMessage.react("🤔");

        // Reaction Collector to gather the users attending the event.
        const filter = (reaction, user) => {
            return !user.bot && reactions[reaction.emoji.name];
        };
         
        rc = new Discord.ReactionCollector(embedMessage, filter);

        rc.on('collect', (reaction, user) => {
                        let emoji = reaction.emoji.name
                        let new_user = true;
                        // Check if they are already in the list
                        for (let person in reactions[emoji].people)
                        {
                            if (user.id === reactions[emoji].people[person].id) // If user is found in the list, remove them and update.
                            {
                                new_user = false;
                                reactions[emoji].people.splice(person,1); // Remove user from the list
                                reaction.users.remove(user); // Reset reaction count back to 1
                                // Updating corresponding embed field
                                if (reactions[emoji].people.length == 0) { eventEmbed.fields.find(f => f.name === reactions[emoji].embed_field).value = "None"; }
                                else { eventEmbed.fields.find(f => f.name === reactions[emoji].embed_field).value = reactions[emoji].people; }
                            }
                            else // continue to loop through the whole list
                            {
                                continue;
                            }
                        }
                        if(new_user) // If user not in list, add them and update.
                        {
                            // First check if they are in another list already.
                            for(let field in reactions)
                            {
                                console.log(reactions[field].people);
                                for(let person in reactions[field].people)
                                {
                                    if(user.id === reactions[field].people[person].id)
                                    {
                                        reactions[field].people.splice(person,1); // Remove user from the list
                                        // Updating corresponding embed field
                                        if (reactions[field].people.length == 0) { eventEmbed.fields.find(f => f.name === reactions[field].embed_field).value = "None"; }
                                        else { eventEmbed.fields.find(f => f.name === reactions[field].embed_field).value = reactions[field].people; }
                                    }
                                }
                            }
                            reactions[emoji].people.push(user); // Add new user the reactions list
                            reaction.users.remove(user); // Reset reaction count back to 1
                            // Update the embed
                            eventEmbed.fields.find(f => f.name === reactions[emoji].embed_field).value = reactions[emoji].people; // Updating corresponding embed field
                        }
                        embedMessage.edit(eventEmbed); // Update the embed
        });
    })
    .catch(console.error);
}

/**
 * Query the RAWG Database for a given game
 * @param  {String}    title          
 * @return {JSON}               The response from the database.
 */
function queryRAWGDatabase(title)
{
    title = title.split(' ').join('-');
    let req = unirest("GET", "https://rawg-video-games-database.p.rapidapi.com/games/" + title);
    return new Promise((resolve, reject) => {
        req.headers({
            "x-rapidapi-key": process.env.RAWG_GAME_DATABASE_KEY,
            "x-rapidapi-host": "rawg-video-games-database.p.rapidapi.com",
            "useQueryString": true
        });
        req.end(function (result) {
            if (result.error)
            {
                reject(result.error);
            };
            return resolve(result.body);
        });
    })
    .catch(err => {
        console.log(err);
        let notFound = "0";
        return notFound;
    });
}