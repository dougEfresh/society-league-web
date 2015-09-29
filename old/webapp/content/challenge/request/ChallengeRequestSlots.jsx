var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router');
var UserContextMixin = require('../../../jsx/mixins/UserContextMixin.jsx');
var Datastore = require('../../../jsx/stores/DataStore.jsx');

var ChallengeRequestSlots = React.createClass({
    mixins: [UserContextMixin,Router.State,Router.Navigation],
    propTypes: {
        challengeGroup: ReactPropTypes.object.isRequired
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
        slotsOnDay = slotsOnDay.sort(function(a,b){
           return a.getRawDate().localeCompare(b.getRawDate());
        });
        slotsOnDay.forEach(function (s) {
                buttons.push(
                    <SlotButton any={q.anyTime == 1}
                                key={s.id}
                                slot={s} />
                );
            }.bind(this));
        if (buttons.length == 0) {
            return (
                <div className="btn-group select-time">
                    <span>No available times for this date. Please select another date</span>
                </div>
            );
        }
          return (
                <div className="btn-group select-time">
                    {buttons}
                </div>
            );
    }
});

var SlotButton = React.createClass({
    mixins: [UserContextMixin],
    propTypes: {
        slot: ReactPropTypes.object.isRequired,
        any: ReactPropTypes.bool.isRequired
    },
    onClick: function(e) {
        e.preventDefault();
        var q = this.getQuery();
        if (q.selected == undefined) {
            q.selected = {};
            q.selected['slot'+this.props.slot.id] = 1;
            this.transitionTo('challengeMain',this.getParams(),q);
            return;
        }
        q.selected['slot'+this.props.slot.id] =  q.selected['slot'+this.props.slot.id] == 1 ? 0: 1;
        this.transitionTo('challengeMain',this.getParams(),q);
    },
    render: function() {
        var q = this.getQuery();
        var selected = (
            q.selected != undefined &&
            q.selected['slot'+this.props.slot.id] > 0
            ) || this.props.any;
        return (
                <button className={selected ? 'btn btn-success' : 'btn btn-default'} onClick={this.onClick}>
                    <span className={selected ? 'fa fa-check' : 'fa fa-times'}></span>
                    {this.props.slot.time}
                </button>
         );
    }
});

module.exports = ChallengeRequestSlots;
