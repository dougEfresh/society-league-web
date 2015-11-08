var React = require('react/addons');
var UserLink = require('../jsx/components/links/UserLink.jsx');
var TeamLink = require('../jsx/components/links/TeamLink.jsx');


var renderPlayer=function(v,data,cp) {
    cp.className="user";
    return <UserLink onClick={data.user.onClick} user={data.user} season={data.season} />
};

var renderOpponent=function(v,data,cp) {
    cp.className="user";
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
            render: renderOpponent
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
            render: renderTeam
};

var player =  {
    name: '',
    //title: <span className="glyphicon  glyphicon-sort-by-alphabet"> Player </span>, flex: 1,
    title: <span className=""> Player </span>, flex: 1,
    style: {minWidth: 100}, filterable: false,
    render: renderPlayer,
    sort: 'asc'
};

var columns = {
    'playerMatchDate': {name: 'date', title: 'Date', width: 60, filterable: false},
    'rank' : {name: 'rank' , title: '#', width: 40, filterable: false, render: function(v,d,cp) {return <span>{d.rank ? d.rank : "0"}</span>}},
    'result': {
        name: 'result', title: 'W/L', width: 45,  filterable: false, render: function (v, data, cp) {
            if (data.win) {
                cp.className = cp.className + " win-result";
            }
            return <span>{data.result}</span>
        }
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
    'opponentHandicap': {name: 'opponentHandicap', title: 'Op. HC', width: 65, filterable: false},
    'opponentPartnerHandicap': {name: 'opponentPartnerHandicap', title: 'Op. Pr. HC', width: 65, filterable: false},
    'partnerHandicap': {name: 'partnerHandicap', title: 'Pr. HC', width: 65, filterable: false},
    'handicap' : {name: 'handicap', title: 'HC', width: 45 ,filterable: false},
    'player' : player,
    'partner': partner,
    'opponentPartner': opponentPartner,

    'teamMemberHandicap': {name: 'teamMemberHandicap', title: 'HC', width: 45, filterable: false },
    'wins': {name: 'wins', title: 'W', width: 40, filterable: false },
    'loses': {name: 'loses', title: 'L', width: 40, filterable: false },
    'racksWon': {name: 'racksWon', title: 'RW', width: 45, filterable: false },
    'racksLost': {name: 'racksLost', title: 'RL', width: 40, filterable: false },
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
    }

};


module.exports = {columns : columns, renderOpponent: renderOpponent};

