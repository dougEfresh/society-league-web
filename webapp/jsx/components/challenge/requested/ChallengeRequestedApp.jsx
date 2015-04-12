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
var ChallengeAppMixin = require('../ChallengeAppMixin.jsx');
var ChallengeStatus = require('../../../constants/ChallengeStatus.jsx');

var ChallengeRequestedApp = React.createClass({
    mixins: [DataFactory,ChallengeAppMixin],
    getDefaultProps: function(){
        return {
            type : ChallengeStatus.REQUESTED
        }
    },
    render: function() {
        if (!this.shouldRender()) {
            return null;
        }
         return (
            <div>
                <Panel collapsable defaultCollapsed header={this.getTitle()}>
                    <ChallengeRequestedList type={this.props.type} requests={this.getRequests()}/>
                </Panel>
            </div>
        )
    }
});

module.exports = ChallengeRequestedApp;
