var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Bootstrap = require('react-bootstrap')
    ,Input = Bootstrap.Input;

var UserContextMixin = require('../../../mixins/UserContextMixin.jsx');
var RequestActions = require('../../../actions/RequestActions.jsx');


var ChallengeRequestOpponent = React.createClass({
    mixins: [UserContextMixin],
    propTypes: {
        opponent: ReactPropTypes.object.isRequired
    },
    contextTypes: {
        router: React.PropTypes.func
    },
    getInitialState: function(){
        return {
            potentials: []
        }
    },
    getDefaultProps: function () {
        return {
            opponent : {userId:0}
        }
    },
    componentDidMount: function() {
        for(var u in this.getUsers()) {
            var user = this.getUser(u);
            if (user.challenge && user.userId != this.getUserId() ) {
                this.state.potentials.push(this.getUser(user.userId));
            }
        }
    },
    onChange: function(e) {
        this.state.potentials.forEach(function(p) {
            if (p.userId == e.target.value) {
                RequestActions.setOpponent(p);
            }
        }.bind(this));
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
        return (
            <Input type='select' value={this.props.opponent.userId} ref='opponents' label={'Choose Your Enemy'} onChange={this.onChange} >{this.getOptions()}</Input>
        );
    }
});

module.exports = ChallengeRequestOpponent;