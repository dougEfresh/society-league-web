var React = require('react/addons');
var Bootstrap = require('react-bootstrap');
var Table = Bootstrap.Table;
var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
var UserLink= require('../UserLink.jsx');
var TeamLink = require('../UserLink.jsx');
var moment = require('moment');

var HomeMatches = React.createClass({
    mixins: [UserContextMixin],
    render: function() {
        if (this.getUser().id == 0) {
            return null;
        }
        var teams = this.getUser().getCurrentTeams();
        var today = moment();
        var upComingMatches = [];

        teams.forEach(function(t){
            var matches = t.getMatches();
            matches.forEach(function(m) {
                var mDate = moment(m.matchDate);
                if (mDate.isAfter(today)) {
                    upComingMatches.push(matches);
                }
            });
        });

        upComingMatches = upComingMatches.sort(function(a,b){
            return b.matchDate.localeCompare(a.matchDate);
        });
        var rows = [];
        var i = 0;
        upComingMatches.forEach(function(m){
            if (i++ < 6) {
                rows.push(<tr key={m.teamMatchId}><td>{m.matchDate}</td></tr>);
            }
        });
        var results = this.getUser().getResults();
        results = results.sort(function(a,b){
            return b.teamMatch.matchDate.localeCompare(a.teamMatch.matchDate);
        });

        var matchRows = [];
        i = 0;
        var user= this.getUser();
        results.forEach(function(r){
            if (i++ < 6) {
                matchRows.push(
                    <tr key={i}>
                        <td>{r.teamMatch.matchDate}</td>
                        <td>{r.isWinner(user)? 'W' : 'L'}</td>
                        <td><UserLink user={r.getOpponent(user)}/></td>
                        <td>{r.getOpponentHandicap(user)}</td>
                    </tr>
                );
            }
        });
        var resultTable = null;
        if (matchRows.length > 0) {
            resultTable = (
                <Table>
                    <thead>
                    <tr>
                        <th>date</th>
                        <th>W/L</th>
                        <th>Opponent</th>
                        <th>Handicap</th>
                    </tr>
                    </thead>
                    <tbody>
                    {matchRows}
                    </tbody>
                </Table>
            );
        }
        var upComingtable = null;
        if (upComingMatches.length > 0) {
            upComingtable = (
                     <Table>
                    <thead>
                    <tr>
                        <th>date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {upComingMatches}
                    </tbody>
                </Table>
            );
        }
        return (<div><div>{upComingtable}</div><div>{resultTable}</div></div>);
    }
});


module.exports = HomeMatches;