var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Route = Router.Route
    , NotFoundRoute = Router.NotFoundRoute
    , Link = Router.Link
    , DefaultRoute = Router.DefaultRoute;
var FixedDataTable = require('fixed-data-table');

var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,ButtonGroup = Bootstrap.ButtonGroup
    ,PanelGroup = Bootstrap.PanelGroup
    ,Badge = Bootstrap.Badge
    ,Nav = Bootstrap.Nav
    ,Grid = Bootstrap.Grid
    ,Row = Bootstrap.Row
    ,Col = Bootstrap.Col
    ,MenuItem = Bootstrap.MenuItem
    ,Accordion = Bootstrap.Accordion
    ,Glyphicon = Bootstrap.Glyphicon
    ,Input = Bootstrap.Input
    ,Modal = Bootstrap.Modal
    ,OverlayMixin = Bootstrap.OverlayMixin
    ,Pager = Bootstrap.Pager
    ,PageItem = Bootstrap.PageItem
    ,ModalTrigger = Bootstrap.ModalTrigger
    ,Panel = Bootstrap.Panel;


var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;

var DataStore= require('../../stores/DataStore.jsx');
var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
var SeasonMixin = require('../../mixins/SeasonMixin.jsx');
var TeamMixin = require('../../mixins/TeamMixin.jsx');
var ResultMixin = require('../../mixins/ResultMixin.jsx');
var UserLink = require('../UserLink.jsx');


var UserResults = React.createClass({
    mixins: [ResultMixin,SeasonMixin,TeamMixin,UserContextMixin,Router.State,Router.Navigation],
    render: function() {
       var tableData = [];
        this.props.matches.forEach(function(m){
            tableData.push(m);
        });
        var renderCell = function(cellDataKey,rowData) {
            switch(cellDataKey) {
                case 'win' : {
                    return rowData.isWinner(this.getUser());
                }
                case 'opponent' : {
                    return rowData.getOpponent(this.getUser());
                }
                case 'opponentHandicap' : {
                    return rowData.getOpponentHandicap(this.getUser());
                }
                case 'rw' : {
                    return rowData.getRacks(this.getUser());
                }
                case 'rl' : {
                    return rowData.getOpponentRacks(this.getUser());
                }
                case 'date' : {
                    return rowData.getShortMatchDate();
                }
                case 'season' : {
                    return rowData.getSeason().name;
                }
            }
            return null;
        }.bind(this);

        var rowGetter = function(rowIndex) {
            return tableData[rowIndex];
        };
        var renderName = function(cellData){
            if (cellData == undefined || cellData == null) {
                return null;
            }
            return (<UserLink user={cellData} />)
        };

        var renderHandicap = function(cellData) {
            return cellData;
        };
        /*
        var renderHeader = function(label,cellDataKey,columnData,rowData) {
            return (<span>Players</span>)
        };
        */
        var renderRacks = function(cellData) {
            return cellData;
        };
        var renderWin = function(cellData) {
            return cellData == true ? 'W' : 'L';
        };

        return (
                <Table
                    groupHeaderHeight={30}
                    rowHeight={50}
                    headerHeight={30}
                    rowGetter={rowGetter}
                    rowsCount={tableData.length}
                    width={500}
                    height={500}
                    headerHeight={30}>
                    <Column
                        cellDataGetter={renderCell}
                        label="Date"
                        width={50}
                        dataKey={'date'}
                        />
                    <Column
                        cellDataGetter={renderCell}
                        label="Season"
                        width={70}
                        dataKey={'season'}
                        />
                    <Column
                            label="Opponent"
                            width={90}
                            cellRenderer={renderName}
                            dataKey={'opponent'}
                            isResizable={false}
                            cellDataGetter={renderCell}
                        />
                    <Column
                        label="HC"
                        width={30}
                        cellRenderer={renderHandicap}
                        dataKey={'opponentHandicap'}
                        isResizable={false}
                        cellDataGetter={renderCell}
                        />
                    <Column
                        label="W/L"
                        width={40}
                        cellRenderer={renderWin}
                        dataKey={'win'}
                        isResizable={false}
                        cellDataGetter={renderCell}
                        />
                    <Column
                        label="RW"
                        width={30}
                        cellRenderer={renderRacks}
                        dataKey={'rw'}
                        isResizable={false}
                        cellDataGetter={renderCell}
                        />
                    <Column
                        label="RL"
                        width={30}
                        cellRenderer={renderRacks}
                        dataKey={'rl'}
                        isResizable={false}
                        cellDataGetter={renderCell}
                        />
                </Table>
        );
 }
});

module.exports = UserResults;