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
var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
var DivisionConstants = require('../../constants/DivisionConstants.jsx');
var SeasonStandings = require('./SeasonStandings.jsx');
var SeasonWeeklyResults= require('./SeasonWeeklyResults.jsx');
var SeasonMixin = require('../../mixins/SeasonMixin.jsx');
var StatsMixin = require('../../mixins/StatsMixin.jsx');

var SeasonApp = React.createClass({
    mixins: [SeasonMixin,UserContextMixin,StatsMixin,Router.State],
    getInitialState: function () {
        return {
            user: this.getUser(),
            seasonId: this.getParams().seasonId
        }
    },
    componentWillMount: function () {
        DataStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function () {
        DataStore.removeChangeListener(this._onChange);
    },
    componentDidMount: function () {
        this.setState({user: this.getUser()});
    },
    componentWillReceiveProps: function() {
        this.setState({seasonId: this.getParams().seasonId});
    },
    _onChange: function() {
        console.log('onchange');
        this.setState({user: this.getUser()});
    },
    render: function() {
        if (this.getUserId() == 0) {
            return null;
        }
        var division = this.getDivision(this.getParams().seasonId);
        if (division == null || division == undefined) {
            return null;
        }
        return (
            <div id="seasonApp" className="seasonResults">
                <SeasonStandings seasonId={this.getParams().seasonId}
                                 nine={division.type == DivisionConstants.NINE_BALL_TUESDAYS}
                                 standings={this.getSeasonTeamStats(this.getParams().seasonId)}/>
                <SeasonWeeklyResults matches={this.getMatches(this.getParams().seasonId)}/>
            </div>
        );
    }
});

module.exports = SeasonApp;

