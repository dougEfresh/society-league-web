var React = require('react/addons');
var UserLink = require('../jsx/components/links/UserLink.jsx');
var TeamLink = require('../jsx/components/links/TeamLink.jsx');
var sorty = require('sorty');

var renderOpponent=function(v,data,cp) {
    return <UserLink onClick={data.opponent.onClick} user={data.opponent} season={data.season} />};
var renderOpponentTeam=function(v,data,cp) {
    return <TeamLink onClick={data.opponentTeam.onClick} team={data.opponentTeam}  />};

var renderTeam=function(v,data,cp) {
    return <TeamLink onClick={data.team.onClick} team={data.team}  />};


var renderPartner=function(v,data,cp) {
    if (!data.partner) {
        return <span></span>
    }
    return <UserLink onClick={data.partner.onClick} user={data.partner} season={data.season} />
};
var renderOpponentPartner=function(v,data,cp) {
    if (!data.opponentPartner) {
        return <span></span>
    }
    return <UserLink onClick={data.opponentPartner.onClick} user={data.opponentPartner} season={data.season} />
};

var opponent = function() {
    if (window.isMobile)
        return {
            name: 'opponent', title: 'Opponent', flex: 1, style: {minWidth: 100}, width: 100, filterable: false,
            render: renderOpponent
        }

    return {
            name: 'opponent', title: 'Opponent', flex: 1, style: {minWidth: 100}, filterable: false,
            render: renderOpponent
        }
};

var opponentTeam = function() {
    if (window.isMobile)
        return {
            name: 'opponentTeam', title: 'Op. Team', flex: 1, style: {minWidth: 100}, width: 100, filterable: false,
            render: renderOpponentTeam
        }

    return  {
        name: 'opponentTeam', title: 'Op. Team', flex: 1, style: {minWidth: 100},filterable: false,
        render: renderOpponentTeam
    }
};

var columns = {
    'playerMatchDate': {name: 'date', title: 'Date', width: 60, filterable: false},
    'result': {
        name: 'result', title: 'W/L', width: 45,  filterable: false, render: function (v, data, cp) {
            if (data.win) {
                cp.className = cp.className + " win";
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
    'opponentMobile': {
        name: 'opponent', title: 'Opponent', flex: 1, style: {minWidth: 100},
        width: 100,
        render: renderOpponent
    },
    'opponent': opponent,
    'opponentTeam': opponentTeam,
    'team': {
        name: 'team', title: 'Team', flex: 1, style: {minWidth: 100},filterable: false,
        render: renderTeam
    },

    'teamMobile': {
        name: 'team', title: 'Team', flex: 1, style: {minWidth: 100}, width: 100, filterable: false,
        render: renderTeam
    },

    'opponentTeamMobile': {
        name: 'opponentTeam', title: 'Op. Team', flex: 1, width:  100, style: {minWidth: 100},filterable: false,
        render: renderOpponentTeam
    },
    'opponentHandicap': {name: 'opponentHandicap', title: 'Op. HC', width: 65, filterable: false},
    'opponentPartnerHandicap': {name: 'opponentPartnerHandicap', title: 'Op. Pr. HC', width: 65, filterable: false},
    'partnerHandicap': {name: 'partnerHandicap', title: 'Pr. HC', width: 65, filterable: false},

    'partner': {name: 'partner', title: 'Pr.', flex: 1, style: {minWidth: 100}, filterable: false, render: renderPartner},
    'partnerMobile': {name: 'partner', title: 'Partner', width: 100, flex: 1, style: {minWidth: 100},filterable: false, render: renderPartner},
    'opponentPartnerMobile': {name: 'opponentPartner', width: 100, title: 'Op. Pr.', flex: 1, style: {minWidth: 100},filterable: false, render: renderOpponentPartner},

    'opponentPartner': {name: 'opponentPartner', title: 'Op. Pr.', flex: 1, style: {minWidth: 100},filterable: false, render: renderOpponentPartner},

    'teamMemberHandicap': {name: 'teamMemberHandicap', title: 'HC', width: 45, filterable: false },
    'wins': {name: 'wins', title: 'W', width: 50, filterable: false },
    'loses': {name: 'loses', title: 'L', width: 50, filterable: false },
    'racksWon': {name: 'racksWon', title: 'RW', width: 50, filterable: false },
    'racksLost': {name: 'racksLost', title: 'RL', width: 50, filterable: false },
    'setWins': {name: 'setWins', title: 'SW', width: 50, filterable: false },
    'setLoses': {name: 'setLoses', title: 'SL', width: 50, filterable: false },
    'winPct': {name: 'winPct', title: 'PCT', width: 55, filterable: false , render: function(v,data){return (<span>{data.winPct.toFixed(3)}</span>); }},
     'rackPct': {name: 'rackPct', title: 'PCT', width: 60, filterable: false ,
        render: function(v,data){return (<span>{data.rackPct.toFixed(3)}</span>); }
    },
    'points': {name: 'points', title: 'P', width: 50, filterable: false ,
        render: function(v,data){return (<span>{data.matchPoints == undefined ? 0 : data.matchPoints.points}</span>); }
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

