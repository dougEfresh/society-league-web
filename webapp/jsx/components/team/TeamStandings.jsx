var React = require('react/addons');
var Bootstrap = require('react-bootstrap')
    ,Table = Bootstrap.Table
    ,Panel = Bootstrap.Panel;

var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
var TeamMixin = require('../../mixins/TeamMixin.jsx');
var UserLink = require('../UserLink.jsx');

var TeamStandings = React.createClass({
    mixins: [TeamMixin,UserContextMixin],
    render: function() {
        var team = this.getTeam(this.props.teamId);
        var stats = team.getStats(this.props.seasonId);
        var teamRow = [];
        teamRow.push(<tr key={'all'}>
            <td>Team Record</td>
            <td>{stats.wins}</td>
            <td>{stats.loses}</td>
            <td>{stats.racksFor}</td>
            <td>{stats.racksAgainst}</td>
        </tr>);
        var users = team.getMembers(this.props.seasonId);
        var i = 0;
        users.forEach(function(u) {
            var stat = u.getSeasonStats(this.props.seasonId);
            teamRow.push(<tr key={i++}>
            <td>
                <UserLink user={u} />
            </td>
            <td>{stat.wins}</td>
            <td>{stat.loses}</td>
            <td>{stat.racksFor}</td>
            <td>{stat.racksAgainst}</td>
        </tr>);
        }.bind(this));

        return (
            <Panel header={team.name + ' Standings'}>
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
           </Panel>
        );
    }
});


module.exports = TeamStandings;