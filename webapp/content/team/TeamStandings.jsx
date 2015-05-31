var React = require('react/addons');
var Router = require('react-router');
var Bootstrap = require('react-bootstrap');
var FixedDataTable = require('fixed-data-table');
var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;

var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var TeamMixin = require('../../jsx/mixins/TeamMixin.jsx');
var SeasonMixin = require('../../jsx/mixins/SeasonMixin.jsx');
var UserLink = require('../../jsx/components/links/UserLink.jsx');
var Stat = require('../../lib/Stat');
var UsersStat = require('../../lib/UsersStat');
var TeamStat = require('../../lib/TeamStat');
var ColumnHelper = require('../../jsx/components/columns/ColumnHelper.jsx');
var ColumnConfig = require('../../jsx/components/columns/ColumnConfig.jsx');

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
        teamData.push(stats);
        var usersStat = [];
        users.forEach(function(u) {
            usersStat.push(u.getSeasonStats(this.getParams().seasonId));
        }.bind(this));
        usersStat = usersStat.sort(function(a,b) {
            return Stat.sortAsc(a,b);
        });
        usersStat.forEach(function(us){
            teamData.push(us);
        }.bind(this));
        var width = ColumnConfig.name.width +
            ColumnConfig.handicap.width +
            ColumnConfig.wins.width +
            ColumnConfig.wins.width +
            ColumnConfig.racksFor.width +
            ColumnConfig.racksAgainst.width +
            1;
        return (
                <Table
                    groupHeaderHeight={30}
                    rowHeight={50}
                    headerHeight={30}
                    rowGetter={rowGetter}
                    rowsCount={teamData.length}
                    width={width}
                    maxHeight={500}
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