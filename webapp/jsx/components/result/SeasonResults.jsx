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
var ColumnGroup = FixedDataTable.ColumnGroup;

var DataStore= require('../../stores/DataStore.jsx');
var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
var SeasonMixin = require('../../mixins/SeasonMixin.jsx');
var TeamMixin = require('../../mixins/TeamMixin.jsx');
var ResultMixin = require('../../mixins/ResultMixin.jsx');
var UserLink = require('../UserLink.jsx');
var TeamLink = require('../TeamLink.jsx');

var SeasonResults = React.createClass({
    mixins: [ResultMixin,SeasonMixin,TeamMixin,UserContextMixin,Router.State,Router.Navigation],
    render: function() {
       var tableData = [];
        this.props.matches.forEach(function(m){
            tableData.push(m);
        });
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

         var renderCell = function(cellDataKey,rowData) {
             switch(cellDataKey) {
                 case 'winner' : {
                     return rowData.winner;
                 }
                 case 'winnersTeam' : {
                     return rowData.winnersTeam;
                 }
                 case 'winnerHandicap' : {
                     return rowData.getWinnerHandicap()
                 }
                 case 'loser' : {
                     return rowData.loser;
                 }
                 case 'losersTeam' : {
                     return rowData.losersTeam;
                 }
                 case 'loserHandicap' : {
                     return rowData.getLoserHandicap()
                 }
                 case 'date' : {
                     return rowData.getShortMatchDate();
                 }
             }
             return null;
        };

        var renderHeader = function(label,cellDataKey,columnData,rowData) {
            return (<span>Players</span>)
        };

        var renderTeam = function(cellData) {
            return <TeamLink team={cellData} seasonId={this.getParams().seasonId} />
        }.bind(this);

        return (
            <Panel className='teamWeeklyResults' >
                <Table
                    groupHeaderHeight={30}
                    rowHeight={50}
                    headerHeight={30}
                    rowGetter={rowGetter}
                    rowsCount={tableData.length}
                    width={1000}
                    height={1000}
                    headerHeight={50}>
                    <ColumnGroup width={75} >
                        <Column
                        cellDataGetter={renderCell}
                        label="Date"
                        width={70}
                        dataKey={'date'}
                        />
                      </ColumnGroup>
                    <ColumnGroup width={500} label="Players">
                    <Column
                            label="Winner"
                            width={50}
                            cellRenderer={renderName}
                            dataKey={'winner'}
                            isResizable={true}
                            cellDataGetter={renderCell}
                        />
                        <Column
                            label="HC"
                            width={100}
                            cellRenderer={renderHandicap}
                            dataKey={'winnerHandicap'}
                            isResizable={false}
                            cellDataGetter={renderCell}
                        />
                    <Column
                        label="Victim"
                        width={250}
                        cellRenderer={renderName}
                        dataKey={'loser'}
                        isResizable={true}
                        cellDataGetter={renderCell}
                        />
                         <Column
                            label="HC"
                            width={100}
                            cellRenderer={renderHandicap}
                            dataKey={'loserHandicap'}
                            isResizable={false}
                            cellDataGetter={renderCell}
                        />
                    </ColumnGroup>
                    <ColumnGroup width={110} label="Teams" >
                        <Column
                            label="WT"
                            width={50}
                            cellRenderer={renderTeam}
                            dataKey={'winnersTeam'}
                            isResizable={true}
                            cellDataGetter={renderCell}
                        />
                    <Column
                        label="LT"
                        width={50}
                        cellRenderer={renderTeam}
                        dataKey={'losersTeam'}
                        isResizable={true}
                        cellDataGetter={renderCell}
                        />
                    </ColumnGroup>
                </Table>
            </Panel>
        );
 }
});

module.exports = SeasonResults;