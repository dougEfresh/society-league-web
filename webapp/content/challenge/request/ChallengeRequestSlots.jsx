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
    onClickAny: function(e) {
        e.preventDefault();
        var q = this.getQuery();
        if (q.anyTime == undefined) {
            q.anyTime = 1;
            this.transitionTo('request',this.getParams(),q);
            return;
        }
        q.anyTime = q.anyTime == 1 ? 0: 1;
        this.transitionTo('request',this.getParams(),q);
    },
    getAnyTime: function() {
        var q = this.getQuery();
        var anyTime = q.anyTime > 0;
        return (
            <button key='any'
                    className={anyTime ? 'btn btn-success' : 'btn btn-default'}
                    onClick={this.onClickAny}>
                <span className={anyTime ? 'fa fa-check' : 'fa fa-times'}></span>
                {'Any Time'}
            </button>
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
        slotsOnDay.forEach(function (s) {
                buttons.push(
                    <SlotButton any={q.anyTime == 1}
                                key={s.id}
                                slot={s} />
                );
            }.bind(this));
        //<div className="btn-toolbar" role="toolbar" aria-label="...">
        // <div className="btn-group" role="group" aria-label="...">{this.getAnyTime()}</div>
        //<div className="btn-group" role="group" aria-label="...">{buttons}</div>
        return (
            <div className="btn-group select-time">
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
    onClick: function(e) {
        e.preventDefault();
        var q = this.getQuery();
        if (q.selected == undefined) {
            q.selected = {};
            q.selected[this.props.slot.id] = 1;
            this.transitionTo('request',this.getParams(),q);
            return;
        }
        q.selected[this.props.slot.id] =  q.selected[this.props.slot.id] == 1 ? 0: 1;
        this.transitionTo('request',this.getParams(),q);
    },
    render: function() {
        var q = this.getQuery();
        var selected = (q.selected != undefined && q.selected[this.props.slot.id] != undefined && q.selected[this.props.slot.id] > 0)
            || this.props.any;
        return (
                <button className={selected ? 'btn btn-success' : 'btn btn-default'}  onClick={this.onClick}>
                    <span className={selected ? 'fa fa-check' : 'fa fa-times'}></span>
                    {this.props.slot.getTime()}
                </button>
         );
    }
});

module.exports = ChallengeRequestSlots;