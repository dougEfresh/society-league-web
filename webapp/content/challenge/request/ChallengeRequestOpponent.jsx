var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Bootstrap = require('react-bootstrap')
    ,Input = Bootstrap.Input;
var Router = require('react-router');
var UserContextMixin = require('../../../jsx/mixins/UserContextMixin.jsx');

var ChallengeRequestOpponent = React.createClass({
    mixins: [UserContextMixin,Router.Navigation,Router.State],
    contextTypes: {
        router: React.PropTypes.func
    },
    componentDidMount: function() {
    },
    onChange: function(e) {
        var q = this.getQuery();
        q.opponent = e.target.value;
        this.transitionTo('request',this.getParams(),q);
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
            options.push(<option key={p.userId} value={p.userId}>{p.name}</option>);
        }.bind(this));
        return options;
    },
    render: function() {
        var q = this.getQuery();
        var opponent = q.opponent != undefined ? q.opponent : 0;
        return (
            <Input name='challenge-opponent' id='challenge-opponent' type='select' value={opponent} ref='opponents' onChange={this.onChange} >{this.getOptions()}</Input>
        );
    }
});

module.exports = ChallengeRequestOpponent;