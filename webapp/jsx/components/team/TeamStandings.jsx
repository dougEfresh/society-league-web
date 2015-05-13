var React = require('react/addons');
var Bootstrap = require('react-bootstrap')
    ,Table = Bootstrap.Table
    ,Button = Bootstrap.Button;

var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
var TeamMixin = require('../../mixins/TeamMixin.jsx');
var UserLink = require('../UserLink.jsx');

var TeamStandings = React.createClass({
    mixins: [TeamMixin,UserContextMixin],
    render: function() {
        var team = this.getTeam(this.props.teamId);
        var stats = team.getStats(this.props.seasonId);
        var users = team.getMembers(this.props.seasonId);
        var teamRow = [];
        teamRow.push(<tr key={'all'}>
            <td>Team Record</td>
            <td>{stats.wins}</td>
            <td>{stats.loses}</td>
            <td>{stats.racksFor}</td>
            <td>{stats.racksAgainst}</td>
        </tr>);
        var i = 0;
        var userStats = [];
        users.forEach(function(u) {
            userStats.push({user: u, stat : u.getSeasonStats(this.props.seasonId)});
        }.bind(this));
        userStats = userStats.sort(function(a,b) {
            if (a.stat.wins == b.stat.wins) {
                return a.stat.loses > b.stat.loses;
            }
            return a.stat.wins < b.stat.wins;
        });
        userStats.forEach(function(u) {
            teamRow.push(<tr key={i++}>
            <td>
                <UserLink user={u.user} />
            </td>
            <td>{u.stat.wins}</td>
            <td>{u.stat.loses}</td>
            <td>{u.stat.racksFor}</td>
            <td>{u.stat.racksAgainst}</td>
        </tr>);
        }.bind(this));

        return (
            <div>
                <Table>
                    <thead>
                    <th></th>
                    <th>W</th>
                    <th>L</th>
                    <th>RF</th>
                    <th>RG</th>
                    </thead>
                    <tbody>
                    {teamRow}
                    </tbody>
                </Table>
           </div>
        );
    }
});


module.exports = TeamStandings;