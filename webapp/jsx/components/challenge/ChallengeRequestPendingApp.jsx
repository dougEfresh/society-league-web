var React = require('react/addons');
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Panel = Bootstrap.Panel;

var ChallengeStore = require('../../stores/ChallengeStore.jsx');
var ChallengeActions = require('../../actions/ChallengeActions.jsx');
var UserStore = require('../../stores/UserStore.jsx');
var ChallengeRequestDate = require('./ChallengeRequestDate.jsx');
var ChallengeRequestSlots = require('./ChallengeRequestSlots.jsx');
var ChallengeRequestOpponent= require('./ChallengeRequestOpponent.jsx');
var ChallengeRequestGame= require('./ChallengeRequestGame.jsx');

var ChallengeRequestApp = React.createClass({
    contextTypes: {
        router: React.PropTypes.func
    },
    getInitialState: function() {
        //TODO check router state
        return {
            pending: ChallengeStore.getPending(UserStore.get()),
            user: UserStore.get()
        }
    },
    componentDidMount: function() {
        ChallengeStore.addListener(this._onChallengeChange);
        UserStore.addChangeListener(this._onUserChange);
    },
    componentWillUnmount: function() {
        ChallengeStore.removeAddListener(this._onChallengeChange);
        UserStore.removeChangeListener(this._onUserChange);
    },
    _onChallengeChange: function() {
        this.setState({pending: ChallengeStore.getPending()});
    },
    _onUserChange: function() {
        this.setState({user: UserStore.get()});
    },
    isValid: function() {
        return this.getErrors().length == 0;
    },
    render: function(){
        return (
            <div>
                <Panel header={'Pending'}>
                </Panel>
            </div>
        )
    }
});

module.exports = ChallengeRequestApp;