var React = require('react/addons');
var Router = require('react-router');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var SeasonMixin = require('../../jsx/mixins/SeasonMixin.jsx');
var TeamMixin = require('../../jsx/mixins/TeamMixin.jsx');
var ResultMixin = require('../../jsx/mixins/ResultMixin.jsx');
var TeamLink = require('../../jsx/components/links/TeamLink.jsx');

var TeamMatchResult = React.createClass({
    mixins: [UserContextMixin,TeamMixin,ResultMixin,SeasonMixin,Router.State,Router.Navigation],
    render: function() {
        return null;
        /*
        if (this.getParams().teamId == undefined || this.getParams().seasonId == undefined ) {
            return null;
        }
        var team = this.getTeam(this.getParams().teamId);
        var season = this.getSeason(this.getParams().seasonId);
        var nine = season.isNine();
        var results = this.getResults(this.getParams().teamMatchId);
        var width = ColumnConfig.dateMatch.width +
            ColumnConfig.name.width +
            ColumnConfig.name.width +
            ColumnConfig.winLost.width +
            ColumnConfig.racksFor.width +
            ColumnConfig.racksAgainst.width +
            2;
        var rowGetter= function(index) {
            return results[index];
        };
        return (
                <Table
                    groupHeaderHeight={30}
                    rowHeight={50}
                    headerHeight={30}
                    rowGetter={rowGetter}
                    rowsCount={results.length}
                    width={width}
                    maxHeight={500}
                    headerHeight={30}>
                    {ColumnHelper.date()}
                    {ColumnHelper.user(team)}
                    {ColumnHelper.opponent(team,this.getParams().seasonId)}
                    {ColumnHelper.opponentHandicap(team)}
                    {ColumnHelper.winLostTeam(team)}
                    {ColumnHelper.racksForTeamMember(team)}
                    {ColumnHelper.racksAgainstTeamMember(team)}
                </Table>
          );
          */
    }
});

module.exports = TeamMatchResult;