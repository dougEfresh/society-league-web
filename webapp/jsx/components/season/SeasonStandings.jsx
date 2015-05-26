var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Route = Router.Route
    , NotFoundRoute = Router.NotFoundRoute
    , Link = Router.Link
    , DefaultRoute = Router.DefaultRoute;
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,ButtonGroup = Bootstrap.ButtonGroup
    ,PanelGroup = Bootstrap.PanelGroup
    ,Badge = Bootstrap.Badge
    ,Nav = Bootstrap.Nav
    ,Grid = Bootstrap.Grid
    ,Row = Bootstrap.Row
    ,Col = Bootstrap.Col
    ,MenuItem = Bootstrap.MenuItem
    ,Accordion = Bootstrap.Accordion
    ,Glyphicon = Bootstrap.Glyphicon
    ,Panel = Bootstrap.Panel;

var FixedDataTable = require('fixed-data-table');
var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;

var DataStore= require('../../stores/DataStore.jsx');
var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
var SeasonMixin = require('../../mixins/SeasonMixin.jsx');
var StatsMixin = require('../../mixins/StatsMixin.jsx');
var TeamMixin = require('../../mixins/TeamMixin.jsx');
var TeamLink = require('../TeamLink.jsx');
var Stat =  require('../../../lib/Stat');
var TeamStat =  require('../../../lib/TeamStat');
var ColumnHelper = require('../columns/ColumnHelper.jsx');
var ColumnConfig = require('../columns/ColumnConfig.jsx');

var SeasonStandings = React.createClass({
    mixins: [SeasonMixin,StatsMixin,TeamMixin,UserContextMixin,Router.State],
    getDefaultProps: function() {
        return {
            seasonId: 0
        }
    },
    render: function() {
        var season = this.getSeason(this.getParams().seasonId);
        var rows = [];
        this.getSeasonStandings(this.getParams().seasonId).forEach(function (t) {
            rows.push(new TeamStat(t,t.getStats(this.getParams().seasonId)));
        }.bind(this));
        var width = ColumnConfig.name.width +
            ColumnConfig.wins.width +
            ColumnConfig.wins.width +
            ColumnConfig.racksFor.width +
            ColumnConfig.racksAgainst.width +
            1;
        var rowGetter = function(index) {
            return rows[index];
        };
        return (
                <Table
                    groupHeaderHeight={30}
                    rowHeight={50}
                    headerHeight={30}
                    rowGetter={rowGetter}
                    rowsCount={rows.length}
                    width={width}
                    maxHeight={500}
                    headerHeight={30}>
                    {ColumnHelper.team()}
                    {ColumnHelper.wins()}
                    {ColumnHelper.loses()}
                    {ColumnHelper.racksForStat()}
                    {ColumnHelper.racksAgainstStat()}
                </Table>
        );

    }
});

module.exports = SeasonStandings;
