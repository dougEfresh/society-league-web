var React = require('react/addons');
var ChallengeApprovalList = require('./ChallengeApprovalList.jsx');
var ChallengeStatus = require('../../../constants/ChallengeStatus.jsx');

var ChallengeApprovalApp = React.createClass({
    render: function(){
        return (
            <div>
                <ChallengeApprovalList type={ChallengeStatus.PENDING} />
            </div>
        )
    }
});

module.exports = ChallengeApprovalApp;