var React = require('react');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var UserLink= require('../../jsx/components/links/UserLink.jsx');
var TeamLink= require('../../jsx/components/links/TeamLink.jsx');
var moment = require('moment');

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
            return (
                <div id={'upcoming-matches'} className="panel panel-default">
                    <div className="panel-heading" >Upcoming Matches</div>
                        <div className="panel-body" >
                            <span id="no-matches">You have no matches scheduled</span>
                        </div>
                </div>
            );
        }
        return (
            <div id={'upcoming-matches'} className="panel panel-default">
                <div className="panel-heading" >Upcoming Matches</div>
                <div className="panel-body" >
                    {matches}
                </div>
            </div>
        )
    }
});

module.exports = UpcomingMatches;
