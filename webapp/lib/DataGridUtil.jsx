var React = require('react/addons');
var UserLink = require('../jsx/components/links/UserLink.jsx');
var TeamLink = require('../jsx/components/links/TeamLink.jsx');
var Util = require('../jsx/util.jsx');
var TeamMatchStore = require('../jsx/stores/TeamMatchStore.jsx');
var PlayerMatchStore = require('../jsx/stores/PlayerMatchStore.jsx');
var admin = false;
var moment = require('moment');
var nineBallRacks = [];
var matchDates = [];
var setWins = [];
var gameType = [];
var Router = require('react-router')
    , Route = Router.Route
    , Link = Router.Link;

gameType.push(<option key='8' value = 'MIXED_EIGHT'>{'8'}</option>);
gameType.push(<option key='9' value = 'MIXED_NINE'>{'9'}</option>);

var matchNumberOptions = [];
for(var i = 1; i<39 ; i++) {
    matchNumberOptions.push(<option key={i} value={i} >{i}</option>)
}
for(var i = 0; i<6 ; i++) {
    setWins.push(<option key={i} value={i}>{i}</option>);
}

for(var i = 0; i<40 ; i++) {
    nineBallRacks.push(<option key={i} value={i}>{i}</option>);
}

var renderPlayer=function(v,data,cp) {
    cp.className="user";
    return <UserLink onClick={data.user.onClick} user={data.user} season={data.season} />
};

var renderWinner=function(v,data,cp) {
    cp.className="user";
    return <UserLink  user={data.winner} season={data.season} />
};

var renderHomeTeam = function(v,data,cp) {
    cp.className="user";
    if (data.season.challenge) {
        if (data.playerHome) {
            return <UserLink user={data.playerHome} season={data.season}/>
        }
        else {
            return <UserLink user={data.challenger} season={data.season}/>
        }
    }
    return <TeamLink team={data.home} />
};

var renderAwayTeam = function(v,data,cp) {
    cp.className="user";
    if (data.season.challenge) {
        return <UserLink user={data.opponent} season={data.season}/>
    }
    return <TeamLink team={data.away} />
};


var renderHome = function(v,data,cp) {
    cp.className="user";
    if (data.season.challenge) {
        if (data.playerHome) {
            return <UserLink user={data.playerHome} season={data.season}/>
        }
        else {
            return <UserLink user={data.challenger} season={data.season}/>
        }
    }
    return <TeamLink team={data.home} />
};

var renderAway = function(v,data,cp) {
    cp.className="user";
    if (data.season.challenge) {
        if (data.playerAway)
            return <UserLink user={data.playerAway} season={data.season}/>
        else
            return <UserLink user={data.opponent} season={data.season}/>
    }
    return <TeamLink team={data.away} />
};

var renderLoser=function(v,data,cp) {
    cp.className="user";
    return <UserLink  user={data.loser} season={data.season} />
};
var renderChallenger=function(v,data,cp) {
    cp.className="user";
    return <UserLink  user={data.home} season={data.season} />
};

var renderChallengeOpponent=function(v,data,cp) {
    cp.className="user";

    return <UserLink  user={data.away} season={data.season} />
};


var renderOpponent=function(v,data,cp) {
    cp.className="user";
    return <UserLink onClick={data.opponent.onClick} user={data.opponent} season={data.season} />};
var renderOpponentTeam=function(v,data,cp) {
    cp.className="team";
    return <TeamLink onClick={data.opponentTeam.onClick} team={data.opponentTeam}  />};

var renderTeam=function(v,data,cp) {
    cp.className = "team";
    if (data.team != undefined && data.team.onClick != undefined)
        return <TeamLink onClick={data.team.onClick} team={data.team}/>;
    else
        return <TeamLink onClick={data.onClick} team={data}/>;
};


var renderPartner=function(v,data,cp) {
    cp.className="user";
    if (!data.partner) {
        return <span></span>
    }
    return <UserLink onClick={data.partner.onClick} user={data.partner} season={data.season} />
};
var renderOpponentPartner= function(v,data,cp) {
    cp.className="user";
    if (!data.opponentPartner) {
        return <span></span>
    }
    return <UserLink onClick={data.opponentPartner.onClick} user={data.opponentPartner} season={data.season} />
};

var opponentPartner =
{
    name: 'opponentPartner', title: 'Op. Pr.', flex: 1, style: {minWidth: 100}, filterable: false, render: renderOpponentPartner
};

