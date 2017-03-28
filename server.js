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

  reddit.r('hiphopheads').new().from('day').exe(function(err, data, res){

    // get link of media
    // data.data.children[1].data.media.oembed.url


  data.data.children.forEach(function (entry){
    var patt = /fresh/i
    var title = entry.data.title
    if (title.test(patt)){
      var media = entry.data.media.oembed.url
      bot.sendMessage(fromId, media);
    }
  })

  // var patt = /fresh/i
  // var title = data.data.children[1].data.title
  // if (title.test(patt)){
  //   var media = data.data.children[1].data.media.oembed.url
  //   bot.sendMessage(fromId, media);
  // }
  // console.log('CHILDREN', data.data.children[1].data.title);

  // var propValue;
  // for(var propName in data.data) {
  //   propValue = data[propName]

    // console.log(propName);
    // console.log('SECURE', data.data.children[0].secure_media_embed)
// }


   //outputs object representing first page of WTF subreddit
  });


  var url = 'https://www.reddit.com/r/hiphopheads/search?q=%5BFRESH%5D+'+artist+'&restrict_sr=on&sort=new&t=all'

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
