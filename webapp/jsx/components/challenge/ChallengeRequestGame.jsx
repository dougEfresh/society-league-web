var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Bootstrap = require('react-bootstrap')
    ,Input = Bootstrap.Input
    ,Badge = Bootstrap.Badge;

var ChallengeActions = require('../../actions/ChallengeActions.jsx');

var ChallengeRequestGame = React.createClass({
    propTypes: {
        game: ReactPropTypes.object.isRequired
    },
    update: function(props) {
    },
    componentWillReceiveProps: function(props) {
        console.log(JSON.stringify(props));
    },
    componentDidMount: function() {
    },
    onChange: function() {
        var g = this.props.game;
        ['nine','eight'].forEach(function(type) {
                g[type].selected = this.refs[type] ? this.refs[type].getChecked() : false;
            }.bind(this)
        );
        ChallengeActions.setGame(g);
    },
    getLabel: function(type) {
        return (<Badge>{type == 'nine' ? '9' : '8'}</Badge>);
    },
    getOptions: function() {
        var options = [];
        ['nine','eight'].forEach(function(type) {
            if (this.props.game[type].available) {
                options.push(
                    <Input key={type}
                           className={type}
                           ref={type}
                           type='checkbox'
                           label={this.getLabel(type)}
                           onChange={this.onChange}
                        />
                );
            }
        }.bind(this));
        return options;
    },
    render: function() {
        var g = this.props.game;
        var disp = g.nine.available && g.eight.available  ? 'inline' : 'none';
        return (
            <div style={{display: disp}}>
                {this.getOptions()}
            </div>
        );
    }
});
module.exports = ChallengeRequestGame;
