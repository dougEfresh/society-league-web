var React = require('react/addons');
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Input = Bootstrap.Input
    ,Panel = Bootstrap.Panel
    ,Label = Bootstrap.Label;

var UserActions = require('../actions/UserAction.jsx');
var DataFactory = require('./../DataFactoryMixin.jsx');

var LoginApp = React.createClass({
    mixins: [DataFactory],
    contextTypes: {
        router: React.PropTypes.func
    },
    getInitialState: function () {
        return {
            error: false,
            loggedIn: false
        };
    },
    render: function () {
         $.ajax({
            url: '/api/logout',
            success: function (d) {
                UserActions.set({id: 0, name: "unknown"});
                //TODO Do a Real route
                //router.transitionTo('home',{userId: d.id},{from: router.getCurrentPath()});
            }.bind(this),
            error: function (xhr, status, err) {
                this.setState({error: true});
                console.error('logout', status, err.toString());
            }.bind(this)
        });

        return (
            <div>Logged out</div>
        );
    }
});


module.exports = LoginApp;
