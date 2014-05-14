
var app = {
  model: {},
  view: {},

  social: [{name:'twitter'}],
}

var bb = {
  model: {},
  view: {}
}


bb.init = function() {

  bb.model.State = Backbone.Model.extend({    
    initialize: function( items ) {
      var self = this
      _.bindAll(self)
    },

    init: function(){
      var self = this
        }

  })


  bb.view.Header = Backbone.View.extend({    
    initialize: function( items ) {
      var self = this
      _.bindAll(self)

      self.elem = {
        //repairs_btn: $('#header_repairs'),
      //  failures_btn: $('#header_failures'),
		logout_btn: $('#header_logout'),
		//twitlogin_btn: $('#auth'), 
		intro_section: $('#introduction'),
		choice_section: $('#choice')
      }
	  
      app.model.state.on('change:user',self.render)
	  
	  self.render()
    },

    render: function() {
      var self = this

      var user = app.model.state.get('user')
      
      if( user ) {
      //  self.elem.repairs_btn.show()
		//self.elem.failures_btn.hide()
		
		//alert("User object has been set");
        self.elem.logout_btn.show()
		self.elem.intro_section.hide()
		self.elem.choice_section.show()
      }
      else {
      //  self.elem.repairs_btn.hide()
		//self.elem.failures_btn.hide()
		//alert("User object has NOT been set");
        self.elem.logout_btn.hide()
		self.elem.intro_section.show()
		self.elem.choice_section.hide()
      }
    }
  })


  bb.view.SocialMsg = Backbone.View.extend({    
    initialize: function( items ) {
      var self = this
      _.bindAll(self)

      self.elem = {msg:{}}
      app.social.forEach(function(service){
        self.elem.msg[service.name] = $('#social_msg_'+service.name)
        self.elem.msg[service.name].tap(function(){
          self.socialmsg(service)
        })
      })

      app.model.state.on('change:user',self.render)
    },

    render: function() {
      var self = this

      var user = app.model.state.get('user')
      app.social.forEach(function(service){
        var btn = self.elem.msg[service.name].show()

        if( user && user.service === service.name ) {
          btn.show()
        }
        else {
          btn.hide()
        }
      })
    },

    socialmsg: function( service ) {
      console.log(service.name)

      var death = app.model.state.get('death')

      http.post('/user/socialmsg/'+'test',{},function(res){
        alert( res.ok ? 'Message sent!' : 'Unable to send message.')
      })
    }
  })

  
  
  
  bb.view.Choice = Backbone.View.extend({    
    initialize: function( items ) {
      var self = this
      _.bindAll(self)

      self.elem = {msg:{}}
      app.social.forEach(function(service){
        self.elem.msg[service.name] = $('#social_msg_'+service.name)
        self.elem.msg[service.name].tap(function(){
          self.socialmsg(service)
        })
      })

      app.model.state.on('change:user',self.render)
    },

    render: function() {
      var self = this

      var user = app.model.state.get('user')
      app.social.forEach(function(service){
        var btn = self.elem.msg[service.name].show()

        if( user && user.service === service.name ) {
          btn.show()
        }
        else {
          btn.hide()
        }
      })
    },

    socialmsg: function( service ) {
      console.log(service.name)

      var death = app.model.state.get('death')

      http.post('/user/socialmsg/'+death.getTime(),{},function(res){
        alert( res.ok ? 'Message sent!' : 'Unable to send message.')
      })
    }
  })


  bb.view.EntryList = Backbone.View.extend({    
    initialize: function( type ) {
      var self = this
      _.bindAll(self)

      $('#'+type+'_snap').tap(function(){self.takephoto()})
	  $('#'+type+'_delete').tap(function(){self.deletephoto()})

      self.elem = {
        image: $('#'+type+'_photo'),
        delete_btn: $('#'+type+'_delete'),
      }

      self.type = type

     // app.model.state.on('entry-update',self.render)
    },

    render: function() {
      
	  self.listMachines()
    },


    takephoto: function( ) {
      var self = this
	  
	  

  
    },
	
	
	 deletephoto: function( ) {
     var self = this
	  
	  

  
    },

    listMachines: function(  ) {
      var self = this

     //Intend to put some code in here to populate the machine list from a configuration 
    }
  })
}


app.boot = function() {

}

app.start = function() {
  var trigger_entry_update = function(){app.model.state.trigger('entry-update')}


  http.get('/user',function(user){
    if( user.id ) {
      app.model.state.set({user:user})
    }
  })


  setInterval(function(){
  },60000)

  $(document).bind("pagechange", function(){
  })
}

app.erroralert = function( error ) {
  alert(error)
}


app.init = function() {


  bb.init()

  app.model.state = new bb.model.State()
  app.model.state.init()

  app.view.header    = new bb.view.Header()

  app.view.socialmsg = new bb.view.SocialMsg()
  app.view.socialmsg.render()
  
  
  app.view.choice = new bb.view.Choice()
  app.view.choice.render()

  app.view.repairs = new bb.view.EntryList('repairs')
  
  app.start()
}


app.boot()
$(app.init)
