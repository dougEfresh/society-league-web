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

var DataStore= require('../../jsx/stores/DataStore.jsx');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var SeasonStandings = require('./SeasonStandings.jsx');
var SeasonWeeklyResults= require('./SeasonWeeklyResults.jsx');
var SeasonMixin = require('../../jsx/mixins/SeasonMixin.jsx');
var StatsMixin = require('../../jsx/mixins/StatsMixin.jsx');
var SeasonResults = require('./SeasonResults.jsx');
var SeasonLeaders = require('./SeasonLeaders.jsx');

var ChallengeSeasonApp = React.createClass({
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
    render: function() {
        if (this.getUserId() == 0) {
            return null;
        }

        var header = (
            <div style={{display: 'inline'}}>
                <Link to='challengeStandings' params={this.getParams()}>
                    <Button bsStyle={this.isActive('challengeStandings') ? 'success' : 'default'} responsize>
                        <i className="fa fa-trophy"></i><span className="main-item">{ ' Standings'}</span>
                    </Button>
                </Link>

                <Link to='challengeLeaders' params={this.getParams()}>
                    <Button bsStyle={this.isActive('challengeStandings') ? 'success' : 'default'} responsive>
                        <i className="fa  fa-list-ol"></i><span className="main-item">{ ' Leaders'}</span>
                    </Button>
                </Link>
                <Link to='challengeResults' params={this.getParams()}>
                    <Button bsStyle={this.isActive('challengeStandings') ? 'success' : 'default'} responsive>
                        <i className="fa  fa-history"></i><span className="main-item">{ ' Matches'}</span>
                    </Button>
                </Link>
            </div>
        );
        return (<div id="challenge-season-app"><h2>Blha</h2></div>);
        /*
         <Link to='seasonWeeklyResults' params={this.getParams()}>
         <Button bsStyle={this.isActive('seasonWeeklyResults') ? 'success' : 'default'} responsize>
         <i className="fa fa-calendar"></i><span className="main-item">'{ ' Weekly Results'}</span>
         </Button>
         </Link>
         */
        /*

        return (
            <div id="season-app">
                {header}
                <RouteHandler />
            </div>
        );
        */
    }
});

module.exports = ChallengeSeasonApp;

