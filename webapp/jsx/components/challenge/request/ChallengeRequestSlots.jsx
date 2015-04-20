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
        slots: ReactPropTypes.array.isRequired,
        any:  ReactPropTypes.bool.isRequired
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
    onClickAny: function() {
        ChallengeActions.anySlot(!this.props.any,this.props.slots);
    },
    getAnyTime: function() {
        if (!this.props.any) {
            return (
            <Button key='any' bsStyle='default' onClick={this.onClickAny}>
                <i className="fa fa-times">
                    {'Any Time'}
                </i>
            </Button>
            );
        } else {
            return (
              <Button key='any' bsStyle='success' onClick={this.onClickAny}>
                <i className="fa fa-check">
                    {'Any Time'}
                </i>
            </Button>
            );
        }
    },
    render: function() {
        var buttons = [];
        buttons.push(this.getAnyTime());
        this.props.slots.forEach(function(s) {
            buttons.push(<SlotButton any={this.props.any} key={s.id} slot={s} > </SlotButton>);
        }.bind(this));
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
        slot: ReactPropTypes.object.isRequired,
        any: ReactPropTypes.bool.isRequired
    },
    onClick: function(){
        this.props.slot.selected = !this.props.slot.selected;
        ChallengeActions.changeSlotState(this.props.slot);
    },
    render: function() {
        if (this.props.any){
            return (<Button bsStyle='success' disabled onClick={this.onClick}>
                <i className="fa fa-check">
                    {this.props.slot.time}
                </i>
            </Button>);
        }
        if (!this.props.slot.selected) {
            return (
                <Button onClick={this.onClick}>
                    <i className="fa fa-times">
                        {this.props.slot.time}
                    </i>
                </Button>
            );
        }
         return (<Button bsStyle='success' onClick={this.onClick}>
                <i className="fa fa-check">
                    {this.props.slot.time}
                </i>
            </Button>);
    }
});



module.exports = ChallengeRequestSlots;