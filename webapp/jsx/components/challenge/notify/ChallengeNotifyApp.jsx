var React = require('react/addons');
var GroupList = require('../group/GroupList.jsx');
var ChallengeStatus = require('../../../constants/ChallengeStatus.jsx');
var ChallengeStore = require('../../../stores/ChallengeStore.jsx');
var ChallengeGroupStore = require('../../../stores/ChallengeGroupStore.jsx');
var DataFactory = require('../../../DataFactoryMixin.jsx');

var ChallengeNotifyApp = React.createClass({
    mixins: [DataFactory],
    getDefaultProps: function () {
        return  {
            type: ChallengeStatus.NOTIFY
        };
    },
    getInitialState: function() {
        return {
            challengeGroups: ChallengeStore.getChallenges(this.props.type)
        }
    },
    componentWillMount: function() {
        ChallengeGroupStore.addChangeListener(this._onChange);
        ChallengeGroupStore.setChallengeGroups(ChallengeStore.getChallenges(this.props.type));
    },
    componentWillUnmount: function() {
        console.log('Notify UNmounted');
        ChallengeGroupStore.removeChangeListener(this._onChange);
    },
    componentDidMount: function() {
        console.log('Notify mounted');
        this.setState({challengeGroups: ChallengeStore.getChallenges(this.props.type)});
    },
    _onChange: function() {
        this.setState({challengeGroups: ChallengeStore.getChallenges(this.props.type)});
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