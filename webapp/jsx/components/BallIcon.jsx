var React = require('react/addons');
var Bootstrap = require('react-bootstrap')
    ,Input = Bootstrap.Input
    ,Badge = Bootstrap.Badge
    ,ButtonGroup = Bootstrap.ButtonGroup
    ,DropdownButton = Bootstrap.DropdownButton
    ,MenuItem = Bootstrap.MenuItem
    ,Button = Bootstrap.Button
    ,SplitButton = Bootstrap.SplitButton;

var DivisionTypes = require('../constants/DivisionConstants.jsx');

var BallIcon = React.createClass({
    getDefaultProps: function(){
        return {
            type: DivisionTypes.EIGHT_BALL_WEDNESDAYS
        }
    },
    getEight: function() {
        return <Badge className="eightBall">8</Badge>
    },

    getNine: function() {
        return <Badge className="nineBall">9</Badge>
    },
    render: function() {
        if (this.props.type.toLowerCase().indexOf('eight') >=0) {
            return this.getEight();
        }
        return this.getNine();
    }
});

module.exports = BallIcon;