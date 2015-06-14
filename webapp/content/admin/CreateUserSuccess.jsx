var React = require('react/addons');
var Router = require('react-router')
    ,RouteHandler = Router.RouteHandler;
var UserContextMixin = require('./../../jsx/mixins/UserContextMixin.jsx');
var User = require('../../lib/User');
var Util = require('../../jsx/util.jsx');
var DataStore = require('../../jsx/stores/DataStore.jsx');

var CreateUserSuccessApp = React.createClass({
    mixins: [UserContextMixin,Router.Navigation,Router.State],
    render: function() {
        var q = this.getQuery();
        var newUser = this.getUser(q.userId);
        if (newUser == null || newUser.id == 0) {
            return (
                <div id="create-user-fail">
                    <h2>Failed creating user</h2>
            </div>);
        }

        return (
            <div id="create-user-success">
                <h2>{newUser.name} created</h2>
                <p>UserId: {newUser.id}</p>
            </div>

        );
    }
});

module.exports = CreateUserSuccessApp;