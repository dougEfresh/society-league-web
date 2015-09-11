var React = require('react/addons');
var Router = require('react-router')
    , State = Router.State
    , Navigation = Router.Navigation
    , Link = Router.Link
    , RouteHandler = Router.RouteHandler;

var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');

var UserPasswordApp = React.createClass({
    render: function() {
        return <h2>HI</h2>
    }

});

module.exports=UserPasswordApp;