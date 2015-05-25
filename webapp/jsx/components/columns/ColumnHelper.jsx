var React = require('react/addons');
var FixedDataTable = require('fixed-data-table');
var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;
var UserLink = require('../UserLink.jsx');
var TeamLink = require('../TeamLink.jsx');
var Team = require('../../../lib/Team');
var UsersStat = require('../../../lib/UsersStat');
var TeamStat  = require('../../../lib/TeamStat');
var User  = require('../../../lib/User');
var Result = require('../../../lib/Result');
var TeamMatch = require('../../../lib/TeamMatch');

var RackColumnHelper = require('./RackColumnHelper.jsx');
var WinLostColumnHelper = require('./WinLostColumnHelper.jsx');

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
              width={125}
              dataKey={'season'}
              />
    );
};

var user = function(team) {
    var renderCell = function(cellKey,result) {
        if (result instanceof UsersStat) {
            return result.user;
        }
        if (result instanceof TeamStat) {
            return result.team;
        }
        if (result instanceof Result) {
            return result.winnersTeam.id == team.id ? result.winner : result.loser;
        }
        return "N/A";
    };
    return (
          <Column
              label="Player"
              width={90}
              cellRenderer={renderName}
              dataKey={'opponent'}
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
              width={90}
              cellRenderer={renderTeamName}
              dataKey={'opponent'}
              isResizable={false}
              cellDataGetter={renderCell}
              />
    );
};

var opponent = function(userOrTeam) {
    var renderCell = function(cellKey,data) {
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
              width={90}
              cellRenderer={renderName}
              dataKey={'opponent'}
              isResizable={false}
              cellDataGetter={renderCell}
              />
    );
};

var opponentHandicap = function(userOrTeam) {
    var renderCell = function(cellKey,result) {
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
               width={30}
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
        width={50}
        dataKey={'date'}
        />
    );
};

var hc = function(seasonId) {
    var renderCell = function(cellKey,data) {
        if (data instanceof UsersStat)
            return data.getCurrentHandicap(seasonId);

        return "";
    };
    return (
        <Column
             label="HC"
             width={30}
             dataKey={'opponentHandicap'}
             cellDataGetter={renderCell}
            />
    )
};

var loses = function() {
    var render = function(cellKey,userStats) {
        return userStats.stat.loses;
    };
    return (
        <Column
            label={'L'}
            cellClassName="loses"
            width={35}
            dataKey={'loses'}
            cellDataGetter={render}
            />
    );
};

var wins = function() {
    var render = function(cellKey,userStats) {
        return userStats.stat.wins;
    };
    return (
        <Column
            label={'W'}
            cellClassName="wins"
            width={35}
            dataKey={'wins'}
            cellDataGetter={render}
            />
    );
};



module.exports = {
    winLostUser : WinLostColumnHelper.winLostUser,
    winLostTeamMatch : WinLostColumnHelper.winLostTeamMatch,
    winLostTeam : WinLostColumnHelper.winLostTeam,
    hc: hc,
    date: date,
    season: season,
    opponent: opponent,
    opponentHandicap: opponentHandicap,
    name: renderName,
    user: user,
    wins: wins,
    loses: loses,
    opponentTeam: opponentTeam,
    config: {},
    racksForUser: RackColumnHelper.racksForUser,
    racksAgainstUser: RackColumnHelper.racksAgainstUser,
    racksAgainstTeamMember: RackColumnHelper.racksAgainstTeamMember,
    racksForTeamMember: RackColumnHelper.racksForTeamMember,
    racksAgainstStat: RackColumnHelper.racksAgainstStat,
    racksForStat: RackColumnHelper.racksForStat
};