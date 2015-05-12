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

var ChallengeStore = require('../../stores/ChallengeStore.jsx');
var DataStore= require('../../stores/DataStore.jsx');
var ChallengeStatus = require('../../constants/ChallengeStatus.jsx');
var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
var TeamNav = require('./TeamNav.jsx');
var SeasonNav = require('./SeasonNav.jsx');
var ChallengeNav = require('./ChallengeNav.jsx');
var DataActions = require('../../actions/DataActions.jsx');
var Season = require('../../../lib/Season.js');
var Division = require('../../../lib/Division.js');
var Team = require('../../../lib/Team.js');
var User = require('../../../lib/User.js');
var DivisionType = require('../../../lib/DivisionType');
var Status = require('../../../lib/Status');
var TeamMatch = require('../../../lib/TeamMatch');
var Result = require('../../../lib/Result');

var LeagueNav = React.createClass({
    mixins: [UserContextMixin,Router.state],
    getInitialState: function() {
        return {
            user: this.getUser()
        }
    },
    componentWillMount: function() {
        DataStore.addChangeListener(this._onChange);
    },
    componentDidMount: function() {
        DataActions.init();
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
        return (
            <div id="leagueApp" >
                <HomeNav />
            </div>
        );
    }
});

var HomeNav = React.createClass({
    mixins: [UserContextMixin,Router.state],
    render: function() {
        if (this.getUser().id == 0) {
            return null;
        }
        return (
            <div className="container"  >
                <div className="account-wrapper">
                    <Grid className="leagueNavGrid" style={{marginWidth: '30px'}} >
                        <Row>
                            <Col xs={12} md={2}>
                              <Nav>
                                  <div className="homeNav" aria-label="...">
                                      <Button className={'active btn-block user'}>
                                          <Link className='navName' to='home'>
                                              <Glyphicon glyph='home' />
                                              {this.getUser().name}
                                          </Link>
                                      </Button>
                                      <TeamNav />
                                      <SeasonNav />
                                      <Button>
                                      <Link className='statsNav' to='stats' params={{statsId: this.getUserId()}}>
                                          <i className="fa fa-bar-chart">{' ' + 'Stats'}</i>
                                      </Link>
                                      </Button>
                                      <ChallengeNav />

                                  </div>
                              </Nav>
                            </Col>
                            <Col xs={12} md={10}>
                                <RouteHandler />
                            </Col>
                        </Row>
                    </Grid>
                </div>
            </div>
        );
    }
});

module.exports = LeagueNav;
