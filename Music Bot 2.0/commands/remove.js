const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    //declare remove command
    data: new SlashCommandBuilder().setName("remove").setDescription("Removes the song selected from the queue.").addNumberOption((option) =>
        option.setName("tracknumber").setDescription("The track to remove.").setMinValue(1).setRequired(true)),

    //execute command
    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId);

        //if no queue, do nothing
        if (!queue) {
            return await interaction.editReply("There are no songs in the queue.");
        }//end if

        //get track number entered
        const trackNum = interaction.options.getNumber("tracknumber");

        if (trackNum > queue.tracks.length) {
            return await interaction.editReply("Invalid track number");
        }//end if

        //get the song from the queue for message uses
        const song = queue.tracks[trackNum - 1];

        //remove sone from queue
        queue.remove(trackNum - 1);

        //send message that the song has been removed
        await interaction.editReply({
            embeds: [new MessageEmbed().setDescription(`${song.title} has been removed!`).setThumbnail(song.thumbnail)]
        });
    }//end run
}//end module.exports