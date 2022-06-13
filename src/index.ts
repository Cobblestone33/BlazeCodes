import fs from "node:fs";
import path from "node:path";
import { Client, Collection, Intents, MessageEmbed } from "discord.js";
import config from "./config.json";

import deployCommands from "./deploy-commands";
import { EmbedBuilder } from "@discordjs/builders";
deployCommands();

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.default.data.name, command.default);
}

client.once("ready", () => {
  console.log("Ready!");
});
client.on("guildMemberAdd", (member) => {
  const channel = member.client.channels.cache.get("984122932324368427"); // Getting the channel
  if (channel) {
    // Checking if the channel exist
    const welcome = new MessageEmbed()
      .setTitle("Welcome")
      .setDescription(
        `**${member.user.tag}** Joined **BlazeCodes** discord, Welcome!!!!!`
      )
      .setColor("GREEN")
      .setTimestamp()
      .setFooter({ text: "Bot made by TheSwedishMeatball!" });
    const channel = member.client.channels.cache.get("984122932324368427");
    if (!channel) throw new Error("Channel not found");
    if (channel.type !== "GUILD_TEXT")
      throw new Error("Channel is not a text channel");
    channel.send({ embeds: [welcome] });
  }
});

client.on("messageCreate", (message) => {
  if (message.author.id !== "960596076572856381") {
    console.log("NOT MATCHED !EVENT EMITTED");

    return;
  }
  console.log("EVENT EMITTED");
  if (!message?.member) throw new Error("Member not found");
  client.emit("guildMemberAdd", message.member);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.login(config.token);
