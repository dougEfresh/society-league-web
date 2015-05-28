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
var SeasonMixin = require('../../jsx/mixins/SeasonMixin.jsx');
var StatsMixin = require('../../jsx/mixins/StatsMixin.jsx');
var UserLink = require('../../jsx/components/links/UserLink.jsx');
var TeamLink = require('../../jsx/components/links/TeamLink.jsx');
var Stat =  require('../../lib/Stat');
var UserStat =  require('../../lib/UsersStat');

var SeasonLeaders = React.createClass({
    mixins: [SeasonMixin,UserContextMixin,StatsMixin,Router.State,Router.Navigation],
    getInitialState: function () {
        return {
            user: this.getUser(),
            seasonId: this.getParams().seasonId
        }
    },
    componentDidMount: function () {
        this.setState({user: this.getUser()});
    },
    componentWillReceiveProps: function() {
        this.setState({seasonId: this.getParams().seasonId});
    },
    handleClick: function(e) {
        e.preventDefault();
        var toggle = e.target.id;
        if (toggle.indexOf('Teams') >= 0) {
            this.transitionTo('season',this.getParams());
            return;
        }
        if (toggle.indexOf('Results') >= 0) {
            this.transitionTo('seasonResults',this.getParams());
            return;
        }
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
             rows.push(new UserStat(u,u.getStatsForSeason(this.getParams().seasonId)));
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
});

module.exports = SeasonLeaders;

