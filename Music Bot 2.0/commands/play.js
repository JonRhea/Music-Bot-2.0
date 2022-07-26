const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
    //build play command
    data: new SlashCommandBuilder().setName("play").setDescription("Plays songs from Youtube.").addStringOption((option) =>
        option.setName("searchterms").setDescription("The search keywords.").setRequired(true)),

    //excecute command
    run: async ({ client, interaction }) => {
        //do not play is user is not in voice channel
        if (!interaction.member.voice.channel) {
            return interaction.editReply("You need to be in a voice channel to use this command.");
        }//end if

        const queue = await client.player.createQueue(interaction.guild)
        //if there is no song playing, await the connection to the voice channel
        if (!queue.connection) {
            await queue.connect(interaction.member.voice.channel);
        }//end if

        let embed = new MessageEmbed();
        let url = interaction.options.getString("searchterms");

        //search for YouTube video with the search terms (url) provided
        const result = await client.player.search(url, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO
        });

        //if nothing was found, send no results
        if (result.tracks.length === 0) {
            return interaction.editReply("No results.");
        }//end if

        //get first song result and add it to the queue
        const song = result.tracks[0];
        await queue.addTrack(song);
        embed
            .setDescription(`**[${song.title}](${song.url})** has been added to the Queue.`)
            .setThumbnail(song.thumbnail)
            .setFooter({ text: `Duration: ${song.duration}` })

        //if queue is not playing, play it. Bot will wait until current song is finished to play 
        if (!queue.playing) {
            await queue.play()
        }//end if
        await interaction.editReply({
            embeds: [embed]
        })
    }//end run
}//end module.exports