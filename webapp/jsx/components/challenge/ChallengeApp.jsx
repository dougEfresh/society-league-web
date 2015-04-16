var React = require('react/addons');
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Alert = Bootstrap.Alert
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
            requests : requests,
            submitted: false
        }
    },
    componentDidMount: function() {
        ChallengeStore.addChangeListener(this._onRequestChange);
        ChallengeStore.addListener(this._onChange);
        this.getData('/api/challenge/' + this.getUserId(), function(p) {
             this.setState({requests: p});
         }.bind(this));
    },
    componentWillUnmount: function() {
        ChallengeStore.removeChangeListener(this._onRequestChange);
        ChallengeStore.removeAddListener(this._onChange);
    },
    _onRequestChange: function() {
        this.setState({challenge: ChallengeStore.get()});
    },
    _onChange: function() {
        this.getData('/api/challenge/' + this.getUserId(), function(p) {
            this.setState({requests: p, submitted: true});
        }.bind(this));
    },
    handleDismiss: function(){
        this.setState({submitted :false});
    },
    render: function() {
        var alert = null;
        if (this.state.submitted) {
            alert = (
                <Alert bsStyle='success' >
                    Successfully Sent Request
                     <Button onClick={this.handleDismiss}>Hide</Button>
                </Alert>
            );
        }

        return (
            <div>
                {alert}
                <ChallengeNotifyApp requests={this.state.requests} />
                <ChallengeApprovalApp  requests={this.state.requests} />
                <ChallengeRequestApp  challenge={this.state.challenge}/>
                <ChallengeSentApp  requests={this.state.requests} />
            </div>
        )
    }
});

module.exports = ChallengeApp;