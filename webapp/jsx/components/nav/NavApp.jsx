var React = require('react/addons');
var Router = require('react-router')
    ,RouteHandler = Router.RouteHandler;
var State = Router.state;
var UserStore = require('../../stores/UserStore.jsx');
var UserContextMixin = require('../../UserContextMixin.jsx');
var LeagueNav = require('./LeagueNav.jsx');
var LoginApp = require('../LoginApp.jsx');

var NavApp = React.createClass({
    mixins: [State,UserContextMixin],
    render: function() {
        if (this.getUserId() == 0) {
            console.log("LoginApp");
            return (
                <div>
                    <LoginApp />
                </div>
            )
        }

        return (
            <div id="leagueNav">
                <LeagueNav  />
            </div>
        )
    }
});

module.exports = NavApp;