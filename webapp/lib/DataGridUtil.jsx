var React = require('react/addons');
var UserLink = require('../jsx/components/links/UserLink.jsx');
var TeamLink = require('../jsx/components/links/TeamLink.jsx');
var Util = require('../jsx/util.jsx');
var moment = require('moment');

var nineBallRacks = [];
var matchDates = [];

for(var i = 0; i<12 ; i++) {
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
    cp.className="us00er";
    return <UserLink onClick={data.opponent.onClick} user={data.opponent} season={data.season} />};
var renderOpponentTeam=function(v,data,cp) {
    cp.className="team";
    return <TeamLink onClick={data.opponentTeam.onClick} team={data.opponentTeam}  />};

var renderTeam=function(v,data,cp) {
    cp.className="team";
    return <TeamLink onClick={data.team.onClick} team={data.team}  />};


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
    title: <span> Player </span>, flex: 1,
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

var homeRacksAdmin = {
    name: 'homeRacks', title: 'R', flex: 1, style: {minWidth: 70}, width: 70,
    render: function(v,data) {
        if (data.onChange) {
            return (
                <select ref='racks'
                        onChange={data.onChange(data,'homeRacks')}
                        className="form-control"
                        value={data.homeRacks}
                        type={'select'}>
                    {nineBallRacks}
                </select>
            )
        }
        return <span>{data.homeRacks}</span>
    }
};

var awayRacksAdmin = {
    name: 'awayRacks', title: 'R', flex: 1, style: {minWidth: 70}, width: 70,
    render: function(v,data) {
        if (data.onChange) {
            return (
                <select ref='racks'
                        onChange={data.onChange(data,'awayRacks')}
                        className="form-control"
                        value={data.awayRacks}
                        type={'select'}>
                    {nineBallRacks}
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
    'rank' : {name: 'rank' , title: '#', width: 40, filterable: false, number: true, sort: 'asc', render: function(v,d,cp) {return <span>{d.rank ? d.rank : "0"}</span>}},
    'result': {
        name: 'result', title: 'W/L', width: 45,  filterable: false, render: function (v, data, cp) {
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
    'race': {name: 'race', title: 'Race', width: 55,filterable: false},
    'teamRank': {name: 'rank', title: '#', width: 50,filterable: false, render: function(v,d) {return <span>{d.team.rank}</span>}},
    'opponent': opponent,
    'opponentTeam': opponentTeam,
    'team': team,
    'opponentHandicap': {name: 'opponentHandicap', title: 'Op. HC', width: 65, filterable: false, sort: 'asc', number: false},
    'opponentPartnerHandicap': {name: 'opponentPartnerHandicap', title: 'Op. Pr. HC', width: 65, filterable: false},
    'partnerHandicap': {name: 'partnerHandicap', title: 'Pr. HC', width: 65, filterable: false},
    'handicap' : {name: 'handicap', title: 'HC', width: 45 , sort: 'asc', number: false, filterable: false},
    'player' : player,
    'partner': partner,
    'opponentPartner': opponentPartner,

    'teamMemberHandicap': {name: 'teamMemberHandicap', title: 'HC', width: 45, filterable: false },
    'wins': {name: 'wins', title: 'W', width: 40, filterable: false , sort: 'asc', number: true},
    'loses': {name: 'loses', title: 'L', width: 40, filterable: false , sort: 'asc', number: true },
    'racksWon': {name: 'racksWon', title: 'RW', width: 45, filterable: false , sort: 'asc', number: true },
    'racksLost': {name: 'racksLost', title: 'RL', width: 40, filterable: false , sort: 'asc', number: true },
    'setWins': {name: 'setWins', title: 'SW', width: 50, filterable: false },
    'setLoses': {name: 'setLoses', title: 'SL', width: 50, filterable: false },
    'winPct': {name: 'winPct', title: 'PCT', width: 55, filterable: false , render: function(v,data){return (<span>{data.winPct.toFixed(3)}</span>); }},
    'rackPct': {name: 'rackPct', title: 'PCT', width: 60, filterable: false ,
        render: function(v,data){return (<span>{data.rackPct.toFixed(3)}</span>); }
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
        render: function(v,data){return (<span>{data.matchPoints == undefined ? "" : data.matchPoints.matchNum}</span>); }
    },
    'calculation':  {name: 'calculation', title: ' ', width: 95, filterable: false ,
        render: function(v,data){return (<span>{data.matchPoints == undefined ? "" : data.matchPoints.calculation}</span>); }
    },
    'winner' : {name: 'winner', title: 'Victor', width: 100, style: {minWidth: 100}, filterable: false, render: renderWinner },
    'loser' :  {name: 'loser', title: 'Opponent', width: 100, style: {minWidth: 100}, filterable: false, render: renderLoser },
    'challenger' : challenger,
    'homeTeam' : {name: 'Home', render: renderHomeTeam},
    'awayTeam' : {name: 'Away', render: renderAwayTeam},
    'challengeOpponent': challengeOpponent,
    'homeRacksAdmin' : homeRacksAdmin,
    'awayRacksAdmin' : awayRacksAdmin,
    'deleteMatch' :  {name: 'matchDelete', title: '', width: 60, style: {minWidth: 60}, render: function(v,data) {
        if (data.onDelete)
            return (<button onClick={data.onDelete(data)} type="button" className="btn btn-sm btn-danger btn-responsive team-match-delete">
                    <span className="glyphicon glyphicon-remove"></span>
                </button>
            );

        else
            return (<button type="button" className="btn btn-sm btn-danger btn-responsive team-match-delete">
                    <span className="glyphicon glyphicon-remove"></span>
                </button>
            );
    } },

};


module.exports = {columns : columns, renderOpponent: renderOpponent};

