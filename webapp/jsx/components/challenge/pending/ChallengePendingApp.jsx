var React = require('react/addons');
var GroupList = require('../group/GroupList.jsx');
var GroupAppMixin = require('../group/GroupAppMixin.jsx');
var ChallengeStatus  = require('../../../constants/ChallengeStatus.jsx');

var ChallengePendingApp = React.createClass({
    mixins: [GroupAppMixin],
    getDefaultProps: function () {
        return  {
            type: ChallengeStatus.PENDING
        };
    },
    render: function(){
        return (
            <div>
                <GroupList noSelect={false} challengeGroups={this.state.challengeGroups}/>
            </div>
        )
    }
});

module.exports = ChallengePendingApp;

