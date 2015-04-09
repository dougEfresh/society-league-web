var React = require('react/addons');
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Panel = Bootstrap.Panel;

var ChallengeStore = require('../../stores/ChallengeStore.jsx');
var ChallengeActions = require('../../actions/ChallengeActions.jsx');
var UserStore = require('../../stores/UserStore.jsx');
var ChallengeRequestedApp = require('./requested/ChallengeRequestedApp.jsx');
var ChallengeRequestApp = require('./request/ChallengeRequestApp.jsx');

var ChallengeApp = React.createClass({
    contextTypes: {
        router: React.PropTypes.func
    },
    getInitialState: function() {
        return {
            challenge: ChallengeStore.get(),
            userId: parseInt(this.context.router.getCurrentParams().userId)
        }
    },
    componentDidMount: function() {
        ChallengeStore.addChangeListener(this._onChallengeChange);
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
                <ChallengeRequestedApp userId={this.state.userId}/>
                <ChallengeRequestApp userId={this.state.userId} challenge={this.state.challenge}/>
            </div>
        )
    }
});

module.exports = ChallengeApp;