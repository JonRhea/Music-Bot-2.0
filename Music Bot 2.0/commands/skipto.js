const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    //declare skipto command
    data: new SlashCommandBuilder().setName("skipto").setDescription("Skips to a certain track #.").addNumberOption((option) =>
        option.setName("tracknumber").setDescription("The track to skip to.").setMinValue(1).setRequired(true)),

    //execute command
    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId);

        //if no queue, do nothing
        if (!queue) {
            return await interaction.editReply("There are no songs in the queue.");
        }//end if

        const trackNum = interaction.options.getNumber("tracknumber");

        if (trackNum > queue.tracks.length) {
            return await interaction.editReply("Invalid track number");
        }//end if
        queue.skipTo(trackNum - 1);

        await interaction.editReply(`Skipped ahead to track number ${trackNum}`);
    }//end run
}//end module.exports