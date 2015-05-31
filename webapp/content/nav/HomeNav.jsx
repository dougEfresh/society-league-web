var React = require('react/addons');
var Router = require('react-router')
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
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');

var HomeNav = React.createClass({
    mixins: [UserContextMixin,Router.State,Router.Navigation],

    render: function() {
        var active=null;
        if (this.isActive('home') || this.isActive('default') | this.isActive('user')) {
            active="active";
        }
        var icon = 'home';
        if (this.isActive('info')) {
            icon = 'info-sign';
        }
        if (this.isActive('password')) {
            icon = 'copyright-mark';
        }
        return (
            <li id="home-nav" role="presentation" className={'dropdown ' + active}>
               <a className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-expanded="false">
                   <Glyphicon glyph={icon} />
                   <span className="main-item">{' ' + this.getUser().name} </span>
                   <span className="caret"></span>
               </a>
                <ul className="dropdown-menu" role="menu">
                    <li className="teamNavLink" role="presentation">
                        <Link className='navName' to='home'>
                            <Glyphicon glyph='home' />Home
                        </Link>
                    </li>
                    <li className="teamNavLink" role="presentation">
                        <Link className='navName' to='info' params={{userId: this.getUserId()}} >
                            <Glyphicon glyph='info-sign' /> User
                        </Link>
                    </li>
                    <li className="teamNavLink" role="presentation">
                        <Link className='navName' to='password' params={{userId: this.getUserId()}}>
                             <Glyphicon glyph='copyright-mark' />Change Password</Link>
                    </li>
                </ul>
            </li>
        );
    }
});

module.exports = HomeNav;