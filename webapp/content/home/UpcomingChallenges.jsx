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
var ChallengePendingApp = require('../challenge/ChallengePendingApp.jsx');
var ChallengeAcceptedApp = require('../challenge/ChallengeAcceptedApp.jsx');
var ChallengeSentApp = require('../challenge/ChallengeSentApp.jsx');

var UpcomingChallenges = React.createClass({
    mixins: [UserContextMixin,Router.History],
    render: function() {
        var user = this.getUser();
        if (!user.challenge || this.props.data.length == 0) {
            return null;
        }
        var challenges = [];
        var pending = [];
        var sent = [];
        for (var i=0; i< this.props.data.length ; i++) {
            var challenge = this.props.data[i];
            if (challenge.status  == Status.ACCEPTED) {
                challenges.push(<ChallengeAcceptedApp key={challenge.id} challenge={challenge} />);
            }
            if (challenge.status  == Status.PENDING && challenge.userOpponent.id == this.getUser().id ) {
                pending.push(<ChallengePendingApp key={challenge.id} challenge={challenge} />);
            }
            if (challenge.status  == Status.PENDING && challenge.userChallenger.id == this.getUser().id ) {
                sent.push(<ChallengeSentApp key={challenge.id} challenge={challenge} />);
            }
        }
        var upComingChallenges = null;
        var pendingChallenges = null;
        var sentChallenges = null;

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
        if (sent.length > 0) {
            sentChallenges = ( <div id={'pending-challenges'} className="panel panel-success">
                <div className="panel-heading" >Sent Challenges</div>
                <div className="panel-body" >
                    <ul className="list-group home-upcoming-challenges">
                        {sent}
                    </ul>
                </div>
            </div>);
        }

        return (
            <table className="table table-condensed table-striped table-responsive" >
                <thead>
                <tr><th></th></tr>
                </thead>
                <tbody></tbody>
                </table>
        );
        /*
                        <h4>Upcoming Challenges</h4>
                {challenges}

        return (
            <div>
                {pendingChallenges}
                {upComingChallenges}
                {sentChallenges}
            </div>
        )
        */
    }
});

module.exports = UpcomingChallenges;