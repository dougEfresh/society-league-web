var React = require('react/addons');
var ReactPropTypes = React.PropTypes;

var Bootstrap = require('react-bootstrap')
    ,Navbar = Bootstrap.Navbar
    ,Nav = Bootstrap.Nav
    ,DropdownButton = Bootstrap.DropdownButton
    ,DropdownMenu = Bootstrap.DropdownMenu
    ,Badge = Bootstrap.Badge
    ,NavItem = Bootstrap.NavItem
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
    contextTypes: {
        router: React.PropTypes.func
    },
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
        return (
            <div>
            <Navbar inverse brand="Society" toggleNavKey={this.state.key}>
            <Nav bsStyle="pills" fluid fixedTop activeKey={this.state.key} toggleNavKey={this.state.key}>
                <NavItemLink to='stats' params={{userId: this.props.user.id}} eventKey={"Stats"}>Stats</NavItemLink>
                <ChallengeNav user={this.props.user} />
                <DropdownButton pullRight eventKey={"user"} title={this.props.user.name} navItem={true}>
                    <MenuItemLink  to='account' params={{userId: this.props.user.id}} eventKey={"account"}>Account</MenuItemLink>
                    <MenuItem href="/api/logout" eventKey={"logout"}>Logout</MenuItem>
                </DropdownButton>
                <DropdownButton pullRight eventKey={"admin"} title={'Admin'} navItem={true}>
                    <MenuItemLink  to='account' params={{userId: this.props.user.id}} eventKey={"account"}>Account</MenuItemLink>
                </DropdownButton>
            </Nav>
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
            sent: 0,
            pending: 0
        }
    },
    componentWillReceiveProps: function (nextProps) {
        if (nextProps.user.id != this.props.user.id) {
            this.update(nextProps.user);
        }
    },
    componentDidMount: function() {
        if (this.props.user.id != 0)
            this.update(this.props.user);

     },
    update: function(user) {
        this.getData('/api/challenge/counters/' + user.id, function(d) {
            this.setState(
                {sent: d[0], pending:d[1]}
            );
        }.bind(this));
    },
    render: function() {
        var indicator = 'Challenges';
        if (this.state.requested + this.state.requested > 0) {
            indicator = (<span>Challenges <Badge>{this.state.requested + this.state.requested}</Badge></span>);
        }
        return (
            <NavItemLink to='challenge' eventKey={"challenge"} >{indicator}</NavItemLink>
        );
    }
});

module.exports = Navigator;
