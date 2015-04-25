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
    ,MenuItem = Bootstrap.MenuItem
    ,Accordion = Bootstrap.Accordion
    ,Glyphicon = Bootstrap.Glyphicon
    ,Panel = Bootstrap.Panel;
var ReactRouterBootstrap = require('react-router-bootstrap')
    ,NavItemLink = ReactRouterBootstrap.NavItemLink
    ,MenuItemLink = ReactRouterBootstrap.MenuItemLink;

var ChallengeStore = require('../stores/ChallengeStore.jsx');
var UserStore = require('../stores/UserStore.jsx');
var ChallengeStatus = require('../constants/ChallengeStatus.jsx');
var DataFactory = require('../DataFactoryMixin.jsx');

var HomeApp = React.createClass({
    mixins: [DataFactory],
    getInitialState: function() {
        return {
            challenges: ChallengeStore.getAllChallenges()
        }
    },
    componentWillMount: function() {
        UserStore.addChangeListener(this._onUserChange);
        ChallengeStore.addRequestListener(this._onChallengeChange);
        ChallengeStore.addChangeListener(this._onChallengeChange);
    },
    componentDidMount: function() {
        ChallengeStore.initChallenges(this.getUserId());
        UserStore.getAllFromServer()
    },
    componentWillUnmount: function() {
        UserStore.removeChangeListener(this._onUserChange);
        ChallengeStore.removeChangeListener(this._onChallengeChange);
        ChallengeStore.removeRequestListener(this._onChallengeChange);
    },
    _onUserChange: function() {
        this.forceUpdate();
    },
    _onChallengeChange: function() {
        this.setState(
            {challenges: ChallengeStore.getAllChallenges()}
        );
    },
    render: function () {
        return (
            <div>
                <HomeNav challenges={this.state.challenges}/>
                <RouteHandler />
            </div>
        );
    }
});

var HomeNav = React.createClass({
    mixins: [DataFactory],
    render: function() {
        var c = this.props.challenges;
        var counter =  c[ChallengeStatus.SENT].length
            +
            c[ChallengeStatus.PENDING].length
            +
            c[ChallengeStatus.NOTIFY].length
            +
            c[ChallengeStatus.ACCEPTED].length;

        var indicator = (<i className='fa fa-fighter-jet'><Badge>{counter}</Badge></i>);
        //<NavItemLink to={ChallengeStatus.REQUEST.toLowerCase()} params={{userId: this.getUserId()}} eventKey={"challenge"} >{indicator}</NavItemLink>
        if (this.getUserId() == undefined || this.getUserId() == 0) {
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
            <div>
                 <MenuItemLink className='challengeStatus pendingNav' to={ChallengeStatus.ACCEPTED.toLowerCase()} params={{userId: this.getUserId()}} >
                        <Glyphicon glyph='alert' />
                        Scheduled
                        <Badge>
                            {c[ChallengeStatus.PENDING].length}
                        </Badge>
                 </MenuItemLink>
                <MenuItemLink className='challengeStatus acceptedNav' to={ChallengeStatus.ACCEPTED.toLowerCase()} params={{userId: this.getUserId()}} >
                        <Glyphicon glyph='calendar' />
                        Scheduled
                        <Badge>
                            {c[ChallengeStatus.ACCEPTED].length}
                        </Badge>
                    </MenuItemLink>
                  <MenuItemLink className='challengeStatus sentNav' to={ChallengeStatus.ACCEPTED.toLowerCase()} params={{userId: this.getUserId()}} >
                        <Glyphicon glyph='ok' />
                        Scheduled
                        <Badge>
                            {c[ChallengeStatus.SENT].length}
                        </Badge>
                    </MenuItemLink>
            </div>
        );
        return (
                <Nav>
                    <ButtonGroup vertical className="col-lg-2 col-xs-12" role="group" aria-label="...">
                        <Button className={'active'}>
                            <Link to='home' params={{userId: this.getUserId()}}>
                                <Glyphicon glyph='home' />
                                {' ' + UserStore.get(this.getUserId()).name}
                            </Link>
                        </Button>
                        <Accordion className='challengePanel' style={{marginBottom: '0px'}}>
                            <Panel header={header} eventKey='1' >
                                {status}
                            </Panel>
                        </Accordion>
                         <Button>
                             <Link className='statsNav' to='stats' params={{userId: this.getUserId()}}>
                                <i className="fa fa-bar-chart">{' ' + 'Stats'}</i>
                            </Link>
                         </Button>
                    </ButtonGroup>
                </Nav>
        );
    }
});

module.exports = HomeApp;