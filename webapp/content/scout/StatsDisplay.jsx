var React = require('react/addons');
var Router = require('react-router');

var UserContextMixin = require('./../../jsx/mixins/UserContextMixin.jsx');

var StatsDisplay = React.createClass({
    mixins: [UserContextMixin,Router.State],
    getRows: function(data) {
        var rows = [];
        var user = this.getUser(this.getParams().statsId);
        data.forEach(function(d){
            if (d.type == 'challenge') {
                return;
            }
            var type = d.getType();
            var hc = '';

            if (d.getType() == 'season') {
                type = d.season.getDisplayName();
                hc = user.getCurrentHandicap(d.season.id);
            }
            if (d.getType() == 'all') {
                type = 'overall';
            }

            rows.push(<tr key={type}>
                <td> {type}</td>
                <td> {hc} </td>
                <td> {d.getPoints()} </td>
                <td> {d.wins}</td>
                <td> {d.loses}</td>
                <td> {d.racksFor}</td>
                <td> {d.racksAgainst}</td>
                <td> {d.getWinPct()}</td>
            </tr>);
        });
        return rows;
    },
    render: function() {
        var user = this.getUser(this.getParams().statsId);
        var stats = user.getChallengeStats();
        var userStats = [];
        userStats.push(stats);
        /*

        stats.forEach(function(s){

            if (s.type.indexOf('handicap') >= 0 || s.type.indexOf('division') >=0 ) {
                return;
            }
            userStats.push(s);
        });
        userStats = userStats.sort(function(a,b){
            if (a.type == 'all') {
                return -1;
            }

            if (b.type == 'all') {
                return 0;
            }

            if (b.type == 'season') {
                return  b.season.startDate.localeCompare(a.season.startDate);
            }

            return 0;
        });
        */

        var rows = this.getRows(userStats);
        if (rows.length < 1) {
            return (<h3>No matches have been played</h3>);
        }
         return (
             <div className="table-responsive">
                 <table className="table table-striped table-hover table-condensed">
                    <tr>
                        <th>Type</th>
                        <th>HC</th>
                        <th>Points</th>
                        <th>W</th>
                        <th>L</th>
                        <th>RW</th>
                        <th>RL</th>
                        <th>%</th>
                    </tr>
                     <tbody>
                     {rows}
                     </tbody>
                </table>
                </div>
         );
     }
});

module.exports = StatsDisplay;