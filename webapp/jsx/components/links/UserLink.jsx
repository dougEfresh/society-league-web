var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router')
    ,Link = Router.Link;
var UserContextMixin = require('../../mixins/UserContextMixin.jsx');

var UserLink = React.createClass({
    mixins: [UserContextMixin],
    propTypes: {
        user: ReactPropTypes.object.isRequired
    },
    getDefaultProps: function(){
        return {
            user: null,
            seasonId: 0
        }
    },
    toString: function() {
        return this.props.user.sName();
    },
    render: function() {
        if (this.props.user == null || !(this.props.user instanceof Object)) {
            return null;
        }
        return (
                <Link to='stats' params={{statsId: this.props.user.userId}}>
                    {this.props.user.sName()}
                </Link>
        );
    }
});

module.exports = UserLink;
