var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Link = Router.Link;
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var UserLink = require('../../../webapp/jsx/components/links/UserLink.jsx');
var TeamLink = require('../../../webapp/jsx/components/links/TeamLink.jsx');
var Util = require('../../jsx/util.jsx');
var LoadingApp = require('../../jsx/components/LoadingApp.jsx');
var UserResults = require('../../jsx/components/result/UserResults.jsx');
var Handicap = require('../../lib/Handicap');
var SortUtil = require('../../lib/SortUtil');
var DataGridUtil = require('../../lib/DataGridUtil.jsx');
var DataGrid = require('../../lib/DataGrid.jsx');
var TeamMatchStore = require('../../jsx/stores/TeamMatchStore.jsx');

var SeasonLeaders = React.createClass({
    mixins: [UserContextMixin],
    getDefaultProps: function() {
        return {limit: 100}
    },
    getInitialState: function() {
        return {
            update: Date.now(),
            stats: [],
            season: null,
            selectedUser: null,
            loading: true,
            toggleLeaders: true
        }
    },
    _onChange: function() {
        this.getData(this.props.params.seasonId);
    },
    getData: function(id) {
        var cb = function (d) {
            var ind = 1;
            d.forEach(function(s){
                s.rank = ind++;
                if (this.props.onUserClick) {
                    s.user.onClick = this.props.onUserClick(s.user);
                }
            }.bind(this));

            this.setState({stats: d, season: d.length > 0 ? d[0].season : null, loading: false});
        }.bind(this);
        Util.getSomeData({ url: '/api/stat/season/players/' + id,
            callback: cb,
            module: 'SeasonLeaders',
            router: this.props.history
        })
    },
    componentDidMount: function() {
        TeamMatchStore.addListener('MATCHES', this._onChange);
        TeamMatchStore.addListener('SUBMITTED', this._onChange);
    },
    componentDidUmount: function() {
        TeamMatchStore.remove('SUBMITTED', this._onChange);
        TeamMatchStore.remove('MATCHES', this._onChange);
    },
    componentDidMount: function () {
        this.getData(this.props.params.seasonId);
    },
    componentWillReceiveProps: function(n) {
        if (n.params.seasonId != this.props.params.seasonId) {
            this.setState({loading: true});
            this.getData(n.params.seasonId);
        }
    },
    handleSort: function(column,data) {

    },
    render: function() {
        if (this.state.stats.length == 0) {
             return null;
        }

        var s = this.state.stats[0].season;
        var columns = [
            DataGridUtil.columns.rank,
            DataGridUtil.columns.player,
            DataGridUtil.columns.handicap,
            DataGridUtil.columns.wins,
            DataGridUtil.columns.loses,
            DataGridUtil.columns.racksWon,
            DataGridUtil.columns.racksLost,
            DataGridUtil.columns.team
        ];
        if (s.challenge) {
            columns = [DataGridUtil.columns.rank,
                DataGridUtil.columns.player,
                DataGridUtil.columns.handicap,
                DataGridUtil.columns.points,
                DataGridUtil.columns.wins,
                DataGridUtil.columns.loses,
                DataGridUtil.columns.racksWon,
                DataGridUtil.columns.racksLost
                ]
        }
        if (!s.nine) {
            columns = [
                DataGridUtil.columns.rank,
            DataGridUtil.columns.player,
            DataGridUtil.columns.handicap,
            DataGridUtil.columns.wins,
            DataGridUtil.columns.loses,
            DataGridUtil.columns.team];
        }


        return (<DataGrid defaultSortColumn={'rank'} sortFn={SortUtil.sortFn} limit={this.props.limit} dataSource={this.state.stats} columns={columns} loading={this.state.loading} cls="table-users" />);

        /*
          return (
                <ReactDataGrid
                    idProperty='rank'
                    dataSource={this.state.stats}
                    columns={columns}
                    style={{height: ((this.state.stats.length) * 60 < 500 ? (this.state.stats.length ) * 60 : 400)}}
                    rowHeight={40}
                    showCellBorders={true}
                    filterable={false}
                    columnMinWidth={40}
                    ///cellPadding={'5px 5px'}
                    //headerPadding={'5px 5px'}
                    filterIconColor={'#6EB8F1'}
                    menuIconColor={'#6EB8F1'}
                    liveFilter={false}
                    styleAlternateRowsCls={'datagrid-alt-row'}
                    //scrollbarSize={(this.state.stats.length) * 60 < 500 ? 0 : 20}
                    defaultPageSize={10}
                    paginationToolbarProps={{
				pageSizes: [
					20
				]
			}}
                    //onColumnOrderChange={this.handleColumnOrderChange}
                    />
        );
        */
    }
});

module.exports = SeasonLeaders;
