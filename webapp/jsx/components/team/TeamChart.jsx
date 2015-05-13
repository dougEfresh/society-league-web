var React = require('react/addons');
var Bootstrap = require('react-bootstrap');

var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
var TeamMixin = require('../../mixins/TeamMixin.jsx');
var Chart = require('../Chart.jsx');

var TeamChart = React.createClass({
    mixins: [TeamMixin,UserContextMixin],
    render: function() {
        var label = [];
        var team = this.getTeam(this.props.teamId);
        var stats = team.getStats(this.props.seasonId);
        var users = team.getMembers(this.props.seasonId);
        var wins = [];
        var lost = [];

        label.push('W:'+ stats.wins + ' L:' + stats.loses);
        wins.push(stats.wins);
        lost.push(stats.loses);
        var userStats = [];
        users.forEach(function(u) {
            userStats.push({user: u, stat : u.getSeasonStats(this.props.seasonId)});
        }.bind(this));
        userStats = userStats.sort(function(a,b) {
            if (a.stat.wins == b.stat.wins) {
                return a.stat.loses > b.stat.loses;
            }
            if (a.stat.loses == b.stat.loses) {
                return a.stat.racksFor < b.stat.racksFor;
            }
            return a.stat.wins < b.stat.wins;
        });
        userStats.forEach(function(u) {
            label.push(u.user.lName.substr(0,8) +'.');
            wins.push(u.stat.wins);
            lost.push(u.stat.loses);
        });
         var data = {
             labels: label,
             datasets: [
                 {
                     label: "Wins",
                     fillColor: "green",
                     strokeColor: "rgba(220,220,220,0.8)",
                     highlightFill: "rgba(220,220,220,0.75)",
                     highlightStroke: "rgba(220,220,220,1)",
                     data: wins
                 },
                 {
                     label: "Lost",
                     fillColor: "#9c302d",
                     strokeColor: "rgba(151,187,205,0.8)",
                     highlightFill: "rgba(151,187,205,0.75)",
                     highlightStroke: "rgba(151,187,205,1)",
                     data: lost
                 }
             ]
         };
        return (
            <div>
                <Chart data={data} />
           </div>
        );
    }
});


module.exports = TeamChart;