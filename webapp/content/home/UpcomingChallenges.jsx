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
        for (var i=0; i< this.state.data.length ; i++) {
            var challenge = this.state.data[i];
            if (challenge.status != Status.ACCEPTED) {
                continue;
            }
            var m = moment(challenge.date);
            var opponent =  challenge.userOpponent;
            if (opponent.id == this.getUser().id) {
                opponent = challenge.userChallenger;
            }
           challenges.push(
                <li key={challenge.id} className="list-group-item col-lg-12 col-xs-12">
                    <div className="col-lg-10 col-md-10 col-xs-12">
                    <span id={'challenge-'+ challenge.id} className="next-match pull-left">
                        {m.format('ddd MMM Do ') + ' at '  + m.format('h:mm a') + ' vs. '}
                        <UserLink user={opponent}/>
                    </span>
                    </div>
                    <div className="col-lg-2 col-md-2 col-xs-12">
                        <button onClick={this.cancel}
                                type="button"
                                className="btn btn-sm btn-danger btn-responsive">
                            <span  className="glyphicon glyphicon-remove"></span>
                            <b id={challenge.id}>Decline Challenge</b>
                        </button>
                    </div>
                </li>
            );
        }
        if (challenges.length == 0) {
            return null;
        }
        return (
              <div id={'upcoming-challenges'} className="panel panel-default">
                    <div className="panel-heading" >Upcoming Challenges</div>
                        <div className="panel-body" >
                        <ul className="list-group home-upcoming-challenges">
                            {challenges}
                        </ul>
                        </div>
              </div>
        )
    }
});

module.exports = UpcomingChallenges;