var React = require('react/addons');
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Panel = Bootstrap.Panel
    ,Badge = Bootstrap.Badge;

var ChallengeStore = require('../../stores/ChallengeStore.jsx');
var ChallengeActions = require('../../actions/ChallengeActions.jsx');
var UserStore = require('../../stores/UserStore.jsx');
var ChallengePendingList = require('./ChallengePendingList.jsx');

var Util = require('../../util.jsx');

var ChallengePendingApp = React.createClass({
    contextTypes: {
        router: React.PropTypes.func
    },
    getInitialState: function() {
        return {
            pending: null,
            user: UserStore.get()
        }
    },
    componentDidMount: function() {
        ChallengeStore.addListener(this._onChallengeChange);
        UserStore.addChangeListener(this._onUserChange);
        Util.getData('/api/challenge/pending/' + this.state.user.id, function(p) {
             this.setState({pending: p});
         }.bind(this));
    },
    componentWillUnmount: function() {
        ChallengeStore.removeAddListener(this._onChallengeChange);
        UserStore.removeChangeListener(this._onUserChange);
    },
    _onChallengeChange: function() {
        //this.setState({pending: ChallengeStore.getPending()});
    },
    _onUserChange: function() {
        this.setState({user: UserStore.get()});
    },
    isValid: function() {

    },
    render: function(){
        if (this.state.pending == null) {
            return null;
        }
        var title = (<div>Pending<span></span><Badge>{this.state.pending.length}</Badge></div>);
        return (
            <div>
                <Panel collapsable defaultCollapsed header={title}>
                    <ChallengePendingList pending={this.state.pending}/>
                </Panel>
            </div>
        )
    }
});

module.exports = ChallengePendingApp;
