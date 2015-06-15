formatHandicap = function(hc) {
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
    }
    return hc.replace('PLUS','+');
};

module.exports = {formatHandicap: formatHandicap};