var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Panel = Bootstrap.Panel
    ,Badge = Bootstrap.Badge;

var ChallengeStore = require('../../stores/ChallengeStore.jsx');
var ChallengeActions = require('../../actions/ChallengeActions.jsx');
var UserStore = require('../../stores/UserStore.jsx');
var ChallengePendingList = require('./ChallengeSentList.jsx');
var Util = require('../../util.jsx');

var ChallengeSentApp = React.createClass({
    propTypes: {
        user: ReactPropTypes.object.isRequired
    },
    getInitialState: function() {
        return {pending: []};
    },
    componentDidMount: function() {
        if (this.props.user.id == 0) {
            return;
        }
        Util.getData('/api/challenge/pending/' + this.props.user.id, function(p) {
             this.setState({pending: p});
         }.bind(this));
    },
    isValid: function() {

    },
    render: function(){
        if (this.state.pending == undefined || this.state.pending.length <= 0) {
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

module.exports = ChallengeSentApp;
