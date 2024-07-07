require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
});

client.login(process.env.DISCORD_BOT_TOKEN)
    .then(() => {
        console.log('Successfully logged in!');
    })
    .catch((error) => {
        console.error('Failed to log in:', error);
    });

client.on('error', (error) => {
    console.error('An error occurred with the Discord client:', error);
});

client.on('ready', (c) =>{
    console.log("Ready");
})

client.on('messageCreate', (message) => {
    if (message.author.bot){
        return;
    }
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception thrown:', error);
});

//interactions

client.on('interactionCreate', (interaction) => {
    if(!interaction.isChatInputCommand()) return;

})