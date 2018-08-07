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
        if (lowerMsg.includes("alexa ")) {
            key = "alexa ";
        } else if (lowerMsg.includes("alexa, ")) {
            key = "alexa, ";            
        }
        
        var song = lowerMsg.slice(lowerMsg.indexOf(key) + key.length);

        var msg_header = "Now playing: " + song;
        message.channel.send(msg_header);
    }
});