var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var UserContextMixin = require('../../../mixins/UserContextMixin.jsx');
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
        noSelect:  ReactPropTypes.bool.isRequired,
        type: ReactPropTypes.string.isRequired
    },
    getOpponent: function() {
        if (this.getUser().id == this.props.challengeGroup.opponent.id) {
            return this.props.challengeGroup.challenger.name
        }
        return this.props.challengeGroup.opponent.name;
    },
    render: function() {
        return (
            <tr>
                <td>
                    <GroupAction type={this.props.type} challengeGroup={this.props.challengeGroup} noSelect={this.props.noSelect} />
                </td>
                <td>
                    {dateFormat(this.props.challengeGroup.date)}
                </td>
                <td>
                    {this.getOpponent()}
                </td>
                <td>
                    <GroupGame type={this.props.type} challengeGroup={this.props.challengeGroup} noSelect={this.props.noSelect} />
                </td>
                <td>
                    <GroupSlot type={this.props.type} challengeGroup={this.props.challengeGroup} noSelect={this.props.noSelect} />
                </td>
            </tr>
        )
    }
});

module.exports = GroupRow;