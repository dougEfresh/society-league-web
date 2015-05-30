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
    getInitialState: function(){
        return {
            potentials: []
        }
    },
    componentDidMount: function() {
        var potentials  = [];
        for(var u in this.getUsers()) {
            var user = this.getUser(u);
            if (user.isChallenge() && user.userId != this.getUserId() ) {
                potentials.push(this.getUser(user.userId));
            }
        }
        this.setState({potentials: potentials});
    },
    onChange: function(e) {
        var q = this.getQuery();
        q.opponent = e.target.value;
        this.transitionTo('request',this.getParams(),q);
    },
    getOptions: function() {
        var options = [];
        options.push(<option key={0} value={0}>{'------'}</option>);
        this.state.potentials.forEach(function(p) {
            options.push(<option key={p.userId} value={p.userId}>{p.name}</option>);
        }.bind(this));
        return options;
    },
    render: function() {
        var q = this.getQuery();
        var opponent = q.opponent != undefined ? q.opponent : 0;
        return (
            <Input type='select' value={opponent} ref='opponents' label={'Choose Your Enemy'} onChange={this.onChange} >{this.getOptions()}</Input>
        );
    }
});

module.exports = ChallengeRequestOpponent;