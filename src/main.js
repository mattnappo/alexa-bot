const Discord = require("discord.js");
const path = require("path");
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
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }
const client = new Discord.Client();
var epoch = Math.round((new Date).getTime() / 100);
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
function get_repo_name(str) {
    var username = str.split('git clone https://github.com/')[1];
    return username.split("/")[1];
}
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
    if (message.content.includes("cortana")) {
        message.channel.send("Shhhh! No need to yell! My advanced microphones can hear you from anywhere in the room!")
    }
    if (lowerMsg == "cortana") {
        message.channel.send("How may I help you?");
        message.channel.send("-- I can play music!");
        message.channel.send("-- I know smart stuff like git clone!");
    }
    if (lowerMsg == "!clean") {
        clean_logs();
    }
    if (lowerMsg.includes("cortana play despacito") || lowerMsg.includes("cortana, play despacito")) {
        message.channel.send("Now playing: DESPACITOOOO");
        var voiceChannel = client.channels.find("name", "cortana");
        console.log("Voicechanel: " + voiceChannel);

        voiceChannel.join().then(connection => {
            var filename = path.join(__dirname, "./media/despacito.mp3");
            console.log(filename);
            const dispatcher = connection.playStream(filename);
            console.log("\n\n\n\n\n");
        }).catch(err => console.log(err));
        var options = "───────────⚪────── ◄◄⠀▐▐ ⠀►►⠀ 3:08 / 4:42 ⠀ ───○ 🔊 ᴴᴰ ⚙️";
        message.channel.send(options);
    } else if (lowerMsg.includes("cortana") && lowerMsg.includes("play")) {
        var key = "";
        if (lowerMsg.includes("cortana, play ")) { key = "cortana, play " }
        if (lowerMsg.includes("cortana, play")) { key = "cortana, play" }
        if (lowerMsg.includes("cortana play ")) { key = "cortana play " }
        if (lowerMsg.includes("cortana play")) { key = "cortana play" }
        if (lowerMsg.includes("cortanaplay ")) { key = "cortanaplay " }
        if (lowerMsg.includes("cortanaplay")) { key = "cortanaplay" }
        if (lowerMsg.includes("cortana,play ")) { key = "cortana,play " }
        if (lowerMsg.includes("cortana,play")) { key = "cortana,play" }
        var song = lowerMsg.slice(lowerMsg.indexOf(key) + key.length).toLowerCase();
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
        var voiceChannel = client.channels.find("name", "cortana");
        console.log("Voicechanel: " + voiceChannel);
        voiceChannel.join().then(connection => {
            var filename = path.join(__dirname, "./media/" + songs[play_song]);
            console.log(filename);
            const dispatcher = connection.playStream(filename);
        }).catch(err => console.log(err));
        var options = "───────────⚪────── ◄◄⠀▐▐ ⠀►►⠀ 3:08 / 4:42 ⠀ ───○ 🔊 ᴴᴰ ⚙️";
        message.channel.send(options);
    } else if (lowerMsg.includes("git clone https://github.com/")) {
        message.channel.send("Cloning into '" + get_repo_name(lowerMsg));
        message.channel.send("remote: Counting objects: 2228, done.")
        message.channel.send("remote: Compressing objects: 74% (42/42), done.")
        message.channel.send("remote: Total 2228 (delta 11), reused 23 (delta 6), pack-reused 2177")
        sleep(450);
        message.channel.send("Receiving objects: 93% (2228/2228), 52.13 MiB | 31.33 MiB/s, done.")
        message.channel.send("Resolving deltas: 100% (1113/1113), done.")
    } else if (lowerMsg == "git") {
        message.channel.send("usage: git [--version] [--help] [-C <path>] [-c name=value]");
        message.channel.send("    [--exec-path[=<path>]] [--html-path] [--man-path] [--info-path]");
        message.channel.send("    [-p | --paginate | --no-pager] [--no-replace-objects] [--bare]");
        message.channel.send("    [--git-dir=<path>] [--work-tree=<path>] [--namespace=<name>]");
        message.channel.send("    <command> [<args>]");
    }
});