var opponent =
    {
            name: 'opponent', title: 'Opponent', flex: 1, style: {minWidth: 100}, filterable: false,
            render: renderOpponent, sort: 'asc', number: false
};

var partner =
{
    name: 'partner', title: 'Partner', flex: 1, style: {minWidth: 100}, filterable: false,
    render: renderPartner
}

var opponentTeam =
{
            name: 'opponentTeam', title: 'Op. Team', flex: 1, style: {minWidth: 100}, filterable: false,
            render: renderOpponentTeam
};
var team =
{
    name: 'team', title: 'Team', flex: 1, style: {minWidth: 100},  filterable: false,
    render: renderTeam, sort: 'asc', number: false
};

var player =  {
    name: 'player',
    title: ' Player ', flex: 1,
    //title: <span className="">Player</span>, flex: 1,
    style: {minWidth: 100}, filterable: false,
    render: renderPlayer,
    sort: 'asc',
    number: false
};


var home  = {
    name: 'challenger', title: 'Challenger', flex: 1, style: {minWidth: 100},  filterable: false,
    render: renderHome, sort: 'asc', number: false
};

var away  = {
    name: 'challengeOpponent', title: 'Opponent', flex: 1, style: {minWidth: 100},  filterable: false,
    render: renderAway, sort: 'asc', number: false
};

var challenger  = {
    name: 'challenger', title: 'Challenger', flex: 1, style: {minWidth: 100},
    render: renderHome
};

var challengeOpponent  = {
    name: 'challengeOpponent', title: 'Opponent', flex: 1, style: {minWidth: 100},  filterable: false,
    render: renderAway, sort: 'asc', number: false
};

var homeRacks = {
    name: 'homeRacks', title: 'R', flex: 1, style: {minWidth: 70}, width: 70,
    render: function(v,data) {
        if (admin) {
            var racks = data.homeRacks;
            return (
                <select ref='racks'
                        onChange={TeamMatchStore.onChange(data,'homeRacks')}
                        className="form-control"
                        value={racks}
                        type={'select'}>
                    {nineBallRacks}
                </select>
            )
        }
        return <span>{data.homeRacks}</span>
    }
};

var playerHomeRacks = {
    name: 'homeRacks', title: 'R', flex: 1, style: {minWidth: 70}, width: 70,
    render: function(v,data) {
        if (admin) {
            var racks =  data.homeRacks;
            return (
                <select ref='racks'
                        onChange={PlayerMatchStore.onChange(data,'homeRacks')}
                        className="form-control"
                        value={racks}
                        type={'select'}>
                    {data.season.nine ? nineBallRacks : nineBallRacks.slice(0,2)}
                </select>
            )
        }
        return <span>{data.playerHomeRacks}</span>
    }
};


var setHomeWins = {
    name: 'setHomeWins', title: 'SW', flex: 1, style: {minWidth: 70}, width: 70,
    render: function(v,data) {
        if (admin) {
            return (
                <select ref='racks'
                        onChange={TeamMatchStore.onChange(data,'setHomeWins')}
                        className="form-control"
                        value={data.setHomeWins}
                        type={'select'}>
                    {setWins}
                </select>
            )
        }
        return <span>{data.setHomeWins}</span>
    }
};

var setAwayWins = {
    name: 'setAwayWins', title: 'SW', flex: 1, style: {minWidth: 70}, width: 70,
    render: function(v,data) {
        if (admin) {
            return (
                <select ref='racks'
                        onChange={TeamMatchStore.onChange(data,'setAwayWins')}
                        className="form-control"
                        value={data.setAwayWins}
                        type={'select'}>
                    {setWins}
                </select>
            )
        }
        return <span>{data.setAwayWins}</span>
    }
};

var awayRacks = {
    name: 'awayRacks', title: 'R', flex: 1, style: {minWidth: 70}, width: 70,
    render: function(v,data) {
        if (admin) {
            var racks = data.awayRacks != undefined ? data.awayRacks : data.playerAwayRacks;
            return (
                <select ref='racks'
                        onChange={TeamMatchStore.onChange(data,'awayRacks')}
                        className="form-control"
                        value={racks}
                        type={'select'}>
                    {nineBallRacks}
                </select>
            )
        }
        return <span>{data.awayRacks}</span>
    }
};


