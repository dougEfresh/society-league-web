var React = require('react/addons');
var RequestApp =  require('./request/ChallengeRequestApp.jsx');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var ChallengeRequestApp = require('./request/ChallengeRequestApp.jsx');
var ChallengePendingApp = require('./pending/ChallengePendingApp.jsx');
var ChallengeAcceptedApp= require('./accepted/ChallengeAcceptedApp.jsx');
var ChallengeSentApp = require('./sent/ChallengeSentApp.jsx');
var Challenges = require('./Challenges.jsx');

var ChallengeApp = React.createClass({
    mixins: [UserContextMixin,Router.State,Router.Navigation],
    render: function() {
        return (
            <div id="challenge-app" >
                <ChallengeRequestApp />
                <ChallengePendingApp />
                <ChallengeSentApp />
                <ChallengeAcceptedApp />
                <Challenges />
            </div>
        );
    }
});

module.exports = ChallengeApp;