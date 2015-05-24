var FixedDataTable = require('fixed-data-table');
var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;
var React = require('react/addons');

var winLost = function(label,dataKey) {
    return (
        <Column
            label={label}
            cellClassName="win-lost"
            width={35}
            dataKey={dataKey}
            />
    );
}

var racksFor = function(label) {
    return (
        <Column
            label={label}
            cellClassName="racks-for"
            width={35}
            dataKey={'racksFor'}
            />
    );
}

var racksAgainst= function(label) {
    return (
        <Column
            label={label}
            cellClassName="racks-for"
            width={35}
            dataKey={'racksAgainst'}
            />
    );
}


module.exports = {winLost: winLost, racksFor: racksFor, racksAgainst: rackAgainst};