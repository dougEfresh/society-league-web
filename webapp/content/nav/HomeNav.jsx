var React = require('react/addons');
var Router = require('react-router')
    , Link = Router.Link;
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');

var HomeNav = React.createClass({
    mixins: [UserContextMixin],
    contextTypes: {
        location: React.PropTypes.object
    },
    render: function() {
        var homeCls = this.props.location.pathname.indexOf("/app/home") > 0 ? "active" : "not-active";
        return (
              <li className={homeCls}>
                  <a onClick={this.goHome}  href="#"><i className="fa fa-fw fa-home"></i>Home</a>
              </li>
        );
    }
});

module.exports = HomeNav;
/*
<li className="teamNavLink" role="presentation">
    <Link className='navName' to='info' params={{userId: this.getUserId()}} >
        <span className="glyphicon glyphicon-info-sign"></span>Profile
    </Link>
</li>
    */