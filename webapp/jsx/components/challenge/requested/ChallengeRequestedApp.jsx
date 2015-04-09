var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Panel = Bootstrap.Panel
    ,Badge = Bootstrap.Badge;

var ChallengeStore = require('../../../stores/ChallengeStore.jsx');
var ChallengeActions = require('../../../actions/ChallengeActions.jsx');
var UserStore = require('../../../stores/UserStore.jsx');
var ChallengeRequestedList = require('./ChallengeRequestedList.jsx');
var DataFactory = require('../../../DataFactoryMixin.jsx');

var ChallengeRequestedApp = React.createClass({
    mixins: [DataFactory],
    propTypes: {
        userId: ReactPropTypes.number.isRequired,
        requests: ReactPropTypes.object.isRequired
    },
    getRequested: function() {
        var requested = [];
        if (this.props.requests.PENDING == undefined) {
            return requested;
        }
        this.props.requests.PENDING.forEach(function(r) {
            if (r.challenger.id == this.props.userId) {
                requested.push(r);
            }
        }.bind(this));
        return requested;
    },
    render: function(){
        var title = (<div>Requested<span></span><Badge>{this.getRequested().length}</Badge></div>);
        return (
            <div>
                <Panel collapsable defaultCollapsed header={title}>
                    <ChallengeRequestedList requests={this.getRequested()}/>
                </Panel>
            </div>
        )
    }
});

module.exports = ChallengeRequestedApp;
