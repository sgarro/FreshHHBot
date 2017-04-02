var TelegramBot = require('node-telegram-bot-api');
var SpotifyWebApi = require('spotify-web-api-node');
var RedditStream = require('reddit-stream');
var mongoose = require('mongoose');
mongoose.connect('mongodb://Sgarro:telegrampwd@ds147520.mlab.com:47520/telegram-bot');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to Mongo')
});
var chatSchema = mongoose.Schema({
message_id: Number,
from: { id: Number, first_name: String, last_name: String },
date: Number,
text: String,

});

comment_stream = new RedditStream('posts', 'hiphopheads', 'telegram-bot')


comment_stream.start()
comment_stream.on('new', function(comments){
  console.log('found', comments.length)
})
comment_stream.on('new', function(comments){
  console.log('comment_stream')
  console.log('found', comments[0].data.title)
  for (var t = 0; t < comments.length; ++t){
    var patt = new RegExp(/fresh/i)
    var patto = new RegExp("^\\[[^\\]]*]")
    var titolo = comments[t].data.title
    console.log('TITOLO', titolo)
  //   // try {
  //   // sended.push(comments[t].data.secure_media.oembed.title)
  //   // }
  //   // catch(err){
  //   //   console.log(err)
  //   // }
  //
      if (patto.test(titolo)&&patt.test(titolo)){
      if(1){
        console.log('TITOLO', titolo)
  //
        // if (sended.indexOf(comments[t].data.url == -1)) {
          // var simpleQuery = {
          // reply_markup: JSON.stringify({
          //   inline_keyboard: [
          //     [{ text: 'Gimme the topic', url: 'http://reddit.com'+comments[t].data.permalink }],
          //
          //   ]
          // })}
          // };
          // bot.sendMessage(47391615, comments[t].data.url, simpleQuery)
          // bot.sendMessage(msg.from.id, 'Gimme the topic', );
          // sended.push(comments[t].data.url)


            }
          }
        }
})



const Tgfancy = require("tgfancy");
var token = '332116990:AAH7a3XIEp2HPKxCwiB6vChnCeH8Ns9IfQc';
const bot = new Tgfancy(token, {
    polling: true,
    tgfancy: {
        orderedSending: true, // 'false' to disable!
    },

});
var request = require("request")
var reddit = require('redwrap');
var spotifyApi = new SpotifyWebApi();

// Setup polling way
// var bot = new TelegramBot(token, {polling: true});
console.log('connected')

// Options for links
var options = {
reply_markup: JSON.stringify({
  inline_keyboard: [
    [{ text: 'Youtube', callback_data: '0' }],
    [{ text: 'iTunes', callback_data: '1' }],
    [{ text: 'Spotify', callback_data: '2' }],
    [{ text: 'Apple Music', callback_data: '3' }],
  ]
})
};

// Inline Query Yes or No
var simpleQuery = {
reply_markup: JSON.stringify({
  inline_keyboard: [
    [{ text: 'yes', callback_data: 'true' }],
    [{ text: 'no', callback_data: 'false' }],
  ]
})
};




// Matches /artist [whatever]
bot.onText(/\/artist (.+) ([0-9]*)/, function (msg, match) {
  var mChat = mongoose.model('chat', chatSchema);
  var chat =new mChat ({
    message_id : msg.message_id,
    from: msg.from,
    date: msg.date,
    text: msg.text
  })
  console.log(chat)
  mongoose.model('chat').create(chat, function (err, client) {
             if (err) {
                 console.log(err)
             } else { console.log('saved')}})
  var fromId = msg.from.id;
  var resp = match[1];
  var artist = resp.replace(/\s/g, '+')
  var limit = parseInt(match[2]);
  var i = 0;
  var url = 'https://www.reddit.com/r/hiphopheads/search.json?q=%5BFRESH%5D+'+artist+'&restrict_sr=on&sort=new&t=all'
  bot.sendMessage(fromId, 'fetching last tracks')
  request({
    url: url,
    json: true
    }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        console.log('succes')
        var sended = []
        var results = body.data.children
        for (var t = 0; t < results.length; ++t){
          var patt = new RegExp(/fresh/i)
          var patto = new RegExp("^\\[[^\\]]*]")
          var titolo = results[t].data.title
          try {
          sended.push(results[t].data.secure_media.oembed.title)
          }
          catch(err){
            console.log(err)
          }

            if (patto.test(titolo)&&patt.test(titolo)){
              console.log('TITOLO', titolo)

              if (sended.indexOf(results[t].data.url == -1)) {
                var simpleQuery = {
                reply_markup: JSON.stringify({
                  inline_keyboard: [
                    [{ text: 'Gimme the topic', url: 'http://reddit.com'+results[t].data.permalink }],

                  ]
                })
                };
                bot.sendMessage(fromId, results[t].data.url, simpleQuery)
                // bot.sendMessage(msg.from.id, 'Gimme the topic', );
                sended.push(results[t].data.url)
                i=i+1
                    if(i == limit){
                      console.log('break')
                      break
                    }
                  }
                }
              }
            }
    else{
      bot.sendMessage(fromId, 'sorry, the streets are busy, try again later')
      console.log(body)
      }
    })
  })



