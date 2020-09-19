module.exports = {
	name: 'ping',
    description: 'Ping!',
    args:false,
    cooldown: 1,
    // The command operations go here.
	execute(message, args) {
		message.channel.send('Pong!');
	},
};