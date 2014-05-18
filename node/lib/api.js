"use strict";


var common = require('./common')

var twitter    = common.twitter

var config = common.config



var send_social_msg = {
  twitter: function(user, msg, callback) {
    var conf = {
      consumer_key: config.twitter.key,
      consumer_secret: config.twitter.secret,
      access_token_key: user.key,
      access_token_secret: user.secret
    }
    var twit = new twitter(conf)
        
    var start = new Date()


    twit.updateStatus(msg, function (data) {
      var end = new Date()
      var dur = end.getTime()-start.getTime()
      console.log('twitter tweet:' + dur + ', ' + 'Message =' + msg + JSON.stringify(data))
      callback( data.created_at )
    })
  },

}







exports.rest = {

    create: function (req, res) {
        var input = req.body

        console.log('tweet new maintenance details')


        var user = req.user
        if (!user) return common.util.sendcode(400);

        if (user.service) {

            send_social_msg[user.service](
              user, 'Maintenace Issues ' + req.category + 'Machine ' + req.machine,

              function (ok) {
                  common.util.sendjson(res, { ok: ok })
              }
            )
        }

    },


}


exports.get_user = function( req, res, next ) {
  var clean_user = {}

  if( req.user ) {
    clean_user.id       = req.user.id
    clean_user.username = req.user.username
    clean_user.service  = req.user.service
  }

  common.util.sendjson(res,clean_user)
}


exports.social_msg = function( req, res, next, message ) {
    var user = req.user
    if (!user) return common.util.sendcode(400);
      
    if (user.service) {

       // var twitter_update_with_media = require('./twitter_update_with_media');

       // var tuwm = new twitter_update_with_media({
       //     consumer_key: config.twitter.key,
      //      consumer_secret: config.twitter.secret,
      //      token: user.key,
      //      token_secret: user.secret
      //  });

     //   tuwm.post('This is a test', '/path_to_image.png', function (err, response) {
     //       if (err) {
     //           console.log(err);
     //       }
     //       console.log(response);
     //   });

        var details = '  ' + req.body.Location + '  '  + req.body.Description + '  ' + req.body.Machine + '  '
        if (req.body.Photo1) { details = details + req.body.Photo1 + '  ' }
        if (req.body.Photo2) { details = details + req.body.Photo2 + '  ' }
        if (req.body.Photo3) { details = details + req.body.Photo3 + '  ' }
        if (req.body.Photo4) { details = details + req.body.Photo4 + '  ' }


      send_social_msg[user.service](
      user, 'Maintenance Issues ' + message + details,
      function(ok) {
        common.util.sendjson(res,{ok:ok})
      }
    )
  }
}