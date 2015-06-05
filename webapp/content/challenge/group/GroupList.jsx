var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Bootstrap = require('react-bootstrap');
var Table = Bootstrap.Table;
var GroupRow = require('./GroupRow.jsx');
var UserContextMixin = require('../../../jsx/mixins/UserContextMixin.jsx');

var ColumnHelper = require('../../../jsx/components/columns/ColumnHelper.jsx');
var ColumnConfig = require('../../../jsx/components/columns/ColumnConfig.jsx');
var FixedDataTable = require('fixed-data-table');
//var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;

var GroupList = React.createClass({
    mixins: [UserContextMixin],
    propTypes: {
        challengeGroups: ReactPropTypes.array.isRequired,
        noSelect:  ReactPropTypes.bool.isRequired,
        type: ReactPropTypes.string.isRequired
    },
    render: function() {
        if (this.props.challengeGroups == null || this.props.challengeGroups.length <= 0) {
            return null;
        }
        var rows = [];
        var counter = 0;
        this.props.challengeGroups.forEach(function (g) {
            rows.push
            (
                <GroupRow type={this.props.type} key={counter++} noSelect={this.props.noSelect} challengeGroup={g}/>
            );
        }.bind(this));

        var rowGetter = function(index) {
            return this.props.challengeGroups[index];
        }.bind(this);

        return (
            <div class="table-responsive">
              <Table className="challengeStatusTable striped">
                <thead>
                <tr>
                    <th>Action</th>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Game</th>
                    <th>Times</th>
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </Table>
            </div>

        );
    }
});

module.exports = GroupList;

/*
 <Table
 groupHeaderHeight={30}
 rowHeight={50}
 headerHeight={30}
 rowGetter={rowGetter}
 rowsCount={rows.length}
 width={width}
 maxHeight={500}
 headerHeight={30}>
 {ColumnHelper.user()}
 {ColumnHelper.points()}
 {ColumnHelper.wins()}
 {ColumnHelper.loses()}
 {ColumnHelper.racksForStat()}
 {ColumnHelper.racksAgainstStat()}
 {ColumnHelper.winPct()}
 </Table>


 */