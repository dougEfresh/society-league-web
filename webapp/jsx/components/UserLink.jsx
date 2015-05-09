var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router')
    , Link = Router.Link;
var UserContextMixin = require('../UserContextMixin.jsx');

var UserLink = React.createClass({
    mixins: [UserContextMixin,Router.State],
    propTypes: {
        user: ReactPropTypes.object.isRequired
    },
    getDefaultProps: function(){
        return {
            user: null
        }
    },
    render: function() {
        if (this.props.user == null) {
            return null;
        }
        return (
            <Link className="userLink" to="stats" params={{userId: this.getUserId(), statsId: this.props.user.userId}}>
                {this.props.user.name}
            </Link>
        );
    }
});

module.exports = UserLink;