bot.onText(/\/new ([0-9]*)/, function (msg, match) {
  var mChat = mongoose.model('chat', chatSchema);
  var chat =new mChat ({
    message_id : msg.message_id,
    from: msg.from,
    date: msg.date,
    text: msg.text
  })
  console.log(chat)
  mongoose.model('chat').create(chat, function (err, client) {
             if (err) {
                 console.log(err)
             } else { console.log('saved')}})
  var fromId = msg.from.id;
  console.log('new')
  var limit = parseInt(match[1]);
  // console.log(typeof(parseInt(limit)))
  var i = 0
  var url = 'https://www.reddit.com/r/hiphopheads/search.json?q=%5BFresh%5D&sort=top&restrict_sr=on&t=day&limit=1000'
  request({
    url: url,
    json: true
  }, function (error, response, body) {

    if (!error && response.statusCode === 200) {
      console.log('succes')
        var sended = []
        var results = body.data.children
        for (var t = 0; t < results.length; ++t){

          var patt = new RegExp(/fresh/i)
          var patto = new RegExp("^\\[[^\\]]*]")
          var titolo = results[t].data.title

            if (patto.test(titolo)&&patt.test(titolo)){
              if (sended.indexOf(results[t].data.url == -1)) {
                var simpleQuery = {
                reply_markup: JSON.stringify({
                  inline_keyboard: [
                    [{ text: 'Gimme the topic', url: 'http://reddit.com'+results[t].data.permalink }],]
                })
                };
                bot.sendMessage(fromId, results[t].data.url, simpleQuery)
                sended.push(results[t].data.url)
                i=i+1

                  if(i == limit){
                    console.log('break')
                    break

                  }
            }}}}
    else{
      bot.sendMessage(fromId, 'sorry, the streets are busy, try again later')
    }})})



bot.onText(/\/start/, function (msg) {
  var chatId = msg.id;
  console.log(msg)
  bot.sendMessage(chatId, 'Hello, welcome to your fresh drops!');
  var mChat = mongoose.model('chat', chatSchema);
  var chat =new mChat ({
    message_id : msg.message_id,
    from: msg.from,
    date: msg.date,
    text: msg.text
  })
  console.log(chat)
  mongoose.model('chat').create(chat, function (err, client) {
             if (err) {
                 console.log(err)
             } else { console.log('saved')}})
});



bot.onText(/\/inline/, function (msg) {
  var chatId = msg.from.id;
  var link = ['youtube', 'itunes', 'spotify']

  bot.sendMessage(msg.from.id, 'Wich link do you want?', simpleQuery);


});

bot.onText(/\/chat/, function (msg) {
  var mChat = mongoose.model('chat', chatSchema);
  var chat =new mChat ({
    message_id : msg.message_id,
    from: msg.from,
    date: msg.date,
    text: msg.text
  })
  console.log(chat)
  mongoose.model('chat').create(chat, function (err, client) {
             if (err) {
                 console.log(err)
             } else { console.log('saved')}})
});

bot.on("callback_query", function onCallbackQuery(callbackQuery) {
  if (callbackQuery.data != 'false'){
   console.log(callbackQuery.from)
   bot.sendMessage(callbackQuery.from.id, callbackQuery.data);
  //  edit messagge inline
  //  bot.editMessageText('newText', {message_id: callbackQuery.message.message_id, chat_id: callbackQuery.message.chat.id})


  }
  console.log(callbackQuery.message.text)
    // bot.sendMessage(msg.from.id, link[callbackQuery.data]);
});



bot.onText(/\/help/, function(msg, match) {
  var mChat = mongoose.model('chat', chatSchema);
  var chat =new mChat ({
    message_id : msg.message_id,
    from: msg.from,
    date: msg.date,
    text: msg.text
  })
  console.log(chat)
  mongoose.model('chat').create(chat, function (err, client) {
             if (err) {
                 console.log(err)
             } else { console.log('saved')}})
  var fromId = msg.from.id;
  bot.sendMessage(fromId, "Type /new n to get n fresh tracks of the day {example /new 10}");
  bot.sendMessage(fromId, "Type /artist nameArtist n to get the last n tracks of that artist {example /artist kendrick lamar 2}");
});
