var React = require('react/addons');
var GroupMixin = require('./GroupListMixin.jsx');
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
    ,Label = Bootstrap.Label;
var ChallengeActions = require('../../../actions/ChallengeActions.jsx');

var GroupSlot = React.createClass({
    mixins: [GroupMixin],
    onSelectSlot: function() {
        ChallengeActions.selectChallengeGroupSlot(
            this.props.challengeGroup,
            this.refs.slot.getValue(),
            this.getUserId(),
            this.props.type
        );
    },
    renderNoSelect: function() {
        var slots = [];
        this.props.challengeGroup.slots.forEach(function (s) {
            slots.push(<Label key={s.id}>{s.time}</Label>);
            }.bind(this));
        return slots;
    },
    renderSelectOptions: function(){
        if (this.props.challengeGroup.slots.length == 1) {
            return (<Label>{this.props.challengeGroup.slots[0].time}</Label>);
        }
        var slots = [];
        slots.push(<option key={0} value={0}>{'choose'}</option>);
        this.props.challengeGroup.slots.sort();
        this.props.challengeGroup.slots.forEach(function (s) {
            slots.push(<option key={s.id} value={s.id}>{s.time}</option>);
        }.bind(this));
        return (<Input ref='slot' onChange={this.onSelectSlot}
                       value={this.props.challengeGroup.selectedSlot}
                       type={'select'}> {slots}</Input>);
    },
    render: function() {
        if (this.props.noSelect)
            return (<div>{this.renderNoSelect()}</div>);

        return (<div>{this.renderSelectOptions()}</div>);
    }
});

module.exports = GroupSlot;