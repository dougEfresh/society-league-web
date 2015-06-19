var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router');
var UserContextMixin = require('../../../jsx/mixins/UserContextMixin.jsx');
var SeasonMixin = require('../../../jsx/mixins/SeasonMixin.jsx');

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
        for(var i = 0; i < users.length ; i++) {
            var user = users[i];
            if (user.isChallenge() && user.userId != this.getUserId() ) {
                potentials.push(user);
            }
        }
        options.push(<option key={0} value={0}>{'Choose Your Enemy'}</option>);
        potentials.forEach(function(p) {
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
                          {this.getOptions()}</select>
                    </div>
              </div>
        );
    }
});

var ChallengeRequestRace = React.createClass({
    render: function() {

    }
});

module.exports = ChallengeRequestOpponent;