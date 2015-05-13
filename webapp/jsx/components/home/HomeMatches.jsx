var React = require('react/addons');
var Bootstrap = require('react-bootstrap');
var Table = Bootstrap.Table;
var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
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
                rows.push(<div key={m.teamMatchId}>{m.matchDate}</div>);
            }
        });
        var results = this.getUser().getResults();
        results = results.sort(function(a,b){
            return b.teamMatch.matchDate.localeCompare(a.teamMatch.matchDate);
        });
        var matchRows = [];
        i = 0;
        var user= this.getUser();
/*
 <td>{r.getRacks(user)}</td>
 <td>{r.getOpponent(user)}</td>
 <td>{r.getOpponentRacks(user)}</td>
 <td>{r.getOpponentHandicap(user)}</td>

 */
        results.forEach(function(r){
            if (i++ < 6) {
                matchRows.push(
                    <tr key={i}>
                        <td>{r.teamMatch.matchDate}</td>
                        <td>{r.isWinner(user)? 'W' : 'L'}</td>
                    </tr>
                );
            }
        });
        return (
            <div>
                <Table>
                    <thead>
                    <tr>
                        <th>date</th>
                        <th>W/L</th>
                    </tr>
                    </thead>
                    <tbody>
                    {matchRows}
                    </tbody>
                </Table>
            </div>
        );

    }
});


module.exports = HomeMatches;