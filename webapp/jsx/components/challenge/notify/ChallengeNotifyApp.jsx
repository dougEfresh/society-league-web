var React = require('react/addons');
var GroupList = require('../group/GroupList.jsx');
var ChallengeStatus = require('../../../constants/ChallengeStatus.jsx');
var ChallengeStore = require('../../../stores/ChallengeStore.jsx');
var DataFactory = require('../../../DataFactoryMixin.jsx');

var ChallengeNotifyApp = React.createClass({
    mixins: [DataFactory],
    getInitialState: function() {
        return {
            challengeGroups: ChallengeStore.getChallenges(ChallengeStatus.NOTIFY)
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
        this.setState({challengeGroups: ChallengeStore.getChallenges(ChallengeStatus.NOTIFY)});
    },
    render: function(){
        return (
            <div>
                <GroupList noSelect={true} challengeGroups={this.state.challengeGroups}/>
            </div>
        )
    }
});

module.exports = ChallengeNotifyApp;