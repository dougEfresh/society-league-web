var React = require('react/addons');
var GroupList = require('../group/GroupList.jsx');
var ChallengeStatus = require('../../../constants/ChallengeStatus.jsx');
var ChallengeStore = require('../../../stores/ChallengeStore.jsx');
var DataFactory = require('../../../DataFactoryMixin.jsx');

var ChallengePendingApp = React.createClass({
    mixins: [DataFactory],
    getInitialState: function() {
        return {
            challengeGroups: ChallengeStore.getChallenges(ChallengeStatus.PENDING)
        }
    },
    componentWillMount: function() {
        ChallengeStore.addChangeListener(this._onChange);
        ChallengeStore.addRequestListener(this._onChange);
    },
    componentWillUnmount: function() {
        ChallengeStore.removeRequestListener(this._onChange);
        ChallengeStore.removeChangeListener(this._onChange);
    },
    componentDidMount: function() {
        console.log('Pending  mounted');
        this.setState({challengeGroups: ChallengeStore.getChallenges(ChallengeStatus.PENDING)});
    },
    _onChange: function() {
        this.setState({challengeGroups: ChallengeStore.getChallenges(ChallengeStatus.PENDING)});
    },
    render: function(){
        return (
            <div>
                <GroupList noSelect={false} challengeGroups={this.state.challengeGroups}/>
            </div>
        )
    }
});

module.exports = ChallengePendingApp;