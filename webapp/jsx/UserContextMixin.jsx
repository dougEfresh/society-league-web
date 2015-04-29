var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler;
var DataStore = require('./stores/DataStore.jsx');

var DataFactory = {
    contextTypes: {
        router: React.PropTypes.func
    },
    getContextParam: function(param) {
        return this.context.router.getCurrentParams().param;
    },
    getUserId: function() {

        var id =  parseInt(this.context.router.getCurrentParams().userId);
        if (id == undefined || isNaN(id))
            return 0;

        return id;
    },
    getUser: function() {
        if (this.getUserId() == 0) {
            return {id:0, name: ""}
        }

        var u = DataStore.getUsers()[this.getUserId()];
        if (u == undefined) {
             return {id:0, name: ""}
        }
        return u;
    },
    getCurrentSeasons: function() {
        var seasons = [];
        var u = this.getUser();
        u.currentSeasons.forEach(function(s){
            var season = DataStore.getSeasons()[s];
            var division = DataStore.getDivisions()[season.division];
            if (!division.challenge)
                seasons.push({id: s, name: season.season.name.split(',')[2]});
        }.bind(this));
        seasons.push({id: 0 ,name:'Challenge'});
        return seasons;
    },
    getCurrentTeams: function() {
       var u = this.getUser();
        var teams = [];
        u.currentTeams.forEach(function(t) {
            var season = DataStore.getSeasons()[t.season];
            var division = DataStore.getDivisions()[season.division];
            t.name = this.getTeam(t.id);
            if (!division.challenge) {
                teams.push(t);
            }
        }.bind(this));
        return teams;
    },
    getTeam: function(id) {
        return DataStore.getTeams()[id];
    },
    redirect: function (to,params) {
        this.context.router.transitionTo(to,params,{from: this.context.router.getCurrentPath()});
    }
};

module.exports = DataFactory;