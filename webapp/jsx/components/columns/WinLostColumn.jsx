var FixedDataTable = require('fixed-data-table');
var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;
var React = require('react/addons');

var WinLostColumn = function(label,dataKey) {
    return (
        <Column
            label={label}
            cellClassName="win-lost"
            width={35}
            dataKey={dataKey}
            />
    );
}

module.exports = WinLostColumn;