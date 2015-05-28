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
var DivisionType = require('../../../lib/DivisionType');
var RequestActions = require('../../../jsx/actions/RequestActions.jsx');

var ChallengeRequestGame = React.createClass({
    propTypes: {
        challengeGroup: ReactPropTypes.object.isRequired
    },
    onSelect: function(e) {
        var type = e.target.textContent == '9' ? DivisionType.NINE_BALL_CHALLENGE : DivisionType.EIGHT_BALL_CHALLENGE;
        RequestActions.setGame(type)
    },
    isSelected: function(type) {
        var found = false;
        this.props.challengeGroup.selectedGames.forEach(function(g){
            if (g == type) {
                found = true;
            }
        });
        return found;
    },
    render: function() {

        return (
            <div>
                <Button bsSize='small' bsStyle={this.isSelected(DivisionType.EIGHT_BALL_CHALLENGE) ? 'success' : 'default'} onClick={this.onSelect}>
                    <Badge className="eight-ball">8</Badge>
                </Button>
                <Button bsSize='small' bsStyle={this.isSelected(DivisionType.NINE_BALL_CHALLENGE)? 'success' : 'default'} onClick={this.onSelect}>
                   <Badge className="nine-ball">9</Badge>
               </Button>
            </div>
        );
    }
});
module.exports = ChallengeRequestGame;
