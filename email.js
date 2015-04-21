var nodemailer = require('nodemailer'),
    signer = require('nodemailer-dkim').signer,
    habitat = require("habitat"),
    fs = require("fs");

habitat.load();
var env = new habitat(),
    email = env.get("EMAIL"),
    pwd = env.get("PASS"),
    domain = env.get("DOMAIN"),
    keySelector = env.get("KEYSELECTOR");

module.exports = {
  sendNotificationEmail: function(details, hn_domain) {
    var date = new Date(details.time*1000);
    // hours part from the timestamp
    var hours = date.getHours();
    // minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // seconds part from the timestamp
    var seconds = "0" + date.getSeconds();

    // will display time in 10:30:23 format
    var formattedTime = hours + ':' + minutes.substr(minutes.length-2) + ':' + seconds.substr(seconds.length-2);
    var transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: email,
            pass: pwd
        }
    });
    // transporter.use('stream', signer({
    //     domainName: domain,
    //     keySelector: keySelector
    //     //privateKey: fs.readFileSync('private.pem')
    // }));

    var htmlStart = '<!DOCTYPE html><html lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><meta name="viewport" content="width=device-width"><title>Hacker News Notifier</title>';
    var htmlBody = '<p>Your domain ' + hn_domain + ' has been posted on Hacker News by <strong>'+details.by+'</strong>.<br><strong>Time: </strong>'+ formattedTime +' <br><strong>Title: </strong>' + details.title + ' <br><strong>Link used: </strong>'+details.url+'</p>';
    var htmlEnd = '</body></html>';

    var body = htmlStart + htmlBody + htmlEnd;

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: "Hacker News Notifier " + email, // sender address
        to: email, // list of receivers
        subject: "My domain "+ hn_domain +" has been posted on Hacker News", // Subject line
        headers: {"mailed-by":domain,
                  "signed-by":domain},
        html: body// html body
    }

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, response){
        if(error){
            console.error(error.stack);
        }else{
            console.log("Message sent");
        }

    });
  }

}
