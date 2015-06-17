var React = require('react/addons');
var Router = require('react-router');
var GroupList = require('../group/GroupList.jsx');
var UserContextMixin = require('../../.././jsx/mixins/UserContextMixin.jsx');
var ChallengeStatus  = require('../../../jsx/constants/ChallengeStatus.jsx');
var DataStore = require('../../../jsx/stores/DataStore.jsx');
var Status = require('../../../lib/Status');

var ChallengePendingApp = React.createClass({
    mixins: [UserContextMixin,Router.Navigation],
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
            this.setState({challengeGroups: this.getUser().challenges[ChallengeStatus.PENDING]});
    },
    componentWillReceiveProps: function() {

    },
    _onChange: function() {
        if (this.getUser().userId != 0 && this.getUser().challenges != undefined &&
            this.getUser().challenges[ChallengeStatus.PENDING] != undefined) {
            this.setState({challengeGroups: this.getUser().challenges[ChallengeStatus.PENDING]});
        }
    },
    render: function() {
        var user = this.getUser();
        var challenges = user.getChallenges(Status.PENDING);
        if (challenges.length == 0) {
            return null;
        }
        /*
         if (challenges.length == 0) {
             setTimeout(function() {
                this.transitionTo('accepted');
                }.bind(this),250);
            return (<div><p>You have no pending challenges</p></div>)
        }
        */

        return (
            <div id='pending-app' className="panel panel-danger">
                <div className="panel-heading" >  <span className={"glyphicon glyphicon-alert"}></span>Pending</div>
                <div className="panel-body" >
                    <GroupList type={ChallengeStatus.PENDING} noSelect={false} challengeGroups={challenges}/>
                </div>
            </div>
        )
    }
});

module.exports = ChallengePendingApp;

