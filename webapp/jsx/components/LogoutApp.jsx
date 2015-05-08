var React = require('react/addons');
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Input = Bootstrap.Input
    ,Panel = Bootstrap.Panel
    ,Label = Bootstrap.Label;

var UserStore = require('../stores/UserStore.jsx');
var UserContextMixin = require('./../UserContextMixin.jsx');

var LoginApp = React.createClass({
    mixins: [UserContextMixin],
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
                UserStore.set({id: 0, name: ""});
                this.context.router.transitionTo('login',null,null);
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
