var React = require('react/addons');
var ChallengeSentList = require('./ChallengeSentList.jsx')
var ChallengeStatus = require('../../../constants/ChallengeStatus.jsx');

var ChallengeSentApp = React.createClass({
    render: function(){
        return (
            <div>
                <ChallengeSentList type={ChallengeStatus.SENT}/>
            </div>
        )
    }
});

module.exports = ChallengeSentApp;
