var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,PanelGroup = Bootstrap.PanelGroup
    ,Input = Bootstrap.Input
    ,Nav = Bootstrap.Nav
    ,NavItem = Bootstrap.NavItem
    ,Panel = Bootstrap.Panel;
var Router = require('react-router')
    ,RouteHandler = Router.RouteHandler;
var Pie = require("react-chartjs").Pie;

var UserContextMixin = require('./../../jsx/mixins/UserContextMixin.jsx');
var StatsRecord = require('./StatsRecord.jsx');
var StatsHandicap = require('./StatsHandicap.jsx');
var StatsChart = require('./StatsPie.jsx');
var firstBy = require('../../lib/FirstBy.js');
var ColumnHelper = require('../../jsx/components/columns/ColumnHelper.jsx');
var ColumnConfig = require('../../jsx/components/columns/ColumnConfig.jsx');
var FixedDataTable = require('fixed-data-table');
var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;
var UserStat = require('../../lib/UsersStat');

var StatsDisplay = React.createClass({
    mixins: [UserContextMixin,Router.State],
    render: function() {
        var user = this.getUser(this.getParams().statsId);
        var stats = user.stats;
        var userStats = [];
        stats.forEach(function(s){
            if (s.type.indexOf('handicap') >= 0 || s.type.indexOf('division') >=0 ) {
                return;
            }
            //if (s.type.indexOf('challenge') >= 0 ) {
//                return ;
  //          }
            userStats.push(s);
        });
        userStats.sort(function(a,b){
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
        var rowGetter = function(rowIndex) {
            return userStats[rowIndex];
        };
         var width =
            // ColumnConfig.name.width +
             ColumnConfig.season.width +
            ColumnConfig.wins.width +
            ColumnConfig.wins.width +
             ColumnConfig.racksFor.width +
             ColumnConfig.winPct.width +
            ColumnConfig.racksAgainst.width + 10;
         return (
                <Table
                    groupHeaderHeight={30}
                    rowHeight={50}
                    headerHeight={30}
                    rowGetter={rowGetter}
                    rowsCount={userStats.length}
                    width={width}
                    maxHeight={500}
                    headerHeight={30}>
                    {ColumnHelper.statType()}
                    {ColumnHelper.wins()}
                    {ColumnHelper.loses()}
                    {ColumnHelper.racksForStat()}
                    {ColumnHelper.racksAgainstStat()}
                    {ColumnHelper.winPct()}
                </Table>
        );
    }
});

module.exports = StatsDisplay;