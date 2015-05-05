var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler;
var DataStore = require('./stores/DataStore.jsx');

var DataFactory = {
    contextTypes: {
        router: React.PropTypes.func
    },
    getContextParam: function(param) {
        return this.context.router.getCurrentParams()[param];
    },
    getUserId: function() {

        var id =  parseInt(this.context.router.getCurrentParams().userId);
        if (id == undefined || isNaN(id))
            return 0;

        return id;
    },
    getUser: function(id) {
        var userId = id;
        if (id == null) {
            userId = this.getUserId();
        }

        if (userId == 0) {
            return {id:0, name: ""}
        }

        var u = DataStore.getUsers()[userId];
        if (u == undefined) {
             return {id:0, name: ""}
        }
        return u;
    },
    getUserName: function() {
        var u = this.getUser();
        return u.firstName + ' ' + u.lastName;
    },
    getCurrentSeasons: function() {
        var seasons = [];
        var u = this.getUser();
        u.currentSeasons.forEach(function(s){
            var division = DataStore.getDivisionBySeason(s);
            seasons.push({id: s,division: division});
        }.bind(this));
        return seasons;
    },
    getCurrentTeams: function() {
       var u = this.getUser();
        var teams = [];
        u.currentTeams.forEach(function(t) {
            var team = {id: t.id, season: t.season};
            team.division = DataStore.getDivisionBySeason(t.season);
            team.name = this.getTeam(t.id).name;
            teams.push(team);
        }.bind(this));
        return teams;
    },
    redirect: function (to,params) {
        this.context.router.transitionTo(to,params,null);
    }
};

module.exports = DataFactory;