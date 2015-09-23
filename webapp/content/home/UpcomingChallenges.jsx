var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var UserLink= require('../../jsx/components/links/UserLink.jsx');
var TeamLink= require('../../jsx/components/links/TeamLink.jsx');
var moment = require('moment');
var Util = require('../../jsx/util.jsx');
var Handicap = require('../../lib/Handicap');
var Status = require('../../lib/Status');
var ChallengPendingApp = require('../challenge/ChallengePendingApp.jsx');
var ChallengAcceptedApp = require('../challenge/ChallengePendingApp.jsx');

var UpcomingChallenges = React.createClass({
    mixins: [UserContextMixin,Router.History],
    getInitialState: function() {
         return {
             data: []
        }
    },
    componentWillMount: function() {
    },
    componentWillUnmount: function() {
    },
    componentDidMount: function() {
        Util.getData('/api/challenge/user/' + this.getUser().id, function(d){
            this.setState({data: d});
        }.bind(this), null, 'UpComingChallenge');
    },
    cancel: function(e) {
        e.preventDefault();
        //ChallengeActions.cancelChallenge(this.getUserId(),this.props.challengeGroup);
        var request = {
            challenger: null,
            opponent: null,
            challenges: [e.target.id]
        };
        //this.transitionTo('challengeCancel',{},request);
        //util.sendStatus('/api/challenge/' + Status.CANCELLED.toLowerCase() + '/' + this.getUser().id,request);
    },
    render: function() {
        var user = this.getUser();
        if (!user.challenge || this.state.data.length == 0) {
            return null;
        }
        var challenges = [];
        var pending = [];
        for (var i=0; i< this.state.data.length ; i++) {
            var challenge = this.state.data[i];
            if (challenge.status  == Status.ACCEPTED) {
                challenges.push(<ChallengeAcceptedApp key={challenge.id} challenge={challenge} />);
            }
            if (challenge.status  == Status.PENDING) {
                pending.push(<ChallengePendingApp key={challenge.id} challenge={challenge} />);
            }
        }
        var upComingChallenges = null;
        var pendingChallenges = null;
        if (challenges.length > 0) {
            upComingChallenges = ( <div id={'pending-challenges'} className="panel panel-default">
                  <div className="panel-heading" >Upcoming Challenges</div>
                  <div className="panel-body" >
                      <ul className="list-group home-upcoming-challenges">
                          {challenges}
                      </ul>
                  </div>
              </div>);
        }

        if (pending.length > 0) {
               pendingChallenges = ( <div id={'pending-challenges'} className="panel panel-warning">
                  <div className="panel-heading" >Pending Challenges</div>
                  <div className="panel-body" >
                      <ul className="list-group home-upcoming-challenges">
                          {pending}
                      </ul>
                  </div>
              </div>);

        }

        return (
            <div>
                {pendingChallenges}
                {upComingChallenges}
            </div>
        )
    }
});

module.exports = UpcomingChallenges;