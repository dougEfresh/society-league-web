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
var ChallengeStatus = require('../../constants/ChallengeStatus.jsx');
var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
var TeamNav = require('./TeamNav.jsx');
var SeasonNav = require('./SeasonNav.jsx');
var HomeNav = require('./HomeNav.jsx');
var ChallengeNav = require('./ChallengeNav.jsx');
var Season = require('../../../lib/Season.js');
var Team = require('../../../lib/Team.js');
var User = require('../../../lib/User.js');
var Status = require('../../../lib/Status');
var Result = require('../../../lib/Result');
var HomeApp = require('../home/HomeApp.jsx');

var LeagueNav = React.createClass({
    mixins: [UserContextMixin,Router.State,Router.Navigation],
    getInitialState: function() {
        return {
            user: this.getUser()
        }
    },
    componentWillMount: function() {
        DataStore.addChangeListener(this._onChange);
    },
    componentDidMount: function() {
    },
    componentWillUnmount: function() {
        DataStore.removeChangeListener(this._onChange);
    },
    _onChange: function(){
        this.setState({
            user: this.getUser()
        })
    },
    render: function () {
        if (this.getUserId() == 0) {
            return null
        }
        var home = null;
        if (this.isActive('default')) {
            home = (<HomeApp />);
        }

        return (
            <div className="container outerWrapper"  >
                <div className="account-wrapper">
                    <Grid className="leagueNavGrid" >
                        <Row>
                            <Col xs={12} md={12} className="user-nav">
                                <ul className="nav nav-tabs">
                                    <HomeNav />
                                    <TeamNav />
                                    <SeasonNav />
                                    <li id="stat-nav" role="presentation">
                                        <Link className='scoutNav' to='scout' params={{statsId: this.getUserId()}}>
                                            <i className="fa fa-bar-chart"><span className="main-item">{ ' Stats'}</span></i>
                                        </Link>
                                    </li>
                                    <ChallengeNav />
                                </ul>
                            </Col>

                            <Col xs={12} md={12} className="user-nav">
                                <div className="container user-content">
                                    {home}
                                    <RouteHandler />
                                </div>
                            </Col>
                        </Row>
                    </Grid>
                </div>
            </div>
        );
    }
});

module.exports = LeagueNav;
