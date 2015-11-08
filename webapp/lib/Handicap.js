var formatHandicap = function(hc) {
    if (hc == undefined || hc == null)
    return "";

    switch(hc) {
        case 'TWO':
            return '2';
        case 'THREE':
            return '3';
        case 'FOUR':
            return '4';
        case 'FIVE':
            return '5';
        case 'SIX':
            return '6';
        case 'SEVEN':
            return '7';
        case 'EIGHT':
            return '8';
        case 'NINE':
            return '9';
        case 'OPEN':
            return 'O';
        case 'PRO':
            return 'P';
        case 'UNKNOWN':
            return "";
    }
    return hc.replace('PLUS','+');
};
var handicaps = [
        'D',
        'DPLUS',
        'C',
        'CPLUS',
        'B',
        'BPLUS',
        'A',
        'APLUS',
        'OPEN',
        'OPENPLUS',
        'PRO'
];

var handicapOrder = [
        'D',
        'D+',
        'C',
        'C+',
        'B',
        'B+',
        'A',
        'A+',
        'OPEN',
        'OPEN+',
        'P'
].reverse();

var raceChart = {
    D: {
        D: '0/7',
        DPLUS: '1/7',
        C: '2/7',
        CPLUS: '3/8',
        B: '4/9',
        BPLUS: '5/10',
        A: '6/11',
        APLUS: '7/11',
        OPEN: '7/10',
        OPENPLUS: '8/10',
        PRO: '9/11'
    },
    'DPLUS' : {
        'D': '1/7',
        'DPLUS': '0/7',
        'C': '1/7',
        'CPLUS': '2/7',
        'B': '3/8',
        'BPLUS': '4/9',
        'A': '5/10',
        'APLUS': '6/10',
        'OPEN': '7/11',
        'OPENPLUS': '7/10',
        'PRO': '8/10'
    },
'C' : {
    'D': '2/7',
    'DPLUS': '1/7',
    'C': '0/7',
    'CPLUS': '1/7',
    'B': '2/7',
    'BPLUS': '3/8',
    'A': '4/9',
    'APLUS': '5/10',
    'OPEN': '6/11',
    'OPENPLUS': '7/11',
    'PRO': '8/11'
},
'CPLUS' : {
    'D': '3/8',
    'DPLUS': '2/7',
    'C': '1/7',
    'CPLUS': '0/7',
    'B': '1/7',
    'BPLUS': '2/7',
    'A': '3/8',
    'APLUS': '4/9',
    'OPEN': '5/10',
    'OPENPLUS': '6/11',
    'PRO': '6/10'
},
'B' : {
    'D': '4/9',
    'DPLUS': '3/8',
    'C': '2/7',
    'CPLUS': '1/7',
    'B': '0/7',
    'BPLUS': '1/7',
    'A': '2/7',
    'APLUS': '3/8',
    'OPEN': '4/9',
    'OPENPLUS': '5/10',
    'PRO': '6/11'
},
'BPLUS' : {
    'D': '5/10',
    'DPLUS': '4/9',
    'C': '3/8',
    'CPLUS': '2/8',
    'B': '1/7',
    'BPLUS': '0/7',
    'A': '2/8',
    'APLUS': '3/8',
    'OPEN': '4/9',
    'OPENPLUS': '5/10',
    'PRO': '0/7'
},
'A' : {
    'D': '0/7',
    'DPLUS': '1/7',
    'C': '0/7',
    'CPLUS': '0/7',
    'B': '2/7',
    'BPLUS': '0/7',
    'A': '0/7',
    'APLUS': '0/7',
    'OPEN': '0/7',
    'OPENPLUS': '0/7',
    'PRO': '0/7'
},
'APLUS' : {    'D': '0,7',
    'DPLUS': '1,7',
    'C': '0,7',
    'CPLUS': '0,7',
    'B': '0,7',
    'BPLUS': '0,7',
    'A': '0,7',
    'APLUS': '0,7',
    'OPEN': '0,7',
    'OPENPLUS': '0,7',
    'PRO': '0,7'
},
'OPEN' : {
    'D': '0/7',
    'DPLUS': '1/7',
    'C': '0/7',
    'CPLUS': '0/7',
    'B': '0/7',
    'BPLUS': '0/7',
    'A': '0/7',
    'APLUS': '0/7',
    'OPEN': '0/7',
    'OPENPLUS': '0/7',
    'PRO': '0/7'
},
'OPENPLUS' : {
    'D': '0/7',
    'DPLUS': '1/7',
    'C': '0/7',
    'CPLUS': '0/7',
    'B': '0/7',
    'BPLUS': '0/7',
    'A': '0/7',
    'APLUS': '0/7',
    'OPEN': '0/7',
    'OPENPLUS': '0/7',
    'PRO': '0/7'
},
    'PRO' : {
    'D': '0/7',
    'DPLUS': '1/7',
    'C': '0/7',
    'CPLUS': '0/7',
    'B': '0/7',
    'BPLUS': '0/7',
    'A': '0/7',
    'APLUS': '0/7',
    'OPEN': '0/7',
    'OPENPLUS': '0/7',
    'PRO': '0/7'
}
};



var race = function(hc1,hc2) {
    if (hc1 == null || hc1 == undefined || hc2 == undefined || hc2 == null)
        return "";
    if (raceChart[hc1] == undefined)
        return "";


    var r = raceChart[hc1][hc2];
    if (r == undefined || r == null)
        return "";

    if (r.indexOf('0/') == 0)
     return r.substr(2,1);

    return r;
};


module.exports = {handicapOrder: handicapOrder ,formatHandicap: formatHandicap, race: race, handicaps: handicaps};
