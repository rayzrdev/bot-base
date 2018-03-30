// Built-in libraries from Node.JS
const path = require('path');
const fs = require('fs');
// Only import the Client class from Discord.js
const { Client } = require('discord.js');

// Super fancy config loader/validator
const config = (() => {
    // Make sure the config file exists
    if (!fs.existsSync('config.json')) {
        // They must not have copied the config-example.json file yet,
        // so just exit
        console.error('Please copy the config-example.json file and rename it to config.json, filling out all required fields.');
        process.exit(1);
    }

    let json;
    try {
        // Parse the JSON file
        json = JSON.parse(fs.readFileSync('config.json').toString());
    } catch (error) {
        // Catch any parser errors or read errors and exit
        console.error(`Failed to load/parse the config.json file: ${error}`);
        process.exit(1);
    }

    // If there isn't a token, the bot won't start, but if there is then
    // we want to make sure it's a valid bot token
    if (json.token && !/^[a-zA-Z0-9_\.\-]{59}$/.test(json.token)) {
        console.error('The token you entered is invalid! Please carefully re-enter the token and restart the bot.');
        process.exit(1);
    }

    return json;
})();

// Store the commands in a Map (slightly better than a raw object)
const commands = new Map();
// Create the client
const bot = new Client({ disableEveryone: true });

// Store the config and commands on the bot variable so as to make them
// easily accessible in commands and other files
bot.config = config;
bot.commands = commands;

// Read every file in ./commands and filter out the non-JS files
fs.readdirSync(path.resolve(__dirname, 'commands'))
    .filter(f => f.endsWith('.js'))
    .forEach(f => {
        // Attempt to load the file
        console.log(`Loading command ${f}`);
        try {
            // Require the raw file
            let command = require(`./commands/${f}`);
            // Validate that there's a run function and a valid help object
            if (typeof command.run !== 'function') {
                throw 'Command is missing a run function!';
            } else if (!command.help || !command.help.name) {
                throw 'Command is missing a valid help object!';
            }
            // Store the command in the map based on its name
            commands.set(command.help.name, command);
        } catch (error) {
            // Log any errors from the validator or from requiring the file
            console.error(`Failed to load command ${f}: ${error}`);
        }
    });

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag} (ID: ${bot.user.id})`)
    bot.generateInvite([
        'SEND_MESSAGES',
        'MANAGE_MESSAGES',
        // Here are some other common permissions you might want to include:
        // (Complete list can be found at https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS)
        //
        // *** General moderation permissions:
        // 'KICK_MEMBERS',
        // 'BAN_MEMBERS',
        // *** Guild settings permissions:
        // 'MANAGE_CHANNELS',
        // 'MANAGE_GUILD',
        // 'MANAGE_NICKNAMES',
        // 'MANAGE_ROLES',
        // *** Voice permissions:
        // 'CONNECT',
        // 'SPEAK',
        // *** Voice moderation permissions:
        // 'MOVE_MEMBERS',
        // 'MUTE_MEMBERS',
        // 'DEAFEN_MEMBERS',
    ]).then(invite => {
        // After generating the invite, log it to the console
        console.log(`Click here to invite the bot to your guild:\n${invite}`);
    });
});

bot.on('message', message => {
    // Ignore messages from bots and from DMs (non-guild channels)
    if (message.author.bot || !message.guild) {
        return;
    }

    // Just a shorthand variable
    let { content } = message;
    // Ignore any messages that don't start with the configurable prefix
    if (!content.startsWith(config.prefix)) {
        return;
    }

    // Take all the text after the prefix and split it into an array,
    // splitting at every space (so 'hello world' becomes ['hello', 'world'])
    let split = content.substr(config.prefix.length).split(' ');
    // Get the command label (which is the first word after the prefix)
    let label = split[0];
    // Get the rest of the words after the prefix
    let args = split.slice(1);

    // If there's a command with that given label...
    if (commands.get(label)) {
        // ... get the command with that label and run it with the bot, the
        // message variable, and the args as parameters
        commands.get(label).run(bot, message, args);
    }
});

// Only run the bot if the token was provided
config.token && bot.login(config.token);
