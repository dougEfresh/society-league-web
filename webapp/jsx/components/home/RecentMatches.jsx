var React = require('react');
var FixedDataTable = require('fixed-data-table');
var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;
var ColumnGroup = FixedDataTable.ColumnGroup;
var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
var UserLink= require('../UserLink.jsx');
var TeamLink= require('../TeamLink.jsx');
var moment = require('moment');
var Bootstrap = require('react-bootstrap');
var Panel = Bootstrap.Panel;
var UserResults = require('../result/UserResults.jsx');

var UpcomingMatches = React.createClass({
    mixins: [UserContextMixin],
    render: function() {
        if (this.getUser().id == 0) {
            return null;
        }
        var results = this.getUser().getResults();
        var today = moment();
        var recent = [];
        results.forEach(function(m){
            var mDate = moment(m.getMatchDate());
            if (mDate.isBefore(today)) {
                recent.push(m);
            }
        });
        recent = recent.sort(function(a,b){
            return b.getMatchDate().localeCompare(a.getMatchDate());
        });
        if (recent.length == 0) {
            return (<Panel header={'Recent Matches'}>
                <span>You have not played any matches</span>
            </Panel>
            )
        }
        return (
            <Panel header={'Recent Matches'}>
                <UserResults matches={recent} />
            </Panel>
        )
    }
});

module.exports = UpcomingMatches;
