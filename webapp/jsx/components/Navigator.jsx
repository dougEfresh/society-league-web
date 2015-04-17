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

var ChallengeStore = require('../stores/ChallengeStore.jsx');
var ChallengeActions = require('../actions/ChallengeActions.jsx');
var ChallengeStatus = require('../constants/ChallengeStatus.jsx');
var DataFactory = require('./../DataFactoryMixin.jsx');

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
            key: 'home'
        }
    },
    componentDidMount: function() {
        ChallengeStore.addRequestListener(this._onChange);
        ChallengeStore.addChangeListener(this._onChange);
        ChallengeActions.setChallenges(this.getUserId());
    },
    componentWillUnmount: function() {
        ChallengeStore.removeChangeListener(this._onChange);
        ChallengeStore.removeRequestListener(this._onChange);
    },
    _onChange: function() {
        this.setState({challenges: ChallengeStore.getAllChallenges()});
    },
    render: function() {
        return (
            <div>
                <Navbar left inverse brand="Society" toggleNavKey={'0'}>
                    <CollapsableNav eventKey={'0'}>
                        <Nav bsStyle="pills" fluid fixedTop navbar>
                            <ChallengeNav challenges={this.state.challenges}/>
                        </Nav>
                        <Nav navbar right>
                            <DropdownButton pullRight eventKey={"user"} title={'name'} navItem={true}>
                                <MenuItemLink to='account' params={{userId: this.getUserId()}} eventKey={"account"}>Account</MenuItemLink>
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
    getInitialState: function() {
        return {
            counter: 0
        }
    },
    componentDidMount: function() {
        this.update(this.props);
     },
    componentWillReceiveProps: function (nextProps) {
        this.update(nextProps);
    },
    update: function(props) {
        this.setState({
            counter: props.challenges[ChallengeStatus.SENT].length
            +
            props.challenges[ChallengeStatus.PENDING].length
            +
            props.challenges[ChallengeStatus.NEEDS_NOTIFY].length
            +
            props.challenges[ChallengeStatus.ACCEPTED].length
        });
    },
    render: function() {
        var indicator = (<span>Challenges <Badge>{this.state.counter}</Badge></span>);
        return (
            <NavItemLink to='challenge' params={{userId: this.getUserId()}} eventKey={"challenge"} >{indicator}</NavItemLink>
        );
    }
});

module.exports = Navigator;
