const path = require('path');
const fs = require('fs');
const { Client } = require('discord.js');

const config = (() => {
    if (!fs.existsSync('config.json')) {
        console.error('Please copy the config-example.json file and rename it to config.json, filling out all required fields.');
        process.exit(1);
    }

    let json;
    try {
        json = JSON.parse(fs.readFileSync('config.json').toString());
    } catch (error) {
        console.error(`Failed to load/parse the config.json file: ${error}`);
        process.exit(1);
    }

    if (json.token && !/^[a-zA-Z0-9_\.\-]{59}$/.test(json.token)) {
        console.error('The token you entered is invalid! Please carefully re-enter the token and restart the bot.');
        process.exit(1);
    }

    return json;
})();

const commands = new Map();
const bot = new Client({ disableEveryone: true });

bot.config = config;
bot.commands = commands;

fs.readdirSync(path.resolve(__dirname, 'commands'))
    .filter(f => f.endsWith('.js'))
    .forEach(f => {
        console.log(`Loading command ${f}`);
        try {
            let command = require(`./commands/${f}`);
            if (!command.run) {
                throw 'Command is missing a run function!';
            } else if (!command.help || !command.help.name) {
                throw 'Command is missing a valid help object!';
            }
            commands.set(command.help.name, command);
        } catch (error) {
            console.error(`Failed to load command ${f}: ${error}`);
        }
    });

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag} (ID: ${bot.user.id})`)
});

bot.on('message', message => {
    if (message.author.bot || !message.guild) {
        return;
    }

    let content = message.content;
    if (!content.startsWith(config.prefix)) {
        return;
    }

    let split = content.substr(config.prefix.length).split(' ');
    let label = split[0];
    let args = split.slice(1);

    if (commands.get(label)) {
        commands.get(label).run(bot, message, args);
    }
});

config.token && bot.login(config.token);
