var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var UserLink= require('../../jsx/components/links/UserLink.jsx');
var TeamLink= require('../../jsx/components/links/TeamLink.jsx');
var moment = require('moment');
var Status = require('../../lib/Status');
var slotDao = require('../../lib/SlotDao');
var MatchDao = require('../../lib/dao/MatchDao');
var util = require('../challenge/challengeUtil');
var Handicap = require('../../lib/Handicap');

var UpcomingChallenges = React.createClass({
    mixins: [UserContextMixin,Router.State,Router.Navigation],
      cancel: function(e) {
        e.preventDefault();
        //ChallengeActions.cancelChallenge(this.getUserId(),this.props.challengeGroup);
        var request = {
            challenger: null,
            opponent: null,
             challenges: [{id: e.target.id}]
        };
        this.transitionTo('challengeCancel',{},request);
        //util.sendStatus('/api/challenge/' + Status.CANCELLED.toLowerCase() + '/' + this.getUser().id,request);
    },
    render: function() {
        if (this.getUser().id == 0) {
            return null;
        }
        if (!this.getUser().isChallenge()) {
            return null;
        }
        var matchDao = new MatchDao(this.getDb());
        var upComingChallenges = matchDao.getUpcomingChallenges(this.getUser());

        var matches = [];
        for (var i=0; i<upComingChallenges.length ; i++) {
            var match = upComingChallenges[i];
            var m = moment(match.selectedSlot.date);
            var opponent = match.getUserOpponent(this.getUser());
            var hc = Handicap.race(this.getUser().getRawChallengeHandicap(), opponent.getRawChallengeHandicap());
            matches.push(
                <li key={match.getId()} className="list-group-item col-lg-12 col-xs-12">
                    <div className="col-lg-10 col-md-10 col-xs-12">
                    <span id={'challenge-'+ match.getId()} className="next-match pull-left">
                        {m.format('ddd MMM Do ') + ' at '  + m.format('HH:mm a') + ' vs. '}
                        <UserLink user={opponent}/>
                        <span>{' (' + opponent.getChallengeHandicap() + ' ' + hc + ') '}</span>
                    </span>
                    </div>
                    <div className="col-lg-2 col-md-2 col-xs-12">
                        <button onClick={this.cancel}
                                type="button"
                                className="btn btn-sm btn-danger btn-responsive">
                            <span  className="glyphicon glyphicon-remove"></span>
                            <b id={match.getId()}>Cancel</b>
                        </button>
                    </div>
                </li>
            );
        }
        if (matches.length == 0) {
            return null;
            /*
            return (
                <div id={'upcoming-challenges'} className="panel panel-default">
                    <div className="panel-heading" >Upcoming Challenges</div>
                        <div className="panel-body" >
                            <span id="no-challenges">You have no matches scheduled</span>
                        </div>
                </div>
            )
            */
        }
        return (
              <div id={'upcoming-challenges'} className="panel panel-default">
                    <div className="panel-heading" >Upcoming Challenges</div>
                        <div className="panel-body" >
                        <ul className="list-group home-upcoming-challenges">
                            {matches}
                        </ul>
                        </div>
              </div>
        )
    }
});

module.exports = UpcomingChallenges;
