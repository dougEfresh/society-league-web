var React = require('react/addons');
var Router = require('react-router')
    ,RouteHandler = Router.RouteHandler;

var UserContextMixin = require('./../../jsx/mixins/UserContextMixin.jsx');

var StatsDisplay = React.createClass({
    mixins: [UserContextMixin,Router.State],
    getRows: function(data) {
        var rows = [];
        data.forEach(function(d){
            var type = d.getType();
            if (d.getType() == 'season') {
                type = d.season.getDisplayName();
            }
            if (d.getType() == 'all') {
                type = 'overall';
            }
            rows.push(<tr key={type}>
                <td> {type}</td>
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
        var stats = user.stats;
        var userStats = [];
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

         return (
             <div className="table-responsive">
                 <table className="table table-striped table-hover table-condensed">
                    <tr>
                        <th>Type</th>
                        <th>W</th>
                        <th>L</th>
                        <th>RW</th>
                        <th>RL</th>
                        <th>%</th>
                    </tr>
                     <tbody>
                    {this.getRows(userStats)}
                     </tbody>
                </table>
                </div>
         );
     }
});

module.exports = StatsDisplay;