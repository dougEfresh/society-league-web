var React = require('react/addons');
var ReactPropTypes = React.PropTypes;

var DataFactory = require('../../DataFactoryMixin.jsx');
var BallIcon = require('../../BallMixin.jsx');

var RequestMixin = {
    mixins: [DataFactory,BallIcon],
    propTypes: {
        request:   ReactPropTypes.object.isRequired,
        noSelect:  ReactPropTypes.bool.isRequired
    }
};

module.exports = RequestMixin;