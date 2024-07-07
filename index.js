require("dotenv").config();
const {
  Client,
  IntentsBitField,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client
  .login(process.env.DISCORD_BOT_TOKEN)
  .then(() => {
    console.log("Successfully logged in!");
  })
  .catch((error) => {
    console.error("Failed to log in:", error);
  });

client.on("error", (error) => {
  console.error("An error occurred with the Discord client:", error);
});

client.on("ready", (c) => {
  console.log("Ready");
});

client.on("messageCreate", (message) => {
  if (message.author.bot) {
    return;
  }
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception thrown:", error);
});

//interactions

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "create-schedule") {
    await handleCreateScheduleCommand(interaction);
  }
});

async function handleCreateScheduleCommand(interaction) {
  const days = [
    {
      label: "Monday",
      value: "monday",
    },
    {
      label: "Tuesday",
      value: "tuesday",
    },
    {
      label: "Wednesday",
      value: "wednesday",
    },
    {
      label: "Thursday",
      value: "thursday",
    },
    {
      label: "Friday",
      value: "friday",
    },
    {
      label: "Saturday",
      value: "saturday",
    },
    {
      label: "Sunday",
      value: "sunday",
    },
  ];
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId(interaction.id)
    .setPlaceholder("Make a selection")
    .setMinValues(1)
    .setMaxValues(7)
    .addOptions(
      days.map((day) =>
        new StringSelectMenuOptionBuilder()
          .setLabel(day.label)
          .setValue(day.value)
      )
    );

  const actionRow = new ActionRowBuilder().addComponents(selectMenu);

  interaction.reply({
    components: [actionRow],
  });
}
