var React = require('react/addons');
var Router = require('react-router');
var MatchResultsOnDay = require('./SeasonMatchResultsOnDay.jsx');
var SeasonMixin = require('../../jsx/mixins/SeasonMixin.jsx');

var SeasonWeeklyResults = React.createClass({
    mixins: [SeasonMixin,Router.State],
    render: function() {
        var cols = [];
        var rows = [];
        var processDate = null;
        var matches = this.getSeasonMatches(this.getParams().seasonId);
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