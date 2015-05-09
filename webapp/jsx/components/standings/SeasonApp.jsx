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
var DivisionConstants = require('../../constants/DivisionConstants.jsx');
var SeasonNineApp = require('./SeasonNineApp.jsx');
var SeasonEightThursApp = require('./SeasonEightThursApp.jsx');
var SeasonEightWedsApp = require('./SeasonEightWedApp.jsx');

var SeasonApp = React.createClass({
    mixins: [UserContextMixin,Router.State],
    getInitialState: function () {
        return {
            user: this.getUser(),
            seasonId: this.getParams('seasonId')
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
        var division = DataStore.getDivisionBySeason(this.getParams().seasonId);

        switch (division.type) {
            case DivisionConstants.NINE_BALL_TUESDAYS:
                return (
                    <div id="seasonApp">
                        <SeasonNineApp seasonId={this.getParams().seasonId} />
                    </div>);

            case DivisionConstants.EIGHT_BALL_WEDNESDAYS:
                return (
                    <div id="seasonApp">
                        <SeasonEightWedsApp seasonId={this.getParams().seasonId} />
                    </div>);
            case DivisionConstants.EIGHT_BALL_THURSDAYS:
                return (
                    <div id="seasonApp">
                        <SeasonEightThursApp seasonId={this.getParams().seasonId} />
                    </div>);
            default:
                return null;
        }
    }
});

module.exports = SeasonApp;

