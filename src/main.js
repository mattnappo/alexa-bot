const Discord = require("discord.js");
var fs = require('fs');
const auth = require("./auth.json");
const songs = require("./songs.json");
var log_dir;

var key = "";
var size = Object.keys(auth).length;
var i;
for (i = 0; i < size; i++) {
  key = key + auth[i];
}
console.log(key);

function setup_logs() {
    log_dir = "./src/logs";
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

client.login(key);

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
            message.channel.send("I couldn't care less about " + song + ". I'm putting on some better music.")

        } else {
            message.channel.send("Ah! I see that you have some good taste!");
        }
        var song_index = Math.floor(Math.random() * 3);
        var play_song = "";
        if (song_index == 0) {
            play_song = "Reeeee.mp3";
        } else if (song_index == 1) {
            play_song = "Despacito - Luis Fonsi";
        } else {
            play_song = "Never Gonna Give You Up - Rick Astley";
        }

        message.channel.send("Now playing: " + play_song);
        var voiceChannel = client.channels.find("name", "Alexa");
        console.log("Voicechanel: " + voiceChannel);

        voiceChannel.join().then(connection => {
            var filename = "./media/" + songs[play_song];
            console.log(filename);
            console.log("\n\n\nREEEEEE\n\n\n");
            const dispatcher = connection.playStream(filename);
            // dispatcher.on("end", function() {
            //     voiceChannel.leave();
            // });
            console.log("\n\n\nREEEEEE\n\n\n");
        }).catch(err => console.log(err));

        var options = "───────────⚪────── ◄◄⠀▐▐ ⠀►►⠀ 3:08 / 4:42 ⠀ ───○ 🔊 ᴴᴰ ⚙️";
        message.channel.send(options);
    }
});
