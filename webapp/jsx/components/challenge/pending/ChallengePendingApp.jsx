var React = require('react/addons');
var GroupList = require('../group/GroupList.jsx');
var UserContextMixin = require('../../../UserContextMixin.jsx');
var ChallengeStatus  = require('../../../constants/ChallengeStatus.jsx');
var DataStore = require('../../../stores/DataStore.jsx');
var Bootstrap = require('react-bootstrap')
    ,Panel = Bootstrap.Panel;

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
        if (this.state.challengeGroups.length == 0) {
            return (<Panel><div><p>You have no challenges pending</p></div></Panel>)
        }
        return (
            <div id="pendingApp">
                <GroupList type={ChallengeStatus.PENDING} noSelect={false} challengeGroups={this.state.challengeGroups}/>
            </div>
        )
    }
});

module.exports = ChallengePendingApp;

