import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  GuildMemberRoleManager,
  MessageEmbed,
  Permissions,
} from "discord.js";

const BanPermissionEmbed = new MessageEmbed()
  .setTitle("Insufficient permissions")
  .setDescription("You do not have enough permissions to ban someone")
  .setFooter({ text: "Bot made by TheSwedishMeatball!" });

const BanUnableEmbed = new MessageEmbed()
  .setTitle("Unable to ban")
  .setDescription("You are unable to ban this user")
  .setFooter({ text: "Bot made by TheSwedishMeatball!" });

const BanWrongEmbed = new MessageEmbed()
  .setTitle("Unable to ban")
  .setDescription(
    "This member has a higher or equal rank as you so u cannot ban them!"
  )
  .setFooter({ text: "Bot made by TheSwedishMeatball!" });

export default {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("you are able to ban users")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Who you want to ban")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason you want to ban for")
        .setRequired(true)
    ),
  async execute(interaction: CommandInteraction) {
    if (!interaction?.channel) throw new Error("No channel");
    if (!interaction.memberPermissions?.has(Permissions.FLAGS.BAN_MEMBERS))
      return interaction.channel.send({ embeds: [BanPermissionEmbed] });

    const user = interaction.options.getUser("user");
    if (!user) throw new Error("No user");
    if (!interaction?.guild) throw new Error("No guild");
    const member =
      interaction.guild.members.cache.get(user.id) ||
      (await interaction.guild.members.fetch(user.id));

    const reason = interaction.options.getString("reason");
    const { client } = interaction;
    if (!client?.user) throw new Error("No client");
    if (!member.bannable || member.user.id === client.user.id)
      return interaction.reply({ embeds: [BanUnableEmbed] });
    if (!interaction?.member) throw new Error("No member!");
    if (
      (interaction.member.roles as GuildMemberRoleManager).highest.position <=
      member.roles.highest.position
    )
      return interaction.reply({ embeds: [BanWrongEmbed] });

    const banned = new MessageEmbed()
      .setTitle("Banned")
      .setDescription(
        `**${member.user.tag}** was banned from the server for the reason **${reason}**`
      )
      .setColor("RED")
      .setTimestamp()
      .setFooter({ text: "Bot made by TheSwedishMeatball!" });

    await member.user.send({ embeds: [banned] });
    if (!reason) throw new Error("No reason");
    member.ban({ reason });

    interaction.reply({ embeds: [banned] });
    const logChannel = client.channels.cache.get("985537873342234624");
    if (!logChannel) throw new Error("No logChannel");
    if (logChannel.type !== "GUILD_TEXT")
      throw new Error("No logChannel SHUTUP");
    logChannel.send({ embeds: [banned] });
  },
};
