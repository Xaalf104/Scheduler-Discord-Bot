require("dotenv").config();
const {
  Client,
  IntentsBitField,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ComponentType,
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

//custom functions date

function getRemainingDates() {
  const today = new Date();
  const remainingDates = []; //Will depend on which day of the week you decided to run the /create-schedule

  const currentDay = today.getDay(); //get the numerical equivalent of the current day

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // cycle through each days based on the current day
  for (let i = currentDay; i <= 6; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + (i - currentDay));
    remainingDates.push({ label: daysOfWeek[i], date: date });
  }
  console.log(currentDay);
  return remainingDates;
}

//get the first and last date depending on what day the command was executed.
function formatDateRange(dates) {
  const firstDate = dates[0].date.toLocaleDateString();
  const lastDate = dates[dates.length - 1].date.toLocaleDateString();
  return `${firstDate} - ${lastDate}`;
}

const dates = getRemainingDates();
const dateRange = formatDateRange(dates);

// interactions

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "create-schedule") {
    await handleCreateScheduleCommand(interaction);
  }
});

async function handleCreateScheduleCommand(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const remainingDays = getRemainingDates();

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId(interaction.id)
    .setPlaceholder("Select days of the week")
    .setMinValues(1)
    .setMaxValues(remainingDays.length)
    .addOptions(
      remainingDays.map((day) =>
        new StringSelectMenuOptionBuilder()
          .setLabel(day.label)
          .setValue(day.label)
      )
    );

  const actionRow = new ActionRowBuilder().addComponents(selectMenu);

  await interaction.editReply({
    content: `Select the days you want to schedule(${dateRange}):`,
    components: [actionRow],
  });

  const collector = interaction.channel.createMessageComponentCollector({
    componentType: ComponentType.StringSelect,
    filter: (i) =>
      i.user.id === interaction.user.id && i.customId === interaction.id,
    time: 60000,
  });

  collector.on("collect", (collectedInteraction) => {
    console.log(collectedInteraction.values);
    collectedInteraction.update({
      content: `You selected: \`${collectedInteraction.values.join("`, `")}\``,
      components: [],
    });
  });

  collector.on("end", (collected, reason) => {
    if (reason === "time") {
      interaction.followUp({
        content: "You did not select any days in time.",
        ephemeral: true,
      });
    }
  });
}
