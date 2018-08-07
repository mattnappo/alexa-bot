const Discord = require('discord.js');
var fs = require('fs');
const config = require('./auth.json');
var log_dir;
function setup_logs() {
    log_dir = "./logs";
    if (!fs.existsSync(log_dir)){
        fs.mkdirSync(log_dir);
    }
}
setup_logs();
function remove_log(log_path) {
    fs.unlink(log_path, (err) => {
        if (err) throw err;
        console.log(log_path + " deleted.");
    });
}
function clean_logs() {
    fs.readdirSync(log_dir).forEach(file => {
        remove_log(log_dir + "/" + file);
    });
    console.log("Logs cleaned");
}

const client = new Discord.Client();

var epoch = Math.round((new Date).getTime() / 100);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(config.token);

client.on('message', message => {
    var d = new Date();
    var hour = d.getHours();
    var minute = d.getMinutes();
    var second = d.getSeconds();
    var month = d.getMonth();
    var day = d.getDate();
    var year = d.getFullYear();

    var time = hour + ":" + minute + ":" + second + " @ " + month + "/" + day + "/" + year;

    var log = "user wrote '" + message.content + "' to channel general at " + time;
    var file = log_dir + "/" + epoch + ".log";
    fs.writeFile(file, log, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log(log + " logged in " + file);
    }); 
    var lowerMsg = message.content.toLowerCase();
    if (lowerMsg == "alexa") {
        message.channel.send("How may I help you? (hint: I can play music!)");
    }
    if (lowerMsg == "!clean") {
        clean_logs();
    }
    if (lowerMsg.includes("alexa") && lowerMsg.includes("play")) {
        var key = "";
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

            console.log(collector);

            collector.on('collect', message => {
                if (message.content.toLowerCase() == "yes" || message.content.toLowerCase() == "y") {
                    message.channel.send("I don't care. I'm putting on some better music.")
                } else if (message.content.toLowerCase() == "no" || message.content.toLowerCase() == "n") {
                    message.channel.send("Good choice.")
                }
            });

        } else {
            message.channel.send("Ah! I see that you have some good taste!");
        }
        
        var msg_header = "Now playing: Despacito by God";
        message.channel.send(msg_header);

        var options = "───────────⚪────── ◄◄⠀▐▐ ⠀►►⠀ 3:08 / 4:42 ⠀ ───○ 🔊 ᴴᴰ ⚙️";
        message.channel.send(options);

    }
});