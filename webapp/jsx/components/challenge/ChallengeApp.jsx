var React = require('react/addons');
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Panel = Bootstrap.Panel;

var ChallengeStore = require('../../stores/ChallengeStore.jsx');
var ChallengeActions = require('../../actions/ChallengeActions.jsx');
var UserStore = require('../../stores/UserStore.jsx');
var ChallengeRequestApp = require('./request/ChallengeRequestApp.jsx');

var ChallengeApprovalApp = require('./approvals/ChallengeApprovalApp.jsx');
var ChallengeSentApp = require('./sent/ChallengeSentApp.jsx');
var ChallengeNotifyApp = require('./notify/ChallengeNotifyApp.jsx');

var DataFactory = require('../../DataFactoryMixin.jsx');
var ChallengeStatus = require('../../constants/ChallengeStatus.jsx');

var ChallengeApp = React.createClass({
    mixins: [DataFactory],
    getInitialState: function() {
        var requests = {};
        requests[ChallengeStatus.PENDING] = [];
        requests[ChallengeStatus.NEEDS_NOTIFY] = [];
        requests[ChallengeStatus.CANCELLED] = [];
        requests[ChallengeStatus.SENT] = [];
        requests[ChallengeStatus.ACCEPTED] = [];
        return {
            challenge: ChallengeStore.get(),
            requests : requests
        }
    },
    componentDidMount: function() {
        ChallengeStore.addChangeListener(this._onChallengeChange);
        this.getData('/api/challenge/' + this.getUserId(), function(p) {
             this.setState({requests: p});
         }.bind(this));
    },
    componentWillUnmount: function() {
        ChallengeStore.removeChangeListener(this._onChallengeChange);
    },
    _onChallengeChange: function() {
        this.setState({challenge: ChallengeStore.get()});
    },
    render: function() {
        return (
            <div>
                <ChallengeRequestApp  challenge={this.state.challenge}/>
                <ChallengeNotifyApp requests={this.state.requests} />
                <ChallengeApprovalApp  requests={this.state.requests} />
                <ChallengeSentApp  requests={this.state.requests} />
            </div>
        )
    }
});

module.exports = ChallengeApp;