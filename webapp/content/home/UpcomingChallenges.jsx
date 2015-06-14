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

var UpcomingChallenges = React.createClass({
    mixins: [UserContextMixin,Router.State,Router.Navigation],
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
        for (var i=0; i<upComingChallenges.length && i< 3; i++) {
            var match = upComingChallenges[i];
            var m = moment(match.selectedSlot.date);
            matches.push(
                <div key={match.getId()} >
                <span id={'challenge-'+ match.getId()} className="next-match">
                    {m.format('ddd MMM Do ') + ' at '  + m.format('HH:mm a') + ' vs. '}
                    <UserLink user={match.getUserOpponent(this.getUser())}/>
                </span>
                    <Link to={Status.ACCEPTED.toLowerCase()}>
                        <button type="button" className="btn btn-sm btn-danger pull-right btn-responsive">
                            <span className="glyphicon glyphicon-remove"></span> <b>Cancel</b>
                        </button>
                    </Link>
                </div>
            );
        }
        if (matches.length == 0) {
            return (
                <div id={'upcoming-challenges'} className="panel panel-default">
                    <div className="panel-heading" >Upcoming Challenges</div>
                        <div className="panel-body" >
                            <span id="no-challenges">You have no matches scheduled</span>
                        </div>
                </div>
            )
        }
        return (
              <div id={'upcoming-challenges'} className="panel panel-default">
                    <div className="panel-heading" >Upcoming Challenges</div>
                        <div className="panel-body" >
                                {matches}
                        </div>
              </div>
        )
    }
});

module.exports = UpcomingChallenges;
