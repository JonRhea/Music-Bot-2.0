const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    //build queue command
    data: new SlashCommandBuilder().setName("queue").setDescription("Displays the current song queue.")
        .addNumberOption((option) => option.setName("page").setDescription("Page number of the queue").setMinValue(1)),

    //execute command
    run: async({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId);

        //if there is not queue or nothing is playing, do nothing
        if (!queue || !queue.playing) {
            return await interaction.editReply("There are no songs in the queue.");
        }//end if

        const totalPages = Math.ceil(queue.tracks.length / 10) || 1;
        const page = (interaction.options.getNumber("page") || 1) - 1;

        //if page doesn't exist, send error message
        if (page > totalPages) {
            return await interaction.editReply(`Invalid Page. There are only a total of ${totalPages} pages of songs`);
        }//end if

        const queueString = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i) => {
            return `**${page * 10 + i + 1}.** \`[${song.duration}]\` ${song.title} -- <@${song.requestedBy.id}>`
        }).join("\n");

        const currentSong = queue.current;

        await interaction.editReply({
            embeds: [new MessageEmbed().setDescription(`**Currently Playing**\n` +
                (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy.id}>` : "None") +
                `\n\n**Queue**\n${queueString}`).setFooter({
                    text: `Page ${page + 1} of ${totalPages}`
                })
                .setThumbnail(currentSong.setThumbnail)
            ]
        });//end interaction.editReply
    }//end run
}//end module.exports