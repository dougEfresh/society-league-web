var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router')
    ,Link = Router.Link;
var UserContextMixin = require('../UserContextMixin.jsx');

var UserLink = React.createClass({
    mixins: [UserContextMixin],
    propTypes: {
        user: ReactPropTypes.object.isRequired
    },
    getDefaultProps: function(){
        return {
            user: null,
            router: null
        }
    },
    render: function() {
        if (this.props.user == null) {
            return null;
        }
        return (
            <a className="userLink" href={'#/app/stats/' + this.props.user.userId}>
                {this.props.user.name}
            </a>
        );
    }
});

module.exports = UserLink;