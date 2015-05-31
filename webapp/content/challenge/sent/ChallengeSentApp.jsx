var React = require('react/addons');
var GroupList = require('../group/GroupList.jsx');
var UserContextMixin = require('../../../jsx/mixins/UserContextMixin.jsx');
var ChallengeStatus  = require('../../../jsx/constants/ChallengeStatus.jsx');
var DataStore = require('../../../jsx/stores/DataStore.jsx');

var Bootstrap = require('react-bootstrap')
    ,Panel = Bootstrap.Panel;

var ChallengeSentApp = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function () {
        return  {
            challengeGroups: []
        };
    },
    componentWillMount: function () {
        DataStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function () {
        DataStore.removeChangeListener(this._onChange);
    },
    componentDidMount: function () {
        if (this.getUser().userId != 0 && this.getUser().challenges != undefined)
            this.setState({challengeGroups: this.getUser().challenges[ChallengeStatus.SENT]});
    },
    componentWillReceiveProps: function() {

    },
    _onChange: function() {
        if (this.getUser().userId != 0 && this.getUser().challenges != undefined) {
            this.setState(
                {challengeGroups: this.getUser().challenges[ChallengeStatus.SENT]}
            );
        }
    },
    render: function(){
        if (this.state.challengeGroups.length == 0) {
            return (<Panel><div><p>You have not sent any challenges</p></div></Panel>)
        }
        return (
            <div id="sent-app">
                <GroupList type={ChallengeStatus.SENT} noSelect={true} challengeGroups={this.state.challengeGroups}/>
            </div>
        )
    }
});

module.exports = ChallengeSentApp;