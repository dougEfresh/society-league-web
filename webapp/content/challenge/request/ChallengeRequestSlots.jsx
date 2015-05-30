var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router');
var Bootstrap = require('react-bootstrap')
    ,Input = Bootstrap.Input
    ,Button = Bootstrap.Button
    ,ListGroup = Bootstrap.ListGroup
    ,ListGroupItem = Bootstrap.ListGroupItem;

var UserContextMixin = require('../../../jsx/mixins/UserContextMixin.jsx');
var Datastore = require('../../../jsx/stores/DataStore.jsx');

var ChallengeRequestSlots = React.createClass({
    mixins: [UserContextMixin,Router.State,Router.Navigation],
    propTypes: {
        challengeGroup: ReactPropTypes.object.isRequired,
    },
    onClickAny: function() {
        var q = this.getQuery();
        if (q.anyTime == undefined) {
            q.anyTime = 'true';
            this.transitionTo('request',this.getParams(),q);
            return;
        }
        q.anyTime = q.anyTime == 'true' ? 'false': 'true';
        this.transitionTo('request',this.getParams(),q);
    },
    getAnyTime: function() {
        var q = this.getQuery();
        var anyTime = q.anyTime != undefined && q.anyTime == 'true';
        return (
            <Button key='any'
                    bsStyle={anyTime ? 'success' : 'default'}
                    onClick={this.onClickAny}
                >
                <i className={anyTime ? 'fa fa-check' : 'fa fa-times'}>
                    {'Any Time'}
                </i>
            </Button>
        );
    },
    render: function() {
        var buttons = [];
        var q = this.getQuery();
        var date = q.date;
        if (date == undefined) {
            return null;
        }
        var slots = Datastore.getSlots();
        var slotsOnDay = [];
        for(var i = 0; i < slots.length; i++) {
            if (slots[i].getDate() == date ) {
                slotsOnDay.push(slots[i]);
            }
        }
        buttons.push(this.getAnyTime());

        slotsOnDay.forEach(function (s) {
            var selected = q.selected != undefined && q.selected[s.id] != undefined && q.selected[s.id] == 'true';
                buttons.push(
                    <SlotButton any={q.anyTime != undefined && q.anyTime == 'true'}
                                key={s.id}
                                slot={s}
                                selected={selected}
                        />
                );
            }.bind(this));

        return (
            <div>
                {buttons}
            </div>
        );
    }
});

var SlotButton = React.createClass({
    mixins: [UserContextMixin,Router.State,Router.Navigation],
    propTypes: {
        slot: ReactPropTypes.object.isRequired,
        any: ReactPropTypes.bool.isRequired
    },
    onClick: function() {
        var q = this.getQuery();
        if (q.selected == undefined) {
            q.selected = {};
            q.selected[this.props.slot.id] = 'true';
            this.transitionTo('request',this.getParams(),q);
            return;
        }
        q.selected[this.props.slot.id] =  q.selected[this.props.slot.id] == 'true' ? 'false': 'true';
        this.transitionTo('request',this.getParams(),q);
    },
    render: function() {
        if (this.props.any) {
            return (<Button bsStyle='success' disabled onClick={this.onClick}>
                <i className="fa fa-check">
                    {this.props.slot.getTime()}
                </i>
            </Button>);
        }
        var selected = this.props.selected == undefined ? {} : this.props.selected;
        return (
                <Button bsStyle={selected ? 'success' : 'default'} onClick={this.onClick}>
                    <i className={selected ? "fa fa-check" : 'fa fa-times'}>
                        {this.props.slot.getTime()}
                    </i>
                </Button>
         );
    }
});

module.exports = ChallengeRequestSlots;