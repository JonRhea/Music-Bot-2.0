const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    //build info command
    data: new SlashCommandBuilder().setName("info").setDescription("Displays info about the current song."),

    //execute command
    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId);

        //if no song is playing, do nothing
        if (!queue) {
            return await interaction.editReply("There is no song playing!");
        }//end if

        //create progress bar
        let bar = queue.createProgressBar({
            queue: false,
            length: 19,
        });

        const song = queue.current;

        //send message with song info and progress bar
        await interaction.editReply({
            embeds: [new MessageEmbed().setThumbnail(song.thumbnail).setDescription(`Currently Playing [${song.title}](${song.url})\n\n` + bar)]
        });
    }//end run
}//end module exports