var playerAwayRacks = {
    name: 'awayRacks', title: 'R', flex: 1, style: {minWidth: 70}, width: 70,
    render: function(v,data) {
        if (admin) {
            var racks =  data.awayRacks;
            return (
                <select ref='racks'
                        onChange={PlayerMatchStore.onChange(data,'awayRacks')}
                        className="form-control"
                        value={racks}
                        type={'select'}>
                    k{data.season.nine ? nineBallRacks : nineBallRacks.slice(0,2)}
                </select>
            )
        }
        return <span>{data.awayRacks}</span>
    }
};

var columns = {
    'playerMatchDate': {name: 'date', title: 'Date', width: 60, filterable: false, sort: 'dsc', number: false},
    'matchDate': {name: 'date', title: 'Date', width: 63, render: function(v,data) {return <span>{Util.formatDateTime(data.matchDate)}</span>} , filterable: false, sort: 'dsc', number: false},
    'matchTime': {name: 'time', title: 'Time', width: 60, render: function(v,data) {return <span>{Util.formatTime(data.matchDate)}</span>} , filterable: false, sort: 'dsc', number: false},
    'rank' : {name: 'rank' , title: '#', width: 45, filterable: false, number: true, sort: 'asc', render: function(v,d,cp) {return <span>{d.rank ? d.rank + " ": "0 "}</span>}},
    'result': {
        name: 'result', title: 'W/L', width: 55,  filterable: false, render: function (v, data, cp) {
            if (data.win) {
                cp.className = cp.className + " win-result";
            }
            return <span>{data.result}</span>
        }, number: false, sort: 'asc'
    },
    'score': {
        name: 'score', title: 'S', width: 48, filterable: false,
        render: function (v, data, cp) {
            if (data.hill) {
                cp.className = cp.className + " hill";
            }
            return <span>{data.score}</span>
        }
    },
    'race': {name: 'race', title: 'Race', width: 55},
    //todo remove
    'teamRank': {name: 'rank', title: '#', width: 50,render: function(v,d) {return <span>{d.rank +" "}</span>}},
    'opponent': opponent,
    'opponentTeam': opponentTeam,
    'team': team,
    'opponentHandicap': {name: 'opponentHandicap', title: 'Op. HC', width: 72, filterable: false, sort: 'asc', number: false},
    'opponentPartnerHandicap': {name: 'opponentPartnerHandicap', title: 'Op. Pr. HC', width: 65, filterable: false},
    'partnerHandicap': {name: 'partnerHandicap', title: 'Pr. HC', width: 72, filterable: false},
    'handicap' : {name: 'handicap', title: 'HC', width: 45 , sort: 'asc', number: false, filterable: false},
    'player' : player,
    'partner': partner,
    'opponentPartner': opponentPartner,

    'teamMemberHandicap': {name: 'teamMemberHandicap', title: 'HC', width: 45, filterable: false },
    'wins': {name: 'wins', title: 'W', width: 50, filterable: false , sort: 'asc', number: true , render: function(v,data) {
        if (data.wins != undefined)
            return <span>{data.wins}</span>;

        return <span>{data.stats.wins}</span>

    }},
    'loses': {name: 'loses', title: 'L', width: 50, filterable: false , sort: 'asc', number: true,
        render: function(v,data) {
        if (data.loses != undefined)
            return <span>{data.loses}</span>;

        return <span>{data.stats.loses}</span>

    }
    },
    'racksWon': {name: 'racksWon', title: 'RW', width: 50, filterable: false , sort: 'asc', number: true,
     render: function(v,data) {
        if (data.racksWon != undefined)
            return <span>{data.racksWon}</span>;

        return <span>{data.stats.racksWon}</span>

    }
    },
    'racksLost': {name: 'racksLost', title: 'RL', width: 50, filterable: false , sort: 'asc', number: true,
     render: function(v,data) {
        if (data.racksLost != undefined)
            return <span>{data.racksLost}</span>;

        return <span>{data.stats.racksLost}</span>

    }
    },
    'setWins': {name: 'setWins', title: 'SW', width: 55, filterable: false , render: function(v,data){
            if (data.setWins)
                return  <span>{data.setWins}</span>;

            return <span>{data.stats.setWins}</span>;
    }},
    'setLoses': {name: 'setLoses', title: 'SL', width: 55, filterable: false , render: function(v,data){
            if (data.setLoses)
                return  <span>{data.setLoses}</span>;

            return <span>{data.stats.setLoses}</span>;
    }},
    'winPct': {name: 'winPct', title: 'PCT', width: 55, filterable: false , render: function(v,data){return (<span>{data.winPct.toFixed(3)}</span>); }},
    'rackPct': {name: 'rackPct', title: 'PCT', width: 60, filterable: false ,
        render: function(v,data){
            if (data.rackPct)
                return  <span>{data.rackPct.toFixed(3)}</span>;

            if (data.stats && data.stats.rackPct)
                return <span>{data.stats.rackPct.toFixed(3)}</span>;

            return <span>0</span>;
        }
    },
    'points': {name: 'points', title: 'P', width: 50, filterable: false ,
        render: function(v,data){
            if (data.points != undefined) {
                return <span>{data.points.toFixed(2)}</span>;
            }
            return <span>{data.matchPoints == undefined ? 0 : data.matchPoints.points}</span>;
        }
    },
    'weightedAvg': {name: 'weightedAvg', title: 'Avg P.', width: 60, filterable: false ,
        render: function(v,data){return (<span>{data.matchPoints == undefined ? 0 : data.matchPoints.weightedAvg.toFixed(3)}</span>); }
    },
    'matchNum':  {name: 'matchNum', title: '#', width: 50, filterable: false ,
        render: function(v,data){
            if (admin) {
                  return  <select ref='matchNum'
                        onChange={PlayerMatchStore.onChange(data,'matchNumber')}
                        className="form-control"
                        value={data.matchNumber}
                        type={'select'}>
                      {matchNumberOptions}
                </select>
            }
            if (data.matchNumber != undefined){
                return (<span>{data.matchNumber}</span>);
            }
            return (<span>{data.matchPoints == undefined ? "" : data.matchPoints.matchNum}</span>);
        }
    },
    'calculation':  {name: 'calculation', title: ' ', width: 95, filterable: false ,
        render: function(v,data){return (<span>{data.matchPoints == undefined ? "" : data.matchPoints.calculation}</span>); }
    },
    'winner' : {name: 'winner', title: 'Victor', width: 100, style: {minWidth: 100}, filterable: false, render: renderWinner },
    'loser' :  {name: 'loser', title: 'Opponent', width: 100, style: {minWidth: 100}, filterable: false, render: renderLoser },
    'challenger' : challenger,
    'homeTeam' : {name: 'home', title: 'Home', width: 100, style: {minWidth: 100},render: renderHomeTeam},
    'awayTeam' : {name: 'away',  title: 'Away' ,width: 100, style: {minWidth: 100}, render: renderAwayTeam},
    'challengeOpponent': challengeOpponent,
    'homeRacks' : homeRacks,
    'awayRacks' : awayRacks,
    'homeForfeits' :  {name: 'homeForfeits', title: 'H Forfeits ', width: 85, filterable: false ,
        render:  function(v,data){
            return (<select ref='racks'
                        onChange={TeamMatchStore.onChange(data,'homeForfeits')}
                        className="form-control"
                        value={data.homeForfeits}
                        type={'select'}>
                    {nineBallRacks}
                </select>);
        }
    },
    'awayForfeits' :  {name: 'awayForfeits', title: 'A Forfeits ', width: 85, filterable: false ,
          render:  function(v,data){
            return (<select ref='racks'
                        onChange={TeamMatchStore.onChange(data,'awayForfeits')}
                        className="form-control"
                        value={data.awayForfeits}
                        type={'select'}>
                    {nineBallRacks}
                </select>);
        }
    },
    'handicapRacks' :  {name: 'handicapRacks', title: 'HC Racks ', width: 85, filterable: false ,
        render: function(v,data){return (<span>{data.handicapRacks}</span>); }
    },
    'setHomeWins' : setHomeWins,
    'setAwayWins' : setAwayWins,
    'deleteMatch' :  {name: 'matchDelete', title: '', width: 60, style: {minWidth: 60}, render: function(v,data) {
        if (admin)
            return (<button onClick={TeamMatchStore.handleDelete(data)} type="button" className="btn btn-xs btn-danger btn-responsive team-match-delete">
                    <span className="glyphicon glyphicon-remove"></span>
                </button>
            );

        else
            return (<button type="button" className="btn btn-xs btn-danger btn-responsive team-match-delete">
                    <span className="glyphicon glyphicon-remove"></span>
                </button>
            );
    }},
    'deletePlayerMatch' :  {name: 'matchDelete', title: '', width: 60, style: {minWidth: 60}, render: function(v,data) {
        return (<button onClick={PlayerMatchStore.handleDelete(data)} type="button" className="btn btn-xs btn-danger btn-responsive team-match-delete">
                <span className="glyphicon glyphicon-remove"></span>
            </button>
        );
    }
    },
    'submit' : {name: 'submit', title: '', width: 60, style: {minWidth: 60},  render: function(v,data) {
        if (admin) {
             return (
                 <button onClick={TeamMatchStore.handleSubmit(data)} type="button" className="btn btn-xs btn-primary btn-responsive team-match-add">
                    <span className="glyphicon glyphicon-ok-sign"></span><span> Change Date</span>
                 </button>
             );
        } else {
            return null;
        }
    }
    },
    'playerResults' : {name: 'results', title: 'Results', width: 60, style: {minWidth: 60},  render: function(v,data) {
        if (data.forfeit) {
            return null;
        }
        if (data.hasResults && !data.hasPlayerResults) {
            return (
                <div >
                    <Link to={'/app/season/' + data.season.id + '/team/results/'  + moment(data.matchDate).format('YYYY-MM-DD')  +'/playerresults/' +data.id}>
                        <button type="button"
                                className="btn btn-xs btn-danger btn-responsive  team-match-add">
                            <span>!! Enter Results !!</span>
                        </button>
                    </Link>
                </div>
            )
        }
        if (data.hasResults && data.hasPlayerResults) {
            var btn = "btn-primary";
            if (data.selected)  {
                btn = "btn-success";
            }
            return (
                <div >
                    <Link to={'/app/season/' + data.season.id + '/team/results/' + moment(data.matchDate).format('YYYY-MM-DD')  +'/playerresults/' +data.id}>
                        <button type="button"
                                className={"btn btn-xs " + btn + " btn-responsive  team-match-add"}>
                            <span> Results </span>
                        </button>
                    </Link>
                </div>
            )
        }

        if (data.hasResults) {
             return (
                <div >
                    <Link to={'/app/season/' + data.season.id + '/team/results/'  + moment(data.matchDate).format('YYYY-MM-DD')  +'/playerresults/' +data.id}>
                        <button type="button"
                                className="btn btn-xs btn-danger btn-responsive  team-match-add">
                            <span>!! Enter Results !!</span>
                        </button>
                    </Link>
                </div>
            )
        }
        return (
            null
        );
    }
    },
    'gameType' : {name: 'gameType', title: 'Game', width: 80, style: {minWidth: 80} , render: function(v,data) {
        var gt = "8";
        if (data.division == 'MiXED_NINE') {
            gt = "9";
        }
        if (admin) {
         return  <select ref='gameType'
                        onChange={TeamMatchStore.onChange(data,'gameType')}
                        className="form-control"
                        value={data.division}
                        type={'select'}>
                {gameType}
                </select>
        }
        return <span>{gt}</span>

    }
    }, 'forfeit': {name: 'forfeit', title: 'Forfeit' , width: 80, render: function(v,data) {
        return null;
    }}
};

