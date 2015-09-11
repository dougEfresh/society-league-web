var React = require('react/addons');
var GroupList = require('../group/GroupList.jsx');
var UserContextMixin = require('../../../jsx/mixins/UserContextMixin.jsx');
var DataStore = require('../../../jsx/stores/DataStore.jsx');
var Router = require('react-router');
var Status  = require('../../../lib/Status');

var ChallengeSentApp = React.createClass({
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
        if (this.getUser().challenges[Status.SENT].length == 0 && this.isActive(Status.SENT.toLowerCase())) {
            setTimeout(function() {
                this.transitionTo('challengeMain');
            }.bind(this),350);
            return (<div><p>You have no challenges accepted</p></div>);
        }
        if (this.getUser().challenges[Status.SENT].length == 0) {
            return null;
        }
                return (
                 <div id='sent-app' className="panel panel-info">
                    <div className="panel-heading" ><span className={"glyphicon glyphicon-ok"}></span>Sent</div>
                     <GroupList type={Status.SENT} noSelect={true} challengeGroups={this.getUser().challenges[Status.SENT]}/>

                 </div>

        )
    }
});

module.exports = ChallengeSentApp;