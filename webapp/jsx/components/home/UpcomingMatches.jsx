var React = require('react');
var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
var UserLink= require('../UserLink.jsx');
var TeamLink= require('../TeamLink.jsx');
var moment = require('moment');
var Bootstrap = require('react-bootstrap');
var Panel = Bootstrap.Panel;

var UpcomingMatches = React.createClass({
    mixins: [UserContextMixin],
    render: function() {
        if (this.getUser().id == 0) {
            return null;
        }
        var teams = this.getUser().getCurrentTeams();
        var yesterday = moment().subtract(1,'day');
        var upComingMatches = [];

        teams.forEach(function(t){
            var matches = t.getMatches();
            matches.forEach(function(m) {
                var mDate = moment(m.matchDate);
                if (mDate.isAfter(yesterday)) {
                    upComingMatches.push(m);
                }
            });
        });

        upComingMatches = upComingMatches.sort(function(a,b){
            return b.matchDate.localeCompare(a.matchDate);
        });
        var matches = [];
        for (var i=0; i < upComingMatches.length && i < 3; i++) {
            var match = upComingMatches[i];
            var m = moment(match.matchDate);
            debugger;
                matches.push(
                    <span key={i} className="next-match">
                        {m.format('ddd MMM Do ') }
                        <TeamLink team={match.winner} seasonId={match.season.id}/>
                        {' vs. '}
                        <TeamLink team={match.loser} seasonId={match.season.id}/>
                    </span>
                );
        }
        if (matches.length == 0) {
            return (<Panel header={'Upcoming Matches'}>
                <span>You have no matches scheduled</span>
            </Panel>
            )
        }
        return (
            <Panel header={'Upcoming Matches'}>
                {matches}
            </Panel>
        )
    }
});

module.exports = UpcomingMatches;
