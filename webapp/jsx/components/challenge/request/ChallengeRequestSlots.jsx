var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Bootstrap = require('react-bootstrap')
    ,Input = Bootstrap.Input
    ,Button = Bootstrap.Button
    ,ListGroup = Bootstrap.ListGroup
    ,ListGroupItem = Bootstrap.ListGroupItem;

var UserContextMixin = require('../../../mixins/UserContextMixin.jsx');
var ChallengeActions = require('../../../actions/ChallengeActions.jsx');

var ChallengeRequestSlots = React.createClass({
    mixins: [UserContextMixin],
    propTypes: {
        challengeGroup: ReactPropTypes.object.isRequired,
    },
    getOptions: function() {
        var options = [];
        for (var key in this.state.available) {
            options.push(<option key={key} value={key}>{this.state.available[key].getTime()}</option>);
        }
        return options;
    },
    onClickAny: function() {
        ChallengeActions.anySlot(!this.props.challengeGroup.anySlot);
    },
    getAnyTime: function() {
        if (!this.props.challengeGroup.anySlot) {
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
        if (this.props.challengeGroup.slots.length == 0) {
            return null;
        }
        buttons.push(this.getAnyTime());
        if (!this.props.challengeGroup.anySlot) {
            this.props.challengeGroup.slots.forEach(function (s) {
                buttons.push(
                    <SlotButton any={this.props.challengeGroup.anySlot}
                                key={s.id}
                                challengeGroup={this.props.challengeGroup}
                                slot={s}
                        />
                );
            }.bind(this));
        }
        return (
            <div>
                {buttons}
            </div>
        );
    }
});

var SlotButton = React.createClass({
    mixins: [UserContextMixin],
    propTypes: {
        challengeGroup: ReactPropTypes.object.isRequired,
        slot: ReactPropTypes.object.isRequired,
        any: ReactPropTypes.bool.isRequired
    },
    onClick: function(){
        ChallengeActions.changeSlotState(this.props.slot);
    },
    render: function() {
        if (this.props.any){
            return (<Button bsStyle='success' disabled onClick={this.onClick}>
                <i className="fa fa-check">
                    {'Any time'}
                </i>
            </Button>);
        }
        var found = false;
        for(var i=0; i< this.props.challengeGroup.selectedSlots.length; i++){
            if (this.props.challengeGroup.selectedSlots[i].id == this.props.slot.id) {
                found = true;
            }
        }
        if (!found) {
            return (
                <Button onClick={this.onClick}>
                    <i className="fa fa-times">
                        {this.props.slot.getTime()}
                    </i>
                </Button>
            );
        }
         return (<Button bsStyle='success' onClick={this.onClick}>
                <i className="fa fa-check">
                    {this.props.slot.getTime()}
                </i>
            </Button>);
    }
});



module.exports = ChallengeRequestSlots;