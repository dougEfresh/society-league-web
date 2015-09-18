var React = require('react/addons');
var Router = require('react-router')
    , Link = Router.Link;
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');

var AdminNav = React.createClass({
    mixins: [UserContextMixin],
    contextTypes: {
        location: React.PropTypes.object
    },
    render: function() {
        var active = null;
        var user = this.getUser();
        if (this.context.location.pathname.indexOf('admin') >=0) {
            active="active";
        }
        if (!user.admin) {
            console.log('warning user is not admin')
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
                        <Link className='navName' to='/app/admin/users'>
                            <span className="fa fa-user"></span>Users
                        </Link>
                    </li>
                      <li className="teamNavLink" role="presentation">
                        <Link className='navName' to='/app/admin/seasons'>
                            <span className="fa fa-user"></span>Seasons
                        </Link>
                    </li>
                    <li className="teamNavLink" role="presentation">
                        <Link className='navName' to='/app/admin/results'>
                            <span className="fa fa-user"></span>Team Results
                        </Link>
                    </li>
                     <li className="teamNavLink" role="presentation">
                        <Link className='navName' to='/app/admin/results'>
                            <span className="fa fa-user"></span>Player Results
                        </Link>
                    </li>
                </ul>
            </li>
        );
    }
});

module.exports = AdminNav;