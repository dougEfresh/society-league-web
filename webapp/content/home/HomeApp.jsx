var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var UpcomingChallenges = require('./UpcomingChallenges.jsx');
var UpcomingMatches = require('./UpcomingMatches.jsx');
var RecentMatches = require('./RecentMatches.jsx');
//var ChallengePendingApp = require('../challenge/pending/ChallengePendingApp.jsx');
//var ChallengeSignUp = require('../challenge/ChallengeSignUp.jsx');
//var LeaderBoard = require('../challenge/standings/LeaderBoard.jsx');
var Util = require('../../jsx/util.jsx');

var HomeApp = React.createClass({
    mixins: [UserContextMixin],
     getInitialState: function() {
         return {
             update: Date.now(),
             stats: []
         }
    },
    getData: function() {
        Util.getData('/api/stat/user/' + this.getUser().id , function(d){
            this.setState({stats: d})
        }.bind(this), null, 'HomeApp');
    },
    componentDidMount: function () {
        this.getData();
    },
    componentWillReceiveProps: function (o, n) {
        var now = Date.now();
        if (now - this.state.update > 1000*60)
            this.getData();

       this.getData();
    },
    render: function () {
        var user = this.getUser();
        var record = null;
        if (this.state.stats.length > 0) {
            this.state.stats.forEach(function(s){
                if (s.type == 'ALL') {
                    record = (<div style={{display: 'inline'}} className="ss-label-group">
                <ul>
                        <li className="ss-label-win">W</li>
                        <li className="ss-label-default">{s.wins}</li>
                        </ul>
                <ul>
                        <li className="ss-label-lose">L</li>
                        <li className="ss-label-default">{s.loses}</li>
                </ul>
                </div>);
                }

            });
        }
        var welcome = (
            <span id="welcome-name">{'Welcome ' + user.firstName } 
            </span>);

        return (
            <div id="home-app">
                <div className="welcome-wrap">
                <h2 className="welcome" >
                    <span className="glyphicon glyphicon-user"></span>
                    {welcome}
                </h2>
                {record}
                </div>
                <UpcomingChallenges />
                <UpcomingMatches />
                <RecentMatches />
            </div>
        );
    }
});

module.exports = HomeApp;