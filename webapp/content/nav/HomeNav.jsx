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
        if (this.isActive('home') || this.isActive('default') ) {
            active="active";
        }
        return (
            <li id="home-nav" role="presentation" className={active}>
                <Link className='navName' to='home'>
                    <Glyphicon glyph='home' />
                    <span className="main-item">{' ' + this.getUser().name} </span>
                </Link>
            </li>
        );
    }
});

module.exports = HomeNav;