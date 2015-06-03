var React = require('react/addons');
var FixedDataTable = require('fixed-data-table');
var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;
var UserLink = require('../links/UserLink.jsx');
var TeamLink = require('../links/TeamLink.jsx');
var Team = require('../../../lib/Team');
var UsersStat = require('../../../lib/UsersStat');
var Stat = require('../../../lib/Stat');
var TeamStat  = require('../../../lib/TeamStat');
var User  = require('../../../lib/User');
var Result = require('../../../lib/Result');
var UserMatch = require('../../../lib/UserMatch');
var TeamMatch = require('../../../lib/TeamMatch');
var RackColumnHelper = require('./RackColumnHelper.jsx');
var WinLostColumnHelper = require('./WinLostColumnHelper.jsx');
var ColumnConfig = require('./ColumnConfig.jsx');
var Router = require('react-router');
var Bootstrap = require('react-bootstrap');
var Link = Router.Link;
var Button = Bootstrap.Button;

var renderName = function(cellData){
    if (cellData == undefined || cellData == null) {
        return null;
    }
    if (cellData instanceof User) {
        return (<UserLink user={cellData} />)
    }
    if (cellData instanceof Team ) {
        return ('Team');
    }
    return cellData;
};

var renderTeamName = function(cellData){
    if (cellData == undefined || cellData == null) {
        return null;
    }
    return cellData;
};

var season = function() {
    var renderCell = function(cellKey,data) {
        if (data == undefined) {
            return "";
        }
        return data.getSeason().getDisplayName();
    };
    return (
          <Column
              cellDataGetter={renderCell}
              label="Season"
              width={ColumnConfig.season.width}
              dataKey={'season'}
              />
    );
};

var user = function(team) {
    var renderCell = function(cellKey,result) {
        if (result instanceof UserMatch) {
            return result.user;
        }
        if (result instanceof Stat) {
            return result.user != undefined ? result.user : result.team;
        }
        if (result instanceof Result) {
            return result.winnersTeam.id == team.id ? result.winner : result.loser;
        }
        return "N/A";
    };
    return (
          <Column
              label="Player"
              width={ColumnConfig.name.width}
              align={ColumnConfig.name.align}
              cellRenderer={renderName}
              dataKey={'user'}
              isResizable={false}
              cellDataGetter={renderCell}
              />
    );
};

var opponentTeam = function(team,seasonId) {
    var renderCell = function(cellKey,data) {
        if (data instanceof TeamMatch) {
            return <TeamLink team={data.getOpponent(team)} seasonId={seasonId} />;
        }
        return null;
    };
    return (
          <Column
              label="Opponent"
              width={ColumnConfig.name.width}
              align={ColumnConfig.name.align}
              cellRenderer={renderTeamName}
              dataKey={'opponentTeam'}
              isResizable={false}
              cellDataGetter={renderCell}
              />
    );
};

var opponent = function(userOrTeam) {
    var renderCell = function(cellKey,data) {
        if (data instanceof UserMatch) {
            return data.match.getOpponent(data.user);
        }
        if (data instanceof Result && userOrTeam instanceof User) {
            return data.getOpponent(userOrTeam);
        }
        if (data instanceof Result && userOrTeam instanceof Team) {
            return (data.winnersTeam.id == userOrTeam.id) ?  data.getOpponent(data.winner)
                : data.getOpponent(data.loser);
        }
        if (data instanceof TeamMatch) {

        }
    };
    return (
          <Column
              label="Opponent"
              width={ColumnConfig.name.width}
              align={ColumnConfig.name.align}
              cellRenderer={renderName}
              dataKey={'opponent'}
              isResizable={false}
              cellDataGetter={renderCell}
              />
    );
};

var opponentHandicap = function(userOrTeam) {
    var renderCell = function(cellKey,result) {
        if (result instanceof UserMatch) {
            return result.match.getOpponentHandicap(result.user);
        }
        if (result instanceof Result && userOrTeam instanceof User) {
            return result.getOpponentHandicap(userOrTeam);
        }
        if (result instanceof Result && userOrTeam instanceof Team) {
            return (result.winnersTeam.id == userOrTeam.id) ?  result.getOpponentHandicap(result.winner)
                : result.getOpponentHandicap(result.loser);
        }
        return "N/A";
    };
    return (
          <Column
               label="HC"
               width={ColumnConfig.handicap.width}
               dataKey={'opponentHandicap'}
               isResizable={false}
               cellDataGetter={renderCell}
              />
    );
};

var date = function() {
    var renderCell = function(cellKey,data) {
        return data.getShortMatchDate();
    };
    return (
    <Column
        cellDataGetter={renderCell}
        label="Date"
        width={ColumnConfig.date.width}
        dataKey={'date'}
        />
    );
};


