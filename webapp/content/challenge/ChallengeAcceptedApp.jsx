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

var ChallengeAcceptedApp = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function() {
        return {challenge: this.props.challenge};
    },
    render: function() {
        if (this.state.challenge == undefined) {
            return null;
        }
        if (this.state.challenge.status != Status.ACCEPTED) {
            return null;
        }
        var challenge = this.state.challenge;
        var m = moment(challenge.date);
        var opponent = challenge.userOpponent;
        if (opponent.id == this.getUser().id) {
            opponent = challenge.userChallenger;
        }

        return (
              <tr>
                  <td className="datetime"> {m.format('MMM Do h:mm a')}</td>
                  <td className="user"> <UserLink user={opponent} season={this.props.challenge.season} /> </td>
                  <td className="decline-button">
                      <Link to={'/app/challenge/' + challenge.id + '/cancel'} >
                          <button type="button" className="btn btn-sm btn-danger btn-responsive">
                              <span className="glyphicon glyphicon-remove"></span>
                              <b className="decline" >Decline</b>
                          </button>
                      </Link>
                  </td>
              </tr>
        );
    }
});


module.exports = ChallengeAcceptedApp;