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
var UserContextMixin = require('../../mixins/UserContextMixin.jsx');

var HomeNav = React.createClass({
    mixins: [UserContextMixin,Router.State,Router.Navigation],
    render: function() {
        return (
            <li role="presentation" className="active">
                <Link className='navName' to='home'>
                    <Glyphicon glyph='home' />
                    {' ' + this.getUser().name}
                </Link>
            </li>
        );
    }
});

module.exports = HomeNav;