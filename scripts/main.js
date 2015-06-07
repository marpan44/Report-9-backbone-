var MData = {
    Models: {},
    Collections: {},
    Views: {},
    Templates:{}
}

MData.Models.Movie = Backbone.Model.extend({})
MData.Collections.Movies = Backbone.Collection.extend({
    model: MData.Models.Movie,
    url: "scripts/data/movies.json",
    initialize: function(){
        console.log("Movies initialize")
    }
})

MData.Templates.movies = _.template($("#tmplt-Movies").html())

MData.Views.Movies = Backbone.View.extend({
    el: $("#mainContainer"),
    template: MData.Templates.movies,

    initialize: function () {
        this.collection.bind("reset", this.render, this);
        this.collection.bind("add", this.addOne, this);
    },

    render: function () {
        console.log("render")
        console.log(this.collection.length);
        $(this.el).html(this.template());
        this.addAll();
    },

    addAll: function () {
        console.log("addAll")
        this.collection.each(this.addOne);
    },

    addOne: function (model) {
        console.log("addOne")
        view = new MData.Views.Movie({ model: model });
        $("ul", this.el).append(view.render());
    }

})


MData.Templates.movie = _.template($("#tmplt-Movie").html())
MData.Views.Movie = Backbone.View.extend({
    tagName: "li",
    template: MData.Templates.movie,

    initialize: function () {
        this.model.bind('remove', this.removeItem, this);
    },

    render: function () {
        return $(this.el).append(this.template(this.model.toJSON())) ;
    },

    events: {
       
        'click.delete': 'remove'
    },


    removeItem: function (model) {
        console.log("Remove - " + model.get("Name"))
        this.remove();
    }
})


MData.Router = Backbone.Router.extend({
    routes: {
        "": "defaultRoute"  
    },

    defaultRoute: function () {
        console.log("defaultRoute");
        MData.movies = new MData.Collections.Movies()
        new MData.Views.Movies({ collection: MData.movies }); 
        MData.movies.fetch();
        console.log(MData.movies.length)
    }
})

var appRouter = new MData.Router();
Backbone.history.start();

$("#butAddItem").click(null, function () {
    var movie = new MData.Models.Movie(
        {
            "Name": "New movie",
            "AverageRating": 6.3,
            "ReleaseYear": 2015,
            "Url": "http://www.filmweb.pl/film/New+movie-2015-677512",
            "Type": "Sci-Fi",
            "Production": "USA"
        }

    )

    MData.movies.add(movie);
    console.log(MData.movies.length)
})
