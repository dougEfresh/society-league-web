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
var UserContextMixin  = require('../../../jsx/mixins/UserContextMixin.jsx');
var Router = require('react-router');

var ChallengeRequestGame = React.createClass({
    mixins: [UserContextMixin,Router.Navigation,Router.State],
    propTypes: {
        challengeGroup: ReactPropTypes.object.isRequired
    },
    onSelect: function(e) {
        var type = e.target.textContent == '9' ? DivisionType.NINE_BALL_CHALLENGE : DivisionType.EIGHT_BALL_CHALLENGE;
        //RequestActions.setGame(type)
        var q = this.getQuery();
        if (q.games == undefined)  {
            q.games = {};
            q.games[type] = 'true';
        } else if (q.games.hasOwnProperty(type)) {
            q.games[type] = q.games[type] == 'true' ? 'false' : 'true';
        } else {
            q.games[type] = 'true';
        }
        this.transitionTo('request',this.getParams(),q);
    },
    render: function() {
        var q = this.getQuery();
        var nine = "default";
        var eight = "default";
        if (q.games != undefined) {
            if (q.games[DivisionType.EIGHT_BALL_CHALLENGE] != undefined) {
                eight = q.games[DivisionType.EIGHT_BALL_CHALLENGE] == 'true' ? "success" : "default"
            }
            if (q.games[DivisionType.NINE_BALL_CHALLENGE] != undefined) {
                nine = q.games[DivisionType.NINE_BALL_CHALLENGE] == 'true' ? "success" : "default";
            }
        }
        return (

            <div className="select-game btn-group">
                <Button bsSize='large' type="button" bsStyle={eight} onClick={this.onSelect}>
                    <Badge className="eight-ball">8</Badge>
                </Button>
                <Button bsSize='large' type="button" bsStyle={nine} onClick={this.onSelect}>
                   <Badge className="nine-ball">9</Badge>
               </Button>
            </div>
        );
    }
});
module.exports = ChallengeRequestGame;
