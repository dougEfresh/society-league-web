var React = require('react/addons');
var ReactPropTypes = React.PropTypes;

var ChallengeStatus = require('../../../constants/ChallengeStatus.jsx');
var ChallengeStore = require('../../../stores/ChallengeStore.jsx');
var ChallengeGroupStore = require('../../../stores/ChallengeGroupStore.jsx');
var UserContextMixin = require('../../../mixins/UserContextMixin.jsx');
var DataStore = require('../../../stores/DataStore.jsx');

var GroupAppMixin = {
    mixins: [UserContextMixin],
    getInitialState: function() {
        return {
            challengeGroups: this.getUser().challenges[this.props.type]
        }
    },
    componentWillMount: function () {
        DataStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function () {
        DataStore.removeChangeListener(this._onChange);
    },
    componentDidMount: function () {
        this.setState({user: this.getUser()});
    },
    componentWillReceiveProps: function() {
        this.setState({seasonId: this.getParams().seasonId});
    },
    _onChange: function() {
        this.setState({challengeGroups: this.getUser().challenges[this.props.type]});
    }
};

module.exports = GroupAppMixin;