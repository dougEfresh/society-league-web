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
    ,Table = Bootstrap.Table
    ,Nav = Bootstrap.Nav
    ,Grid = Bootstrap.Grid
    ,Row = Bootstrap.Row
    ,Col = Bootstrap.Col
    ,MenuItem = Bootstrap.MenuItem
    ,Accordion = Bootstrap.Accordion
    ,Glyphicon = Bootstrap.Glyphicon
    ,Panel = Bootstrap.Panel;

var ReactRouterBootstrap = require('react-router-bootstrap')
    ,NavItemLink = ReactRouterBootstrap.NavItemLink
    ,MenuItemLink = ReactRouterBootstrap.MenuItemLink;

var DataStore= require('../../stores/DataStore.jsx');
var UserContextMixin = require('../../UserContextMixin.jsx');
var SeasonMixin = require('../../SeasonMixin.jsx');
var StatsMixin = require('../../StatsMixin.jsx');
var TeamMixin = require('../../TeamMixin.jsx');
var DivisionConstants = require('../../constants/DivisionConstants.jsx');
var SeasonWeeklyResults = require('./SeasonWeeklyResults.jsx');
var SeasonNineStandings = require('./SeasonNineStandings.jsx');
var SeasonEightStandings = require('./SeasonEightStandings.jsx');

var SeasonDisplay = React.createClass({
    mixins: [UserContextMixin,SeasonMixin,StatsMixin,TeamMixin],
    getDefaultProps: function () {
        return {
            seasonId: null
        }
    },
    render: function() {
        if (this.props.seasonId == null) {
            return null;
        }
        var division = DataStore.getDivisionBySeason(this.props.seasonId);
        return (
            <div id="seasonApp" className="seasonResults">
                <SeasonStandings nine={division.type == DivisionConstants.NINE_BALL_TUESDAYS} standings={this.getSeasonTeamStats(this.props.seasonId)}/>
                <SeasonWeeklyResults matches={this.getMatches(this.props.seasonId)} />
            </div>
        );
    }
});

var SeasonStandings = React.createClass({
    mixins: [SeasonMixin,StatsMixin,TeamMixin,UserContextMixin],
    getDefaultProps: function() {
        return {
            nine : false,
            standings: []
        }
    },
    render: function() {
        if (this.props.standings == undefined || this.props.standings.length == 0) {
            return null;
        }
        if (this.props.nine) {
            return <SeasonNineStandings standings={this.props.standings} />
        }

        return <SeasonEightStandings standings={this.props.standings} />
    }
});

module.exports = SeasonDisplay;