var dateOptions = [];
var timeOptions = [];
var dt;
var dates = [];
for(var i = 0; i<91; i++) {
    dt = moment().subtract(i,'days').format('YYYY-MM-DD');
    //this.dateOptions.push(<option key={dt} value={dt}>{dt}</option>)
    dates.push(dt);
}

for(var i = 1; i<90; i++) {
    dt = moment().add(i,'days').format('YYYY-MM-DD');
    //
    dates.push(dt);
}

dates = dates.sort();
dates.forEach(function(d) {
    dateOptions.push(<option key={d} value={d}>{d}</option>)
});

timeOptions.push(<option key={'11:00'} value={'11:00:00'}>{'11:00'}</option>)
timeOptions.push(<option key={'12:00'} value={'12:00:00'}>{'12:00'}</option>)

for (var i = 1; i<7;i ++) {
    timeOptions.push(<option key={i + ':00'} value={ (i + 12) + ':00:00'}>{i+':00'}</option>)
}

var timeColumn = {};
    timeColumn.name = 'time';
    timeColumn.title = 'time';
    timeColumn.width = 100;
    timeColumn.style = {minWidth: 100};
    timeColumn.render = function(v,data,cp) {
        var time = data.matchDate.split('T')[1];
        return (
            <select ref={'time'}
                    onChange={TeamMatchStore.onChange(data,'time')}
                    className="form-control"
                    value={time}
                    type={'select'}>
                {timeOptions}
            </select>
        )
    }.bind(this);

