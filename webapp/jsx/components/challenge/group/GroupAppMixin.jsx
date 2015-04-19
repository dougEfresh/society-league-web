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
        ChallengeStore.addChangeListener(this._onChallengeStoreChange);
        ChallengeGroupStore.setType(this.props.type);
    },
    componentWillUnmount: function() {
        console.log(this.props.type + 'unmounted');
        ChallengeGroupStore.setType(null);
        ChallengeStore.removeChangeListener(this._onChallengeStoreChange);
        ChallengeGroupStore.removeChangeListener(this._onChange);
    },
    componentDidMount: function() {
        console.log(this.props.type + ' mounted');
        this.setState({challengeGroups: ChallengeStore.getChallenges(this.props.type)});
    },
    _onChallengeStoreChange: function() {
        console.log('Challenge Store Change');
        this.setState({challengeGroups: ChallengeStore.getChallenges(this.props.type)});
    },
    _onChange: function() {
        console.log('ChallengeGroupStore Change: ' );
        this.setState({challengeGroups: ChallengeStore.getChallenges(this.props.type)});
    }
};

module.exports = GroupAppMixin;