var React = require('react/addons');
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Panel = Bootstrap.Panel;

var ChallengeStore = require('../../stores/ChallengeStore.jsx');
var ChallengeActions = require('../../actions/ChallengeActions.jsx');
var UserStore = require('../../stores/UserStore.jsx');
var ChallengeRequestApp = require('./request/ChallengeRequestApp.jsx');

var ChallengeRequestedApp = require('./requested/ChallengeRequestedApp.jsx');
var ChallengePendingApp = require('./pending/ChallengePendingApp.jsx');
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
        requests[ChallengeStatus.REQUESTED] = [];
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
                <ChallengeNotifyApp requests={this.state.requests} />
                <ChallengeRequestedApp  requests={this.state.requests} />
                <ChallengePendingApp  requests={this.state.requests} />

                <ChallengeRequestApp  challenge={this.state.challenge}/>
            </div>
        )
    }
});

module.exports = ChallengeApp;