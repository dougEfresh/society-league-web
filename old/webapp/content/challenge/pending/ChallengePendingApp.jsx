var React = require('react/addons');
var Router = require('react-router');
var GroupList = require('../group/GroupList.jsx');
var UserContextMixin = require('../../.././jsx/mixins/UserContextMixin.jsx');
var DataStore = require('../../../jsx/stores/DataStore.jsx');
var Status = require('../../../lib/Status');

var ChallengePendingApp = React.createClass({
    mixins: [UserContextMixin,Router.Navigation,Router.State],
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
    _onChange: function() {
       this.forceUpdate();
    },
    render: function() {
        var user = this.getUser();
        if (!user.challenge) {
            return null;
        }
        var challenges = user.getChallenges(Status.PENDING);
            if (this.getUser().challenges[Status.PENDING].length == 0 && this.isActive(Status.PENDING.toLowerCase())) {
            setTimeout(function() {
                this.transitionTo('challengeMain');
            }.bind(this),250);
            return (<div><p>You have no challenges accepted</p></div>);
        }
        if (this.getUser().challenges[Status.PENDING].length == 0) {
            return null;
        }
        return (
            <div id='pending-app' className="panel panel-danger">
                <div className="panel-heading" >
                    <span className={"glyphicon glyphicon-alert"}></span>Pending</div>
                <GroupList type={Status.PENDING} noSelect={false} challengeGroups={challenges}/>

            </div>
        )
    }
});

module.exports = ChallengePendingApp;

