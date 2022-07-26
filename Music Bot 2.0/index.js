const Discord = require("discord.js");
const dotenv = require('dotenv');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require("fs");
const { Player } = require("discord-player");

//get OAuth token for bot
dotenv.config();
const token = process.env.token;

const isLoad = process.argv[2] == 'load';

//set bot ID and server ID
const client_ID = "970347883733876776";
const guild_ID = "629790928579854336";

//create client
const client = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_VOICE_STATES"
    ]
});

//create slash commands collection
client.slashcommands = new Discord.Collection();

//set ydtl player to audio settings
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
});

//command array
const commands = [];

//location of slash commands
const slashFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

//add all commands to slashcommands collection
for (const file of slashFiles) {
    const slashcmd = require(`./commands/${file}`);
    client.slashcommands.set(slashcmd.data.name, slashcmd);
    //if loading commands, add it to commands array
    if (isLoad) {
        commands.push(slashcmd.data.toJSON());
    }//end if
}//end for

//if "load" is passed, add/confirm commands to the server
if (isLoad) {

    const rest = new REST({ version: "9" }).setToken(token);
    console.log("Deploying slash commands");
    rest.put(Routes.applicationGuildCommands(client_ID, guild_ID), { body: commands })
        .then(() => {
            console.log("Successfully loaded");
            process.exit(0);
        })
        //if it failed, print out error 
        .catch((err) => {
            if (err) {
                console.log("Failed");
                console.log(err);
                process.exit(1);
            }
        });//end catch
}//end if

//if "load" is not added, start the bot and listen for commands
else {
    client.on("ready", () => {
         var today = new Date();
         var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
         var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
         var datetime = date + ' ' + time;
         console.log(`Logged in as ${client.user.tag} - ${datetime}`);
    });
    //command interaction handler
    client.on("interactionCreate", (interaction) => {
        async function handleCommand() {
            if (!interaction.isCommand()) {
                return;
            }//end if
            const slashcmd = client.slashcommands.get(interaction.commandName);
            if (!slashcmd) {
                interaction.reply("Not a valid slash command");
            }//end if

            var today = new Date();
            //date gets hours wrong because of server location by +4 hours,
            //if hours < 4, add 20 do it. If not, substract 4.
            if (today.getHours() < 4) {
                today.setHours(today.getHours() + 20);
            }//end if
            else {
                today.setHours(today.getHours() - 4);
            }//end else
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var datetime = date + ' ' + time;
            console.log(`${interaction.user.username} used ${interaction.commandName} - ${datetime}`);
            await interaction.deferReply();
            await slashcmd.run({ client, interaction });
        }//end handleCommand
        handleCommand();
    });
    //turn bot online
    client.login(token);
}//end else