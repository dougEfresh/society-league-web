var React = require('react/addons');
var ChallengeApprovalList = require('./ChallengeApprovalList.jsx');
var ChallengeStatus = require('../../../constants/ChallengeStatus.jsx');

var ChallengeApprovalApp = React.createClass({
    render: function(){
        return (
            <div>
                Needs Approval
            </div>
        )
    }
});

module.exports = ChallengeApprovalApp;