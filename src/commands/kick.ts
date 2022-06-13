import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  GuildMemberRoleManager,
  MessageEmbed,
  Permissions,
} from "discord.js";

const KickPermissionEmbed = new MessageEmbed()
  .setTitle("Insufficient permissions")
  .setDescription("You do not have enough permissions to kick someone")
  .setFooter({ text: "Bot made by TheSwedishMeatball!" });

const KickUnableEmbed = new MessageEmbed()
  .setTitle("Unable to kick")
  .setDescription("You are unable to kick this user")
  .setFooter({ text: "Bot made by TheSwedishMeatball!" });

const KickWrongEmbed = new MessageEmbed()
  .setTitle("Unable to kick")
  .setDescription(
    "This member has a higher or equal rank as you so u cannot kick them!"
  )
  .setFooter({ text: "Bot made by TheSwedishMeatball!" });

export default {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("you are able to kick users")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Who you want to kick")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason you want to kick for")
        .setRequired(true)
    ),
  async execute(interaction: CommandInteraction) {
    if (!interaction?.channel) throw new Error("NO CHANNEL");
    if (!interaction.memberPermissions?.has(Permissions.FLAGS.KICK_MEMBERS))
      return interaction.channel.send({ embeds: [KickPermissionEmbed] });

    const user = interaction.options.getUser("user");
    if (!interaction?.guild) throw new Error("NO GUILD");
    if (!user) throw new Error("NO USER");
    const member =
      interaction.guild.members.cache.get(user.id) ||
      (await interaction.guild.members.fetch(user.id));

    const reason = interaction.options.getString("reason");

    const { client } = interaction;
    if (!client?.user) throw new Error("Possibly Null");
    if (!member.bannable || member.user.id === client.user.id)
      return interaction.reply({ embeds: [KickUnableEmbed] });
    if (!interaction?.member) throw new Error("NO MEMBER!!!!");
    if (
      (interaction.member.roles as GuildMemberRoleManager).highest.position <=
      member.roles.highest.position
    )
      return interaction.reply({ embeds: [KickWrongEmbed] });

    const banned = new MessageEmbed()
      .setTitle("Kicked")
      .setDescription(
        `**${member.user.tag}** was kicked from the server for the reason **${reason}**`
      )
      .setColor("RED")
      .setTimestamp()
      .setFooter({ text: "Bot made by TheSwedishMeatball!" });

    const channel = client.channels.cache.get("985537873342234624");
    if (!channel) throw new Error("no channel");
    if (channel.type !== "GUILD_TEXT") throw new Error("Wrong channel type");
    channel.send({ embeds: [banned] });

    await member.user.send({ embeds: [banned] });
    if (!reason) throw new Error("No reason");
    member.kick(reason);

    return interaction.reply({ embeds: [banned] });
  },
};
