var React = require('react/addons');
var Router = require('react-router')
    ,RouteHandler = Router.RouteHandler;

var Navigator = require('./Navigator.jsx');
var UserStore = require('../stores/UserStore.jsx');
var DataFactory = require('../DataFactoryMixin.jsx');

var NavApp = React.createClass({
    mixins: [DataFactory],
    render: function() {
        return (
            <div>
                <Navigator  />
            </div>
        )
    }
});

module.exports = NavApp;