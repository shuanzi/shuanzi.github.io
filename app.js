require([
    'libs/text!header.html',
    'libs/text!home.html',
    'libs/text!footer.html'
], function(headerTpl, homeTpl, footerTpl) {
    //parse app-key parse-js-key
    Parse.initialize("fwb1Cw5NrNUXyTTFGiYz8wrU4TTFx2nMOgIAmILh", "mLvLApJB37JNIdiiK1GtTTyZn6bNEhGOUHrH0ZR6");
    var ApplicationRouter = Backbone.Router.extend({
        routes: {
            "": "home",
            "*actions": "home"
        },
        initialize: function() {
            this.headerView = new HeaderView();
            this.headerView.render();
            this.footerView = new FooterView();
            this.footerView.render();
        },
        home: function() {
            this.homeView = new HomeView();
            this.homeView.render();
        }
    });

    HeaderView = Backbone.View.extend({
        el: "#header",
        templateName: 'header.html'
        template: headerTpl,
        initialize: function() {

        },
        render: function() {
            console.log(this.template);
            $(this.el).html(_.template(this.template));
        }
    });

    FooterView = Backbone.View.extend({
        el: "#footer",
        template: footerTpl,
        render: function() {
            console.log(this.template);
            $(this.el).html(_.template(this.template));
        }
    });

    Message = Parse.Object.extend({
        className: "MessageBoard"
    });

    MessageBoard = Parse.Collection.extend({
        model: Message
    });

    HomeView = Backbone.View.extend({
        el: "#content",
        template: homeTpl,
        events: {
            "click #send": "saveMessage"
        },
        initialize: function() {
            this.collection = new MessageBoard();
            this.collection.bind("all", this.render, this);
            this.collection.fetch();
            this.collection.on("add", function(message) {
                message.save(null, {
                    success: function(message) {
                        console.log('saved ' + message);
                    },
                    error: function(err) {
                        console.log('error ' + err);
                    }
                });
                console.log('saved ' + message);
            });
        },
        saveMessage: function() {
            var newMessageForm = $("#new-message");
            var username = newMessageForm.find('[name="username"]').attr('value');
            var message = newMessageForm.find('[name="message"]').attr('value');
            this.collection.add({
                "username": username,
                "message": message
            });
        },
        render: function() {
            console.log(this.collection);
            $(this.el).html(_.template(this.template, this.collection));
        }
    })
    app = new ApplicationRouter();
    Backbone.history.start();
});