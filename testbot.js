// testbot.js
var bot = require('telegram-bot-bootstrap');
var fs = require('fs');

var Alice = new bot('332116990:AAH7a3XIEp2HPKxCwiB6vChnCeH8Ns9IfQc');

Alice.getUpdates().then(console.log)
// → you'll see an update message. Look for your user_id in "message.from.id"

// Once you get your id to message yourself, you may:
Alice.sendMessage('47391615', "Hello there")
// → you'll receive a message from Alice.
.then(console.log)
// → optional, will log the successful message sent over HTTP
