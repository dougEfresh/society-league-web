var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Bootstrap = require('react-bootstrap')
    ,Badge = Bootstrap.Badge;
var ChallengeStatus = require('../../constants/ChallengeStatus.jsx');

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
        if (this.props.type == ChallengeStatus.NEEDS_NOTIFY) {
            return (<div>Needs Notification<span></span><Badge>{this.getRequests().length}</Badge></div>);
        }
        if (this.props.type == ChallengeStatus.PENDING) {
            return (<div>Approval Required<span></span><Badge>{this.getRequests().length}</Badge></div>);
        }
        if (this.props.type == ChallengeStatus.SENT) {
            return (<div>Sent Request<span></span><Badge>{this.getRequests().length}</Badge></div>);
        }
        return (<div>{this.props.type} <span></span><Badge>{this.getRequests().length}</Badge></div>);
    }
};

module.exports = ChallengeAppMixin;