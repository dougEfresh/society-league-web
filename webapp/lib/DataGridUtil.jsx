var React = require('react/addons');
var UserLink = require('../jsx/components/links/UserLink.jsx');
var sorty = require('sorty');

var renderOpponent=function(v,data,cp) {
    return <UserLink onClick={data.opponent.onClick} user={data.opponent} season={data.season} />};
var renderOpponentTeam=function(v,data,cp) {
    return <TeamLink onClick={data.opponentTeam.onClick} team={data.opponentTeam}  />};

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
    'opponentMobile': {
        name: 'opponent', title: 'Opponent', flex: 1, style: {minWidth: 100},
        width: 100,
        render: renderOpponent
    },
    'opponent': {
        name: 'opponent', title: 'Opponent', flex: 1, style: {minWidth: 100},filterable: false,
        render: renderOpponent
    },
    'opponentHandicap': {name: 'opponentHandicap', title: 'Op. HC', width: 65, filterable: false},
    'teamMemberHandicap': {name: 'teamMemberHandicap', title: 'HC', width: 45, filterable: false }
};


module.exports = {columns : columns, renderOpponent: renderOpponent};

