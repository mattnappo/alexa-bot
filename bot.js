var Discord = require("discord.io");
var logger = require("winston");
var auth = require("./auth.json");

logger.remove(logger.transports.Console);
logger.add(
    new logger.transports.Console,
    {
        colorize: true
    }
);


logger.level = "debug";

var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});

bot.on("ready", function (evt) {
    logger.info("Connected");
    logger.info("Logged in as: ");
    logger.info(bot.username + " – (" + bot.id + ")");
    console.log("ready!");
});

bot.on("message", function (user, userID, channelID, message, evt) {
    var lowerMsg = message.toLowerCase();
    if (lowerMsg.includes("alexa") || lowerMsg.includes()) {
        var key = "alexa";
        if (lowerMsg.includes("alexa ")) {
            key = "alexa ";
        } else if (lowerMsg.includes("alexa, ")) {
            key = "alexa, ";            
        }
        
        var song = lowerMsg.slice(lowerMsg.indexOf(key) + key.length);

        bot.sendMessage({
            to: channelID,
            message: "Now playing: " + song
        });
    }
});

