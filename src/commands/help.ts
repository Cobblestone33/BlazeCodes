import { CommandInteraction } from "discord.js";

import { SlashCommandBuilder, channelMention } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";

const helpEmbed = new MessageEmbed()
  .setTitle("Help Page")
  .setDescription(
    `
	Here is the help page, Everything you need to know about BlazeCodes

	**About**

	BlazeCodes is a company where a team of Developers and Builders work together to create minecraft servers, Discord servers and discord bots for an amount of money. We are constantly looking for Developers(Java and JavaScript), Builders and Designers. If you want to become any of the things above then you can click on the title wich is

	**Website**

	http://77z.us:8080/

	`
  )
  .setColor("#FF0000")
  .setThumbnail("https://share.zyner.org/WihE9/lUMeCOGE05.png")
  .setTimestamp()
  .setFooter({ text: "Bot made by TheSwedishMeatball!" });
export default {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("helps you if you need help"),
  async execute(interaction: CommandInteraction) {
    if (!interaction?.channel?.send) throw new Error("No channel exist");
    await interaction.channel.send({ embeds: [helpEmbed] });
  },
};
