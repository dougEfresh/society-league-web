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
                    return rowData.isWinner(this.getParams().userId);
                }
                case 'opponent' : {
                    return rowData.getOpponent(this.getParams().userId);
                }
                case 'opponentHandicap' : {
                    return rowData.getOpponentHandicap(this.getParams().userId);
                }
                case 'rw' : {
                    return rowData.getRacks(this.getParams().userId);
                }
                case 'rl' : {
                    return rowData.getOpponentRacks(this.getParams().userId);
                }
                case 'date' : {
                    return rowData.getShortMatchDate();
                }
                case 'season' : {
                    return rowData.getSeason().name;
                }
            }
            return null;
        };

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
            <Panel className='userResults' >
                <Table
                    groupHeaderHeight={30}
                    rowHeight={50}
                    headerHeight={30}
                    rowGetter={rowGetter}
                    rowsCount={tableData.length}
                    width={800}
                    height={768}
                    headerHeight={50}>
                    <Column
                        cellDataGetter={renderCell}
                        label="Date"
                        width={70}
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
                            width={50}
                            cellRenderer={renderName}
                            dataKey={'opponent'}
                            isResizable={true}
                            cellDataGetter={renderCell}
                        />
                        <Column
                            label="HC"
                            width={100}
                            cellRenderer={renderHandicap}
                            dataKey={'opponentHandicap'}
                            isResizable={false}
                            cellDataGetter={renderCell}
                        />
                        <Column
                            label="W"
                            width={50}
                            cellRenderer={renderWin}
                            dataKey={'win'}
                            isResizable={true}
                            cellDataGetter={renderCell}
                        />
                    <Column
                        label="RW"
                        width={50}
                        cellRenderer={renderRacks}
                        dataKey={'rw'}
                        isResizable={true}
                        cellDataGetter={renderCell}
                        />
                    <Column
                        label="RL"
                        width={50}
                        cellRenderer={renderRacks}
                        dataKey={'rl'}
                        isResizable={true}
                        cellDataGetter={renderCell}
                        />
                </Table>
            </Panel>
        );
 }
});

module.exports = UserResults;