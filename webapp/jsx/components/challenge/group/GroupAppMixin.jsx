var React = require('react/addons');
var ReactPropTypes = React.PropTypes;

var ChallengeStatus = require('../../../constants/ChallengeStatus.jsx');
var ChallengeStore = require('../../../stores/ChallengeStore.jsx');
var ChallengeGroupStore = require('../../../stores/ChallengeGroupStore.jsx');

var GroupAppMixin = {
    getInitialState: function() {
        return {
            challengeGroups: ChallengeStore.getChallenges(this.props.type)
        }
    },
    componentWillMount: function() {
        console.log(this.props.type + ' will mount');
        ChallengeGroupStore.addChangeListener(this._onChange);
        ChallengeStore.addChangeListener(this._onChange);
        ChallengeGroupStore.setChallengeGroups(ChallengeStore.getChallenges(this.props.type));
    },
    componentWillUnmount: function() {
        console.log(this.props.type + 'unmounted');
        ChallengeStore.removeChangeListener(this._onChange);
        ChallengeGroupStore.removeChangeListener(this._onChange);
    },
    componentDidMount: function() {
        console.log(this.props.type + ' mounted');
        this.setState({challengeGroups: ChallengeStore.getChallenges(this.props.type)});
    },
    _onChange: function() {
        this.setState({challengeGroups: ChallengeStore.getChallenges(this.props.type)});
    }
};

module.exports = GroupAppMixin;