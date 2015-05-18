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
var SeasonStandings = require('./SeasonStandings.jsx');
var SeasonWeeklyResults= require('./SeasonWeeklyResults.jsx');
var SeasonMixin = require('../../mixins/SeasonMixin.jsx');
var StatsMixin = require('../../mixins/StatsMixin.jsx');
var SeasonResults = require('./SeasonResults.jsx');
var SeasonLeaders = require('./SeasonLeaders.jsx');

var SeasonApp = React.createClass({
    mixins: [SeasonMixin,UserContextMixin,StatsMixin,Router.State,Router.Navigation],
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
    handleClick: function(e) {
        e.preventDefault();
        var toggle = e.target.id;
        if (toggle.indexOf('Leaders') >= 0) {
            this.transitionTo('seasonLeaders',this.getParams());
            return;
        }

        if (toggle.indexOf('Result')) {
            this.transitionTo('seasonResults',this.getParams());
            return;
        }
    },
    render: function() {
        if (this.getUserId() == 0) {
            return null;
        }
        var header =(
            <div>
                <Button  id="buttonToggleLeaders" bsSize='xsmall' bsStyle={'default'}
                        onClick={this.handleClick}><i id="toggleLeaders" className="fa fa-trophy"></i>
                </Button>
                <Button  id="buttonToggleResults" bsSize='xsmall' bsStyle={'default'}
                        onClick={this.handleClick}><i id="toggleResults" className="fa fa-list-ol"></i>
                </Button>
            </div>
        );
        return (
            <div id="seasonApp" className="seasonResults">
                <Panel header={header} >
                    <SeasonStandings seasonId={this.getParams().seasonId} />
                    <SeasonWeeklyResults seasonId={this.getParams().seasonId}/>
                </Panel>
            </div>
        );
    }
});

module.exports = SeasonApp;

