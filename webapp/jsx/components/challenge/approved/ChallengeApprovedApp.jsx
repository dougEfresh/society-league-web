var React = require('react/addons');
var GroupList = require('../group/GroupList.jsx');
var GroupAppMixin = require('../group/GroupAppMixin.jsx');
var ChallengeStatus  = require('../../../constants/ChallengeStatus.jsx');

var ChallengeAcceptedApp = React.createClass({
    mixins: [GroupAppMixin],
    getDefaultProps: function () {
        return  {
            type: ChallengeStatus.ACCEPTED
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

module.exports = ChallengeAcceptedApp;