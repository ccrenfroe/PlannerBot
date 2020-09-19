// Modules
const { prefix } = require('../config.json');

module.exports = {
	name: 'help-me',
    description: 'Explains to the user the use of PlannerBot',
	args:false,
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 1,
    // The command operations go here.
	execute(message, args) {
		const data = [];
		const { commands } = message.client;

		if (!args.length)
		{
			data.push('Hi! I\'m Plannerbot and my goal is to help you and your friends plan events in your server, whether its some time to play games together or some other activity.')
			data.push('Here\'s a list of all my commands:');
			data.push(commands.map(command => command.name).join(', '));
			data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);
			
			return message.author.send(data, { split: true }) // DM's the user the help info. Optional split parameter set to true to break up the message into multiple sends if it exceeds the character limit.
			.then(() => {
				if (message.channel.type === 'dm') return;
				message.reply('I\'ve sent you a DM with all my commands!');
			})
			.catch(error => { // Error check in case the user has DMs disabled or if the bot is blocked, etc.
				console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
				message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
			});

		}
		else
		{
			const name = args[0].toLowerCase();
			const command = commands.get(name) || commands.find(cm => cmd.aliases && cmd.aliases.includes(name));

			if (!command) { return message.reply('that\'s not a valid command!'); }

			data.push(`**Name:** ${command.name}`);

			if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
			if (command.description) data.push(`**Description:** ${command.description}`);
			if (command.usage) data.push(`**Usage:** \`${prefix}${command.name} ${command.usage}\``);

			data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

			message.channel.send(data, { split: true });
		}
	},
};