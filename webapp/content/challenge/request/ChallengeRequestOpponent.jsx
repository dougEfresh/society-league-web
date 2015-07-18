var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router');
var UserContextMixin = require('../../../jsx/mixins/UserContextMixin.jsx');
var SeasonMixin = require('../../../jsx/mixins/SeasonMixin.jsx');
var Handicap = require('../../../lib/Handicap');
var Status = require('../../../lib/Status');

var ChallengeRequestOpponent = React.createClass({
    mixins: [UserContextMixin,SeasonMixin,Router.Navigation,Router.State],
    contextTypes: {
        router: React.PropTypes.func
    },
    componentDidMount: function() {
    },
    onChange: function(e) {
        e.preventDefault();
        var q = this.getQuery();
        q.opponent = e.target.value;
        this.transitionTo('challengeMain',this.getParams(),q);
    },
    getOptions: function() {
        var options = [];
        var potentials  = [];
        var users = this.getUsers();
        var chosenDate = this.getQuery().date;

        for(var i = 0; i < users.length ; i++) {
            var user = users[i];
            if (user.isChallenge() && user.userId != this.getUserId() ) {
                potentials.push(user);
            }
        }
        options.push(<option key={0} value={0}>{'Choose Your Enemy'}</option>);

        potentials.forEach(function(p) {
            if (chosenDate) {
                var taken = false;
                p.challenges[Status.ACCEPTED].forEach(function (c) {
                    if (c.date == chosenDate) {
                        taken = true;
                    }
                }.bind(this));

                if (taken)
                    return;
            }
            options.push(<option key={p.userId} value={p.userId}>{p.name + ' (' + p.getChallengeHandicap() + ')'}</option>);
        }.bind(this));
        return options;
    },
    render: function() {
        var q = this.getQuery();
        var opponent = q.opponent != undefined ? q.opponent : 0;

        return (
              <div className="form-field form-group">
                  <div className="form-group">
                      <select name='challenge-opponent'
                              id='challenge-opponent'
                              className="form-control"
                              type='select'
                              value={opponent}
                              ref='opponents'
                              onChange={this.onChange} >
                          {this.getOptions()}
                      </select>
                    </div>
                  <ChallengeRequestRace />
              </div>
        );
    }
});

var ChallengeRequestRace = React.createClass({
    mixins: [UserContextMixin,SeasonMixin,Router.Navigation,Router.State],
    render: function() {
        var q = this.getQuery();
        if (q.opponent == undefined || q.opponent == 0)  {
            return null;
        }
        var opponent = this.getUser(q.opponent);
        return <span>Race: {Handicap.race(this.getUser().getRawChallengeHandicap(),opponent.getRawChallengeHandicap())}</span>
    }
});

module.exports = ChallengeRequestOpponent;