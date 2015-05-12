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

var Season = require('../../../lib/Season.js');
var Division = require('../../../lib/Division.js');
var Team = require('../../../lib/Team.js');
var User = require('../../../lib/User.js');
var DivisionType = require('../../../lib/DivisionType');
var Status = require('../../../lib/Status');
var TeamMatch = require('../../../lib/TeamMatch');
var Result = require('../../../lib/Result');

var DataStore = require('../../stores/DataStore.jsx');
var UserContextMixin = require('../../UserContextMixin.jsx');
var TeamMixin = require('../../TeamMixin.jsx');

var TeamNav = React.createClass({
    mixins: [UserContextMixin,TeamMixin,Router.state],
    getInitialState: function () {
        return {
            user: this.getUser()
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
    _onChange: function () {
        this.setState({
            user: this.state.user
        });
    },
    render: function() {
        if (this.getUser().id == 0) {
            return null;
        }
        if (this.getCurrentSeasons().length == 0) {
            return null;
        }
        var teams = [];
        this.getCurrentTeams().forEach(function(t) {
            teams.push(
                <MenuItemLink key={t.name} className='teamNavLink' to={'team'} params={{userId: this.getUserId(),teamId: t.id, seasonId: t.getSeason().id}} >
                    {t.name}
                </MenuItemLink>
            );
        }.bind(this));
        var teamHeader = (<div><i className="fa fa-users">Teams</i></div>);

        return (
            <div id="teamNav" >
                <Panel expanded={true} defaultExpanded={true} className='teamPanelNav' header={teamHeader} eventKey='1' >
                    <div className='teamLinkNav' >{teams}</div>
                </Panel>
            </div>
        )
    }
});

module.exports = TeamNav;