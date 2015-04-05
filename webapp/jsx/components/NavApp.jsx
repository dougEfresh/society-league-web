var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler;

var Navigator = require('./Navigator.jsx');
var UserStore = require('../stores/UserStore.jsx');

var NavApp = React.createClass({
    getInitialState: function() {
        return UserStore.get();
    },
    componentDidMount: function() {
        UserStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        UserStore.removeChangeListener(this._onChange);
    },
    _onChange: function() {
        this.setState(UserStore.get());
    },

    render: function() {
        return (
            <div>
                <Navigator user={this.state} />
            </div>
        )
    }
});

module.exports = NavApp;