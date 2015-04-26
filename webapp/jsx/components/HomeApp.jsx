var React = require('react/addons');
var Bootstrap = require('react-bootstrap');

var ChallengeStore = require('../stores/ChallengeStore.jsx');
var UserStore = require('../stores/UserStore.jsx');
var ChallengeStatus = require('../constants/ChallengeStatus.jsx');
var DataFactory = require('../DataFactoryMixin.jsx');

var HomeApp = React.createClass({
    mixins: [DataFactory],
    render: function () {
        return null;
    }
});

module.exports = HomeApp;