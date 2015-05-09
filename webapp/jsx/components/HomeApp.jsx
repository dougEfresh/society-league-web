var React = require('react/addons');
var Bootstrap = require('react-bootstrap');
var Router = require('react-router');
var ChallengeStore = require('../stores/ChallengeStore.jsx');
var ChallengeStatus = require('../constants/ChallengeStatus.jsx');
var UserContextMixin = require('../UserContextMixin.jsx');

var HomeApp = React.createClass({
    mixins: [UserContextMixin,Router.state],
    render: function () {
        return (<div id="homeApp"></div>);
    }
});

module.exports = HomeApp;