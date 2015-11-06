var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Link = Router.Link
    , DefaultRoute = Router.DefaultRoute;

var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var TeamLink = require('../../jsx/components/links/TeamLink.jsx');
var Util = require('../../jsx/util.jsx');
var DataGridUtil = require('../../lib/DataGridUtil.jsx');
var ReactDataGrid = require('react-datagrid');

var SeasonStandings = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function() {
         return {
             seasonStats: [],
             loading: false
         }
    },
    getData: function(id) {
        Util.getSomeData(
                {
                    url: '/api/stat/season/' + id,
                    callback: function (d) {
                        this.setState({seasonStats: d,loading: false})
                    }.bind(this),
                    module: 'SeasonStandings',
                    router: this.props.history
                }
            );
    },
    componentDidMount: function () {
        if (this.props.season != undefined && this.props.season != null)
            this.getData(this.props.season.id);
    },
    componentWillReceiveProps: function (n) {
        if (n.season != undefined && n.season != null) {
            if (this.props.season == null) {
                this.getData(n.season.id);
                return;
            }
            if (this.props.season.id != n.season.id) {
                this.getData(n.season.id);
                return;
            }

        }
    },
    render: function() {
        if (this.state.seasonStats.length == 0)
            return null;

        var columns = [
            DataGridUtil.columns.teamRank,
            DataGridUtil.columns.team(),
            DataGridUtil.columns.wins,
            DataGridUtil.columns.loses,
            DataGridUtil.columns.setWins,
            DataGridUtil.columns.setLoses,
            DataGridUtil.columns.racksWon,
            DataGridUtil.columns.racksLost,
            DataGridUtil.columns.rackPct
        ];
        if (!this.state.seasonStats[0].season.nine){
            columns = [
                DataGridUtil.columns.teamRank,
                DataGridUtil.columns.team(),
                DataGridUtil.columns.wins,
                DataGridUtil.columns.loses,
            DataGridUtil.columns.racksWon,
            DataGridUtil.columns.racksLost,
                DataGridUtil.columns.rackPct
            ];
        }

        return (
              <div className="table-responsive">
                <ReactDataGrid
                    idProperty='rank'
                    dataSource={this.state.seasonStats}
                    columns={columns}
                    style={{height: ((this.state.seasonStats.length) * 50 < 500 ? (this.state.seasonStats.length ) * 50 : 500)}}
                    rowHeight={40}
                    showCellBorders={true}
                    filterable={false}
                    columnMinWidth={50}
                    cellPadding={'5px 5px'}
                    headerPadding={'5px 5px'}
                    filterIconColor={'#6EB8F1'}
                    menuIconColor={'#6EB8F1'}
                    loadMaskOverHeader={false}
                    cellEllipsis={false}
                    liveFilter={false}
                    styleAlternateRowsCls={'datagrid-alt-row'}
                    menuIcon={false}
                    filterIcon={false}
                    scrollbarSize={(this.state.seasonStats.length) * 50 < 500 ? 0 : 20}
                    //onColumnOrderChange={this.handleColumnOrderChange}
                    />
            </div>
        );

    }
});

module.exports = SeasonStandings;
