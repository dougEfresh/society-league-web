var React = require('react/addons');
var Router = require('react-router')
    , Link = Router.Link;
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');

var AdminNav = React.createClass({
    mixins: [UserContextMixin,Router.State,Router.Navigation],
    render: function() {
        var active = null;
        var user = this.getUser();
        if (this.isActive('admin')) {
            active="active";
        }
        if (!user.admin) {
            return null;
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
                        <Link className='navName' to='challengeAdminResults' >
                            Enter Results
                        </Link>
                    </li>
                    <li className="teamNavLink" role="presentation">
                        <Link className='navName' to='createUser' params={{userId: this.getUserId()}} >
                            <span className="fa fa-user"></span>Create User
                        </Link>
                    </li>
                    <li className="teamNavLink" role="presentation">
                        <Link className='navName' to='challenges'>
                            <span className="fa fa-trophy"></span>Challenges
                        </Link>
                    </li>
                    <li className="teamNavLink" role="presentation">
                        <Link className='navName' to='challengeUsers' >
                            <span className="fa fa-users"></span>Challenge Users
                        </Link>
                    </li>
                </ul>
            </li>
        );
    }
});

module.exports = AdminNav;