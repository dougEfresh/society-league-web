var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Link = Router.Link
    , DefaultRoute = Router.DefaultRoute;

var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var TeamLink = require('../../jsx/components/links/TeamLink.jsx');
var Util = require('../../jsx/util.jsx');
var DataGridUtil = require('../../lib/DataGridUtil.jsx');
var DataGrid = require('../../lib/DataGrid.jsx');
var TeamMatchStore = require('../../jsx/stores/TeamMatchStore.jsx');

var SeasonStandings = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function() {
         return {
             seasonStats: [],
             loading: false
         }
    },
    _onChange: function() {
        this.getData(this.props.params.seasonId);
    },
    getData: function(id) {
        var cb =  function (d) {
                if (this.props.onTeamClick) {
                    d.forEach(function(s) {
                        s.onClick = this.props.onTeamClick(s);
                    }.bind(this));
                }
                this.setState({seasonStats: d,loading: false})
            }.bind(this);

        Util.getSomeData(
                {
                    url: '/api/stat/season/' + id,
                    callback: cb,
                    module: 'SeasonStandings',
                    router: this.props.history
                }
            );
    },
    componentWillMount: function() {
        if (this.props.admin) {
            TeamMatchStore.addListener('MATCHES', this._onChange);
            TeamMatchStore.addListener('loading', this._onChange);
        }
    },
    componentDidUmount: function() {
        TeamMatchStore.remove('loading', this._onChange);
        TeamMatchStore.remove('MATCHES', this._onChange);
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
        if (this.props.admin && TeamMatchStore.isLoading()) {
            var header = <div className="col-xs-10 col-md-11 p-title">Loading...</div>;
        var body = <div style={{height: 200}} className="text-center loading">
            <span className="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>
        </div>;
            return (
                <div className={"row"} >
                    <div className={"col-xs-12 col-md-6 "} >
                        <div className={"panel panel-default panel-user-results "}>
                            <a href="#"  >
                            <div className={"panel-heading"}>
                                <div className={"row panel-title"}>
                                    {header}
                                </div>
                            </div>
                        </a>
                        <div className={"panel-body panel-animate"}>
                            {body}
                        </div>
                    </div>
                </div>
            </div>
            )
        }
        if (this.state.seasonStats.length == 0)
            return null;

        if (!this.state.seasonStats[0].season.nine) {
            var columns = [
                DataGridUtil.columns.teamRank,
                DataGridUtil.columns.team,
                DataGridUtil.columns.wins,
                DataGridUtil.columns.loses,
                DataGridUtil.columns.setWins,
                DataGridUtil.columns.setLoses,
                DataGridUtil.columns.racksWon,
                DataGridUtil.columns.racksLost,
                DataGridUtil.columns.rackPct
            ];
        } else if (this.state.seasonStats[0].season.challenge){
          columns = [
              DataGridUtil.columns.teamRank,
                DataGridUtil.columns.team,
                DataGridUtil.columns.wins,
                DataGridUtil.columns.loses,
                DataGridUtil.columns.racksWon,
                DataGridUtil.columns.racksLost,
                DataGridUtil.columns.rackPct
              ];
        } else {
            columns = [
                DataGridUtil.columns.teamRank,
                DataGridUtil.columns.team,
                DataGridUtil.columns.wins,
                DataGridUtil.columns.loses,
                DataGridUtil.columns.racksWon,
                DataGridUtil.columns.racksLost,
                DataGridUtil.columns.rackPct
            ];
        }
        var rowStyle= function(d,cls,style) {
            if (this.props.activeTeam && d.id == this.props.activeTeam.id) {
                cls.className = "selected";
            }
        }.bind(this);
        return (
                <DataGrid
                    idProperty='rank'
                    dataSource={this.state.seasonStats}
                    columns={columns}
                    //style={{height: ((this.state.seasonStats.length) * 50 < 500 ? (this.state.seasonStats.length ) * 50 : 500)}}
                    rowStyle={rowStyle}
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
        );

    }
});

module.exports = SeasonStandings;
