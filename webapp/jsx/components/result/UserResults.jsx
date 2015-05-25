var React = require('react/addons');
var FixedDataTable = require('fixed-data-table');
var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;
var ColumnHelper = require('../columns/ColumnHelper.jsx');
var DataStore= require('../../stores/DataStore.jsx');
var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
var SeasonMixin = require('../../mixins/SeasonMixin.jsx');
var TeamMixin = require('../../mixins/TeamMixin.jsx');
var ResultMixin = require('../../mixins/ResultMixin.jsx');
var UserLink = require('../UserLink.jsx');

var UserResults = React.createClass({
    mixins: [ResultMixin,SeasonMixin,TeamMixin,UserContextMixin],
    render: function() {
       var tableData = [];
        this.props.matches.forEach(function(m){
            tableData.push(m);
        });
        var rowGetter = function(rowIndex) {
            return tableData[rowIndex];
        };
        return (
                <Table
                    groupHeaderHeight={30}
                    rowHeight={50}
                    headerHeight={30}
                    rowGetter={rowGetter}
                    rowsCount={tableData.length}
                    width={600}
                    height={500}
                    headerHeight={30}>
                    {ColumnHelper.date()}
                    {ColumnHelper.opponent(this.getUser())}
                    {ColumnHelper.opponentHandicap(this.getUser())}
                    {ColumnHelper.winLostUser(this.getUser())}
                    {ColumnHelper.racksForUser(this.getUser())}
                    {ColumnHelper.racksAgainstUser(this.getUser())}
                </Table>
        );
 }
});

module.exports = UserResults;
