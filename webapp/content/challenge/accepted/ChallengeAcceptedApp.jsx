var React = require('react/addons');
var GroupList = require('../group/GroupList.jsx');
var UserContextMixin = require('../../../jsx/mixins/UserContextMixin.jsx');
var Status  = require('../../../lib/Status');
var DataStore = require('../../../jsx/stores/DataStore.jsx');
var Router = require('react-router');

var ChallengeAcceptedApp = React.createClass({
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
    render: function(){
        if (this.getUser().challenges[Status.ACCEPTED].length == 0 && this.isActive(Status.ACCEPTED.toLowerCase())) {
            setTimeout(function() {
                this.transitionTo('challengeMain');
            }.bind(this),350);
            return (<div><p>You have no challenges accepted</p></div>);
        }
        if (this.getUser().challenges[Status.ACCEPTED].length == 0) {
            return null;
        }
        return (
                <div id='accepted-app' className="panel panel-success">
                  <div className="panel-heading" ><span className={"glyphicon glyphicon-calendar"}></span>Accepted</div>
                        <GroupList type={Status.ACCEPTED} noSelect={false} challengeGroups={this.getUser().challenges[Status.ACCEPTED]}/>
                </div>
        )
    }
});

module.exports = ChallengeAcceptedApp;