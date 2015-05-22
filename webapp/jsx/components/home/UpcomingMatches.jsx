var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;
var ColumnGroup = FixedDataTable.ColumnGroup;
var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
var UserLink= require('../UserLink.jsx');
var TeamLink= require('../TeamLink.jsx');
var moment = require('moment');

var UpcomingMatches = React.createClass({
    mixins: [UserContextMixin],
    render: function() {
        if (this.getUser().id == 0) {
            return null;
        }
        var teams = this.getUser().getCurrentTeams();
        var today = moment();
        var upComingMatches = [];

        teams.forEach(function(t){
            var matches = t.getMatches();
            matches.forEach(function(m) {
                var mDate = moment(m.matchDate);
                if (mDate.isAfter(today)) {
                    upComingMatches.push(matches);
                }
            });
        });

        upComingMatches = upComingMatches.sort(function(a,b){
            return b.matchDate.localeCompare(a.matchDate);
        });

        return ();
    }
});

module.exports = UpcomingMatches;qw
