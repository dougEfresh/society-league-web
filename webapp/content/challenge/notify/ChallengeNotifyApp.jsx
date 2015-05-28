var React = require('react/addons');
var GroupList = require('../group/GroupList.jsx');
var GroupAppMixin = require('../group/GroupAppMixin.jsx');
var ChallengeStatus  = require('../../../jsx/constants/ChallengeStatus.jsx');

var ChallengeNotifyApp = React.createClass({
    mixins: [GroupAppMixin],
    getDefaultProps: function () {
        return  {
            type: ChallengeStatus.NOTIFY
        };
    },
    render: function(){
        return (
            <div id="notifyApp">
                <GroupList noSelect={true} challengeGroups={this.state.challengeGroups}/>
            </div>
        )
    }
});

module.exports = ChallengeNotifyApp;