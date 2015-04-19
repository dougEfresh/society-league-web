var React = require('react/addons');
var RequestList = require('../group/GroupList.jsx');
var ChallengeStatus = require('../../../constants/ChallengeStatus.jsx');
var ChallengeStore = require('../../../stores/ChallengeStore.jsx');
var DataFactory = require('../../../DataFactoryMixin.jsx');

var ChallengeSentApp = React.createClass({
    mixins: [DataFactory],
    getInitialState: function() {
        return {
            challengeGroups: ChallengeStore.getChallenges(ChallengeStatus.SENT)
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
    _onChange: function() {
        this.setState({challengeGroups: ChallengeStore.getChallenges(ChallengeStatus.SENT)});
    },
    render: function(){
        return (
            <div>
                <RequestList noSelect={true} challengeGroups={this.state.challengeGroups}/>
            </div>
        )
    }
});

module.exports = ChallengeSentApp;
