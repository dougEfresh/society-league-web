var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
//var UpcomingChallenges = require('./UpcomingChallenges.jsx');
var UpcomingMatches = require('./UpcomingMatches.jsx');
var RecentMatches = require('./RecentMatches.jsx');
//var ChallengePendingApp = require('../challenge/pending/ChallengePendingApp.jsx');
//var ChallengeSignUp = require('../challenge/ChallengeSignUp.jsx');
//var LeaderBoard = require('../challenge/standings/LeaderBoard.jsx');
var Util = require('../../jsx/util.jsx');

var HomeApp = React.createClass({
    mixins: [UserContextMixin,Router.State],
     getInitialState: function() {
         return {
             update: Date.now(),
             stats: []
         }
    },
    getData: function() {
        Util.getData('/api/stat/user/' + this.getUser().id , function(d){
            this.setState({stats: d});
        }.bind(this));
    },
    componentDidMount: function () {
        this.getData();
    },
    componentWillReceiveProps: function (o, n) {
        var now = Date.now();
        if ( now - this.state.update > 1000*60)
            this.getData();
       this.getData();
    },
    render: function () {
        var user = this.getUser();
        var record = null;
        if (this.state.stats.length > 0) {
            this.state.stats.forEach(function(s){
                if (s.type == 'ALL') {
                    record = (<span>{' - Lifetime Record -  W:' + s.wins + ' L:' + s.loses}</span>)
                }

            });
        }
        var welcome =  <span id="welcome-name">{'Welcome ' + user.firstName }
            {record}</span>;
        var button = null;

        return (
            <div id="home-app">
                <h2 className="welcome" >
                    <span className="glyphicon glyphicon-user"></span>
                    {welcome}
                    {button}
                </h2>
                <UpcomingMatches />
                <RecentMatches />
            </div>
        );
    }
});

module.exports = HomeApp;