var dateMatch = function(teamId,seasonId) {
    var renderCell = function(cellKey,data) {
        return data;
    };
    var renderLink = function(cellData) {
        return (<Link to="teamMatchResult" params={{teamId: teamId,seasonId:seasonId,teamMatchId:cellData.teamMatchId}} >
            <Button bsStyle={'primary'} bsSize='xsmall' >{cellData.getShortMatchDate()}</Button> </Link>);
    };
    return (
    <Column
        cellRenderer={renderLink}
        cellDataGetter={renderCell}
        label="Date"
        width={ColumnConfig.date.width}
        dataKey={'date'}
        />
    );
};

var hc = function(seasonId) {
    var renderCell = function(cellKey,data) {
        if (data instanceof UserMatch) {
            return data.user.getCurrentHandicap(seasonId);
        }
        if (data instanceof Stat && (data.user != undefined || data.user != null))
            return data.user.getCurrentHandicap(seasonId);

        return "";
    };
    return (
        <Column
             label="HC"
             width={ColumnConfig.handicap.width}
             dataKey={'opponentHandicap'}
             cellDataGetter={renderCell}
            />
    )
};

var loses = function() {
    var render = function(cellKey,userStats) {
        return userStats.loses;
    };
    return (
        <Column
            label={'L'}
            cellClassName="loses"
            width={ColumnConfig.loses.width}
            dataKey={'loses'}
            cellDataGetter={render}
            />
    );
};

var wins = function() {
    var render = function(cellKey,userStats) {
        return userStats.wins;
    };
    return (
        <Column
            label={'W'}
            cellClassName="wins"
            width={ColumnConfig.wins.width}
            dataKey={'wins'}
            cellDataGetter={render}
            />
    );
};
var points = function() {
    var renderCell = function(cellKey,data) {
        return data.getPoints();
    };
    return (
    <Column
        cellDataGetter={renderCell}
        label="Points"
        width={ColumnConfig.points.width}
        dataKey={'points'}
        />
    );
};

var team = function() {
    var render = function(cellKey,data) {
        if (data instanceof Stat) {
            return <TeamLink team={data.team} seasonId={data.season.id} />
        }
    };
    return (
        <Column
            label={'Team'}
            cellClassName="team"
            width={ColumnConfig.name.width}
            align={ColumnConfig.name.align}
            dataKey={'team'}
            cellRenderer={renderTeamName}
            cellDataGetter={render}
            />
    );
};

var usersTeam = function(seasonId) {
    var render = function(cellKey,data) {
        if (data instanceof Stat) {
            return <TeamLink team={data.user.getTeamForSeason(seasonId)} seasonId={seasonId} />
        }
        if (data instanceof User) {
            return <TeamLink team={data.getTeamForSeason(seasonId)} seasonId={seasonId} />
        }
    };
    return (
        <Column
            label={'Team'}
            cellClassName="team"
            width={ColumnConfig.name.width}
            align={ColumnConfig.name.align}
            dataKey={'team'}
            cellRenderer={renderTeamName}
            cellDataGetter={render}
            />
    );
};

var statType = function() {
    var render = function(cellKey,data) {
        if (data.getType() == 'season') {
            return data.season.getDisplayName();
        }
        if (data.getType() == 'all') {
            return 'overall';
        }
        return data.getType();
    };
    return (
        <Column
            label={'Type'}
            cellClassName="stat-type"
            width={ColumnConfig.season.width}
            align={ColumnConfig.name.align}
            dataKey={'stat-type'}
            cellDataGetter={render}
            />
    );
};

var winPct = function() {
    var render = function(cellKey,data) {
        return data.getWinPct();
    };
    return (
        <Column
            label={'%'}
            cellClassName="win-pct"
            width={ColumnConfig.winPct.width}
            dataKey={'win-pct'}
            cellDataGetter={render}
            />
    );
};

module.exports = {
    winLostUser : WinLostColumnHelper.winLostUser,
    winLostTeamMatch : WinLostColumnHelper.winLostTeamMatch,
    winLostTeam : WinLostColumnHelper.winLostTeam,
    hc: hc,
    points: points,
    date: date,
    dateMatch: dateMatch,
    season: season,
    opponent: opponent,
    opponentHandicap: opponentHandicap,
    name: renderName,
    user: user,
    statType: statType,
    usersTeam: usersTeam,
    team: team,
    wins: wins,
    loses: loses,
    opponentTeam: opponentTeam,
    config: {},
    winPct: winPct,
    racksForUser: RackColumnHelper.racksForUser,
    racksAgainstUser: RackColumnHelper.racksAgainstUser,
    racksAgainstTeamMember: RackColumnHelper.racksAgainstTeamMember,
    racksForTeamMember: RackColumnHelper.racksForTeamMember,
    racksAgainstTeam: RackColumnHelper.racksAgainstTeam,
    racksForTeam: RackColumnHelper.racksForTeam,
    racksAgainstStat: RackColumnHelper.racksAgainstStat,
    racksForStat: RackColumnHelper.racksForStat
};