var React = require('react/addons');
var GroupList = require('../group/GroupList.jsx');
var UserContextMixin = require('../../../jsx/mixins/UserContextMixin.jsx');
var ChallengeStatus  = require('../../../jsx/constants/ChallengeStatus.jsx');
var DataStore = require('../../../jsx/stores/DataStore.jsx');
var Router = require('react-router');

var ChallengeAcceptedApp = React.createClass({
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
            this.setState({challengeGroups: this.getUser().challenges[ChallengeStatus.ACCEPTED]});
    },
    componentWillReceiveProps: function() {

    },
    _onChange: function() {
        if (this.getUser().userId != 0 && this.getUser().challenges != undefined)
            this.setState({challengeGroups: this.getUser().challenges[ChallengeStatus.ACCEPTED]});
    },
    render: function(){
        if (this.getUser().challenges[ChallengeStatus.ACCEPTED].length == 0) {
            /*
            setTimeout(function() {
                this.transitionTo('request');
                }.bind(this),250);
            return (<div><p>You have no challenges accepted</p></div>)
            */
            return null;
        }
        return (
              <div id='accepted-app' className="panel panel-success">
                    <div className="panel-heading" ><span className={"glyphicon glyphicon-calendar"}></span>Accepted</div>
                        <div className="panel-body" >
                            <GroupList type={ChallengeStatus.ACCEPTED} noSelect={false} challengeGroups={this.state.challengeGroups}/>
                        </div>
              </div>
        )
    }
});

module.exports = ChallengeAcceptedApp;