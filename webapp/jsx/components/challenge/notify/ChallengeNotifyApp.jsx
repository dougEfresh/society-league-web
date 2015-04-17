var React = require('react/addons');
var ChallengeNotifyList = require('./ChallengeNotifyList.jsx');
var ChallengeStatus = require('../../../constants/ChallengeStatus.jsx');

var ChallengeNotifyApp = React.createClass({
    render: function(){
        return (
            <div>
                <ChallengeNotifyList type={ChallengeStatus.NEEDS_NOTIFY}/>
            </div>
        )
    }
});

module.exports = ChallengeNotifyApp;