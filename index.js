var Firebase = require("firebase");
var url = require("url");
var email = require("./email");
var habitat = require("habitat");

habitat.load();
var env = new habitat(),
    notificationDomain = env.get("NOTIFY");

var newStoriesRef = new Firebase("https://hacker-news.firebaseio.com/v0/newstories/0");

newStoriesRef.on("value", function(snapshot) {
  var storyRef = new Firebase("https://hacker-news.firebaseio.com/v0/item/"+snapshot.val());

  storyRef.on('value', function(storySnapshot) {
    if(storySnapshot.val() === null) {
      return
    }
    var story = storySnapshot.val();
    var host = url.parse(story.url).host;
    storyRef.off();

    if(host === notificationDomain) {
      console.log(story);
      email.sendNotificationEmail(story, host);
    }
  });
})
