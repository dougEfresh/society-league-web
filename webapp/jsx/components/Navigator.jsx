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
    propTypes: {
        user: ReactPropTypes.object.isRequired
    },
    getInitialState: function() {
        return {
            key: 'home'
        }
    },
    componentWillReceiveProps: function (nextProps) {
        console.log('NEW ' + JSON.stringify( nextProps));
    },
    render: function() {
        //<CollapsableNav bsStyle="pills" fluid fixedTop activeKey={this.state.key} eventKey={'0'}>
        return (
            <div>
                <Navbar left inverse brand="Society" toggleNavKey={'0'}>
                    <CollapsableNav eventKey={'0'}>
                        <Nav bsStyle="pills" fluid fixedTop navbar>
                            <NavItemLink to='stats' params={{userId: this.props.user.id}} eventKey={"Stats"}>Stats</NavItemLink>
                            <ChallengeNav userId={this.props.user.id} />
                            <NavItemLink  to='admin' eventKey={"admin"}>Admin</NavItemLink>
                        </Nav>
                        <Nav navbar right>
                            <DropdownButton pullRight eventKey={"user"} title={this.props.user.name} navItem={true}>
                                <MenuItemLink  to='account' params={{userId: this.props.user.id}} eventKey={"account"}>Account</MenuItemLink>
                                <MenuItem href="/api/logout" eventKey={"logout"}>Logout</MenuItem>
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
    propTypes: {
        userId: ReactPropTypes.number.isRequired
    },
    mixins: [DataFactory],
    getInitialState: function() {
        return {
            sent: 0,
            pending: 0
        }
    },
    componentWillReceiveProps: function (nextProps) {
        if (nextProps.userId != this.props.userId) {
            this.update(nextProps.userId);
        }
    },
    componentDidMount: function() {
        this.update(this.props.userId);
     },
    update: function(user) {
        this.getData('/api/challenge/counters/' + user, function(d) {
            this.setState(
                {sent: d[0], pending:d[1]}
            );
        }.bind(this));
    },
    render: function() {
        var indicator = (<span>Challenges <Badge>{this.state.sent + this.state.pending}</Badge></span>);
        return (
            <NavItemLink to='challenge' params={{userId: this.props.userId}} eventKey={"challenge"} >{indicator}</NavItemLink>
        );
    }
});

module.exports = Navigator;
