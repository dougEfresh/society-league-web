var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Panel = Bootstrap.Panel
    ,Badge = Bootstrap.Badge;

var ChallengeStore = require('../../../stores/ChallengeStore.jsx');
var ChallengeActions = require('../../../actions/ChallengeActions.jsx');
var UserStore = require('../../../stores/UserStore.jsx');
var ChallengeRequestedList = require('./ChallengeSentList.jsx');
var DataFactory = require('../../../DataFactoryMixin.jsx');
var ChallengeAppMixin = require('../ChallengeAppMixin.jsx');
var ChallengeStatus = require('../../../constants/ChallengeStatus.jsx');

var ChallengeSentApp = React.createClass({
    mixins: [DataFactory,ChallengeAppMixin],
    getDefaultProps: function(){
        return {
            type : ChallengeStatus.SENT
        }
    },
    render: function() {
        if (!this.shouldRender()) {
            return null;
        }
         return (
            <div>
                <ChallengeRequestedList type={this.props.type} requests={this.getRequests()}/>
            </div>
        )
    }
});

module.exports = ChallengeSentApp;
