var React = require('react');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var UserLink= require('../../jsx/components/links/UserLink.jsx');
var TeamLink= require('../../jsx/components/links/TeamLink.jsx');
var moment = require('moment');
var Util = require('../../jsx/util.jsx');

var UpcomingMatches = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function() {
         return {
             data: []
        }
    },
    componentWillMount: function() {
    },
    componentWillUnmount: function() {
    },
    componentDidMount: function() {
        Util.getData('/api/teammatch/get/user/' + this.getUser().id + '/current', function(d){
            this.setState({data: d});
        }.bind(this));
    },
    render: function() {
        var user = this.getUser();
        var rows = [];
        var now = moment().subtract(1,'days');
        if (this.state.data.length == 0) {
            return null;
        }
        this.state.data = this.state.data.sort(function(a,b){
            return a.matchDate.localeCompare(b.matchDate);
        });

        this.state.data.forEach(function(m){
            var md = moment(m.matchDate);
            if (md.isBefore(now)) {
                return;
            }
            rows.push (
                <tr key={m.id}>
                    <td>
                        {Util.formatDateTime(m.matchDate)}
                    </td>
                    <td>
                        <TeamLink team={m.opponentTeam} />
                    </td>
                </tr>
            );
        });
        return (

            <div id={'no-recent-matches'} className="panel panel-default">
                <div className="panel-heading" >Upcoming Matches</div>
                <div className="panel-body" >
                    <div className="table-responsive">
                    <table className="table table-condensed table-responsive" >
                        <thead>
                        <tr>
                            <th>Date</th>
                            <th>Opponent</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows}
                        </tbody>
                    </table>
                </div>
                </div>
            </div>

        );
        /*
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
        */
    }
});

module.exports = UpcomingMatches;
