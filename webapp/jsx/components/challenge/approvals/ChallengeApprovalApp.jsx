var React = require('react/addons');
var ChallengeStore = require('../../../stores/ChallengeStore.jsx');
var ChallengeApprovalList = require('./ChallengeApprovalList.jsx');
var ChallengeStatus = require('../../../constants/ChallengeStatus.jsx');

var ChallengeApprovalApp = React.createClass({
        render: function(){
          return (
              <ChallengeApprovalList type={ChallengeStatus.PENDING} />
          )
    }
});

module.exports = ChallengeApprovalApp;