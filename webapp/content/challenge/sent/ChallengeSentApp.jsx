var React = require('react/addons');
var GroupList = require('../group/GroupList.jsx');
var UserContextMixin = require('../../../jsx/mixins/UserContextMixin.jsx');
var ChallengeStatus  = require('../../../jsx/constants/ChallengeStatus.jsx');
var DataStore = require('../../../jsx/stores/DataStore.jsx');
var Router = require('react-router');

var ChallengeSentApp = React.createClass({
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
        if (this.getUser().challenges[ChallengeStatus.SENT].length == 0) {
            return null;
            /*
            setTimeout(function() {
                this.transitionTo('request');
                }.bind(this),250);
            return (<div><p>You have not sent any challenges</p></div>)
            */
        }
        return (
                 <div id='sent-app' className="panel panel-info">
                    <div className="panel-heading" ><span className={"glyphicon glyphicon-ok"}></span>Sent</div>
                        <div className="panel-body" >
                            <GroupList type={ChallengeStatus.SENT} noSelect={true} challengeGroups={this.state.challengeGroups}/>
                        </div>
                 </div>

        )
    }
});

module.exports = ChallengeSentApp;