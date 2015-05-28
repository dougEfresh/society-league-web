var React = require('react/addons');
var ReactPropTypes = React.PropTypes;

var UserContextMixin = require('../../../mixins/UserContextMixin.jsx');
var BallIcon = require('../../BallMixin.jsx');

var GroupListMixin = {
    mixins: [UserContextMixin,BallIcon],
    propTypes: {
        challengeGroup:   ReactPropTypes.object.isRequired,
        noSelect:  ReactPropTypes.bool.isRequired
    }
};

module.exports = GroupListMixin;