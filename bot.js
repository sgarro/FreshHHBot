// heroku ps:scale web=0

var TelegramBot = require('node-telegram-bot-api');
var SpotifyWebApi = require('spotify-web-api-node');
var RedditStream = require('reddit-stream')
var mongoose = require('mongoose');
var request = require("request")
var reddit = require('redwrap');
var spotifyApi = new SpotifyWebApi();

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
}


mongoose.connect('mongodb://Sgarro:telegrampwd@ds147520.mlab.com:47520/telegram-bot');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to Mongo')
});

const Tgfancy = require("tgfancy");
var token = '332116990:AAH7a3XIEp2HPKxCwiB6vChnCeH8Ns9IfQc';
const bot = new Tgfancy(token, {
    polling: true,
    tgfancy: {
        orderedSending: true, // 'false' to disable!
    },

});

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




var chatSchema = mongoose.Schema({
message_id: Number,
from: { id: Number, first_name: String, last_name: String },
date: Number,
text: String,

});

var subscribeSchema = mongoose.Schema({
  artist: String,
  message_id: [Number],
  sended: [String]

})

var mSubscribe = mongoose.model('subscribe', subscribeSchema);

var toTitleCase = function (str){return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});}


bot.onText(/\/start/, function (msg) {
  console.log(msg)

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
var text = `<i>/new n</i> - get n fresh tracks of the day
<strong>{example /new 10}</strong>

<i>/artist nameArtist n</i> - get the last n tracks of that artist
<strong>{example /artist kendrick lamar 2}</strong>

<i>/subscribe nameArtist</i> - get new shit of that artist as soon as it gets on the streets. For this, notifications are off
<strong>{example /subscribe kendrick lamar}</strong>

<i>/unsubscribe nameArtist</i> - remove you from a subscription. You will no longer get updates from that artist
<strong>{example /unsubscribe kendrick lamar}</strong>`

var fromId = msg.from.id;
// bot.sendMessage(fromId, text, {parse_mode: "Markdown"});
bot.sendMessage(fromId, text, {parse_mode: "Html"});
});

// help
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
  var text = `<i>/new n</i> - get n fresh tracks of the day
  <strong>{example /new 10}</strong>

  <i>/artist nameArtist n</i> - get the last n tracks of that artist
  <strong>{example /artist kendrick lamar 2}</strong>

  <i>/subscribe nameArtist</i> - get new shit of that artist as soon as it gets on the streets. For this, notifications are off
  <strong>{example /subscribe kendrick lamar}</strong>

  <i>/unsubscribe nameArtist</i> - remove you from a subscription. You will no longer get updates from that artist
  <strong>{example /unsubscribe kendrick lamar}</strong>`
  bot.sendMessage(fromId, text, {parse_mode: "Html"});
});


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

              if (!sended.contains(results[t].data.url)) {
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


// get new shit
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
  if (parseInt(match[1])){
    var limit = parseInt(match[1]);
  }
  else{
  var limit = 10;
  }
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


    // subscribe to live posts
    bot.onText(/\/subscribe (.+)/, function(msg, match){
      console.log(toTitleCase(match[1]))
      var text = ''
      mSubscribe.findOneAndUpdate({ artist: toTitleCase(match[1]) }, { $addToSet: {'message_id': msg.from.id} }, {upsert: true}, function(err, find) {
      if (err) throw err;
      else{
        var text = "All right, i will notify you of new shit from "+toTitleCase(match[1])
        bot.sendMessage(msg.from.id, text)
      }})});

    // unsubscribe from live posts
    bot.onText(/\/unsubscribe (.+)/, function(msg, match){
      console.log(toTitleCase(match[1]))
      mSubscribe.findOneAndUpdate({ artist: toTitleCase(match[1]) }, { $pop: {'message_id': msg.from.id} }, function(err, find) {
      if (err) throw err;
      var text = "All right, i will no longer notify you of new shit from "+toTitleCase(match[1])
      bot.sendMessage(msg.from.id, text)
      console.log('removed user')
      console.log(find.message_id)
      find.message_id.pop(msg.from.id)
        if(find.message_id.length == 0 ){
        find.remove()
      }

    });
    });

posts_stream = new RedditStream('posts', 'hiphopheads', 'telegram-bot')

posts_stream.start()
posts_stream.on('new', function(posts){
  mSubscribe.find({}, function(err, artist){
    for (var t = 0; t < posts.length; ++t){
      var sended = []
      var patt = new RegExp(/fresh/i)
      var patto = new RegExp("^\\[[^\\]]*]")
      var titolo = posts[t].data.title
        if (patto.test(titolo)&&patt.test(titolo)){
          console.log('titolo', titolo)
          artist.forEach(function(artist){
            if(titolo.includes(artist.artist)){
              if (artist.sended.indexOf(posts[t].data.url) == -1) {
                var opt = {
                  disable_notification: true,
                  reply_markup: JSON.stringify({
                  inline_keyboard: [
                    [{ text: 'Gimme the topic', url: 'http://reddit.com'+posts[t].data.permalink }]]
                  })}
                artist.message_id.forEach(function(id){
                  console.log(id)
                  console.log(titolo)
                  bot.sendMessage(id, "Hey, there's new shit from "+artist.artist+" "+posts[t].data.url, opt)

                })
                mSubscribe.findOneAndUpdate({artist: artist.artist}, { $addToSet: {'sended': posts[t].data.url} }, function(err, artist){
                  if (err) throw err;})
                ;}
                else console.log('already sended')
              }});}}});});







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
