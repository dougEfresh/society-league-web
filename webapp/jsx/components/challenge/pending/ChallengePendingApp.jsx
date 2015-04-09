var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Panel = Bootstrap.Panel
    ,Badge = Bootstrap.Badge;

var ChallengeStore = require('../../../stores/ChallengeStore.jsx');
var ChallengeActions = require('../../../actions/ChallengeActions.jsx');
var UserStore = require('../../../stores/UserStore.jsx');
var ChallengeRequestedList = require('./ChallengePendingList.jsx');
var DataFactory = require('../../../DataFactoryMixin.jsx');

var ChallengeRequestedApp = React.createClass({
    mixins: [DataFactory],
    propTypes: {
        user: ReactPropTypes.object.isRequired
    },
    getInitialState: function() {
        return {requested: []};
    },
    componentDidMount: function() {
        if (this.props.user.id == 0) {
            return;
        }
        this.getData('/api/challenge/' + this.props.user.id, function(p) {
             this.setState({requested: p});
         }.bind(this));
    },
    isValid: function() {

    },
    render: function(){
        if (this.state.requested == undefined || this.state.requested.length <= 0) {
            return null;
        }
        var title = (<div>Requested<span></span><Badge>{this.state.requested.length}</Badge></div>);
        return (
            <div>
                <Panel collapsable defaultCollapsed header={title}>
                    <ChallengeRequestedList requests={this.state.requested.PENDING}/>
                </Panel>
            </div>
        )
    }
});

module.exports = ChallengeRequestedApp;
