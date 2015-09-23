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

var ChallengePendingApp =  React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function() {
        return {challenge: this.props.challenge};
    },
    render: function() {
        if (this.state.challenge == undefined) {
            return null;
        }
        if (this.state.challenge.status != Status.PENDING) {
            return null;
        }
        var challenge = this.state.challenge;
        var m = moment(challenge.date);
        var opponent = challenge.userOpponent;
        if (opponent.id == this.getUser().id) {
            opponent = challenge.userChallenger;
        }
        return (
            <li className="list-group-item col-lg-12 col-xs-12">
                <div className="col-lg-10 col-md-10 col-xs-12">
                    <span id={'challenge-'+ challenge.id} className="next-match pull-left">
                        {m.format('ddd MMM Do ') + ' at ' + m.format('h:mm a') + ' vs. '}
                        <UserLink user={opponent}/>
                    </span>
                </div>
                <div className="col-lg-2 col-md-2 col-xs-12">
                    <button onClick={this.cancel}
                            type="button"
                            className="btn btn-sm btn-danger btn-responsive">
                        <span className="glyphicon glyphicon-remove"></span>
                        <b id={challenge.id}>Decline Challenge</b>
                    </button>
                </div>
            </li>
        );
    }
});


module.exports = ChallengePendingApp;