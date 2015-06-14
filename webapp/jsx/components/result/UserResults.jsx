var React = require('react/addons');
var DataStore= require('../../stores/DataStore.jsx');
var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
var SeasonMixin = require('../../mixins/SeasonMixin.jsx');
var TeamMixin = require('../../mixins/TeamMixin.jsx');
var ResultMixin = require('../../mixins/ResultMixin.jsx');
var UserLink = require('../links/UserLink.jsx');

var UserResults = React.createClass({
    mixins: [ResultMixin,SeasonMixin,TeamMixin,UserContextMixin],
    render: function() {
       var tableData = [];
        this.props.matches.forEach(function(m){
            tableData.push(m);
        });
        /*
        var width  = ColumnConfig.date.width +
            ColumnConfig.name.width +
            ColumnConfig.handicap.width +
            ColumnConfig.winLost.width +
            ColumnConfig.racksFor.width +
            ColumnConfig.racksAgainst.width +
                1;
        return (
                <Table
                    groupHeaderHeight={30}
                    rowHeight={50}
                    headerHeight={30}
                    rowGetter={rowGetter}
                    rowsCount={tableData.length}
                    width={width}
                    maxHeight={500}
                    headerHeight={30}>
                    {ColumnHelper.date()}
                    {ColumnHelper.opponent(this.getUser())}
                    {ColumnHelper.opponentHandicap(this.getUser())}
                    {ColumnHelper.winLostUser(this.getUser())}
                    {ColumnHelper.racksForUser(this.getUser())}
                    {ColumnHelper.racksAgainstUser(this.getUser())}

                </Table>
        );
        //
*/
        return null;
    }
});

module.exports = UserResults;
