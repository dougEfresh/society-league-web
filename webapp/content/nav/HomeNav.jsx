var React = require('react/addons');
var Router = require('react-router')
    , Link = Router.Link;
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');

var HomeNav = React.createClass({
    mixins: [UserContextMixin,Router.State,Router.Navigation],

    render: function() {
        var active=null;
        if (this.isActive('home') || this.isActive('default') | this.isActive('user')) {
            active="active";
        }

        return (
            <li id="home-nav" role="presentation" className={'dropdown ' + active}>
               <a className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-expanded="false">
                   <span className="glyphicon glyphicon-home"></span>Home
                   <span className="main-item">{' ' + this.getUser().name} </span>
                   <span className="caret"></span>
               </a>
                <ul className="dropdown-menu" role="menu">
                    <li className="teamNavLink" role="presentation">
                        <Link className='navName' to='home'>
                            <span className="glyphicon glyphicon-home"></span>Home
                        </Link>
                    </li>
                    <li className="teamNavLink" role="presentation">
                        <Link className='navName' to='info' params={{userId: this.getUserId()}} >
                             <span className="glyphicon glyphicon-info-sign"></span>User
                        </Link>
                    </li>
                    <li className="teamNavLink" role="presentation">
                        <Link to='reset' query={{changePassword: true}}>
                            <span className="glyphicon glyphicon-copyright-mark"></span>Change Password</Link>
                    </li>
                </ul>
            </li>
        );
    }
});

module.exports = HomeNav;
