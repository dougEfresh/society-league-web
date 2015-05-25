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
var Config = {

};

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

var winLost = function(userOrTeam) {
    var renderCell = function(cellKey,result) {
        //Could be
        try {
            if (result instanceof Result && userOrTeam instanceof User) {
                return result.isWinner(userOrTeam) ? 'W' : 'L';
            }
            if (result instanceof Result && userOrTeam instanceof Team) {
                return result.winnersTeam.id == userOrTeam.id ? 'W' : 'L';
            }
            if (result instanceof TeamMatch) {
                return result.isWinner(userOrTeam) ? 'W' :'L';
            }
        } catch(e){
            console.log(e);
        }
        return 'N/A';
    };
    return (
        <Column
            label={'W/L'}
            cellClassName="win-lost"
            width={35}
            dataKey={'wl'}
            cellDataGetter={renderCell}
            />
    );
};

var racksFor = function(userOrTeam) {
    var render = function(cellKey,result) {
        try {
            if (result instanceof UsersStat) {
                return result.stat.racksFor;
            }
            if (result instanceof Result && userOrTeam instanceof Team) {
                return result.getRacks(userOrTeam.id == result.winnersTeam.id ? result.winner : result.loser);
            }
            if (result instanceof Result && userOrTeam instanceof User) {
                return result.getRacks(user);
            }
            if (result instanceof TeamMatch) {
                return result.getRacks(userOrTeam);
            }
        } catch(e) {
            console.warn(e);
        }
        return 0;
    };
    return (
            <Column
                label={'RW'}
                cellClassName="racks"
                width={50}
                dataKey={'racksFor'}
                cellDataGetter={render}
                />
        );
};

var racksAgainst = function(userOrTeam) {
    var renderCell = function(cellKey,result) {
         try {
            if (result instanceof UsersStat) {
                return result.stat.racksAgainst;
            }
             if (result instanceof Result && userOrTeam instanceof Team) {
                 return result.getOpponentRacks(userOrTeam.id == result.winnersTeam.id ? result.loser : result.winner);
             }
            if (result instanceof Result) {
                var user = _findUser(userOrTeam,result);
                return result.getOpponentRacks(user);
            }
             if (result instanceof TeamMatch) {
                 return result.getOpponentRacks(userOrTeam);
             }
         } catch(e) {
            console.warn(e);
        }
        return 0;
    };
    return (
            <Column
                label={'RL'}
                cellClassName="racks"
                width={50}
                dataKey={'racksAgainst'}
                cellDataGetter={renderCell}
                />
        );
};

function _findUser(userOrTeam,result){
    var user = userOrTeam;
    if (userOrTeam instanceof Team) {
        user = result.winnersTeam.id == userOrTeam.id ? m.winner : m.loser;
    }
    return user;
};

module.exports = {
    winLost: winLost,
    racksFor: racksFor,
    racksAgainst: racksAgainst,
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
    config: Config
};