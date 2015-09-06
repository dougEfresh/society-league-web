var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var DataStore = require('../../jsx/stores/DataStore.jsx');
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
        //DataStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function () {
        //DataStore.removeChangeListener(this._onChange);
    },
    componentDidMount: function () {

    },
    _onChange: function () {
        //this.setState({user: this.getUser()});
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
                <RecentMatches />
                <UpcomingMatches />
            </div>
        );
        //<LeaderBoard />
    }
});

module.exports = HomeApp;