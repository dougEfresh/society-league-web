var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler;

var UserContextMixin = require('./../mixins/UserContextMixin.jsx');

var ErrorApp = React.createClass({
    mixins: [UserContextMixin,Router.state],
    render: function () {
        return (
                <h2>ERROR</h2>
        );
    }
});

module.exports = ErrorApp;