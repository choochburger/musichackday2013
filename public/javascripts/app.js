$(function() {

  var AppModel = Backbone.Model.extend({
    defaults: {
      loading: true,
      ready: false,
      authenticated: false,
      status: 'ok',
      albums: [],
      start: 0,
      count: 100
    },

    fetch: function(options) {
      var self = this;
      this.set('loading', true);

      if ( R.authenticated() ) {
        this.set('authenticated', true);
        this.request(this.get('start'), this.get('count'), function(data) {
          self.set('loading', false);
          self.response(data)
        });
      } else {
        this.set('loading', false);
      }
    },

    request: function(start, count, callback) {
      var self;

      R.request({
        method: 'getAlbumsInCollection',

        content: {
          user: R.currentUser.get('key'),
          start: start,
          count: count,
          sort: 'playCount'
        },

        complete: callback
      });
    },

    response: function(response) {
      this.set('status', response.status);
      this.set('albums', ( this.get('albums') || [] ).concat( response.result ) );
      this.set('start', this.get('start') + this.get('count'));
    }
  });

  var AppView = Backbone.View.extend({
    el: $('.app'),

    template: Handlebars.compile( $('#app-template').html() ),

    events: {
      'click .login' : 'authenticate',
      'click img'    : 'play',
      'click .more'  : 'fetch'
    },

    initialize: function() {
      var self = this;

      this.listenTo(this.model, 'change',        this.render);
      this.listenTo(this.model, 'change:result', this.play);

      R.ready(function() {
        self.model.set('ready', true);
        self.model.fetch();
      });

      this.render();
    },

    render: function() {
      this.$el.html( this.template( this.model.attributes ) );
    },

    authenticate: function() {
      var self = this;

      R.authenticate(function() {
        self.model.fetch();
      });
    },

    fetch: function() {
      this.model.fetch();
    },

    play: function(e) {
      if (this.$active) {
        this.$active.removeClass('active');
      }
      this.$active = $(e.target);
      this.$active.addClass('active');

      R.player.play({ source: this.$active.data('key') });
    }
  });

  var appModel = new AppModel();
  var appView = new AppView({
    model: appModel
  });
});
