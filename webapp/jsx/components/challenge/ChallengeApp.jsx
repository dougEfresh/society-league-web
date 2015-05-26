var React = require('react/addons');
var RequestApp =  require('./request/ChallengeRequestApp.jsx');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;

var ChallengeApp = React.createClass({
    mixins: [Router.State,Router.Navigation],
    render: function() {
        return (<RouteHandler />);
    }
});

module.exports = ChallengeApp;