var dateColumn = {};
    dateColumn.name = 'date';
    dateColumn.title = 'date';
    dateColumn.width = 130;
    dateColumn.style = {minWidth: 130};
    dateColumn.render = function(v,data,cp) {
        var time = data.matchDate.split('T')[0];
        return (
            <select ref={'time'}
                    onChange={TeamMatchStore.onChange(data,'date')}
                    className="form-control"
                    value={time}
                    type={'select'}>
                {dateOptions}
            </select>
        )
    }.bind(this);

var adminPlayerColumns = function (teamMatch,members) {
      var homeTeam =  {name: 'home', title: 'Home', width: 100, style: {minWidth: 100},render: function(v,data) {
        return (
            <select ref={'homeTeam'}
                onChange={PlayerMatchStore.onChange(data,'playerHome')}
                className="form-control"
                value={data.playerHome.id}
                type={'select'}>
                {members.home}
        </select>)
    }};
    var awayTeam =  {name: 'away', title: 'Away', width: 100, style: {minWidth: 100},render: function(v,data) {
        return (<select ref={'awayTeam'}
                onChange={PlayerMatchStore.onChange(data,'playerAway')}
                className="form-control"
                value={data.playerAway.id}
                type={'select'}>
            {members.away}
        </select>);
    }};

    var homePartner =  {name: 'homeHomePartner', title: 'Partner', width: 100, style: {minWidth: 100},render: function(v,data) {
        return (
            <select ref={'playerHome'}
                onChange={PlayerMatchStore.onChange(data,'playerHomePartner')}
                className="form-control"
                value={data.playerHomePartner == null ? '-1' : data.playerHomePartner.id}
                type={'select'}>
                {members.home}
        </select>)
    }};
    var awayPartner =  {name: 'playerAwayPartner', title: 'Partner Away', width: 100, style: {minWidth: 100},render: function(v,data) {
        return (<select ref={'playerAwayPartner'}
                onChange={PlayerMatchStore.onChange(data,'playerAwayPartner')}
                className="form-control"
                value={data.playerAwayPartner == null ? '-1' : data.playerAwayPartner.id}
                type={'select'}>
            {members.away}
        </select>);
    }};

    var c = [
        columns.matchNum,
        homeTeam,
        playerHomeRacks,
        awayTeam,
        playerAwayRacks,
        columns.deletePlayerMatch
    ];

    if (teamMatch.season.scramble) {
        c = [ columns.matchNum,
            homeTeam,
            homePartner,
            playerHomeRacks,
            awayTeam,
            awayPartner,
            playerAwayRacks,
            columns.deletePlayerMatch
        ];
    }
    return c;
};

