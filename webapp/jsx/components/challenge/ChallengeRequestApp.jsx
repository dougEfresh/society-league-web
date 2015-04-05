var React = require('react/addons');
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
            challenge: ChallengeStore.get(),
            user: UserStore.get()
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
    render: function(){
        var c = this.state.challenge;
        return (
            <div>
                <ChallengeRequestDate  date={c.date} />
                <ChallengeRequestSlots date={c.date} slots={c.slots} />
                <ChallengeRequestOpponent user={this.state.user} opponent={c.opponent} />
                <ChallengeRequestGame game={c.game} />
            </div>
        )
    }
});

module.exports = ChallengeRequestApp;