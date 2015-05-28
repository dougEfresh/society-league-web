var React = require('react/addons');
var ReactPropTypes = React.PropTypes;

var UserContextMixin = require('../../../jsx/mixins/UserContextMixin.jsx');
var BallIcon = require('../../../jsx/components/BallMixin.jsx');

var GroupListMixin = {
    mixins: [UserContextMixin,BallIcon],
    propTypes: {
        challengeGroup:   ReactPropTypes.object.isRequired,
        noSelect:  ReactPropTypes.bool.isRequired
    }
};

module.exports = GroupListMixin;