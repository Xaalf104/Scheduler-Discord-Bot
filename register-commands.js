require('dotenv').config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const {ApplicationCommandOptionType} = require('discord.js')

const commands = [
    {
        name: 'create-schedule',
        description: 'Create a schedule for this week or today',
        options:[
            {
                name: 'week',
                description: 'Set a schedule for this week.',
                type: ApplicationCommandOptionType.Number,
            },{
                name: 'today',
                description: 'Set a schedule today.',
                type: ApplicationCommandOptionType.Number,
            }
        ]
    },
];

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
    try {
        console.log('Registering commands...');
        
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT, process.env.GUILD),
            { body: commands }
        );

        console.log('Commands registered successfully');
    } catch (error) {
        console.error(`An error occurred: ${error.message}`);
    }
})();
