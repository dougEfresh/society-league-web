var React = require('react/addons');
var Bootstrap = require('react-bootstrap')
    ,Input = Bootstrap.Input
    ,Badge = Bootstrap.Badge
    ,ButtonGroup = Bootstrap.ButtonGroup
    ,DropdownButton = Bootstrap.DropdownButton
    ,MenuItem = Bootstrap.MenuItem
    ,Button = Bootstrap.Button
    ,SplitButton = Bootstrap.SplitButton;

var ChallengeConstants = require('./constants/ChallengeConstants.jsx');

var BallIcon = {

    getStyle: function(selected) {
        if (selected) {
            return "fa fa-check";
        }
        return "fa fa-times";
    },
    getButton: function(selected,type) {
        // type could be 8 or EIGHT_BALL_CHALLENGE_LEAGUE
        var t = type;
        if (t == ChallengeConstants.EIGHT_BALL_CHALLENGE) {
            t = '8'
        }
        if (t == ChallengeConstants.NINE_BALL_CHALLENGE) {
            t = '9'
        }
        //<i className={this.getStyle(selected)}><div style={{display: 'none'}}>{t}</div></i>
        return (
            <Button bsSize='small' bsStyle={selected ? 'default' : 'danger'} onClick={this.onSelect}>
                {this.getBall(type)}
            </Button>
        );
    },
    getNineButton: function(selected) {
        return (
            <div>
                {this.getButton(selected,'9')}
            </div>
        )
    },

    getEightButton: function(selected) {
        return (
            <div>
                {this.getButton(selected,'8')}
            </div>
        )
    },

    getBall: function(type) {
        switch (type) {
            case '8':
            case ChallengeConstants.EIGHT_BALL_CHALLENGE:
                return this.getEight();

            case '9':
            case ChallengeConstants.NINE_BALL_CHALLENGE:
                return this.getNine();

            default:
                return <div>1</div>;
        }
    },

    getEight: function() {
        return <Badge className="eightBall">8</Badge>
    },

    getNine: function() {
        return <Badge className="nineBall">9</Badge>
    }


};

module.exports = BallIcon;