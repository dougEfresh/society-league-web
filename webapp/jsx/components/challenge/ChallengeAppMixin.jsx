var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Bootstrap = require('react-bootstrap')
    ,Badge = Bootstrap.Badge;

var ChallengeAppMixin = {
    propTypes: {
        requests: ReactPropTypes.object.isRequired,
        type: ReactPropTypes.string.isRequired
    },
    shouldRender: function() {
        return this.props.requests[this.props.type].length > 0;
    },
    getRequests: function() {
        return this.props.requests[this.props.type];
    },
    getTitle: function() {

        return (<div>{this.props.type} <span></span><Badge>{this.getRequests().length}</Badge></div>);
    }
};

module.exports = ChallengeAppMixin;