var adminColumns = function adminColumns(s,teams) {
    var homeTeam =  {name: 'home', title: 'Home', width: 100, style: {minWidth: 100},render: function(v,data) {
        return (
            <select ref={'homeTeam'}
                onChange={TeamMatchStore.onChange(data,'home')}
                className="form-control"
                value={data.home.id}
                type={'select'}>
            {teams}
        </select>)
    }};
    var awayTeam =  {name: 'away', title: 'Away', width: 100, style: {minWidth: 100},render: function(v,data) {
        return (<select ref={'awayTeam'}
                onChange={TeamMatchStore.onChange(data,'away')}
                className="form-control"
                value={data.away.id}
                type={'select'}>
            {teams}
        </select>);
    }};

        var c = [
            columns.submit,
            columns.playerResults,
            dateColumn,
            homeTeam,
            columns.homeRacks,
            columns.homeForfeits,
            awayTeam,
            columns.awayRacks,
            columns.awayForfeits,
            //columns.forfeit,
            columns.handicapRacks,
            columns.deleteMatch
        ];
        if (s.nine) {
            c = [
                columns.submit,
                columns.playerResults,
                dateColumn,
                homeTeam,
                columns.homeRacks,
                columns.setHomeWins,
                awayTeam,
                columns.awayRacks,
                columns.setAwayWins,
                columns.deleteMatch
            ];
        }
        if (s.challenge) {
            c = [
                 columns.submit,
                dateColumn,
                timeColumn,
                homeTeam,
                columns.homeRacks,
                awayTeam,
                columns.awayRacks,
                columns.score,
                columns.race,
                columns.deleteMatch
            ];
        }
        if (s.scramble) {
            c = [
                columns.submit,
                columns.playerResults,
                dateColumn,
                homeTeam,
                columns.homeRacks,
                awayTeam,
                columns.awayRacks,
                columns.gameType,
                columns.deleteMatch
            ];
        }
    return c;
}

var adminMode = function() {admin = true};
module.exports = {columns : columns, adminColumns: adminColumns, adminPlayerColumns: adminPlayerColumns, adminMode: adminMode};

