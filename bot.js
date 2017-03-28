var TelegramBot = require('node-telegram-bot-api');
var SpotifyWebApi = require('spotify-web-api-node');
var reddit = require('redwrap');
var spotifyApi = new SpotifyWebApi();

var token = '332116990:AAH7a3XIEp2HPKxCwiB6vChnCeH8Ns9IfQc';
// Setup polling way
var bot = new TelegramBot(token, {polling: true});

// Matches /echo [whatever]
bot.onText(/\/artist (.+)/, function (msg, match) {
  var fromId = msg.from.id;
  var resp = match[1];
  var artist = resp.replace(' ', '+')
  var url = 'https://www.reddit.com/r/hiphopheads/search.json?q=%5BFRESH%5D+'+artist+'&restrict_sr=on&sort=new&t=all'
  console.log(url)
  // Get artist from spotify, send url

  spotifyApi.searchArtists(artist)
  .then(function(data) {

    // send url of spotify
    var uri = data.body.artists.items[0].external_urls.spotify
    // bot.sendMessage(fromId, uri);
    // bot.sendMessage(fromId, url);
  }, function(err) {
    console.error(err);
  });
  // bot.sendMessage(fromId, url);
});

// GET NEW TRACKS

bot.onText(/\/new/, function (msg) {
  var fromId = msg.from.id;
  // GET LAST 20 posts
  reddit.r('hiphopheads').new().limit(100).exe(function(err, data, res){

  data.data.children.forEach(function (entry){
    var patt = new RegExp(/fresh/i)
    var patto = new RegExp("\\[[^\\]]*]")
    var titolo = entry.data.title
    // console.log(typeof(titolo))
    // console.log(patt)
    // check if flagged Fresh
    if (patto.test(titolo)&&patt.test(titolo)){
      bot.sendMessage(fromId, entry.data.url);
      console.log(entry.data.title)
    }
  })

});

});


bot.onText(/\/start/, function (msg) {
  var chatId = msg.from.id;
  bot.sendMessage(chatId, 'Hello, welcome to your fresh drops!');
});


bot.onText(/\/help/, function(msg, match) {
  var fromId = msg.from.id;
  bot.sendMessage(fromId, "Type /artist Someone to get last track of him");
});
