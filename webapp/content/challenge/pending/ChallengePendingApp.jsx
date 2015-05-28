var React = require('react/addons');
var GroupList = require('../group/GroupList.jsx');
var UserContextMixin = require('../../.././jsx/mixins/UserContextMixin.jsx');
var ChallengeStatus  = require('../../../jsx/constants/ChallengeStatus.jsx');
var DataStore = require('../../../jsx/stores/DataStore.jsx');
var Bootstrap = require('react-bootstrap')
    ,Panel = Bootstrap.Panel;
var Status = require('../../../lib/Status');

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
        if (this.getUser().userId != 0 && this.getUser().challenges != undefined &&
            this.getUser().challenges[ChallengeStatus.PENDING] != undefined) {
            this.setState({challengeGroups: this.getUser().challenges[ChallengeStatus.PENDING]});
        }
    },
    render: function() {
        var user = this.getUser();
        var challenges = user.getChallenges(Status.PENDING);
        if (challenges.length == 0) {
            return (<Panel><div><p>You have no pending challenges</p></div></Panel>)
        }
        return (
            <div id="pendingApp">
                <GroupList type={ChallengeStatus.PENDING} noSelect={false} challengeGroups={challenges}/>
            </div>
        )
    }
});

module.exports = ChallengePendingApp;

