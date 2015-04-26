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
    , Link = Router.Link
    , RouteHandler = Router.RouteHandler;

var ChallengeStore = require('../../stores/ChallengeStore.jsx');
var UserStore = require('../../stores/UserStore.jsx');
var ChallengeActions = require('../../actions/ChallengeActions.jsx');
var ChallengeStatus = require('../../constants/ChallengeStatus.jsx');
var DataFactory = require('./../../DataFactoryMixin.jsx');
var LeagueNav = require('./LeagueNav.jsx');


var SocietyNav = React.createClass({
    mixins: [DataFactory],
    renderLoginNav: function() {
        var homeLink = (<Link className="logo" to='home' params={{userId: this.getUserId()}}></Link>);
        return (
            <Navbar id={'custom-bootstrap-menu'} style={{margin: '0px 0px', padding: '0px 0px' }} left brand={homeLink} toggleNavKey={'0'}>
                <CollapsableNav eventKey={'login'}>
                    <Nav id={'navbar'} navbar>
                        <NavItem href='http://www.societybilliards.com/corkroom'>Corkroom</NavItem>
                        <NavItem href='http://www.societybilliards.com/events'>Events</NavItem>
                        <NavItem href='http://www.societybilliards.com/menu'>Menu</NavItem>
                        <NavItem href='http://www.societybilliards.com/proshop'>Proshop</NavItem>
                        <NavItem href='http://www.societybilliards.com/press'>Press</NavItem>
                        <NavItem href='http://www.societybilliards.com/media'>Media</NavItem>
                        <NavItem href='http://www.societybilliards.com/contact'>Contact</NavItem>
                        <NavItemLink eventKey={'login'} to={'login'} params={{userId: 0}}>Login</NavItemLink>
                    </Nav>
                </CollapsableNav>
            </Navbar>
        );
    },
    render: function() {
        return (
            <div>
                <div className="navbar-wrapper">
                    <div className="container">
                        {this.renderLoginNav()}
                    </div>
                </div>
                <LeagueNav />
            </div>
        );
    }
});

module.exports = SocietyNav;
