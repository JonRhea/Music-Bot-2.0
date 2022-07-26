const { SlashCommandBuilder } = require("@discordjs/builders");
const { InteractionType } = require("discord-api-types/v9");

module.exports = {
    //build quit command
    data: new SlashCommandBuilder().setName("quit").setDescription("Stops the bot and leaves the server"),

    //execute command
    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId);

        //if there is no song playing, don't do anything
        if (!queue) {
            return await interaction.editReply("There are no songs in the queue.");
        }//end if
        //destory song queue
        queue.destroy();
        await interaction.editReply("Bye!");
    }//end run

}//end module