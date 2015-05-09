var React = require('react/addons');
var GroupList = require('../group/GroupList.jsx');
var UserContextMixin = require('../../../UserContextMixin.jsx');
var ChallengeStatus  = require('../../../constants/ChallengeStatus.jsx');
var DataStore = require('../../../stores/DataStore.jsx');

var ChallengePendingApp = React.createClass({
    mixins: [UserContextMixin],
    getDefaultProps: function () {
        return  {
            type: ChallengeStatus.PENDING
        };
    },
    componentWillMount: function () {
        DataStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function () {
        DataStore.removeChangeListener(this._onChange);
    },
    componentDidMount: function () {
        this.setState({user: this.getUser()});
    },
    componentWillReceiveProps: function() {
        this.setState({seasonId: this.getParams().seasonId});
    },
    _onChange: function() {
        this.setState({challengeGroups: this.getUser().challenges[this.props.type]});
    },
    render: function(){
        return (
            <div id="pendingApp">
                <GroupList noSelect={false} challengeGroups={this.state.challengeGroups}/>
            </div>
        )
    }
});

module.exports = ChallengePendingApp;

