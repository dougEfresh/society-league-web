var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Bootstrap = require('react-bootstrap')
    ,Input = Bootstrap.Input;

var DataFactory = require('../../../DataFactoryMixin.jsx');
var ChallengeActions = require('../../../actions/ChallengeActions.jsx');

var ChallengeRequestOpponent = React.createClass({
    mixins: [DataFactory],
    propTypes: {
        userId: ReactPropTypes.number.isRequired,
        opponent: ReactPropTypes.object.isRequired
    },
    contextTypes: {
        router: React.PropTypes.func
    },
    getInitialState: function(){
        return {
            potentials: {}
        }
    },
    getDefaultProps: function () {
        return {
            opponent : {id: 0}
        }
    },
    update: function(props) {
        this.getData('/api/challenge/potentials/' + props.userId, function (potentials) {
            var opponents = {};
            potentials.forEach(function(p){
                opponents[p.userId] = p;
            });
            this.setState({potentials: opponents});
        }.bind(this));
    },
    componentWillReceiveProps: function(props) {
       if (props.userId == this.props.userId) {
           return;
       }
        this.update(props);
    },
    componentDidMount: function() {
        this.update(this.props);
    },
    onChange: function(e) {
        ChallengeActions.setOpponent(this.state.potentials[e.target.value]);
    },
    getOptions: function() {
        var options = [];
        options.push(<option key={0} value={0}>{'------'}</option>);
        for (var key in this.state.potentials) {
            options.push(<option key={key} value={key}>{this.state.potentials[key].user.name}</option>);
        }
        return options;
    },
    render: function() {
        return (
            <Input type='select' value={this.props.opponent.user.id} ref='opponents' label={'Choose Your Enemy'} onChange={this.onChange} >{this.getOptions()}</Input>
        );
    }
});

module.exports = ChallengeRequestOpponent;