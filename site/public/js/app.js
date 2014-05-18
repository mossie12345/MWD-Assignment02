
var app = {
  model: {},
  view: {},
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


   bb.model.Details = Backbone.Model.extend({
       defaults: {
           location: 'test country',
           category: 'test cat',
           description: 'test desc',
           machine: 'test mach',
           photo1: 'test ph 1',
           photo2: 'test ph 2',
           photo3: 'test ph 3',
           photo4: 'test ph 4'
       },
       urlRoot: 'http://192.168.1.3:8180/api/rest/tweet/',
       url: function () {
           return this.urlRoot
       },

       initialize: function (items) {
           var self = this
           _.bindAll(self)
       },

       init: function () {
           var self = this


           if (navigator.geolocation) {

               if (!self.location) {
                   navigator.geolocation.getCurrentPosition(function (position) {


                  //     alert('Your latitude is ' + position.coords.latitude + '\n' + 'Your longitude is  ' + position.coords.longitude);
                       self.location = 'Latitude ' + position.coords.latitude + '\n' + 'Longitude  ' + position.coords.longitude
                   }, function (error) {
                       alert('Error occurred. Error code: ' + error.code + '\n' + 'Error Message ' + error.message);
                   });
               } else {
                   alert('no geolocation support');
               }
           }


       }

   })


  bb.view.Header = Backbone.View.extend({    
    initialize: function( items ) {
      var self = this
      _.bindAll(self)

      self.elem = {
		logout_btn: $('#header_logout'),
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
        self.elem.logout_btn.show()
		self.elem.intro_section.hide()
		self.elem.choice_section.show()
      }
      else {
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
      
      self.elem.msg['twitter'] = $('#social_msg_twitter')
      self.elem.msg['twitter'].tap(function(){
          self.socialmsg()
        })
        
      app.model.state.on('change:user',self.render)
    },

    render: function() {
      var self = this

      var user = app.model.state.get('user')

      
      var btn = self.elem.msg['twitter'].show()

      if (user) {
          btn.show()
      }
      else {
          btn.hide()
      }


    },

    socialmsg: function() {
        console.log('tweeting: Description = ' + app.model.details.description + 'Machine = ' + app.model.details.machine)
        
        //alert ('Location is' + location)

        http.post('/user/socialmsg/' + app.model.details.category, {
            Description: app.model.details.description, Machine: app.model.details.machine,
            Photo1: app.model.details.photo1, Photo2: app.model.details.photo2,
            Photo3: app.model.details.photo3, Photo4: app.model.details.photo4, Location:app.model.details.location
        }, function (res) {
        alert( res.ok ? 'Message sent!' : 'Unable to send message.')
      })

    }
  })


  bb.view.EntryList = Backbone.View.extend({    
    initialize: function( type ) {
      var self = this
      _.bindAll(self)

      self.type = type

      self.elem = {
        image_1: $('#'+type+'_photo_1'),
        delete_btn_1: $('#'+type+'_delete_1'),
        image_2: $('#' + type + '_photo_2'),
        delete_btn_2: $('#' + type + '_delete_2'),
        image_3: $('#' + type + '_photo_3'),
        delete_btn_3: $('#' + type + '_delete_3'),
        image_4: $('#' + type + '_photo_4'),
        delete_btn_4: $('#' + type + '_delete_4'),
        machine_list: $('#' + type + '_machines'),
        description: $('#' + type + '_desc'),

         photo_1_section: $('#' + type + 'pics1') 
      }


      self.elem.image_1.change(function () { self.addphoto(1) })
      self.elem.delete_btn_1.click(function () { self.deletephoto(1) })
      self.elem.image_2.change(function () { self.addphoto(2) })
      self.elem.delete_btn_2.tap(function () { self.deletephoto(2) })
      self.elem.image_3.change(function () { self.addphoto(3) })
      self.elem.delete_btn_3.tap(function () { self.deletephoto(3) })
      self.elem.image_4.change(function () { self.addphoto(4) })
      self.elem.delete_btn_4.tap(function () { self.deletephoto(4) })
      self.elem.machine_list.change(function () { self.setmachine() })

      self.elem.delete_btn_1.hide()
      self.elem.delete_btn_2.hide()
      self.elem.delete_btn_3.hide()
      self.elem.delete_btn_4.hide()

      self.elem.photo_1_section.hide()

      $('#' + self.type + '_delete_3').hide()

      $('#' + self.type + '_delete_4').hide()

      var btn = self.elem.delete_btn_4.show()
        btn.hide()

      self.elem.image_2.hide()
      self.elem.image_3.hide()
      self.elem.image_4.hide()

      

    },

    render: function() {
      
	  self.listMachines()
    },

    addphoto: function (index) {
        var self = this

        app.model.details.category = self.type
        app.model.details.description = self.elem.description.val()

        

        console.log ('Photo added')

        if (index == 1) {

            self.elem.image_2.show()
            app.model.details.photo1 = 'Photo ' + index + 'added'
            self.elem.delete_btn_1.show()
        }

        if (index == 2) {

            self.elem.image_3.show()
            app.model.details.photo2 = 'Photo ' + index + 'added'
            self.elem.delete_btn_2.show()
        }

        if (index == 3) {

            self.elem.image_4.show()
            app.model.details.photo3 = 'Photo ' + index + 'added'
            self.elem.delete_btn_3.show()
        }

        if (index == 4) {

            app.model.details.photo4 = 'Photo ' + index + 'added'
            self.elem.delete_btn_4.show()
        }
        
    },
	
	deletephoto: function(index) {
     var self = this
	  
     console.log('deleting a photo')

     app.model.details.category = self.type
     app.model.details.description = self.elem.description.val()

     if (index ==1)
     {
         self.elem.image_1.replaceWith(self.elem.image_1.clone());
       
         app.model.details.photo1 = null
     }

     if (index == 2) {
         self.elem.image_2.replaceWith(self.elem.image_2.clone());
         app.model.details.photo2 = null
     }

     if (index == 3) {
         self.elem.image_3.replaceWith(self.elem.image_3.clone());
         app.model.details.photo3 = null
     }

     if (index == 4) {
         self.elem.image_4.replaceWith(self.elem.image_4.clone());
         app.model.details.photo4 = null
     }


	},
    

	setmachine: function() {
	var self = this
	  
	app.model.details.category = self.type
	app.model.details.description = self.elem.description.val()


	app.model.details.machine = self.elem.machine_list.val()

	  
	},



    listMachines: function(  ) {
      var self = this

     //Intend to put some code in here to populate the machine list from a config
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

  app.model.details = new bb.model.Details()
  app.model.details.init()


  app.view.header    = new bb.view.Header()

  app.view.socialmsg = new bb.view.SocialMsg()
  app.view.socialmsg.render()
  

  app.view.repairs = new bb.view.EntryList('repairs')
  app.view.failures = new bb.view.EntryList('failures')
  
  app.start()
}


app.boot()
$(app.init)
