var React = require('react/addons');
var Router = require('react-router');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var UserLink = require('../../jsx/components/links/UserLink.jsx');
var Util = require('../../jsx/util.jsx');
var Handicap = require('../../lib/Handicap');
var DataGridUtil = require('../../lib/DataGridUtil.jsx');
var DataGrid = require('../../lib/DataGrid.jsx');

var TeamStandings = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function() {
         return {
             statTeam: null,
             statTeamMembers: [],
        }
    },
    getData: function(id) {
        Util.getSomeData(
            {
                url: '/api/team/' + id ,
                callback: function(d){this.setState({statTeam: d});}.bind(this),
                module: 'TeamStandings',
                router: this.props.history
            });
        var cb = function(d) {
            this.state.statTeamMembers = [];
            d.forEach(function(s) {
                if (this.props.onUserClick) {
                    s.user.onClick = this.props.onUserClick(s.user);
                }
                if (s.user != undefined && s.user.real) {
                    this.state.statTeamMembers.push(s);
                }
            }.bind(this));
            this.setState({});
        }.bind(this);
        Util.getSomeData(
            { url: '/api/stat/team/' + id + '/members',
                callback: cb,
                module: 'TeamStandings',
                router: this.props.history}
        );
    },
    componentDidMount: function () {
        if (this.props.team != undefined)
            this.getData(this.props.team.id);
    },
    componentWillReceiveProps: function (n) {
        if (n.team == undefined || n.team == null)
            return ;
        if (this.props.team == undefined || this.props.team == null) {
            this.getData(n.team.id);
            return;
        }
        if (this.props.team.id  != n.team.id)
            this.getData(n.team.id);
    },
    render: function() {
        var stat = this.state.statTeam;
        if (stat == null || this.state.statTeamMembers.length == 0)
            return null;
        var s = stat.season;
        var columns = [
            DataGridUtil.columns.rank,
            DataGridUtil.columns.player,
            DataGridUtil.columns.handicap,
            DataGridUtil.columns.wins,
            DataGridUtil.columns.loses,
            DataGridUtil.columns.racksWon,
            DataGridUtil.columns.racksLost,
            DataGridUtil.columns.rackPct
        ];
        if (!s.nine) {

        }
        if (s.scramble) {
            this.state.statTeamMembers = this.state.statTeamMembers.sort(function(a,b) {
                if (a.user.name == b.user.name) {
                    return a.type.localeCompare(b.type);
                }
                return a.user.name.localeCompare(b.user.name);
            });
            columns = [
                DataGridUtil.columns.rank,
                DataGridUtil.columns.player,
                DataGridUtil.columns.game,
                DataGridUtil.columns.handicap,
                DataGridUtil.columns.wins,
                DataGridUtil.columns.loses,
                DataGridUtil.columns.winPct
            ];
        }


         var rowStyle= function(d,cls,style) {
            if (this.props.activeUser && d.user.id == this.props.activeUser.id) {
                cls.className = "selected";
            }
        }.bind(this);
        return (
                <DataGrid
                    idProperty='rank'
                    dataSource={this.state.statTeamMembers}
                    columns={columns}
                    //style={{height: ((this.state.statTeamMembers.length) * 50 < 500 ? (this.state.statTeamMembers.length ) * 50 : 500)}}
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
                    scrollbarSize={(this.state.statTeamMembers) * 50 < 500 ? 0 : 20}
                    //onColumnOrderChange={this.handleColumnOrderChange}
                    />
        );
    }
});

module.exports = TeamStandings;
