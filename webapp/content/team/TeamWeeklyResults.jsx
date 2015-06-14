var React = require('react/addons');
var Router = require('react-router');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var SeasonMixin = require('../../jsx/mixins/SeasonMixin.jsx');
var TeamMixin = require('../../jsx/mixins/TeamMixin.jsx');
var TeamLink = require('../../jsx/components/links/TeamLink.jsx');

var TeamWeeklyResults = React.createClass({
    mixins: [UserContextMixin,TeamMixin,SeasonMixin,Router.State,Router.Navigation],
    componentWillReceiveProps: function(n,o) {

    },
    render: function() {
        return (<h2>Coming Soon</h2>);
        /*
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
          */
    }
});

module.exports = TeamWeeklyResults;
