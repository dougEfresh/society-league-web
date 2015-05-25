var React = require('react/addons');
var Router = require('react-router');
var Bootstrap = require('react-bootstrap');
var FixedDataTable = require('fixed-data-table');
var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;

var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
var TeamMixin = require('../../mixins/TeamMixin.jsx');
var SeasonMixin = require('../../mixins/SeasonMixin.jsx');
var UserLink = require('../UserLink.jsx');
var Stat = require('../../../lib/Stat');
var UsersStat = require('../../../lib/UsersStat');
var TeamStat = require('../../../lib/TeamStat');
var ColumnHelper = require('../columns/ColumnHelper.jsx');

var TeamStandings = React.createClass({
    mixins: [TeamMixin,SeasonMixin,UserContextMixin,Router.State],
    render: function() {
        var team = this.getTeam(this.getParams().teamId);
        var stats = team.getStats(this.getParams().seasonId);
        var users = team.getMembers(this.getParams().seasonId);
        var rowGetter = function(rowIndex) {
            return teamData[rowIndex];
        };
        var teamData = [];
        //Create a fake user with a name of 'team'
        teamData.push(new TeamStat(team,stats));
        var usersStat = [];
        users.forEach(function(u) {
            usersStat.push(new UsersStat(u,u.getSeasonStats(this.getParams().seasonId)));
        }.bind(this));
        usersStat = usersStat.sort(function(a,b) {
            return Stat.sortAsc(a.stat,b.stat);
        });
        usersStat.forEach(function(us){
            teamData.push(us);
        }.bind(this));

        return (
                <Table
                    groupHeaderHeight={30}
                    rowHeight={50}
                    headerHeight={30}
                    rowGetter={rowGetter}
                    rowsCount={teamData.length}
                    width={300}
                    height={500}
                    headerHeight={30}>
                    {ColumnHelper.user()}
                    {ColumnHelper.hc(this.getParams().seasonId)}
                    {ColumnHelper.wins()}
                    {ColumnHelper.loses()}
                    {ColumnHelper.racksForStat()}
                    {ColumnHelper.racksAgainstStat()}
                </Table>
        );
        //


    }
});

module.exports = TeamStandings;