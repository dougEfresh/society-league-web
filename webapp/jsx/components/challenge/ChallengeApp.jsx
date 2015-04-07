var React = require('react/addons');
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Panel = Bootstrap.Panel;

var ChallengeStore = require('../../stores/ChallengeStore.jsx');
var ChallengeActions = require('../../actions/ChallengeActions.jsx');
var UserStore = require('../../stores/UserStore.jsx');
var ChallengeSentApp = require('./ChallengeSentApp.jsx');
var ChallengeRequestApp = require('./ChallengeRequestApp.jsx');

var ChallengeApp = React.createClass({
    contextTypes: {
        router: React.PropTypes.func
    },
    getInitialState: function() {
        //TODO check router state
        return {
            user: UserStore.get(),
            challenge: ChallengeStore.get()
        }
    },
    componentDidMount: function() {
        ChallengeStore.addChangeListener(this._onChallengeChange);
        UserStore.addChangeListener(this._onUserChange);
    },
    componentWillUnmount: function() {
        ChallengeStore.removeChangeListener(this._onChallengeChange);
        UserStore.removeChangeListener(this._onUserChange);
    },
    _onChallengeChange: function() {
        this.setState({challenge: ChallengeStore.get()});
    },
    _onUserChange: function() {
        this.setState({user: UserStore.get()});
    },
    render: function() {
        if (this.state.user.id == 0) {
            console.log('--- You need to be logged in ---');
            this.context.router.transitionTo(
                'login',null,
                {from: this.context.router.getCurrentPath()}
            );
            return null;
        }
        return (
            <div>
                <ChallengeSentApp user={this.state.user}/>
                <ChallengeRequstApp user={this.state.user} challenge={this.state.challenge}/>
            </div>
        )
    }
});

module.exports = ChallengeApp;