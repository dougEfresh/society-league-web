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
var DataActions = require('../../actions/DataActions.jsx');
var DataStore= require('../../stores/DataStore.jsx');
var ChallengeStatus = require('../../constants/ChallengeStatus.jsx');
var UserContextMixin = require('../../UserContextMixin.jsx');
var TeamNav = require('./TeamNav.jsx');
var SeasonNav = require('./SeasonNav.jsx');

var LeagueNav = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function() {
        return {
            challenges: ChallengeStore.getAllChallenges(),
            user: this.getUser()
        }
    },
    componentWillMount: function() {
        DataStore.addChangeListener(this._onChange);
        ChallengeStore.addRequestListener(this._onChallengeChange);
        ChallengeStore.addChangeListener(this._onChallengeChange);
    },
    componentDidMount: function() {
        ChallengeStore.initChallenges(this.getUserId());
        DataActions.init();
    },
    componentWillUnmount: function() {
        DataStore.removeChangeListener(this._onChange);
        ChallengeStore.removeChangeListener(this._onChallengeChange);
        ChallengeStore.removeRequestListener(this._onChallengeChange);
    },
    _onChallengeChange: function() {
        this.setState(
            {challenges: ChallengeStore.getAllChallenges()}
        );
    },
    _onChange: function(){
        this.setState({
            user: this.state.user
        })
    },
    render: function () {
        if (this.getUserId() == 0) {
            return null
        }
        return (
            <div>
                <HomeNav challenges={this.state.challenges}/>
            </div>
        );
    }
});

var HomeNav = React.createClass({
    mixins: [UserContextMixin],
    render: function() {
        var c = this.props.challenges;
        var counter =  c[ChallengeStatus.SENT].length
            +
            c[ChallengeStatus.PENDING].length
            +
            c[ChallengeStatus.ACCEPTED].length;

        if (this.getUser().id == 0) {
            return null;
        }
        var header = (
            <div>
                <Glyphicon glyph='cog' />
                Challenges
                <Badge>{counter}</Badge>
            </div>
        );
        var status = (
            <div className="challengeStatusMenu">
                 <MenuItemLink className='pendingNav' to={ChallengeStatus.PENDING.toLowerCase()} params={{userId: this.getUserId()}} >
                        <Glyphicon glyph='alert' />
                        Pending
                        <Badge>
                            {c[ChallengeStatus.PENDING].length}
                        </Badge>
                 </MenuItemLink>
                <MenuItemLink className='acceptedNav' to={ChallengeStatus.ACCEPTED.toLowerCase()} params={{userId: this.getUserId()}} >
                        <Glyphicon glyph='calendar' />
                        Accepted
                        <Badge>
                            {c[ChallengeStatus.ACCEPTED].length}
                        </Badge>
                    </MenuItemLink>
                  <MenuItemLink className='sentNav' to={ChallengeStatus.SENT.toLowerCase()} params={{userId: this.getUserId()}} >
                        <Glyphicon glyph='ok' />
                        Sent
                        <Badge>
                            {c[ChallengeStatus.SENT].length}
                        </Badge>
                    </MenuItemLink>
                <MenuItemLink className='requestNav' to={ChallengeStatus.REQUEST.toLowerCase()} params={{userId: this.getUserId()}} >
                        <Glyphicon glyph='flash' />
                        Request
                    </MenuItemLink>
            </div>
        );
        var teamHeader = (<i className="fa fa-users">Teams</i>);
        var seasons = (<i className='fa fa-trophy'>Seasons</i>);
        /*
         */
        return (
            <div className="container" style={{'maxWidth': '1000px',padding: '0px 0px'}} >
                <div className="account-wrapper">
                    <Grid>
                        <Row>
                            <Col xs={12} md={2}>
                              <Nav>
                                  <ButtonGroup vertical className="homeNav" role="group" aria-label="...">
                                      <Button className={'active'}>
                                    <Link className='navName' to='home' params={{userId: this.getUserId()}}>
                                        <Glyphicon glyph='home' />
                                        {' ' + this.getUserName()}
                                    </Link>
                                </Button>
                                <Accordion className='challengeStatusNav' style={{marginBottom: '0px'}}>
                                    <Panel className='challengePanelStatus' header={header} eventKey='1' >
                                        {status}
                                    </Panel>
                                </Accordion>
                                      <Accordion className='seasonNav' style={{marginBottom: '0px'}}>
                                          <Panel className='seasonPanelNav' header={seasons} eventKey='1' >
                                              <SeasonNav />
                                          </Panel>
                                      </Accordion>
                                      <Accordion className='teamNav' style={{marginBottom: '0px'}}>
                                          <Panel className='teamPanelNav' header={teamHeader} eventKey='1' >
                                              <TeamNav />
                                          </Panel>
                                      </Accordion>
                                      <Button>
                                          <Link className='statsNav' to='stats' params={{userId: this.getUserId(), statsId: this.getUserId()}}>
                                              <i className="fa fa-bar-chart">{' ' + 'Stats'}</i>
                                          </Link>
                                      </Button>
                                  </ButtonGroup>
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
