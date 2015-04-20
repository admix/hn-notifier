var Firebase = require("firebase");
var newStoriesRef = new Firebase("https://hacker-news.firebaseio.com/v0/newstories/0");

newStoriesRef.on("value", function(snapshot) {
    console.log(snapshot.val());
})
