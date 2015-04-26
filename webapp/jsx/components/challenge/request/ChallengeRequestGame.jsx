var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Bootstrap = require('react-bootstrap')
    ,Input = Bootstrap.Input
    ,Badge = Bootstrap.Badge
    ,ButtonGroup = Bootstrap.ButtonGroup
    ,DropdownButton = Bootstrap.DropdownButton
    ,MenuItem = Bootstrap.MenuItem
    ,Button = Bootstrap.Button
    ,SplitButton = Bootstrap.SplitButton;
var BallIcon = require('../../../BallMixin.jsx');

var RequestActions = require('../../../actions/RequestActions.jsx');

var ChallengeRequestGame = React.createClass({
    mixins: [BallIcon],
    propTypes: {
        game: ReactPropTypes.object.isRequired
    },
    onChange: function() {
        var g = this.props.game;
        ['nine','eight'].forEach(function(type) {
                g[type].selected = this.refs[type] ? this.refs[type].getChecked() : false;
            }.bind(this)
        );
        RequestActions.setGame(g);
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
    onSelect: function(e) {
        var type = e.target.textContent == '9' ? 'nine' : 'eight';
        var g = this.props.game;
        g[type].selected = !g[type].selected;
        RequestActions.setGame(g);
    },
    render: function() {
        var g = this.props.game;
        if (!g.nine.available && !g.eight.available) {
            return null;
        }

        var eight = this.getEightButton(g.eight.selected);
        var nine = this.getNineButton(g.nine.selected);

        return (
            <div >
                {eight}
                {nine}
            </div>
        );
    }
});
module.exports = ChallengeRequestGame;
