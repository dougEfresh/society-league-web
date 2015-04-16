var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Bootstrap = require('react-bootstrap')
    ,Input = Bootstrap.Input
    ,Button = Bootstrap.Button
    ,ListGroup = Bootstrap.ListGroup
    ,ListGroupItem = Bootstrap.ListGroupItem;

var DataFactory = require('../../../DataFactoryMixin.jsx');
var ChallengeActions = require('../../../actions/ChallengeActions.jsx');

var ChallengeRequestSlots = React.createClass({
    mixins: [DataFactory],
    propTypes: {
        slots: ReactPropTypes.array.isRequired
    },
    getInitialState: function () {
        return {
            available : {}
        }
    },
    onChange: function() {
        var slots = [];
        this.refs.slots.getValue().forEach(function(s) {
                slots.push(this.state.available[s]);
            }.bind(this)
        );
        ChallengeActions.addSlots(slots);
    },
    getOptions: function() {
        var options = [];
        for (var key in this.state.available) {
            options.push(<option key={key} value={key}>{this.state.available[key].time}</option>);
        }
        return options;
    },
    onRemove: function(item) {
        ChallengeActions.removeSlot(this.state.available[item.target.textContent]);
    },
    render: function() {
        var buttons = [];
        this.props.slots.forEach(function(s) {
            buttons.push(<SlotButton key={s.id} slot={s} > </SlotButton>);
        });
        var chosen = [];
        this.props.slots.forEach(function(s) {
            var removeIcon = (
                <i className="fa fa-times" >
                    <div style={{display: 'none'}}>{s.id}</div>
                </i>);
            chosen.push(<ListGroupItem  key={s.id}>
                <Button onClick={this.onRemove}>{removeIcon}</Button>{s.time}</ListGroupItem>);
        }.bind(this));

        var disp = this.props.slots.length == 0  ? 'none' : 'inline';
        var chosenGroup = (
            <div style={{display: disp}}>
            <ListGroup label={"Chosen"}>
                {chosen}
            </ListGroup>
            </div>);
        //<Input type='select' multiple ref='slots' label={'Choose Time'} onChange={this.onChange} >{this.getOptions()}</Input>
        return (
            <div>
                {buttons}
            </div>
        );
    }
});

var SlotButton = React.createClass({
    mixins: [DataFactory],
    propTypes: {
        slot: ReactPropTypes.object.isRequired
    },
    onClick: function(){
        this.props.slot.selected = !this.props.slot.selected;
        ChallengeActions.changeSlotState(this.props.slot);
    },
    render: function() {
        if (!this.props.slot.selected) {
            return (
                <Button onClick={this.onClick}>
                    <i className="fa fa-times">
                        {this.props.slot.time}
                    </i>
                </Button>
            );
        }
        return (
            <Button bsStyle='success' onClick={this.onClick}>
                <i className="fa fa-check">
                    {this.props.slot.time}
                </i>
            </Button>
        );
    }
});



module.exports = ChallengeRequestSlots;