var React = require('react/addons');
var ChallengeAcceptedList = require('./ChallengeApprovedList.jsx')
var ChallengeStatus = require('../../../constants/ChallengeStatus.jsx');

var ChallengeAcceptedApp = React.createClass({
    render: function(){
        return (
            <div>
                <ChallengeAcceptedList type={ChallengeStatus.ACCEPTED}/>
            </div>
        )
    }
});

module.exports = ChallengeAcceptedApp;
