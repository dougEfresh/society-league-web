var React = require('react/addons');
var ReactPropTypes = React.PropTypes;

var Bootstrap = require('react-bootstrap')
    ,Navbar = Bootstrap.Navbar
    ,Nav = Bootstrap.Nav
    ,DropdownButton = Bootstrap.DropdownButton
    ,DropdownMenu = Bootstrap.DropdownMenu
    ,Badge = Bootstrap.Badge
    ,NavItem = Bootstrap.NavItem
    ,CollapsableNav = Bootstrap.CollapsableNav
    ,MenuItem = Bootstrap.MenuItem;

var ReactRouterBootstrap = require('react-router-bootstrap')
    ,NavItemLink = ReactRouterBootstrap.NavItemLink
    ,MenuItemLink = ReactRouterBootstrap.MenuItemLink;
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler;

var ChallengeStore = require('../../stores/ChallengeStore.jsx');
var UserStore = require('../../stores/UserStore.jsx');
var ChallengeActions = require('../../actions/ChallengeActions.jsx');
var ChallengeStatus = require('../../constants/ChallengeStatus.jsx');
var StatActions = require('../../actions/StatActions.jsx');
var StatStore = require('../../stores/StatsStore.jsx');
var DataFactory = require('./../../DataFactoryMixin.jsx');

var Home = React.createClass({
    contextTypes: {
        router: React.PropTypes.func
    },
    render: function () {
        return (<div>Home</div>);
    }
});

var Navigator = React.createClass({
    mixins: [DataFactory],
     getInitialState: function() {
        return {
            challenges: ChallengeStore.getAllChallenges(),
            user: UserStore.get(),
            key: 'home'
        }
    },
    componentWillMount: function() {
        ChallengeStore.addRequestListener(this._onChallengeChange);
        ChallengeStore.addChangeListener(this._onChallengeChange);
        UserStore.addChangeListener(this._onUserChange);
    },
    componentDidMount: function() {
        ChallengeActions.initChallenges(this.getUserId());
        UserStore.getAllFromServer();
        StatStore.get();
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
        this.setState(
            {user: UserStore.get()}
        );
    },
    //<MenuItemLink to='account' params={{userId: this.getUserId()}} eventKey={"account"}>Account</MenuItemLink>
    //<NavItemLink to='admin' params={{userId: this.getUserId()}} eventKey={"admin"}>Admin</NavItemLink>
    render: function() {
        return (
            <div>
                <Navbar left inverse brand="Society" toggleNavKey={'0'}>
                     <CollapsableNav eventKey={'0'}>
                        <Nav bsStyle="pills" fluid fixedTop navbar>
                            <ChallengeNav challenges={this.state.challenges}/>
                            <NavItemLink to="stats" params={{userId: this.getUserId()}}>Stats</NavItemLink>
                            <DropdownButton eventKey={"user"} title={UserStore.getName(this.getUserId())} navItem={true}>
                                <MenuItemLink to="logout" params={{userId: this.getUserId()}} eventKey={"logout"}>Logout</MenuItemLink>
                            </DropdownButton>
                        </Nav>
                     </CollapsableNav>
                </Navbar>
                <RouteHandler />
            </div>
        );
    }
});

var ChallengeNav = React.createClass({
    mixins: [DataFactory],
    render: function() {
        var counter =  this.props.challenges[ChallengeStatus.SENT].length
            +
            this.props.challenges[ChallengeStatus.PENDING].length
            +
            this.props.challenges[ChallengeStatus.NOTIFY].length
            +
            this.props.challenges[ChallengeStatus.ACCEPTED].length;

        var indicator = (<span>Challenges <Badge>{counter}</Badge></span>);

        return (
            <NavItemLink to={ChallengeStatus.REQUEST.toLowerCase()} params={{userId: this.getUserId()}} eventKey={"challenge"} >{indicator}</NavItemLink>
        );
    }
});

module.exports = Navigator;
