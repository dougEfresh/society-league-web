var React = require('react/addons');
var UserLink = require('../links/UserLink.jsx');
var Util = require('../../util.jsx');
var Handicap = require('../../../lib/Handicap');
var SeasonLink = require('../links/SeasonLink.jsx');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Route = Router.Route
    , Link = Router.Link;
var DataGrid = require('../../../lib/DataGrid.jsx');
var DataGridUtil = require('../../../lib/DataGridUtil.jsx');
var SortUtil = require('../../../lib/SortUtil');

var ResultScramble = React.createClass({
    getDefaultProps: function() {
        return {season : null, results:[] };
    },
    getInitialState: function() {
        return {
            results: this.props.results
        }
    },
    componentWillReceiveProps: function(n){
        this.setState({
            results: n.results
        });
    },
    render: function() {
        var columns = [
            DataGridUtil.columns.playerMatchDate,
            DataGridUtil.columns.result,
            DataGridUtil.columns.partner,
            DataGridUtil.columns.opponent,
            DataGridUtil.columns.opponentHandicap,
            DataGridUtil.columns.opponentPartner,
            DataGridUtil.columns.opponentTeam,
            DataGridUtil.columns.teamMemberHandicap
        ];

        if (this.state.results.length == 0) {
            return (
                <div className="table-responsive">
                </div>);
        }

        return (
                <DataGrid
                    defaultSortColumn={'date'}
                    sortFn={SortUtil.sortFn}
                    idProperty='matchNum'
                    dataSource={this.state.results}
                    columns={columns}
                    style={{height: ((this.state.results.length) * 50 < 500 ? (this.state.results.length ) * 50 : 500)}}
                    rowHeight={40}
                    showCellBorders={true}
                    filterable={false}
                    columnMinWidth={50}
                    cellPadding={'5px 5px'}
                    headerPadding={'5px 5px'}
                    filterIconColor={'#6EB8F1'}
                    menuIconColor={'#6EB8F1'}
                    //sortInfo={SORT_INFO}
                    loadMaskOverHeader={false}
                    cellEllipsis={false}
                    liveFilter={false}
                    styleAlternateRowsCls={'datagrid-alt-row'}
                    menuIcon={false}
                    filterIcon={false}
                    scrollbarSize={(this.state.results.length) * 50 < 500 ? 0 : 20}
                    //onColumnOrderChange={this.handleColumnOrderChange}
                    />
        );

    }
});

module.exports = ResultScramble;