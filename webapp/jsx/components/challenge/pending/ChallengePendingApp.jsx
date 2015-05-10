var React = require('react/addons');
var GroupList = require('../group/GroupList.jsx');
var UserContextMixin = require('../../../UserContextMixin.jsx');
var ChallengeStatus  = require('../../../constants/ChallengeStatus.jsx');
var DataStore = require('../../../stores/DataStore.jsx');

var ChallengePendingApp = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function () {
        return  {
            challengeGroups: []
        };
    },
    componentWillMount: function () {
        DataStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function () {
        DataStore.removeChangeListener(this._onChange);
    },
    componentDidMount: function () {
        if (this.getUser().userId != 0 && this.getUser().challenges != undefined)
            this.setState({challengeGroups: this.getUser().challenges[ChallengeStatus.PENDING]});
    },
    componentWillReceiveProps: function() {

    },
    _onChange: function() {
        this.setState({challengeGroups: this.getUser().challenges[ChallengeStatus.PENDING]});
    },
    render: function() {
        return (
            <div id="pendingApp">
                <GroupList type={ChallengeStatus.PENDING} noSelect={false} challengeGroups={this.state.challengeGroups}/>
            </div>
        )
    }
});

module.exports = ChallengePendingApp;

