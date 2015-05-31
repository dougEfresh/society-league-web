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

var ColumnHelper = require('../../jsx/components/columns/ColumnHelper.jsx');
var ColumnConfig = require('../../jsx/components/columns/ColumnConfig.jsx');

var FixedDataTable = require('fixed-data-table');
var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;

var ReactRouterBootstrap = require('react-router-bootstrap')
    ,NavItemLink = ReactRouterBootstrap.NavItemLink
    ,MenuItemLink = ReactRouterBootstrap.MenuItemLink;

var DataStore= require('../../jsx/stores/DataStore.jsx');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var Stat =  require('../../lib/Stat');
var SeasonMixin = require('../../jsx/mixins/SeasonMixin.jsx');

var SeasonLeaders = React.createClass({
    mixins: [UserContextMixin,SeasonMixin,Router.State,Router.Navigation],
    getInitialState: function () {
        return {
            user: this.getUser(),
            seasonId: this.getParams().seasonId
        }
    },
    componentDidMount: function () {
    },
    componentWillReceiveProps: function() {
    },
    render: function() {
        if (this.getUserId() == 0) {
            return null;
        }
        var users = [];
        this.getUsers().forEach(function(u) {
            if (u.hasSeason(this.getParams().seasonId)) {
                users.push(u);
            }
        }.bind(this));

        users = users.sort(function(a,b) {
            aStat = a.getStatsForSeason(this.getParams().seasonId);
            bStat = b.getStatsForSeason(this.getParams().seasonId);
            return Stat.sort.byWinPct(aStat,bStat);
        }.bind(this));

        var rows = [];
         users.forEach(function(u) {
             rows.push(u.getStatsForSeason(this.getParams().seasonId));
         }.bind(this));
          var width =
              ColumnConfig.name.width +
              ColumnConfig.name.width +
              ColumnConfig.wins.width +
              ColumnConfig.wins.width +
              ColumnConfig.racksFor.width +
              ColumnConfig.racksAgainst.width +
              1;
        var rowGetter = function(index) {
            return rows[index];
        };
        var season = this.getSeason(this.getParams().seasonId);
        if (season.isChallenge()) {
            width -= ColumnConfig.name.width;
            width += ColumnConfig.wins.width;
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
                    {ColumnHelper.user()}
                    {ColumnHelper.points()}
                    {ColumnHelper.wins()}
                    {ColumnHelper.loses()}
                    {ColumnHelper.racksForStat()}
                    {ColumnHelper.racksAgainstStat()}
                </Table>
            );
        } else {
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
                    {ColumnHelper.user()}
                    {ColumnHelper.usersTeam(this.getParams().seasonId)}
                    {ColumnHelper.wins()}
                    {ColumnHelper.loses()}
                    {ColumnHelper.racksForStat()}
                    {ColumnHelper.racksAgainstStat()}
                </Table>
            );
        }

    }
});

module.exports = SeasonLeaders;

