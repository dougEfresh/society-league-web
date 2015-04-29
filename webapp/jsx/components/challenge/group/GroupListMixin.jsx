var React = require('react/addons');
var ReactPropTypes = React.PropTypes;

var DataFactory = require('../../../UserContextMixin.jsx');
var BallIcon = require('../../../BallMixin.jsx');

var GroupListMixin = {
    mixins: [DataFactory,BallIcon],
    propTypes: {
        challengeGroup:   ReactPropTypes.object.isRequired,
        noSelect:  ReactPropTypes.bool.isRequired
    }
};

module.exports = GroupListMixin;