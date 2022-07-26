const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    //build skip command
    data: new SlashCommandBuilder().setName("skip").setDescription("Skips the current song"),

    //execute command
    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId);

        //if queue is empty
        if (!queue) {
            return await interaction.editReply("There are no songs in the queue.");
        }//end if

        //get current song for message purposes
        const currentSong = queue.current;

        //if there is a next song, get next song
        if (queue.tracks.length > 0) {
            const nextSong = queue.tracks[0];


            //skip to next song in queue and diplay message that the next song is playing
            queue.skip();

            await interaction.editReply({
                embeds: [new MessageEmbed().setDescription(`${currentSong.title} has been skipped!\nNow playing ${nextSong.title}`).setThumbnail(nextSong.thumbnail)]
            });
        }//end if
        //if there is no next song, do this instead
        else {
            //skip to next song in queue and diplay message that the song has been skipped
            queue.skip();

            await interaction.editReply({
                embeds: [new MessageEmbed().setDescription(`${currentSong.title} has been skipped!`).setThumbnail(currentSong.thumbnail)]
            });
        }//end else
    }//end run
}//end module.exports