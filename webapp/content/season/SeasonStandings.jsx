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

var DataStore= require('../../jsx/stores/DataStore.jsx');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var SeasonMixin = require('../../jsx/mixins/SeasonMixin.jsx');
var StatsMixin = require('../../jsx/mixins/StatsMixin.jsx');
var TeamMixin = require('../../jsx/mixins/TeamMixin.jsx');
var TeamLink = require('../../jsx/components/links/TeamLink.jsx');
var Stat =  require('../../lib/Stat');
var TeamStat =  require('../../lib/TeamStat');

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
            rows.push(t.getStats(this.getParams().seasonId));
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
               null
        );

    }
});

module.exports = SeasonStandings;
