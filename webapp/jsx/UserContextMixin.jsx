var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler;
var DataStore = require('./stores/DataStore.jsx');

var DataFactory = {
    contextTypes: {
        router: React.PropTypes.func
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
    getCurrentTeams: function() {
       var u = this.getUser();
        u.currentTeams.forEach(function(t) {
            t.name = this.getTeam(t.id);
        }.bind(this));
        return u.currentTeams;
    },
    getTeam: function(id) {
        return DataStore.getTeams()[id];
    },
    redirect: function (to,params) {
        this.context.router.transitionTo(to,params,{from: this.context.router.getCurrentPath()});
    }
};

module.exports = DataFactory;