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

var AdminNav = React.createClass({
    mixins: [UserContextMixin,Router.State,Router.Navigation],
    render: function() {
        var active = null;
        if (this.isActive('admin')) {
            active="active";
        }
        return (
            <li id="admin-nav" role="presentation" className={'dropdown ' + active}>
               <a className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-expanded="false">
                   <span className="glyphicon glyphicon-cog"></span>
                   <span className="main-item">Admin</span>
                   <span className="caret"></span>
               </a>
                <ul className="dropdown-menu" role="menu">
                    <li className="teamNavLink" role="presentation">
                        <Link className='navName' to='info' params={{userId: this.getUserId()}} >
                            <span className="fa fa-trophy"></span>Challenge
                        </Link>
                    </li>
                    <li className="teamNavLink" role="presentation">
                        <Link className='navName' to='home'>
                            <span className="fa fa-users"></span>Teams
                        </Link>
                    </li>
                    <li className="teamNavLink" role="presentation">
                        <Link to='reset' query={{changePassword: true}}>
                            <span className="fa fa-server"></span>Seasons
                        </Link>
                    </li>
                </ul>
            </li>
        );
    }
});

module.exports = AdminNav;