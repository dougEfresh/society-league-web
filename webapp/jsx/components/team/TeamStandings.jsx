var React = require('react/addons');
var Router = require('react-router');
var Bootstrap = require('react-bootstrap');
var FixedDataTable = require('fixed-data-table');
var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;

var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
var TeamMixin = require('../../mixins/TeamMixin.jsx');
var SeasonMixin = require('../../mixins/SeasonMixin.jsx');
var UserLink = require('../UserLink.jsx');
var Stat = require('../../../lib/Stat');

var TeamStandings = React.createClass({
    mixins: [TeamMixin,SeasonMixin,UserContextMixin,Router.State],
    render: function() {

        var team = this.getTeam(this.getParams().teamId);
        var stats = team.getStats(this.getParams().seasonId);
        var users = team.getMembers(this.getParams().seasonId);
        var teamHeader = 'Team' ;
        var teamRow = [];
        var rowGetter = function(rowIndex) {
            return teamData[rowIndex];
        };
        var renderName = function(cellData){
            if (cellData == undefined || cellData == null) {
                return null;
            }
            if (cellData == teamHeader) {
                return <b>{cellData}</b>
            }
            return (<UserLink user={cellData} />)
        };
        var teamData = [];
        teamData.push({
            user: teamHeader,
            wins: stats.wins,
            loses: stats.loses,
            racksFor: stats.racksFor,
            racksAgainst: stats.racksAgainst,
            handicap : ""
        })
        var i = 0;
        var userStats = [];
        users.forEach(function(u) {
            userStats.push({user: u,
                stats: u.getSeasonStats(this.getParams().seasonId),
            });
        }.bind(this));
        userStats = userStats.sort(function(a,b) {
            return Stat.sortAsc(a.stats,b.stats);
        });
        userStats.forEach(function(us){
            teamData.push({
                user: us.user ,
                wins: us.stats.wins,
                loses: us.stats.loses,
                racksFor: us.stats.racksFor,
                racksAgainst: us.stats.racksAgainst,
                handicap:  us.user.getCurrentHandicap(this.getParams().seasonId)
            })
        }.bind(this));

        return (
                <Table
                    groupHeaderHeight={30}
                    rowHeight={50}
                    headerHeight={30}
                    rowGetter={rowGetter}
                    rowsCount={teamData.length}
                    width={500}
                    height={500}
                    headerHeight={30}>
                    <Column
                        label=""
                        width={90}
                        dataKey={'user'}
                        cellRenderer={renderName}
                        />
                    <Column
                        label="HC"
                        width={50}
                        dataKey={'handicap'}
                        />
                    <Column
                        label="W"
                        width={50}
                        dataKey={'wins'}
                        />
                    <Column
                            label="L"
                            width={35}
                            //cellRenderer={renderName}
                            dataKey={'loses'}
                            isResizable={false}
                            //cellDataGetter={renderCell}
                        />
                    <Column
                        label="RW"
                        width={35}
                        dataKey={'racksFor'}
                        isResizable={false}
                        />
                    <Column
                        label="RL"
                        width={35}
                        dataKey={'racksAgainst'}
                        isResizable={false}
                        />
                </Table>
        );
    }
});


module.exports = TeamStandings;