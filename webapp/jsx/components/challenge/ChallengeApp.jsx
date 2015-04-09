var React = require('react/addons');
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Panel = Bootstrap.Panel;

var ChallengeStore = require('../../stores/ChallengeStore.jsx');
var ChallengeActions = require('../../actions/ChallengeActions.jsx');
var UserStore = require('../../stores/UserStore.jsx');
var ChallengeRequestedApp = require('./requested/ChallengeRequestedApp.jsx');
var ChallengeRequestApp = require('./request/ChallengeRequestApp.jsx');
var ChallengePendingApp = require('./pending/ChallengePendingApp.jsx');

var DataFactory = require('../../DataFactoryMixin.jsx');

var ChallengeApp = React.createClass({
    mixins: [DataFactory],
    getInitialState: function() {
        return {
            challenge: ChallengeStore.get(),
            requests: {}
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
                <ChallengeRequestedApp userId={this.getUserId()} requests={this.state.requests} />
                <ChallengePendingApp userId={this.getUserId()} requests={this.state.requests} />
                <ChallengeRequestApp userId={this.getUserId()} challenge={this.state.challenge}/>
            </div>
        )
    }
});

module.exports = ChallengeApp;