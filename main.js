const Discord = require('discord.js');
const config = require('./auth.json');

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(config.token);

client.on('message', message => {
    var lowerMsg = message.content.toLowerCase();
    if (lowerMsg.includes("alexa") && lowerMsg.includes("play")) {

        var key = "alexa";
        if (lowerMsg.includes("alexa, play ")) { key = "alexa, play " }
        if (lowerMsg.includes("alexa, play")) { key = "alexa, play" }
        if (lowerMsg.includes("alexa play ")) { key = "alexa play " }
        if (lowerMsg.includes("alexa play")) { key = "alexa play" }
        if (lowerMsg.includes("alexaplay ")) { key = "alexaplay " }
        if (lowerMsg.includes("alexaplay")) { key = "alexaplay" }
        if (lowerMsg.includes("alexa,play ")) { key = "alexa,play " }
        if (lowerMsg.includes("alexa,play")) { key = "alexa,play" }
    
        var song = lowerMsg.slice(lowerMsg.indexOf(key) + key.length).toLowerCase();
        if (!song.includes("despacito")) {
            message.channel.send(song + " is a bad song. Do you want to listen to something else (yes/no)? ");

            const collector = new Discord.MessageCollector(
                message.channel,
                m => m.author.id === message.author.id,
                { time: 10000 }
            );

            collector.on('collect', message => {
                if (message.content.toLowerCase() == "yes" || message.content.toLowerCase() == "y") {
                    message.channel.send("I don't care. I'm putting on some better music.")
                } else if (message.content.toLowerCase() == "no" || message.content.toLowerCase() == "n") {
                    message.channel.send("Good choice.")
                }
            });

        } else {
            message.channel("Ah! I see that you have some good taste!");
        }
        
        var msg_header = "Now playing: Despacito by God";
        message.channel.send(msg_header);
        
        var options = "───────────⚪────── ◄◄⠀▐▐ ⠀►►⠀ 3:08 / 4:42 ⠀ ───○ 🔊 ᴴᴰ ⚙️";
        message.channel.send(options);

    }
});