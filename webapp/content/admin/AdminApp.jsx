var React = require('react/addons');
var Router = require('react-router')
    ,RouteHandler = Router.RouteHandler;
var UserContextMixin = require('./../../jsx/mixins/UserContextMixin.jsx');

var AdminApp = React.createClass({
    render: function() {
        return (<RouteHandler />);
    }
});

module.exports = AdminApp;