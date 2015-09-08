var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var UpcomingChallenges = require('./UpcomingChallenges.jsx');
var UpcomingMatches = require('./UpcomingMatches.jsx');
var RecentMatches = require('./RecentMatches.jsx');
var ChallengePendingApp = require('../challenge/pending/ChallengePendingApp.jsx');
var ChallengeSignUp = require('../challenge/ChallengeSignUp.jsx');
var LeaderBoard = require('../challenge/standings/LeaderBoard.jsx');
var Util = require('../../jsx/util.jsx');

var HomeApp = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function() {
         return {
             data: []
        }
    },
    componentWillMount: function () {
    },
    componentWillUnmount: function () {
    },
    componentDidMount: function () {

    },
    _onChange: function () {

    },
    render: function () {
        var user = this.getUser();

        var welcome = <Link to='info' params={{userId: this.getUser().id}}>
            <span id="welcome-name">{'Welcome ' + user.firstName }</span> </Link>
        var button = null;
        if (user.challenge) {
            button =  <Link id="request-link" to="challengeMain">
                <button className="btn btn-default btn-primary request">
                    <span className="glyphicon glyphicon-plus-sign"></span>
                    <b>Challenge</b></button>
                </Link>
        }
        var signUp = null;
        if (!user.challenge) {
            signUp = <ChallengeSignUp />;
        }
        //
        return (
            <div id="home-app">
                <h2 className="welcome" >
                    <span className="glyphicon glyphicon-user"></span>
                    {welcome}
                    {button}
                </h2>
                <ChallengePendingApp />
                <UpcomingChallenges />
                <UpcomingMatches />
                <RecentMatches />
            </div>
        );
        //<LeaderBoard />
    }
});

module.exports = HomeApp;