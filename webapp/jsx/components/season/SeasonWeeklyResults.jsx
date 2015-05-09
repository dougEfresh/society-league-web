var React = require('react/addons');
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,ButtonGroup = Bootstrap.ButtonGroup
    ,PanelGroup = Bootstrap.PanelGroup
    ,Badge = Bootstrap.Badge
    ,Table = Bootstrap.Table
    ,Nav = Bootstrap.Nav
    ,Grid = Bootstrap.Grid
    ,Row = Bootstrap.Row
    ,Col = Bootstrap.Col
    ,MenuItem = Bootstrap.MenuItem
    ,Accordion = Bootstrap.Accordion
    ,Glyphicon = Bootstrap.Glyphicon
    ,Panel = Bootstrap.Panel;

var MatchResultsOnDay = require('./SeasonMatchResultsOnDay.jsx');

var SeasonWeeklyResults = React.createClass({
    getDefaultProps: function() {
        return {
            matches: null
        }
    },
    render: function() {
        if (this.props.matches == null) {
            return null;
        }
        var cols = [];
        var rows = [];
        for(var dt in this.props.matches) {
            cols.push(
                <Col className="teamMatchResultDay" key={dt} xs={6}>
                    <MatchResultsOnDay day={dt} matches={this.props.matches[dt]}/>
                </Col>
            );
        }
        for (var i=0; i< cols.length; i=i+2) {
            if (i+1 >= cols.length) {
                rows.push(
                    <Row key={i}>
                        {cols[i]}
                    </Row>);
            } else {
                rows.push(
                    <Row key={i}>
                        {cols[i]}
                        {cols[i+1]}
                    </Row>);
            }
        }
        return (
            <Grid>
                {rows}
            </Grid>
        );
    }
});

module.exports = SeasonWeeklyResults;