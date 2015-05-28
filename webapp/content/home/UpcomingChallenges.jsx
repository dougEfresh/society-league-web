var React = require('react');
var FixedDataTable = require('fixed-data-table');
var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;
var ColumnGroup = FixedDataTable.ColumnGroup;
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var UserLink= require('../../jsx/components/UserLink.jsx');
var TeamLink= require('../../jsx/components/TeamLink.jsx');
var moment = require('moment');
var Bootstrap = require('react-bootstrap');
var Panel = Bootstrap.Panel;
var Button = Bootstrap.Button;
var Status = require('../../lib/Status');
var slotDao = require('../../lib/SlotDao');

var UpcomingChallenges = React.createClass({
    mixins: [UserContextMixin],
    render: function() {
        if (this.getUser().id == 0) {
            return null;
        }
        if (!this.getUser().isChallenge()) {
            return null;
        }
        var challenges = this.getUser().getChallenges(Status.ACCEPTED);
        var upComingMatches = [];
        var yesterday = moment().subtract(1,'day');
        challenges.forEach(function(c) {
            var day = moment(c.selectedSlot.date);
            if (day.isAfter(yesterday)) {
                upComingMatches.push(c);
            }
        });

        upComingMatches = upComingMatches.sort(function(a,b) {
            var aSlot = slotDao.getSlot(a.selectedSlot);
            var bSlot = slotDao.getSlot(b.selectedSlot);
            return bSlot.date.localeCompare(aSlot.date);
        });

        var matches = [];
        for (var i=0; i<upComingMatches.length && i< 3; i++) {
            var match = upComingMatches[i];
            var m = moment(match.selectedSlot.date);
            matches.push(
                <span key={i} className="next-match">
                    {m.format('ddd MMM Do ') + ' at '  + m.format('HH:mm a') + ' vs. '}
                    <UserLink user={match.getUserOpponent(this.getUser())} />
                </span>
            );
        }
        if (matches.length == 0) {
            return (<Panel header={'Upcoming Challenges'}>
                <span>You have no matches scheduled</span>
            </Panel>
            )
        }
        //<Button bsSize='small' responsive={true}  >cancel</Button>
        return (
            <Panel header={'Upcoming Challenges'}>
                {matches}
                <button type="button" className="btn btn-sm btn-danger pull-right btn-responsive">
                    <span className="glyphicon glyphicon-remove"></span> <b>Cancel</b>
                </button>
            </Panel>
        )
    }
});

module.exports = UpcomingChallenges;
