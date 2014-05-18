"use strict";


var common = require('./common')

//var connectRoute = common.connectRoute
var connect    = common.connect
var dispatch   = common.dispatch
var everyauth  = common.everyauth

var DataCapsule = common.DataCapsule


var config = common.config
var api    = common.api



var dc
var authcap


function init_datacapsule( callback ) {
  dc = new DataCapsule({})

  dc.capsule( 'internal','user', config.secret, function( err, cap ) {
    if( err) return console.log(err);
    authcap = cap
    callback()
  })
}


function init_connect() {

  var port = process.env.VCAP_APP_PORT || process.env.PORT || parseInt( process.argv[2], 10 )
  
    console.log('port='+port+' static='+staticFolder)
	
  var staticFolder = __dirname + '/../../site/public'

  console.log('port='+port+' static='+staticFolder)


  function make_promise( user, promise ) {
    authcap.save( user, function( err, user ){
      if( err ) return promise.fail(err)
         promise.fulfill(user)
  }
    )

    return promise
  }

  // turn on to see OAuth flow
  everyauth.debug = true


  everyauth.everymodule
    .findUserById(function (id, callback) {
        authcap.load(id, function (err, user) {
            if (err) return callback(err);
            callback(null, user)
        })
    })
    .moduleErrback(function (err, data) {
        if (err) console.dir(err);
       throw err;
    })


  everyauth.twitter
    .consumerKey( config.twitter.key )
    .consumerSecret( config.twitter.secret )
    .findOrCreateUser( function (session, accessToken, accessTokenSecret, twitterUserMetadata) {

      var user = { 
        id:'tw-'+twitterUserMetadata.id, 
        username: twitterUserMetadata.screen_name, 
        service:'twitter',
        key:accessToken,
        secret:accessTokenSecret
      }

      return make_promise( user, this.Promise() )
    })
    .redirectPath('/')
	
	
	

var routes = function (app) {
    // Define your routes here
   // console.log ('setting up rest create')
  //  app.post('/api/rest/tweet', api.rest.create)
};
	
	


  var server = connect.createServer(
    connect.bodyParser(),
    connect.cookieParser(),
    connect.query(),
    connect.session({secret: config.secret}),

    everyauth.middleware(),
    dc.middleware(),

    
    dispatch({
      '/user': {
        GET: api.get_user,
        '/socialmsg/:message': {
          POST: api.social_msg
        }
      }
    }),

    function(req,res,next){
      if( 0 === req.url.indexOf('/api/ping') ) {
        console.log(req.url+': '+JSON.stringify(req.query))
        res.writeHead(200)
        res.end( JSON.stringify({ok:true,time:new Date()}) )
      }
      else next();
    },



    
    connect.static( staticFolder )
  )

 // var router = connect.router(function (app) {
  //    app.post('/api/rest/tweet', api.rest.create)
 // })
 // server.use(router)


 // connectRoute(function (app) {
 //     app.post('/api/rest/tweet', api.rest.create)
 //     });


  server.listen( port )
}


function start() {
  init_datacapsule(init_connect)
}

exports.start = start

if( 0 < process.argv[1].indexOf('server.js') ) {
  start()
}

