var TelegramBot = require('node-telegram-bot-api');
var SpotifyWebApi = require('spotify-web-api-node');
var request = require("request")
var reddit = require('redwrap');
var spotifyApi = new SpotifyWebApi();

var token = '332116990:AAH7a3XIEp2HPKxCwiB6vChnCeH8Ns9IfQc';
// Setup polling way
var bot = new TelegramBot(token, {polling: true});
console.log('connected')

// Matches /artist [whatever]
bot.onText(/\/artist (.+) ([0-9])/, function (msg, match) {
  var fromId = msg.from.id;
  var resp = match[1];
  var artist = resp.replace(/\s/g, '+')
  var limit = match[2];
  var i = 0;
  var url = 'https://www.reddit.com/r/hiphopheads/search.json?q=%5BFRESH%5D+'+artist+'&restrict_sr=on&sort=new&t=all'

  request({
    url: url,
    json: true
  }, function (error, response, body) {

    if (!error && response.statusCode === 200) {

        var results = body.data.children
        for (var t = 0; t < results.length; ++t){

          if(i == limit){
            console.log('break')
            break

          }
          var patt = new RegExp(/fresh/i)
          var patto = new RegExp("^\\[[^\\]]*]")
          var titolo = results[t].data.title
          // console.log(typeof(titolo))
          // console.log(patt)
          // check if flagged Fresh
          // console.log('LIMIT', limit)
          // while (i < 3){
            if (patto.test(titolo)&&patt.test(titolo)){
              console.log('TITOLO', titolo)
              bot.sendMessage(fromId, results[t].data.url)
              i=i+1

              // console.log(entry.data.title)
            }
          // }
        }




        // console.log(body.data.children[0].data.url)
        // bot.sendMessage(fromId, body.data.children[0].data.url); // Print the json response
    }
  })
})
  // Get artist from spotify, send url

//   spotifyApi.searchArtists(artist)
//   .then(function(data) {
//
//     // send url of spotify
//     var uri = data.body.artists.items[0].external_urls.spotify
//     // bot.sendMessage(fromId, uri);
//     // bot.sendMessage(fromId, url);
//   }, function(err) {
//     console.error(err);
//   });
//   // bot.sendMessage(fromId, url);
// });

// GET NEW TRACKS

bot.onText(/\/new/, function (msg) {
  var fromId = msg.from.id;
  var i = 0
  // GET LAST 20 posts
  reddit.r('hiphopheads').new().from('day').limit(200).exe(function(err, data, res){

      // var results = body.data.children
  data.data.children.forEach(function (entry){
    i=i+1
    console.log(i)
    var patt = new RegExp(/fresh/i)
    var patto = new RegExp("\\[[^\\]]*]")
    var titolo = entry.data.title
    // console.log(titolo)
    // console.log(typeof(titolo))
    // console.log(patt)
    // check if flagged Fresh
    if (patto.test(titolo)&&patt.test(titolo)){

      bot.sendMessage(fromId, entry.data.url);
      // console.log(entry.data.title)
    }
  })

});
// console.log(i)
});


bot.onText(/\/new/, function (msg) {
  var fromId = msg.from.id;
  var i = 0
  var url = 'https://www.reddit.com/r/hiphopheads/.json?search?q=%5BFresh%5D&sort=relevance&restrict_sr=on&t=day&limit=1000'
  request({
    url: url,
    json: true
  }, function (error, response, body) {

    if (!error && response.statusCode === 200) {
        // console.log(body[0].data.children[0].data.body_html)
          var results = body.data.children
          results.forEach(function (entry){
            i=i+1
          var patt = new RegExp(/fresh/i)
          var patto = new RegExp("\\[[^\\]]*]")
          var titolo = entry.data.title
          console.log(titolo)
          // console.log(typeof(titolo))
          // console.log(patt)
          // check if flagged Fresh
          if (patto.test(titolo)&&patt.test(titolo)){

            bot.sendMessage(fromId, entry.data.url);
            // console.log(entry.data.title)
          }
        })

      }
      console.log(i)
      });
    })



bot.onText(/\/start/, function (msg) {
  var chatId = msg.from.id;
  bot.sendMessage(chatId, 'Hello, welcome to your fresh drops!');
});


bot.onText(/\/help/, function(msg, match) {
  var fromId = msg.from.id;
  bot.sendMessage(fromId, "Type /new to get fresh tracks of the day");
  bot.sendMessage(fromId, "Type /artist nameArtist n to get the last n tracks of that artist {example /artist kendrick lamar 2}");
});
