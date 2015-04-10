
var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Panel = Bootstrap.Panel
    ,Badge = Bootstrap.Badge;

var ChallengeStore = require('../../../stores/ChallengeStore.jsx');
var ChallengeActions = require('../../../actions/ChallengeActions.jsx');
var UserStore = require('../../../stores/UserStore.jsx');
var DataFactory = require('../../../DataFactoryMixin.jsx');

var ChallengePendingApp = React.createClass({
    mixins: [DataFactory],
    propTypes: {
        userId: ReactPropTypes.number.isRequired,
        requests: ReactPropTypes.object.isRequired
    },
    getPending: function() {
        var requested = [];
        if (this.props.requests.PENDING == undefined) {
            return requested;
        }

        this.props.requests.PENDING.forEach(function(r) {
            if (r.challenger.id != this.props.userId) {
                requested.push(r);
            }
        }.bind(this));
        return requested;
    },
    render: function(){
        var title = (<div>Pending Approval<span></span><Badge>{this.getPending().length}</Badge></div>);
        return (
            <div>
                <Panel collapsable defaultCollapsed header={title}>
                </Panel>
            </div>
        )
    }
});
module.exports = ChallengePendingApp;
