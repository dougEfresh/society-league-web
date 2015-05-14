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
var SeasonMixin = require('../../mixins/SeasonMixin.jsx');

var SeasonWeeklyResults = React.createClass({
    mixins: [SeasonMixin],
    render: function() {
        var cols = [];
        var rows = [];
        var processDate = null;
        var matches = this.getSeasonMatches(this.props.seasonId);
        var matchesOnDay = [];
        matches.forEach(function(m){
            if (processDate == null || processDate == m.matchDate) {
                matchesOnDay.push(m);
                processDate = m.matchDate;
                return;
            }
            if (processDate != m.matchDate) {
                var process = matchesOnDay;
                var d = processDate;
                cols.push(
                    <Col className="teamMatchResultDay" key={d} xs={6}>
                        <MatchResultsOnDay day={d} matches={process}/>
                    </Col>);
                matchesOnDay = [];
                processDate = m.matchDate;
                return;
            }

        });
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