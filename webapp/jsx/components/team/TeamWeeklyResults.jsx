var React = require('react/addons');
var Router = require('react-router');
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Modal = Bootstrap.Modal
    ,OverlayMixin = Bootstrap.OverlayMixin
    ,Panel = Bootstrap.Panel;

var FixedDataTable = require('fixed-data-table');
var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;

var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
var SeasonMixin = require('../../mixins/SeasonMixin.jsx');
var TeamMixin = require('../../mixins/TeamMixin.jsx');
var TeamLink = require('../TeamLink.jsx');
var ColumnHelper = require('../columns/ColumnHelper.jsx');
var ColumnConfig = require('../columns/ColumnConfig.jsx');

var TeamWeeklyResults = React.createClass({
    mixins: [UserContextMixin,TeamMixin,SeasonMixin,Router.State,Router.Navigation],
    componentWillReceiveProps: function(n,o) {

    },
    render: function() {
        var seasonMatches = this.getSeasonMatches(this.getParams().seasonId);
        var matches = [];
        seasonMatches.forEach(function(m) {
            if (m.winner.id == this.getParams().teamId || m.loser.id == this.getParams().teamId) {
                matches.push(m);
            }
        }.bind(this));
        matches = matches.sort(function(a,b){
            return a.matchDate.localeCompare(b.matchDate);
        });
        var rowGetter= function(index) {
            return matches[index];
        };
        var team = this.getTeam(this.getParams().teamId);
        var width =
            ColumnConfig.dateMatch.width +
            ColumnConfig.name.width +
            ColumnConfig.winLost.width +
            ColumnConfig.racksFor.width +
            ColumnConfig.racksAgainst.width +
            2;

        return (
                <Table
                    groupHeaderHeight={30}
                    rowHeight={50}
                    headerHeight={30}
                    rowGetter={rowGetter}
                    rowsCount={matches.length}
                    width={width}
                    maxHeight={500}
                    headerHeight={30}>
                    {ColumnHelper.dateMatch(this.getParams().teamId,this.getParams().seasonId)}
                    {ColumnHelper.opponentTeam(team,this.getParams().seasonId)}
                    {ColumnHelper.winLostTeamMatch(team)}
                    {ColumnHelper.racksForTeam(team)}
                    {ColumnHelper.racksAgainstTeam(team)}
                </Table>
          );
    }
});

module.exports = TeamWeeklyResults;
