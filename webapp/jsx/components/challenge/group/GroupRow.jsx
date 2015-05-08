var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Panel = Bootstrap.Panel
    ,ListGroup = Bootstrap.ListGroup
    ,ListGroupItem = Bootstrap.ListGroupItem
    ,Table =  Bootstrap.Table
    ,ButtonGroup = Bootstrap.ButtonGroup
    ,DropdownButton = Bootstrap.DropdownButton
    ,MenuItem = Bootstrap.MenuItem
    ,Input = Bootstrap.Input
    ,Label = Bootstrap.Label
    ,Well = Bootstrap.Well
    ,Badge = Bootstrap.Badge
    ,SplitButton = Bootstrap.SplitButton;

var ChallengeStatus = require('../../../constants/ChallengeStatus.jsx');
var ChallengeActions = require('../../../actions/ChallengeActions.jsx');
var ChallengeStore = require('../../../stores/ChallengeStore.jsx');
var UserContextMixin = require('../../../UserContextMixin.jsx');
var GroupAction = require('./GroupAction.jsx');
var GroupGame = require('./GroupGame.jsx');
var GroupSlot = require('./GroupSlot.jsx');


function dateFormat(date) {
    return date.substr(5,10).replace('-','/');
}

var GroupRow = React.createClass({
    mixins: [UserContextMixin],
    propTypes: {
        challengeGroup: ReactPropTypes.object.isRequired,
        noSelect:  ReactPropTypes.bool.isRequired
    },
    getOpponent: function() {
        if (this.getUserId() == this.props.challengeGroup.opponent.id) {
            return this.props.challengeGroup.challenger.name;
        }
        return this.props.challengeGroup.opponent.name;
    },
    render: function() {
        return (
            <tr>
                <td>
                    <GroupAction challengeGroup={this.props.challengeGroup} noSelect={this.props.noSelect} />
                </td>
                <td>
                    {dateFormat(this.props.challengeGroup.date)}
                </td>
                <td>
                    {this.getOpponent()}
                </td>
                <td>
                    <GroupGame challengeGroup={this.props.challengeGroup} noSelect={this.props.noSelect} />
                </td>
                <td>
                    <GroupSlot challengeGroup={this.props.challengeGroup} noSelect={this.props.noSelect} />
                </td>
            </tr>
        )
    }
});

module.exports = GroupRow;