var React = require('react');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var UserLink= require('../../jsx/components/links/UserLink.jsx');
var TeamLink= require('../../jsx/components/links/TeamLink.jsx');
var moment = require('moment');
var Util = require('../../jsx/util.jsx');

var UpcomingMatches = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function() {
         return {
             data: []
        }
    },
    componentWillMount: function() {
    },
    componentWillUnmount: function() {
    },
    componentDidMount: function() {
        Util.getSomeData(
            {
                url: '/api/teammatch/user/' + this.getUser().id + '/current',
                callback : function(d){this.setState({data: d});}.bind(this),
                module: 'UpComingMatches'
            }
        );
    },
    render: function() {
        var user = this.getUser();
        var rows = [];
        var now = moment().subtract(1, 'days');
        if (this.state.data.length == 0) {
            return null;
        }
        this.state.data = this.state.data.sort(function (a, b) {
            return a.matchDate.localeCompare(b.matchDate);
        });
        var cnt = 0;
        this.state.data.forEach(function (m) {
            var md = moment(m.matchDate);
            if (md.isBefore(now)) {
                return;
            }
            cnt++;
            if (cnt > 3) {
                return;
            }
            rows.push(
                <tr onClick={this.props.onClick(m.opponentTeam)} key={m.id}>
                    <td><span> {Util.formatDateTime(m.matchDate)}</span></td>
                    <td><TeamLink onClick={this.props.onClick(m.opponentTeam)} team={m.opponentTeam}/></td>
                </tr>
            );
        }.bind(this));
        if (rows.length == 0) {
            return null;
        }

        return (
                <div className="table-responsive">
                    <table className="table table-condensed table-striped table-bordered table-responsive">
                        <tbody>{rows}</tbody>
                    </table>
                </div>
        );
    }
});

module.exports = UpcomingMatches;
