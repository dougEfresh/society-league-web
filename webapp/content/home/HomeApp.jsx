var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var UpcomingChallenges = require('./UpcomingChallenges.jsx');
var UpcomingMatches = require('./UpcomingMatches.jsx');
var RecentMatches = require('./RecentMatches.jsx');
var Util = require('../../jsx/util.jsx');
var UserLink = require('../../jsx/components/links/UserLink.jsx');
var UserInfo = require('./UserInfo.jsx');

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
        return (
            <div id="home-app">
                <UserInfo user={user} stats={this.state.stats} />
                <UpcomingChallenges />
                <UpcomingMatches />
                <RecentMatches />
            </div>
        );
    }
});

module.exports = HomeApp;