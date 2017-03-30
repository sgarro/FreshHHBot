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
bot.onText(/\/artist (.+) ([0-9]*)/, function (msg, match) {
  var fromId = msg.from.id;
  var resp = match[1];
  var artist = resp.replace(/\s/g, '+')
  var limit = parseInt(match[2]);
  var i = 0;
  var url = 'https://www.reddit.com/r/hiphopheads/search.json?q=%5BFRESH%5D+'+artist+'&restrict_sr=on&sort=new&t=all'

  request({
    url: url,
    json: true
    }, function (error, response, body) {

      if (!error && response.statusCode === 200) {
        console.log('success')
        var sended = []
        var results = body.data.children

        for (var t = 0; t < results.length; ++t){

          var patt = new RegExp(/fresh/i)
          var patto = new RegExp("^\\[[^\\]]*]")
          var titolo = results[t].data.title

            if (patto.test(titolo)&&patt.test(titolo)){

              if (sended.indexOf(results[t].data.url == -1)) {
                bot.sendMessage(fromId, results[t].data.url)
                sended.push(results[t].data.url)
                i=i+1
                      if(i == limit){
                        console.log('break')
                        break
                      }
                }}}}

    else{
      bot.sendMessage(fromId, 'sorry, the streets are busy, try again later')
      }

    })
  })



bot.onText(/\/new ([0-9]*)/, function (msg, match) {
  var fromId = msg.from.id;
  console.log('new')
  var limit = parseInt(match[1]);
  var sended = []
  var i = 0
  var url = 'https://www.reddit.com/r/hiphopheads/search.json?q=%5BFresh%5D&sort=relevance&restrict_sr=on&t=day&limit=1000'
  request({
    url: url,
    json: true
  }, function (error, response, body) {

    if (!error && response.statusCode === 200) {
      console.log('succes')

        var results = body.data.children
        for (var t = 0; t < results.length; ++t){

          var patt = new RegExp(/fresh/i)
          var patto = new RegExp("^\\[[^\\]]*]")
          var titolo = results[t].data.title

            if (patto.test(titolo)&&patt.test(titolo)){
              if (sended.indexOf(results[t].data.url == -1)) {
                bot.sendMessage(fromId, results[t].data.url)
                sended.push(results[t].data.url)
                i=i+1

              if(i == limit){
                console.log('break')
                break
                }

            }}}}

    else{bot.sendMessage(fromId, 'sorry, the streets are busy, try again later')}
  })
})



bot.onText(/\/start/, function (msg) {
  var chatId = msg.from.id;
  bot.sendMessage(chatId, 'Hello, welcome to your fresh drops!');
});


bot.onText(/\/help/, function(msg, match) {
  var fromId = msg.from.id;
  bot.sendMessage(fromId, "Type /new n to get n fresh tracks of the day {example /new 10}");
  bot.sendMessage(fromId, "Type /artist nameArtist n to get the last n tracks of that artist {example /artist kendrick lamar 2}");
});
