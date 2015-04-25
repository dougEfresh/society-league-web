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
        var counter =  this.props.challenges[ChallengeStatus.SENT].length
            +
            this.props.challenges[ChallengeStatus.PENDING].length
            +
            this.props.challenges[ChallengeStatus.NOTIFY].length
            +
            this.props.challenges[ChallengeStatus.ACCEPTED].length;

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
                <Glyphicon glyph='alert' />
                Pending
                <Badge>{this.props.challenges[ChallengeStatus.PENDING].length}</Badge>
                <Glyphicon glyph='calendar' />
                Scheduled
                <Badge>{this.props.challenges[ChallengeStatus.ACCEPTED].length}</Badge>
                <Glyphicon glyph='ok' />
                Sent
                <Badge>{this.props.challenges[ChallengeStatus.SENT].length}</Badge>
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
                        <Accordion >
                            <Panel header={header} eventKey='1' >
                                {status}
                            </Panel>
                        </Accordion>
                    </ButtonGroup>
                </Nav>
        );
    }
});

//                        <div className="btn-group dropdown">
/*
 <a type="button" className="btn btn-default"  aria-expanded="false">
 <span className="glyphicon glyphicon-cog" aria-hidden="true"></span>
 Pending
 <Badge>{counter}</Badge>
 </a>

    getInitialState: function() {
        return {
            challenges: ChallengeStore.getAllChallenges()
        }
    },
    componentWillMount: function() {
        ChallengeStore.addRequestListener(this._onChallengeChange);
        ChallengeStore.addChangeListener(this._onChallengeChange);
        UserStore.addChangeListener(this._onUserChange);
    },
    componentWillUnmount: function() {
        ChallengeStore.removeChangeListener(this._onChallengeChange);
        ChallengeStore.removeRequestListener(this._onChallengeChange);
        UserStore.removeChangeListener(this._onUserChange);
    },

    _onChallengeChange: function() {
        this.setState(
            {challenges: ChallengeStore.getAllChallenges()}
        );
    },
    _onUserChange: function() {
    },
 */
module.exports = HomeApp;